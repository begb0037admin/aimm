import CSQLite
import Foundation

public struct ScanGenerationSummary: Codable, Equatable, Sendable {
    public let id: String
    public let startedAt: String
    public let completedAt: String
    public let rootCount: Int
    public let recordCount: Int

    public init(id: String, startedAt: String, completedAt: String,
                rootCount: Int, recordCount: Int) {
        self.id = id
        self.startedAt = startedAt
        self.completedAt = completedAt
        self.rootCount = rootCount
        self.recordCount = recordCount
    }
}

public struct LocalFileActionEntry: Equatable, Sendable {
    public let operationID: String
    public let parentOperationID: String?
    public let generationID: String
    public let recordID: String
    public let kind: String
    public let sourcePath: String
    public let destinationPath: String
    public let treeDigest: String
    public let state: String
    public let destinationVerified: Bool
    public let createdAt: String
    public let updatedAt: String

    public init(operationID: String, parentOperationID: String? = nil,
                generationID: String, recordID: String, kind: String,
                sourcePath: String, destinationPath: String, treeDigest: String,
                state: String, destinationVerified: Bool, createdAt: String, updatedAt: String) {
        self.operationID = operationID
        self.parentOperationID = parentOperationID
        self.generationID = generationID
        self.recordID = recordID
        self.kind = kind
        self.sourcePath = sourcePath
        self.destinationPath = destinationPath
        self.treeDigest = treeDigest
        self.state = state
        self.destinationVerified = destinationVerified
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

public enum ScanJournalError: Error, LocalizedError {
    case open(String)
    case execute(String)
    case prepare(String)
    case step(String)
    case missingGeneration

    public var errorDescription: String? {
        switch self {
        case .open(let message): "Could not open local scan journal: \(message)"
        case .execute(let message): "Could not update local scan journal: \(message)"
        case .prepare(let message): "Could not prepare local scan journal query: \(message)"
        case .step(let message): "Could not read local scan journal: \(message)"
        case .missingGeneration: "The requested scan generation is not in the local journal."
        }
    }
}

/// Device-local SQLite history. Paths are deliberately retained only in this file;
/// API inventory payloads are built separately and must never serialize localPath.
public final class ScanJournal {
    private var database: OpaquePointer?
    private let lock = NSRecursiveLock()

    public init(databaseURL: URL) throws {
        try FileManager.default.createDirectory(
            at: databaseURL.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        let result = sqlite3_open_v2(
            databaseURL.path,
            &database,
            SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE | SQLITE_OPEN_FULLMUTEX,
            nil
        )
        guard result == SQLITE_OK else {
            let message = database.map { String(cString: sqlite3_errmsg($0)) } ?? "SQLite returned \(result)"
            if let database { sqlite3_close(database) }
            database = nil
            throw ScanJournalError.open(message)
        }
        sqlite3_busy_timeout(database, 2_000)
        try execute("""
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS scan_generations (
              generation_id TEXT PRIMARY KEY NOT NULL,
              started_at TEXT NOT NULL,
              completed_at TEXT NOT NULL,
              root_count INTEGER NOT NULL CHECK(root_count >= 0),
              record_count INTEGER NOT NULL CHECK(record_count >= 0),
              state TEXT NOT NULL CHECK(state = 'complete')
            );
            CREATE TABLE IF NOT EXISTS plugin_records (
              generation_id TEXT NOT NULL REFERENCES scan_generations(generation_id) ON DELETE CASCADE,
              record_id TEXT NOT NULL,
              name TEXT NOT NULL,
              bundle_identifier TEXT,
              version TEXT,
              format TEXT NOT NULL CHECK(format IN ('AU', 'VST2', 'VST3', 'CLAP')),
              metadata_source TEXT NOT NULL CHECK(metadata_source IN ('infoPlist', 'filenameOnly')),
              local_path TEXT NOT NULL,
              PRIMARY KEY(generation_id, record_id)
            );
            CREATE INDEX IF NOT EXISTS plugin_records_by_generation_name
              ON plugin_records(generation_id, name);
            CREATE TABLE IF NOT EXISTS local_file_actions (
              operation_id TEXT PRIMARY KEY NOT NULL,
              generation_id TEXT NOT NULL,
              record_id TEXT NOT NULL,
              kind TEXT NOT NULL CHECK(kind IN ('move_to_unused')),
              source_path TEXT NOT NULL,
              destination_path TEXT NOT NULL,
              tree_digest TEXT NOT NULL,
              state TEXT NOT NULL CHECK(state IN ('prepared', 'completed', 'failed', 'needs_recovery')),
              destination_verified INTEGER NOT NULL DEFAULT 0 CHECK(destination_verified IN (0, 1)),
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS local_restore_actions (
              operation_id TEXT PRIMARY KEY NOT NULL,
              parent_operation_id TEXT NOT NULL UNIQUE REFERENCES local_file_actions(operation_id),
              generation_id TEXT NOT NULL,
              record_id TEXT NOT NULL,
              source_path TEXT NOT NULL,
              destination_path TEXT NOT NULL,
              tree_digest TEXT NOT NULL,
              state TEXT NOT NULL CHECK(state IN ('prepared', 'completed', 'failed', 'needs_recovery')),
              destination_verified INTEGER NOT NULL DEFAULT 0 CHECK(destination_verified IN (0, 1)),
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );
            """)
        // Existing journals are upgraded in place. The flag is persisted only
        // after the destination tree has been verified and before source removal.
        var columns = Set<String>()
        var columnsStatement: OpaquePointer?
        guard sqlite3_prepare_v2(database, "PRAGMA table_info(local_file_actions)", -1, &columnsStatement, nil) == SQLITE_OK,
              let columnsStatement else { throw ScanJournalError.prepare(errorMessage) }
        defer { sqlite3_finalize(columnsStatement) }
        while sqlite3_step(columnsStatement) == SQLITE_ROW {
            if let name = sqlite3_column_text(columnsStatement, 1) {
                columns.insert(String(cString: name))
            }
        }
        if !columns.contains("destination_verified") {
            try execute("ALTER TABLE local_file_actions ADD COLUMN destination_verified INTEGER NOT NULL DEFAULT 0 CHECK(destination_verified IN (0, 1))")
        }
    }

    deinit {
        if let database { sqlite3_close(database) }
    }

    /// Saves a complete generation atomically. A failed write leaves the previous
    /// complete generation intact and available for display/retry.
    public func saveCompleteGeneration(
        summary: ScanGenerationSummary,
        records: [PluginRecord]
    ) throws {
        lock.lock()
        defer { lock.unlock() }
        guard summary.recordCount == records.count else {
            throw ScanJournalError.execute("record count does not match the generation summary")
        }
        try execute("BEGIN IMMEDIATE")
        do {
            let generation = try prepare("""
                INSERT INTO scan_generations
                  (generation_id, started_at, completed_at, root_count, record_count, state)
                VALUES (?, ?, ?, ?, ?, 'complete')
                """)
            defer { sqlite3_finalize(generation) }
            bind(summary.id, at: 1, to: generation)
            bind(summary.startedAt, at: 2, to: generation)
            bind(summary.completedAt, at: 3, to: generation)
            sqlite3_bind_int64(generation, 4, sqlite3_int64(summary.rootCount))
            sqlite3_bind_int64(generation, 5, sqlite3_int64(summary.recordCount))
            try stepDone(generation)

            let statement = try prepare("""
                INSERT INTO plugin_records
                  (generation_id, record_id, name, bundle_identifier, version,
                   format, metadata_source, local_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """)
            defer { sqlite3_finalize(statement) }
            for record in records {
                sqlite3_reset(statement)
                sqlite3_clear_bindings(statement)
                bind(summary.id, at: 1, to: statement)
                bind(record.id, at: 2, to: statement)
                bind(record.name, at: 3, to: statement)
                bind(record.bundleIdentifier, at: 4, to: statement)
                bind(record.version, at: 5, to: statement)
                bind(record.format.rawValue, at: 6, to: statement)
                bind(record.metadataSource.rawValue, at: 7, to: statement)
                bind(record.localPath, at: 8, to: statement)
                try stepDone(statement)
            }
            try execute("COMMIT")
        } catch {
            try? execute("ROLLBACK")
            throw error
        }
    }

    public func latestCompleteGeneration() throws -> (summary: ScanGenerationSummary, records: [PluginRecord])? {
        lock.lock()
        defer { lock.unlock() }
        let generation = try prepare("""
            SELECT generation_id, started_at, completed_at, root_count, record_count
            FROM scan_generations WHERE state = 'complete'
            ORDER BY completed_at DESC, generation_id DESC LIMIT 1
            """)
        defer { sqlite3_finalize(generation) }
        let result = sqlite3_step(generation)
        if result == SQLITE_DONE { return nil }
        guard result == SQLITE_ROW else { throw ScanJournalError.step(errorMessage) }
        let summary = ScanGenerationSummary(
            id: columnText(generation, 0) ?? "",
            startedAt: columnText(generation, 1) ?? "",
            completedAt: columnText(generation, 2) ?? "",
            rootCount: Int(sqlite3_column_int64(generation, 3)),
            recordCount: Int(sqlite3_column_int64(generation, 4))
        )
        return (summary, try records(for: summary.id))
    }

    public func records(for generationID: String) throws -> [PluginRecord] {
        lock.lock()
        defer { lock.unlock() }
        let statement = try prepare("""
            SELECT record_id, name, bundle_identifier, version, format, metadata_source, local_path
            FROM plugin_records WHERE generation_id = ? ORDER BY name, format, local_path
            """)
        defer { sqlite3_finalize(statement) }
        bind(generationID, at: 1, to: statement)
        var records: [PluginRecord] = []
        while true {
            let result = sqlite3_step(statement)
            if result == SQLITE_DONE { return records }
            guard result == SQLITE_ROW else { throw ScanJournalError.step(errorMessage) }
            guard let format = columnText(statement, 4).flatMap(PluginFormat.init(rawValue:)),
                  let source = columnText(statement, 5).flatMap(MetadataSource.init(rawValue:)),
                  let id = columnText(statement, 0),
                  let name = columnText(statement, 1),
                  let localPath = columnText(statement, 6) else {
                throw ScanJournalError.step("invalid stored plugin record")
            }
            records.append(PluginRecord(
                id: id, name: name, bundleIdentifier: columnText(statement, 2),
                version: columnText(statement, 3), format: format,
                metadataSource: source, localPath: localPath
            ))
        }
    }

    public func containsCompleteGeneration(_ generationID: String) throws -> Bool {
        lock.lock()
        defer { lock.unlock() }
        return try containsCompleteGenerationUnlocked(generationID)
    }

    private func containsCompleteGenerationUnlocked(_ generationID: String) throws -> Bool {
        let statement = try prepare("SELECT 1 FROM scan_generations WHERE generation_id = ? AND state = 'complete' LIMIT 1")
        defer { sqlite3_finalize(statement) }
        bind(generationID, at: 1, to: statement)
        let result = sqlite3_step(statement)
        if result == SQLITE_ROW { return true }
        if result == SQLITE_DONE { return false }
        throw ScanJournalError.step(errorMessage)
    }

    /// Persist a file-action intent before touching the filesystem. Reusing an
    /// operation ID with different paths or content is always rejected.
    @discardableResult
    public func prepareFileAction(operationID: String, generationID: String, recordID: String,
                                  kind: String, sourcePath: String, destinationPath: String,
                                  treeDigest: String, now: String) throws -> LocalFileActionEntry {
        lock.lock()
        defer { lock.unlock() }
        guard kind == "move_to_unused" else { throw ScanJournalError.execute("unsupported local file action") }
        if let existing = try fileActionUnlocked(operationID: operationID) {
            guard existing.generationID == generationID, existing.recordID == recordID,
                  existing.kind == kind, existing.sourcePath == sourcePath,
                  existing.destinationPath == destinationPath, existing.treeDigest == treeDigest else {
                throw ScanJournalError.execute("operation ID is already bound to different file-action details")
            }
            return existing
        }
        let statement = try prepare("""
            INSERT INTO local_file_actions
              (operation_id, generation_id, record_id, kind, source_path, destination_path,
               tree_digest, state, destination_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'prepared', 0, ?, ?)
            """)
        defer { sqlite3_finalize(statement) }
        bind(operationID, at: 1, to: statement)
        bind(generationID, at: 2, to: statement)
        bind(recordID, at: 3, to: statement)
        bind(kind, at: 4, to: statement)
        bind(sourcePath, at: 5, to: statement)
        bind(destinationPath, at: 6, to: statement)
        bind(treeDigest, at: 7, to: statement)
        bind(now, at: 8, to: statement)
        bind(now, at: 9, to: statement)
        try stepDone(statement)
        guard let entry = try fileActionUnlocked(operationID: operationID) else {
            throw ScanJournalError.step("file action was not saved")
        }
        return entry
    }

    /// Persist a restore intent before moving a completed Unused item back to
    /// the exact source recorded by the original move. One restore is allowed
    /// per original move, and replay must use the same operation and paths.
    @discardableResult
    public func prepareRestoreAction(operationID: String, parentOperationID: String,
                                     generationID: String, recordID: String,
                                     sourcePath: String, destinationPath: String,
                                     treeDigest: String, now: String) throws -> LocalFileActionEntry {
        lock.lock()
        defer { lock.unlock() }
        guard let parent = try fileActionUnlocked(operationID: parentOperationID),
              parent.kind == "move_to_unused", parent.state == "completed",
              parent.destinationVerified, try containsCompleteGenerationUnlocked(generationID),
              parent.recordID == recordID, parent.destinationPath == sourcePath,
              parent.sourcePath == destinationPath, parent.treeDigest == treeDigest else {
            throw ScanJournalError.execute("restore does not match a completed, verified Unused move")
        }
        if let existing = try restoreActionUnlocked(operationID: operationID) {
            guard existing.generationID == generationID, existing.recordID == recordID,
                  existing.kind == "restore", existing.sourcePath == sourcePath,
                  existing.destinationPath == destinationPath, existing.treeDigest == treeDigest,
                  existing.parentOperationID == parentOperationID else {
                throw ScanJournalError.execute("restore operation ID is already bound to different file-action details")
            }
            return existing
        }
        if try restoreActionForParentUnlocked(parentOperationID: parentOperationID) != nil {
            throw ScanJournalError.execute("this Unused move already has a restore operation")
        }
        let statement = try prepare("""
            INSERT INTO local_restore_actions
              (operation_id, parent_operation_id, generation_id, record_id, source_path, destination_path,
               tree_digest, state, destination_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'prepared', 0, ?, ?)
            """)
        defer { sqlite3_finalize(statement) }
        bind(operationID, at: 1, to: statement)
        bind(parentOperationID, at: 2, to: statement)
        bind(generationID, at: 3, to: statement)
        bind(recordID, at: 4, to: statement)
        bind(sourcePath, at: 5, to: statement)
        bind(destinationPath, at: 6, to: statement)
        bind(treeDigest, at: 7, to: statement)
        bind(now, at: 8, to: statement)
        bind(now, at: 9, to: statement)
        try stepDone(statement)
        guard let entry = try restoreActionUnlocked(operationID: operationID) else {
            throw ScanJournalError.step("restore action was not saved")
        }
        return entry
    }

    public func restoreAction(operationID: String) throws -> LocalFileActionEntry? {
        lock.lock()
        defer { lock.unlock() }
        return try restoreActionUnlocked(operationID: operationID)
    }

    /// Checks the recovery state in the journal table owned by the action kind.
    /// Move and restore actions have separate durable records.
    public func hasNeedsRecoveryAction(operationID: String, kind: String) throws -> Bool {
        switch kind {
        case "move_to_unused":
            return try fileAction(operationID: operationID)?.state == "needs_recovery"
        case "restore":
            return try restoreAction(operationID: operationID)?.state == "needs_recovery"
        default:
            throw ScanJournalError.execute("unsupported local recovery action kind")
        }
    }

    /// Returns only locally journaled move/restore operations that may need
    /// the server to re-check their original, owner-confirmed authorization.
    public func pendingRecoveryOperationIDs(limit: Int = 10) throws -> [String] {
        lock.lock()
        defer { lock.unlock() }
        let boundedLimit = max(1, min(limit, 10))
        let statement = try prepare("""
            SELECT operation_id, updated_at FROM (
              SELECT operation_id, updated_at FROM local_file_actions
              WHERE state IN ('prepared', 'completed', 'needs_recovery')
              UNION ALL
              SELECT operation_id, updated_at FROM local_restore_actions
              WHERE state IN ('prepared', 'completed', 'needs_recovery')
            ) ORDER BY updated_at DESC, operation_id LIMIT ?
            """)
        defer { sqlite3_finalize(statement) }
        sqlite3_bind_int(statement, 1, Int32(boundedLimit))
        var operationIDs: [String] = []
        while true {
            let result = sqlite3_step(statement)
            if result == SQLITE_DONE { return operationIDs }
            guard result == SQLITE_ROW, let operationID = columnText(statement, 0) else {
                throw ScanJournalError.step(errorMessage)
            }
            operationIDs.append(operationID)
        }
    }

    public func restoreActionForParent(parentOperationID: String) throws -> LocalFileActionEntry? {
        lock.lock()
        defer { lock.unlock() }
        return try restoreActionForParentUnlocked(parentOperationID: parentOperationID)
    }

    public func setRestoreActionState(operationID: String, state: String, updatedAt: String) throws {
        lock.lock()
        defer { lock.unlock() }
        guard ["prepared", "completed", "failed", "needs_recovery"].contains(state) else {
            throw ScanJournalError.execute("invalid local restore-action state")
        }
        let statement = try prepare("UPDATE local_restore_actions SET state = ?, updated_at = ? WHERE operation_id = ?")
        defer { sqlite3_finalize(statement) }
        bind(state, at: 1, to: statement)
        bind(updatedAt, at: 2, to: statement)
        bind(operationID, at: 3, to: statement)
        try stepDone(statement)
        guard sqlite3_changes(database) == 1 else { throw ScanJournalError.step("restore action was not found") }
    }

    public func markRestoreDestinationVerified(operationID: String, updatedAt: String) throws {
        lock.lock()
        defer { lock.unlock() }
        let statement = try prepare("UPDATE local_restore_actions SET destination_verified = 1, updated_at = ? WHERE operation_id = ?")
        defer { sqlite3_finalize(statement) }
        bind(updatedAt, at: 1, to: statement)
        bind(operationID, at: 2, to: statement)
        try stepDone(statement)
        guard sqlite3_changes(database) == 1 else { throw ScanJournalError.step("restore action was not found") }
    }

    public func fileAction(operationID: String) throws -> LocalFileActionEntry? {
        lock.lock()
        defer { lock.unlock() }
        return try fileActionUnlocked(operationID: operationID)
    }

    public func setFileActionState(operationID: String, state: String, updatedAt: String) throws {
        lock.lock()
        defer { lock.unlock() }
        guard ["prepared", "completed", "failed", "needs_recovery"].contains(state) else {
            throw ScanJournalError.execute("invalid local file-action state")
        }
        let statement = try prepare("UPDATE local_file_actions SET state = ?, updated_at = ? WHERE operation_id = ?")
        defer { sqlite3_finalize(statement) }
        bind(state, at: 1, to: statement)
        bind(updatedAt, at: 2, to: statement)
        bind(operationID, at: 3, to: statement)
        try stepDone(statement)
        guard sqlite3_changes(database) == 1 else { throw ScanJournalError.step("file action was not found") }
    }

    /// Records that the destination tree was rehashed and matched the preview.
    /// This is the only durable authority to remove a duplicate source after a
    /// cross-volume copy has left both paths present.
    public func markFileActionDestinationVerified(operationID: String, updatedAt: String) throws {
        lock.lock()
        defer { lock.unlock() }
        let statement = try prepare("UPDATE local_file_actions SET destination_verified = 1, updated_at = ? WHERE operation_id = ?")
        defer { sqlite3_finalize(statement) }
        bind(updatedAt, at: 1, to: statement)
        bind(operationID, at: 2, to: statement)
        try stepDone(statement)
        guard sqlite3_changes(database) == 1 else { throw ScanJournalError.step("file action was not found") }
    }

    private func fileActionUnlocked(operationID: String) throws -> LocalFileActionEntry? {
        let statement = try prepare("""
            SELECT operation_id, generation_id, record_id, kind, source_path, destination_path,
                   tree_digest, state, destination_verified, created_at, updated_at
            FROM local_file_actions WHERE operation_id = ? LIMIT 1
            """)
        defer { sqlite3_finalize(statement) }
        bind(operationID, at: 1, to: statement)
        let result = sqlite3_step(statement)
        if result == SQLITE_DONE { return nil }
        guard result == SQLITE_ROW,
              let operationID = columnText(statement, 0), let generationID = columnText(statement, 1),
              let recordID = columnText(statement, 2), let kind = columnText(statement, 3),
              let sourcePath = columnText(statement, 4), let destinationPath = columnText(statement, 5),
              let treeDigest = columnText(statement, 6), let state = columnText(statement, 7),
              let createdAt = columnText(statement, 9), let updatedAt = columnText(statement, 10) else {
            throw ScanJournalError.step(errorMessage)
        }
        return LocalFileActionEntry(operationID: operationID, generationID: generationID, recordID: recordID,
                                    kind: kind, sourcePath: sourcePath, destinationPath: destinationPath,
                                    treeDigest: treeDigest, state: state,
                                    destinationVerified: sqlite3_column_int(statement, 8) != 0,
                                    createdAt: createdAt,
                                    updatedAt: updatedAt)
    }

    private func restoreActionUnlocked(operationID: String) throws -> LocalFileActionEntry? {
        let statement = try prepare("""
            SELECT operation_id, parent_operation_id, generation_id, record_id, source_path, destination_path,
                   tree_digest, state, destination_verified, created_at, updated_at
            FROM local_restore_actions WHERE operation_id = ? LIMIT 1
            """)
        defer { sqlite3_finalize(statement) }
        bind(operationID, at: 1, to: statement)
        let result = sqlite3_step(statement)
        if result == SQLITE_DONE { return nil }
        guard result == SQLITE_ROW,
              let operationID = columnText(statement, 0), let parentOperationID = columnText(statement, 1),
              let generationID = columnText(statement, 2), let recordID = columnText(statement, 3),
              let sourcePath = columnText(statement, 4), let destinationPath = columnText(statement, 5),
              let treeDigest = columnText(statement, 6), let state = columnText(statement, 7),
              let createdAt = columnText(statement, 9), let updatedAt = columnText(statement, 10) else {
            throw ScanJournalError.step(errorMessage)
        }
        return LocalFileActionEntry(operationID: operationID, parentOperationID: parentOperationID,
                                    generationID: generationID, recordID: recordID, kind: "restore",
                                    sourcePath: sourcePath, destinationPath: destinationPath,
                                    treeDigest: treeDigest, state: state,
                                    destinationVerified: sqlite3_column_int(statement, 8) != 0,
                                    createdAt: createdAt, updatedAt: updatedAt)
    }

    private func restoreActionForParentUnlocked(parentOperationID: String) throws -> LocalFileActionEntry? {
        let statement = try prepare("SELECT operation_id FROM local_restore_actions WHERE parent_operation_id = ? LIMIT 1")
        defer { sqlite3_finalize(statement) }
        bind(parentOperationID, at: 1, to: statement)
        let result = sqlite3_step(statement)
        if result == SQLITE_DONE { return nil }
        guard result == SQLITE_ROW, let operationID = columnText(statement, 0) else {
            throw ScanJournalError.step(errorMessage)
        }
        return try restoreActionUnlocked(operationID: operationID)
    }

    private var errorMessage: String {
        database.map { String(cString: sqlite3_errmsg($0)) } ?? "database is closed"
    }

    private func execute(_ sql: String) throws {
        var error: UnsafeMutablePointer<CChar>?
        guard sqlite3_exec(database, sql, nil, nil, &error) == SQLITE_OK else {
            let message = error.map { String(cString: $0) } ?? errorMessage
            sqlite3_free(error)
            throw ScanJournalError.execute(message)
        }
    }

    private func prepare(_ sql: String) throws -> OpaquePointer {
        var statement: OpaquePointer?
        guard sqlite3_prepare_v2(database, sql, -1, &statement, nil) == SQLITE_OK,
              let statement else { throw ScanJournalError.prepare(errorMessage) }
        return statement
    }

    private func stepDone(_ statement: OpaquePointer?) throws {
        guard sqlite3_step(statement) == SQLITE_DONE else { throw ScanJournalError.step(errorMessage) }
    }

    private func bind(_ value: String?, at index: Int32, to statement: OpaquePointer?) {
        guard let value else { sqlite3_bind_null(statement, index); return }
        sqlite3_bind_text(statement, index, value, -1, unsafeBitCast(-1, to: sqlite3_destructor_type.self))
    }

    private func columnText(_ statement: OpaquePointer?, _ index: Int32) -> String? {
        guard let value = sqlite3_column_text(statement, index) else { return nil }
        return String(cString: value)
    }
}

public extension ScanJournal {
    static func applicationDefault() throws -> ScanJournal {
        let base = try FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        return try ScanJournal(databaseURL: base.appending(path: "AIMM/Library.sqlite3"))
    }
}
