import Foundation

struct PluginRow: Codable, Equatable {
    let name: String
    let vendor: String
    let format: String
    let version: String
    let bundleId: String
    let rootId: String
    let category: String
    let bundleName: String
    let path: String
}

struct ScanRoot: Codable {
    let id: String
    let path: String
    let exists: Bool
    let count: Int
}

struct ScanCounts: Codable {
    let AU: Int
    let VST2: Int
    let VST3: Int
    let CLAP: Int
    let products: Int
    let bundles: Int
    let unreadable: Int
}

struct Inventory: Codable {
    let generation: Int
    let scannedAt: String?
    let roots: [ScanRoot]
    let counts: ScanCounts
    let truncated: Bool
    let rows: [PluginRow]

    static let empty = Inventory(generation: 0, scannedAt: nil, roots: [], counts: ScanCounts(AU: 0, VST2: 0, VST3: 0, CLAP: 0, products: 0, bundles: 0, unreadable: 0), truncated: false, rows: [])
}

struct PluginRoot {
    let id: String
    let url: URL

    static func standard() -> [PluginRoot] {
        let bases: [(String, URL)] = [
            ("system", URL(fileURLWithPath: "/Library/Audio/Plug-Ins", isDirectory: true)),
            ("user", FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Library/Audio/Plug-Ins", isDirectory: true))
        ]
        return bases.flatMap { scope, base in
            [("components", "Components"), ("vst", "VST"), ("vst3", "VST3"), ("clap", "CLAP")].map { suffix, name in
                PluginRoot(id: "\(scope)-\(suffix)", url: base.appendingPathComponent(name, isDirectory: true))
            }
        }
    }
}

enum PluginScanner {
    private static let fm = FileManager.default
    private static let formats = ["component": "AU", "vst": "VST2", "vst3": "VST3", "clap": "CLAP"]
    private static let formatDirs: Set<String> = ["components", "vst", "vst3", "clap", "plug-ins"]

    static func scan(roots: [PluginRoot] = PluginRoot.standard(), generation: Int = 1) -> Inventory {
        var rows: [PluginRow] = []
        var reports: [ScanRoot] = []
        var unreadable = 0
        var truncated = false
        var totalBundles = 0
        for root in roots {
            let exists = isDirectoryWithoutSymlink(root.url)
            var rootBundles = 0
            var entries = 0
            var folders = 0
            if exists {
                func visit(_ url: URL, _ parts: [String], _ depth: Int) {
                    if depth > 32 || folders >= 14_000 { truncated = true; return }
                    folders += 1
                    let children: [URL]
                    do {
                        children = try fm.contentsOfDirectory(at: url, includingPropertiesForKeys: [.isDirectoryKey, .isSymbolicLinkKey], options: [])
                    } catch { unreadable += 1; return }
                    for child in children.sorted(by: { $0.lastPathComponent < $1.lastPathComponent }) {
                        if entries >= 50_000 { truncated = true; return }
                        entries += 1
                        let name = child.lastPathComponent
                        if name.hasPrefix(".") || name.hasSuffix(" (Unused)") || child.deletingPathExtension().lastPathComponent.hasSuffix(" (Unused)") || name.caseInsensitiveCompare("Unused") == .orderedSame || name.lowercased().hasSuffix(".aaxplugin") { continue }
                        guard isDirectoryWithoutSymlink(child) else { continue }
                        if let format = formats[child.pathExtension.lowercased()] {
                            rootBundles += 1
                            rows += readBundle(child, rootId: root.id, parts: parts, format: format, unreadable: &unreadable)
                        } else {
                            visit(child, parts + [name], depth + 1)
                        }
                    }
                }
                visit(root.url, [], 0)
            }
            totalBundles += rootBundles
            reports.append(ScanRoot(id: root.id, path: root.url.path, exists: exists, count: rootBundles))
        }
        let productKeys = Set(rows.map { "\(normalize($0.vendor))|\(normalize($0.name))" })
        return Inventory(generation: generation, scannedAt: ISO8601DateFormatter().string(from: Date()), roots: reports,
                         counts: ScanCounts(AU: rows.filter { $0.format == "AU" }.count,
                                            VST2: rows.filter { $0.format == "VST2" }.count,
                                            VST3: rows.filter { $0.format == "VST3" }.count,
                                            CLAP: rows.filter { $0.format == "CLAP" }.count,
                                            products: productKeys.count, bundles: totalBundles, unreadable: unreadable),
                         truncated: truncated, rows: rows)
    }

    private static func normalize(_ string: String) -> String {
        let folded = string.decomposedStringWithCompatibilityMapping
            .folding(options: .diacriticInsensitive, locale: Locale(identifier: "en_US_POSIX"))
            .lowercased()
        return folded.split(whereSeparator: { !$0.isASCII || !$0.isLetter && !$0.isNumber })
            .joined(separator: " ")
    }

    private static func isDirectoryWithoutSymlink(_ url: URL) -> Bool {
        guard let values = try? url.resourceValues(forKeys: [.isDirectoryKey, .isSymbolicLinkKey]) else { return false }
        return values.isDirectory == true && values.isSymbolicLink != true
    }

    private static func string(_ value: Any?) -> String {
        guard let value, !(value is NSNull) else { return "" }
        return String(describing: value)
    }

    private static func truthy(_ value: Any?) -> String {
        let s = string(value)
        return s.isEmpty ? "" : s
    }

    private static func readBundle(_ url: URL, rootId: String, parts: [String], format: String, unreadable: inout Int) -> [PluginRow] {
        let info = url.appendingPathComponent("Contents/Info.plist")
        do {
            guard isDirectoryWithoutSymlink(url.appendingPathComponent("Contents")),
                  (try info.resourceValues(forKeys: [.isSymbolicLinkKey])).isSymbolicLink != true else {
                unreadable += 1; return []
            }
            let size = try info.resourceValues(forKeys: [.fileSizeKey]).fileSize ?? 0
            guard size <= 2_097_152 else { unreadable += 1; return [] }
            let data = try Data(contentsOf: info)
            guard data.count <= 2_097_152,
                  let plist = try PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any],
                  !plist.isEmpty else { unreadable += 1; return [] }
            let audio = plist["AudioComponents"] as? [[String: Any]] ?? []
            let bundleId = truthy(plist["CFBundleIdentifier"])
            let version = truthy(plist["CFBundleShortVersionString"]).isEmpty ? truthy(plist["CFBundleVersion"]) : truthy(plist["CFBundleShortVersionString"])
            let hint = parts.firstIndex(where: { formatDirs.contains($0.lowercased()) }).flatMap { parts.indices.contains($0 + 1) ? parts[$0 + 1] : nil } ?? ""
            let firstName = string(audio.first?["name"])
            let auVendor = format == "AU" && firstName.contains(":") ? String(firstName.split(separator: ":", maxSplits: 1, omittingEmptySubsequences: false)[0]).trimmingCharacters(in: .whitespaces) : ""
            let rawVendor = [auVendor, truthy(plist["Manufacturer"]), truthy(plist["manufacturer"]), truthy(plist["Vendor"]), truthy(plist["vendor"]), truthy(audio.first?["manufacturerName"]), truthy(audio.first?["manufacturer_name"])].first(where: { !$0.isEmpty }) ?? ""
            let idParts = bundleId.split(separator: ".").map(String.init)
            let idVendor = idParts.count > 2 ? idParts[1] : ""
            let vendor = [rawVendor, hint, idVendor, "Unknown publisher"].first(where: { !$0.isEmpty })!.trimmingCharacters(in: .whitespaces)
            let fallback = url.deletingPathExtension().lastPathComponent
            func componentName(_ item: [String: Any]) -> String {
                var name = [truthy(item["name"]), truthy(item["description"])].first(where: { !$0.isEmpty }) ?? ""
                name = name.trimmingCharacters(in: .whitespaces)
                if format == "AU", let colon = name.firstIndex(of: ":") { name = String(name[name.index(after: colon)...]).trimmingCharacters(in: .whitespaces) }
                return name
            }
            var names: [String] = []
            for item in audio {
                let name = componentName(item)
                if !name.isEmpty && !names.contains(name) { names.append(name) }
            }
            if names.isEmpty { names = [[truthy(plist["CFBundleDisplayName"]), truthy(plist["CFBundleName"]), fallback].first(where: { !$0.isEmpty })!.trimmingCharacters(in: .whitespaces)] }
            return names.map { name in
                let component = audio.first(where: { componentName($0) == name })
                let type = string(component?["type"])
                let category = type == "aumu" ? "Instrument" : (type == "aufx" || type == "aumf" ? "Effect" : "")
                return PluginRow(name: name.isEmpty ? fallback : name, vendor: vendor, format: format, version: version, bundleId: bundleId, rootId: rootId, category: category, bundleName: fallback, path: url.path)
            }
        } catch { unreadable += 1; return [] }
    }
}
