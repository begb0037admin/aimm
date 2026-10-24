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
    }
} catch {
    fputs("FAIL: \(error.localizedDescription)\n", stderr)
    exit(1)
}
}
}
