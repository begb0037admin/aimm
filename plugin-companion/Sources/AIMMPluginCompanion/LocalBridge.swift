import Foundation
import Network

final class InventoryStore: @unchecked Sendable {
    private let lock = NSLock()
    private let scanQueue = DispatchQueue(label: "com.aimixmasters.plugin-scan", qos: .utility)
    private var current = Inventory.empty
    private var busy = false
    private var waiters: [(Inventory) -> Void] = []
    let roots: [PluginRoot]
    init(roots: [PluginRoot] = PluginRoot.standard()) { self.roots = roots }
    var onScan: ((Inventory) -> Void)?

    func snapshot() -> (Inventory, Bool) { lock.lock(); defer { lock.unlock() }; return (current, busy) }

    func scanAfterWrite(completion: @escaping (Inventory) -> Void) {
        lock.lock(); let wasBusy = busy; lock.unlock()
        if wasBusy { scan { _ in self.scan(completion: completion) } }
        else { scan(completion: completion) }
    }

    func scan(completion: ((Inventory) -> Void)? = nil) {
        lock.lock()
        if let completion { waiters.append(completion) }
        if busy { lock.unlock(); return }
        busy = true
        let generation = current.generation + 1
        lock.unlock()
        scanQueue.async {
            let result = PluginScanner.scan(roots: self.roots, generation: generation)
            self.lock.lock()
            self.current = result
            self.busy = false
            let callbacks = self.waiters
            self.waiters = []
            self.lock.unlock()
            self.onScan?(result)
            callbacks.forEach { $0(result) }
        }
    }
}

final class LocalBridge: @unchecked Sendable {
    private let store: InventoryStore
    private let actions: PluginActions
    private let queue = DispatchQueue(label: "com.aimixmasters.plugin-bridge")
    private var listener: NWListener?
    static let allowedOrigins: Set<String> = [
        "https://aimixmasters.com", "https://www.aimixmasters.com",
        "http://127.0.0.1:8765", "http://127.0.0.1:8001"
    ]
    var onDuplicateInstance: (() -> Void)?

    init(store: InventoryStore, actions: PluginActions) { self.store = store; self.actions = actions }

    static func accepts(origin: String?) -> Bool { origin.map { allowedOrigins.contains($0) } ?? false }
    static func validBatch(_ ids: [String]) -> Bool { ids.count <= 500 }

    func start() {
        do {
            let parameters = NWParameters.tcp
            parameters.requiredLocalEndpoint = .hostPort(host: .ipv4(.loopback), port: NWEndpoint.Port(rawValue: 41736)!)
            let server = try NWListener(using: parameters)
            server.newConnectionHandler = { [weak self] connection in self?.accept(connection) }
            server.stateUpdateHandler = { [weak self] state in
                if case .failed(let error) = state, case .posix(.EADDRINUSE) = error { self?.onDuplicateInstance?() }
            }
            listener = server
            server.start(queue: queue)
        } catch { NSLog("AIMM plugin bridge failed: %@", error.localizedDescription) }
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

    private struct Request {
        let method: String
        let path: String
        let headers: [String: String]
        let body: Data
    }

    private static func parse(_ data: Data) -> Request? {
        guard let marker = data.range(of: Data("\r\n\r\n".utf8)),
              let header = String(data: data[..<marker.lowerBound], encoding: .utf8),
              let first = header.components(separatedBy: "\r\n").first else { return nil }
        let parts = first.split(separator: " ")
        guard parts.count >= 2 else { return nil }
        var headers: [String: String] = [:]
        for line in header.components(separatedBy: "\r\n").dropFirst() {
            guard let colon = line.firstIndex(of: ":") else { continue }
            headers[String(line[..<colon]).lowercased()] = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
        }
        guard let length = Int(headers["content-length"] ?? "0"), length >= 0, length <= 65_536 else { return nil }
        let bodyStart = marker.upperBound
        guard data.count >= bodyStart + length else { return nil }
        return Request(method: String(parts[0]), path: String(parts[1]), headers: headers, body: Data(data[bodyStart..<(bodyStart + length)]))
    }

    private func receive(_ connection: NWConnection, data: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65_536) { [weak self] chunk, _, complete, error in
            guard let self else { connection.cancel(); return }
            var requestData = data
            if let chunk { requestData.append(chunk) }
            if requestData.count > 73_728 { self.send(400, body: ["error": "request too large"], origin: nil, connection: connection); return }
            if let request = Self.parse(requestData) { self.route(request, connection: connection) }
            else if error != nil || complete { self.send(400, body: ["error": "invalid request"], origin: nil, connection: connection) }
            else { self.receive(connection, data: requestData) }
        }
    }

    private func route(_ request: Request, connection: NWConnection) {
        let origin = request.headers["origin"]
        guard Self.accepts(origin: origin) else {
            send(403, body: ["error": "AIMM origin required"], origin: nil, connection: connection)
            return
        }
        if request.method == "OPTIONS" { send(204, body: [String: String](), origin: origin, connection: connection); return }
        let path = URLComponents(string: "http://127.0.0.1\(request.path)")?.path ?? request.path
        switch (request.method, path) {
        case ("GET", "/status"):
            let (inventory, scanning) = store.snapshot()
            send(200, body: Status(app: "AIMM Plugin Companion", version: "0.1.0", scanning: scanning, lastScanAt: inventory.scannedAt), origin: origin, connection: connection)
        case ("GET", "/inventory"):
            send(200, body: store.snapshot().0, origin: origin, connection: connection)
        case ("POST", "/scan"):
            store.scan { [weak self] inventory in
                self?.actions.update(inventory)
                self?.send(200, body: inventory, origin: origin, connection: connection)
            }
        case ("GET", "/unused"):
            send(200, body: actions.unused(), origin: origin, connection: connection)
        case ("GET", "/duplicates"):
            send(200, body: actions.duplicates(), origin: origin, connection: connection)
        case ("POST", "/action/reveal"), ("POST", "/action/unuse"), ("POST", "/action/restore"), ("POST", "/action/trash"):
            guard let object = try? JSONSerialization.jsonObject(with: request.body) as? [String: Any],
                  let ids = object[path == "/action/restore" ? "moveIds" : "ids"] as? [String], Self.validBatch(ids) else {
                send(400, body: ["error": "invalid ids or batch exceeds 500"], origin: origin, connection: connection); return
            }
            guard actions.begin() else { send(409, body: ["error": "action busy"], origin: origin, connection: connection); return }
            DispatchQueue.global(qos: .userInitiated).async {
                let result = self.actions.perform(String(path.dropFirst("/action/".count)), ids: ids)
                self.store.scanAfterWrite { inventory in
                    self.actions.update(inventory)
                    self.actions.end()
                    self.send(200, body: ActionResponse(results: result, counts: inventory.counts, inventory: inventory), origin: origin, connection: connection)
                }
            }
        default: send(404, body: ["error": "not found"], origin: origin, connection: connection)
        }
    }

    private struct Status: Codable {
        let app: String
        let version: String
        let scanning: Bool
        let lastScanAt: String?
    }

    private func send<T: Encodable>(_ status: Int, body: T, origin: String?, connection: NWConnection) {
        let data = status == 204 ? Data() : ((try? JSONEncoder().encode(body)) ?? Data("{}".utf8))
        let reason = [200: "OK", 204: "No Content", 400: "Bad Request", 403: "Forbidden", 404: "Not Found", 409: "Conflict"][status] ?? "Error"
        var header = "HTTP/1.1 \(status) \(reason)\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: \(data.count)\r\nConnection: close\r\nCache-Control: no-store\r\n"
        if let origin, Self.accepts(origin: origin) {
            header += "Access-Control-Allow-Origin: \(origin)\r\nVary: Origin\r\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\r\nAccess-Control-Allow-Headers: Content-Type\r\nAccess-Control-Allow-Private-Network: true\r\n"
        }
        var response = Data((header + "\r\n").utf8)
        response.append(data)
        connection.send(content: response, completion: .contentProcessed { _ in connection.cancel() })
    }
}
