import AppKit
import SwiftUI

struct WindowView: View {
    @ObservedObject var model: CompanionModel

    private let green = Color(red: 34/255, green: 197/255, blue: 94/255)
    private let amber = Color(red: 220/255, green: 145/255, blue: 25/255)

    private var total: Int {
        let counts = model.inventory.counts
        return counts.AU + counts.VST2 + counts.VST3 + counts.CLAP
    }

    private var statusText: String {
        let scanTime = model.inventory.scannedAt
            .flatMap { ISO8601DateFormatter().date(from: $0) }
            .map(CompanionModel.localTime) ?? "pending"
        return "\(total.formatted()) plug-ins found · last scan \(scanTime) · \(model.lastAction.map { "last action: \($0)" } ?? "no actions yet")"
    }

    var body: some View {
        TimelineView(.periodic(from: .now, by: 5)) { context in
            let connected = model.lastStatusRequestAt.map { context.date.timeIntervalSince($0) < 60 } ?? false

            VStack(alignment: .leading, spacing: 14) {
                HStack(spacing: 12) {
                    Image(nsImage: NSApp.applicationIconImage)
                        .resizable()
                        .frame(width: 60, height: 60)
                    VStack(alignment: .leading, spacing: 3) {
                        Text("AIMM Plugin Companion")
                            .font(.title2.weight(.semibold))
                        Text("Plug-in inventory and housekeeping for AIMM")
                            .foregroundStyle(.secondary)
                    }
                }

                Text(statusText)
                    .font(.body)
                    .frame(maxWidth: .infinity, minHeight: 54, alignment: .leading)
                    .padding(12)
                    .background(.quaternary.opacity(0.55), in: RoundedRectangle(cornerRadius: 10))

                HStack {
                    Circle()
                        .fill(connected ? green : amber)
                        .frame(width: 9, height: 9)
                    Text(connected ? "Connected to AIMM" : "Waiting for AIMM")
                        .foregroundStyle(.secondary)
                    Spacer()
                }

                Text("Local AIMM connection ready · 127.0.0.1:41736")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                if model.inventory.counts.unreadable > 0 {
                    Text("Scan could not read \(model.inventory.counts.unreadable) folders or plug-ins.")
                        .font(.caption)
                        .foregroundStyle(amber)
                }
                if model.needsAdministratorApproval {
                    Text("Needs administrator approval")
                        .font(.caption)
                        .foregroundStyle(amber)
                }

                Text("Keep this companion open. It reads your plug-in folders and sends the list to the Plugins tab in AIMM. When you ask in AIMM, it moves plug-ins to Unused or the Trash. Nothing is ever deleted for good.\n\nIt never uploads anything and only talks to aimixmasters.com on this Mac.")
                    .font(.callout)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)

                HStack(spacing: 8) {
                    chip("AU", model.inventory.counts.AU)
                    chip("VST2", model.inventory.counts.VST2)
                    chip("VST3", model.inventory.counts.VST3)
                    chip("CLAP", model.inventory.counts.CLAP)
                }

                HStack(spacing: 8) {
                    Button("Scan now") { model.scan() }
                    Button("Show Unused folder") { model.showUnusedFolder() }
                }
                .font(.callout)
                .buttonStyle(.bordered)

                Spacer(minLength: 0)

                HStack {
                    Text("Listening service: 127.0.0.1:41736 · v\(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "0.2.0")")
                        .font(.caption.monospaced())
                        .foregroundStyle(.tertiary)
                    Spacer()
                    Button("Open AIMM") {
                        NSWorkspace.shared.open(URL(string: "https://aimixmasters.com")!)
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
            .padding(24)
        }
    }

    private func chip(_ label: String, _ count: Int) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(count.formatted()).font(.callout.weight(.semibold))
            Text(label).font(.caption).foregroundStyle(.secondary)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(.quaternary.opacity(0.55), in: RoundedRectangle(cornerRadius: 8))
    }
}
