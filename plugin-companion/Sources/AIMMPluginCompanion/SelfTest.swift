import Foundation

struct SelfTest {
    static func run() -> Int {
        fputs("self-test start\n", stderr)
        let fm = FileManager.default
        let base = fm.temporaryDirectory.resolvingSymlinksInPath().appendingPathComponent("AIMMCompanionSelfTest-\(UUID().uuidString)")
        let system = base.appendingPathComponent("system/VST3")
        let user = base.appendingPathComponent("user/VST3")
        let trash = base.appendingPathComponent("Trash")
        let moves = base.appendingPathComponent("moves.json")
        try! fm.createDirectory(at: system, withIntermediateDirectories: true)
        try! fm.createDirectory(at: user, withIntermediateDirectories: true)
        defer { try? fm.removeItem(at: base) }
        var failures = 0
        func check(_ label: String, _ value: Bool) { fputs("\(value ? "PASS" : "FAIL") \(label)\n", stderr); if !value { failures += 1 } }
        func bundle(_ parent: URL, _ folder: String, _ name: String, _ version: String?, _ vendor: String = "Maker") {
            let contents = parent.appendingPathComponent(folder).appendingPathComponent("Contents")
            try! fm.createDirectory(at: contents, withIntermediateDirectories: true)
            var plist: [String: Any] = ["CFBundleName": name, "Manufacturer": vendor]
            if let version { plist["CFBundleShortVersionString"] = version }
            let data = try! PropertyListSerialization.data(fromPropertyList: plist, format: .xml, options: 0)
            try! data.write(to: contents.appendingPathComponent("Info.plist"))
        }
        let roots = [PluginRoot(id: "system-vst3", url: system), PluginRoot(id: "user-vst3", url: user)]
        let actions = PluginActions(roots: roots, movesURL: moves, trashURL: trash, noAdminPrompt: true)
        bundle(system, "One.vst3", "One", "1.2")
        bundle(user, "One.vst3", "One", "2.0")
        bundle(system, "Unknown.vst3", "Unknown", nil)
        bundle(user, "Unknown.vst3", "Unknown", "1.0")
        bundle(system, "Tie.vst3", "Tie", "1.0")
        bundle(user, "Tie.vst3", "Tie", "1.0")
        bundle(system, "UAD Foo(m).vst3", "Foo", "1.0", "UAD")
        bundle(system, "UAD Foo.vst3", "Foo", "1.0", "UAD")
        bundle(system, "Scaler 3 Audio.vst3", "Scaler 3", "1.0", "Scaler")
        bundle(system, "Scaler 3 Control.vst3", "Scaler 3", "1.0", "Scaler")
        bundle(system, "WaveShell1-VST3 16.7.vst3", "WaveShell", "16.7", "Waves")
        bundle(system, "WaveShell1-VST3 17.1.vst3", "WaveShell", "17.1", "Waves")
        bundle(system, "Space Name.vst3", "Space", "1.0")
        bundle(system, "SpaceName.vst3", "Space", "2.0")
        bundle(user, "Remove.vst3", "Remove", "1")
        func scan() -> Inventory { let x = PluginScanner.scan(roots: roots); actions.update(x); return x }
        var inv = scan()
        check("stable row ids", inv.rows.allSatisfy { $0.id == PluginScanner.rowID(path: $0.path, name: $0.name, format: $0.format) })
        let groups = actions.duplicates().groups
        check("same bundle name across roots keeps newest", groups.first(where: { $0.name == "One" })?.items.first?.rootId == "user-vst3" && groups.first(where: { $0.name == "One" })?.items.first?.keep == true)
        check("missing version needs review", groups.first(where: { $0.name == "Unknown" })?.needsReview == true && groups.first(where: { $0.name == "Unknown" })?.items.allSatisfy { !$0.keep } == true)
        check("same version needs review", groups.first(where: { $0.name == "Tie" })?.needsReview == true && groups.first(where: { $0.name == "Tie" })?.items.allSatisfy { !$0.keep } == true)
        check("UAD mono and stereo are not duplicates", !groups.contains { $0.name == "Foo" })
        check("Scaler Audio and Control are not duplicates", !groups.contains { $0.name == "Scaler 3" })
        check("Waves shells are informational only", !groups.contains { $0.name == "WaveShell" } && actions.duplicates().sideBySideVersions.contains { $0.vendor == "Waves" && $0.items.count == 2 })
        check("same-folder spacing variants are not duplicates", !groups.contains { $0.name == "Space" })
        check("reject traversal", actions.validate(user.path + "/../VST3/One.vst3") != nil)
        check("reject wrong extension", actions.validate(user.appendingPathComponent("bad.aaxplugin").path) != nil)
        check("reject root", actions.validate(user.path) != nil)
        let outside = base.appendingPathComponent("outside.vst3")
        try! fm.createDirectory(at: outside, withIntermediateDirectories: true)
        try! fm.createSymbolicLink(at: user.appendingPathComponent("escape.vst3"), withDestinationURL: outside)
        check("reject symlink escape", actions.validate(user.appendingPathComponent("escape.vst3").path) != nil)
        check("unknown id", actions.perform("unuse", ids: ["missing"]).first?.reason == "unknown id")
        check("batch limit", !LocalBridge.validBatch(Array(repeating: "x", count: 501)))
        check("busy lock", actions.begin() && !actions.begin()); actions.end()
        let one = inv.rows.first { $0.rootId == "system-vst3" && $0.name == "One" }!
        let moved = actions.perform("unuse", ids: [one.id]).first!
        check("unuse", moved.ok && fm.fileExists(atPath: system.appendingPathComponent("Unused/One.vst3").path))
        check("persisted moves and unused", fm.fileExists(atPath: moves.path) && PluginActions(roots: roots, movesURL: moves, trashURL: trash, noAdminPrompt: true).unused().count == 1)
        let moveId = actions.unused().first!.moveId
        check("already unused listing", actions.duplicates().alreadyUnused.contains { $0.name == "One" })
        check("restore", actions.perform("restore", ids: [moveId]).first?.ok == true && fm.fileExists(atPath: system.appendingPathComponent("One.vst3").path))
        inv = scan()
        let oneAgain = inv.rows.first { $0.rootId == "system-vst3" && $0.name == "One" }!
        let occupiedMove = actions.perform("unuse", ids: [oneAgain.id]).first!
        if occupiedMove.ok { bundle(system, "One.vst3", "One", "9") }
        check("occupied original refused", occupiedMove.ok && actions.perform("restore", ids: [actions.unused().first!.moveId]).first?.reason == "original location is occupied")
        bundle(user, "Unused/Remove.vst3", "Old", "1")
        inv = scan()
        let remove = inv.rows.first { $0.name == "Remove" }!
        check("collision naming", actions.perform("unuse", ids: [remove.id]).first?.ok == true && fm.fileExists(atPath: user.appendingPathComponent("Unused/Remove (2).vst3").path))
        bundle(user, "TrashMe.vst3", "TrashMe", "1")
        inv = scan()
        let trashMe = inv.rows.first { $0.name == "TrashMe" }!
        check("trash fixture", actions.perform("trash", ids: [trashMe.id]).first?.ok == true && fm.fileExists(atPath: trash.appendingPathComponent("TrashMe.vst3").path))
        bundle(system, "NeedsAdmin.vst3", "NeedsAdmin", "1")
        try! fm.setAttributes([.posixPermissions: 0o555], ofItemAtPath: system.path)
        inv = scan()
        let admin = inv.rows.first { $0.name == "NeedsAdmin" }!
        check("no prompt reports admin rights", actions.perform("unuse", ids: [admin.id]).first?.reason == "needs administrator rights")
        try! fm.setAttributes([.posixPermissions: 0o755], ofItemAtPath: system.path)
        return failures
    }
}
