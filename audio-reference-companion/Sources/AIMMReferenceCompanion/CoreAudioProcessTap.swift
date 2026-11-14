@preconcurrency import AVFoundation
import AppKit
import CoreAudio

@MainActor
protocol ProcessTapCapture: AnyObject {
    func stop()
}

enum TapVariant: String {
    case a, b, c
    init(environment: String?) { self = TapVariant(rawValue: environment ?? "a") ?? .a }
}

/// HAL scales the stereo tap by 2 / default-output channel count. Compensate
/// all variants before ingest; AIMM_TAP_COMP=off keeps the raw tap for comparison.
@available(macOS 14.2, *)
@MainActor
final class CoreAudioProcessTap: ProcessTapCapture {
    private let variant: TapVariant
    private let receive: (AVAudioPCMBuffer) -> Void
    private let failed: (Error) -> Void
    private let outputChanged: (Int, Double) -> Void
    private let compensationEnabled = ProcessInfo.processInfo.environment["AIMM_TAP_COMP"] != "off"
    private let queue = DispatchQueue(label: "com.aimixmasters.process-tap", qos: .userInitiated)
    private var tapID = AudioObjectID(kAudioObjectUnknown)
    private var deviceID = AudioObjectID(kAudioObjectUnknown)
    private var ioProc: AudioDeviceIOProcID?
    private var refreshTimer: Timer?
    private var processes: [AudioObjectID] = []
    private var outputUID = ""

    init(variant: TapVariant, receive: @escaping (AVAudioPCMBuffer) -> Void,
         failed: @escaping (Error) -> Void, outputChanged: @escaping (Int, Double) -> Void) {
        self.variant = variant
        self.receive = receive
        self.failed = failed
        self.outputChanged = outputChanged
    }

    func start() throws {
        do {
            try rebuild(processes: resolveProcesses(), output: defaultOutput())
            refreshTimer = Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { [weak self] _ in
                Task { @MainActor in self?.refresh() }
            }
        } catch {
            stop()
            throw error
        }
    }

    func stop() {
        refreshTimer?.invalidate()
        refreshTimer = nil
        destroyAudioObjects()
    }

    private func destroyAudioObjects() {
        if let ioProc {
            AudioDeviceStop(deviceID, ioProc)
            AudioDeviceDestroyIOProcID(deviceID, ioProc)
        }
        ioProc = nil
        if deviceID != kAudioObjectUnknown { AudioHardwareDestroyAggregateDevice(deviceID) }
        deviceID = AudioObjectID(kAudioObjectUnknown)
        if tapID != kAudioObjectUnknown { AudioHardwareDestroyProcessTap(tapID) }
        tapID = AudioObjectID(kAudioObjectUnknown)
    }

    private func refresh() {
        do {
            let next = try resolveProcesses()
            let output = try defaultOutput()
            // Rebuild on routing changes as well: the tap's format/clock may have changed.
            if next != processes || output.uid != outputUID {
                try rebuild(processes: next, output: output)
            }
        } catch {
            stop()
            failed(error)
        }
    }

    private func rebuild(processes: [AudioObjectID], output: (uid: String, channels: Int)) throws {
        let outputUID = output.uid
        let gain: Float = compensationEnabled && output.channels > 2 ? Float(output.channels) / 2 : 1
        destroyAudioObjects()
        self.processes = processes
        self.outputUID = outputUID
        let description: CATapDescription
        if variant == .c {
            description = CATapDescription()
            description.processes = processes
            description.isExclusive = false
            description.isMixdown = true
            description.isMono = false
        } else {
            description = CATapDescription(stereoMixdownOfProcesses: processes)
        }
        description.name = "AIMM Chrome and Spotify (tap-\(variant.rawValue))"
        description.uuid = UUID()
        description.isPrivate = true
        description.muteBehavior = .unmuted
        try check(AudioHardwareCreateProcessTap(description, &tapID), "Create process tap")

        var asbd = AudioStreamBasicDescription()
        var address = property(kAudioTapPropertyFormat)
        var size = UInt32(MemoryLayout<AudioStreamBasicDescription>.size)
        try check(AudioObjectGetPropertyData(tapID, &address, 0, nil, &size, &asbd), "Read tap format")
        guard let format = AVAudioFormat(streamDescription: &asbd),
              format.commonFormat == .pcmFormatFloat32, format.channelCount == 2,
              asbd.mBytesPerFrame > 0 else { throw CaptureError.invalidAudio }
        let tapUID = try stringProperty(tapID, kAudioTapPropertyUID)
        var aggregate: [String: Any] = [
            kAudioAggregateDeviceNameKey: "AIMM Tap Test \(variant.rawValue)",
            kAudioAggregateDeviceUIDKey: "com.aimixmasters.taptest.\(UUID().uuidString)",
            kAudioAggregateDeviceIsPrivateKey: true,
            kAudioAggregateDeviceIsStackedKey: false,
            kAudioAggregateDeviceTapAutoStartKey: true,
            kAudioAggregateDeviceTapListKey: [[kAudioSubTapUIDKey: tapUID,
                                              kAudioSubTapDriftCompensationKey: true]]
        ]
        // A and C contain ONLY the tap; neither names a hardware main sub-device.
        if variant == .b {
            guard !outputUID.isEmpty else { throw CaptureError.monitorUnavailable }
            aggregate[kAudioAggregateDeviceSubDeviceListKey] = [[kAudioSubDeviceUIDKey: outputUID,
                                                                  kAudioSubDeviceInputChannelsKey: 0]]
            aggregate[kAudioAggregateDeviceMainSubDeviceKey] = outputUID
        }
        try check(AudioHardwareCreateAggregateDevice(aggregate as CFDictionary, &deviceID), "Create tap aggregate")
        let receive = self.receive
        let bytesPerFrame = asbd.mBytesPerFrame
        let bufferCount = format.isInterleaved ? 1 : 2
        guard let planarFormat = AVAudioFormat(commonFormat: .pcmFormatFloat32,
                                               sampleRate: format.sampleRate,
                                               channels: 2, interleaved: false) else {
            throw CaptureError.invalidAudio
        }
        try check(AudioDeviceCreateIOProcIDWithBlock(&ioProc, deviceID, queue) { _, input, _, _, _ in
            // HAL appends the sole sub-tap after hardware sub-device inputs. Select
            // only its final buffers: a duplex interface in B may expose mic inputs
            // even when channels-in is zero. Never ingest those hardware channels.
            let buffers = UnsafeMutableAudioBufferListPointer(UnsafeMutablePointer(mutating: input))
            guard buffers.count >= bufferCount else { return }
            let tapBuffers = Array(buffers.suffix(bufferCount))
            guard tapBuffers.allSatisfy({ $0.mData != nil && $0.mDataByteSize > 0 &&
                $0.mNumberChannels == (format.isInterleaved ? 2 : 1) }),
                let first = tapBuffers.first else { return }
            let selected = AudioBufferList.allocate(maximumBuffers: bufferCount)
            defer { selected.unsafeMutablePointer.deallocate() }
            selected.unsafeMutablePointer.pointee.mNumberBuffers = UInt32(bufferCount)
            for index in 0..<bufferCount { selected[index] = tapBuffers[index] }
            guard let buffer = AVAudioPCMBuffer(pcmFormat: format, bufferListNoCopy: selected.unsafePointer) else { return }
            buffer.frameLength = first.mDataByteSize / bytesPerFrame
            if format.isInterleaved {
                // Keep ingest unchanged: it indexes separate channel pointers. Repack
                // the HAL's interleaved stereo and apply device compensation at its native rate.
                guard let planar = AVAudioPCMBuffer(pcmFormat: planarFormat, frameCapacity: buffer.frameLength),
                      let destination = planar.floatChannelData,
                      let source = buffer.floatChannelData?[0] else { return }
                planar.frameLength = buffer.frameLength
                for frame in 0..<Int(buffer.frameLength) {
                    destination[0][frame] = source[frame * 2] * gain
                    destination[1][frame] = source[frame * 2 + 1] * gain
                }
                receive(planar)
            } else if gain != 1 {
                // Copy borrowed HAL data; leave its buffers untouched and do not limit floats.
                guard let compensated = AVAudioPCMBuffer(pcmFormat: planarFormat, frameCapacity: buffer.frameLength),
                      let destination = compensated.floatChannelData,
                      let source = buffer.floatChannelData else { return }
                compensated.frameLength = buffer.frameLength
                for channel in 0..<2 {
                    for frame in 0..<Int(buffer.frameLength) {
                        destination[channel][frame] = source[channel][frame] * gain
                    }
                }
                receive(compensated)
            } else {
                receive(buffer) // Synchronously consume while Core Audio owns these buffers.
            }
        }, "Create tap IOProc")
        try check(AudioDeviceStart(deviceID, ioProc), "Start tap aggregate")
        outputChanged(output.channels, 20 * log10(Double(gain)))
    }

    private func resolveProcesses() throws -> [AudioObjectID] {
        var address = property(kAudioHardwarePropertyProcessObjectList)
        var size: UInt32 = 0
        let system = AudioObjectID(kAudioObjectSystemObject)
        try check(AudioObjectGetPropertyDataSize(system, &address, 0, nil, &size), "List audio processes")
        var objects = [AudioObjectID](repeating: 0, count: Int(size) / MemoryLayout<AudioObjectID>.size)
        if size > 0 {
            try objects.withUnsafeMutableBytes { bytes in
                try check(AudioObjectGetPropertyData(system, &address, 0, nil, &size, bytes.baseAddress!), "Read audio processes")
            }
        }
        return objects.filter { object in
            // HAL includes background helpers/services that NSWorkspace.runningApplications misses.
            var bundle = (try? stringProperty(object, kAudioProcessPropertyBundleID)) ?? ""
            if bundle.isEmpty {
                var pid: pid_t = 0
                var pidSize = UInt32(MemoryLayout<pid_t>.size)
                var pidAddress = property(kAudioProcessPropertyPID)
                if AudioObjectGetPropertyData(object, &pidAddress, 0, nil, &pidSize, &pid) == noErr {
                    bundle = NSRunningApplication(processIdentifier: pid)?.bundleIdentifier ?? ""
                }
            }
            return bundle.hasPrefix("com.google.Chrome") || bundle == "com.spotify.client"
        }.sorted()
    }

    private func defaultOutput() throws -> (uid: String, channels: Int) {
        var device = AudioObjectID(kAudioObjectUnknown)
        var address = property(kAudioHardwarePropertyDefaultOutputDevice)
        var size = UInt32(MemoryLayout<AudioObjectID>.size)
        let result = AudioObjectGetPropertyData(AudioObjectID(kAudioObjectSystemObject), &address, 0, nil, &size, &device)
        // A/C must also work without any physical output; B requires one.
        if result != noErr || device == kAudioObjectUnknown {
            if variant == .b { try check(result == noErr ? kAudioHardwareBadDeviceError : result, "Read default output") }
            return ("", 0)
        }
        let uid = try stringProperty(device, kAudioDevicePropertyDeviceUID)
        address = property(kAudioDevicePropertyStreamConfiguration)
        address.mScope = kAudioDevicePropertyScopeOutput
        try check(AudioObjectGetPropertyDataSize(device, &address, 0, nil, &size), "Read output configuration size")
        let storage = UnsafeMutableRawPointer.allocate(byteCount: Int(size), alignment: MemoryLayout<AudioBufferList>.alignment)
        defer { storage.deallocate() }
        try check(AudioObjectGetPropertyData(device, &address, 0, nil, &size, storage), "Read output configuration")
        let buffers = UnsafeMutableAudioBufferListPointer(storage.assumingMemoryBound(to: AudioBufferList.self))
        return (uid, buffers.reduce(0) { $0 + Int($1.mNumberChannels) })
    }

    private func stringProperty(_ object: AudioObjectID, _ selector: AudioObjectPropertySelector) throws -> String {
        var address = property(selector)
        var value: Unmanaged<CFString>?
        var size = UInt32(MemoryLayout<Unmanaged<CFString>?>.size)
        try check(AudioObjectGetPropertyData(object, &address, 0, nil, &size, &value), "Read audio property \(selector)")
        guard let value else { throw CaptureError.invalidAudio }
        return value.takeRetainedValue() as String
    }

    private func property(_ selector: AudioObjectPropertySelector) -> AudioObjectPropertyAddress {
        AudioObjectPropertyAddress(mSelector: selector, mScope: kAudioObjectPropertyScopeGlobal,
                                   mElement: kAudioObjectPropertyElementMain)
    }

    private func check(_ result: OSStatus, _ operation: String) throws {
        guard result == noErr else {
            throw NSError(domain: NSOSStatusErrorDomain, code: Int(result),
                          userInfo: [NSLocalizedDescriptionKey: "\(operation) (OSStatus \(result))"])
        }
    }
}
