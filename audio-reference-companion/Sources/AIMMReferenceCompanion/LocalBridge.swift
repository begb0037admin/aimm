import Foundation
import Network

final class LocalBridge: @unchecked Sendable {
    private let capture: AudioCaptureService
    private let queue = DispatchQueue(label: "com.aimixmasters.reference-bridge")
    private var listener: NWListener?
    private let allowedOrigins: Set<String> = [
        "https://aimixmasters.com",
        "https://www.aimixmasters.com",
        "http://127.0.0.1:8765", // Loopback-only local preview of the live spectrum.
        "http://127.0.0.1:8001" // Branch preview (feature/live-line-locked).
    ]
    var onStatus: ((String) -> Void)?
    var onDuplicateInstance: (() -> Void)?

    init(capture: AudioCaptureService) {
        self.capture = capture
    }

    func start() {
        onStatus?("Starting local AIMM connection…")
        do {
            guard let port = NWEndpoint.Port(rawValue: 41735) else { return }
            let server = try NWListener(using: .tcp, on: port)
            server.newConnectionHandler = { [weak self] connection in self?.accept(connection) }
            server.stateUpdateHandler = { state in
                switch state {
                case .ready: self.onStatus?("Local AIMM connection ready · 127.0.0.1:41735")
                case .failed(let error):
                    self.onStatus?("Local connection failed: \(error.localizedDescription)")
                    if Self.isAddressInUse(error) { self.onDuplicateInstance?() }
                case .waiting(let error): self.onStatus?("Local connection waiting: \(error.localizedDescription)")
                case .cancelled: self.onStatus?("Local AIMM connection stopped")
                default: break
                }
            }
            listener = server
            server.start(queue: queue)
        } catch {
            NSLog("AIMM reference bridge could not start: %@", error.localizedDescription)
            onStatus?("Local connection failed: \(error.localizedDescription)")
            if let networkError = error as? NWError, Self.isAddressInUse(networkError) {
                onDuplicateInstance?()
            }
        }
    }

    private func accept(_ connection: NWConnection) {
        guard Self.isLoopback(connection.endpoint) else { connection.cancel(); return }
        connection.start(queue: queue)
        receive(connection, data: Data())
    }

    private static func isLoopback(_ endpoint: NWEndpoint) -> Bool {
        guard case .hostPort(let host, _) = endpoint else { return false }
        switch host {
        case .ipv4(let address): return address == .loopback
        case .ipv6(let address): return address == .loopback
        case .name(let name, _): return name == "localhost"
        @unknown default: return false
        }
    }

    private static func isAddressInUse(_ error: NWError) -> Bool {
        if case let .posix(code) = error { return code == .EADDRINUSE }
        return false
    }

    private func receive(_ connection: NWConnection, data: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65_536) { [weak self] chunk, _, complete, error in
            guard let self else { connection.cancel(); return }
            var requestData = data
            if let chunk { requestData.append(chunk) }
            if let request = Self.parse(requestData) {
                self.route(request, connection: connection)
            } else if error != nil || complete {
                self.send(status: 400, type: "application/json", body: Data("{\"error\":\"invalid request\"}".utf8), origin: nil, connection: connection)
            } else {
                self.receive(connection, data: requestData)
            }
        }
    }

    private func route(_ request: Request, connection: NWConnection) {
        let origin = request.headers["origin"]
        guard let origin, allowedOrigins.contains(origin) else {
            send(status: 403, type: "application/json", body: Data("{\"error\":\"AIMM origin required\"}".utf8), origin: nil, connection: connection)
            return
        }
        if request.method == "OPTIONS" {
            send(status: 204, type: "application/json", body: Data(), origin: origin, connection: connection)
            return
        }
        let components = URLComponents(string: "http://127.0.0.1\(request.path)")
        let path = components?.path ?? request.path
        let sessionID = components?.queryItems?.first(where: { $0.name == "sessionId" })?.value
        switch (request.method, path) {
        case ("GET", "/status"):
            Task { @MainActor in
                let body = try? JSONSerialization.data(withJSONObject: ["available": true, "captureMethod": self.capture.captureMethod, "outputChannels": self.capture.outputChannels, "compensationGainDb": self.capture.compensationGainDb, "monitoring": self.capture.isMonitoring, "capturing": self.capture.isCapturing, "status": self.capture.status, "hasSignal": self.capture.isMonitoring && self.capture.spectrumHasRecentSignal, "elapsedSeconds": self.capture.elapsedSeconds, "audioSamples": self.capture.capturedSampleCount, "audioSeconds": self.capture.capturedAudioSeconds])
                self.send(status: 200, type: "application/json; charset=utf-8", body: body ?? Data("{}".utf8), origin: origin, connection: connection)
            }
        case ("GET", "/monitor/spectrum/live"):
            Task { @MainActor in
                let spectrum = self.capture.monitorSpectrumJSON(for: sessionID)
                let body = try? JSONSerialization.data(withJSONObject: spectrum)
                self.send(status: 200, type: "application/json; charset=utf-8", body: body ?? Data("{}".utf8), origin: origin, connection: connection)
            }
        case ("GET", "/capture/spectrum/live"):
            Task { @MainActor in
                guard let sessionID, let spectrum = self.capture.liveSpectrumJSON(for: sessionID) else {
                    self.send(status: 409, type: "application/json; charset=utf-8", body: Data("{\"error\":\"This AIMM tab does not own the active capture session.\"}".utf8), origin: origin, connection: connection)
                    return
                }
                let body = try? JSONSerialization.data(withJSONObject: spectrum)
                self.send(status: 200, type: "application/json; charset=utf-8", body: body ?? Data("{}".utf8), origin: origin, connection: connection)
            }
        case ("GET", "/capture/profile"):
            Task { @MainActor in
                guard !self.capture.isCapturing else {
                    let body = Data("{\"error\":\"Stop the capture before saving its reference profile.\"}".utf8)
                    self.send(status: 409, type: "application/json; charset=utf-8", body: body, origin: origin, connection: connection)
                    return
                }
                guard let sessionID, let profile = self.capture.referenceProfileJSON(for: sessionID) else {
                    let body = Data("{\"error\":\"This AIMM tab does not own the completed capture session.\"}".utf8)
                    self.send(status: 409, type: "application/json; charset=utf-8", body: body, origin: origin, connection: connection)
                    return
                }
                let body = try? JSONSerialization.data(withJSONObject: profile)
                self.send(status: 200, type: "application/json; charset=utf-8", body: body ?? Data("{}".utf8), origin: origin, connection: connection)
            }
        case ("POST", "/capture/start"):
            Task { @MainActor in
                guard let payload = (try? JSONSerialization.jsonObject(with: request.body)) as? [String: Any],
                      let sessionID = payload["sessionId"] as? String,
                      UUID(uuidString: sessionID) != nil else {
                    self.send(status: 400, type: "application/json; charset=utf-8", body: Data("{\"error\":\"A valid capture session is required to start capture.\"}".utf8), origin: origin, connection: connection)
                    return
                }
                let spotifyTrackID = (payload["spotifyTrackId"] as? String).flatMap { $0.isEmpty ? nil : $0 }
                do {
                    try await self.capture.start(sessionID: sessionID, spotifyTrackID: spotifyTrackID)
                    let body = try JSONSerialization.data(withJSONObject: ["started": true, "sessionId": sessionID, "spotifyTrackId": spotifyTrackID ?? ""])
                    self.send(status: 200, type: "application/json; charset=utf-8", body: body, origin: origin, connection: connection)
                } catch {
                    let status = (error as? CaptureError) == .alreadyInProgress ? 409 : 500
                    let message = (error as? CaptureError) == .alreadyInProgress ? error.localizedDescription : self.capture.status
                    let body = try? JSONSerialization.data(withJSONObject: ["error": message, "cause": error.localizedDescription])
                    self.send(status: status, type: "application/json; charset=utf-8", body: body ?? Data("{}".utf8), origin: origin, connection: connection)
                }
            }
        case ("POST", "/capture/stop"):
            Task { @MainActor in
                guard let payload = (try? JSONSerialization.jsonObject(with: request.body)) as? [String: Any],
                      let sessionID = payload["sessionId"] as? String,
                      !sessionID.isEmpty else {
                    self.send(status: 409, type: "application/json; charset=utf-8", body: Data("{\"error\":\"Capture session ID is required to stop this reference.\"}".utf8), origin: origin, connection: connection)
                    return
                }
                do {
                    _ = try await self.capture.stop(sessionID: sessionID)
                    self.send(status: 200, type: "application/json; charset=utf-8", body: Data("{\"stopped\":true}".utf8), origin: origin, connection: connection)
                } catch {
                    let body = try? JSONSerialization.data(withJSONObject: ["error": error.localizedDescription])
                    let status = (error as? CaptureError) == .invalidSession ? 409 : 422
                    self.send(status: status, type: "application/json; charset=utf-8", body: body ?? Data("{}".utf8), origin: origin, connection: connection)
                }
            }
        case ("POST", "/capture/ack"):
            Task { @MainActor in
                guard let payload = (try? JSONSerialization.jsonObject(with: request.body)) as? [String: Any],
                      let sessionID = payload["sessionId"] as? String,
                      self.capture.acknowledgeCompletedSession(sessionID) else {
                    self.send(status: 409, type: "application/json; charset=utf-8", body: Data("{\"error\":\"This AIMM tab does not own a completed capture to acknowledge.\"}".utf8), origin: origin, connection: connection)
                    return
                }
                self.send(status: 200, type: "application/json; charset=utf-8", body: Data("{\"acknowledged\":true}".utf8), origin: origin, connection: connection)
            }
        case ("GET", "/capture.wav"):
            Task { @MainActor in
                guard let sessionID, let wav = self.capture.wavData(for: sessionID) else {
                    self.send(status: 409, type: "application/json", body: Data("{\"error\":\"This AIMM tab does not own the completed capture session.\"}".utf8), origin: origin, connection: connection)
                    return
                }
                self.send(status: 200, type: "audio/wav", body: wav, origin: origin, connection: connection)
            }
        case ("GET", let path) where path.hasPrefix("/capture/chunk"):
            let offset = Int(components?.queryItems?.first(where: { $0.name == "offset" })?.value ?? "0") ?? 0
            Task { @MainActor in
                guard let sessionID, let chunk = self.capture.chunkData(from: offset, sessionID: sessionID) else {
                    self.send(status: 409, type: "application/json; charset=utf-8", body: Data("{\"error\":\"This AIMM tab does not own the capture session.\"}".utf8), origin: origin, connection: connection)
                    return
                }
                self.send(status: 200, type: "application/octet-stream", body: chunk.data, origin: origin, extra: ["X-Next-Audio-Sample": String(chunk.nextOffset)], connection: connection)
            }
        default:
            send(status: 404, type: "application/json", body: Data("{\"error\":\"not found\"}".utf8), origin: origin, connection: connection)
        }
    }

    private func send(status: Int, type: String, body: Data, origin: String?, extra: [String: String] = [:], connection: NWConnection) {
        var headers = "HTTP/1.1 \(status) \(Self.reason(status))\r\nContent-Type: \(type)\r\nContent-Length: \(body.count)\r\nConnection: close\r\nCache-Control: no-store\r\n"
        if let origin, allowedOrigins.contains(origin) {
            headers += "Access-Control-Allow-Origin: \(origin)\r\nVary: Origin\r\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\nAccess-Control-Expose-Headers: X-Next-Audio-Sample\r\nAccess-Control-Allow-Private-Network: true\r\n"
        }
        for (key, value) in extra { headers += "\(key): \(value)\r\n" }
        headers += "\r\n"
        var response = Data(headers.utf8)
        response.append(body)
        connection.send(content: response, completion: .contentProcessed { _ in connection.cancel() })
    }

    private struct Request {
        let method: String
        let path: String
        let headers: [String: String]
        let body: Data
    }

    private static func parse(_ data: Data) -> Request? {
        guard let marker = data.range(of: Data("\r\n\r\n".utf8)),
              let headerText = String(data: data[..<marker.lowerBound], encoding: .utf8),
              let first = headerText.components(separatedBy: "\r\n").first else { return nil }
        let parts = first.split(separator: " ")
        guard parts.count >= 2 else { return nil }
        var headers: [String: String] = [:]
        for line in headerText.components(separatedBy: "\r\n").dropFirst() {
            guard let colon = line.firstIndex(of: ":") else { continue }
            headers[String(line[..<colon]).lowercased()] = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
        }
        let contentLength = Int(headers["content-length"] ?? "0") ?? 0
        guard data.count >= marker.upperBound + contentLength else { return nil }
        let bodyStart = marker.upperBound
        let bodyEnd = bodyStart + contentLength
        return Request(method: String(parts[0]), path: String(parts[1]), headers: headers, body: data.subdata(in: bodyStart..<bodyEnd))
    }

    private static func reason(_ status: Int) -> String {
        switch status { case 200: "OK"; case 204: "No Content"; case 400: "Bad Request"; case 403: "Forbidden"; case 404: "Not Found"; case 409: "Conflict"; case 422: "Unprocessable Entity"; default: "Error" }
    }
}
