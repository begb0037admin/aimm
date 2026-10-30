import Foundation

public enum PluginFormat: String, Codable, CaseIterable, Sendable {
    case audioUnit = "AU"
    case vst2 = "VST2"
    case vst3 = "VST3"
    case clap = "CLAP"
}

public enum MetadataSource: String, Codable, Sendable {
    case infoPlist
    case filenameOnly
}

public enum PublisherSource: String, Codable, Sendable {
    case infoPlistManufacturer
    case infoPlistVendor
}

public struct PluginRecord: Codable, Equatable, Sendable {
    public let id: String
    public let name: String
    public let bundleIdentifier: String?
    public let publisherName: String?
    public let publisherSource: PublisherSource?
    public let canonicalProductId: String?
    public let version: String?
    public let format: PluginFormat
    public let metadataSource: MetadataSource
    public let localPath: String

    public init(id: String, name: String, bundleIdentifier: String?, version: String?,
                format: PluginFormat, metadataSource: MetadataSource, localPath: String,
                publisherName: String? = nil, publisherSource: PublisherSource? = nil,
                canonicalProductId: String? = nil) {
        self.id = id
        self.name = name
        self.bundleIdentifier = bundleIdentifier
        self.publisherName = publisherName
        self.publisherSource = publisherSource
        self.canonicalProductId = canonicalProductId
        self.version = version
        self.format = format
        self.metadataSource = metadataSource
        self.localPath = localPath
    }
}

public enum PluginScannerError: Error, Equatable {
    case rootDoesNotExist(String)
    case rootIsNotDirectory(String)
}

public struct PluginScanner {
    private let fileManager: FileManager
    private let maximumInfoPlistBytes = 256 * 1024

    public init(fileManager: FileManager = .default) {
        self.fileManager = fileManager
    }

    /// Returns the standard system and per-user plug-in roots that currently
    /// exist. Discovery is read-only; callers still start a scan only after an
    /// explicit user action.
    public static func standardRoots(
        userLibraryURL: URL = FileManager.default.homeDirectoryForCurrentUser.appending(path: "Library", directoryHint: .isDirectory),
        systemLibraryURL: URL = URL(fileURLWithPath: "/Library", isDirectory: true),
        fileManager: FileManager = .default
    ) -> [URL] {
        [userLibraryURL, systemLibraryURL]
            .map { $0.appending(path: "Audio/Plug-Ins", directoryHint: .isDirectory).standardizedFileURL }
            .filter { url in
                var isDirectory: ObjCBool = false
                guard fileManager.fileExists(atPath: url.path, isDirectory: &isDirectory), isDirectory.boolValue,
                      (try? url.resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink) != true else {
                    return false
                }
                return true
            }
    }

    /// Scans only roots explicitly supplied by the caller. It reads bundle Info.plist
    /// metadata and names only; it never loads or executes plug-in binaries.
    public func scan(roots: [URL]) throws -> [PluginRecord] {
        var recordsByPath: [String: PluginRecord] = [:]
        for root in roots {
            var isDirectory: ObjCBool = false
            guard fileManager.fileExists(atPath: root.path, isDirectory: &isDirectory) else {
                throw PluginScannerError.rootDoesNotExist(root.path)
            }
            guard isDirectory.boolValue else {
                throw PluginScannerError.rootIsNotDirectory(root.path)
            }
            if try root.resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink == true {
                continue
            }

            var directories = [root]
            while let directory = directories.popLast() {
                let children = try fileManager.contentsOfDirectory(
                    at: directory,
                    includingPropertiesForKeys: [.isDirectoryKey, .isSymbolicLinkKey],
                    options: [.skipsHiddenFiles]
                )
                for candidate in children {
                    let values = try candidate.resourceValues(forKeys: [.isDirectoryKey, .isSymbolicLinkKey])
                    if values.isSymbolicLink == true { continue }
                    let ext = candidate.pathExtension.lowercased()
                    if ext == "aaxplugin" { continue }
                    guard let format = Self.format(for: ext) else {
                        if values.isDirectory == true { directories.append(candidate) }
                        continue
                    }
                    let isBundle = values.isDirectory == true
                    if format != .clap && !isBundle { continue }
                    let record = record(at: candidate, format: format)
                    recordsByPath[record.localPath] = record
                }
            }
        }
        return recordsByPath.values.sorted {
            let comparison = $0.name.localizedStandardCompare($1.name)
            if comparison != .orderedSame { return comparison == .orderedAscending }
            if $0.format.rawValue != $1.format.rawValue { return $0.format.rawValue < $1.format.rawValue }
            return $0.localPath < $1.localPath
        }
    }

    private static func format(for ext: String) -> PluginFormat? {
        switch ext {
        case "component": .audioUnit
        case "vst": .vst2
        case "vst3": .vst3
        case "clap": .clap
        default: nil
        }
    }

    private func record(at url: URL, format: PluginFormat) -> PluginRecord {
        let plist = readInfoPlist(in: url)
        let bundleIdentifier = boundedString(plist?["CFBundleIdentifier"], maximum: 255)
        let manufacturer = boundedPublisherString(plist?["Manufacturer"], maximum: 120)
        let vendor = boundedPublisherString(plist?["Vendor"], maximum: 120)
        let publisherName = manufacturer ?? vendor
        let publisherSource: PublisherSource? = manufacturer != nil ? .infoPlistManufacturer
            : (vendor != nil ? .infoPlistVendor : nil)
        let displayName = boundedString(plist?["CFBundleDisplayName"], maximum: 200)
            ?? boundedString(plist?["CFBundleName"], maximum: 200)
        let version = boundedString(plist?["CFBundleShortVersionString"], maximum: 100)
            ?? boundedString(plist?["CFBundleVersion"], maximum: 100)
        let name = displayName ?? url.deletingPathExtension().lastPathComponent
        let path = url.standardizedFileURL.path
        return PluginRecord(
            id: path,
            name: name,
            bundleIdentifier: bundleIdentifier,
            version: version,
            format: format,
            metadataSource: plist == nil ? .filenameOnly : .infoPlist,
            localPath: path,
            publisherName: publisherName,
            publisherSource: publisherSource,
            canonicalProductId: nil
        )
    }

    private func readInfoPlist(in bundle: URL) -> [String: Any]? {
        let urls = [bundle.appending(path: "Contents/Info.plist"), bundle.appending(path: "Info.plist")]
        for plistURL in urls {
            guard let values = try? plistURL.resourceValues(forKeys: [.isRegularFileKey, .isSymbolicLinkKey]),
                  values.isRegularFile == true,
                  values.isSymbolicLink != true,
                  let attributes = try? fileManager.attributesOfItem(atPath: plistURL.path),
                  let size = attributes[.size] as? NSNumber,
                  size.intValue <= maximumInfoPlistBytes,
                  let data = try? Data(contentsOf: plistURL),
                  let object = try? PropertyListSerialization.propertyList(from: data, options: [], format: nil),
                  let dictionary = object as? [String: Any] else {
                continue
            }
            return dictionary
        }
        return nil
    }

    private func boundedPublisherString(_ value: Any?, maximum: Int) -> String? {
        guard let result = boundedString(value, maximum: maximum),
              !result.unicodeScalars.contains(where: { $0.value <= 0x1f || $0.value == 0x7f }) else { return nil }
        return result
    }

    private func boundedString(_ value: Any?, maximum: Int) -> String? {
        guard let value = value as? String else { return nil }
        let result = value.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !result.isEmpty, result.utf8.count <= maximum else { return nil }
        return result
    }
}
