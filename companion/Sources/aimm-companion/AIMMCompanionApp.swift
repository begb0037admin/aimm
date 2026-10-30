import AppKit
import SwiftUI
import UniformTypeIdentifiers
import AIMMCompanionCore

@main
struct AIMMCompanionApp: App {
    @StateObject private var model: CompanionModel
    @Environment(\.openWindow) private var openWindow

    init() {
        let isolatedPreview = ProcessInfo.processInfo.arguments.contains("--isolated-preview") || Bundle.main.bundleIdentifier == "com.aimixmasters.companion.preview.isolated"
        _model = StateObject(wrappedValue: CompanionModel(isolatedPreview: isolatedPreview))
    }

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
    private let defaults: UserDefaults
    private let isolatedPreview: Bool
    @Published var apiBaseURL: String {
        didSet { defaults.set(apiBaseURL, forKey: "aimmLibraryAPIBaseURL") }
    }
    @Published var pairingStatus = "Not paired. Scans stay on this Mac."
    @Published var pairingPhrase: String?
    @Published var isPairing = false
    @Published var actionStatus = "No pending local action loaded."
    @Published var manualCheckStatus = "FabFilter, Voxengo, u-he and selected Valhalla DSP automatic checks are available; other vendors need manual checks."
    @Published var pendingAction: PendingDeviceAction?
    @Published var pendingActionRecord: PluginRecord?
    @Published var pendingActionPreview: PreparedActionPreview?
    @Published var pendingHubAppURL: URL?
    @Published var pendingUnusedDirectory: URL?
    @Published var actionWasPerformed = false
    @Published var customFolderStatus = "No saved custom folders."


    private let journal: ScanJournal?
    private let apiClient = LibraryAPIClient()
    private var pairedCredential: StoredDeviceCredential?

    init(isolatedPreview: Bool = false) {
        self.isolatedPreview = isolatedPreview
        let defaults: UserDefaults
        if isolatedPreview {
            guard let isolatedDefaults = UserDefaults(suiteName: "com.aimixmasters.companion.isolated-preview") else {
                fatalError("Could not create isolated preview preferences.")
            }
            defaults = isolatedDefaults
        } else {
            defaults = .standard
        }
        self.defaults = defaults
        _apiBaseURL = Published(initialValue: defaults.string(forKey: "aimmLibraryAPIBaseURL") ?? "")

        var openedJournal: ScanJournal?
        if isolatedPreview {
            status = "Isolated preview is active. No saved scan, folders, or credentials were read."
        } else {
            if let saved = try? DeviceCredentialStore.load() {
                pairedCredential = saved
                apiBaseURL = saved.apiBaseURL
                pairingStatus = "Paired device \(saved.deviceID)."
            }
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
        }
        self.journal = openedJournal
        let savedBookmarkCount = PluginRootBookmarkStore.count(defaults: defaults)
        customFolderStatus = savedBookmarkCount == 0
            ? "No saved custom folders."
            : "\(savedBookmarkCount) custom folder bookmark(s) saved on this Mac."
    }

    func scan(selectedRoots: [URL], rememberCustomRoots: Bool = false) {
        guard !isolatedPreview else {
            status = "Scanning is disabled in isolated preview mode."
            return
        }
        guard !selectedRoots.isEmpty else { return }
        guard let journal else {
            status = "Cannot scan: local journal is unavailable."
            return
        }
        if rememberCustomRoots {
            do {
                let count = try PluginRootBookmarkStore.save(selectedRoots, defaults: defaults)
                customFolderStatus = "\(count) custom folder bookmark(s) saved locally on this Mac."
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
        guard !isolatedPreview else {
            status = "Scanning is disabled in isolated preview mode."
            return
        }
        let roots = PluginScanner.standardRoots()
        guard !roots.isEmpty else {
            status = "No standard plug-in folders were found. Choose a custom folder to scan."
            return
        }
        scan(selectedRoots: roots)
    }

    func scanSavedCustomFolders() {
        guard !isolatedPreview else {
            status = "Scanning is disabled in isolated preview mode."
            return
        }
        guard PluginRootBookmarkStore.count(defaults: defaults) > 0 else {
            customFolderStatus = "No saved custom folders. Choose folders to add them."
            return
        }
        let resolution = PluginRootBookmarkStore.resolve(defaults: defaults)
        customFolderStatus = resolution.unavailableCount == 0
            ? "Resolved all \(resolution.roots.count) saved custom folder(s)."
            : "\(resolution.unavailableCount) saved folder grant(s) are stale or unavailable; reselect those folders to restore access."
        guard !resolution.roots.isEmpty else {
            status = "No saved custom folder could be accessed. Reselect the folder(s) to restore access."
            return
        }
        scan(selectedRoots: resolution.roots)
    }

    func recordManualCheckFallback() {
        guard let credential = pairedCredential, let generation, !records.isEmpty else {
            manualCheckStatus = "Pair this Mac and complete a scan before recording status."
            return
        }
        manualCheckStatus = "Recording Manual Check for this complete scan…"
        Task {
            do {
                let count = try await apiClient.recordManualCheckFallback(
                    records: records, generationID: generation.id, credential: credential
                )
                manualCheckStatus = "\(count) item(s) now show Manual Check. No vendor sites were contacted."
            } catch {
                manualCheckStatus = "Manual Check status was not saved. The previous observations remain. \(error.localizedDescription)"
            }
        }
    }

    func checkFabFilterStatus() {
        guard let credential = pairedCredential, let generation, !records.isEmpty else {
            manualCheckStatus = "Pair this Mac and complete a scan before checking status."
            return
        }
        manualCheckStatus = "Checking FabFilter's public version page…"
        Task {
            let checkedAt = ISO8601DateFormatter().string(from: Date())
            let catalog: [String: String]
            do {
                catalog = try await FabFilterPublicCatalogClient.shared.latestVersions()
            } catch {
                let failed = VendorStatusSubmission.supportedVendorObservations(records.map { record in
                    FabFilterStatusAdapter.sourceFailure(
                        for: record,
                        recordID: LibraryAPIClient.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                        checkedAt: checkedAt
                    )
                })
                do {
                    let count = try await apiClient.submitCheckObservations(failed, generationID: generation.id, credential: credential)
                    manualCheckStatus = "FabFilter source unavailable; recorded an error for \(count) supported item(s). Other vendor statuses were preserved."
                } catch {
                    manualCheckStatus = "No status was saved. The previous observations remain. \(error.localizedDescription)"
                }
                return
            }

            let observations = VendorStatusSubmission.supportedVendorObservations(records.map { record in
                FabFilterStatusAdapter.observation(
                    for: record,
                    recordID: LibraryAPIClient.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                    catalog: catalog,
                    checkedAt: checkedAt
                )
            })
            do {
                let count = try await apiClient.submitCheckObservations(observations, generationID: generation.id, credential: credential)
                manualCheckStatus = "Checked \(count) supported FabFilter item(s); \(records.count - count) other item(s) remain Manual Check. No files were changed."
            } catch {
                manualCheckStatus = "Status was not saved. The previous observations remain. \(error.localizedDescription)"
            }
        }
    }

    func checkVoxengoStatus() {
        guard let credential = pairedCredential, let generation, !records.isEmpty else {
            manualCheckStatus = "Pair this Mac and complete a scan before checking status."
            return
        }
        manualCheckStatus = "Checking Voxengo's public downloads page…"
        Task {
            let checkedAt = ISO8601DateFormatter().string(from: Date())
            let catalog: [String: String]
            do {
                catalog = try await VoxengoPublicCatalogClient.shared.latestVersions()
            } catch {
                let failed = VendorStatusSubmission.supportedVendorObservations(records.map { record in
                    VoxengoStatusAdapter.sourceFailure(
                        for: record,
                        recordID: LibraryAPIClient.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                        checkedAt: checkedAt
                    )
                })
                do {
                    let count = try await apiClient.submitCheckObservations(failed, generationID: generation.id, credential: credential)
                    manualCheckStatus = "Voxengo source unavailable; recorded an error for \(count) supported item(s). Other vendor statuses were preserved."
                } catch {
                    manualCheckStatus = "No status was saved. The previous observations remain. \(error.localizedDescription)"
                }
                return
            }

            let observations = VendorStatusSubmission.supportedVendorObservations(records.map { record in
                VoxengoStatusAdapter.observation(
                    for: record,
                    recordID: LibraryAPIClient.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                    catalog: catalog,
                    checkedAt: checkedAt
                )
            })
            do {
                let count = try await apiClient.submitCheckObservations(observations, generationID: generation.id, credential: credential)
                manualCheckStatus = "Checked \(count) supported Voxengo item(s); \(records.count - count) other item(s) remain Manual Check. No files were changed."
            } catch {
                manualCheckStatus = "Voxengo observations could not be saved. Previous status remains. \(error.localizedDescription)"
            }
        }
    }

    func checkUHeStatus() {
        guard let credential = pairedCredential, let generation, !records.isEmpty else {
            manualCheckStatus = "Pair this Mac and complete a scan before checking status."
            return
        }
        manualCheckStatus = "Checking u-he's public product pages…"
        Task {
            let checkedAt = ISO8601DateFormatter().string(from: Date())
            let catalog: [String: String]
            do {
                catalog = try await UHePublicCatalogClient.shared.latestVersions()
            } catch {
                let failed = VendorStatusSubmission.supportedVendorObservations(records.map { record in
                    UHeStatusAdapter.sourceFailure(
                        for: record,
                        recordID: LibraryAPIClient.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                        checkedAt: checkedAt
                    )
                })
                do {
                    let count = try await apiClient.submitCheckObservations(failed, generationID: generation.id, credential: credential)
                    manualCheckStatus = "u-he source unavailable; recorded an error for \(count) supported item(s). Other vendor statuses were preserved."
                } catch {
                    manualCheckStatus = "No status was saved. The previous observations remain. \(error.localizedDescription)"
                }
                return
            }

            let observations = VendorStatusSubmission.supportedVendorObservations(records.map { record in
                UHeStatusAdapter.observation(
                    for: record,
                    recordID: LibraryAPIClient.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                    catalog: catalog,
                    checkedAt: checkedAt
                )
            })
            do {
                let count = try await apiClient.submitCheckObservations(observations, generationID: generation.id, credential: credential)
                manualCheckStatus = "Checked \(count) supported u-he item(s); \(records.count - count) other item(s) remain Manual Check. No files were changed."
            } catch {
                manualCheckStatus = "u-he observations could not be saved. Previous status remains. \(error.localizedDescription)"
            }
        }
    }

    func checkValhallaStatus() {
        guard let credential = pairedCredential, let generation, !records.isEmpty else {
            manualCheckStatus = "Pair this Mac and complete a scan before checking status."
            return
        }
        manualCheckStatus = "Checking Valhalla DSP's public product pages…"
        Task {
            let checkedAt = ISO8601DateFormatter().string(from: Date())
            let catalog: [String: String]
            do {
                catalog = try await ValhallaPublicCatalogClient.shared.latestVersions()
            } catch {
                catalog = [:]
            }
            let observations = VendorStatusSubmission.supportedVendorObservations(records.map { record in
                ValhallaStatusAdapter.observation(
                    for: record,
                    recordID: LibraryAPIClient.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                    catalog: catalog,
                    checkedAt: checkedAt
                )
            })
            do {
                let count = try await apiClient.submitCheckObservations(observations, generationID: generation.id, credential: credential)
                manualCheckStatus = "Checked \(count) supported Valhalla DSP item(s); \(records.count - count) other item(s) remain Manual Check. No files were changed."
            } catch {
                manualCheckStatus = "Valhalla DSP observations could not be saved. Previous status remains. \(error.localizedDescription)"
            }
        }
    }

    func forgetCustomFolders() {
        PluginRootBookmarkStore.forget(defaults: defaults)
        customFolderStatus = "Saved custom folder bookmarks removed from this Mac."
    }

    func beginPairing() {
        guard !isolatedPreview else {
            pairingStatus = "Pairing is disabled in isolated preview mode."
            return
        }
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
                guard let journal else {
                    actionStatus = "The local recovery journal is unavailable. Saved previews were preserved and the action queue was not cleared."
                    return
                }
                let recoveryOperationIDs: [String]
                do {
                    recoveryOperationIDs = try journal.pendingRecoveryOperationIDs()
                } catch {
                    actionStatus = "The local recovery journal could not be read. Saved previews were preserved and no action was taken. \(error.localizedDescription)"
                    return
                }
                let commands = try await apiClient.pendingActions(credential: credential,
                    recoveryOperationIDs: recoveryOperationIDs)
                let action = commands.first(where: { recoveryOperationIDs.contains($0.operationID) }) ?? commands.first
                guard let action else {
                    try PreparedActionPreviewStore.deleteAll()
                    pendingAction = nil
                    pendingActionRecord = nil
                    pendingActionPreview = nil
                    actionStatus = "No pending local actions."
                    return
                }
                let hasJournaledAction = try hasLocalActionEntry(action, journal: journal)
                guard ["reveal", "open_vendor_site", "launch_hub", "move_to_unused", "restore"].contains(action.kind), action.recordIDs.count == 1,
                      generation?.id == action.generationID || hasJournaledAction else {
                    actionStatus = "A queued action does not match this build or the last complete local generation; it was left unclaimed."
                    return
                }
                var parentMoveEntry: LocalFileActionEntry?
                if action.kind == "restore" {
                    guard let parentID = action.parentMoveOperationID,
                          let parent = try journal.fileAction(operationID: parentID),
                          parent.kind == "move_to_unused", parent.state == "completed", parent.destinationVerified,
                          parent.recordID == action.recordIDs[0],
                          !records.contains(where: { LibraryAPIClient.opaqueRecordID(localPath: $0.localPath, privateKey: credential.privateKey) == action.recordIDs[0] }) else {
                        actionStatus = "The restore does not match a completed, verified move in this Mac's journal, or the item is already present. It was left unclaimed."
                        return
                    }
                    parentMoveEntry = parent
                }
                let candidateRecords: [PluginRecord]
                if let parentMoveEntry {
                    candidateRecords = try journal.records(for: parentMoveEntry.generationID)
                } else if hasJournaledAction {
                    candidateRecords = try journal.records(for: action.generationID)
                } else {
                    candidateRecords = records
                }
                let record = candidateRecords.first(where: {
                        LibraryAPIClient.opaqueRecordID(localPath: $0.localPath, privateKey: credential.privateKey) == action.recordIDs[0]
                    })
                guard let record else {
                    actionStatus = "The requested record is not present in this Mac's current local journal; it was left unclaimed."
                    return
                }
                let preparedPreview = pendingActionPreview?.operationID == action.operationID
                    ? pendingActionPreview
                    : try PreparedActionPreviewStore.load(operationID: action.operationID)
                if let preparedPreview {
                    guard LibraryAPIClient.previewBindingIsCurrent(
                        preparedPreview, action: action, record: record, credential: credential,
                        allowExpiredPreviewForRecovery: hasJournaledAction
                    ) else {
                        if await discardExpiredUnconfirmedPreviewIfSafe(action, credential: credential,
                                                                        hasJournaledAction: hasJournaledAction) {
                            return
                        }
                        actionStatus = "The server's preview digest, item, scan, or expiry no longer matches this Mac's copy. Request a fresh action."
                        clearPendingAction()
                        return
                    }
                    pendingAction = action
                    pendingActionRecord = record
                    pendingActionPreview = preparedPreview
                    if action.kind == "move_to_unused", let destinationPath = preparedPreview.destinationPath {
                        pendingUnusedDirectory = URL(fileURLWithPath: destinationPath).deletingLastPathComponent()
                    }
                    actionWasPerformed = hasJournaledAction
                    if LibraryAPIClient.requiresOwnerPasskeyConfirmation(for: action.kind) {
                        actionStatus = hasJournaledAction && action.ownerConfirmedAt != nil
                            ? "The original owner-confirmed action is being recovered from the local journal. Review the recorded paths and use the local action button."
                            : LibraryAPIClient.ownerConfirmationIsCurrent(action, matching: preparedPreview)
                            ? "The owner confirmed this exact preview. Review it and use the local action button."
                            : "The exact preview is current and waits for owner passkey confirmation."
                    } else {
                        actionStatus = "The exact preview is current. Review it and use the local confirmation button."
                    }
                    return
                }
                if action.previewDigest != nil {
                    if await discardExpiredUnconfirmedPreviewIfSafe(action, credential: credential,
                                                                    hasJournaledAction: hasJournaledAction) {
                        return
                    }
                    actionStatus = "The Mac's exact preview was lost. Request a fresh action so the destination and item can be reviewed again."
                    clearPendingAction()
                    return
                }
                if action.kind == "open_vendor_site", VendorSiteActionAdapter.vendorSiteURL(for: record) == nil {
                    actionStatus = "This build has no approved vendor-site route for the requested item; it was left unclaimed."
                    return
                }
                var unusedDirectory: URL?
                if action.kind == "restore" {
                    guard let parentMoveEntry,
                          FileManager.default.fileExists(atPath: parentMoveEntry.destinationPath),
                          !FileManager.default.fileExists(atPath: parentMoveEntry.sourcePath),
                          (try? LocalPluginFileActions.treeDigest(URL(fileURLWithPath: parentMoveEntry.destinationPath))) == parentMoveEntry.treeDigest else {
                        actionStatus = "The moved file or original location changed. The restore remains unclaimed; request a fresh preview after checking the Mac."
                        return
                    }
                }
                if action.kind == "move_to_unused" {
                    let roots = knownPluginRoots()
                    guard roots.unavailableCount == 0,
                          roots.roots.contains(where: { isPath(record.localPath, inside: $0) }) else {
                        actionStatus = "The item is not under a currently available standard or saved plug-in folder. Save its folder access and scan again before moving it. The action remains unclaimed."
                        return
                    }
                    let panel = NSOpenPanel()
                    panel.title = "Choose the Unused folder"
                    panel.message = "Select the destination folder named Unused. The Mac will show its exact path before any move."
                    panel.prompt = "Use this folder"
                    panel.canChooseFiles = false
                    panel.canChooseDirectories = true
                    panel.allowsMultipleSelection = false
                    guard panel.runModal() == .OK, let selected = panel.url else {
                        actionStatus = "No Unused folder was selected. The action remains unclaimed."
                        return
                    }
                    guard selected.lastPathComponent.caseInsensitiveCompare("Unused") == .orderedSame else {
                        actionStatus = "Choose a folder named Unused. The action remains unclaimed."
                        return
                    }
                    do {
                        _ = try LocalPluginFileActions.previewDestination(source: URL(fileURLWithPath: record.localPath), unusedDirectory: selected)
                        _ = try LocalPluginFileActions.treeDigest(URL(fileURLWithPath: record.localPath))
                    } catch {
                        actionStatus = "The item or Unused folder cannot be safely previewed. The action remains unclaimed. \(error.localizedDescription)"
                        return
                    }
                    unusedDirectory = selected
                }
                try await apiClient.claim(action, credential: credential)
                let preview = try await apiClient.submitPreparedPreview(action, record: record,
                    unusedDirectory: unusedDirectory, parentMoveEntry: parentMoveEntry, credential: credential)
                do {
                    try PreparedActionPreviewStore.save(preview)
                } catch {
                    do {
                        try await apiClient.discardPreparedPreview(action, digest: preview.digest, credential: credential)
                        actionStatus = "The exact preview could not be saved in this Mac's secure storage, so the server discarded it. No files changed. Check the queue and prepare the action again."
                    } catch {
                        actionStatus = "The exact preview could not be saved in this Mac's secure storage. No files changed, and the server could not confirm discarding it. Do not use this action; refresh the queue after it expires."
                    }
                    return
                }
                pendingAction = action.binding(preparedPreview: preview)
                pendingActionRecord = record
                pendingActionPreview = preview
                pendingHubAppURL = nil
                pendingUnusedDirectory = unusedDirectory
                actionWasPerformed = false
                actionStatus = action.kind == "reveal"
                    ? "The signed, short-lived path preview is stored for owner review. Finder will open only after you press Reveal."
                    : action.kind == "open_vendor_site"
                        ? "The approved vendor page is ready. It opens only after you press the button below."
                        : action.kind == "launch_hub"
                            ? "Choose the local hub app, review its name, then press Open."
                            : action.kind == "restore"
                                ? "Review the exact Unused source and original destination in the browser, confirm with a passkey, then press Restore here."
                                : "Review the exact source and Unused destination in the browser, confirm with a passkey, then press Move here."
            } catch {
                actionStatus = "Could not load the action queue. No local action was taken. \(error.localizedDescription)"
            }
        }
    }

    private func discardExpiredUnconfirmedPreviewIfSafe(_ action: PendingDeviceAction,
                                                         credential: StoredDeviceCredential,
                                                         hasJournaledAction: Bool) async -> Bool {
        guard action.state == "claimed", !hasJournaledAction, action.ownerConfirmedAt == nil,
              let digest = action.previewDigest,
              let previewExpiryText = action.previewExpiresAt,
              let previewExpiry = LibraryAPIClient.parseISO8601(previewExpiryText),
              previewExpiry <= Date(),
              let operationExpiry = LibraryAPIClient.parseISO8601(action.expiresAt),
              operationExpiry > Date() else {
            return false
        }

        do {
            try await apiClient.discardPreparedPreview(action, digest: digest, credential: credential)
            do {
                try PreparedActionPreviewStore.delete(operationID: action.operationID)
            } catch {
                actionStatus = "The expired preview was cleared from the server, but this Mac could not remove its saved copy. No files changed; stop and resolve the local preview before continuing. \(error.localizedDescription)"
                return true
            }
            if pendingAction?.operationID == action.operationID { clearPendingAction() }
            actionStatus = "The expired, unconfirmed preview was cleared safely. Check for requests to choose the Unused folder and prepare a fresh exact preview. No files changed."
        } catch {
            actionStatus = "The expired preview could not be cleared, so no recovery occurred. No files changed. \(error.localizedDescription)"
        }
        return true
    }

    func performReveal() {
        guard let credential = pairedCredential, let action = pendingAction,
              let record = pendingActionRecord, let preview = pendingActionPreview,
              action.kind == "reveal" else { return }
        Task {
            do {
                if !actionWasPerformed {
                    guard LibraryAPIClient.preparedPreviewIsCurrent(preview, action: action, record: record,
                                                                    currentRecords: records,
                                                                    currentGenerationID: generation?.id,
                                                                    credential: credential) else {
                        actionStatus = "The local scan or action preview changed or expired. Scan again and request a fresh action."
                        clearPendingAction()
                        return
                    }
                    let itemURL = URL(fileURLWithPath: record.localPath)
                    let values = try itemURL.resourceValues(forKeys: [.isSymbolicLinkKey])
                    guard values.isSymbolicLink != true, FileManager.default.fileExists(atPath: itemURL.path) else {
                        try await apiClient.submitRevealReceipt(action, recordID: action.recordIDs[0], completed: false, credential: credential)
                        actionStatus = "The scanned item is no longer available; its failure was recorded."
                        clearPendingAction()
                        return
                    }
                    NSWorkspace.shared.activateFileViewerSelecting([itemURL])
                    actionWasPerformed = true
                }
                try await apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: true, credential: credential)
                actionStatus = "Finder revealed the item and the signed receipt was saved."
                clearPendingAction()
            } catch {
                actionStatus = "The action result could not be recorded. Retry receipt is safe; no file was modified. \(error.localizedDescription)"
            }
        }
    }

    func openVendorSite() {
        guard let credential = pairedCredential, let action = pendingAction,
              let record = pendingActionRecord, let preview = pendingActionPreview,
              action.kind == "open_vendor_site",
              let url = VendorSiteActionAdapter.vendorSiteURL(for: record) else { return }
        Task {
            do {
                if !actionWasPerformed {
                    guard LibraryAPIClient.preparedPreviewIsCurrent(preview, action: action, record: record,
                                                                    currentRecords: records,
                                                                    currentGenerationID: generation?.id,
                                                                    credential: credential) else {
                        actionStatus = "The local scan or action preview changed or expired. Scan again and request a fresh action."
                        clearPendingAction()
                        return
                    }
                    NSWorkspace.shared.open(url)
                    actionWasPerformed = true
                }
                try await apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: true, credential: credential)
                actionStatus = "The approved vendor page opened and the signed receipt was saved."
                clearPendingAction()
            } catch {
                actionStatus = "The site action result could not be recorded. Retry the signed receipt safely. \(error.localizedDescription)"
            }
        }
    }

    func moveToUnused() {
        guard let credential = pairedCredential, let action = pendingAction,
              let record = pendingActionRecord, let preview = pendingActionPreview,
              action.kind == "move_to_unused", let destinationPath = preview.destinationPath,
              let treeDigest = preview.treeDigest, let journal else { return }
        Task {
            do {
                if !actionWasPerformed {
                    guard LibraryAPIClient.preparedPreviewIsCurrent(preview, action: action, record: record,
                            currentRecords: records, currentGenerationID: generation?.id, credential: credential) else {
                        actionStatus = "The item, destination, scan or exact preview changed or expired. Request a fresh action."
                        clearPendingAction()
                        return
                    }
                }
                let authorizedAction = try await apiClient.currentFileActionAuthorization(
                    action, preview: preview, credential: credential,
                    allowExpiredPreviewForRecovery: actionWasPerformed
                )
                if !actionWasPerformed {
                    guard LibraryAPIClient.preparedPreviewIsCurrent(preview, action: authorizedAction, record: record,
                            currentRecords: records, currentGenerationID: generation?.id, credential: credential) else {
                        actionStatus = "The action changed while authorization was being checked. Request a fresh action."
                        clearPendingAction()
                        return
                    }
                }
                let result = try LocalPluginFileActions.moveToUnused(
                    operationID: action.operationID, generationID: action.generationID,
                    recordID: action.recordIDs[0], source: URL(fileURLWithPath: record.localPath),
                    unusedDirectory: URL(fileURLWithPath: destinationPath).deletingLastPathComponent(),
                    journal: journal, expectedTreeDigest: treeDigest,
                    expectedDestinationPath: destinationPath
                )
                actionWasPerformed = true
                actionStatus = "The move is journaled. Scanning and syncing the complete inventory…"
                let rescanned = try await rescanKnownRootsAndSync()
                let evidence = MoveActionReceiptEvidence(
                    treeDigest: result.treeDigest, destinationVerified: true, sourceRemoved: true,
                    rescanGenerationID: rescanned.id, previewDigest: preview.digest
                )
                try await apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: true,
                                                        moveEvidence: evidence, credential: credential)
                actionStatus = "Moved to Unused, verified the destination, rescanned the plug-in folders and saved the signed receipt."
                clearPendingAction()
            } catch let error as LocalPluginFileActionError {
                if preserveForLocalRecovery(action, journal: journal) {
                    actionWasPerformed = true
                    actionStatus = "The move has a durable local recovery entry. Press again to resume or verify it safely; no failure receipt was sent. \(error.localizedDescription)"
                    return
                }
                if actionWasPerformed {
                    actionStatus = "The move already completed. The complete rescan or receipt did not finish; press this button again to resume safely. \(error.localizedDescription)"
                    return
                }
                let code: String
                switch error {
                case .itemChanged: code = "item_changed"
                case .destinationAlreadyExists: code = "destination_collision"
                case .destinationUnavailable: code = "permission_denied"
                case .recoveryRequired: code = "recovery_required"
                default: code = "move_failed"
                }
                do {
                    try await apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: false,
                        moveEvidence: MoveActionReceiptEvidence(failureCode: code, previewDigest: preview.digest),
                        credential: credential)
                    actionStatus = "The move was not completed. A signed failure result was saved; no automatic retry was started. \(error.localizedDescription)"
                    clearPendingAction()
                } catch {
                    actionStatus = "The move was not completed, and its signed failure result could not be saved. Check the action again before starting a fresh preview. \(error.localizedDescription)"
                }
            } catch {
                if preserveForLocalRecovery(action, journal: journal) {
                    actionWasPerformed = true
                    actionStatus = "The move has a durable local recovery entry. Press again to resume or verify it safely; no failure receipt was sent. \(error.localizedDescription)"
                    return
                }
                if actionWasPerformed {
                    actionStatus = "The move already completed. The complete rescan or signed receipt did not finish; press this button again to resume safely. \(error.localizedDescription)"
                } else {
                    actionStatus = "The move was not completed. No success result was sent. \(error.localizedDescription)"
                }
            }
        }
    }

    func restoreFromUnused() {
        guard let credential = pairedCredential, let action = pendingAction,
              let record = pendingActionRecord, let preview = pendingActionPreview,
              action.kind == "restore", let parentID = action.parentMoveOperationID,
              let treeDigest = preview.treeDigest, let journal else { return }
        guard let parentMoveEntry = try? journal.fileAction(operationID: parentID) else { return }
        Task {
            do {
                if !actionWasPerformed {
                    guard LibraryAPIClient.preparedPreviewIsCurrent(preview, action: action, record: record,
                            currentRecords: records, currentGenerationID: generation?.id,
                            credential: credential, parentMoveEntry: parentMoveEntry) else {
                        actionStatus = "The moved item, original location, scan or exact preview changed or expired. Request a fresh restore action."
                        clearPendingAction()
                        return
                    }
                }
                let authorizedAction = try await apiClient.currentFileActionAuthorization(
                    action, preview: preview, credential: credential,
                    allowExpiredPreviewForRecovery: actionWasPerformed
                )
                if !actionWasPerformed {
                    guard LibraryAPIClient.preparedPreviewIsCurrent(
                        preview, action: authorizedAction, record: record, currentRecords: records,
                        currentGenerationID: generation?.id, credential: credential,
                        parentMoveEntry: parentMoveEntry
                    ) else {
                        actionStatus = "The action changed while authorization was being checked. Request a fresh action."
                        clearPendingAction()
                        return
                    }
                }
                let result = try LocalPluginFileActions.restoreFromUnused(
                    operationID: action.operationID, parentMoveOperationID: parentID,
                    generationID: action.generationID, recordID: action.recordIDs[0],
                    unusedDirectory: URL(fileURLWithPath: parentMoveEntry.destinationPath).deletingLastPathComponent(),
                    journal: journal, expectedTreeDigest: treeDigest,
                    expectedDestinationPath: parentMoveEntry.sourcePath
                )
                actionWasPerformed = true
                actionStatus = "The restore is journaled. Scanning and syncing the complete inventory…"
                let rescanned = try await rescanKnownRootsAndSync()
                let evidence = MoveActionReceiptEvidence(
                    treeDigest: result.treeDigest, destinationVerified: true, sourceRemoved: true,
                    rescanGenerationID: rescanned.id, previewDigest: preview.digest
                )
                try await apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: true,
                                                        moveEvidence: evidence, credential: credential)
                actionStatus = "Restored to its original location, verified the contents, rescanned the plug-in folders and saved the signed receipt."
                clearPendingAction()
            } catch let error as LocalPluginFileActionError {
                if preserveForLocalRecovery(action, journal: journal) {
                    actionWasPerformed = true
                    actionStatus = "The restore has a durable local recovery entry. Press again to resume or verify it safely; no failure receipt was sent. \(error.localizedDescription)"
                    return
                }
                if actionWasPerformed {
                    actionStatus = "The restore already completed. The complete rescan or receipt did not finish; press this button again to resume safely. \(error.localizedDescription)"
                    return
                }
                let code: String
                switch error {
                case .itemChanged: code = "item_changed"
                case .destinationAlreadyExists: code = "destination_collision"
                case .destinationUnavailable: code = "permission_denied"
                case .recoveryRequired: code = "recovery_required"
                default: code = "restore_failed"
                }
                do {
                    try await apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: false,
                        moveEvidence: MoveActionReceiptEvidence(failureCode: code, previewDigest: preview.digest),
                        credential: credential)
                    actionStatus = "The restore was not completed. A signed failure result was saved; no automatic retry was started. \(error.localizedDescription)"
                    clearPendingAction()
                } catch {
                    actionStatus = "The restore was not completed, and its signed failure result could not be saved. Check the action before requesting a fresh preview. \(error.localizedDescription)"
                }
            } catch {
                if preserveForLocalRecovery(action, journal: journal) {
                    actionWasPerformed = true
                    actionStatus = "The restore has a durable local recovery entry. Press again to resume or verify it safely; no failure receipt was sent. \(error.localizedDescription)"
                    return
                }
                if actionWasPerformed {
                    actionStatus = "The restore already completed. The complete rescan or signed receipt did not finish; press this button again to resume safely. \(error.localizedDescription)"
                } else {
                    actionStatus = "The restore was not completed. No success result was sent. \(error.localizedDescription)"
                }
            }
        }
    }

    private func preserveForLocalRecovery(_ action: PendingDeviceAction, journal: ScanJournal) -> Bool {
        do {
            return try journal.hasNeedsRecoveryAction(operationID: action.operationID, kind: action.kind)
        } catch {
            // If the local journal cannot be read, do not publish a terminal
            // failure that could contradict an on-disk recovery record.
            return true
        }
    }

    private func hasLocalActionEntry(_ action: PendingDeviceAction, journal: ScanJournal?) throws -> Bool {
        guard let journal else { return false }
        let state: String?
        switch action.kind {
        case "move_to_unused": state = try journal.fileAction(operationID: action.operationID)?.state
        case "restore": state = try journal.restoreAction(operationID: action.operationID)?.state
        default: return false
        }
        return ["prepared", "completed", "needs_recovery"].contains(state ?? "")
    }

    private func knownPluginRoots() -> (roots: [URL], unavailableCount: Int) {
        let saved = PluginRootBookmarkStore.resolve(defaults: defaults)
        var unique: [String: URL] = [:]
        for root in PluginScanner.standardRoots() + saved.roots {
            let normalized = root.standardizedFileURL
            unique[normalized.path] = normalized
        }
        return (Array(unique.values).sorted { $0.path < $1.path }, saved.unavailableCount)
    }

    private func isPath(_ path: String, inside root: URL) -> Bool {
        let rootPath = root.standardizedFileURL.path
        let itemPath = URL(fileURLWithPath: path).standardizedFileURL.path
        return itemPath == rootPath || itemPath.hasPrefix(rootPath.hasSuffix("/") ? rootPath : rootPath + "/")
    }

    private func rescanKnownRootsAndSync() async throws -> ScanGenerationSummary {
        guard let journal, let credential = pairedCredential else {
            throw DeviceSyncError.rejected("The local journal or paired device is unavailable.")
        }
        let resolved = knownPluginRoots()
        guard resolved.unavailableCount == 0, !resolved.roots.isEmpty else {
            throw DeviceSyncError.rejected("A saved plug-in folder is unavailable, so a complete post-move scan cannot be confirmed.")
        }
        let startedAt = ISO8601DateFormatter().string(from: Date())
        let scopedRoots = resolved.roots.filter { $0.startAccessingSecurityScopedResource() }
        defer { scopedRoots.forEach { $0.stopAccessingSecurityScopedResource() } }
        let scanned = try PluginScanner().scan(roots: resolved.roots)
        let summary = ScanGenerationSummary(id: UUID().uuidString.lowercased(),
            startedAt: startedAt, completedAt: ISO8601DateFormatter().string(from: Date()),
            rootCount: resolved.roots.count, recordCount: scanned.count)
        try journal.saveCompleteGeneration(summary: summary, records: scanned)
        generation = summary
        records = scanned
        try await apiClient.sync(records: scanned, summary: summary, credential: credential)
        status = "Complete post-move scan saved locally and synced securely."
        return summary
    }

    func chooseHubApplication() {
        guard pendingAction?.kind == "launch_hub" else { return }
        let panel = NSOpenPanel()
        panel.title = "Choose a plug-in hub application"
        panel.message = "Select the vendor's installed .app. It will not open until you press Open below."
        panel.allowedContentTypes = [.applicationBundle]
        panel.canChooseFiles = true
        panel.canChooseDirectories = false
        panel.allowsMultipleSelection = false
        guard panel.runModal() == .OK, let url = panel.url else { return }
        do {
            let values = try url.resourceValues(forKeys: [.isSymbolicLinkKey, .isDirectoryKey])
            guard url.pathExtension.lowercased() == "app", values.isDirectory == true,
                  values.isSymbolicLink != true, Bundle(url: url)?.bundleIdentifier != nil else {
                actionStatus = "Choose a valid, non-symlink macOS application bundle. No app was opened."
                return
            }
            pendingHubAppURL = url
            actionStatus = "Selected \(url.lastPathComponent). Press Open to launch it."
        } catch {
            actionStatus = "The selected app could not be checked. No app was opened."
        }
    }

    func openHubApplication() {
        guard let credential = pairedCredential, let action = pendingAction,
              let record = pendingActionRecord, let preview = pendingActionPreview,
              action.kind == "launch_hub",
              let url = pendingHubAppURL else { return }
        if actionWasPerformed {
            Task {
                do {
                    try await apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: true, credential: credential)
                    actionStatus = "The selected hub app opened and the signed receipt was saved."
                    clearPendingAction()
                } catch {
                    actionStatus = "The hub app opened, but its signed receipt could not be saved. Retry the receipt safely. \(error.localizedDescription)"
                }
            }
            return
        }
        guard LibraryAPIClient.preparedPreviewIsCurrent(preview, action: action, record: record,
                                                        currentRecords: records,
                                                        currentGenerationID: generation?.id,
                                                        credential: credential) else {
            actionStatus = "The local scan or action preview changed or expired. Scan again and request a fresh action."
            clearPendingAction()
            return
        }
        NSWorkspace.shared.openApplication(at: url, configuration: NSWorkspace.OpenConfiguration()) { _, launchError in
            Task { @MainActor in
                guard launchError == nil else {
                    self.actionStatus = "The selected hub app did not open. No success receipt was sent."
                    return
                }
                self.actionWasPerformed = true
                Task {
                    do {
                        try await self.apiClient.submitActionReceipt(action, recordID: action.recordIDs[0], completed: true, credential: credential)
                        self.actionStatus = "The selected hub app opened and the signed receipt was saved."
                        self.pendingAction = nil
                        self.pendingActionRecord = nil
                        self.pendingHubAppURL = nil
                    } catch {
                        self.actionStatus = "The hub app opened, but its signed receipt could not be saved. Retry the receipt safely. \(error.localizedDescription)"
                    }
                }
            }
        }
        _ = record
    }

    private func clearPendingAction() {
        if let operationID = pendingAction?.operationID {
            try? PreparedActionPreviewStore.delete(operationID: operationID)
        }
        pendingAction = nil
        pendingActionRecord = nil
        pendingActionPreview = nil
        pendingHubAppURL = nil
        pendingUnusedDirectory = nil
        actionWasPerformed = false
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
    @State private var confirmingPairing = false
    @State private var showingDuplicateReview = false

    private var formatCounts: [(PluginFormat, Int)] {
        PluginFormat.allCases.map { format in
            (format, model.records.filter { $0.format == format }.count)
        }
    }

    private var duplicateGroups: [DuplicateGroup] {
        DuplicateAnalyzer.analyze(model.records)
    }

    private var pairingDisclosure: String {
        let deviceName = Host.current().localizedName ?? "This Mac"
        guard model.generation != nil else {
            return "Pairing sends the device name (\(deviceName)) and its public signing key to \(model.apiBaseURL). After you approve the phrase in your browser, the device credential is saved in Keychain. No inventory is sent until you complete a scan; later complete scans sync automatically."
        }
        return "Pairing sends the device name (\(deviceName)) and its public signing key to \(model.apiBaseURL). After you approve the phrase in your browser, the device credential is saved in Keychain and the saved scan (\(model.records.count) entries) syncs automatically: product names, bundle identifiers, versions, formats, metadata sources and opaque record IDs. File paths and folder bookmarks stay on this Mac."
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
                        Button(model.isPairing ? "Pairing…" : "Pair this Mac") { confirmingPairing = true }
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

            GroupBox("Update status") {
                VStack(alignment: .leading, spacing: 8) {
                    Text("FabFilter, Voxengo, u-he and selected Valhalla DSP checks read public version pages. Other vendors remain Manual Check. This records version status only; it does not download or install anything.")
                        .font(.caption)
                    HStack {
                        Button("Check FabFilter versions") { model.checkFabFilterStatus() }
                            .disabled(model.isScanning || model.isPairing || model.records.isEmpty)
                        Button("Check Voxengo versions") { model.checkVoxengoStatus() }
                            .disabled(model.isScanning || model.isPairing || model.records.isEmpty)
                        Button("Check u-he versions") { model.checkUHeStatus() }
                            .disabled(model.isScanning || model.isPairing || model.records.isEmpty)
                        Button("Check Valhalla versions") { model.checkValhallaStatus() }
                            .disabled(model.isScanning || model.isPairing || model.records.isEmpty)
                        Button("Record Manual Check status") { model.recordManualCheckFallback() }
                            .disabled(model.isScanning || model.isPairing || model.records.isEmpty)
                        Text(model.manualCheckStatus)
                            .font(.caption)
                            .foregroundStyle(.secondary)
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
                        Text(action.kind == "reveal" ? "Reveal request · \(record.name) · \(record.format.rawValue)" : action.kind == "open_vendor_site" ? "Open vendor site · \(record.name)" : action.kind == "launch_hub" ? "Open local hub app · \(record.name)" : action.kind == "restore" ? "Restore from Unused · \(record.name)" : "Move to Unused · \(record.name)")
                            .font(.headline)
                        if action.kind == "reveal" {
                            Text(record.localPath)
                                .font(.caption.monospaced())
                                .textSelection(.enabled)
                        } else if action.kind == "open_vendor_site" {
                            Text("Destination: \(VendorSiteActionAdapter.vendorName(for: record) ?? "approved vendor")'s official downloads page")
                                .font(.caption)
                        } else if ["move_to_unused", "restore"].contains(action.kind), let preview = model.pendingActionPreview {
                            Text("Source: \(record.localPath)")
                                .font(.caption.monospaced())
                                .textSelection(.enabled)
                            Text("Destination: \(preview.destinationPath ?? "select a fresh Unused folder")")
                                .font(.caption.monospaced())
                                .textSelection(.enabled)
                            Text(action.kind == "restore" ? "The restore verifies the moved contents, returns them to the exact original location, then rescans before reporting success." : "The move verifies file contents, keeps a local journal receipt, then rescans before reporting success.")
                                .font(.caption)
                        } else {
                            Text("The Mac user chooses the application locally. Its path is not uploaded.")
                                .font(.caption)
                            if let hubURL = model.pendingHubAppURL {
                                Text("Selected app: \(hubURL.lastPathComponent)").font(.caption)
                            }
                        }
                        Text("Operation \(action.operationID) · expires \(action.expiresAt)")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                        if action.kind == "reveal" {
                            Button(model.actionWasPerformed ? "Retry signed receipt" : "Reveal in Finder") {
                                model.performReveal()
                            }
                        } else if action.kind == "open_vendor_site" {
                            Button(model.actionWasPerformed ? "Retry signed receipt" : "Open vendor site") {
                                model.openVendorSite()
                            }
                        } else if action.kind == "launch_hub" {
                            Button("Choose hub app…") { model.chooseHubApplication() }
                                .disabled(model.actionWasPerformed)
                            if model.pendingHubAppURL != nil {
                                Button(model.actionWasPerformed ? "Retry signed receipt" : "Open selected hub app") {
                                    model.openHubApplication()
                                }
                            }
                        } else if action.kind == "move_to_unused" {
                            Button(model.actionWasPerformed ? "Resume scan and signed receipt" : "Move to Unused") {
                                model.moveToUnused()
                            }.disabled(model.pendingActionPreview.map {
                                !LibraryAPIClient.ownerConfirmationIsCurrent(action, matching: $0)
                            } ?? true)
                        } else if action.kind == "restore" {
                            Button(model.actionWasPerformed ? "Resume scan and signed receipt" : "Restore to original location") {
                                model.restoreFromUnused()
                            }.disabled(model.pendingActionPreview.map {
                                !LibraryAPIClient.ownerConfirmationIsCurrent(action, matching: $0)
                            } ?? true)
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

            List {
                Section("Possible duplicate copies — review only") {
                    if duplicateGroups.isEmpty {
                        Text("No duplicates identified from matching bundle IDs and formats.")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(duplicateGroups) { group in
                            VStack(alignment: .leading, spacing: 5) {
                                Text("\(group.productName) · \(group.format.rawValue)").font(.headline)
                                Text("Possible extra copy; no file has been changed.")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                                ForEach(group.extraCopies, id: \.id) { record in
                                    Text(record.localPath)
                                        .font(.caption2.monospaced())
                                        .textSelection(.enabled)
                                }
                            }
                            .padding(.vertical, 3)
                        }
                    }
                }

                Section("Installed plug-in files") {
                    ForEach(model.records, id: \.id) { record in
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
                }
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
        .onOpenURL { url in
            guard url.scheme == "aimm-companion",
                  url.host == "duplicates",
                  url.path.isEmpty, url.query == nil, url.fragment == nil,
                  url.user == nil, url.password == nil, url.port == nil else { return }
            showingDuplicateReview = true
        }
        .sheet(isPresented: $showingDuplicateReview) {
            DuplicateReviewSheet(groups: duplicateGroups, hasSavedScan: model.generation != nil)
        }
        .confirmationDialog(
            "Review Mac pairing and inventory sync",
            isPresented: $confirmingPairing,
            titleVisibility: .visible
        ) {
            Button("Continue to pairing approval") { model.beginPairing() }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text(pairingDisclosure)
        }
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

private struct DuplicateReviewSheet: View {
    @Environment(\.dismiss) private var dismiss

    let groups: [DuplicateGroup]
    let hasSavedScan: Bool

    var body: some View {
        NavigationStack {
            Group {
                if !hasSavedScan {
                    VStack(spacing: 10) {
                        Image(systemName: "doc.text.magnifyingglass")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                        Text("No saved scan yet")
                            .font(.headline)
                        Text("Choose a scan in AIMM Companion to create a local duplicate review. Opening this view never starts a scan.")
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: 420)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if groups.isEmpty {
                    VStack(spacing: 10) {
                        Image(systemName: "checkmark.circle")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                        Text("No duplicates identified")
                            .font(.headline)
                        Text("The saved local scan has no matching bundle IDs and formats at multiple paths.")
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: 420)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(groups) { group in
                        VStack(alignment: .leading, spacing: 7) {
                            Text("\(group.productName) · \(group.format.rawValue)")
                                .font(.headline)
                            Text("Possible extra copy · review only · no file has been changed")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            ForEach(group.extraCopies, id: \.id) { record in
                                Text(record.localPath)
                                    .font(.caption2.monospaced())
                                    .textSelection(.enabled)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("Duplicate Review")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
        .frame(minWidth: 520, minHeight: 360)
    }
}
