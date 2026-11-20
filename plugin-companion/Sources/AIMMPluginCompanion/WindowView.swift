import AppKit
import SwiftUI

struct WindowView: View {
    @ObservedObject var model: CompanionModel

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

            CompanionWindowLayout(
                title: "AIMM Plugin Companion",
                subtitle: "Plug-in inventory and housekeeping for AIMM",
                statusText: statusText,
                statusDot: connected ? .green : .yellow,
                statusLabel: connected ? "Connected to AIMM" : "Waiting for AIMM",
                statusTrailing: nil,
                address: "127.0.0.1:41736",
                caption: "Local AIMM connection ready · 127.0.0.1:41736",
                captionColor: .secondary,
                explainer: "Keep this companion open. It reads your plug-in folders and sends the list to the Plugins tab in AIMM. When you ask in AIMM, it moves plug-ins to Unused or the Trash. Nothing is ever deleted for good.\n\nIt never uploads anything and only talks to aimixmasters.com on this Mac.",
                extra: VStack(alignment: .leading, spacing: 14) {
                    if model.inventory.counts.unreadable > 0 {
                        Text("Scan could not read \(model.inventory.counts.unreadable) folders or plug-ins.")
                            .font(.caption)
                            .foregroundStyle(.orange)
                    }
                    if model.needsAdministratorApproval {
                        Text("Needs administrator approval")
                            .font(.caption)
                            .foregroundStyle(.orange)
                    }

                    HStack(spacing: 12) {
                        chip("AU", model.inventory.counts.AU)
                        chip("VST2", model.inventory.counts.VST2)
                        chip("VST3", model.inventory.counts.VST3)
                        chip("CLAP", model.inventory.counts.CLAP)
                    }

                    HStack(spacing: 12) {
                        Button("Scan now") { model.scan() }
                        Button("Show Unused folder") { model.showUnusedFolder() }
                    }
                    .buttonStyle(.bordered)
                }
            )
        }
    }

    private func chip(_ label: String, _ count: Int) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(count.formatted())
                .font(.system(size: 26, weight: .semibold))
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(.quaternary.opacity(0.55), in: RoundedRectangle(cornerRadius: 10))
    }
}
