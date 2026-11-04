import Foundation

/// Incremental 4096-point Hann spectra for live monitoring and Spotify references.
/// AudioLens targets store 2049 linear-frequency bins at 44.1 kHz, so the
/// companion captures and analyses at the same rate and frequency grid.
final class ReferenceSpectrumAnalyzer: @unchecked Sendable {
    private static let fftSize = 4096
    private static let hopSize = fftSize / 2
    // Keep reference capture at its existing resolution; AudioLens's live
    // monitor uses a separate 2048-point Hann analysis with 50% overlap.
    private static let liveFFTSize = 8192
    private static let liveHopSize = 2048
    private static let liveBinCount = liveFFTSize / 2 + 1
    private static let inputRate = 44_100.0
    private static let targetRate = 44_100.0
    private static let binCount = fftSize / 2 + 1
    private static let logPointCount = 64
    private static let toleranceDb = 3.0
    private static let minimumSignalDbFS = -80.0
    // AudioLens FUN_100e06440 selects window type 4; case 4 in FUN_100e0569c
    // is this symmetric Hann shape. AudioLens then applies one RMS scale to
    // the window, which cancels when its live magnitudes are sum-normalized.
    private static let hann: [Double] = (0..<fftSize).map {
        0.5 * (1 - cos(2 * Double.pi * Double($0) / Double(fftSize - 1)))
    }
    // Recovered from AudioLens 1.5.0 ARM64 with REA/Ghidra:
    // FUN_100e0d200 fills this per-bin coefficient array, and FUN_100e10808
    // applies it forwards and backwards to the normalized live magnitudes.
    private static let liveFrequencySmoothing: [Float] = {
        let binHz = Float(inputRate / Double(liveFFTSize))
        return (0..<liveBinCount).map { index in
            let bandwidth = (binHz * Float(index) * 0.00437 + 1.0) * 24.7
            let exponent = -1.0 / Double((1.0 / binHz) * bandwidth)
            return Float(1.0 - exp(exponent))
        }
    }()

    private let lock = NSLock()
    private var ring = [Double](repeating: 0, count: fftSize)
    private var writeIndex = 0
    private var liveRing = [Double](repeating: 0, count: liveFFTSize)
    private var liveWriteIndex = 0
    private var monitorFrames = 0
    private var activeFramesSinceSilence = 0
    private var framesSinceAnalysis = 0
    private var liveActiveFramesSinceSilence = 0
    private var liveFramesSinceAnalysis = 0
    private var referencePowerSum = [Double](repeating: 0, count: binCount)
    private var latestLivePower: [Double]?
    // Locked DSP: per-bin exponential time smoothing, 2 s response, 65% recent-sample weight.
    private var liveSmoothedPower = [Double](repeating: 0, count: 4097)
    private static let liveAlpha: Double = { let n = 1.0 * 44_100.0 / 2048.0; return 1.0 - pow(1.0 - 0.65, 1.0 / (n + 1.0)) }()
    private var referenceWindows = 0
    private var referenceAudioFrames = 0
    private var referenceSignalFrames = 0
    private var accumulatingReference = false
    private var referenceEpoch = 0
    private var latestRmsDbFS = -160.0
    private var lastSignalAt: TimeInterval?

    var windowCount: Int {
        lock.lock(); defer { lock.unlock() }
        return referenceWindows
    }

    var hasRecentSignal: Bool {
        lock.lock(); defer { lock.unlock() }
        guard let lastSignalAt else { return false }
        return Date().timeIntervalSinceReferenceDate - lastSignalAt < 0.8
    }

    func reset() {
        lock.lock(); defer { lock.unlock() }
        ring = [Double](repeating: 0, count: Self.fftSize)
        writeIndex = 0
        liveRing = [Double](repeating: 0, count: Self.liveFFTSize)
        liveWriteIndex = 0
        monitorFrames = 0
        activeFramesSinceSilence = 0
        framesSinceAnalysis = 0
        liveActiveFramesSinceSilence = 0
        liveFramesSinceAnalysis = 0
        referencePowerSum = [Double](repeating: 0, count: Self.binCount)
        latestLivePower = nil
        liveSmoothedPower = [Double](repeating: 0, count: Self.liveBinCount)
        referenceWindows = 0
        referenceAudioFrames = 0
        referenceSignalFrames = 0
        accumulatingReference = false
        referenceEpoch += 1
        latestRmsDbFS = -160
        lastSignalAt = nil
    }

    /// Begin a fresh reference average without interrupting live monitoring.
    func beginReferenceCapture() {
        lock.lock(); defer { lock.unlock() }
        referencePowerSum = [Double](repeating: 0, count: Self.binCount)
        referenceWindows = 0
        referenceAudioFrames = 0
        referenceSignalFrames = 0
        referenceEpoch += 1
        accumulatingReference = true
        // Start the captured profile on a clean FFT window while retaining the
        // latest live spectrum for the always-on white monitor trace.
        ring = [Double](repeating: 0, count: Self.fftSize)
        writeIndex = 0
        activeFramesSinceSilence = 0
        framesSinceAnalysis = 0
        liveRing = [Double](repeating: 0, count: Self.liveFFTSize)
        liveWriteIndex = 0
        liveActiveFramesSinceSilence = 0
        liveFramesSinceAnalysis = 0
    }

    func endReferenceCapture() {
        lock.lock(); defer { lock.unlock() }
        accumulatingReference = false
        referenceEpoch += 1
    }

    /// Receives interleaved stereo PCM16 from ScreenCaptureKit. FFT work runs
    /// on the capture callback queue, never on the UI or HTTP response thread.
    func append(interleaved samples: [Int16]) {
        guard samples.count >= 2 else { return }
        var sumSquares = 0.0
        for sample in samples {
            let value = Double(sample) / 32768.0
            sumSquares += value * value
        }
        let rms = sqrt(sumSquares / Double(samples.count))
        let rmsDbFS = 20 * log10(max(rms, 1e-8))
        let hasSignal = rmsDbFS > Self.minimumSignalDbFS
        var frames: [[Double]] = []
        var liveFrames: [[Double]] = []
        var frameEpoch = 0
        lock.lock()
        latestRmsDbFS = rmsDbFS
        if hasSignal {
            lastSignalAt = Date().timeIntervalSinceReferenceDate
        } else {
            // Require one complete active FFT window after silence. This also
            // prevents the first window after playback resumes from including
            // half a window of zeros.
            ring = [Double](repeating: 0, count: Self.fftSize)
            writeIndex = 0
            activeFramesSinceSilence = 0
            framesSinceAnalysis = 0
            latestLivePower = nil
        liveSmoothedPower = [Double](repeating: 0, count: Self.liveBinCount)
            liveRing = [Double](repeating: 0, count: Self.liveFFTSize)
            liveWriteIndex = 0
            liveActiveFramesSinceSilence = 0
            liveFramesSinceAnalysis = 0
        }
        var index = 0
        while index + 1 < samples.count {
            monitorFrames += 1
            if !hasSignal { index += 2; continue }
            let left = Double(samples[index]) / 32768.0
            let right = Double(samples[index + 1]) / 32768.0
            ring[writeIndex] = (left + right) * 0.5
            writeIndex = (writeIndex + 1) % Self.fftSize
            liveRing[liveWriteIndex] = (left + right) * 0.5
            liveWriteIndex = (liveWriteIndex + 1) % Self.liveFFTSize
            activeFramesSinceSilence += 1
            liveActiveFramesSinceSilence += 1
            if activeFramesSinceSilence >= Self.fftSize {
                framesSinceAnalysis += 1
                if activeFramesSinceSilence == Self.fftSize || framesSinceAnalysis >= Self.hopSize {
                    framesSinceAnalysis = 0
                    var frame = [Double](repeating: 0, count: Self.fftSize)
                    for i in 0..<Self.fftSize {
                        let sourceIndex = (writeIndex + i) % Self.fftSize
                        frame[i] = ring[sourceIndex] * Self.hann[i]
                    }
                    frames.append(frame)
                }
            }
            if liveActiveFramesSinceSilence >= Self.liveFFTSize {
                liveFramesSinceAnalysis += 1
                if liveActiveFramesSinceSilence == Self.liveFFTSize || liveFramesSinceAnalysis >= Self.liveHopSize {
                    liveFramesSinceAnalysis = 0
                    var frame = [Double](repeating: 0, count: Self.liveFFTSize)
                    for i in 0..<Self.liveFFTSize {
                        let sourceIndex = (liveWriteIndex + i) % Self.liveFFTSize
                        frame[i] = liveRing[sourceIndex] * Self.liveHann[i]
                    }
                    liveFrames.append(frame)
                }
            }
            index += 2
        }
        if accumulatingReference {
            let audioFrames = samples.count / 2
            referenceAudioFrames += audioFrames
            if hasSignal { referenceSignalFrames += audioFrames }
        }
        frameEpoch = referenceEpoch
        lock.unlock()

        guard hasSignal, !frames.isEmpty || !liveFrames.isEmpty else { return }
        let referencePowers = frames.map(Self.powerSpectrum)
        let livePowers = liveFrames.map(Self.powerSpectrum)
        lock.lock(); defer { lock.unlock() }
        // The white trace is a live spectrum, so replace the previous frame
        // instead of holding the highest value ever seen in each bin. A
        // lifetime peak hold makes the curve stop following playback.
        // Reuse the same stereo-mixed FFT frames as the capture path.
        let liveDenominator = Double(Self.liveFFTSize) * Double(Self.liveFFTSize)
        for power in livePowers {
            for i in 0..<Self.liveBinCount {
                let p = power[i] / liveDenominator
                liveSmoothedPower[i] = Self.liveAlpha * p + (1.0 - Self.liveAlpha) * liveSmoothedPower[i]
            }
            latestLivePower = liveSmoothedPower
        }
        if accumulatingReference && referenceEpoch == frameEpoch {
            for power in referencePowers {
                for i in 0..<Self.binCount { referencePowerSum[i] += power[i] }
                referenceWindows += 1
            }
        }
}
    func liveJSON(includeReference: Bool = false) -> [String: Any] {
        let snapshot = copySnapshot()
        let now = Date().timeIntervalSinceReferenceDate
        let signalAge = snapshot.lastSignalAt.map { max(0, now - $0) } ?? -1
        let hasSignal = signalAge >= 0 && signalAge < 0.8 && snapshot.latestRmsDbFS > Self.minimumSignalDbFS
        var result: [String: Any] = [
            "available": snapshot.latestLivePower != nil && hasSignal,
            "hasSignal": true,
            "monitorAudioSeconds": snapshot.monitorAudioSeconds,
            "signalRmsDbFS": snapshot.latestRmsDbFS,
            "signalAgeSeconds": signalAge,
            "referenceAvailable": includeReference && snapshot.referenceWindows > 0,
            "windows": includeReference ? snapshot.referenceWindows : 0,
            "audioSeconds": includeReference ? snapshot.referenceAudioSeconds : 0,
            "signalSeconds": includeReference ? snapshot.referenceSignalSeconds : 0
        ]
        if !hasSignal { result["hasSignal"] = false }
        if let latest = snapshot.latestLivePower, hasSignal {
            result["livePoints"] = Self.livePoints(fromPower: latest)
        }
        if includeReference && snapshot.referenceWindows > 0 {
            let average = snapshot.referencePowerSum.map { $0 / Double(snapshot.referenceWindows) }
            result["targetPoints"] = Self.logPoints(fromPower: average).points
        }
        return result
    }

    func profileJSON() -> [String: Any]? {
        let snapshot = copySnapshot()
        guard snapshot.referenceWindows > 0 else { return nil }
        let average = snapshot.referencePowerSum.map { $0 / Double(snapshot.referenceWindows) }
        let profile = Self.curve(fromPower: average)
        return [
            "analyzer": "AIMM Companion · 4096-point Hann · 50% overlap",
            "sampleRate": Int(Self.inputRate),
            "windows": snapshot.referenceWindows,
            "audioSeconds": snapshot.referenceAudioSeconds,
            "offsetDb": profile.offsetDb,
            "points": profile.points,
            "frequencies": profile.frequencies,
            "magnitudesRaw": profile.raw,
            "magnitudesSmoothed": profile.smoothed,
            "magnitudesLow": profile.smoothed.map { $0 - Self.toleranceDb },
            "magnitudesHigh": profile.smoothed.map { $0 + Self.toleranceDb }
        ]
    }

    private func copySnapshot() -> (referencePowerSum: [Double], latestLivePower: [Double]?, referenceWindows: Int, referenceAudioSeconds: Double, referenceSignalSeconds: Double, monitorAudioSeconds: Double, latestRmsDbFS: Double, lastSignalAt: TimeInterval?) {
        lock.lock(); defer { lock.unlock() }
        return (
            referencePowerSum,
            latestLivePower,
            referenceWindows,
            Double(referenceAudioFrames) / Self.inputRate,
            Double(referenceSignalFrames) / Self.inputRate,
            Double(monitorFrames) / Self.inputRate,
            latestRmsDbFS,
            lastSignalAt
        )
    }

    private static func curve(fromPower power: [Double]) -> (frequencies: [Double], raw: [Double], smoothed: [Double], points: [[Double]], offsetDb: Double) {
        let targetBinHz = targetRate / Double(fftSize)
        let sourceBinHz = inputRate / Double(fftSize)
        let frequencies = (0..<binCount).map { Double($0) * targetBinHz }
        let targetPower = frequencies.map { interpolate(power, frequency: $0, binHz: sourceBinHz) }
        let rawDb = targetPower.map { 10 * log10(max($0, 1e-24)) }
        let smoothedDb = gaussianSmooth(rawDb, sigma: 4)
        let probes = (0..<logPointCount).map { 20.0 * pow(1000.0, Double($0) / Double(logPointCount - 1)) }
        let mid = probes.filter { $0 >= 150 && $0 <= 3000 }.map { interpolate(smoothedDb, frequency: $0, binHz: targetBinHz) }
        let offset = mid.isEmpty ? 0 : mid.reduce(0, +) / Double(mid.count)
        let normalized = smoothedDb.map { round3($0 - offset) }
        let normalizedRaw = rawDb.map { round3($0 - offset) }
        let points = probes.map { f in [f, round3(interpolate(smoothedDb, frequency: f, binHz: targetBinHz) - offset)] }
        return (frequencies, normalizedRaw, normalized, points, round3(offset))
    }

    /// Keep the existing compact target trace used during reference capture.
    private static func logPoints(fromPower power: [Double]) -> (points: [[Double]], offsetDb: Double) {
        let targetBinHz = targetRate / Double(fftSize)
        let sourceBinHz = inputRate / Double(fftSize)
        let targetPower = (0..<binCount).map { interpolate(power, frequency: Double($0) * targetBinHz, binHz: sourceBinHz) }
        let values = targetPower.map { 10 * log10(max($0, 1e-24)) }
        let smoothed = gaussianSmooth(values, sigma: 4)
        let probes = (0..<logPointCount).map { 20.0 * pow(1000.0, Double($0) / Double(logPointCount - 1)) }
        let binHz = targetBinHz
        let mid = probes.filter { $0 >= 150 && $0 <= 3000 }.map { interpolate(smoothed, frequency: $0, binHz: binHz) }
        let offset = mid.isEmpty ? 0 : mid.reduce(0, +) / Double(mid.count)
        return (probes.map { [$0, round3(interpolate(smoothed, frequency: $0, binHz: binHz) - offset)] }, round3(offset))
    }

    /// AudioLens 1.5.0 live path (FUN_100e10808): convert the latest 2048-point
    /// FFT power frame back to magnitude, normalize by its sum, run the native
    /// forward/backward frequency smoother, then convert to dB. Captured target
    /// profiles continue to use the separate 4096-point analysis path.
    private static let liveHann: [Double] = (0..<liveFFTSize).map {
        0.5 * (1 - cos(2 * Double.pi * Double($0) / Double(liveFFTSize - 1)))
    }

    private static func livePoints(fromPower power: [Double]) -> [[Double]] {
        // Locked method: 10*log10(smoothed power) + A-weighting; no total normalisation, no frequency smoothing.
        let binHz = inputRate / Double(liveFFTSize)
        return power.indices.compactMap { index in
            let frequency = Double(index) * binHz
            guard frequency >= 20, frequency <= 20_000 else { return nil }
            let db = 10.0 * log10(max(power[index], 1e-30)) + aWeighting(frequency)
            return [round3(frequency), round3(db)]
        }
    }

    // Locked A-weighting (IEC 61672), with the +2.0 dB offset used by the locked DSP.
    private static func aWeighting(_ f: Double) -> Double {
        let f2 = f * f
        let ra = 12_200.0 * 12_200.0 * f2 * f2 /
            ((f2 + 20.6 * 20.6) * (f2 + 12_200.0 * 12_200.0) *
             sqrt(f2 + 107.7 * 107.7) * sqrt(f2 + 737.9 * 737.9))
        return 2.0 + 20.0 * log10(ra + 1e-50)
    }

    private static func interpolate(_ values: [Double], frequency: Double, binHz: Double) -> Double {
        let position = min(Double(values.count - 1), max(0, frequency / binHz))
        let left = Int(position)
        let right = min(values.count - 1, left + 1)
        let fraction = position - Double(left)
        return values[left] + (values[right] - values[left]) * fraction
    }

    private static func gaussianSmooth(_ values: [Double], sigma: Double) -> [Double] {
        let radius = Int(ceil(sigma * 3))
        let weights = (-radius...radius).map { exp(-0.5 * pow(Double($0) / sigma, 2)) }
        let weightSum = weights.reduce(0, +)
        return values.indices.map { index in
            var total = 0.0
            for delta in -radius...radius {
                total += values[min(values.count - 1, max(0, index + delta))] * weights[delta + radius]
            }
            return total / weightSum
        }
    }

    private static func round3(_ value: Double) -> Double { (value * 1000).rounded() / 1000 }

    private static func powerSpectrum(_ input: [Double]) -> [Double] {
        let count = input.count
        var real = input
        var imaginary = [Double](repeating: 0, count: count)

        var j = 0
        if count > 1 {
            for i in 1..<count {
                var bit = count >> 1
                while j & bit != 0 { j ^= bit; bit >>= 1 }
                j ^= bit
                if i < j {
                    real.swapAt(i, j)
                    imaginary.swapAt(i, j)
                }
            }
        }

        var length = 2
        while length <= count {
            let angle = -2 * Double.pi / Double(length)
            let stepReal = cos(angle), stepImaginary = sin(angle)
            let half = length / 2
            var base = 0
            while base < count {
                var twiddleReal = 1.0, twiddleImaginary = 0.0
                for offset in 0..<half {
                    let even = base + offset, odd = even + half
                    let productReal = real[odd] * twiddleReal - imaginary[odd] * twiddleImaginary
                    let productImaginary = real[odd] * twiddleImaginary + imaginary[odd] * twiddleReal
                    let evenReal = real[even], evenImaginary = imaginary[even]
                    real[even] = evenReal + productReal
                    imaginary[even] = evenImaginary + productImaginary
                    real[odd] = evenReal - productReal
                    imaginary[odd] = evenImaginary - productImaginary
                    let nextReal = twiddleReal * stepReal - twiddleImaginary * stepImaginary
                    twiddleImaginary = twiddleReal * stepImaginary + twiddleImaginary * stepReal
                    twiddleReal = nextReal
                }
                base += length
            }
            length <<= 1
        }

        return (0...(count / 2)).map { real[$0] * real[$0] + imaginary[$0] * imaginary[$0] }
    }

}
