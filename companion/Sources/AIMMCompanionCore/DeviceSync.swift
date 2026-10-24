import CryptoKit
import Foundation
import Security

public struct StoredDeviceCredential: Codable, Sendable {
    public let deviceID: String
    public let bearerToken: String
    public let privateKey: Data
    public let apiBaseURL: String

    public init(deviceID: String, bearerToken: String, privateKey: Data, apiBaseURL: String) {
        self.deviceID = deviceID
        self.bearerToken = bearerToken
        self.privateKey = privateKey
        self.apiBaseURL = apiBaseURL
    }
}

public enum DeviceCredentialStore {
    private static let service = "com.aimixmasters.aimm-library-device"
    private static let account = "paired-device-v1"

    public static func load() throws -> StoredDeviceCredential? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var result: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        if status == errSecItemNotFound { return nil }
        guard status == errSecSuccess, let data = result as? Data else {
            throw DeviceSyncError.keychain(status)
        }
        return try JSONDecoder().decode(StoredDeviceCredential.self, from: data)
    }

    public static func save(_ credential: StoredDeviceCredential) throws {
        let data = try JSONEncoder().encode(credential)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
        let attributes: [String: Any] = [
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]
        let status = SecItemUpdate(query as CFDictionary, attributes as CFDictionary)
        if status == errSecItemNotFound {
            var insert = query
            attributes.forEach { insert[$0.key] = $0.value }
            let addStatus = SecItemAdd(insert as CFDictionary, nil)
            guard addStatus == errSecSuccess else { throw DeviceSyncError.keychain(addStatus) }
        } else if status != errSecSuccess {
            throw DeviceSyncError.keychain(status)
        }
    }

    public static func delete() throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw DeviceSyncError.keychain(status)
        }
    }
}

public struct PendingDevicePairing: Sendable {
    public let pairingID: String
    public let pollingSecret: String
    public let serverNonce: String
    public let phrase: String
    public let approvalURL: URL?
    public let privateKey: P256.Signing.PrivateKey
}

public struct PendingDeviceAction: Decodable, Identifiable, Sendable {
    public let operationID: String
    public let generationID: String
    public let kind: String
    public let nonce: String
    public let state: String
    public let createdAt: String
    public let expiresAt: String
    public let recordIDs: [String]
    public var id: String { operationID }

    enum CodingKeys: String, CodingKey {
        case operationID = "operation_id"
        case generationID = "generation_id"
        case kind, nonce, state
        case createdAt = "created_at"
        case expiresAt = "expires_at"
        case recordIDs = "record_ids"
    }
}

public enum DeviceSyncError: Error, LocalizedError {
    case invalidEndpoint
    case invalidResponse
    case rejected(String)
    case keychain(OSStatus)

    public var errorDescription: String? {
        switch self {
        case .invalidEndpoint: "Enter an HTTPS development API URL or localhost URL."
        case .invalidResponse: "The Library API returned an unexpected response."
        case .rejected(let message): message
        case .keychain(let status): "The device credential could not be stored securely (Keychain status \(status))."
        }
    }
}

private final class SameHostRedirectDelegate: NSObject, URLSessionTaskDelegate {
    func urlSession(_ session: URLSession, task: URLSessionTask,
                    willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest,
                    completionHandler: @escaping (URLRequest?) -> Void) {
        guard let source = response.url, let destination = request.url,
              LibraryAPIClient.isSameOrigin(source, destination) else {
            completionHandler(nil)
            return
        }
        completionHandler(request)
    }
}

public final class LibraryAPIClient: @unchecked Sendable {
    private static let approvedDevelopmentHost = "aimm-library-api-dev.kevinlelitte.workers.dev"
    private let delegate: SameHostRedirectDelegate
    private let session: URLSession

    public init(session: URLSession? = nil) {
        let redirectDelegate = SameHostRedirectDelegate()
        self.delegate = redirectDelegate
        self.session = session ?? URLSession(configuration: .ephemeral, delegate: redirectDelegate, delegateQueue: nil)
    }

    public func beginPairing(apiBaseURL: String, deviceName: String) async throws -> PendingDevicePairing {
        let base = try Self.validatedBaseURL(apiBaseURL)
        let privateKey = P256.Signing.PrivateKey()
        let publicBytes = Array(privateKey.publicKey.x963Representation)
        guard publicBytes.count == 65, publicBytes[0] == 4 else { throw DeviceSyncError.invalidResponse }
        let x = Self.base64URL(Data(publicBytes[1..<33]))
        let y = Self.base64URL(Data(publicBytes[33..<65]))
        let publicJWK: [String: String] = ["kty": "EC", "crv": "P-256", "x": x, "y": y]
        let nonce = Self.base64URL(Data((0..<32).map { _ in UInt8.random(in: .min ... .max) }))
        let fingerprintInput = Data("{\"kty\":\"EC\",\"crv\":\"P-256\",\"x\":\"\(x)\",\"y\":\"\(y)\"}".utf8)
        let fingerprint = SHA256.hash(data: fingerprintInput).map { String(format: "%02x", $0) }.joined()
        let proof = try privateKey.signature(for: Data("AIMM-PAIR-INIT\n\(nonce)\n\(fingerprint)".utf8))
        let body: [String: Any] = [
            "device_name": String(deviceName.prefix(80)),
            "public_key": publicJWK,
            "client_nonce": nonce,
            "proof_signature": Self.base64URL(proof.rawRepresentation)
        ]
        let response: PairingCreated = try await request(
            url: base.appending(path: "/v1/pairings"), method: "POST", body: body
        )
        guard let approval = response.approvalURL.flatMap(URL.init(string:)) else {
            throw DeviceSyncError.invalidResponse
        }
        return PendingDevicePairing(
            pairingID: response.pairingID, pollingSecret: response.pollingSecret,
            serverNonce: response.serverNonce, phrase: response.verificationPhrase,
            approvalURL: approval, privateKey: privateKey
        )
    }

    public func waitForPairing(apiBaseURL: String, pending: PendingDevicePairing,
                               onPending: @escaping @Sendable () -> Void) async throws -> StoredDeviceCredential {
        let base = try Self.validatedBaseURL(apiBaseURL)
        let deadline = Date().addingTimeInterval(10 * 60)
        while Date() < deadline {
            try Task.checkCancellation()
            var request = URLRequest(url: base.appending(path: "/v1/pairings/\(pending.pairingID)/poll"))
            request.httpMethod = "POST"
            request.setValue(pending.pollingSecret, forHTTPHeaderField: "x-pairing-secret")
            let (data, response) = try await session.data(for: request)
            guard let http = response as? HTTPURLResponse else { throw DeviceSyncError.invalidResponse }
            if http.statusCode == 202 {
                onPending()
                try await Task.sleep(for: .seconds(3))
                continue
            }
            guard (200..<300).contains(http.statusCode) else { throw Self.apiError(data) }
            let delivered = try JSONDecoder().decode(PairingDelivered.self, from: data)
            guard delivered.status == "paired" else { throw DeviceSyncError.invalidResponse }
            return StoredDeviceCredential(
                deviceID: delivered.deviceID, bearerToken: delivered.deviceCredential,
                privateKey: pending.privateKey.rawRepresentation, apiBaseURL: base.absoluteString
            )
        }
        throw DeviceSyncError.rejected("Pairing expired. Start again from the companion.")
    }

    public func sync(records: [PluginRecord], summary: ScanGenerationSummary,
                     credential: StoredDeviceCredential) async throws {
        let base = try Self.validatedBaseURL(credential.apiBaseURL)
        let allRecords = records.map { record in
            [
                "id": Self.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                "name": record.name,
                "bundleIdentifier": record.bundleIdentifier as Any? ?? NSNull(),
                "version": record.version as Any? ?? NSNull(),
                "format": record.format.rawValue,
                "metadataSource": record.metadataSource.rawValue
            ] as [String: Any]
        }
        let chunks = stride(from: 0, to: allRecords.count, by: 100).map {
            Array(allRecords[$0..<min($0 + 100, allRecords.count)])
        }
        let start = ISO8601DateFormatter().date(from: summary.startedAt) ?? Date()
        let startText = ISO8601DateFormatter().string(from: start)
        let generationPath = "/v1/devices/\(credential.deviceID)/inventory/\(summary.id)"
        _ = try await request(
            url: base.appending(path: generationPath + "/start"), method: "POST",
            body: ["schema_version": 1, "started_at": startText, "root_count": summary.rootCount],
            bearerToken: credential.bearerToken
        ) as EmptyResponse
        for (index, recordsChunk) in chunks.enumerated() {
            let body: [String: Any] = [
                "schema_version": 1, "started_at": startText,
                "root_count": summary.rootCount, "records": recordsChunk
            ]
            _ = try await request(
                url: base.appending(path: generationPath + "/chunks/\(index)"),
                method: "PUT", body: body, bearerToken: credential.bearerToken
            ) as EmptyResponse
        }
        let finalize: [String: Any] = [
            "completed_at": summary.completedAt,
            "record_count": records.count,
            "chunk_count": chunks.count,
            "partial": false
        ]
        _ = try await request(
            url: base.appending(path: generationPath + "/finalize"),
            method: "POST", body: finalize, bearerToken: credential.bearerToken
        ) as EmptyResponse
    }

    public func pendingActions(credential: StoredDeviceCredential) async throws -> [PendingDeviceAction] {
        let base = try Self.validatedBaseURL(credential.apiBaseURL)
        let envelope: DeviceCommandsEnvelope = try await request(
            url: base.appending(path: "/v1/devices/\(credential.deviceID)/commands"),
            method: "GET", body: [:], bearerToken: credential.bearerToken
        )
        return envelope.commands
    }

    public func claim(_ action: PendingDeviceAction, credential: StoredDeviceCredential) async throws {
        let base = try Self.validatedBaseURL(credential.apiBaseURL)
        _ = try await request(
            url: base.appending(path: "/v1/devices/\(credential.deviceID)/actions/\(action.operationID)/claim"),
            method: "POST", body: [:], bearerToken: credential.bearerToken
        ) as EmptyResponse
    }

    public func submitRevealReceipt(_ action: PendingDeviceAction, recordID: String, completed: Bool,
                                   credential: StoredDeviceCredential) async throws {
        let privateKey = try P256.Signing.PrivateKey(rawRepresentation: credential.privateKey)
        let completedAt = ISO8601DateFormatter().string(from: Date())
        let state = completed ? "completed" : "failed"
        let receipt: [String: Any] = [
            "operation_id": action.operationID,
            "device_id": credential.deviceID,
            "generation_id": action.generationID,
            "nonce": action.nonce,
            "completed_at": completedAt,
            "state": state,
            "items": [["record_id": recordID, "status": state]]
        ]
        let canonical = try JSONSerialization.data(withJSONObject: receipt, options: [.sortedKeys])
        let signature = try privateKey.signature(for: canonical)
        let body: [String: Any] = ["receipt": receipt, "signature": Self.base64URL(signature.rawRepresentation)]
        let base = try Self.validatedBaseURL(credential.apiBaseURL)
        _ = try await request(
            url: base.appending(path: "/v1/devices/\(credential.deviceID)/actions/\(action.operationID)/receipt"),
            method: "POST", body: body, bearerToken: credential.bearerToken
        ) as EmptyResponse
    }

    public static func opaqueRecordID(localPath: String, privateKey: Data) -> String {
        let key = SymmetricKey(data: privateKey)
        var bytes = Array(HMAC<SHA256>.authenticationCode(for: Data(localPath.utf8), using: key).prefix(16))
        bytes[6] = (bytes[6] & 0x0f) | 0x40
        bytes[8] = (bytes[8] & 0x3f) | 0x80
        let tuple: uuid_t = (bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7],
                             bytes[8], bytes[9], bytes[10], bytes[11], bytes[12], bytes[13], bytes[14], bytes[15])
        return UUID(uuid: tuple).uuidString.lowercased()
    }

    private func request<T: Decodable>(url: URL, method: String, body: [String: Any],
                                       bearerToken: String? = nil) async throws -> T {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "content-type")
        if let bearerToken { request.setValue("Bearer \(bearerToken)", forHTTPHeaderField: "authorization") }
        request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [.sortedKeys])
        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw Self.apiError(data)
        }
        if T.self == EmptyResponse.self { return EmptyResponse() as! T }
        do { return try JSONDecoder().decode(T.self, from: data) }
        catch { throw DeviceSyncError.invalidResponse }
    }

    public static func validatedBaseURL(_ value: String) throws -> URL {
        guard let url = URL(string: value.trimmingCharacters(in: .whitespacesAndNewlines)),
              let scheme = url.scheme?.lowercased(), let host = url.host?.lowercased(),
              url.user == nil, url.password == nil, url.query == nil, url.fragment == nil,
              ((scheme == "https" && host == approvedDevelopmentHost && (url.port == nil || url.port == 443)) ||
               ((host == "localhost" || host == "127.0.0.1") && (scheme == "http" || scheme == "https"))) else {
            throw DeviceSyncError.invalidEndpoint
        }
        return URL(string: "\(scheme)://\(host)\(url.port.map { ":\($0)" } ?? "")")!
    }

    public static func isSameOrigin(_ source: URL, _ destination: URL) -> Bool {
        guard let sourceScheme = source.scheme?.lowercased(),
              sourceScheme == destination.scheme?.lowercased(),
              source.host?.lowercased() == destination.host?.lowercased() else { return false }
        let defaultPort = sourceScheme == "https" ? 443 : (sourceScheme == "http" ? 80 : nil)
        return (source.port ?? defaultPort) == (destination.port ?? defaultPort)
    }

    private static func apiError(_ data: Data) -> DeviceSyncError {
        if let decoded = try? JSONDecoder().decode(APIErrorEnvelope.self, from: data) {
            return .rejected(decoded.error.message)
        }
        return .invalidResponse
    }

    private static func base64URL(_ data: Data) -> String {
        data.base64EncodedString().replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_").replacingOccurrences(of: "=", with: "")
    }

}

private struct PairingCreated: Decodable {
    let pairingID: String
    let pollingSecret: String
    let serverNonce: String
    let verificationPhrase: String
    let approvalURL: String?
    enum CodingKeys: String, CodingKey {
        case pairingID = "pairing_id"
        case pollingSecret = "polling_secret"
        case serverNonce = "server_nonce"
        case verificationPhrase = "verification_phrase"
        case approvalURL = "approval_url"
    }
}

private struct PairingDelivered: Decodable {
    let status: String
    let deviceID: String
    let deviceCredential: String
    enum CodingKeys: String, CodingKey {
        case status
        case deviceID = "device_id"
        case deviceCredential = "device_credential"
    }
}

private struct APIErrorEnvelope: Decodable {
    struct APIError: Decodable { let message: String }
    let error: APIError
}

private struct EmptyResponse: Decodable {}

private struct DeviceCommandsEnvelope: Decodable {
    let commands: [PendingDeviceAction]
}

