import AppKit
import SwiftUI

@main
struct AIMMReferenceCompanionApp: App {
    @StateObject private var model: CompanionModel
    private let isPrimaryInstance: Bool

    init() {
        let primary = CompanionInstanceLock.shared.isPrimary
        isPrimaryInstance = primary
        _model = StateObject(wrappedValue: CompanionModel(startBridge: primary))
        guard primary else {
            // Let AppKit finish launching before exiting the duplicate process.
            DispatchQueue.main.async { NSApplication.shared.terminate(nil) }
            return
        }
    }

    var body: some Scene {
        Window("AIMM Audio Reference Companion", id: "main") {
            if isPrimaryInstance {
                CompanionWindow(model: model)
                    .frame(minWidth: 420, minHeight: 300)
            } else {
                EmptyView()
            }
        }
        MenuBarExtra("AIMM Audio Reference", systemImage: "waveform") {
            Text(model.capture.status)
                .lineLimit(3)
            Divider()
            Button(model.capture.isCapturing ? "Stop capture" : "Open AIMM Audio Reference") {
                if model.capture.isCapturing {
                    Task { await model.stopFromMenu() }
                } else {
                    NSWorkspace.shared.open(URL(string: "https://aimixmasters.com/")!)
                }
            }
        }
        .menuBarExtraStyle(.window)
    }
}

@MainActor
final class CompanionModel: ObservableObject {
    @Published var capture = AudioCaptureService()
    @Published var bridgeStatus = "Starting local AIMM connection…"
    private var bridge: LocalBridge?

    init(startBridge: Bool = true) {
        guard startBridge else { return }
        let localBridge = LocalBridge(capture: capture)
        bridge = localBridge
        localBridge.onStatus = { [weak self] status in
            Task { @MainActor in self?.bridgeStatus = status }
        }
        localBridge.onDuplicateInstance = {
            DispatchQueue.main.async { NSApplication.shared.terminate(nil) }
        }
        localBridge.start()
        Task { @MainActor in
            do { try await capture.startMonitoring() }
            catch { /* AudioCaptureService already publishes the actionable permission error. */ }
        }
    }

    func stopFromMenu() async {
        do { _ = try await capture.stop() }
        catch { capture.status = "Could not stop capture: \(error.localizedDescription)" }
    }
}

struct CompanionWindow: View {
    @ObservedObject var model: CompanionModel
    @ObservedObject private var capture: AudioCaptureService

    init(model: CompanionModel) {
        self.model = model
        self._capture = ObservedObject(wrappedValue: model.capture)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 12) {
                Image(systemName: "waveform.circle.fill")
                    .font(.system(size: 34))
                    .foregroundStyle(Color(red: 38/255, green: 206/255, blue: 183/255))
                VStack(alignment: .leading, spacing: 3) {
                    Text("AIMM Audio Reference")
                        .font(.title2.weight(.semibold))
                    Text("Live system-audio monitor for AIMM")
                        .foregroundStyle(.secondary)
                }
            }

            Text(capture.status)
                .font(.body)
                .frame(maxWidth: .infinity, minHeight: 54, alignment: .leading)
                .padding(12)
                .background(.quaternary.opacity(0.55), in: RoundedRectangle(cornerRadius: 10))

            HStack {
                Circle()
                    .fill(capture.isCapturing ? .red : capture.isMonitoring ? .green : .yellow)
                    .frame(width: 9, height: 9)
                Text(capture.isCapturing ? "Capturing reference" : capture.isMonitoring ? "Live monitoring for AIMM" : "Live monitor unavailable")
                    .foregroundStyle(.secondary)
                Spacer()
                if capture.isCapturing {
                    Text(capture.elapsedText)
                        .monospacedDigit()
                        .foregroundStyle(.secondary)
                }
            }

            Text(model.bridgeStatus)
                .font(.caption)
                .foregroundStyle(model.bridgeStatus.contains("failed") ? .red : .secondary)

            Text("Keep this companion open. Play a song in Spotify and the white live spectrum in AIMM follows it automatically. Press Capture reference to average the purple target, then stop to save the target and audio specs.")
                .font(.callout)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            Spacer(minLength: 0)

            HStack {
                Text("Listening service: 127.0.0.1:41735")
                    .font(.caption.monospaced())
                    .foregroundStyle(.tertiary)
                Spacer()
                Button("Open AIMM") {
                    NSWorkspace.shared.open(URL(string: "https://aimixmasters.com/")!)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding(24)
    }
}
