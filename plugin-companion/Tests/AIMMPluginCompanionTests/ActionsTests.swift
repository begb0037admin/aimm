#if canImport(XCTest)
import XCTest
@testable import AIMMPluginCompanion

final class ActionsTests: XCTestCase {
    func testTempDirectorySafetyAndActions() {
        XCTAssertEqual(SelfTest.run(), 0)
    }
}

extension ActionsTests {
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
