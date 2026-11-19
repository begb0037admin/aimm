import Testing
import Foundation
@testable import AIMMPluginCompanion

struct ScannerTests {
    @Test func testFixturesAndJSONShape() throws {
        let base = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        let root = base.appendingPathComponent("Components")
        let outside = base.appendingPathComponent("outside")
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        try FileManager.default.createDirectory(at: outside, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: base) }
        func bundle(_ name: String, _ plist: [String: Any], binary: Bool = false, parent: URL? = nil) throws {
            let url = (parent ?? root).appendingPathComponent(name).appendingPathComponent("Contents")
            try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
            let data = try PropertyListSerialization.data(fromPropertyList: plist, format: binary ? .binary : .xml, options: 0)
            try data.write(to: url.appendingPathComponent("Info.plist"))
        }
        try bundle("Single.component", ["CFBundleIdentifier": "com.acme.single", "CFBundleName": "Fallback", "AudioComponents": [["name": "Acme: One", "type": "aufx"]]])
        try bundle("Multi.component", ["CFBundleIdentifier": "com.acme.multi", "AudioComponents": [["name": "Acme: Two", "type": "aumu"], ["name": "Acme: Three", "type": "aufx"]]])
        try bundle("Synth.vst3", ["CFBundleName": "Synth", "Manufacturer": "Maker", "CFBundleVersion": "3"])
        try bundle("Old.vst", ["CFBundleDisplayName": "Old", "Vendor": "Maker"])
        try bundle("New.clap", ["CFBundleName": "New", "vendor": "Maker"], binary: true)
        try bundle("Ignored.aaxplugin", ["CFBundleName": "Ignored"])
        try bundle("Skip (Unused).vst3", ["CFBundleName": "Skip"])
        try bundle(".hidden.vst3", ["CFBundleName": "Hidden"])
        try bundle("Outside.vst3", ["CFBundleName": "Outside"], parent: outside)
        try FileManager.default.createSymbolicLink(at: root.appendingPathComponent("Linked.vst3"), withDestinationURL: outside.appendingPathComponent("Outside.vst3"))
        let broken = root.appendingPathComponent("Broken.vst3/Contents")
        try FileManager.default.createDirectory(at: broken, withIntermediateDirectories: true)
        try Data("broken".utf8).write(to: broken.appendingPathComponent("Info.plist"))
        let inventory = PluginScanner.scan(roots: [PluginRoot(id: "test", url: root)], generation: 7)
        #expect(inventory.rows.count == 6)
        #expect(inventory.counts.AU == 3)
        #expect(inventory.counts.VST2 == 1)
        #expect(inventory.counts.VST3 == 1)
        #expect(inventory.counts.CLAP == 1)
        #expect(inventory.counts.bundles == 6)
        #expect(inventory.counts.unreadable == 1)
        #expect(inventory.counts.products == 6)
        #expect(inventory.rows.first(where: { $0.name == "Two" })?.category == "Instrument")
        #expect(inventory.rows.first(where: { $0.name == "One" })?.vendor == "Acme")
        #expect(inventory.rows.first(where: { $0.name == "New" })?.vendor == "Maker")
        let json = try JSONSerialization.jsonObject(with: JSONEncoder().encode(inventory)) as! [String: Any]
        #expect(json["generation"] as? Int == 7)
        #expect(json["scannedAt"] != nil)
        #expect(json["roots"] != nil)
        #expect(json["counts"] != nil)
        #expect(json["truncated"] != nil)
        let row = (json["rows"] as! [[String: Any]])[0]
        #expect(row["path"] != nil)
        #expect(row["bundleName"] != nil)
    }

    @Test func testOrigins() {
        #expect(LocalBridge.accepts(origin: "https://aimixmasters.com"))
        #expect(LocalBridge.accepts(origin: "https://www.aimixmasters.com"))
        #expect(!(LocalBridge.accepts(origin: "https://evil.example")))
        #expect(!(LocalBridge.accepts(origin: nil)))
    }
}
