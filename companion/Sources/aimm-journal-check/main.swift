import AIMMCompanionCore
import Foundation

func check(_ condition: @autoclosure () -> Bool, _ message: String) {
    guard condition() else {
        fputs("FAIL: \(message)\n", stderr)
        exit(1)
    }
}

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
    print("PASS: API endpoint allowlist and local scan journal persistence/incomplete-generation rejection")
} catch {
    fputs("FAIL: \(error.localizedDescription)\n", stderr)
    exit(1)
}
