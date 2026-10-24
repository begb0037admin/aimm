import AIMMCompanionCore
import Foundation
import CryptoKit
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

func check(_ condition: @autoclosure () -> Bool, _ message: String) {
    guard condition() else {
        fputs("FAIL: \(message)\n", stderr)
        exit(1)
    }
}

final class MockRequestLog: @unchecked Sendable {
    private let lock = NSLock()
    private var stored: [URLRequest] = []

    func append(_ request: URLRequest) {
        var captured = request
        if captured.httpBody == nil, let stream = captured.httpBodyStream {
            stream.open()
            defer { stream.close() }
            var body = Data()
            var buffer = [UInt8](repeating: 0, count: 4096)
            while stream.hasBytesAvailable {
                let count = stream.read(&buffer, maxLength: buffer.count)
                if count <= 0 { break }
                body.append(buffer, count: count)
            }
            captured.httpBody = body
        }
        lock.lock()
        stored.append(captured)
        lock.unlock()
    }

    func requests() -> [URLRequest] {
        lock.lock()
        defer { lock.unlock() }
        return stored
    }

}

final class MockURLProtocol: URLProtocol, @unchecked Sendable {
    static let log = MockRequestLog()

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        Self.log.append(request)
        let pairingID = String(repeating: "a", count: 40)
        let statusCode = 200
        let responseBody: String
        switch request.url?.path {
        case "/v1/pairings":
            responseBody = """
            {"pairing_id":"\(pairingID)","polling_secret":"test-polling-secret","server_nonce":"test-server-nonce","verification_phrase":"amber otter","approval_url":"https://aimixmasters.com/?pairing=\(pairingID)"}
            """
        case "/v1/pairings/\(pairingID)/poll":
            responseBody = """
            {"status":"paired","device_id":"device-paired-test","device_credential":"test-device-credential"}
            """
        case "/v1/devices/device-test/checks/generation-one":
            responseBody = """
            {"device_id":"device-test","generation_id":"generation-one","accepted":1}
            """
        default:
            responseBody = "{}"
        }
        let response = HTTPURLResponse(url: request.url!, statusCode: statusCode,
                                        httpVersion: "HTTP/1.1", headerFields: ["content-type": "application/json"])!
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: Data(responseBody.utf8))
        client?.urlProtocolDidFinishLoading(self)
    }

    override func stopLoading() {}
}

@main
struct JournalCheck {
static func main() async {
do {
    let approvedAPI = try LibraryAPIClient.validatedBaseURL("https://aimm-library-api-dev.kevinlelitte.workers.dev/api")
    check(approvedAPI.absoluteString == "https://aimm-library-api-dev.kevinlelitte.workers.dev",
          "approved development API should normalize to its origin")
    let loopbackAPI = try LibraryAPIClient.validatedBaseURL("http://127.0.0.1:8787")
    check(loopbackAPI.absoluteString == "http://127.0.0.1:8787", "local loopback should remain available for development")
    let trustedOrigin = URL(string: "https://aimm-library-api-dev.kevinlelitte.workers.dev")!
    check(LibraryAPIClient.isSameOrigin(
        trustedOrigin, URL(string: "https://aimm-library-api-dev.kevinlelitte.workers.dev/v1/status")!
    ), "same-origin redirects to another path should remain available")
    check(LibraryAPIClient.isSameOrigin(
        trustedOrigin, URL(string: "https://aimm-library-api-dev.kevinlelitte.workers.dev:443/v1/status")!
    ), "an explicit default port is the same origin")
    check(!LibraryAPIClient.isSameOrigin(
        trustedOrigin, URL(string: "http://aimm-library-api-dev.kevinlelitte.workers.dev/v1/status")!
    ), "redirects must not downgrade from HTTPS")
    check(!LibraryAPIClient.isSameOrigin(
        trustedOrigin, URL(string: "https://attacker.example/v1/status")!
    ), "redirects must not change hosts")
    check(!LibraryAPIClient.isSameOrigin(
        trustedOrigin, URL(string: "https://aimm-library-api-dev.kevinlelitte.workers.dev:444/v1/status")!
    ), "redirects must not change ports")
    let vendorFixture = """
    <a href="/download/pro-q">Download FabFilter Pro-Q 4 for macOS (plug-in 4.13)</a>
    <a href="/download/pro-c">Download FabFilter Pro-C 3 for macOS (plug-in 3.02)</a>
    """
    let vendorVersions = FabFilterStatusAdapter.parseVersions(from: vendorFixture)
    check(vendorVersions["pro-q 4"] == "4.13" && vendorVersions["pro-c 3"] == "3.02",
          "the FabFilter parser should extract only product versions from supported download links")
    let fabFilterRecord = PluginRecord(
        id: "/private/FabFilter Pro-Q.component", name: "FabFilter Pro-Q 4",
        bundleIdentifier: "com.fabfilter.ProQ", version: "4.12", format: .audioUnit,
        metadataSource: .infoPlist, localPath: "/private/FabFilter Pro-Q.component"
    )
    let fabFilterCheck = FabFilterStatusAdapter.observation(
        for: fabFilterRecord, recordID: "opaque-record", catalog: vendorVersions,
        checkedAt: "2026-10-24T21:40:00Z"
    )
    check(fabFilterCheck.result == "update" && fabFilterCheck.latestVersion == "4.13" &&
          fabFilterCheck.sourceType == "public_vendor" && fabFilterCheck.route == "vendor_site",
          "a newer public FabFilter version should be recorded as a vendor-site update")
    check(FabFilterStatusAdapter.vendorSiteURL(for: fabFilterRecord)?.absoluteString == "https://www.fabfilter.com/download",
          "vendor-site actions should resolve only to the adapter's fixed official HTTPS destination")
    let unsupportedCheck = FabFilterStatusAdapter.observation(
        for: PluginRecord(id: "local", name: "Other Synth", bundleIdentifier: "com.example.other",
                          version: "1.0", format: .vst3, metadataSource: .infoPlist, localPath: "/local"),
        recordID: "opaque-other", catalog: vendorVersions, checkedAt: "2026-10-24T21:40:00Z"
    )
    check(unsupportedCheck.result == "manual" && unsupportedCheck.sourceType == "manual" &&
          unsupportedCheck.comparisonReason == "manual_check_required",
          "unsupported vendors must remain explicitly Manual Check")
    check(FabFilterStatusAdapter.vendorSiteURL(for: PluginRecord(
        id: "other", name: "Other Synth", bundleIdentifier: "com.example.other", version: "1.0",
        format: .vst3, metadataSource: .infoPlist, localPath: "/other"
    )) == nil, "unsupported vendors must not receive a synthesized website URL")
    let currentFabFilterCheck = FabFilterStatusAdapter.observation(
        for: PluginRecord(id: "current", name: "FabFilter Pro-Q 4", bundleIdentifier: "com.fabfilter.ProQ",
                          version: "4.13", format: .vst3, metadataSource: .infoPlist, localPath: "/current"),
        recordID: "opaque-current", catalog: vendorVersions, checkedAt: "2026-10-24T21:40:00Z"
    )
    check(currentFabFilterCheck.result == "up_to_date" && currentFabFilterCheck.latestVersion == "4.13",
          "an equal installed/public version should be labelled current")
    let failedSource = FabFilterStatusAdapter.sourceFailure(
        for: fabFilterRecord, recordID: "opaque-record", checkedAt: "2026-10-24T21:40:00Z"
    )
    check(failedSource.result == "error" && failedSource.errorCode == "source_unavailable",
          "a failed public source must not be presented as a current version")
    for endpoint in [
        "https://attacker.example",
        "https://aimm-library-api-dev.kevinlelitte.workers.dev.attacker.example",
        "https://aimm-library-api-dev.kevinlelitte.workers.dev:444",
        "https://user@aimm-library-api-dev.kevinlelitte.workers.dev",
        "https://aimm-library-api-dev.kevinlelitte.workers.dev?redirect=https://attacker.example",
        "https://aimm-library-api-dev.kevinlelitte.workers.dev#token"
    ] {
        do {
            _ = try LibraryAPIClient.validatedBaseURL(endpoint)
            check(false, "unsafe API endpoint must be rejected: \(endpoint)")
        } catch DeviceSyncError.invalidEndpoint {
            // Expected: device credentials may only be sent to the approved dev API or loopback.
        }
    }

    let root = FileManager.default.temporaryDirectory
        .appending(path: "aimm-journal-check-\(UUID().uuidString)", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
    defer { try? FileManager.default.removeItem(at: root) }

    let fixtureUserLibrary = root.appending(path: "fixture-user/Library", directoryHint: .isDirectory)
    let fixtureSystemLibrary = root.appending(path: "fixture-system/Library", directoryHint: .isDirectory)
    let userPluginRoot = fixtureUserLibrary.appending(path: "Audio/Plug-Ins", directoryHint: .isDirectory)
    let systemPluginRoot = fixtureSystemLibrary.appending(path: "Audio/Plug-Ins", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: userPluginRoot, withIntermediateDirectories: true)
    try FileManager.default.createDirectory(at: systemPluginRoot, withIntermediateDirectories: true)
    let discoveredRoots = PluginScanner.standardRoots(
        userLibraryURL: fixtureUserLibrary, systemLibraryURL: fixtureSystemLibrary
    )
    check(Set(discoveredRoots.map(\.path)) == Set([userPluginRoot.path, systemPluginRoot.path]),
          "standard folder discovery should include only existing user and system plug-in roots")
    let bookmarkSuiteName = "aimm-plugin-root-test-\(UUID().uuidString)"
    let bookmarkDefaults = UserDefaults(suiteName: bookmarkSuiteName)!
    defer { bookmarkDefaults.removePersistentDomain(forName: bookmarkSuiteName) }
    let savedBookmarkCount = try PluginRootBookmarkStore.save([userPluginRoot], defaults: bookmarkDefaults)
    check(savedBookmarkCount == 1 && PluginRootBookmarkStore.count(defaults: bookmarkDefaults) == 1,
          "a selected custom folder should be persisted as a local security-scoped bookmark")
    let resolvedBookmarks = PluginRootBookmarkStore.resolve(defaults: bookmarkDefaults)
    check(resolvedBookmarks.unavailableCount == 0 && resolvedBookmarks.roots.map { $0.resolvingSymlinksInPath().path } == [userPluginRoot.resolvingSymlinksInPath().path],
          "a saved custom folder bookmark should resolve back to its selected folder (unavailable=\(resolvedBookmarks.unavailableCount), roots=\(resolvedBookmarks.roots.map(\.path)))")
    PluginRootBookmarkStore.forget(defaults: bookmarkDefaults)
    check(PluginRootBookmarkStore.count(defaults: bookmarkDefaults) == 0,
          "forgetting custom folders should remove their local bookmarks")

    let databaseURL = root.appending(path: "Library.sqlite3")
    let record = PluginRecord(
        id: "/selected/AudioUnit/Synth.component",
        name: "Synth",
        bundleIdentifier: "com.example.synth",
        version: "1.2",
        format: .audioUnit,
        metadataSource: .infoPlist,
        localPath: "/selected/AudioUnit/Synth.component"
    )
    let summary = ScanGenerationSummary(
        id: "generation-one", startedAt: "2026-10-24T20:00:00Z",
        completedAt: "2026-10-24T20:00:01Z", rootCount: 1, recordCount: 1
    )
    try ScanJournal(databaseURL: databaseURL).saveCompleteGeneration(summary: summary, records: [record])
    let reopened = try ScanJournal(databaseURL: databaseURL).latestCompleteGeneration()
    check(reopened?.summary == summary, "complete generation should survive journal reopen")
    check(reopened?.records == [record], "plugin records should survive journal reopen")

    let mismatched = ScanGenerationSummary(
        id: "bad-generation", startedAt: "2026-10-24T20:00:02Z",
        completedAt: "2026-10-24T20:00:03Z", rootCount: 1, recordCount: 2
    )
    do {
        try ScanJournal(databaseURL: databaseURL).saveCompleteGeneration(summary: mismatched, records: [record])
        check(false, "mismatched record count must be rejected")
    } catch is ScanJournalError {
        check(true, "mismatched record count rejected")
    }
    let afterRejectedWrite = try ScanJournal(databaseURL: databaseURL).latestCompleteGeneration()
    check(afterRejectedWrite?.summary == summary, "rejected generation must not replace the prior complete generation")
    let config = URLSessionConfiguration.ephemeral
    config.protocolClasses = [MockURLProtocol.self]
    let api = LibraryAPIClient(configuration: config)
    let privatePath = "/Users/kevin/Library/Audio/Plug-Ins/Components/Synth.component"
    let uploadRecord = PluginRecord(
        id: privatePath, name: "Synth", bundleIdentifier: "com.example.synth", version: "1.2",
        format: .audioUnit, metadataSource: .infoPlist, localPath: privatePath
    )
    let credential = StoredDeviceCredential(
        deviceID: "device-test", bearerToken: "test-bearer", privateKey: Data(repeating: 7, count: 32),
        apiBaseURL: "https://aimm-library-api-dev.kevinlelitte.workers.dev"
    )
    try await api.sync(records: [uploadRecord], summary: summary, credential: credential)
    let requests = MockURLProtocol.log.requests()
    check(requests.count == 3, "one-record sync should issue start, one chunk, and finalize")
    check(requests.map { $0.httpMethod ?? "" } == ["POST", "PUT", "POST"],
          "sync should use POST start, PUT chunk, POST finalize")
    check(requests.map { $0.url?.path ?? "" } == [
        "/v1/devices/device-test/inventory/generation-one/start",
        "/v1/devices/device-test/inventory/generation-one/chunks/0",
        "/v1/devices/device-test/inventory/generation-one/finalize"
    ], "sync should target the matching generation endpoints")
    for request in requests {
        check(request.value(forHTTPHeaderField: "authorization") == "Bearer test-bearer",
              "each sync request should carry the device bearer credential")
        check(request.url?.host == "aimm-library-api-dev.kevinlelitte.workers.dev",
              "sync must send credentials only to the approved development host")
        check(request.url?.scheme == "https" && (request.url?.port == nil || request.url?.port == 443),
              "sync must use HTTPS on the approved default port")
        let body = String(data: request.httpBody ?? Data(), encoding: .utf8) ?? ""
        check(!body.contains("localPath") && !body.contains(privatePath),
              "no sync request may disclose the local plug-in path")
    }
    let chunkBody = String(data: requests[1].httpBody ?? Data(), encoding: .utf8) ?? ""
    check(chunkBody.contains("com.example.synth") && chunkBody.contains("Synth"),
          "uploaded inventory should retain useful plug-in metadata")

    let manualCheckClient = LibraryAPIClient(configuration: config)
    let manualCheckCount = try await manualCheckClient.recordManualCheckFallback(
        records: [uploadRecord], generationID: summary.id, credential: credential
    )
    check(manualCheckCount == 1, "the companion should receive an acknowledgment for the manual check status")
    let manualCheckRequest = MockURLProtocol.log.requests().last!
    check(manualCheckRequest.httpMethod == "POST" && manualCheckRequest.value(forHTTPHeaderField: "authorization") == "Bearer test-bearer",
          "manual check observations should use the paired device credential")
    let manualCheckBody = String(data: manualCheckRequest.httpBody ?? Data(), encoding: .utf8) ?? ""
    check(manualCheckBody.contains("\"result\":\"manual\"") && manualCheckBody.contains("\"source_type\":\"manual\"") && manualCheckBody.contains("manual_check_required"),
          "unsupported vendor status should be recorded as Manual Check with an explicit reason")
    check(!manualCheckBody.contains(privatePath) && !manualCheckBody.contains("localPath"),
          "manual check observations must not disclose local paths")

    let vendorCheckClient = LibraryAPIClient(configuration: config)
    let vendorObservation = PluginCheckObservation(
        recordID: LibraryAPIClient.opaqueRecordID(localPath: privatePath, privateKey: credential.privateKey),
        installedVersion: "4.12", latestVersion: "4.13", result: "update", sourceType: "public_vendor",
        checkedAt: "2026-10-24T21:40:00Z", lastGoodAt: "2026-10-24T21:40:00Z",
        route: "vendor_site", comparisonReason: "numeric_version_newer"
    )
    let vendorAccepted = try await vendorCheckClient.submitCheckObservations(
        [vendorObservation], generationID: summary.id, credential: credential
    )
    let vendorRequest = MockURLProtocol.log.requests().last!
    let vendorBody = String(data: vendorRequest.httpBody ?? Data(), encoding: .utf8) ?? ""
    check(vendorAccepted == 1 && vendorBody.contains("public_vendor") && vendorBody.contains("numeric_version_newer") &&
          vendorBody.contains("vendor_site") && vendorBody.contains("\"result\":\"update\""),
          "adapter status should be sent with its public source and conservative comparison evidence")
    check(!vendorBody.contains(privatePath) && !vendorBody.contains("localPath"),
          "vendor status submissions must remain path-free")

    let pairingClient = LibraryAPIClient(configuration: config)
    let pending = try await pairingClient.beginPairing(apiBaseURL: "http://127.0.0.1:8787", deviceName: "Test Mac")
    check(pending.pairingID == String(repeating: "a", count: 40), "pairing should retain the server-issued approval ID")
    check(pending.phrase == "amber otter", "pairing should retain the phrase the owner compares")
    check(pending.approvalURL?.absoluteString == "https://aimixmasters.com/?pairing=\(pending.pairingID)",
          "pairing should open the server-provided owner approval URL")
    let paired = try await pairingClient.waitForPairing(apiBaseURL: "http://127.0.0.1:8787", pending: pending) {}
    check(paired.deviceID == "device-paired-test" && paired.bearerToken == "test-device-credential",
          "the companion should accept the one-time paired device credential")
    check(paired.privateKey == pending.privateKey.rawRepresentation,
          "the paired credential should retain the locally generated private key")
    let pairingRequests = Array(MockURLProtocol.log.requests().suffix(2))
    check(pairingRequests.map { $0.httpMethod ?? "" } == ["POST", "POST"],
          "pairing should create a request and poll for the delivered credential")
    check(pairingRequests.map { $0.url?.path ?? "" } == [
        "/v1/pairings", "/v1/pairings/\(pending.pairingID)/poll"
    ], "pairing should call the create and single-use poll endpoints")
    check(pairingRequests.allSatisfy { $0.value(forHTTPHeaderField: "authorization") == nil },
          "pairing bootstrap must not send an existing bearer credential")
    check(pairingRequests[1].value(forHTTPHeaderField: "x-pairing-secret") == "test-polling-secret",
          "the polling secret should travel in a request header")
    check(pairingRequests.allSatisfy { $0.url?.query == nil && $0.url?.fragment == nil },
          "pairing secrets and IDs must not be placed in URL query or fragment")
    let pairingBody = String(data: pairingRequests[0].httpBody ?? Data(), encoding: .utf8) ?? ""
    check(!pairingBody.contains("test-polling-secret") && !pairingBody.contains("privateKey"),
          "the polling secret and private key must not be serialized into the create request")
    let requestJSON = try JSONSerialization.jsonObject(with: pairingRequests[0].httpBody ?? Data()) as? [String: Any]
    let publicJWK = requestJSON?["public_key"] as? [String: String]
    let xText = publicJWK?["x"] ?? ""
    let yText = publicJWK?["y"] ?? ""
    func decodeBase64URL(_ text: String) -> Data? {
        var value = text.replacingOccurrences(of: "-", with: "+").replacingOccurrences(of: "_", with: "/")
        while value.count % 4 != 0 { value.append("=") }
        return Data(base64Encoded: value)
    }
    guard let xBytes = decodeBase64URL(xText), let yBytes = decodeBase64URL(yText),
          let signatureBytes = decodeBase64URL(requestJSON?["proof_signature"] as? String ?? ""),
          let clientNonce = requestJSON?["client_nonce"] as? String else {
        check(false, "pairing should send a valid public key and proof")
        return
    }
    let publicKey = try P256.Signing.PublicKey(x963Representation: Data([0x04]) + xBytes + yBytes)
    let signature = try P256.Signing.ECDSASignature(rawRepresentation: signatureBytes)
    let fingerprintInput = Data("{\"kty\":\"EC\",\"crv\":\"P-256\",\"x\":\"\(xText)\",\"y\":\"\(yText)\"}".utf8)
    let fingerprint = SHA256.hash(data: fingerprintInput).map { String(format: "%02x", $0) }.joined()
    let proofMessage = Data("AIMM-PAIR-INIT\n\(clientNonce)\n\(fingerprint)".utf8)
    check(publicKey.isValidSignature(signature, for: proofMessage),
          "the companion should sign the server-verifiable pairing proof with its generated key")

    print("PASS: endpoint protections, local journal recovery, private-path-free sync, and key-possession pairing")

    if let localWorkerURL = ProcessInfo.processInfo.environment["AIMM_PAIRING_SMOKE_URL"] {
        let runtimeClient = LibraryAPIClient()
        let runtimePairing = try await runtimeClient.beginPairing(
            apiBaseURL: localWorkerURL, deviceName: "Local companion integration test"
        )
        check((40...64).contains(runtimePairing.pairingID.count),
              "the local Worker should return a valid pairing ID")
        check(runtimePairing.pollingSecret.count >= 40,
              "the local Worker should return a one-time polling secret")
        check(!runtimePairing.phrase.isEmpty && runtimePairing.approvalURL != nil,
              "the local Worker should return the owner-visible phrase and approval URL")
        print("PASS: real Swift pairing client was accepted by local Worker and D1")

        if let syncAPI = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_URL"],
           let deviceID = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_DEVICE_ID"],
           let bearerToken = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_TOKEN"] {
            let started = Date()
            let startedAt = ISO8601DateFormatter().string(from: started)
            let completedAt = ISO8601DateFormatter().string(from: Date())
            let generation = ScanGenerationSummary(
                id: "33333333-3333-4333-8333-333333333333", startedAt: startedAt,
                completedAt: completedAt, rootCount: 1, recordCount: 1
            )
            let path = "/private/tmp/aimm-synthetic-local-worker-fixture/Synth.component"
            let syncedRecord = PluginRecord(
                id: path, name: "Synthetic Local Worker Fixture", bundleIdentifier: "test.aimm.localfixture",
                version: "1.0", format: .audioUnit, metadataSource: .infoPlist, localPath: path
            )
            let syncCredential = StoredDeviceCredential(
                deviceID: deviceID, bearerToken: bearerToken, privateKey: Data(repeating: 9, count: 32),
                apiBaseURL: syncAPI
            )
            try await runtimeClient.sync(records: [syncedRecord], summary: generation, credential: syncCredential)
            print("PASS: real Swift inventory sync was accepted by local Worker and D1")
            let manualCount = try await runtimeClient.recordManualCheckFallback(
                records: [syncedRecord], generationID: generation.id, credential: syncCredential
            )
            check(manualCount == 1, "the local Worker should accept the companion's explicit Manual Check observation")
            print("PASS: real Swift manual-check fallback was accepted by local Worker and D1")
        }

        if let actionAPI = ProcessInfo.processInfo.environment["AIMM_ACTION_SMOKE_URL"],
           let deviceID = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_DEVICE_ID"],
           let bearerToken = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_TOKEN"] {
            let actionCredential = StoredDeviceCredential(
                deviceID: deviceID, bearerToken: bearerToken, privateKey: Data(repeating: 9, count: 32),
                apiBaseURL: actionAPI
            )
            let actionsClient = LibraryAPIClient()
            let commands = try await actionsClient.pendingActions(credential: actionCredential)
            guard let action = commands.first, action.kind == "reveal", action.recordIDs.count == 1,
                  action.generationID == "33333333-3333-4333-8333-333333333333" else {
                check(false, "the local Worker should return the seeded reveal action for this complete generation")
                return
            }
            try await actionsClient.claim(action, credential: actionCredential)
            try await actionsClient.submitRevealReceipt(
                action, recordID: action.recordIDs[0], completed: true, credential: actionCredential
            )
            print("PASS: actual Swift command claim and signed reveal receipt were accepted by local Worker and D1")
        }
    }
} catch {
    fputs("FAIL: \(error.localizedDescription)\n", stderr)
    exit(1)
}
}
}
