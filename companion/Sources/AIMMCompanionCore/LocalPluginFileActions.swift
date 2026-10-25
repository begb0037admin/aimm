import CryptoKit
import Foundation

public struct LocalPluginFileActionResult: Equatable, Sendable {
    public let operationID: String
    public let state: String
    public let sourcePath: String
    public let destinationPath: String
    public let treeDigest: String
    public let replay: Bool
}

public enum LocalPluginFileActionError: Error, LocalizedError, Equatable {
    case invalidRequest
    case sourceUnavailable
    case destinationUnavailable
    case destinationAlreadyExists
    case pathIsSymlink
    case unsupportedFilesystemEntry
    case itemChanged
    case recoveryRequired
    case operationAlreadyFailed
    case ioFailure(String)

    public var errorDescription: String? {
        switch self {
        case .invalidRequest: "The local file-action request is incomplete or unsafe."
        case .sourceUnavailable: "The plug-in item is no longer available."
        case .destinationUnavailable: "The selected Unused folder is unavailable or not writable."
        case .destinationAlreadyExists: "An item with this name already exists in Unused. No files were changed."
        case .pathIsSymlink: "A source or destination is a symbolic link. No files were changed."
        case .unsupportedFilesystemEntry: "The item contains a file type this move cannot verify."
        case .itemChanged: "The item changed after preview. Request a fresh action."
        case .recoveryRequired: "A previous move stopped part-way. The original and destination were preserved for recovery."
        case .operationAlreadyFailed: "This file action already failed. Create a fresh preview and operation to retry it."
        case .ioFailure(let message): "The local file action could not be completed: \(message)"
        }
    }
}

/// A journaled, reversible, one-item move. Cross-volume moves retain the source
/// until the copied destination has been independently verified and that fact
/// has been durably recorded in SQLite.
public enum LocalPluginFileActions {
    private static let operationPattern = try! NSRegularExpression(
        pattern: #"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"#,
        options: .caseInsensitive
    )

    public static func moveToUnused(operationID: String, generationID: String, recordID: String,
                                    source: URL, unusedDirectory: URL, journal: ScanJournal,
                                    expectedTreeDigest: String? = nil,
                                    expectedDestinationPath: String? = nil,
                                    fileManager: FileManager = .default,
                                    now: Date = Date()) throws -> LocalPluginFileActionResult {
        guard validUUID(operationID), validUUID(generationID), validUUID(recordID) else {
            throw LocalPluginFileActionError.invalidRequest
        }
        let sourceURL = source.standardizedFileURL
        let unusedURL = unusedDirectory.standardizedFileURL
        let sourcePath = sourceURL.path
        let destinationURL = unusedURL.appending(path: sourceURL.lastPathComponent).standardizedFileURL
        let destinationPath = destinationURL.path
        guard expectedDestinationPath == nil || expectedDestinationPath == destinationPath,
              expectedTreeDigest == nil || expectedTreeDigest?.range(of: "^[0-9a-f]{64}$", options: .regularExpression) != nil else {
            throw LocalPluginFileActionError.itemChanged
        }
        guard sourceURL.lastPathComponent != ".", sourcePath != "/",
              sourcePath != unusedURL.path,
              !isWithin(sourcePath, directory: unusedURL.path),
              !isWithin(unusedURL.path, directory: sourcePath),
              destinationURL.deletingLastPathComponent().path == unusedURL.path else {
            throw LocalPluginFileActionError.invalidRequest
        }

        let stamp = ISO8601DateFormatter().string(from: now)
        let stagingURL = unusedURL.appending(path: ".aimm-\(operationID).partial").standardizedFileURL
        var entry = try journal.fileAction(operationID: operationID)
        if let existing = entry {
            guard existing.generationID == generationID, existing.recordID == recordID,
                  existing.kind == "move_to_unused", existing.sourcePath == sourcePath,
                  existing.destinationPath == destinationPath,
                  expectedTreeDigest == nil || expectedTreeDigest == existing.treeDigest else {
                throw ScanJournalError.execute("operation ID is already bound to different file-action details")
            }
            if existing.state == "failed" { throw LocalPluginFileActionError.operationAlreadyFailed }
            if existing.state == "completed" {
                guard !fileManager.fileExists(atPath: sourcePath),
                      fileManager.fileExists(atPath: destinationPath),
                      try treeDigest(destinationURL, fileManager: fileManager) == existing.treeDigest else {
                    try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                    throw LocalPluginFileActionError.recoveryRequired
                }
                return result(existing, replay: true)
            }
        } else {
            // A pre-existing destination is never treated as the result of this
            // operation, even when it happens to have identical bytes.
            try validateItem(sourceURL, fileManager: fileManager)
            try validateDirectory(unusedURL, fileManager: fileManager)
            guard !fileManager.fileExists(atPath: destinationPath),
                  !fileManager.fileExists(atPath: stagingURL.path) else {
                throw LocalPluginFileActionError.destinationAlreadyExists
            }
            let digest = try treeDigest(sourceURL, fileManager: fileManager)
            guard expectedTreeDigest == nil || expectedTreeDigest == digest else {
                throw LocalPluginFileActionError.itemChanged
            }
            entry = try journal.prepareFileAction(
                operationID: operationID, generationID: generationID, recordID: recordID,
                kind: "move_to_unused", sourcePath: sourcePath, destinationPath: destinationPath,
                treeDigest: digest, now: stamp
            )
        }
        guard let action = entry else { throw ScanJournalError.step("file action was not saved") }

        try validateDirectory(unusedURL, fileManager: fileManager)
        let sourceExists = fileManager.fileExists(atPath: sourcePath)
        let destinationExists = fileManager.fileExists(atPath: destinationPath)
        let stagingExists = fileManager.fileExists(atPath: stagingURL.path)

        if !sourceExists, destinationExists {
            guard try treeDigest(destinationURL, fileManager: fileManager) == action.treeDigest else {
                try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            try journal.markFileActionDestinationVerified(operationID: operationID, updatedAt: stamp)
            try journal.setFileActionState(operationID: operationID, state: "completed", updatedAt: stamp)
            return result(action, replay: true)
        }
        guard sourceExists else {
            try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try validateItem(sourceURL, fileManager: fileManager)
        guard try treeDigest(sourceURL, fileManager: fileManager) == action.treeDigest else {
            try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.itemChanged
        }

        if destinationExists {
            guard action.destinationVerified,
                  try treeDigest(destinationURL, fileManager: fileManager) == action.treeDigest else {
                try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            // The durable marker proves this operation verified the destination
            // before a crash. Both current copies are checked again before source removal.
            try fileManager.removeItem(at: sourceURL)
            try journal.setFileActionState(operationID: operationID, state: "completed", updatedAt: stamp)
            return result(action, replay: true)
        }

        if stagingExists {
            // A matching operation-specific staging tree can only be advanced
            // after checking both the preserved source and staged copy.
            guard try treeDigest(stagingURL, fileManager: fileManager) == action.treeDigest else {
                try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            try finishVerifiedCopy(stagingURL, sourceURL: sourceURL, destinationURL: destinationURL,
                                  operationID: operationID, expectedDigest: action.treeDigest,
                                  journal: journal, fileManager: fileManager, stamp: stamp)
            return result(action, replay: true)
        }

        do {
            try fileManager.moveItem(at: sourceURL, to: destinationURL)
            guard !fileManager.fileExists(atPath: sourcePath),
                  try treeDigest(destinationURL, fileManager: fileManager) == action.treeDigest else {
                try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            try journal.markFileActionDestinationVerified(operationID: operationID, updatedAt: stamp)
            try journal.setFileActionState(operationID: operationID, state: "completed", updatedAt: stamp)
            return result(action, replay: false)
        } catch let actionError as LocalPluginFileActionError {
            throw actionError
        } catch {
            guard fileManager.fileExists(atPath: sourcePath),
                  !fileManager.fileExists(atPath: destinationPath),
                  !fileManager.fileExists(atPath: stagingURL.path) else {
                try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            do {
                try fileManager.copyItem(at: sourceURL, to: stagingURL)
                guard try treeDigest(stagingURL, fileManager: fileManager) == action.treeDigest,
                      try treeDigest(sourceURL, fileManager: fileManager) == action.treeDigest else {
                    try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                    throw LocalPluginFileActionError.recoveryRequired
                }
                try finishVerifiedCopy(stagingURL, sourceURL: sourceURL, destinationURL: destinationURL,
                                      operationID: operationID, expectedDigest: action.treeDigest,
                                      journal: journal, fileManager: fileManager, stamp: stamp)
                return result(action, replay: false)
            } catch let actionError as LocalPluginFileActionError {
                throw actionError
            } catch {
                try? journal.setFileActionState(operationID: operationID, state: "needs_recovery",
                                                updatedAt: ISO8601DateFormatter().string(from: Date()))
                throw LocalPluginFileActionError.ioFailure(error.localizedDescription)
            }
        }
    }

    /// Restores an item from Unused to the exact source recorded by a previous
    /// completed, verified move. The caller must obtain owner confirmation and
    /// pass the preview-bound digest before invoking this local executor.
    public static func restoreFromUnused(operationID: String, parentMoveOperationID: String,
                                         generationID: String, recordID: String,
                                         unusedDirectory: URL, journal: ScanJournal,
                                         expectedTreeDigest: String,
                                         expectedDestinationPath: String? = nil,
                                         fileManager: FileManager = .default,
                                         now: Date = Date()) throws -> LocalPluginFileActionResult {
        guard validUUID(operationID), validUUID(parentMoveOperationID),
              operationID != parentMoveOperationID,
              validUUID(generationID), validUUID(recordID),
              expectedTreeDigest.range(of: "^[0-9a-f]{64}$", options: .regularExpression) != nil,
              let original = try journal.fileAction(operationID: parentMoveOperationID),
              original.kind == "move_to_unused", original.state == "completed",
              original.destinationVerified, original.generationID == generationID,
              original.recordID == recordID else {
            throw LocalPluginFileActionError.invalidRequest
        }
        let unusedURL = unusedDirectory.standardizedFileURL
        let sourceURL = URL(fileURLWithPath: original.destinationPath).standardizedFileURL
        let destinationURL = URL(fileURLWithPath: original.sourcePath).standardizedFileURL
        let sourcePath = sourceURL.path
        let destinationPath = destinationURL.path
        guard original.treeDigest == expectedTreeDigest,
              expectedDestinationPath == nil || expectedDestinationPath == destinationPath,
              sourceURL.deletingLastPathComponent().path == unusedURL.path,
              destinationURL.lastPathComponent == sourceURL.lastPathComponent,
              !isWithin(destinationPath, directory: unusedURL.path),
              !isWithin(unusedURL.path, directory: destinationPath),
              sourcePath != destinationPath else {
            throw LocalPluginFileActionError.itemChanged
        }
        // Recheck this parent on every attempt, including recovery. A valid
        // journal entry must not let a swapped symlink redirect the Unused path.
        try validateDirectory(unusedURL, fileManager: fileManager)

        let stamp = ISO8601DateFormatter().string(from: now)
        let stagingURL = destinationURL.deletingLastPathComponent()
            .appending(path: ".aimm-restore-\(operationID).partial").standardizedFileURL
        var action = try journal.restoreAction(operationID: operationID)
        if let existing = action {
            guard existing.parentOperationID == parentMoveOperationID,
                  existing.generationID == generationID, existing.recordID == recordID,
                  existing.sourcePath == sourcePath, existing.destinationPath == destinationPath,
                  existing.treeDigest == expectedTreeDigest else {
                throw ScanJournalError.execute("restore operation ID is already bound to different file-action details")
            }
            if existing.state == "failed" { throw LocalPluginFileActionError.operationAlreadyFailed }
            if existing.state == "completed" {
                guard !fileManager.fileExists(atPath: sourcePath),
                      fileManager.fileExists(atPath: destinationPath),
                      try treeDigest(destinationURL, fileManager: fileManager) == expectedTreeDigest else {
                    try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                    throw LocalPluginFileActionError.recoveryRequired
                }
                return result(existing, replay: true)
            }
        } else {
            guard try journal.restoreActionForParent(parentOperationID: parentMoveOperationID) == nil else {
                throw ScanJournalError.execute("this Unused move already has a restore operation")
            }
            try validateItem(sourceURL, fileManager: fileManager)
            try validateDirectory(unusedURL, fileManager: fileManager)
            try validateDirectory(destinationURL.deletingLastPathComponent(), fileManager: fileManager)
            guard !fileManager.fileExists(atPath: destinationPath),
                  !fileManager.fileExists(atPath: stagingURL.path),
                  try treeDigest(sourceURL, fileManager: fileManager) == expectedTreeDigest else {
                throw LocalPluginFileActionError.itemChanged
            }
            action = try journal.prepareRestoreAction(
                operationID: operationID, parentOperationID: parentMoveOperationID,
                generationID: generationID, recordID: recordID, sourcePath: sourcePath,
                destinationPath: destinationPath, treeDigest: expectedTreeDigest, now: stamp
            )
        }
        guard let action else { throw ScanJournalError.step("restore action was not saved") }

        try validateDirectory(destinationURL.deletingLastPathComponent(), fileManager: fileManager)
        let sourceExists = fileManager.fileExists(atPath: sourcePath)
        let destinationExists = fileManager.fileExists(atPath: destinationPath)
        let stagingExists = fileManager.fileExists(atPath: stagingURL.path)

        if !sourceExists, destinationExists {
            guard try treeDigest(destinationURL, fileManager: fileManager) == expectedTreeDigest else {
                try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            try journal.markRestoreDestinationVerified(operationID: operationID, updatedAt: stamp)
            try journal.setRestoreActionState(operationID: operationID, state: "completed", updatedAt: stamp)
            return result(action, replay: true)
        }
        guard sourceExists else {
            try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try validateItem(sourceURL, fileManager: fileManager)
        guard try treeDigest(sourceURL, fileManager: fileManager) == expectedTreeDigest else {
            try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.itemChanged
        }

        if destinationExists {
            guard action.destinationVerified,
                  try treeDigest(destinationURL, fileManager: fileManager) == expectedTreeDigest else {
                try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            try fileManager.removeItem(at: sourceURL)
            try journal.setRestoreActionState(operationID: operationID, state: "completed", updatedAt: stamp)
            return result(action, replay: true)
        }

        if stagingExists {
            guard try treeDigest(stagingURL, fileManager: fileManager) == expectedTreeDigest else {
                try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            try finishVerifiedRestoreCopy(stagingURL, sourceURL: sourceURL, destinationURL: destinationURL,
                                          operationID: operationID, expectedDigest: expectedTreeDigest,
                                          journal: journal, fileManager: fileManager, stamp: stamp)
            return result(action, replay: true)
        }

        do {
            try fileManager.moveItem(at: sourceURL, to: destinationURL)
            guard !fileManager.fileExists(atPath: sourcePath),
                  try treeDigest(destinationURL, fileManager: fileManager) == expectedTreeDigest else {
                try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            try journal.markRestoreDestinationVerified(operationID: operationID, updatedAt: stamp)
            try journal.setRestoreActionState(operationID: operationID, state: "completed", updatedAt: stamp)
            return result(action, replay: false)
        } catch let actionError as LocalPluginFileActionError {
            throw actionError
        } catch {
            guard fileManager.fileExists(atPath: sourcePath),
                  !fileManager.fileExists(atPath: destinationPath),
                  !fileManager.fileExists(atPath: stagingURL.path) else {
                try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                throw LocalPluginFileActionError.recoveryRequired
            }
            do {
                try fileManager.copyItem(at: sourceURL, to: stagingURL)
                guard try treeDigest(stagingURL, fileManager: fileManager) == expectedTreeDigest,
                      try treeDigest(sourceURL, fileManager: fileManager) == expectedTreeDigest else {
                    try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
                    throw LocalPluginFileActionError.recoveryRequired
                }
                try finishVerifiedRestoreCopy(stagingURL, sourceURL: sourceURL, destinationURL: destinationURL,
                                              operationID: operationID, expectedDigest: expectedTreeDigest,
                                              journal: journal, fileManager: fileManager, stamp: stamp)
                return result(action, replay: false)
            } catch let actionError as LocalPluginFileActionError {
                throw actionError
            } catch {
                try? journal.setRestoreActionState(operationID: operationID, state: "needs_recovery",
                                                   updatedAt: ISO8601DateFormatter().string(from: Date()))
                throw LocalPluginFileActionError.ioFailure(error.localizedDescription)
            }
        }
    }

    private static func finishVerifiedRestoreCopy(_ stagingURL: URL, sourceURL: URL, destinationURL: URL,
                                                  operationID: String, expectedDigest: String,
                                                  journal: ScanJournal, fileManager: FileManager,
                                                  stamp: String) throws {
        guard fileManager.fileExists(atPath: sourceURL.path),
              !fileManager.fileExists(atPath: destinationURL.path),
              try treeDigest(sourceURL, fileManager: fileManager) == expectedDigest,
              try treeDigest(stagingURL, fileManager: fileManager) == expectedDigest else {
            try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try fileManager.moveItem(at: stagingURL, to: destinationURL)
        guard try treeDigest(destinationURL, fileManager: fileManager) == expectedDigest,
              try treeDigest(sourceURL, fileManager: fileManager) == expectedDigest else {
            try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try journal.markRestoreDestinationVerified(operationID: operationID, updatedAt: stamp)
        guard try treeDigest(destinationURL, fileManager: fileManager) == expectedDigest,
              try treeDigest(sourceURL, fileManager: fileManager) == expectedDigest else {
            try journal.setRestoreActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try fileManager.removeItem(at: sourceURL)
        try journal.setRestoreActionState(operationID: operationID, state: "completed", updatedAt: stamp)
    }

    public static func previewDestination(source: URL, unusedDirectory: URL,
                                          fileManager: FileManager = .default) throws -> URL {
        let sourceURL = source.standardizedFileURL
        let unusedURL = unusedDirectory.standardizedFileURL
        guard sourceURL.lastPathComponent != ".", sourceURL.path != "/",
              sourceURL.path != unusedURL.path,
              !isWithin(sourceURL.path, directory: unusedURL.path),
              !isWithin(unusedURL.path, directory: sourceURL.path) else {
            throw LocalPluginFileActionError.invalidRequest
        }
        try validateItem(sourceURL, fileManager: fileManager)
        try validateDirectory(unusedURL, fileManager: fileManager)
        let destination = unusedURL.appending(path: sourceURL.lastPathComponent).standardizedFileURL
        guard destination.deletingLastPathComponent().path == unusedURL.path else {
            throw LocalPluginFileActionError.invalidRequest
        }
        guard !fileManager.fileExists(atPath: destination.path) else {
            throw LocalPluginFileActionError.destinationAlreadyExists
        }
        return destination
    }

    private static func finishVerifiedCopy(_ stagingURL: URL, sourceURL: URL, destinationURL: URL,
                                           operationID: String, expectedDigest: String, journal: ScanJournal,
                                           fileManager: FileManager, stamp: String) throws {
        guard fileManager.fileExists(atPath: sourceURL.path),
              !fileManager.fileExists(atPath: destinationURL.path),
              try treeDigest(sourceURL, fileManager: fileManager) == expectedDigest,
              try treeDigest(stagingURL, fileManager: fileManager) == expectedDigest else {
            try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try fileManager.moveItem(at: stagingURL, to: destinationURL)
        guard try treeDigest(destinationURL, fileManager: fileManager) == expectedDigest,
              try treeDigest(sourceURL, fileManager: fileManager) == expectedDigest else {
            try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try journal.markFileActionDestinationVerified(operationID: operationID, updatedAt: stamp)
        // Recheck both sides immediately before deleting the source copy.
        guard try treeDigest(destinationURL, fileManager: fileManager) == expectedDigest,
              try treeDigest(sourceURL, fileManager: fileManager) == expectedDigest else {
            try journal.setFileActionState(operationID: operationID, state: "needs_recovery", updatedAt: stamp)
            throw LocalPluginFileActionError.recoveryRequired
        }
        try fileManager.removeItem(at: sourceURL)
        try journal.setFileActionState(operationID: operationID, state: "completed", updatedAt: stamp)
    }

    public static func treeDigest(_ root: URL, fileManager: FileManager = .default) throws -> String {
        try validateItem(root, fileManager: fileManager)
        var entries: [(String, URL, Bool)] = []
        func collect(_ path: String, relativePath: String) throws {
            let attributes: [FileAttributeKey: Any]
            do { attributes = try fileManager.attributesOfItem(atPath: path) }
            catch { throw LocalPluginFileActionError.ioFailure(error.localizedDescription) }
            guard let type = attributes[.type] as? FileAttributeType else {
                throw LocalPluginFileActionError.unsupportedFilesystemEntry
            }
            let url = URL(fileURLWithPath: path, isDirectory: type == .typeDirectory)
            switch type {
            case .typeSymbolicLink:
                throw LocalPluginFileActionError.pathIsSymlink
            case .typeDirectory:
                guard fileManager.isReadableFile(atPath: path) else { throw LocalPluginFileActionError.sourceUnavailable }
                entries.append((relativePath, url, true))
                let children: [String]
                do { children = try fileManager.contentsOfDirectory(atPath: path).sorted() }
                catch { throw LocalPluginFileActionError.ioFailure(error.localizedDescription) }
                for child in children {
                    let childPath = URL(fileURLWithPath: path, isDirectory: true).appending(path: child).path
                    let childRelativePath = relativePath == "." ? child : relativePath + "/" + child
                    try collect(childPath, relativePath: childRelativePath)
                }
            case .typeRegular:
                guard fileManager.isReadableFile(atPath: path) else { throw LocalPluginFileActionError.sourceUnavailable }
                entries.append((relativePath, url, false))
            default:
                throw LocalPluginFileActionError.unsupportedFilesystemEntry
            }
        }
        let rootAttributes = try fileManager.attributesOfItem(atPath: root.path)
        guard let rootType = rootAttributes[.type] as? FileAttributeType else {
            throw LocalPluginFileActionError.unsupportedFilesystemEntry
        }
        try collect(root.path, relativePath: rootType == .typeDirectory ? "." : root.lastPathComponent)
        entries.sort { $0.0 < $1.0 }
        var hasher = SHA256()
        for (relative, url, isDirectory) in entries {
            hasher.update(data: Data(relative.utf8))
            hasher.update(data: Data([0, isDirectory ? 1 : 2, 0]))
            if !isDirectory {
                let handle: FileHandle
                do { handle = try FileHandle(forReadingFrom: url) }
                catch { throw LocalPluginFileActionError.ioFailure(error.localizedDescription) }
                defer { try? handle.close() }
                while true {
                    let chunk = try handle.read(upToCount: 1024 * 1024) ?? Data()
                    if chunk.isEmpty { break }
                    hasher.update(data: chunk)
                }
                hasher.update(data: Data([0xff]))
            }
        }
        return hasher.finalize().map { String(format: "%02x", $0) }.joined()
    }

    private static func validateDirectory(_ url: URL, fileManager: FileManager) throws {
        let values: URLResourceValues
        do { values = try url.resourceValues(forKeys: [.isDirectoryKey, .isSymbolicLinkKey]) }
        catch { throw LocalPluginFileActionError.destinationUnavailable }
        guard values.isSymbolicLink != true else { throw LocalPluginFileActionError.pathIsSymlink }
        guard values.isDirectory == true, fileManager.isWritableFile(atPath: url.path) else {
            throw LocalPluginFileActionError.destinationUnavailable
        }
    }

    private static func validateItem(_ url: URL, fileManager: FileManager) throws {
        guard fileManager.fileExists(atPath: url.path) else { throw LocalPluginFileActionError.sourceUnavailable }
        let values: URLResourceValues
        do { values = try url.resourceValues(forKeys: [.isDirectoryKey, .isRegularFileKey, .isSymbolicLinkKey]) }
        catch { throw LocalPluginFileActionError.sourceUnavailable }
        guard values.isSymbolicLink != true else { throw LocalPluginFileActionError.pathIsSymlink }
        guard values.isDirectory == true || values.isRegularFile == true else {
            throw LocalPluginFileActionError.unsupportedFilesystemEntry
        }
        guard fileManager.isReadableFile(atPath: url.path) else { throw LocalPluginFileActionError.sourceUnavailable }
    }

    private static func validUUID(_ value: String) -> Bool {
        operationPattern.firstMatch(in: value, range: NSRange(value.startIndex..., in: value)) != nil
    }

    private static func isWithin(_ path: String, directory: String) -> Bool {
        path == directory || path.hasPrefix(directory.hasSuffix("/") ? directory : directory + "/")
    }

    private static func result(_ entry: LocalFileActionEntry, replay: Bool) -> LocalPluginFileActionResult {
        LocalPluginFileActionResult(operationID: entry.operationID, state: "completed",
                                    sourcePath: entry.sourcePath, destinationPath: entry.destinationPath,
                                    treeDigest: entry.treeDigest, replay: replay)
    }
}
