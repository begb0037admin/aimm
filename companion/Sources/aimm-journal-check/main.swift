@_spi(Testing) import AIMMCompanionCore
import Foundation
import CryptoKit
#if canImport(Darwin)
import Darwin
#endif
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

func localWorkerFixturePath(_ child: String) -> String {
    let fallback = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
        .appending(path: "pluginhub-local-worker-fixture", directoryHint: .isDirectory).path
    let root = ProcessInfo.processInfo.environment["AIMM_SYNTHETIC_LOCAL_FIXTURE_ROOT"] ?? fallback
    return URL(fileURLWithPath: root, isDirectory: true).appending(path: child).path
}

func check(_ condition: @autoclosure () -> Bool, _ message: String) {
    guard condition() else {
        fputs("FAIL: \(message)\n", stderr)
        exit(1)
    }
}

func writeBigEndian(_ value: UInt64, into data: inout Data, at offset: Int, byteCount: Int) {
    for index in 0..<byteCount {
        let shift = (byteCount - index - 1) * 8
        data[offset + index] = UInt8((value >> UInt64(shift)) & 0xff)
    }
}

func installerByteStream(_ data: Data) -> AsyncThrowingStream<UInt8, Error> {
    AsyncThrowingStream { continuation in
        for byte in data { continuation.yield(byte) }
        continuation.finish()
    }
}

func installerHTTPResponse(_ url: URL, statusCode: Int = 200,
                           headers: [String: String]) -> HTTPURLResponse {
    HTTPURLResponse(url: url, statusCode: statusCode, httpVersion: "HTTP/1.1", headerFields: headers)!
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

final class CrossVolumeMoveFileManager: FileManager {
    private let simulatedSourcePath: String
    private(set) var simulatedCrossVolumeFailure = false

    init(simulatedSourcePath: String) {
        self.simulatedSourcePath = simulatedSourcePath
        super.init()
    }

    override func moveItem(at srcURL: URL, to dstURL: URL) throws {
        if srcURL.standardizedFileURL.path == simulatedSourcePath && !simulatedCrossVolumeFailure {
            simulatedCrossVolumeFailure = true
            throw POSIXError(.EXDEV)
        }
        try super.moveItem(at: srcURL, to: dstURL)
    }
}

final class InterruptedRestoreCopyFileManager: FileManager {
    private let sourcePath: String
    private(set) var interruptedAfterStagingCopy = false

    init(sourcePath: String) {
        self.sourcePath = URL(fileURLWithPath: sourcePath).standardizedFileURL.path
        super.init()
    }

    override func moveItem(at srcURL: URL, to dstURL: URL) throws {
        let source = srcURL.standardizedFileURL.path
        if source == sourcePath {
            throw POSIXError(.EXDEV)
        }
        if source.contains(".aimm-restore-") && source.hasSuffix(".partial") && !interruptedAfterStagingCopy {
            interruptedAfterStagingCopy = true
            throw POSIXError(.EIO)
        }
        try super.moveItem(at: srcURL, to: dstURL)
    }
}

@main
struct JournalCheck {
static func main() async {
do {
    if CommandLine.arguments.contains("--live-valhalla") {
        let liveVersions = try await ValhallaPublicCatalogClient.shared.latestVersions()
        let requiredProducts = Set(ValhallaStatusAdapter.productPages.keys)
        let availableProducts = Set(liveVersions.keys)
        check(requiredProducts.isSubset(of: availableProducts),
              "the live Valhalla check must parse every allowlisted public product page")
        print("PASS: live Valhalla public pages returned versions for \(requiredProducts.count) allowlisted products.")
    }
    if CommandLine.arguments.contains("--live-fabfilter-route") {
        let artifact = try await FabFilterPublicCatalogClient.shared.currentMacInstaller(for: "pro-q 4")
        check(artifact.productKey == "pro-q 4" && !artifact.version.isEmpty,
              "the live FabFilter route must identify the current Pro-Q 4 release")
        check(artifact.url.scheme == "https" && artifact.url.host == "cdn-b.fabfilter.com" &&
              artifact.url.pathExtension.lowercased() == "dmg",
              "the live FabFilter route must resolve to the allowlisted macOS DMG host")
        print("PASS: live FabFilter Pro-Q 4 version \(artifact.version) resolves to an allowlisted macOS DMG route; no file downloaded.")
    }
    if CommandLine.arguments.contains("--live-vendor-status") {
        let fabFilter = try await FabFilterPublicCatalogClient.shared.latestVersions()
        let voxengo = try await VoxengoPublicCatalogClient.shared.latestVersions()
        let uhe = try await UHePublicCatalogClient.shared.latestVersions()
        let valhalla = try await ValhallaPublicCatalogClient.shared.latestVersions()
        check(fabFilter["pro-q 4"] != nil, "the live FabFilter status page must include Pro-Q 4")
        check(!voxengo.isEmpty, "the live Voxengo page must return at least one supported Mac product")
        check(!uhe.isEmpty, "the live u-he pages must return at least one supported product version")
        check(Set(ValhallaStatusAdapter.productPages.keys).isSubset(of: Set(valhalla.keys)),
              "the live Valhalla pages must return all four supported product versions")
        print("PASS: live vendor status pages parsed FabFilter \(fabFilter.count), Voxengo \(voxengo.count), u-he \(uhe.count), and Valhalla DSP \(valhalla.count) products.")
    }

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
    let fabFilterInstallerFixture = """
    <a href="/products/pro-q-4">Download FabFilter Pro-Q 4 High-quality equalizer plug-in 4.13 — Jun 25, 2026</a>
    <a href="https://cdn-b.fabfilter.com/downloads/ffproq413.dmg">Download for macOS</a>
    <a href="https://cdn-b.fabfilter.com/downloads/ffproq413.exe">Download for Windows (64-bit)</a>
    <a href="/products/pro-c-3">Download FabFilter Pro-C 3 High-quality compressor plug-in 3.02 — Apr 16, 2026</a>
    <a href="https://cdn-b.fabfilter.com/downloads/ffproc302.dmg">Download for macOS</a>
    """
    let fabFilterArtifacts = FabFilterStatusAdapter.parseMacInstallerArtifacts(from: fabFilterInstallerFixture)
    check(fabFilterArtifacts["pro-q 4"]?.version == "4.13" &&
          fabFilterArtifacts["pro-q 4"]?.url.absoluteString == "https://cdn-b.fabfilter.com/downloads/ffproq413.dmg" &&
          fabFilterArtifacts["pro-c 3"]?.filename == "ffproc302.dmg",
          "FabFilter installer routes should bind the current product version to the official Mac DMG")
    let unsafeFabFilterInstallerFixture = """
    <a href="/products/pro-q-4">Download FabFilter Pro-Q 4 High-quality equalizer plug-in 4.13 — Jun 25, 2026</a>
    <a href="https://downloads.attacker.example/ffproq413.dmg">Download for macOS</a>
    """
    check(FabFilterStatusAdapter.parseMacInstallerArtifacts(from: unsafeFabFilterInstallerFixture).isEmpty,
          "a Mac-labeled URL outside the fixed official vendor CDN must not be accepted")
    let fabFilterArtifactClient = FabFilterPublicCatalogClient(pageFetcher: { request in
        guard let url = request.url else { throw DeviceSyncError.rejected("missing FabFilter test URL") }
        let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1",
                                       headerFields: ["content-type": "text/html; charset=utf-8"])!
        return (Data(fabFilterInstallerFixture.utf8), response)
    })
    let currentFabFilterArtifact = try await fabFilterArtifactClient.currentMacInstaller(for: "pro-q 4")
    check(currentFabFilterArtifact.version == "4.13" &&
          currentFabFilterArtifact.url.absoluteString == "https://cdn-b.fabfilter.com/downloads/ffproq413.dmg",
          "the live catalog client should return only the current official Pro-Q 4 Mac artifact")
    let installerFixtureRoot = FileManager.default.temporaryDirectory
        .appending(path: "aimm-installer-download-check-\(UUID().uuidString)", directoryHint: .isDirectory)
    let installerDownloadDirectory = installerFixtureRoot.appending(path: "downloads", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: installerDownloadDirectory, withIntermediateDirectories: true)
    defer { try? FileManager.default.removeItem(at: installerFixtureRoot) }
    var syntheticDMG = Data(repeating: 0, count: 1024)
    syntheticDMG.replaceSubrange(512..<516, with: Data("koly".utf8))
    writeBigEndian(4, into: &syntheticDMG, at: 516, byteCount: 4)
    writeBigEndian(512, into: &syntheticDMG, at: 520, byteCount: 4)
    writeBigEndian(512, into: &syntheticDMG, at: 544, byteCount: 8)
    writeBigEndian(1, into: &syntheticDMG, at: 568, byteCount: 4)
    writeBigEndian(1, into: &syntheticDMG, at: 572, byteCount: 4)
    let validSyntheticDMG = syntheticDMG
    let syntheticDigest = SHA256.hash(data: validSyntheticDMG).map { String(format: "%02x", $0) }.joined()
    let trustedInstallerRoute = try VerifiedInstallerRoute(
        artifact: currentFabFilterArtifact,
        allowedHosts: ["cdn-b.fabfilter.com"],
        expectedSHA256: syntheticDigest,
        maximumBytes: 4096
    )
    let installerHeaders = [
        "content-type": "application/x-apple-diskimage",
        "content-length": String(validSyntheticDMG.count)
    ]
    let installerResponse = installerHTTPResponse(currentFabFilterArtifact.url, headers: installerHeaders)
    let installerReceipt = try await VerifiedInstallerDownload.saveFixture(
        route: trustedInstallerRoute, into: installerDownloadDirectory,
        response: installerResponse, bytes: installerByteStream(validSyntheticDMG)
    )
    let leftoverInstallerStages = try FileManager.default.contentsOfDirectory(atPath: installerDownloadDirectory.path)
        .filter { $0.hasPrefix(".aimm-installer-stage-") }
    let receiptDescriptor = open(installerReceipt.fileURL.path, O_RDONLY | O_NOFOLLOW)
    var receiptFileInfo = stat()
    let receiptIdentityMatches = receiptDescriptor >= 0 && fstat(receiptDescriptor, &receiptFileInfo) == 0 &&
        installerReceipt.deviceID == UInt64(receiptFileInfo.st_dev) &&
        installerReceipt.fileID == UInt64(receiptFileInfo.st_ino)
    if receiptDescriptor >= 0 { _ = close(receiptDescriptor) }
    check(installerReceipt.sha256 == syntheticDigest && installerReceipt.byteCount == 1024 &&
          installerReceipt.fileURL.lastPathComponent == "ffproq413.dmg" &&
          FileManager.default.fileExists(atPath: installerReceipt.fileURL.path) && leftoverInstallerStages.isEmpty &&
          receiptIdentityMatches,
          "a trusted synthetic disk image should be verified, atomically published, identity-pinned in its receipt, and leave no private staging directory")
    let renamedDownloadDirectory = installerFixtureRoot.appending(path: "renamed-downloads", directoryHint: .isDirectory)
    let replacementDownloadDirectory = installerFixtureRoot.appending(path: "replacement-downloads", directoryHint: .isDirectory)
    let swappedDownloadDirectory = installerFixtureRoot.appending(path: "swapped-downloads", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: renamedDownloadDirectory, withIntermediateDirectories: true)
    try FileManager.default.createDirectory(at: replacementDownloadDirectory, withIntermediateDirectories: true)
    var staleReceiptPathRejected = false
    do {
        _ = try await VerifiedInstallerDownload.saveFixture(
            route: trustedInstallerRoute, into: renamedDownloadDirectory,
            response: installerResponse, bytes: installerByteStream(validSyntheticDMG),
            beforeResponse: {
                try? FileManager.default.moveItem(at: renamedDownloadDirectory, to: swappedDownloadDirectory)
                try? FileManager.default.createSymbolicLink(at: renamedDownloadDirectory,
                                                            withDestinationURL: replacementDownloadDirectory)
            })
    } catch VerifiedInstallerDownloadError.unsafeDestination {
        staleReceiptPathRejected = true
    }
    check(staleReceiptPathRejected &&
          !FileManager.default.fileExists(atPath: swappedDownloadDirectory.appending(path: "ffproq413.dmg").path) &&
          !FileManager.default.fileExists(atPath: replacementDownloadDirectory.appending(path: "ffproq413.dmg").path),
          "moving or replacing the selected folder during transfer must reject a stale receipt path and remove the unpublished result")
    let sharedInstallerDirectory = installerFixtureRoot.appending(path: "shared-downloads", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: sharedInstallerDirectory, withIntermediateDirectories: true)
    try FileManager.default.setAttributes([.posixPermissions: 0o777], ofItemAtPath: sharedInstallerDirectory.path)
    var sharedWritableDirectoryRejected = false
    do {
        _ = try await VerifiedInstallerDownload.saveFixture(
            route: trustedInstallerRoute, into: sharedInstallerDirectory,
            response: installerResponse, bytes: installerByteStream(validSyntheticDMG))
    } catch VerifiedInstallerDownloadError.unsafeDestination {
        sharedWritableDirectoryRejected = true
    }
    let sharedDirectoryEntries = try FileManager.default.contentsOfDirectory(atPath: sharedInstallerDirectory.path)
    check(sharedWritableDirectoryRejected &&
          sharedDirectoryEntries.isEmpty,
          "a group/world-writable destination must be rejected before creating a staging entry")
    let aclSharedDirectory = installerFixtureRoot.appending(path: "acl-shared-downloads", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: aclSharedDirectory, withIntermediateDirectories: true)
    let aclProbe = Process()
    aclProbe.executableURL = URL(fileURLWithPath: "/bin/chmod")
    aclProbe.arguments = ["+a", "everyone allow add_file,delete_child", aclSharedDirectory.path]
    try aclProbe.run()
    aclProbe.waitUntilExit()
    var aclSharedDirectoryRejected = false
    if aclProbe.terminationStatus == 0 {
        do {
            _ = try await VerifiedInstallerDownload.saveFixture(
                route: trustedInstallerRoute, into: aclSharedDirectory,
                response: installerResponse, bytes: installerByteStream(validSyntheticDMG))
        } catch VerifiedInstallerDownloadError.unsafeDestination {
            aclSharedDirectoryRejected = true
        }
    }
    check(aclProbe.terminationStatus == 0 && aclSharedDirectoryRejected,
          "an ACL granting shared directory write/delete access must be rejected")
    let rejectedDigestDirectory = installerFixtureRoot.appending(path: "bad-digest", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: rejectedDigestDirectory, withIntermediateDirectories: true)
    let badDigestRoute = try VerifiedInstallerRoute(
        artifact: currentFabFilterArtifact,
        allowedHosts: ["cdn-b.fabfilter.com"],
        expectedSHA256: String(repeating: "0", count: 64),
        maximumBytes: 4096
    )
    var digestMismatchRejected = false
    do {
        _ = try await VerifiedInstallerDownload.saveFixture(route: badDigestRoute,
            into: rejectedDigestDirectory, response: installerResponse,
            bytes: installerByteStream(validSyntheticDMG))
    } catch VerifiedInstallerDownloadError.digestMismatch {
        digestMismatchRejected = true
    }
    check(digestMismatchRejected &&
          !FileManager.default.fileExists(atPath: rejectedDigestDirectory.appending(path: "ffproq413.dmg").path),
          "a digest mismatch must not publish an installer into the managed download folder")
    let hostileURL = URL(string: "https://downloads.attacker.example/ffproq413.dmg")!
    var hostileRedirectRejected = false
    do {
        let hostileResponse = installerHTTPResponse(hostileURL, headers: ["content-type": "application/octet-stream"])
        _ = try await VerifiedInstallerDownload.saveFixture(route: trustedInstallerRoute,
            into: rejectedDigestDirectory, response: hostileResponse,
            bytes: installerByteStream(validSyntheticDMG))
    } catch VerifiedInstallerDownloadError.redirectRejected {
        hostileRedirectRejected = true
    }
    check(hostileRedirectRejected &&
          !VerifiedInstallerDownload.allowsRedirectForTesting(to: hostileURL,
              allowedHosts: ["cdn-b.fabfilter.com"]) &&
          !FileManager.default.fileExists(atPath: rejectedDigestDirectory.appending(path: "ffproq413.dmg").path),
          "an unapproved redirect must be rejected by the URLSession redirect policy and final response check")
    let actualRedirectDelegateRejected = await VerifiedInstallerDownload.redirectDelegateRejectsBeforeSecondRequestForTesting()
    check(actualRedirectDelegateRejected,
          "the actual URLSession redirect delegate must reject a hostile redirect before a request reaches its host")
    let oversizedHeaders = ["content-type": "application/octet-stream"]
    let smallLimitRoute = try VerifiedInstallerRoute(artifact: currentFabFilterArtifact,
        allowedHosts: ["cdn-b.fabfilter.com"], expectedSHA256: syntheticDigest, maximumBytes: 1024)
    var streamedSizeRejected = false
    do {
        _ = try await VerifiedInstallerDownload.saveFixture(route: smallLimitRoute,
            into: rejectedDigestDirectory,
            response: installerHTTPResponse(currentFabFilterArtifact.url, headers: oversizedHeaders),
            bytes: installerByteStream(Data(repeating: 0x41, count: 8192)))
    } catch VerifiedInstallerDownloadError.sizeRejected {
        streamedSizeRejected = true
    }
    let partialsAfterOversize = try FileManager.default.contentsOfDirectory(atPath: rejectedDigestDirectory.path)
        .filter { $0.hasSuffix(".partial") }
    let stagesAfterOversize = try FileManager.default.contentsOfDirectory(atPath: rejectedDigestDirectory.path)
        .filter { $0.hasPrefix(".aimm-installer-stage-") }
    check(streamedSizeRejected && partialsAfterOversize.isEmpty && stagesAfterOversize.isEmpty,
          "an oversized chunked response must stop at the configured byte limit and remove its private staging area")
    var missingContentTypeRejected = false
    do {
        _ = try await VerifiedInstallerDownload.saveFixture(route: trustedInstallerRoute,
            into: rejectedDigestDirectory,
            response: installerHTTPResponse(currentFabFilterArtifact.url, headers: [:]),
            bytes: installerByteStream(validSyntheticDMG))
    } catch VerifiedInstallerDownloadError.httpRejected {
        missingContentTypeRejected = true
    }
    check(missingContentTypeRejected, "a missing content type must fail closed before body staging")
    var malformedDMG = Data(repeating: 0, count: 1024)
    malformedDMG.replaceSubrange(512..<516, with: Data("koly".utf8))
    var malformedDMGRejected = false
    do {
        _ = try await VerifiedInstallerDownload.saveFixture(route: trustedInstallerRoute,
            into: rejectedDigestDirectory,
            response: installerHTTPResponse(currentFabFilterArtifact.url,
                headers: ["content-type": "application/x-apple-diskimage"]),
            bytes: installerByteStream(malformedDMG))
    } catch VerifiedInstallerDownloadError.invalidDiskImage {
        malformedDMGRejected = true
    }
    check(malformedDMGRejected, "a trailer marker without a structurally valid DMG footer must be rejected")
    print("PASS: direct installer transfer enforces descriptor-anchored staging, no-replace publication, actual redirect-delegate rejection, streaming limits, DMG structure and trusted digest; no live installer downloaded.")
    var unsupportedArtifactRejected = false
    do {
        _ = try await fabFilterArtifactClient.currentMacInstaller(for: "pro-q 3")
    } catch {
        unsupportedArtifactRejected = true
    }
    check(unsupportedArtifactRejected, "direct installer routing must stay disabled for unverified products")
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
    let voxengoFixture = """
    <h2><a href="/product/bms/">Voxengo BMS</a></h2>
    <p>Version 2.7, April 10, 2026</p>
    <a href="/download/bms-mac">Download AU, AAX, VST3 for Mac</a>
    <h2><a href="/product/span/">Voxengo SPAN</a></h2>
    <p>Version 3.24, April 4, 2026</p>
    <a href="/download/span-mac">Download AU, AAX, VST3 for Mac</a>
    <h2><a href="/product/other/">Voxengo Other</a></h2>
    <p>Version 1.2, April 1, 2026</p>
    <a href="/download/other-win">Download VST3 for Windows</a>
    """
    let voxengoVersions = VoxengoStatusAdapter.parseVersions(from: voxengoFixture)
    check(voxengoVersions["bms"] == "2.7" && voxengoVersions["span"] == "3.24" &&
          voxengoVersions["other"] == nil,
          "the Voxengo parser should accept only product sections that advertise Mac downloads")
    let voxengoRecord = PluginRecord(
        id: "voxengo", name: "Voxengo BMS", bundleIdentifier: "com.voxengo.bms",
        version: "2.6", format: .audioUnit, metadataSource: .infoPlist, localPath: "/private/Voxengo BMS.component"
    )
    let voxengoCheck = VoxengoStatusAdapter.observation(
        for: voxengoRecord, recordID: "opaque-voxengo", catalog: voxengoVersions,
        checkedAt: "2026-10-24T22:10:00Z"
    )
    check(voxengoCheck.result == "update" && voxengoCheck.latestVersion == "2.7" &&
          voxengoCheck.sourceType == "public_vendor" && voxengoCheck.route == "vendor_site",
          "a newer public Voxengo version should be recorded as a vendor-site update")
    check(VoxengoStatusAdapter.vendorSiteURL(for: voxengoRecord)?.absoluteString == "https://www.voxengo.com/downloads/",
          "Voxengo site actions must use the fixed official HTTPS destination")
    let currentVoxengoCheck = VoxengoStatusAdapter.observation(
        for: PluginRecord(id: "voxengo-current", name: "Voxengo SPAN", bundleIdentifier: "com.voxengo.span",
                          version: "3.24", format: .vst3, metadataSource: .infoPlist, localPath: "/current"),
        recordID: "opaque-voxengo-current", catalog: voxengoVersions, checkedAt: "2026-10-24T22:10:00Z"
    )
    check(currentVoxengoCheck.result == "up_to_date" && currentVoxengoCheck.latestVersion == "3.24",
          "an equal installed/public Voxengo version should be labelled current")
    let unsupportedVoxengoCheck = VoxengoStatusAdapter.observation(
        for: PluginRecord(id: "voxengo-other", name: "Voxengo Other", bundleIdentifier: "com.voxengo.other",
                          version: "1.0", format: .vst3, metadataSource: .infoPlist, localPath: "/other"),
        recordID: "opaque-voxengo-other", catalog: voxengoVersions, checkedAt: "2026-10-24T22:10:00Z"
    )
    check(unsupportedVoxengoCheck.result == "manual" && unsupportedVoxengoCheck.latestVersion == nil,
          "Voxengo products without a supported Mac catalog entry must remain Manual Check")
    let failedVoxengoSource = VoxengoStatusAdapter.sourceFailure(
        for: voxengoRecord, recordID: "opaque-voxengo", checkedAt: "2026-10-24T22:10:00Z"
    )
    check(failedVoxengoSource.result == "error" && failedVoxengoSource.errorCode == "source_unavailable",
          "a failed Voxengo source must not be presented as a current version")
    check(VoxengoStatusAdapter.parseVersions(from: "<h2>Voxengo BMS</h2><p>Unknown</p>") .isEmpty,
          "an unrecognized Voxengo page must not produce a version claim")
    let uHePages = [
        "diva": "<p>Diva 1.4.8 (revision 16519)</p><p>macOS: AUv2, VST3</p>",
        "hive 2": "<p>Hive 2 2.1.2 (revision 16520)</p><p>macOS: AUv2, VST3</p>",
        "zebra 3": "<p>Version 3.0.2 (rev. 22175)</p><p>macOS: AUv2, VST3</p>"
    ]
    let uHeVersions = UHeStatusAdapter.parseVersions(fromPages: uHePages)
    check(uHeVersions == ["diva": "1.4.8", "hive 2": "2.1.2", "zebra 3": "3.0.2"],
          "u-he fixtures should parse only supported current product versions with macOS support")
    let partialUHeClient = UHePublicCatalogClient(pageFetcher: { request in
        guard let url = request.url else { throw DeviceSyncError.rejected("missing test URL") }
        let html: String
        switch url.path {
        case "/products/diva": html = uHePages["diva"]!
        case "/products/hive": throw DeviceSyncError.rejected("simulated Hive page outage")
        case "/products/plug-ins/zebra3": html = uHePages["zebra 3"]!
        default: throw DeviceSyncError.rejected("unexpected u-he test URL")
        }
        let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1",
                                        headerFields: ["content-type": "text/html; charset=utf-8"])!
        return (Data(html.utf8), response)
    })
    let partialUHeVersions = try await partialUHeClient.latestVersions(now: Date(timeIntervalSince1970: 1_798_000_000))
    check(partialUHeVersions == ["diva": "1.4.8", "zebra 3": "3.0.2"],
          "one failed u-he page must not discard valid versions fetched from other official pages")
    let divaRecord = PluginRecord(id: "diva", name: "Diva", bundleIdentifier: "com.u-he.Diva",
                                  version: "1.4.7", format: .audioUnit, metadataSource: .infoPlist, localPath: "/local/Diva.component")
    let divaCheck = UHeStatusAdapter.observation(for: divaRecord, recordID: "opaque-diva", catalog: uHeVersions,
                                                 checkedAt: "2026-10-24T22:20:00Z")
    check(divaCheck.result == "update" && divaCheck.latestVersion == "1.4.8" && divaCheck.route == "vendor_site",
          "a newer u-he product release should be recorded as a vendor-site update")
    check(UHeStatusAdapter.vendorSiteURL(for: divaRecord)?.absoluteString == "https://u-he.com/products/diva/",
          "u-he product routes must use the fixed official product page")
    let zebraCurrent = UHeStatusAdapter.observation(
        for: PluginRecord(id: "zebra", name: "Zebra 3", bundleIdentifier: "com.u-he.Zebra3", version: "3.0.2",
                          format: .vst3, metadataSource: .infoPlist, localPath: "/local/Zebra3.vst3"),
        recordID: "opaque-zebra", catalog: uHeVersions, checkedAt: "2026-10-24T22:20:00Z"
    )
    check(zebraCurrent.result == "up_to_date" && zebraCurrent.latestVersion == "3.0.2",
          "an equal installed/u-he release should be labelled current")
    let unsupportedUHe = UHeStatusAdapter.observation(
        for: PluginRecord(id: "unsupported", name: "Podolski", bundleIdentifier: "com.u-he.Podolski", version: "1.0",
                          format: .vst3, metadataSource: .infoPlist, localPath: "/local/Podolski.vst3"),
        recordID: "opaque-podolski", catalog: uHeVersions, checkedAt: "2026-10-24T22:20:00Z"
    )
    check(unsupportedUHe.result == "manual" && unsupportedUHe.sourceType == "manual",
          "unsupported u-he products must remain Manual Check")
    let partialHiveCheck = UHeStatusAdapter.observation(
        for: PluginRecord(id: "hive", name: "Hive 2", bundleIdentifier: "com.u-he.Hive2", version: "2.1.1",
                          format: .vst3, metadataSource: .infoPlist, localPath: "/local/Hive2.vst3"),
        recordID: "opaque-hive", catalog: ["diva": "1.4.8", "zebra 3": "3.0.2"],
        checkedAt: "2026-10-24T22:24:00Z"
    )
    check(partialHiveCheck.result == "error" && partialHiveCheck.errorCode == "source_unavailable" &&
          partialHiveCheck.sourceType == "public_vendor",
          "a failed u-he product page should mark that product unavailable without suppressing other page results (result=\(partialHiveCheck.result), error=\(partialHiveCheck.errorCode ?? "nil"), source=\(partialHiveCheck.sourceType))")
    let partialDivaCheck = UHeStatusAdapter.observation(
        for: divaRecord, recordID: "opaque-diva", catalog: ["diva": "1.4.8"],
        checkedAt: "2026-10-24T22:24:00Z"
    )
    check(partialDivaCheck.result == "update" && partialDivaCheck.latestVersion == "1.4.8",
          "a valid u-he page should still produce an update observation when another product page is unavailable")
    let failedUHe = UHeStatusAdapter.sourceFailure(for: divaRecord, recordID: "opaque-diva", checkedAt: "2026-10-24T22:20:00Z")
    check(failedUHe.result == "error" && failedUHe.errorCode == "source_unavailable",
          "failed u-he source reads must remain errors rather than current versions")

    let valhallaPages = [
        "vintageverb": "<p>Current Version: 4.0.5 (Updated March 15th, 2024)</p>",
        "room": "<p>Current Version: 2.0.5 (Updated March 15th, 2024)</p>",
        "delay": "<p>Current Version: 3.0.5 (updated May 20th, 2025)</p>",
        "supermassive": "<p>Current Version: 5.0.0 (Updated November 26th, 2025)</p>"
    ]
    let valhallaVersions = ValhallaStatusAdapter.parseVersions(fromPages: valhallaPages)
    check(valhallaVersions == valhallaPages.mapValues { html in
        if html.contains("4.0.5") { return "4.0.5" }
        if html.contains("2.0.5") { return "2.0.5" }
        if html.contains("3.0.5") { return "3.0.5" }
        return "5.0.0"
    }, "Valhalla fixtures should parse only current versions from the fixed supported product pages")
    let valhallaRecord = PluginRecord(
        id: "valhalla", name: "ValhallaVintageVerb", bundleIdentifier: "com.valhalladsp.ValhallaVintageVerb",
        version: "4.0.4", format: .audioUnit, metadataSource: .infoPlist, localPath: "/local/ValhallaVintageVerb.component"
    )
    let valhallaCheck = ValhallaStatusAdapter.observation(
        for: valhallaRecord, recordID: "opaque-valhalla", catalog: valhallaVersions,
        checkedAt: "2026-10-25T07:50:00Z"
    )
    check(valhallaCheck.result == "update" && valhallaCheck.latestVersion == "4.0.5" &&
          valhallaCheck.sourceType == "public_vendor" && valhallaCheck.route == "vendor_site",
          "a newer public Valhalla version should be recorded as a vendor-site update")
    check(ValhallaStatusAdapter.vendorSiteURL(for: valhallaRecord)?.absoluteString == "https://valhalladsp.com/shop/reverb/valhalla-vintage-verb/",
          "Valhalla vendor-page actions must use a fixed official product page")
    check(VendorSiteActionAdapter.vendorSiteURL(for: valhallaRecord)?.absoluteString == "https://valhalladsp.com/shop/reverb/valhalla-vintage-verb/" &&
          VendorSiteActionAdapter.vendorName(for: valhallaRecord) == "Valhalla DSP",
          "the companion action dispatcher must resolve the same fixed Valhalla vendor route")
    let valhallaClient = ValhallaPublicCatalogClient(pageFetcher: { request in
        guard let url = request.url,
              let key = ValhallaStatusAdapter.productPages.first(where: { $0.value.path == url.path })?.key,
              let html = valhallaPages[key] else { throw DeviceSyncError.rejected("unexpected Valhalla test URL") }
        let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1",
                                       headerFields: ["content-type": "text/html; charset=utf-8"])!
        return (Data(html.utf8), response)
    })
    let fetchedValhallaVersions = try await valhallaClient.latestVersions()
    check(fetchedValhallaVersions == valhallaVersions,
          "the Valhalla catalog client should accept only fixed official product pages")
    let failedValhalla = ValhallaStatusAdapter.observation(
        for: PluginRecord(id: "supermassive", name: "ValhallaSupermassive", bundleIdentifier: "com.valhalladsp.Supermassive",
                          version: "4.0.0", format: .vst3, metadataSource: .infoPlist, localPath: "/local/Supermassive.vst3"),
        recordID: "opaque-supermassive", catalog: [:], checkedAt: "2026-10-25T07:50:00Z"
    )
    check(failedValhalla.result == "error" && failedValhalla.errorCode == "source_unavailable",
          "a failed Valhalla product page must not be reported as up to date")
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

    let duplicateRecords = [
        PluginRecord(id: "/user/ProQ.component", name: "Pro-Q", bundleIdentifier: "com.vendor.ProQ",
            version: "4.0", format: .audioUnit, metadataSource: .infoPlist,
            localPath: "/user/ProQ.component"),
        PluginRecord(id: "/system/ProQ.component", name: "Pro-Q", bundleIdentifier: "COM.VENDOR.PROQ",
            version: "3.9", format: .audioUnit, metadataSource: .infoPlist,
            localPath: "/system/ProQ.component"),
        PluginRecord(id: "/user/ProQ.vst3", name: "Pro-Q", bundleIdentifier: "com.vendor.ProQ",
            version: "4.0", format: .vst3, metadataSource: .infoPlist,
            localPath: "/user/ProQ.vst3"),
        PluginRecord(id: "/user/Unknown.component", name: "Unknown", bundleIdentifier: nil,
            version: nil, format: .audioUnit, metadataSource: .filenameOnly,
            localPath: "/user/Unknown.component")
    ]
    let duplicateGroups = DuplicateAnalyzer.analyze(duplicateRecords)
    check(duplicateGroups.count == 1 && duplicateGroups[0].format == .audioUnit &&
          duplicateGroups[0].extraCopies.count == 1 &&
          duplicateGroups[0].extraCopies[0].localPath == "/user/ProQ.component" &&
          duplicateGroups[0].primary.localPath == "/system/ProQ.component",
          "duplicate analysis should group case-insensitive matching bundle IDs within one format and select one deterministic primary")
    check(DuplicateAnalyzer.analyze([duplicateRecords[0], duplicateRecords[2]]).isEmpty &&
          DuplicateAnalyzer.analyze([duplicateRecords[3]]).isEmpty,
          "duplicate analysis should not confuse formats or infer identity without a bundle ID")
    check(DuplicateAnalyzer.analyze(duplicateRecords) == DuplicateAnalyzer.analyze(Array(duplicateRecords.reversed())),
          "duplicate analysis should have stable output independent of scan result order")
    print("PASS: duplicate analysis is local, bundle-ID and format bound, deterministic, and informational only")

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

    let actionJournal = try ScanJournal(databaseURL: databaseURL)
    let actionRoot = root.appending(path: "local-file-actions", directoryHint: .isDirectory)
    let unusedRoot = actionRoot.appending(path: "Unused", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: unusedRoot, withIntermediateDirectories: true)
    let actionGenerationID = UUID().uuidString
    let actionRecordID = UUID().uuidString
    let actionScanTime = ISO8601DateFormatter().string(from: Date(timeIntervalSince1970: 1_793_000_000))
    try actionJournal.saveCompleteGeneration(
        summary: ScanGenerationSummary(id: actionGenerationID, startedAt: actionScanTime,
                                       completedAt: actionScanTime, rootCount: 1, recordCount: 0),
        records: []
    )
    func makeActionItem(_ name: String, _ body: String) throws -> URL {
        let item = actionRoot.appending(path: name, directoryHint: .isDirectory)
        try FileManager.default.createDirectory(at: item, withIntermediateDirectories: true)
        try Data(body.utf8).write(to: item.appending(path: "Contents.bin"))
        return item
    }

    let movableItem = try makeActionItem("Synth.component", "fixture-v1")
    let moveOperationID = UUID().uuidString
    let move = try LocalPluginFileActions.moveToUnused(
        operationID: moveOperationID, generationID: actionGenerationID, recordID: actionRecordID,
        source: movableItem, unusedDirectory: unusedRoot, journal: actionJournal,
        now: Date(timeIntervalSince1970: 1_793_000_000)
    )
    let movedItem = unusedRoot.appending(path: "Synth.component", directoryHint: .isDirectory)
    check(move.state == "completed" && !move.replay &&
          !FileManager.default.fileExists(atPath: movableItem.path) &&
          FileManager.default.fileExists(atPath: movedItem.path),
          "move-to-Unused should move one synthetic plug-in bundle and retain its destination")
    let movedDigest = try LocalPluginFileActions.treeDigest(movedItem)
    check(movedDigest == move.treeDigest,
          "move-to-Unused should verify the complete destination tree digest")
    let postMoveGenerationID = UUID().uuidString
    let postMoveScanTime = ISO8601DateFormatter().string(from: Date(timeIntervalSince1970: 1_793_000_001))
    try actionJournal.saveCompleteGeneration(
        summary: ScanGenerationSummary(id: postMoveGenerationID, startedAt: postMoveScanTime,
                                       completedAt: postMoveScanTime, rootCount: 1, recordCount: 0),
        records: []
    )
    let moveReplay = try LocalPluginFileActions.moveToUnused(
        operationID: moveOperationID, generationID: actionGenerationID, recordID: actionRecordID,
        source: movableItem, unusedDirectory: unusedRoot, journal: actionJournal,
        now: Date(timeIntervalSince1970: 1_793_000_001)
    )
    check(moveReplay.replay && moveReplay.treeDigest == move.treeDigest,
          "replaying a completed move should return its journaled receipt without moving again")
    do {
        _ = try LocalPluginFileActions.moveToUnused(
            operationID: moveOperationID, generationID: actionGenerationID, recordID: UUID().uuidString,
            source: movableItem, unusedDirectory: unusedRoot, journal: actionJournal
        )
        check(false, "an operation ID must not be reusable for a different record")
    } catch is ScanJournalError {
        check(true, "a reused operation ID with changed metadata was rejected")
    }

    let moveRecoverySource = try makeActionItem("MoveRecoveryProbe.component", "move-needs-recovery")
    let moveRecoveryID = UUID().uuidString
    _ = try LocalPluginFileActions.moveToUnused(
        operationID: moveRecoveryID, generationID: actionGenerationID, recordID: UUID().uuidString,
        source: moveRecoverySource, unusedDirectory: unusedRoot, journal: actionJournal
    )
    try actionJournal.setFileActionState(operationID: moveRecoveryID, state: "needs_recovery",
                                         updatedAt: ISO8601DateFormatter().string(from: Date()))
    let moveNeedsRecovery = try actionJournal.hasNeedsRecoveryAction(operationID: moveRecoveryID, kind: "move_to_unused")
    let moveNeedsRecoveryAsRestore = try actionJournal.hasNeedsRecoveryAction(operationID: moveRecoveryID, kind: "restore")
    check(moveNeedsRecovery,
          "move recovery lookup must find a needs_recovery record in the file-action journal")
    check(!moveNeedsRecoveryAsRestore,
          "restore recovery lookup must not confuse a move record with a restore record")
    let moveRecoveryIDs = try actionJournal.pendingRecoveryOperationIDs()
    check(moveRecoveryIDs.contains(moveRecoveryID),
          "the action queue refresh must include locally journaled interrupted moves for server-side recovery lookup")

    let restoreOperationID = UUID().uuidString
    let restored = try LocalPluginFileActions.restoreFromUnused(
        operationID: restoreOperationID, parentMoveOperationID: moveOperationID,
        generationID: postMoveGenerationID, recordID: actionRecordID,
        unusedDirectory: unusedRoot, journal: actionJournal,
        expectedTreeDigest: movedDigest, now: Date(timeIntervalSince1970: 1_793_000_002)
    )
    let restoredDigest = try LocalPluginFileActions.treeDigest(
        URL(fileURLWithPath: movableItem.path, isDirectory: true)
    )
    check(restored.state == "completed" && !restored.replay &&
          FileManager.default.fileExists(atPath: movableItem.path) &&
          !FileManager.default.fileExists(atPath: movedItem.path) &&
          restoredDigest == movedDigest,
          "restore should return a verified Unused item to its journaled original path")
    let restoreReplay = try LocalPluginFileActions.restoreFromUnused(
        operationID: restoreOperationID, parentMoveOperationID: moveOperationID,
        generationID: postMoveGenerationID, recordID: actionRecordID,
        unusedDirectory: unusedRoot, journal: actionJournal,
        expectedTreeDigest: movedDigest, now: Date(timeIntervalSince1970: 1_793_000_003)
    )
    check(restoreReplay.replay && restoreReplay.treeDigest == movedDigest,
          "replaying a completed restore must not move or duplicate the item")
    do {
        _ = try LocalPluginFileActions.restoreFromUnused(
            operationID: UUID().uuidString, parentMoveOperationID: moveOperationID,
            generationID: postMoveGenerationID, recordID: actionRecordID,
            unusedDirectory: unusedRoot, journal: actionJournal,
            expectedTreeDigest: movedDigest
        )
        check(false, "a completed move must not be restored more than once")
    } catch is ScanJournalError {
        check(true, "a second restore for the same move was rejected")
    }

    // Simulate a crash after the filesystem move completes but before its
    // verified-destination marker and completed state are saved.
    let restoreCrashSource = try makeActionItem("InterruptedRestore.component", "recover-after-move")
    let interruptedMoveID = UUID().uuidString
    let restoreCrashRecordID = UUID().uuidString
    let interruptedMove = try LocalPluginFileActions.moveToUnused(
        operationID: interruptedMoveID, generationID: actionGenerationID, recordID: restoreCrashRecordID,
        source: restoreCrashSource, unusedDirectory: unusedRoot, journal: actionJournal
    )
    let interruptedUnused = unusedRoot.appending(path: "InterruptedRestore.component", directoryHint: .isDirectory)
    let interruptedRestoreID = UUID().uuidString
    try actionJournal.prepareRestoreAction(
        operationID: interruptedRestoreID, parentOperationID: interruptedMoveID,
        generationID: actionGenerationID, recordID: restoreCrashRecordID,
        sourcePath: interruptedMove.destinationPath, destinationPath: interruptedMove.sourcePath,
        treeDigest: interruptedMove.treeDigest, now: ISO8601DateFormatter().string(from: Date())
    )
    try FileManager.default.moveItem(at: interruptedUnused, to: restoreCrashSource)
    let resumedRestore = try LocalPluginFileActions.restoreFromUnused(
        operationID: interruptedRestoreID, parentMoveOperationID: interruptedMoveID,
        generationID: actionGenerationID, recordID: restoreCrashRecordID,
        unusedDirectory: unusedRoot, journal: actionJournal,
        expectedTreeDigest: interruptedMove.treeDigest
    )
    let resumedRestoreJournal = try actionJournal.restoreAction(operationID: interruptedRestoreID)
    let resumedRestoreDigest = try LocalPluginFileActions.treeDigest(restoreCrashSource)
    check(resumedRestore.replay && resumedRestore.state == "completed" &&
          resumedRestoreJournal?.destinationVerified == true &&
          resumedRestoreDigest == interruptedMove.treeDigest,
          "recovery after a completed filesystem move must record verified destination before completion")

    // Simulate interruption after a cross-volume restore has copied and
    // verified its temporary staging tree, but before publishing the final
    // destination. Recovery must resume the staged copy and only then remove
    // the original Unused source.
    let stagedRestoreSource = try makeActionItem("StagedRestore.component", "recover-staged-restore")
    let stagedRestoreMoveID = UUID().uuidString
    let stagedRestoreRecordID = UUID().uuidString
    let stagedRestoreMove = try LocalPluginFileActions.moveToUnused(
        operationID: stagedRestoreMoveID, generationID: actionGenerationID, recordID: stagedRestoreRecordID,
        source: stagedRestoreSource, unusedDirectory: unusedRoot, journal: actionJournal
    )
    let stagedRestoreUnused = unusedRoot.appending(path: "StagedRestore.component", directoryHint: .isDirectory)
    let stagedRestoreOperationID = UUID().uuidString
    let interruptedRestoreFileManager = InterruptedRestoreCopyFileManager(sourcePath: stagedRestoreUnused.path)
    do {
        _ = try LocalPluginFileActions.restoreFromUnused(
            operationID: stagedRestoreOperationID, parentMoveOperationID: stagedRestoreMoveID,
            generationID: actionGenerationID, recordID: stagedRestoreRecordID,
            unusedDirectory: unusedRoot, journal: actionJournal,
            expectedTreeDigest: stagedRestoreMove.treeDigest,
            fileManager: interruptedRestoreFileManager
        )
        check(false, "an interrupted staged restore should report that recovery is required")
    } catch LocalPluginFileActionError.ioFailure {
        let staging = stagedRestoreSource.deletingLastPathComponent()
            .appending(path: ".aimm-restore-\(stagedRestoreOperationID).partial", directoryHint: .isDirectory)
        let interruptedJournal = try actionJournal.restoreAction(operationID: stagedRestoreOperationID)
        check(interruptedRestoreFileManager.interruptedAfterStagingCopy &&
              interruptedJournal?.state == "needs_recovery" &&
              FileManager.default.fileExists(atPath: stagedRestoreUnused.path) &&
              FileManager.default.fileExists(atPath: staging.path) &&
              !FileManager.default.fileExists(atPath: stagedRestoreSource.path),
              "interrupted staged restore must preserve its source and verified staging copy for recovery")
    }
    let restoreNeedsRecovery = try actionJournal.hasNeedsRecoveryAction(operationID: stagedRestoreOperationID, kind: "restore")
    let restoreNeedsRecoveryAsMove = try actionJournal.hasNeedsRecoveryAction(operationID: stagedRestoreOperationID, kind: "move_to_unused")
    check(restoreNeedsRecovery,
          "restore recovery lookup must find the needs_recovery record in the restore journal")
    check(!restoreNeedsRecoveryAsMove,
          "move recovery lookup must not confuse a restore record with a move record")
    let restoreRecoveryIDs = try actionJournal.pendingRecoveryOperationIDs()
    check(restoreRecoveryIDs.contains(stagedRestoreOperationID),
          "the action queue refresh must include locally journaled interrupted restores for server-side recovery lookup")
    let stagedRestoreRecovery = try LocalPluginFileActions.restoreFromUnused(
        operationID: stagedRestoreOperationID, parentMoveOperationID: stagedRestoreMoveID,
        generationID: actionGenerationID, recordID: stagedRestoreRecordID,
        unusedDirectory: unusedRoot, journal: actionJournal,
        expectedTreeDigest: stagedRestoreMove.treeDigest
    )
    let stagedRestoreJournal = try actionJournal.restoreAction(operationID: stagedRestoreOperationID)
    let stagedRestoreRecoveredDigest = try LocalPluginFileActions.treeDigest(stagedRestoreSource)
    check(stagedRestoreRecovery.replay && stagedRestoreRecovery.state == "completed" &&
          stagedRestoreJournal?.destinationVerified == true &&
          !FileManager.default.fileExists(atPath: stagedRestoreUnused.path) &&
          FileManager.default.fileExists(atPath: stagedRestoreSource.path) &&
          stagedRestoreRecoveredDigest == stagedRestoreMove.treeDigest,
          "restart must verify and publish a staged restore before removing the Unused source")
    let restoredStillNeedsRecovery = try actionJournal.hasNeedsRecoveryAction(operationID: stagedRestoreOperationID, kind: "restore")
    check(!restoredStillNeedsRecovery,
          "a recovered restore must no longer be reported as needing recovery")
    print("PASS: interrupted cross-volume restore retained its source and recovered the verified staging copy")

    // A prepared restore must fail closed if its Unused parent is replaced by
    // a symlink before the operation is resumed.
    let restoreSymlinkSource = try makeActionItem("SymlinkRestore.component", "reject-swapped-parent")
    let symlinkMoveID = UUID().uuidString
    let symlinkRecordID = UUID().uuidString
    let symlinkMove = try LocalPluginFileActions.moveToUnused(
        operationID: symlinkMoveID, generationID: actionGenerationID, recordID: symlinkRecordID,
        source: restoreSymlinkSource, unusedDirectory: unusedRoot, journal: actionJournal
    )
    let symlinkRestoreID = UUID().uuidString
    try actionJournal.prepareRestoreAction(
        operationID: symlinkRestoreID, parentOperationID: symlinkMoveID,
        generationID: actionGenerationID, recordID: symlinkRecordID,
        sourcePath: symlinkMove.destinationPath, destinationPath: symlinkMove.sourcePath,
        treeDigest: symlinkMove.treeDigest, now: ISO8601DateFormatter().string(from: Date())
    )
    let savedUnused = actionRoot.appending(path: "Unused-saved", directoryHint: .isDirectory)
    try FileManager.default.moveItem(at: unusedRoot, to: savedUnused)
    try FileManager.default.createSymbolicLink(at: unusedRoot, withDestinationURL: savedUnused)
    do {
        _ = try LocalPluginFileActions.restoreFromUnused(
            operationID: symlinkRestoreID, parentMoveOperationID: symlinkMoveID,
            generationID: actionGenerationID, recordID: symlinkRecordID,
            unusedDirectory: unusedRoot, journal: actionJournal,
            expectedTreeDigest: symlinkMove.treeDigest
        )
        check(false, "restore recovery must reject a symlinked Unused parent")
    } catch LocalPluginFileActionError.pathIsSymlink {
        check(true, "restore recovery rejected a symlinked Unused parent")
    }
    try FileManager.default.removeItem(at: unusedRoot)
    try FileManager.default.moveItem(at: savedUnused, to: unusedRoot)

    let crossVolumeSource = try makeActionItem("CrossVolume.component", "cross-volume-content")
    let crossVolumeOperationID = UUID().uuidString
    let crossVolumeRecordID = UUID().uuidString
    let crossVolumeDestination = unusedRoot.appending(path: "CrossVolume.component", directoryHint: .isDirectory)
    let crossVolumeFileManager = CrossVolumeMoveFileManager(simulatedSourcePath: crossVolumeSource.standardizedFileURL.path)
    let crossVolumeMove = try LocalPluginFileActions.moveToUnused(
        operationID: crossVolumeOperationID, generationID: actionGenerationID, recordID: crossVolumeRecordID,
        source: crossVolumeSource, unusedDirectory: unusedRoot, journal: actionJournal,
        fileManager: crossVolumeFileManager, now: Date(timeIntervalSince1970: 1_793_000_000)
    )
    let crossVolumeDestinationDigest = try LocalPluginFileActions.treeDigest(
        crossVolumeDestination, fileManager: crossVolumeFileManager
    )
    check(crossVolumeFileManager.simulatedCrossVolumeFailure && crossVolumeMove.state == "completed" &&
          !crossVolumeFileManager.fileExists(atPath: crossVolumeSource.path) &&
          crossVolumeFileManager.fileExists(atPath: crossVolumeDestination.path) &&
          crossVolumeDestinationDigest == crossVolumeMove.treeDigest,
          "a simulated EXDEV move should use the verified staging-copy path and remove only the verified source")
    print("PASS: cross-volume fallback copied, verified, journaled and removed the source")
    let crossVolumeRestoreFileManager = CrossVolumeMoveFileManager(
        simulatedSourcePath: crossVolumeDestination.standardizedFileURL.path
    )
    let crossVolumeRestore = try LocalPluginFileActions.restoreFromUnused(
        operationID: UUID().uuidString, parentMoveOperationID: crossVolumeOperationID,
        generationID: actionGenerationID, recordID: crossVolumeRecordID,
        unusedDirectory: unusedRoot, journal: actionJournal,
        expectedTreeDigest: crossVolumeMove.treeDigest,
        fileManager: crossVolumeRestoreFileManager, now: Date(timeIntervalSince1970: 1_793_000_004)
    )
    let crossVolumeRestoredDigest = try LocalPluginFileActions.treeDigest(
        URL(fileURLWithPath: crossVolumeSource.path, isDirectory: true)
    )
    check(crossVolumeRestoreFileManager.simulatedCrossVolumeFailure && crossVolumeRestore.state == "completed" &&
          !FileManager.default.fileExists(atPath: crossVolumeDestination.path) &&
          FileManager.default.fileExists(atPath: crossVolumeSource.path) &&
          crossVolumeRestoredDigest == crossVolumeMove.treeDigest,
          "restore should verify its cross-volume staging copy before removing the Unused source")
    print("PASS: cross-volume restore copied, verified, journaled and removed the Unused source")
    let collidingItem = try makeActionItem("Collision.component", "same-bytes")
    let collisionDestination = unusedRoot.appending(path: "Collision.component", directoryHint: .isDirectory)
    try FileManager.default.copyItem(at: collidingItem, to: collisionDestination)
    do {
        _ = try LocalPluginFileActions.moveToUnused(
            operationID: UUID().uuidString, generationID: actionGenerationID, recordID: UUID().uuidString,
            source: collidingItem, unusedDirectory: unusedRoot, journal: actionJournal
        )
        check(false, "a pre-existing identical destination must not be mistaken for a completed move")
    } catch LocalPluginFileActionError.destinationAlreadyExists {
        check(FileManager.default.fileExists(atPath: collidingItem.path),
              "a destination collision must preserve the original source")
    }

    let changedAfterPreview = try makeActionItem("Changed.component", "preview-content")
    let previewDigest = try LocalPluginFileActions.treeDigest(changedAfterPreview)
    try Data("changed-after-preview".utf8).write(to: changedAfterPreview.appending(path: "Contents.bin"))
    let changedOperationID = UUID().uuidString
    let changedRecordID = UUID().uuidString
    let changedDestination = unusedRoot.appending(path: "Changed.component").path
    do {
        _ = try LocalPluginFileActions.moveToUnused(
            operationID: changedOperationID, generationID: actionGenerationID, recordID: changedRecordID,
            source: changedAfterPreview, unusedDirectory: unusedRoot, journal: actionJournal,
            expectedTreeDigest: previewDigest, expectedDestinationPath: changedDestination
        )
        check(false, "the move must reject content changed after its exact preview")
    } catch LocalPluginFileActionError.itemChanged {
        let changedActionEntry = try actionJournal.fileAction(operationID: changedOperationID)
        check(FileManager.default.fileExists(atPath: changedAfterPreview.path) &&
              changedActionEntry == nil,
              "a changed item must remain in place without creating a move receipt")
    }

    let interruptedSource = try makeActionItem("Interrupted.component", "recovery-copy")
    let interruptedDestination = unusedRoot.appending(path: "Interrupted.component", directoryHint: .isDirectory)
    try FileManager.default.copyItem(at: interruptedSource, to: interruptedDestination)
    let interruptedID = UUID().uuidString
    let interruptedRecordID = UUID().uuidString
    let interruptedDigest = try LocalPluginFileActions.treeDigest(interruptedSource)
    _ = try actionJournal.prepareFileAction(
        operationID: interruptedID, generationID: actionGenerationID, recordID: interruptedRecordID,
        kind: "move_to_unused", sourcePath: interruptedSource.path,
        destinationPath: interruptedDestination.path, treeDigest: interruptedDigest, now: "fixture"
    )
    do {
        _ = try LocalPluginFileActions.moveToUnused(
            operationID: interruptedID, generationID: actionGenerationID,
            recordID: interruptedRecordID, source: interruptedSource,
            unusedDirectory: unusedRoot, journal: actionJournal
        )
        check(false, "unmarked duplicate copies must require recovery instead of deleting the source")
    } catch LocalPluginFileActionError.recoveryRequired {
        check(FileManager.default.fileExists(atPath: interruptedSource.path) &&
              FileManager.default.fileExists(atPath: interruptedDestination.path),
              "ambiguous recovery must preserve both source and destination copies")
    }

    let verifiedSource = try makeActionItem("Verified.component", "verified-recovery")
    let verifiedDestination = unusedRoot.appending(path: "Verified.component", directoryHint: .isDirectory)
    try FileManager.default.copyItem(at: verifiedSource, to: verifiedDestination)
    let verifiedID = UUID().uuidString
    let verifiedRecordID = UUID().uuidString
    let verifiedDigest = try LocalPluginFileActions.treeDigest(verifiedSource)
    _ = try actionJournal.prepareFileAction(
        operationID: verifiedID, generationID: actionGenerationID, recordID: verifiedRecordID,
        kind: "move_to_unused", sourcePath: verifiedSource.path,
        destinationPath: verifiedDestination.path, treeDigest: verifiedDigest, now: "fixture"
    )
    try actionJournal.markFileActionDestinationVerified(operationID: verifiedID, updatedAt: "fixture-verified")
    let verifiedRecovery = try LocalPluginFileActions.moveToUnused(
        operationID: verifiedID, generationID: actionGenerationID, recordID: verifiedRecordID,
        source: verifiedSource, unusedDirectory: unusedRoot, journal: actionJournal
    )
    print("PASS: verified two-copy recovery resumed")
    check(verifiedRecovery.replay && !FileManager.default.fileExists(atPath: verifiedSource.path) &&
          FileManager.default.fileExists(atPath: verifiedDestination.path),
          "recovery may remove the source only when the journal proves the destination was verified")

    let stagedSource = try makeActionItem("Staged.component", "staged-recovery")
    let stagedID = UUID().uuidString
    let stagedRecordID = UUID().uuidString
    let stagedDigest = try LocalPluginFileActions.treeDigest(stagedSource)
    let stagedCopy = unusedRoot.appending(path: ".aimm-\(stagedID).partial", directoryHint: .isDirectory)
    try FileManager.default.copyItem(at: stagedSource, to: stagedCopy)
    let stagedCopyDigest = try LocalPluginFileActions.treeDigest(stagedCopy)
    check(stagedCopyDigest == stagedDigest, "the synthetic staged copy should match its source before recovery")
    _ = try actionJournal.prepareFileAction(
        operationID: stagedID, generationID: actionGenerationID, recordID: stagedRecordID,
        kind: "move_to_unused", sourcePath: stagedSource.path,
        destinationPath: unusedRoot.appending(path: "Staged.component").path,
        treeDigest: stagedDigest, now: "fixture"
    )
    let stagedRecovery = try LocalPluginFileActions.moveToUnused(
        operationID: stagedID, generationID: actionGenerationID, recordID: stagedRecordID,
        source: stagedSource, unusedDirectory: unusedRoot, journal: actionJournal
    )
    print("PASS: staged recovery resumed")
    check(stagedRecovery.replay && !FileManager.default.fileExists(atPath: stagedSource.path) &&
          FileManager.default.fileExists(atPath: unusedRoot.appending(path: "Staged.component").path),
          "a verified operation-specific staging copy should resume without repeating a completed move")

    let symlinkSource = try makeActionItem("Symlink.component", "symlink-source")
    let symlinkTarget = actionRoot.appending(path: "outside-file")
    try Data("outside".utf8).write(to: symlinkTarget)
    try FileManager.default.createSymbolicLink(at: symlinkSource.appending(path: "link"), withDestinationURL: symlinkTarget)
    do {
        _ = try LocalPluginFileActions.moveToUnused(
            operationID: UUID().uuidString, generationID: actionGenerationID, recordID: UUID().uuidString,
            source: symlinkSource, unusedDirectory: unusedRoot, journal: actionJournal
        )
        check(false, "a symlink inside a bundle must block a move")
    } catch LocalPluginFileActionError.pathIsSymlink {
        check(FileManager.default.fileExists(atPath: symlinkSource.path),
              "a symlink rejection must preserve the source bundle")
    }

    let symlinkAncestorSource = try makeActionItem("SymlinkAncestor.component", "symlink-ancestor-source")
    let realDestinationParent = actionRoot.appending(path: "real-destination-parent", directoryHint: .isDirectory)
    let symlinkDestinationParent = actionRoot.appending(path: "symlink-destination-parent", directoryHint: .isDirectory)
    let realUnused = realDestinationParent.appending(path: "Unused", directoryHint: .isDirectory)
    try FileManager.default.createDirectory(at: realUnused, withIntermediateDirectories: true)
    try FileManager.default.createSymbolicLink(at: symlinkDestinationParent, withDestinationURL: realDestinationParent)
    do {
        _ = try LocalPluginFileActions.moveToUnused(
            operationID: UUID().uuidString, generationID: actionGenerationID, recordID: UUID().uuidString,
            source: symlinkAncestorSource,
            unusedDirectory: symlinkDestinationParent.appending(path: "Unused", directoryHint: .isDirectory),
            journal: actionJournal
        )
        check(false, "a symlinked ancestor of Unused must block a move")
    } catch LocalPluginFileActionError.pathIsSymlink {
        check(FileManager.default.fileExists(atPath: symlinkAncestorSource.path),
              "a symlinked destination ancestor rejection must preserve the source bundle")
    }

    if let crossVolumeRootPath = ProcessInfo.processInfo.environment["AIMM_CROSS_VOLUME_TEST_ROOT"] {
        let crossVolumeRoot = URL(fileURLWithPath: crossVolumeRootPath, isDirectory: true)
        let crossVolumeActualSource = try makeActionItem("ActualCrossVolume.component", "two-volume-fixture")
        let crossVolumeActualDestination = crossVolumeRoot.appending(path: crossVolumeActualSource.lastPathComponent,
                                                                     directoryHint: .isDirectory)
        let mountedVolumeFileManager = CrossVolumeMoveFileManager(
            simulatedSourcePath: crossVolumeActualSource.standardizedFileURL.path
        )
        let crossVolumeActual = try LocalPluginFileActions.moveToUnused(
            operationID: UUID().uuidString, generationID: actionGenerationID,
            recordID: UUID().uuidString, source: crossVolumeActualSource,
            unusedDirectory: crossVolumeRoot, journal: actionJournal,
            fileManager: mountedVolumeFileManager
        )
        let actualDestinationDigest = try LocalPluginFileActions.treeDigest(
            crossVolumeActualDestination, fileManager: mountedVolumeFileManager
        )
        check(mountedVolumeFileManager.simulatedCrossVolumeFailure && crossVolumeActual.state == "completed" &&
              !FileManager.default.fileExists(atPath: crossVolumeActualSource.path) &&
              FileManager.default.fileExists(atPath: crossVolumeActualDestination.path) &&
              actualDestinationDigest == crossVolumeActual.treeDigest,
              "the verified copy fallback should move the complete item between distinct mounted filesystems")
        print("PASS: verified copy fallback completed between distinct mounted filesystems")
    }

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
            let path = localWorkerFixturePath("Synth.component")
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
            let actionRecord = PluginRecord(
                id: localWorkerFixturePath("Synth.component"),
                name: "Synthetic Local Worker Fixture", bundleIdentifier: "test.aimm.localfixture",
                version: "1.0", format: .audioUnit, metadataSource: .infoPlist,
                localPath: localWorkerFixturePath("Synth.component")
            )
            let fixtureURL = URL(fileURLWithPath: actionRecord.localPath)
            try FileManager.default.createDirectory(at: fixtureURL.deletingLastPathComponent(), withIntermediateDirectories: true)
            try FileManager.default.createDirectory(at: fixtureURL, withIntermediateDirectories: true)
            try Data("synthetic-preview-item".utf8).write(to: fixtureURL.appending(path: "Contents.bin"))
            let unusedFixtureURL = fixtureURL.deletingLastPathComponent().appending(path: "Unused", directoryHint: .isDirectory)
            try FileManager.default.createDirectory(at: unusedFixtureURL, withIntermediateDirectories: true)
            let protectedDestination = try LocalPluginFileActions.previewDestination(source: fixtureURL, unusedDirectory: unusedFixtureURL)
            let protectedTreeDigest = try LocalPluginFileActions.treeDigest(fixtureURL)
            defer { try? FileManager.default.removeItem(at: fixtureURL.deletingLastPathComponent()) }
            let prepared = try await actionsClient.submitPreparedPreview(action, record: actionRecord, credential: actionCredential)
            let refreshedAction = try await actionsClient.pendingActions(credential: actionCredential)
                .first(where: { $0.operationID == action.operationID })
            let fractionalDates = ISO8601DateFormatter()
            fractionalDates.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            let returnedPreviewExpiry = refreshedAction?.previewExpiresAt.flatMap(fractionalDates.date(from:))
            check(refreshedAction?.previewDigest == prepared.digest &&
                  returnedPreviewExpiry == prepared.expiresAt &&
                  refreshedAction?.ownerConfirmedAt == nil,
                  "the Worker should return the exact prepared-preview binding to the paired Mac")
            let locallyBoundAction = action.binding(preparedPreview: prepared)
            let confirmedAction = PendingDeviceAction(
                operationID: action.operationID, accountID: action.accountID, generationID: action.generationID,
                kind: action.kind, nonce: action.nonce, state: "claimed", createdAt: action.createdAt,
                expiresAt: action.expiresAt, recordIDs: action.recordIDs, previewDigest: prepared.digest,
                previewExpiresAt: ISO8601DateFormatter().string(from: prepared.expiresAt),
                ownerConfirmedAt: ISO8601DateFormatter().string(from: Date().addingTimeInterval(-1))
            )
            check(LibraryAPIClient.ownerConfirmationIsCurrent(confirmedAction, matching: prepared),
                  "a passkey owner confirmation should authorize only the same exact preview digest")
            let changedConfirmation = PendingDeviceAction(
                operationID: action.operationID, accountID: action.accountID, generationID: action.generationID,
                kind: action.kind, nonce: action.nonce, state: "claimed", createdAt: action.createdAt,
                expiresAt: action.expiresAt, recordIDs: action.recordIDs, previewDigest: String(repeating: "0", count: 64),
                previewExpiresAt: confirmedAction.previewExpiresAt,
                ownerConfirmedAt: confirmedAction.ownerConfirmedAt
            )
            check(!LibraryAPIClient.ownerConfirmationIsCurrent(changedConfirmation, matching: prepared),
                  "an owner confirmation for a different preview digest must not authorize the local action")
            let protectedPreview = PreparedActionPreview(
                operationID: action.operationID, accountID: action.accountID, deviceID: actionCredential.deviceID,
                generationID: action.generationID, kind: "move_to_unused", nonce: action.nonce,
                recordID: action.recordIDs[0], record: actionRecord, digest: prepared.digest,
                expiresAt: prepared.expiresAt, destinationPath: protectedDestination.path,
                treeDigest: protectedTreeDigest
            )
            let unconfirmedProtectedAction = PendingDeviceAction(
                operationID: action.operationID, accountID: action.accountID, generationID: action.generationID,
                kind: "move_to_unused", nonce: action.nonce, state: "claimed", createdAt: action.createdAt,
                expiresAt: action.expiresAt, recordIDs: action.recordIDs, previewDigest: prepared.digest,
                previewExpiresAt: ISO8601DateFormatter().string(from: prepared.expiresAt)
            )
            check(!LibraryAPIClient.preparedPreviewIsCurrent(
                protectedPreview, action: unconfirmedProtectedAction, record: actionRecord,
                currentRecords: [actionRecord], currentGenerationID: action.generationID,
                credential: actionCredential
            ), "a file-changing action must be blocked until the owner confirms its exact preview")
            let ownerApprovedProtectedAction = PendingDeviceAction(
                operationID: action.operationID, accountID: action.accountID, generationID: action.generationID,
                kind: "move_to_unused", nonce: action.nonce, state: "claimed", createdAt: action.createdAt,
                expiresAt: action.expiresAt, recordIDs: action.recordIDs, previewDigest: prepared.digest,
                previewExpiresAt: ISO8601DateFormatter().string(from: prepared.expiresAt),
                ownerConfirmedAt: ISO8601DateFormatter().string(from: Date().addingTimeInterval(-1))
            )
            check(LibraryAPIClient.preparedPreviewIsCurrent(
                protectedPreview, action: ownerApprovedProtectedAction, record: actionRecord,
                currentRecords: [actionRecord], currentGenerationID: action.generationID,
                credential: actionCredential
            ), "a file-changing action may proceed only when owner confirmation binds to its current local preview")
            check(LibraryAPIClient.preparedPreviewIsCurrent(
                prepared, action: locallyBoundAction, record: actionRecord, currentRecords: [actionRecord],
                currentGenerationID: action.generationID, credential: actionCredential
            ), "the exact preview should authorize only its unchanged live journal item")
            check(!LibraryAPIClient.preparedPreviewIsCurrent(
                prepared, action: locallyBoundAction, record: actionRecord, currentRecords: [actionRecord],
                currentGenerationID: "stale-generation", credential: actionCredential
            ), "the exact preview must be rejected when the current scan generation changed")
            let changedRecord = PluginRecord(
                id: actionRecord.id, name: actionRecord.name, bundleIdentifier: actionRecord.bundleIdentifier,
                version: "2.0", format: actionRecord.format, metadataSource: actionRecord.metadataSource,
                localPath: actionRecord.localPath
            )
            check(!LibraryAPIClient.preparedPreviewIsCurrent(
                prepared, action: locallyBoundAction, record: changedRecord, currentRecords: [changedRecord],
                currentGenerationID: action.generationID, credential: actionCredential
            ), "the exact preview must be rejected when the local record changed after review")
            check(!LibraryAPIClient.preparedPreviewIsCurrent(
                prepared, action: locallyBoundAction, record: actionRecord, currentRecords: [actionRecord],
                currentGenerationID: action.generationID, credential: actionCredential, now: .distantFuture
            ), "the exact preview must be rejected after its expiry")
            try await actionsClient.submitRevealReceipt(
                action, recordID: action.recordIDs[0], completed: true, credential: actionCredential
            )
            print("PASS: actual Swift command claim, signed encrypted-preview submission and signed reveal receipt were accepted by local Worker and D1")
        }

        if let moveAPI = ProcessInfo.processInfo.environment["AIMM_MOVE_SMOKE_URL"],
           let deviceID = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_DEVICE_ID"],
           let bearerToken = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_TOKEN"],
           let gateDirectory = ProcessInfo.processInfo.environment["AIMM_MOVE_SMOKE_GATE_DIR"] {
            let moveCredential = StoredDeviceCredential(
                deviceID: deviceID, bearerToken: bearerToken, privateKey: Data(repeating: 9, count: 32),
                apiBaseURL: moveAPI
            )
            let moveClient = LibraryAPIClient()
            guard let action = try await moveClient.pendingActions(credential: moveCredential)
                .first(where: { $0.kind == "move_to_unused" }), action.recordIDs.count == 1,
                  action.generationID == "33333333-3333-4333-8333-333333333333" else {
                check(false, "the local Worker should return the seeded move action for its complete generation")
                return
            }
            try await moveClient.claim(action, credential: moveCredential)
            let sourcePath = localWorkerFixturePath("Synth.component")
            let source = URL(fileURLWithPath: sourcePath, isDirectory: true)
            let unusedDirectory = source.deletingLastPathComponent().appending(path: "Unused", directoryHint: .isDirectory)
            try FileManager.default.createDirectory(at: source, withIntermediateDirectories: true)
            try FileManager.default.createDirectory(at: unusedDirectory, withIntermediateDirectories: true)
            try Data("synthetic-preview-item".utf8).write(to: source.appending(path: "Contents.bin"))
            let record = PluginRecord(
                id: sourcePath, name: "Synthetic Local Worker Fixture",
                bundleIdentifier: "test.aimm.localfixture", version: "1.0", format: .audioUnit,
                metadataSource: .infoPlist, localPath: sourcePath
            )
            let gate = URL(fileURLWithPath: gateDirectory, isDirectory: true)
            try FileManager.default.createDirectory(at: gate, withIntermediateDirectories: true)
            let journal = try ScanJournal(databaseURL: gate.appending(path: "move-journal.sqlite"))
            let generationTime = ISO8601DateFormatter().string(from: Date())
            let generation = ScanGenerationSummary(
                id: action.generationID, startedAt: generationTime, completedAt: generationTime,
                rootCount: 1, recordCount: 1
            )
            try journal.saveCompleteGeneration(summary: generation, records: [record])
            let prepared = try await moveClient.submitPreparedPreview(
                action, record: record, unusedDirectory: unusedDirectory, credential: moveCredential
            )
            let encodedPreview = try JSONEncoder().encode(prepared)
            let resumedPreview = try JSONDecoder().decode(PreparedActionPreview.self, from: encodedPreview)
            check(resumedPreview == prepared,
                  "an accepted move preview must preserve its exact path, digest and expiry through secure-store serialization")
            try Data("\(action.operationID)\n\(prepared.digest)\n".utf8)
                .write(to: gate.appending(path: "preview.txt"), options: .atomic)
            print("WAITING: local test fixture will confirm the exact synthetic move preview in disposable D1.")
            let resume = gate.appending(path: "resume")
            var resumed = false
            for _ in 0..<600 {
                if FileManager.default.fileExists(atPath: resume.path) { resumed = true; break }
                try await Task.sleep(nanoseconds: 100_000_000)
            }
            guard resumed, let confirmed = try await moveClient.pendingActions(credential: moveCredential)
                .first(where: { $0.operationID == action.operationID }) else {
                throw DeviceSyncError.rejected("The local move confirmation fixture did not resume.")
            }
            let preview = action.binding(preparedPreview: prepared)
            guard LibraryAPIClient.preparedPreviewIsCurrent(
                prepared, action: confirmed, record: record, currentRecords: [record],
                currentGenerationID: generation.id, credential: moveCredential
            ) else { throw DeviceSyncError.rejected("The move preview changed before local execution.") }
            let freshlyAuthorizedMove = try await moveClient.currentFileActionAuthorization(
                action, preview: prepared, credential: moveCredential
            )
            check(freshlyAuthorizedMove.state == "claimed" && freshlyAuthorizedMove.ownerConfirmedAt != nil,
                  "the companion must recheck live device and owner authorization immediately before moving")
            let moved = try LocalPluginFileActions.moveToUnused(
                operationID: action.operationID, generationID: action.generationID, recordID: action.recordIDs[0],
                source: source, unusedDirectory: unusedDirectory, journal: journal,
                expectedTreeDigest: prepared.treeDigest, expectedDestinationPath: prepared.destinationPath
            )
            let postMoveGenerationID = "55555555-5555-4555-8555-555555555555"
            let postMoveTime = ISO8601DateFormatter().string(from: Date())
            let postMoveGeneration = ScanGenerationSummary(
                id: postMoveGenerationID, startedAt: postMoveTime, completedAt: postMoveTime,
                rootCount: 1, recordCount: 0
            )
            try journal.saveCompleteGeneration(summary: postMoveGeneration, records: [])
            try await moveClient.sync(records: [], summary: postMoveGeneration, credential: moveCredential)
            let evidence = MoveActionReceiptEvidence(
                treeDigest: moved.treeDigest, destinationVerified: true, sourceRemoved: true,
                rescanGenerationID: postMoveGenerationID, previewDigest: prepared.digest
            )
            try await moveClient.submitActionReceipt(
                preview, recordID: action.recordIDs[0], completed: true,
                moveEvidence: evidence, credential: moveCredential
            )
            check(moved.state == "completed" && !FileManager.default.fileExists(atPath: source.path) &&
                  FileManager.default.fileExists(atPath: prepared.destinationPath ?? ""),
                  "the synthetic item should move only after its exact owner-confirmed preview")
            print("PASS: actual Swift move preview, local filesystem move, complete post-move sync and signed receipt passed against local Worker/D1")
        }

        if let restoreAPI = ProcessInfo.processInfo.environment["AIMM_RESTORE_SMOKE_URL"],
           let deviceID = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_DEVICE_ID"],
           let bearerToken = ProcessInfo.processInfo.environment["AIMM_SYNC_SMOKE_TOKEN"],
           let gateDirectory = ProcessInfo.processInfo.environment["AIMM_RESTORE_SMOKE_GATE_DIR"] {
            let actionCredential = StoredDeviceCredential(
                deviceID: deviceID, bearerToken: bearerToken, privateKey: Data(repeating: 9, count: 32),
                apiBaseURL: restoreAPI
            )
            let actionsClient = LibraryAPIClient()
            let action = try await actionsClient.pendingActions(credential: actionCredential)
                .first(where: { $0.kind == "restore" })
            guard let action, action.recordIDs.count == 1,
                  action.generationID == "55555555-5555-4555-8555-555555555555",
                  action.parentMoveOperationID == "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" else {
                check(false, "the local Worker should return the restore action bound to its exact parent move")
                return
            }
            try await actionsClient.claim(action, credential: actionCredential)

            let originalPath = localWorkerFixturePath("Synth.component")
            let movedPath = localWorkerFixturePath("Unused/Synth.component")
            let originalRecord = PluginRecord(
                id: originalPath, name: "Synthetic Local Worker Fixture",
                bundleIdentifier: "test.aimm.localfixture", version: "1.0", format: .audioUnit,
                metadataSource: .infoPlist, localPath: originalPath
            )
            let journalRoot = URL(fileURLWithPath: gateDirectory, isDirectory: true)
                .appending(path: "restore-journal", directoryHint: .isDirectory)
            try FileManager.default.createDirectory(at: journalRoot, withIntermediateDirectories: true)
            let journal = try ScanJournal(databaseURL: journalRoot.appending(path: "journal.sqlite"))
            let oldGeneration = ScanGenerationSummary(
                id: "33333333-3333-4333-8333-333333333333", startedAt: action.createdAt,
                completedAt: action.createdAt, rootCount: 1, recordCount: 1
            )
            try journal.saveCompleteGeneration(summary: oldGeneration, records: [originalRecord])
            let movedGeneration = ScanGenerationSummary(
                id: action.generationID, startedAt: action.createdAt,
                completedAt: action.createdAt, rootCount: 1, recordCount: 0
            )
            try journal.saveCompleteGeneration(summary: movedGeneration, records: [])
            let movedURL = URL(fileURLWithPath: movedPath, isDirectory: true)
            let movedDigest = try LocalPluginFileActions.treeDigest(movedURL)
            let journalOriginalPath = originalPath.replacingOccurrences(of: "/private/tmp/", with: "/tmp/")
            check(journalOriginalPath != URL(fileURLWithPath: originalPath).standardizedFileURL.path,
                  "restore alias fixture must use distinct /tmp and /private/tmp path strings")
            check(LibraryAPIClient.localPathsReferToSameLocation(journalOriginalPath, originalPath),
                  "the /tmp and /private/tmp aliases should resolve to one filesystem identity")
            let journalMovedPath = URL(fileURLWithPath: movedPath).standardizedFileURL.path
            let stamp = ISO8601DateFormatter().string(from: Date())
            _ = try journal.prepareFileAction(
                operationID: action.parentMoveOperationID!, generationID: oldGeneration.id,
                recordID: action.recordIDs[0], kind: "move_to_unused", sourcePath: journalOriginalPath,
                destinationPath: journalMovedPath, treeDigest: movedDigest, now: stamp
            )
            try journal.markFileActionDestinationVerified(operationID: action.parentMoveOperationID!, updatedAt: stamp)
            try journal.setFileActionState(operationID: action.parentMoveOperationID!, state: "completed", updatedAt: stamp)
            guard let parentMoveEntry = try journal.fileAction(operationID: action.parentMoveOperationID!) else {
                throw ScanJournalError.step("the synthetic verified parent move was not journaled")
            }
            let prepared = try await actionsClient.submitPreparedPreview(
                action, record: originalRecord, parentMoveEntry: parentMoveEntry, credential: actionCredential
            )
            let encodedPreview = try JSONEncoder().encode(prepared)
            let resumedPreview = try JSONDecoder().decode(PreparedActionPreview.self, from: encodedPreview)
            check(resumedPreview == prepared,
                  "an accepted restore preview must preserve its exact journal-bound paths through secure-store serialization")
            let gateURL = URL(fileURLWithPath: gateDirectory, isDirectory: true)
            try FileManager.default.createDirectory(at: gateURL, withIntermediateDirectories: true)
            try Data("\(action.operationID)\n\(prepared.digest)\n".utf8)
                .write(to: gateURL.appending(path: "preview.txt"), options: .atomic)
            print("WAITING: local test fixture will mark the synthetic owner-confirmation timestamp for this exact preview.")
            let resumeURL = gateURL.appending(path: "resume")
            var resumed = false
            for _ in 0..<600 {
                if FileManager.default.fileExists(atPath: resumeURL.path) { resumed = true; break }
                try await Task.sleep(nanoseconds: 100_000_000)
            }
            guard resumed else { throw DeviceSyncError.rejected("The local owner-confirmation fixture did not resume.") }
            guard let confirmedAction = try await actionsClient.pendingActions(credential: actionCredential)
                .first(where: { $0.operationID == action.operationID }) else {
                throw DeviceSyncError.rejected("The local Worker did not return the claimed restore action after confirmation.")
            }
            let confirmationMatches = LibraryAPIClient.ownerConfirmationIsCurrent(confirmedAction, matching: prepared)
            let previewIsCurrent = LibraryAPIClient.preparedPreviewIsCurrent(
                prepared, action: confirmedAction, record: originalRecord, currentRecords: [],
                currentGenerationID: movedGeneration.id, credential: actionCredential,
                parentMoveEntry: parentMoveEntry
            )
            guard confirmationMatches, previewIsCurrent else {
                let actualDigest = try LocalPluginFileActions.treeDigest(URL(fileURLWithPath: movedPath))
                let fractionalExpiry = ISO8601DateFormatter()
                fractionalExpiry.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
                let expiryText = confirmedAction.previewExpiresAt ?? ""
                let expiry = fractionalExpiry.date(from: expiryText) ?? ISO8601DateFormatter().date(from: expiryText)
                let diagnostics = [
                    "identity=\(prepared.operationID == confirmedAction.operationID && prepared.accountID == confirmedAction.accountID && prepared.deviceID == actionCredential.deviceID)",
                    "generation=\(confirmedAction.generationID == movedGeneration.id)",
                    "record=\(prepared.record == originalRecord && prepared.recordID == confirmedAction.recordIDs.first)",
                    "opaque=\(LibraryAPIClient.opaqueRecordID(localPath: originalPath, privateKey: actionCredential.privateKey) == action.recordIDs[0])",
                    "previewDigest=\(confirmedAction.previewDigest == prepared.digest)",
                    "expiry=\(expiry == prepared.expiresAt && (expiry ?? .distantPast) > Date())",
                    "parent=\(parentMoveEntry.operationID == confirmedAction.parentMoveOperationID && prepared.parentMoveOperationID == parentMoveEntry.operationID)",
                    "paths=\(prepared.destinationPath == parentMoveEntry.sourcePath && parentMoveEntry.destinationPath == movedPath)",
                    "files=\(!FileManager.default.fileExists(atPath: originalPath) && FileManager.default.fileExists(atPath: movedPath))",
                    "safeUnusedPath=\(parentMoveEntry.destinationPath.hasPrefix("/") && !URL(fileURLWithPath: parentMoveEntry.destinationPath).pathComponents.contains(".") && !URL(fileURLWithPath: parentMoveEntry.destinationPath).pathComponents.contains(".."))",
                    "symlinks=\((try? URL(fileURLWithPath: parentMoveEntry.destinationPath).resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink) != true)",
                    "absentFromCurrent=\(![].contains(originalRecord))",
                    "content=\(actualDigest == prepared.treeDigest && actualDigest == parentMoveEntry.treeDigest)",
                    "parentVerified=\(parentMoveEntry.kind == "move_to_unused" && parentMoveEntry.state == "completed" && parentMoveEntry.destinationVerified)"
                ].joined(separator: ",")
                throw DeviceSyncError.rejected("The restore preview validation failed (confirmation=\(confirmationMatches), preview=\(previewIsCurrent), \(diagnostics)).")
            }
            let freshlyAuthorizedRestore = try await actionsClient.currentFileActionAuthorization(
                action, preview: prepared, credential: actionCredential
            )
            check(freshlyAuthorizedRestore.state == "claimed" && freshlyAuthorizedRestore.ownerConfirmedAt != nil,
                  "the companion must recheck live device and owner authorization immediately before restoring")
            let restored = try LocalPluginFileActions.restoreFromUnused(
                operationID: action.operationID, parentMoveOperationID: action.parentMoveOperationID!,
                generationID: action.generationID, recordID: action.recordIDs[0],
                unusedDirectory: URL(fileURLWithPath: movedPath).deletingLastPathComponent(),
                journal: journal, expectedTreeDigest: prepared.treeDigest!,
                expectedDestinationPath: originalPath
            )
            check(restored.state == "completed" && restored.treeDigest == movedDigest &&
                  FileManager.default.fileExists(atPath: originalPath) &&
                  !FileManager.default.fileExists(atPath: movedPath),
                  "the Swift client should restore the verified item to its original path")
            let rescanGenerationID = "66666666-6666-4666-8666-666666666666"
            let rescan = ScanGenerationSummary(
                id: rescanGenerationID, startedAt: ISO8601DateFormatter().string(from: Date()),
                completedAt: ISO8601DateFormatter().string(from: Date()), rootCount: 1, recordCount: 1
            )
            try await actionsClient.sync(records: [originalRecord], summary: rescan, credential: actionCredential)
            let evidence = MoveActionReceiptEvidence(
                treeDigest: restored.treeDigest, destinationVerified: true, sourceRemoved: true,
                rescanGenerationID: rescanGenerationID, previewDigest: prepared.digest
            )
            try await actionsClient.submitActionReceipt(
                confirmedAction, recordID: action.recordIDs[0], completed: true,
                moveEvidence: evidence, credential: actionCredential
            )
            print("PASS: actual Swift restore preview, filesystem restore, complete post-restore sync and signed parent-bound receipt passed against local Worker/D1")
        }
    }
} catch {
    fputs("FAIL: \(error.localizedDescription)\n", stderr)
    exit(1)
}
}
}
