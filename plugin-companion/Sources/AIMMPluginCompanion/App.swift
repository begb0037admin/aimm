import AppKit
import SwiftUI

struct AIMMPluginCompanionApp: App {
    @StateObject private var model = CompanionModel()
    private let primary: Bool

    init() {
        primary = CompanionInstanceLock.shared.isPrimary
        if !primary { DispatchQueue.main.async { NSApplication.shared.terminate(nil) } }
    }

    var body: some Scene {
        Window("AIMM Plugin Companion", id: "main") {
            if primary {
                VStack(alignment: .leading, spacing: 14) {
                    Text("AIMM Plugin Companion").font(.title2.weight(.semibold))
                    Text("Listening on 127.0.0.1:41736")
                    Text("Last scan: \(model.scannedAt ?? "Scanning…")")
                    HStack(spacing: 18) {
                        Text("AU \(model.counts.AU)")
                        Text("VST2 \(model.counts.VST2)")
                        Text("VST3 \(model.counts.VST3)")
                        Text("CLAP \(model.counts.CLAP)")
                    }
                    .font(.system(.body, design: .monospaced))
                }
                .padding(24)
                .frame(minWidth: 430, minHeight: 160, alignment: .leading)
                .onAppear { model.start() }
            } else { EmptyView() }
        }
    }
}

@MainActor
final class CompanionModel: ObservableObject {
    @Published var scannedAt: String?
    @Published var counts = Inventory.empty.counts
    private let store = InventoryStore()
    private let actions = PluginActions()
    private var bridge: LocalBridge?

    func start() {
        guard bridge == nil else { return }
        let server = LocalBridge(store: store, actions: actions)
        server.onDuplicateInstance = { DispatchQueue.main.async { NSApplication.shared.terminate(nil) } }
        bridge = server
        server.start()
        store.onScan = { [weak self] inventory in
            self?.actions.update(inventory)
            Task { @MainActor in
                self?.scannedAt = inventory.scannedAt
                self?.counts = inventory.counts
            }
        }
        store.scan()
    }
}
