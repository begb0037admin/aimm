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

    private let journal: ScanJournal?

    init() {
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
    }

    func scan(selectedRoots: [URL]) {
        guard !selectedRoots.isEmpty else { return }
        guard let journal else {
            status = "Cannot scan: local journal is unavailable."
            return
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
        } catch {
            status = "Scan was not saved; the previous complete scan is unchanged. \(error.localizedDescription)"
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
                    choosingFolders = true
                } label: {
                    Label("Choose folders and scan", systemImage: "folder.badge.plus")
                }
                .disabled(model.isScanning)
            }

            Label(model.status, systemImage: model.isScanning ? "hourglass" : "checkmark.circle")
                .font(.callout)
                .textSelection(.enabled)

            if let generation = model.generation {
                Text("Last complete scan: \(generation.completedAt) · \(generation.rootCount) selected folder(s) · \(generation.recordCount) entries")
                    .font(.caption)
                    .foregroundStyle(.secondary)
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
                        Text("Select a folder to create the first local scan.")
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }

            HStack {
                Image(systemName: "lock.shield")
                Text("This preview scans only folders you choose. Results are stored locally; account pairing and sync are not enabled yet.")
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
            case .success(let urls): model.scan(selectedRoots: urls)
            case .failure(let error): model.status = "Folder selection cancelled or failed: \(error.localizedDescription)"
            }
        }
    }
}
