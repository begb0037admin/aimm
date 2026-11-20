#if canImport(XCTest)
import XCTest
@testable import AIMMPluginCompanion

final class ActionsTests: XCTestCase {
    func testTempDirectorySafetyAndActions() {
        XCTAssertEqual(SelfTest.run(), 0)
    }
}

extension ActionsTests {
    func testDuplicateClassification() {
        func row(_ folder: String, _ bundle: String, _ name: String, _ vendor: String, _ version: String) -> PluginRow {
            let path = "/fixture/\(folder)/\(bundle).vst3"
            return PluginRow(id: path, name: name, vendor: vendor, format: "VST3", version: version,
                             bundleId: "", rootId: folder, category: "", bundleName: bundle, path: path)
        }
        let rows = [
            row("system", "UAD Foo(m)", "Foo", "UAD", "1.0"),
            row("system", "UAD Foo", "Foo", "UAD", "1.0"),
            row("system", "Scaler 3 Audio", "Scaler 3", "Scaler", "1.0"),
            row("system", "Scaler 3 Control", "Scaler 3", "Scaler", "1.0"),
            row("system", "Same", "One", "Maker", "1.0"),
            row("user", "Same", "One", "Maker", "2.0"),
            row("system", "Tie", "Tie", "Maker", "1.0"),
            row("user", "Tie", "Tie", "Maker", "1.0"),
            row("system", "WaveShell1-VST3 16.7", "WaveShell", "Waves", "16.7"),
            row("system", "WaveShell1-VST3 17.1", "WaveShell", "Waves", "17.1"),
            row("system", "Space Name", "Space", "Maker", "1.0"),
            row("system", "SpaceName", "Space", "Maker", "2.0")
        ]
        let actions = PluginActions(roots: [], noAdminPrompt: true)
        actions.update(Inventory(generation: 1, scannedAt: nil, roots: [], counts: Inventory.empty.counts, truncated: false, rows: rows))
        let response = actions.duplicates()
        XCTAssertEqual(response.groups.count, 2)
        XCTAssertEqual(response.groups.first(where: { $0.name == "One" })?.items.filter(\.keep).first?.version, "2.0")
        XCTAssertTrue(response.groups.first(where: { $0.name == "Tie" })?.needsReview == true)
        XCTAssertTrue(response.groups.first(where: { $0.name == "Tie" })?.items.allSatisfy { !$0.keep } == true)
        XCTAssertFalse(response.groups.contains { ["Foo", "Scaler 3", "WaveShell", "Space"].contains($0.name) })
        XCTAssertEqual(response.sideBySideVersions.first(where: { $0.vendor == "Waves" })?.items.count, 2)
    }

    func testBatchAndBusyLock() {
        let actions = PluginActions(roots: [], noAdminPrompt: true)
        XCTAssertTrue(LocalBridge.validBatch(Array(repeating: "id", count: 500)))
        XCTAssertFalse(LocalBridge.validBatch(Array(repeating: "id", count: 501)))
        XCTAssertTrue(actions.begin())
        XCTAssertFalse(actions.begin())
        actions.end()
        XCTAssertTrue(actions.begin())
        actions.end()
    }

    func testPathRejections() throws {
        let base = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        let root = base.appendingPathComponent("VST3")
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: base) }
        let actions = PluginActions(roots: [PluginRoot(id: "fixture", url: root)], noAdminPrompt: true)
        XCTAssertNotNil(actions.validate(root.path))
        XCTAssertNotNil(actions.validate(root.appendingPathComponent("Bad.aaxplugin").path))
        XCTAssertNotNil(actions.validate(root.path + "/../VST3/Test.vst3"))
        XCTAssertEqual(actions.perform("trash", ids: ["unknown"]).first?.reason, "unknown id")
    }
}

#endif
