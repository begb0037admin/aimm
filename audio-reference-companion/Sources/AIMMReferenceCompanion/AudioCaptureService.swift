@preconcurrency import AVFoundation
import CoreMedia
import Foundation
import ScreenCaptureKit

enum CaptureError: LocalizedError, Equatable {
    case noDisplay
    case invalidAudio
    case tooShort
    case alreadyInProgress
    case invalidSession
    case monitorUnavailable

    var errorDescription: String? {
        switch self {
        case .noDisplay: "No macOS display is available for system audio capture."
        case .invalidAudio: "macOS returned an unsupported audio format."
        case .tooShort: "Capture at least eight seconds of playback before stopping."
        case .alreadyInProgress: "A reference capture is already starting, running, or being saved in another AIMM tab."
        case .invalidSession: "This AIMM tab does not own the active reference capture. Start a new capture from the selected Spotify track."
        case .monitorUnavailable: "Live system-audio monitoring is not ready. Keep AIMM Audio Reference Companion open and try again."
        }
    }
}

@MainActor
final class AudioCaptureService: NSObject, ObservableObject, SCStreamOutput, SCStreamDelegate {
    @Published private(set) var isMonitoring = false
    @Published private(set) var isCapturing = false
    @Published private var statusMessage = "Starting live audio monitoring…"
    @Published private(set) var captureMethod = "sck"
    @Published private var tapOutputChannels = 0
    @Published private var tapCompensationGainDb = 0.0
    var outputChannels: Int { captureMethod.hasPrefix("tap-") ? tapOutputChannels : 0 }
    var compensationGainDb: Double { captureMethod.hasPrefix("tap-") ? tapCompensationGainDb : 0 }
    private var deviceCompensationStatus: String {
        captureMethod.hasPrefix("tap-")
            ? String(format: " · %+.1f dB device compensation (%d ch)", compensationGainDb, outputChannels) : ""
    }
    var status: String {
        get { "\(captureMethod)\(deviceCompensationStatus) · \(statusMessage)" + (fallbackReason.map { " · SCK fallback (\($0))" } ?? "") }
        set { statusMessage = newValue }
    }
    private var processTap: ProcessTapCapture?
    private var fallbackReason: String?
    @Published private(set) var elapsedSeconds = 0
    var elapsedText: String {
        "\(elapsedSeconds / 60):\(String(format: "%02d", elapsedSeconds % 60))"
    }

    private nonisolated let lock = NSLock()
    private nonisolated let spectrumAnalyzer = ReferenceSpectrumAnalyzer()
    private nonisolated(unsafe) var pcm: [Int16] = []
    private nonisolated(unsafe) var captureAudioEnabled = false
    private var stream: SCStream?
    private var timer: Timer?
    private var startedAt: Date?
    private var latestWave: Data?
    private var isStarting = false
    private var monitorStartTask: Task<Void, Error>?
    private var isStopping = false
    private var activeSessionID: String?
    private var completedSessionID: String?
    private var activeSpotifyTrackID: String?
    private var completedSpotifyTrackID: String?
    private var completedAt: Date?
    // AudioLens reference profiles use a 4096-point spectrum at 44.1 kHz.
    // Capture at that rate so AIMM's companion curve uses the same frequency
    // grid instead of stretching a 48 kHz FFT onto a 44.1 kHz axis.
    private let sampleRate = 44_100
    private let channels = 2
    private let maxSeconds = 180

    var capturedSampleCount: Int { pcmSnapshot().count }
    var capturedAudioSeconds: Double { Double(capturedSampleCount) / Double(sampleRate * channels) }
    var spectrumHasRecentSignal: Bool { spectrumAnalyzer.hasRecentSignal }

    private nonisolated func clearPCM() {
        lock.lock(); defer { lock.unlock() }
        pcm.removeAll(keepingCapacity: true)
    }
    private nonisolated func preparePCMForCapture() {
        lock.lock(); defer { lock.unlock() }
        pcm.removeAll(keepingCapacity: true)
        captureAudioEnabled = true
    }
    private nonisolated func finishPCMCapture() {
        lock.lock(); defer { lock.unlock() }
        captureAudioEnabled = false
    }
    private nonisolated func pcmSnapshot() -> [Int16] {
        lock.lock(); defer { lock.unlock() }
        return pcm
    }
    private nonisolated func appendPCMIfCapturing(_ values: [Int16]) {
        lock.lock(); defer { lock.unlock() }
        guard captureAudioEnabled else { return }
        let maxCount = sampleRate * channels * maxSeconds
        if pcm.count < maxCount { pcm.append(contentsOf: values.prefix(maxCount - pcm.count)) }
    }

    /// Starts one long-lived system-audio stream for white live monitoring.
    /// Reference capture sessions only reset the purple-target average and WAV
    /// buffer; they never stop or recreate this stream.
    func startMonitoring() async throws {
        if isMonitoring { return }
        if let monitorStartTask {
            try await monitorStartTask.value
            return
        }
        let task = Task { @MainActor [weak self] in
            guard let self else { throw CaptureError.monitorUnavailable }
            try await self.startMonitorStream()
        }
        monitorStartTask = task
        do {
            try await task.value
            monitorStartTask = nil
        } catch {
            monitorStartTask = nil
            throw error
        }
    }

    private func startMonitorStream() async throws {
        if ProcessInfo.processInfo.environment["AIMM_CAPTURE"] != "sck" {
            if #available(macOS 14.2, *) {
                let variant = TapVariant(environment: ProcessInfo.processInfo.environment["AIMM_TAP_VARIANT"])
                captureMethod = "tap-" + variant.rawValue
                status = "Requesting macOS process audio access…"
                let tap = CoreAudioProcessTap(variant: variant, receive: { [weak self] buffer in
                    self?.ingest(buffer)
                }, failed: { [weak self] error in
                    guard let self else { return }
                    self.processTap?.stop()
                    self.processTap = nil
                    self.isMonitoring = false
                    self.fallbackReason = "Tap failed: \(error.localizedDescription)"
                    Task { @MainActor in
                        do { try await self.startSCKStream() }
                        catch { self.status = Self.startFailureStatus(error) }
                    }
                }, outputChanged: { [weak self] channels, gainDb in
                    self?.tapOutputChannels = channels
                    self?.tapCompensationGainDb = gainDb
                })
                do {
                    try tap.start()
                    processTap = tap
                    isMonitoring = true
                    status = "Live monitoring · Chrome / Spotify process audio."
                    return
                } catch {
                    tap.stop()
                    fallbackReason = "Tap unavailable: \(error.localizedDescription)"
                }
            } else {
                fallbackReason = "Process taps require macOS 14.2 or later"
            }
        }
        try await startSCKStream()
    }

    private func startSCKStream() async throws {
        captureMethod = "sck"
        status = "Requesting macOS system audio access for live monitoring…"

        let content: SCShareableContent
        do {
            content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: false)
        } catch {
            status = Self.startFailureStatus(error)
            throw error
        }
        guard let display = content.displays.first else {
            status = "No macOS display is available for system-audio capture."
            throw CaptureError.noDisplay
        }

        let filter = SCContentFilter(display: display, excludingApplications: [], exceptingWindows: [])
        let config = SCStreamConfiguration()
        config.capturesAudio = true
        config.excludesCurrentProcessAudio = true
        config.sampleRate = sampleRate
        config.channelCount = channels
        config.width = 2
        config.height = 2
        config.minimumFrameInterval = CMTime(value: 1, timescale: 2)
        config.queueDepth = 3

        let next = SCStream(filter: filter, configuration: config, delegate: self)
        do {
            try next.addStreamOutput(self, type: .audio, sampleHandlerQueue: DispatchQueue(label: "com.aimixmasters.reference-audio", qos: .userInitiated))
            try await next.startCapture()
        } catch {
            status = Self.startFailureStatus(error)
            throw error
        }
        stream = next
        isMonitoring = true
        status = "Live monitoring · play a song to see its spectrum in AIMM."
    }

    func start(sessionID: String, spotifyTrackID: String?) async throws {
        guard !isCapturing, !isStarting, !isStopping else { throw CaptureError.alreadyInProgress }
        if let completedAt, Date().timeIntervalSince(completedAt) > 600 {
            completedSessionID = nil
            completedSpotifyTrackID = nil
            self.completedAt = nil
            latestWave = nil
        }
        guard completedSessionID == nil else { throw CaptureError.alreadyInProgress }
        if !isMonitoring { try await startMonitoring() }
        guard isMonitoring else { throw CaptureError.monitorUnavailable }
        isStarting = true
        defer { isStarting = false }
        spectrumAnalyzer.beginReferenceCapture()
        preparePCMForCapture()
        latestWave = nil
        completedSessionID = nil
        completedSpotifyTrackID = nil
        completedAt = nil
        elapsedSeconds = 0
        startedAt = Date()
        activeSessionID = sessionID
        activeSpotifyTrackID = spotifyTrackID
        isCapturing = true
        status = "Capturing reference · live monitoring continues; play the selected track to build the purple target."
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self, let startedAt = self.startedAt else { return }
                self.elapsedSeconds = Int(Date().timeIntervalSince(startedAt))
                let received = self.capturedAudioSeconds
                let windows = self.spectrumAnalyzer.windowCount
                if received == 0 {
                    self.status = "Capturing reference · waiting for system audio. Live white spectrum remains active."
                } else if self.spectrumAnalyzer.hasRecentSignal {
                    self.status = "Capturing reference · \(String(format: "%.1f", received)) seconds · \(windows) spectrum windows."
                } else {
                    self.status = "No active playback signal · \(String(format: "%.1f", received)) seconds buffered · \(windows) spectrum windows."
                }
                if self.elapsedSeconds >= self.maxSeconds { Task { try? await self.stop() } }
            }
        }
    }

    func stop(sessionID requestedSessionID: String? = nil) async throws -> Data {
        if let requestedSessionID, completedSessionID == requestedSessionID, let latestWave { return latestWave }
        guard !isStopping else { throw CaptureError.alreadyInProgress }
        guard let sessionID = activeSessionID,
              requestedSessionID == nil || requestedSessionID == sessionID else {
            throw CaptureError.invalidSession
        }
        isStopping = true
        defer { isStopping = false }
        guard isCapturing else {
            if let latestWave { return latestWave }
            throw CaptureError.tooShort
        }
        timer?.invalidate(); timer = nil
        finishPCMCapture()
        spectrumAnalyzer.endReferenceCapture()
        isCapturing = false

        let samples = pcmSnapshot()
        guard samples.count >= sampleRate * channels * 8 else {
            activeSessionID = nil
            activeSpotifyTrackID = nil
            completedSessionID = nil
            completedSpotifyTrackID = nil
            completedAt = nil
            status = CaptureError.tooShort.localizedDescription + " Live monitoring continues."
            throw CaptureError.tooShort
        }
        let wav = Self.wav(samples: samples, sampleRate: sampleRate, channels: channels)
        latestWave = wav
        completedSessionID = sessionID
        completedSpotifyTrackID = activeSpotifyTrackID
        completedAt = Date()
        activeSessionID = nil
        activeSpotifyTrackID = nil
        status = "Reference ready · \(elapsedText) · live monitoring continues."
        return wav
    }

    func liveSpectrumJSON(for sessionID: String) -> [String: Any]? {
        guard isCapturing, activeSessionID == sessionID else { return nil }
        return spectrumAnalyzer.liveJSON(includeReference: true)
    }

    func monitorSpectrumJSON(for sessionID: String?) -> [String: Any] {
        let ownsCapture = isCapturing && sessionID != nil && activeSessionID == sessionID
        var result = spectrumAnalyzer.liveJSON(includeReference: ownsCapture)
        result["monitoring"] = isMonitoring
        result["capturing"] = isCapturing
        if ownsCapture, let activeSessionID {
            result["sessionId"] = activeSessionID
        }
        return result
    }

    func referenceProfileJSON(for sessionID: String) -> [String: Any]? {
        guard !isCapturing, completedSessionID == sessionID,
              var profile = spectrumAnalyzer.profileJSON() else { return nil }
        profile["captureSessionID"] = sessionID
        profile["spotifyTrackID"] = completedSpotifyTrackID ?? ""
        return profile
    }

    func wavData(for sessionID: String) -> Data? {
        guard !isCapturing, completedSessionID == sessionID else { return nil }
        return latestWave
    }

    func acknowledgeCompletedSession(_ sessionID: String) -> Bool {
        guard completedSessionID == sessionID else { return false }
        completedSessionID = nil
        completedSpotifyTrackID = nil
        completedAt = nil
        latestWave = nil
        clearPCM()
        return true
    }

    func chunkData(from sampleOffset: Int, sessionID: String) -> (data: Data, nextOffset: Int)? {
        guard (isCapturing && activeSessionID == sessionID) || (!isCapturing && completedSessionID == sessionID) else { return nil }
        let all = pcmSnapshot()
        let start = min(max(0, sampleOffset), all.count)
        let end = min(all.count, start + sampleRate * channels * 2)
        var data = Data(); data.reserveCapacity((end - start) * 2)
        if start < end { for sample in all[start..<end] { data.appendLE(UInt16(bitPattern: sample)) } }
        return (data, end)
    }

    nonisolated func stream(_ stream: SCStream, didOutputSampleBuffer sampleBuffer: CMSampleBuffer, of outputType: SCStreamOutputType) {
        guard outputType == .audio, sampleBuffer.isValid,
              let description = CMSampleBufferGetFormatDescription(sampleBuffer) else { return }
        let format = AVAudioFormat(cmAudioFormatDescription: description)
        guard CMSampleBufferGetNumSamples(sampleBuffer) > 0 else { return }

        // ScreenCaptureKit already owns the PCM buffers in CMSampleBuffer.
        // Wrap that AudioBufferList directly instead of copying it into a
        // newly allocated AVAudioPCMBuffer. The copy path can silently reject
        // a valid interleaved system-audio layout, leaving the UI counting
        // elapsed time while receiving no samples.
        do {
            try sampleBuffer.withAudioBufferList { audioBufferList, _ in
                guard let input = AVAudioPCMBuffer(
                    pcmFormat: format,
                    bufferListNoCopy: audioBufferList.unsafePointer
                ) else { return }
                self.ingest(input)
            }
        } catch {
            NSLog("AIMM reference audio buffer could not be read: %@", error.localizedDescription)
        }
    }

    private nonisolated func ingest(_ buffer: AVAudioPCMBuffer) {
        guard buffer.frameLength > 0 else { return }

        let targetFormat = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: 44_100, channels: 2, interleaved: false)!
        let normalized: AVAudioPCMBuffer
        if buffer.format.commonFormat == .pcmFormatFloat32,
           abs(buffer.format.sampleRate - targetFormat.sampleRate) < 0.5,
           buffer.format.channelCount == 2,
           let floats = buffer.floatChannelData {
            _ = floats
            normalized = buffer
        } else {
            guard let converter = AVAudioConverter(from: buffer.format, to: targetFormat) else { return }
            let targetCapacity = AVAudioFrameCount(ceil(Double(buffer.frameLength) * targetFormat.sampleRate / buffer.format.sampleRate) + 64)
            guard let converted = AVAudioPCMBuffer(pcmFormat: targetFormat, frameCapacity: targetCapacity) else { return }
            var suppliedInput = false
            var conversionError: NSError?
            let result = converter.convert(to: converted, error: &conversionError) { _, inputStatus in
                if suppliedInput {
                    inputStatus.pointee = .noDataNow
                    return nil
                }
                suppliedInput = true
                inputStatus.pointee = .haveData
                return buffer
            }
            guard result != .error, conversionError == nil else { return }
            normalized = converted
        }
        guard let floats = normalized.floatChannelData else { return }

        let inputChannels = Int(normalized.format.channelCount)
        let frames = Int(normalized.frameLength)
        let stride = Int(normalized.stride)
        var out = [Int16]()
        out.reserveCapacity(frames * 2)
        for frame in 0..<frames {
            for channel in 0..<2 {
                let sourceChannel = min(channel, max(0, inputChannels - 1))
                let value = max(-1.0, min(1.0, floats[sourceChannel][frame * stride]))
                out.append(Int16(value * 32767.0))
            }
        }
        spectrumAnalyzer.append(interleaved: out)
        appendPCMIfCapturing(out)
    }

    nonisolated func stream(_ stream: SCStream, didStopWithError error: Error) {
        Task { @MainActor [weak self] in
            guard let self else { return }
            self.isCapturing = false
            self.isMonitoring = false
            self.finishPCMCapture()
            self.spectrumAnalyzer.endReferenceCapture()
            self.stream = nil
            self.timer?.invalidate(); self.timer = nil
            self.activeSessionID = nil
            self.activeSpotifyTrackID = nil
            self.status = "Live system-audio monitoring stopped: \(error.localizedDescription)"
        }
    }

    private static func wav(samples: [Int16], sampleRate: Int, channels: Int) -> Data {
        let byteCount = UInt32(samples.count * MemoryLayout<Int16>.size)
        var data = Data()
        data.append(contentsOf: Array("RIFF".utf8)); data.appendLE(UInt32(36) + byteCount)
        data.append(contentsOf: Array("WAVEfmt ".utf8)); data.appendLE(UInt32(16))
        data.appendLE(UInt16(1)); data.appendLE(UInt16(channels)); data.appendLE(UInt32(sampleRate))
        data.appendLE(UInt32(sampleRate * channels * 2)); data.appendLE(UInt16(channels * 2)); data.appendLE(UInt16(16))
        data.append(contentsOf: Array("data".utf8)); data.appendLE(byteCount)
        for sample in samples { data.appendLE(UInt16(bitPattern: sample)) }
        return data
    }

    private static func startFailureStatus(_ error: Error) -> String {
        let message = error.localizedDescription
        let lower = message.lowercased()
        if lower.contains("tcc") || lower.contains("declined") || lower.contains("permission") || lower.contains("application, window, display capture") {
            return "macOS blocked system-audio capture. Enable AIMM Audio Reference Companion in System Settings → Privacy & Security → Screen & System Audio Recording, then quit and reopen the companion."
        }
        return "System-audio capture could not start: \(message)"
    }
}

private extension Data {
    mutating func appendLE<T: FixedWidthInteger>(_ value: T) {
        var little = value.littleEndian
        Swift.withUnsafeBytes(of: &little) { append(contentsOf: $0) }
    }
}
