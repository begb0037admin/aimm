import AppKit
import Foundation
import Darwin

struct ActionResult: Codable { let id: String; let ok: Bool; let reason: String? }
struct ActionResponse: Codable { let results: [ActionResult]; let counts: ScanCounts; let inventory: Inventory }
struct MoveRecord: Codable {
    let id: String
    let originalPath: String
    let unusedPath: String
    let rowIds: [String]
    let movedAt: String
    let name: String
    let vendor: String
    let format: String
}
struct UnusedEntry: Codable {
    let moveId: String; let name: String; let vendor: String; let format: String
    let version: String; let originalPath: String; let movedAt: String; let path: String
}
struct DuplicateItem: Codable { let path: String; let rootId: String; let version: String; let keep: Bool; let rowIds: [String] }
struct DuplicateGroup: Codable { let vendor: String; let name: String; let format: String; let needsReview: Bool; let items: [DuplicateItem] }
struct AlreadyUnused: Codable { let name: String; let path: String }
struct SideBySideVersion: Codable { let bundleName: String; let path: String; let rootId: String; let version: String }
struct SideBySideGroup: Codable { let vendor: String; let family: String; let format: String; let items: [SideBySideVersion] }
struct DuplicateResponse: Codable { let groups: [DuplicateGroup]; let sideBySideVersions: [SideBySideGroup]; let alreadyUnused: [AlreadyUnused] }

final class PluginActions {
    private let fm = FileManager.default
    let roots: [PluginRoot]
    let movesURL: URL
    let trashURL: URL?
    let noAdminPrompt: Bool
    private let mutex = NSLock()
    private var busy = false
    private var rows: [String: PluginRow] = [:]
    private var inventory = Inventory.empty

    init(roots: [PluginRoot] = PluginRoot.standard(), movesURL: URL? = nil, trashURL: URL? = nil, noAdminPrompt: Bool = ProcessInfo.processInfo.environment["AIMM_NO_ADMIN_PROMPT"] == "1") {
        self.roots = roots
        self.movesURL = movesURL ?? fm.homeDirectoryForCurrentUser.appendingPathComponent("Library/Application Support/AIMM/plugin-companion-moves.json")
        self.trashURL = trashURL
        self.noAdminPrompt = noAdminPrompt
    }

    func update(_ scan: Inventory) {
        mutex.lock(); defer { mutex.unlock() }
        inventory = scan
        rows = Dictionary(uniqueKeysWithValues: scan.rows.map { ($0.id, $0) })
    }
    func begin() -> Bool { mutex.lock(); defer { mutex.unlock() }; if busy { return false }; busy = true; return true }
    func end() { mutex.lock(); busy = false; mutex.unlock() }
    func isBusy() -> Bool { mutex.lock(); defer { mutex.unlock() }; return busy }

    private func canonical(_ path: String) -> String {
        if let pointer = realpath(path, nil) { defer { free(pointer) }; return String(cString: pointer) }
        let url = URL(fileURLWithPath: path)
        return canonical(url.deletingLastPathComponent().path) + "/" + url.lastPathComponent
    }
    private func within(_ path: String) -> PluginRoot? {
        let real = canonical(path)
        return roots.first { root in
            let base = canonical(root.url.path)
            return real.hasPrefix(base + "/")
        }
    }
    func validate(_ path: String) -> String? {
        guard path.hasPrefix("/") else { return "absolute path required" }
        let url = URL(fileURLWithPath: path)
        let components = path.split(separator: "/")
        if components.contains("..") { return "path contains .." }
        if components.contains(where: { $0.lowercased().hasSuffix(".aaxplugin") }) { return "AAX paths are unsupported" }
        let clean = url.standardizedFileURL.path
        guard within(path) != nil else { return "outside scanned roots" }
        guard ["component", "vst", "vst3", "clap"].contains(url.pathExtension.lowercased()) else { return "unsupported bundle extension" }
        guard !roots.contains(where: { $0.url.standardizedFileURL.path == clean }) else { return "root folder is not a bundle" }
        if let vals = try? url.resourceValues(forKeys: [.isSymbolicLinkKey]), vals.isSymbolicLink == true { return "bundle is a symlink" }
        return nil
    }
    private func parentWritable(_ url: URL) -> Bool {
        var info = stat()
        guard stat(url.deletingLastPathComponent().path, &info) == 0 else { return false }
        let mode = info.st_mode
        return (info.st_uid == getuid() && mode & S_IWUSR != 0) ||
            (info.st_gid == getgid() && mode & S_IWGRP != 0) || mode & S_IWOTH != 0
    }
    private func unique(_ url: URL) -> URL {
        if !fm.fileExists(atPath: url.path) { return url }
        let stem = url.deletingPathExtension().lastPathComponent, ext = url.pathExtension
        var n = 2
        while true {
            let name = "\(stem) (\(n))" + (ext.isEmpty ? "" : ".\(ext)")
            let candidate = url.deletingLastPathComponent().appendingPathComponent(name)
            if !fm.fileExists(atPath: candidate.path) { return candidate }
            n += 1
        }
    }
    private func records() -> [MoveRecord] { (try? JSONDecoder().decode([MoveRecord].self, from: Data(contentsOf: movesURL))) ?? [] }
    private func save(_ records: [MoveRecord]) throws {
        try fm.createDirectory(at: movesURL.deletingLastPathComponent(), withIntermediateDirectories: true)
        let data = try JSONEncoder().encode(records)
        try data.write(to: movesURL, options: .atomic)
    }
    private func quote(_ s: String) -> String { "'" + s.replacingOccurrences(of: "'", with: "'\\''") + "'" }
    private func privileged(_ moves: [(String, URL, URL)], createParent: Bool) -> [String: String] {
        if moves.isEmpty { return [:] }
        if noAdminPrompt { return Dictionary(uniqueKeysWithValues: moves.map { ($0.0, "needs administrator rights") }) }
        let lines = moves.map { id, from, to in
            let mkdir = createParent ? "/bin/mkdir -p \(quote(to.deletingLastPathComponent().path)) && " : ""
            return "if \(mkdir)/bin/mv \(quote(from.path)) \(quote(to.path)); then echo \(quote(id + ":OK")); else echo \(quote(id + ":FAIL")); fi"
        }
        let script = lines.joined(separator: "; ")
        let prompt = "AIMM Plugin Companion wants to move \(moves.count) plug-ins"
        let source = "do shell script \(appleQuote(script)) with administrator privileges with prompt \(appleQuote(prompt))"
        var error: NSDictionary?
        let output = NSAppleScript(source: source)?.executeAndReturnError(&error).stringValue ?? ""
        if let error {
            let code = error[NSAppleScript.errorNumber] as? Int
            let reason = code == -128 ? "administrator approval cancelled" : "administrator move failed"
            return Dictionary(uniqueKeysWithValues: moves.map { ($0.0, reason) })
        }
        let ok = Set(output.split(separator: "\n").map(String.init).filter { $0.hasSuffix(":OK") }.map { String($0.dropLast(3)) })
        return Dictionary(uniqueKeysWithValues: moves.map { ($0.0, ok.contains($0.0) ? "" : "administrator move failed") })
    }
    private func appleQuote(_ s: String) -> String { "\"" + s.replacingOccurrences(of: "\\", with: "\\\\").replacingOccurrences(of: "\"", with: "\\\"").replacingOccurrences(of: "\n", with: "\\n") + "\"" }

    func perform(_ action: String, ids: [String]) -> [ActionResult] {
        mutex.lock(); let map = rows; mutex.unlock()
        var results: [ActionResult] = []
        var pending: [(String, URL, URL, [String], PluginRow?)] = []
        var seen: [String: String] = [:]
        var aliases: [String: String] = [:]
        var allRecords = records()
        for id in ids {
            let row = map[id]
            let record = action == "restore" ? allRecords.first(where: { $0.id == id }) : nil
            guard action == "restore" ? record != nil : row != nil else { results.append(ActionResult(id: id, ok: false, reason: "unknown id")); continue }
            let source = action == "restore" ? record!.unusedPath : row!.path
            let target: URL
            if let error = validate(source) { results.append(ActionResult(id: id, ok: false, reason: error)); continue }
            if action == "restore" {
                if let error = validate(record!.originalPath) { results.append(ActionResult(id: id, ok: false, reason: error)); continue }
                target = URL(fileURLWithPath: record!.originalPath)
                if fm.fileExists(atPath: target.path) { results.append(ActionResult(id: id, ok: false, reason: "original location is occupied")); continue }
            } else if action == "unuse" {
                target = unique(URL(fileURLWithPath: source).deletingLastPathComponent().appendingPathComponent("Unused").appendingPathComponent(URL(fileURLWithPath: source).lastPathComponent))
            } else if action == "trash" {
                target = unique((trashURL ?? fm.homeDirectoryForCurrentUser.appendingPathComponent(".Trash")).appendingPathComponent(URL(fileURLWithPath: source).lastPathComponent))
            } else { // reveal
                NSWorkspace.shared.activateFileViewerSelecting([URL(fileURLWithPath: source)])
                results.append(ActionResult(id: id, ok: true, reason: nil)); continue
            }
            if !fm.fileExists(atPath: source) { results.append(ActionResult(id: id, ok: false, reason: "bundle no longer exists")); continue }
            if let first = seen[source] { aliases[id] = first; continue }
            seen[source] = id
            pending.append((id, URL(fileURLWithPath: source), target, action == "restore" ? record!.rowIds : map.values.filter { $0.path == source }.map(\.id), row))
        }
        let admin = pending.filter { !parentWritable($0.1) || (action == "restore" && !parentWritable($0.2)) }
        let adminOutcome = privileged(admin.map { ($0.0, $0.1, $0.2) }, createParent: action != "restore")
        for (id, source, target, rowIds, row) in pending {
            if let reason = adminOutcome[id], !reason.isEmpty { results.append(ActionResult(id: id, ok: false, reason: reason)); continue }
            do {
                if adminOutcome[id] == nil {
                    if action != "restore" { try fm.createDirectory(at: target.deletingLastPathComponent(), withIntermediateDirectories: true) }
                    if action == "trash" && trashURL == nil {
                        _ = try fm.trashItem(at: source, resultingItemURL: nil)
                    } else { try fm.moveItem(at: source, to: target) }
                }
                if action == "unuse", let row {
                    allRecords.append(MoveRecord(id: UUID().uuidString, originalPath: source.path, unusedPath: target.path, rowIds: rowIds, movedAt: ISO8601DateFormatter().string(from: Date()), name: row.name, vendor: row.vendor, format: row.format))
                    try save(allRecords)
                } else if action == "restore" {
                    allRecords.removeAll { $0.id == id }; try save(allRecords)
                }
                results.append(ActionResult(id: id, ok: true, reason: nil))
            } catch { results.append(ActionResult(id: id, ok: false, reason: error.localizedDescription)) }
        }
        return ids.map { id in
            if let first = aliases[id], let outcome = results.first(where: { $0.id == first }) {
                return ActionResult(id: id, ok: outcome.ok, reason: outcome.ok ? "same bundle as \(first)" : outcome.reason)
            }
            return results.first(where: { $0.id == id }) ?? ActionResult(id: id, ok: false, reason: "not processed")
        }
    }
    func unused() -> [UnusedEntry] {
        records().filter { fm.fileExists(atPath: $0.unusedPath) }.map { rec in
            let plist = NSDictionary(contentsOfFile: URL(fileURLWithPath: rec.unusedPath).appendingPathComponent("Contents/Info.plist").path)
            return UnusedEntry(moveId: rec.id, name: rec.name, vendor: rec.vendor, format: rec.format,
                               version: plist?["CFBundleShortVersionString"] as? String ?? plist?["CFBundleVersion"] as? String ?? "",
                               originalPath: rec.originalPath, movedAt: rec.movedAt, path: rec.unusedPath)
        }
    }
    func duplicates() -> DuplicateResponse {
        mutex.lock(); let live = inventory; mutex.unlock()
        func normalized(_ value: String) -> String { value.lowercased().filter { !$0.isWhitespace } }
        func versionParts(_ value: String) -> [Int]? {
            let parts = value.split(separator: ".", omittingEmptySubsequences: false)
            guard !parts.isEmpty else { return nil }
            let numbers = parts.compactMap { part -> Int? in
                guard !part.isEmpty, part.allSatisfy(\.isNumber) else { return nil }
                return Int(part)
            }
            return numbers.count == parts.count ? numbers : nil
        }
        func compare(_ a: [Int], _ b: [Int]) -> Int {
            for i in 0..<max(a.count, b.count) {
                let x = i < a.count ? a[i] : 0, y = i < b.count ? b[i] : 0
                if x != y { return x > y ? 1 : -1 }
            }
            return 0
        }
        let groups = Dictionary(grouping: live.rows) { "\($0.format.lowercased())|\(normalized($0.bundleName))" }
        var output: [DuplicateGroup] = []
        for rows in groups.values {
            let paths = Dictionary(grouping: rows, by: \.path)
            guard paths.count > 1,
                  Set(paths.keys.map { URL(fileURLWithPath: $0).deletingLastPathComponent().standardizedFileURL.path }).count > 1,
                  let first = rows.first else { continue }
            let distinct = paths.values.compactMap(\.first)
            let versions = distinct.compactMap { versionParts($0.version) }
            let newest = versions.max { compare($0, $1) < 0 }
            let review = versions.count != distinct.count || newest == nil || versions.filter { compare($0, newest!) == 0 }.count != 1
            let sorted = distinct.sorted { a, b in
                if let av = versionParts(a.version), let bv = versionParts(b.version), compare(av, bv) != 0 { return compare(av, bv) > 0 }
                return a.path < b.path
            }
            output.append(DuplicateGroup(vendor: first.vendor, name: first.name, format: first.format, needsReview: review,
                items: sorted.map { DuplicateItem(path: $0.path, rootId: $0.rootId, version: $0.version, keep: !review && versionParts($0.version).map { compare($0, newest!) == 0 } == true, rowIds: paths[$0.path]!.map(\.id)) }))
        }
        // Only a dotted numeric suffix after a space is treated as a version of the same family.
        func family(_ name: String) -> String? {
            guard let space = name.lastIndex(of: " ") else { return nil }
            let suffix = String(name[name.index(after: space)...])
            guard suffix.contains("."), versionParts(suffix) != nil else { return nil }
            let prefix = String(name[..<space]).trimmingCharacters(in: .whitespaces)
            return prefix.isEmpty ? nil : prefix
        }
        let versionRows = live.rows.compactMap { row -> (String, PluginRow)? in
            guard let name = family(row.bundleName) else { return nil }
            return ("\(row.format.lowercased())|\(normalized(row.vendor))|\(normalized(name))", row)
        }
        let families = Dictionary(grouping: versionRows, by: { $0.0 })
        let sideBySide: [SideBySideGroup] = families.values.compactMap { entries in
            let distinct = Dictionary(grouping: entries.map(\.1), by: \.path).values.compactMap(\.first)
            guard Set(distinct.map { normalized($0.bundleName) }).count > 1, let first = distinct.first,
                  let name = family(first.bundleName) else { return nil }
            return SideBySideGroup(vendor: first.vendor, family: name, format: first.format,
                items: distinct.map { SideBySideVersion(bundleName: $0.bundleName, path: $0.path, rootId: $0.rootId, version: $0.version) }.sorted { $0.path < $1.path })
        }
        var unused: [AlreadyUnused] = []
        for root in roots {
            let folder = root.url.appendingPathComponent("Unused")
            for url in (try? fm.contentsOfDirectory(at: folder, includingPropertiesForKeys: nil)) ?? [] {
                if ["component", "vst", "vst3", "clap"].contains(url.pathExtension.lowercased()) { unused.append(AlreadyUnused(name: url.deletingPathExtension().lastPathComponent, path: url.path)) }
            }
        }
        return DuplicateResponse(groups: output.sorted { $0.name < $1.name }, sideBySideVersions: sideBySide.sorted { $0.family < $1.family }, alreadyUnused: unused.sorted { $0.path < $1.path })
    }
}
