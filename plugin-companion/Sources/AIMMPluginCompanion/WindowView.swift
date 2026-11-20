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
            VStack(alignment: .leading, spacing: 0) {
                HStack(spacing: 14) {
                    Image(nsImage: NSApp.applicationIconImage)
                        .resizable()
                        .frame(width: 52, height: 52)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("AIMM Plugin Companion")
                            .font(.system(size: 18, weight: .semibold))
                        Text("Plug-in inventory and housekeeping for AIMM")
                            .font(.system(size: 13))
                            .foregroundStyle(.secondary)
                    }
                }

                Text(statusText)
                    .font(.system(size: 13))
                    .frame(maxWidth: .infinity, minHeight: 46, alignment: .leading)
                    .padding(.horizontal, 16)
                    .background(Color(nsColor: .controlBackgroundColor), in: RoundedRectangle(cornerRadius: 10))
                    .padding(.top, 18)

                HStack(spacing: 8) {
                    chip("AU", model.inventory.counts.AU)
                    chip("VST2", model.inventory.counts.VST2)
                    chip("VST3", model.inventory.counts.VST3)
                    chip("CLAP", model.inventory.counts.CLAP)
                }
                .padding(.top, 14)

                HStack(spacing: 8) {
                    Circle().fill(connected ? green : amber).frame(width: 9, height: 9)
                    Text(connected ? "Connected to AIMM" : "Waiting for AIMM")
                        .font(.system(size: 13))
                }
                .padding(.top, 14)

                Text("Local AIMM connection ready · 127.0.0.1:41736")
                    .font(.system(size: 11.5))
                    .foregroundStyle(.secondary)
                    .padding(.top, 4)

                if model.inventory.counts.unreadable > 0 {
                    Text("Scan could not read \(model.inventory.counts.unreadable) folders or plug-ins.")
                        .font(.system(size: 12))
                        .foregroundStyle(amber)
                        .padding(.top, 6)
                }
                if model.needsAdministratorApproval {
                    Text("Needs administrator approval")
                        .font(.system(size: 12))
                        .foregroundStyle(amber)
                        .padding(.top, 6)
                }

                Text("Keep this companion open. It reads your plug-in folders and sends the list to the Plugins tab in AIMM. When you ask in AIMM, it moves plug-ins to Unused or the Trash. Nothing is ever deleted for good.")
                    .padding(.top, 10)
                Text("It never uploads anything and only talks to aimixmasters.com on this Mac.")
                    .padding(.top, 8)

                HStack(spacing: 8) {
                    Button("Scan now") { model.scan() }
                    Button("Show Unused folder") { model.showUnusedFolder() }
                }
                .padding(.top, 12)

                Spacer(minLength: 10)

                HStack {
                    Text("Listening service: 127.0.0.1:41736 · v\(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "0.2.0")")
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundStyle(.tertiary)
                    Spacer()
                    Button("Open AIMM") {
                        NSWorkspace.shared.open(URL(string: "https://aimixmasters.com")!)
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
            .padding(24)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .background(Color(nsColor: .windowBackgroundColor))
            .font(.system(size: 13))
            .foregroundStyle(Color.primary)
        }
    }

    private func chip(_ label: String, _ count: Int) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(count.formatted()).font(.system(size: 13, weight: .semibold))
            Text(label).font(.system(size: 11)).foregroundStyle(.secondary)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Color(nsColor: .controlBackgroundColor), in: RoundedRectangle(cornerRadius: 8))
        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(nsColor: .separatorColor)))
    }
}
