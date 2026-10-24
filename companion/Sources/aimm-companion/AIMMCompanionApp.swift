import AppKit
import SwiftUI
import UniformTypeIdentifiers
import AIMMCompanionCore

@main
struct AIMMCompanionApp: App {
    @StateObject private var model = CompanionModel()
    @Environment(\.openWindow) private var openWindow

    var body: some Scene {
        WindowGroup("AIMM Companion", id: "main") {
            CompanionWindow()
                .environmentObject(model)
                .frame(minWidth: 620, minHeight: 440)
        }
        MenuBarExtra("AIMM Companion", systemImage: "puzzlepiece.extension") {
            Button("Open AIMM Companion") { openWindow(id: "main") }
            Divider()
            Text(model.status)
                .lineLimit(3)
        }
        .menuBarExtraStyle(.window)
    }
}

@MainActor
final class CompanionModel: ObservableObject {
    @Published var records: [PluginRecord] = []
    @Published var generation: ScanGenerationSummary?
    @Published var status = "Choose a folder to scan. Nothing is scanned automatically."
    @Published var isScanning = false
    @Published var apiBaseURL = UserDefaults.standard.string(forKey: "aimmLibraryAPIBaseURL") ?? "" {
        didSet { UserDefaults.standard.set(apiBaseURL, forKey: "aimmLibraryAPIBaseURL") }
    }
    @Published var pairingStatus = "Not paired. Scans stay on this Mac."
    @Published var pairingPhrase: String?
    @Published var isPairing = false
    @Published var actionStatus = "No pending local action loaded."
    @Published var pendingAction: PendingDeviceAction?
    @Published var pendingActionRecord: PluginRecord?
    @Published var actionWasPerformed = false
    @Published var customFolderStatus = "No saved custom folders."

    private let customRootsDefaultsKey = "aimmPluginCustomRootBookmarks_v1"

    private let journal: ScanJournal?
    private let apiClient = LibraryAPIClient()
    private var pairedCredential: StoredDeviceCredential?

    init() {
        if let saved = try? DeviceCredentialStore.load() {
            pairedCredential = saved
            apiBaseURL = saved.apiBaseURL
            pairingStatus = "Paired device \(saved.deviceID)."
        }
        var openedJournal: ScanJournal?
        do {
            let opened = try ScanJournal.applicationDefault()
            openedJournal = opened
            if let latest = try opened.latestCompleteGeneration() {
                generation = latest.summary
                records = latest.records
                status = "Loaded the last complete local scan."
            }
        } catch {
            status = "Local journal unavailable: \(error.localizedDescription)"
        }
        self.journal = openedJournal
        let savedBookmarkCount = (UserDefaults.standard.array(forKey: customRootsDefaultsKey) as? [Data])?.count ?? 0
        customFolderStatus = savedBookmarkCount == 0
            ? "No saved custom folders."
            : "\(savedBookmarkCount) custom folder bookmark(s) saved on this Mac."
    }

    func scan(selectedRoots: [URL], rememberCustomRoots: Bool = false) {
        guard !selectedRoots.isEmpty else { return }
        guard let journal else {
            status = "Cannot scan: local journal is unavailable."
            return
        }
        if rememberCustomRoots {
            do {
                let bookmarks = try Array(Set(selectedRoots.map(\.standardizedFileURL)))
                    .sorted { $0.path < $1.path }
                    .map { try $0.bookmarkData(options: .withSecurityScope, includingResourceValuesForKeys: nil, relativeTo: nil) }
                UserDefaults.standard.set(bookmarks, forKey: customRootsDefaultsKey)
                customFolderStatus = "\(bookmarks.count) custom folder bookmark(s) saved locally on this Mac."
            } catch {
                status = "The selected folders could not be saved for future scans. No scan was started. \(error.localizedDescription)"
                return
            }
        }
        isScanning = true
        status = "Scanning only the folders you selected…"
        let started = ISO8601DateFormatter().string(from: Date())
        var acquired: [URL] = []
        for root in selectedRoots where root.startAccessingSecurityScopedResource() {
            acquired.append(root)
        }
        defer {
            acquired.forEach { $0.stopAccessingSecurityScopedResource() }
            isScanning = false
        }
        do {
            let scanned = try PluginScanner().scan(roots: selectedRoots)
            let completed = ISO8601DateFormatter().string(from: Date())
            let next = ScanGenerationSummary(
                id: UUID().uuidString.lowercased(),
                startedAt: started,
                completedAt: completed,
                rootCount: selectedRoots.count,
                recordCount: scanned.count
            )
            try journal.saveCompleteGeneration(summary: next, records: scanned)
            generation = next
            records = scanned
            status = "Complete local scan saved. \(scanned.count) plug-in format entries across \(selectedRoots.count) selected folder(s). Nothing was uploaded."
            if let pairedCredential {
                status = "Complete local scan saved. Syncing this generation…"
                Task { await sync(summary: next, records: scanned, credential: pairedCredential) }
            }
        } catch {
            status = "Scan was not saved; the previous complete scan is unchanged. \(error.localizedDescription)"
        }
    }

    func scanStandardPluginFolders() {
        let roots = PluginScanner.standardRoots()
        guard !roots.isEmpty else {
            status = "No standard plug-in folders were found. Choose a custom folder to scan."
            return
        }
        scan(selectedRoots: roots)
    }

    func scanSavedCustomFolders() {
        let bookmarks = UserDefaults.standard.array(forKey: customRootsDefaultsKey) as? [Data] ?? []
        guard !bookmarks.isEmpty else {
            customFolderStatus = "No saved custom folders. Choose folders to add them."
            return
        }
        var resolved: [URL] = []
        var refreshed: [Data] = []
        var problems = 0
        for bookmark in bookmarks {
            do {
                var stale = false
                let url = try URL(resolvingBookmarkData: bookmark, options: .withSecurityScope,
                                  relativeTo: nil, bookmarkDataIsStale: &stale)
                var isDirectory: ObjCBool = false
                guard FileManager.default.fileExists(atPath: url.path, isDirectory: &isDirectory), isDirectory.boolValue,
                      (try? url.resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink) != true else {
                    problems += 1
                    refreshed.append(bookmark)
                    continue
                }
                resolved.append(url)
                if stale {
                    refreshed.append(try url.bookmarkData(options: .withSecurityScope,
                                                          includingResourceValuesForKeys: nil, relativeTo: nil))
                } else {
                    refreshed.append(bookmark)
                }
            } catch {
                problems += 1
                refreshed.append(bookmark)
            }
        }
        UserDefaults.standard.set(refreshed, forKey: customRootsDefaultsKey)
        customFolderStatus = problems == 0
            ? "Resolved all \(resolved.count) saved custom folder(s)."
            : "\(problems) saved folder grant(s) are stale or unavailable; reselect those folders to restore access."
        guard !resolved.isEmpty else {
            status = "No saved custom folder could be accessed. Reselect the folder(s) to restore access."
            return
        }
        scan(selectedRoots: resolved)
    }

    func forgetCustomFolders() {
        UserDefaults.standard.removeObject(forKey: customRootsDefaultsKey)
        customFolderStatus = "Saved custom folder bookmarks removed from this Mac."
    }

    func beginPairing() {
        guard !isPairing else { return }
        isPairing = true
        pairingPhrase = nil
        pairingStatus = "Starting secure pairing…"
        Task {
            do {
                let name = Host.current().localizedName ?? "This Mac"
                let pending = try await apiClient.beginPairing(apiBaseURL: apiBaseURL, deviceName: name)
                pairingPhrase = pending.phrase
                pairingStatus = "Compare the phrase in this window with the approval page."
                if let approvalURL = pending.approvalURL { NSWorkspace.shared.open(approvalURL) }
                let credential = try await apiClient.waitForPairing(apiBaseURL: apiBaseURL, pending: pending) { [weak self] in
                    Task { @MainActor in self?.pairingStatus = "Waiting for approval in the browser…" }
                }
                try DeviceCredentialStore.save(credential)
                pairedCredential = credential
                pairingPhrase = nil
                pairingStatus = "Paired securely. Complete scans will sync to this account."
                if let generation { await sync(summary: generation, records: records, credential: credential) }
            } catch {
                pairingStatus = error.localizedDescription
            }
            isPairing = false
        }
    }

    func refreshPendingActions() {
        guard let credential = pairedCredential else {
            actionStatus = "Pair this Mac before checking for local action requests."
            return
        }
        actionStatus = "Checking the device's action queue…"
        Task {
            do {
                let commands = try await apiClient.pendingActions(credential: credential)
                guard let action = commands.first else {
                    pendingAction = nil
                    pendingActionRecord = nil
                    actionStatus = "No pending local actions."
                    return
                }
                guard action.kind == "reveal", action.recordIDs.count == 1,
                      generation?.id == action.generationID else {
                    actionStatus = "A queued action does not match this build or the last complete local generation; it was left unclaimed."
                    return
                }
                guard let record = records.first(where: {
                    LibraryAPIClient.opaqueRecordID(localPath: $0.localPath, privateKey: credential.privateKey) == action.recordIDs[0]
                }) else {
                    actionStatus = "The requested record is not present in this Mac's current local journal; it was left unclaimed."
                    return
                }
                try await apiClient.claim(action, credential: credential)
                pendingAction = action
                pendingActionRecord = record
                actionWasPerformed = false
                actionStatus = "Review the exact local path below. Finder will open only after you press Reveal."
            } catch {
                actionStatus = "Could not load the action queue. No local action was taken. \(error.localizedDescription)"
            }
        }
    }

    func performReveal() {
        guard let credential = pairedCredential, let action = pendingAction,
              let record = pendingActionRecord, action.kind == "reveal" else { return }
        Task {
            do {
                if !actionWasPerformed {
                    let itemURL = URL(fileURLWithPath: record.localPath)
                    let values = try itemURL.resourceValues(forKeys: [.isSymbolicLinkKey])
                    guard values.isSymbolicLink != true, FileManager.default.fileExists(atPath: itemURL.path) else {
                        try await apiClient.submitRevealReceipt(action, recordID: action.recordIDs[0], completed: false, credential: credential)
                        actionStatus = "The scanned item is no longer available; its failure was recorded."
                        pendingAction = nil
                        pendingActionRecord = nil
                        return
                    }
                    NSWorkspace.shared.activateFileViewerSelecting([itemURL])
                    actionWasPerformed = true
                }
                try await apiClient.submitRevealReceipt(action, recordID: action.recordIDs[0], completed: true, credential: credential)
                actionStatus = "Finder revealed the item and the signed receipt was saved."
                pendingAction = nil
                pendingActionRecord = nil
            } catch {
                actionStatus = "The action result could not be recorded. Retry receipt is safe; no file was modified. \(error.localizedDescription)"
            }
        }
    }

    private func sync(summary: ScanGenerationSummary, records: [PluginRecord], credential: StoredDeviceCredential) async {
        do {
            try await apiClient.sync(records: records, summary: summary, credential: credential)
            status = "Scan saved locally and the complete inventory generation synced securely."
        } catch {
            status = "Scan remains saved locally. Sync failed; the last remote complete generation is unchanged. \(error.localizedDescription)"
        }
    }
}

struct CompanionWindow: View {
    @EnvironmentObject private var model: CompanionModel
    @State private var choosingFolders = false

    private var formatCounts: [(PluginFormat, Int)] {
        PluginFormat.allCases.map { format in
            (format, model.records.filter { $0.format == format }.count)
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("AIMM Plugin Library")
                        .font(.largeTitle.bold())
                    Text("Local companion preview")
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Button {
                    model.scanStandardPluginFolders()
                } label: {
                    Label("Scan standard folders", systemImage: "folder.badge.gearshape")
                }
                .disabled(model.isScanning)
                Button {
                    choosingFolders = true
                } label: {
                    Label("Choose folders and scan", systemImage: "folder.badge.plus")
                }
                .disabled(model.isScanning)
            }

            HStack {
                Button("Scan saved custom folders") { model.scanSavedCustomFolders() }
                    .disabled(model.isScanning)
                Button("Forget saved folders") { model.forgetCustomFolders() }
                    .disabled(model.isScanning)
                Text(model.customFolderStatus)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Label(model.status, systemImage: model.isScanning ? "hourglass" : "checkmark.circle")
                .font(.callout)
                .textSelection(.enabled)

            if let generation = model.generation {
                Text("Last complete scan: \(generation.completedAt) · \(generation.rootCount) selected folder(s) · \(generation.recordCount) entries")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            GroupBox("Account sync") {
                VStack(alignment: .leading, spacing: 8) {
                    TextField("Development API URL (https://…)", text: $model.apiBaseURL)
                        .textFieldStyle(.roundedBorder)
                        .disabled(model.isPairing)
                    HStack {
                        Button(model.isPairing ? "Pairing…" : "Pair this Mac") { model.beginPairing() }
                            .disabled(model.isPairing || model.apiBaseURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        Text(model.pairingStatus)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .textSelection(.enabled)
                    }
                    if let phrase = model.pairingPhrase {
                        Text(phrase)
                            .font(.system(.body, design: .monospaced).bold())
                            .padding(.vertical, 4)
                            .accessibilityLabel("Pairing verification phrase: \(phrase)")
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            GroupBox("Pending local action") {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Button("Check for requests") { model.refreshPendingActions() }
                            .disabled(model.isPairing || model.isScanning)
                        Text(model.actionStatus)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .textSelection(.enabled)
                    }
                    if let action = model.pendingAction, let record = model.pendingActionRecord {
                        Text("Reveal request · \(record.name) · \(record.format.rawValue)")
                            .font(.headline)
                        Text(record.localPath)
                            .font(.caption.monospaced())
                            .textSelection(.enabled)
                        Text("Operation \(action.operationID) · expires \(action.expiresAt)")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                        Button(model.actionWasPerformed ? "Retry signed receipt" : "Reveal in Finder") {
                            model.performReveal()
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }

            HStack(spacing: 10) {
                ForEach(formatCounts, id: \.0) { format, count in
                    VStack(alignment: .leading, spacing: 5) {
                        Text(format.rawValue).font(.headline)
                        Text("\(count)").font(.title2.monospacedDigit())
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(12)
                    .background(.quaternary, in: RoundedRectangle(cornerRadius: 10))
                }
            }

            List(model.records, id: \.id) { record in
                HStack(spacing: 12) {
                    Text(record.format.rawValue)
                        .font(.caption.monospaced().bold())
                        .frame(width: 48, alignment: .leading)
                    VStack(alignment: .leading, spacing: 3) {
                        Text(record.name).font(.headline)
                        Text([record.version, record.bundleIdentifier].compactMap { $0 }.joined(separator: " · "))
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                    Text(record.localPath)
                        .font(.caption2.monospaced())
                        .foregroundStyle(.tertiary)
                        .lineLimit(1)
                        .truncationMode(.middle)
                        .frame(maxWidth: 230, alignment: .trailing)
                }
                .padding(.vertical, 3)
            }
            .overlay {
                if model.records.isEmpty {
                    VStack(spacing: 8) {
                        Image(systemName: "puzzlepiece.extension")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                        Text("No scan yet")
                            .font(.headline)
                        Text("Scan standard folders or select a custom folder to create the first local scan.")
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }

            HStack {
                Image(systemName: "lock.shield")
                Text("Scanning starts only when you choose a scan action. Full paths remain local; synced inventory uses opaque IDs and approved metadata only.")
                Spacer()
            }
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        .padding(20)
        .fileImporter(
            isPresented: $choosingFolders,
            allowedContentTypes: [.folder],
            allowsMultipleSelection: true
        ) { result in
            switch result {
            case .success(let urls): model.scan(selectedRoots: urls, rememberCustomRoots: true)
            case .failure(let error): model.status = "Folder selection cancelled or failed: \(error.localizedDescription)"
            }
        }
    }
}
