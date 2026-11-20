import AppKit
import SwiftUI

struct AIMMPluginCompanionApp: App {
    @Environment(\.openWindow) private var openWindow
    @StateObject private var model = CompanionModel()
    private let primary: Bool

    init() {
        primary = CompanionInstanceLock.shared.isPrimary
        if !primary { DispatchQueue.main.async { NSApplication.shared.terminate(nil) } }
    }

    var body: some Scene {
        Window("AIMM Plugin Companion", id: "main") {
            if primary {
                WindowView(model: model)
                    .frame(minWidth: 420, minHeight: 300)
                    .onAppear { model.start() }
            } else { EmptyView() }
        }
        .defaultSize(width: 680, height: 600)
        MenuBarExtra {
            CompanionMenuLayout(status: model.menuStatus) {
                Button {
                    model.scan()
                } label: {
                    Text("Scan now").frame(maxWidth: .infinity)
                }
                    .buttonStyle(.bordered)
                    .frame(maxWidth: .infinity)
                Button {
                    NSApplication.shared.activate(ignoringOtherApps: true)
                    openWindow(id: "main")
                } label: {
                    Text("Show window").frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .frame(maxWidth: .infinity)
                Button {
                    NSWorkspace.shared.open(URL(string: "https://aimixmasters.com/")!)
                } label: {
                    Text("Open AIMM").frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .frame(maxWidth: .infinity)
            }
        } label: {
            Image(nsImage: MenuBarGlyph.image)
        }
        .menuBarExtraStyle(.window)
    }
}

@MainActor
final class CompanionModel: ObservableObject {
    @Published var inventory = Inventory.empty
    @Published var lastAction: String?
    @Published var lastStatusRequestAt: Date?
    @Published var needsAdministratorApproval = false

    private let store = InventoryStore()
    private let actions = PluginActions()
    private var bridge: LocalBridge?

    var menuStatus: String {
        let counts = inventory.counts
        let total = counts.AU + counts.VST2 + counts.VST3 + counts.CLAP
        let scanTime = inventory.scannedAt
            .flatMap { ISO8601DateFormatter().date(from: $0) }
            .map(Self.localTime) ?? "pending"
        return "\(total.formatted()) plug-ins · last scan \(scanTime)"
    }

    func start() {
        guard bridge == nil else { return }
        let server = LocalBridge(store: store, actions: actions)
        server.onDuplicateInstance = { DispatchQueue.main.async { NSApplication.shared.terminate(nil) } }
        server.onStatusRequest = { [weak self] date in
            Task { @MainActor in self?.lastStatusRequestAt = date }
        }
        server.onAction = { [weak self] action, count in
            Task { @MainActor in
                let verb = ["unuse": "moved", "restore": "restored", "trash": "moved"][action] ?? action
                let destination = ["unuse": " to Unused", "trash": " to Trash"][action] ?? ""
                let time = Self.localTime(Date())
                self?.lastAction = "\(verb) \(count) plug-in\(count == 1 ? "" : "s")\(destination), \(time)"
                self?.needsAdministratorApproval = false
            }
        }
        actions.onAdminPrompt = { [weak self] in
            Task { @MainActor in self?.needsAdministratorApproval = true }
        }
        bridge = server
        server.start()
        store.onScan = { [weak self] inventory in
            self?.actions.update(inventory)
            Task { @MainActor in self?.inventory = inventory }
        }
        store.scan()
    }

    func scan() { store.scan() }

    func showUnusedFolder() {
        let fm = FileManager.default
        let userBase = fm.homeDirectoryForCurrentUser.appendingPathComponent("Library/Audio/Plug-Ins", isDirectory: true)
        let unused = store.roots.filter { $0.id.hasPrefix("user-") }
            .map { $0.url.appendingPathComponent("Unused", isDirectory: true) }
            .first { fm.fileExists(atPath: $0.path) }
        NSWorkspace.shared.open(unused ?? userBase)
    }

    static func localTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}
