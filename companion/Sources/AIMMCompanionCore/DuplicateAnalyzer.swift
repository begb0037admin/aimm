import Foundation

/// A conservative, local-only duplicate signal. It never authorizes a file action.
public struct DuplicateGroup: Identifiable, Equatable, Sendable {
    public let id: String
    public let productName: String
    public let bundleIdentifier: String
    public let format: PluginFormat
    public let primary: PluginRecord
    public let extraCopies: [PluginRecord]

    public init(id: String, productName: String, bundleIdentifier: String,
                format: PluginFormat, primary: PluginRecord, extraCopies: [PluginRecord]) {
        self.id = id
        self.productName = productName
        self.bundleIdentifier = bundleIdentifier
        self.format = format
        self.primary = primary
        self.extraCopies = extraCopies
    }
}

public enum DuplicateAnalyzer {
    /// Groups only records with a vendor-provided bundle identifier and the same
    /// plug-in format. Different formats remain separate plug-ins. Paths and
    /// versions stay local, and the result is informational only.
    public static func analyze(_ records: [PluginRecord]) -> [DuplicateGroup] {
        let candidates = records.compactMap { record -> (String, PluginRecord)? in
            guard let bundleIdentifier = record.bundleIdentifier?.trimmingCharacters(in: .whitespacesAndNewlines),
                  !bundleIdentifier.isEmpty else { return nil }
            let normalized = bundleIdentifier.lowercased()
            return ("\(record.format.rawValue)|\(normalized)", record)
        }
        let grouped = Dictionary(grouping: candidates, by: \.0)
        return grouped.compactMap { key, entries in
            let ordered = entries.map(\.1).sorted { left, right in
                let leftPath = URL(fileURLWithPath: left.localPath).standardizedFileURL.path
                let rightPath = URL(fileURLWithPath: right.localPath).standardizedFileURL.path
                if leftPath != rightPath { return leftPath.utf8.lexicographicallyPrecedes(rightPath.utf8) }
                if left.name != right.name { return left.name < right.name }
                return (left.version ?? "") < (right.version ?? "")
            }
            var seenPaths = Set<String>()
            let uniqueByPath = ordered.filter { record in
                seenPaths.insert(URL(fileURLWithPath: record.localPath).standardizedFileURL.path).inserted
            }
            guard uniqueByPath.count > 1, let primary = uniqueByPath.first,
                  let bundleIdentifier = primary.bundleIdentifier else { return nil }
            return DuplicateGroup(id: key, productName: primary.name,
                bundleIdentifier: bundleIdentifier, format: primary.format,
                primary: primary, extraCopies: Array(uniqueByPath.dropFirst()))
        }
        .sorted { $0.id < $1.id }
    }
}
