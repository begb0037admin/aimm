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
    public let accountID: String
    public let generationID: String
    public let kind: String
    public let nonce: String
    public let state: String
    public let createdAt: String
    public let expiresAt: String
    public let recordIDs: [String]
    public let parentMoveOperationID: String?
    public let previewDigest: String?
    public let previewExpiresAt: String?
    public let ownerConfirmedAt: String?
    public var id: String { operationID }

    public init(operationID: String, accountID: String, generationID: String, kind: String,
                nonce: String, state: String, createdAt: String, expiresAt: String,
                recordIDs: [String], parentMoveOperationID: String? = nil, previewDigest: String? = nil,
                previewExpiresAt: String? = nil, ownerConfirmedAt: String? = nil) {
        self.operationID = operationID
        self.accountID = accountID
        self.generationID = generationID
        self.kind = kind
        self.nonce = nonce
        self.state = state
        self.createdAt = createdAt
        self.expiresAt = expiresAt
        self.recordIDs = recordIDs
        self.parentMoveOperationID = parentMoveOperationID
        self.previewDigest = previewDigest
        self.previewExpiresAt = previewExpiresAt
        self.ownerConfirmedAt = ownerConfirmedAt
    }

    enum CodingKeys: String, CodingKey {
        case operationID = "operation_id"
        case accountID = "account_id"
        case generationID = "generation_id"
        case kind, nonce, state
        case createdAt = "created_at"
        case expiresAt = "expires_at"
        case recordIDs = "record_ids"
        case parentMoveOperationID = "parent_move_operation_id"
        case previewDigest = "preview_digest"
        case previewExpiresAt = "preview_expires_at"
        case ownerConfirmedAt = "owner_confirmed_at"
    }

    public func binding(preparedPreview: PreparedActionPreview) -> PendingDeviceAction {
        PendingDeviceAction(
            operationID: operationID, accountID: accountID, generationID: generationID,
            kind: kind, nonce: nonce, state: state, createdAt: createdAt, expiresAt: expiresAt,
            recordIDs: recordIDs, parentMoveOperationID: parentMoveOperationID, previewDigest: preparedPreview.digest,
            previewExpiresAt: ISO8601DateFormatter().string(from: preparedPreview.expiresAt),
            ownerConfirmedAt: ownerConfirmedAt
        )
    }
}

/// Local evidence that the server accepted the exact preview made from one
/// journal record. The full path remains in the Mac process and is never sent
/// back to the server outside the encrypted preview payload.
public struct PreparedActionPreview: Equatable, Sendable {
    public let operationID: String
    public let accountID: String
    public let deviceID: String
    public let generationID: String
    public let kind: String
    public let nonce: String
    public let recordID: String
    public let record: PluginRecord
    public let digest: String
    public let expiresAt: Date
    public let destinationPath: String?
    public let treeDigest: String?
    public let parentMoveOperationID: String?

    public init(operationID: String, accountID: String, deviceID: String, generationID: String,
                kind: String, nonce: String, recordID: String, record: PluginRecord,
                digest: String, expiresAt: Date, destinationPath: String? = nil,
                treeDigest: String? = nil, parentMoveOperationID: String? = nil) {
        self.operationID = operationID
        self.accountID = accountID
        self.deviceID = deviceID
        self.generationID = generationID
        self.kind = kind
        self.nonce = nonce
        self.recordID = recordID
        self.record = record
        self.digest = digest
        self.expiresAt = expiresAt
        self.destinationPath = destinationPath
        self.treeDigest = treeDigest
        self.parentMoveOperationID = parentMoveOperationID
    }
}

public struct MoveActionReceiptEvidence: Sendable {
    public let treeDigest: String?
    public let destinationVerified: Bool?
    public let sourceRemoved: Bool?
    public let failureCode: String?
    public let rescanGenerationID: String?
    public let previewDigest: String?

    public init(treeDigest: String? = nil, destinationVerified: Bool? = nil,
                sourceRemoved: Bool? = nil, failureCode: String? = nil,
                rescanGenerationID: String? = nil, previewDigest: String? = nil) {
        self.treeDigest = treeDigest
        self.destinationVerified = destinationVerified
        self.sourceRemoved = sourceRemoved
        self.failureCode = failureCode
        self.rescanGenerationID = rescanGenerationID
        self.previewDigest = previewDigest
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

    public init(configuration: URLSessionConfiguration? = nil) {
        let redirectDelegate = SameHostRedirectDelegate()
        self.delegate = redirectDelegate
        self.session = URLSession(
            configuration: configuration ?? .ephemeral,
            delegate: redirectDelegate,
            delegateQueue: nil
        )
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

    /// Publishes an explicit Manual Check observation for each record when no
    /// supported automatic vendor adapter is available. This never contacts a
    /// vendor and never claims that an update is current.
    @discardableResult
    public func recordManualCheckFallback(records: [PluginRecord], generationID: String,
                                          credential: StoredDeviceCredential) async throws -> Int {
        let checkedAt = ISO8601DateFormatter().string(from: Date())
        let observations = records.map { record in
            PluginCheckObservation(
                recordID: Self.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey),
                installedVersion: record.version, latestVersion: nil, result: "manual", sourceType: "manual",
                checkedAt: checkedAt, route: "manual", comparisonReason: "manual_check_required"
            )
        }
        return try await submitCheckObservations(observations, generationID: generationID, credential: credential)
    }

    /// Sends path-free, adapter-produced status for the current complete scan.
    /// The caller controls the source and result; the API validates the vocabulary.
    @discardableResult
    public func submitCheckObservations(_ observations: [PluginCheckObservation], generationID: String,
                                        credential: StoredDeviceCredential) async throws -> Int {
        let base = try Self.validatedBaseURL(credential.apiBaseURL)
        var accepted = 0
        for start in stride(from: 0, to: observations.count, by: 90) {
            let batch = Array(observations[start..<min(start + 90, observations.count)])
            let rows: [[String: Any]] = batch.map { observation in
                [
                    "record_id": observation.recordID,
                    "installed_version": observation.installedVersion as Any? ?? NSNull(),
                    "latest_version": observation.latestVersion as Any? ?? NSNull(),
                    "result": observation.result,
                    "source_type": observation.sourceType,
                    "checked_at": observation.checkedAt,
                    "last_good_at": observation.lastGoodAt as Any? ?? NSNull(),
                    "error_code": observation.errorCode as Any? ?? NSNull(),
                    "route": observation.route as Any? ?? NSNull(),
                    "comparison_reason": observation.comparisonReason as Any? ?? NSNull()
                ]
            }
            let response: CheckSubmissionResponse = try await request(
                url: base.appending(path: "/v1/devices/\(credential.deviceID)/checks/\(generationID)"),
                method: "POST", body: ["observations": rows], bearerToken: credential.bearerToken
            )
            guard response.deviceID == credential.deviceID, response.generationID == generationID,
                  response.accepted == batch.count else { throw DeviceSyncError.invalidResponse }
            accepted += response.accepted
        }
        return accepted
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

    public func submitPreparedPreview(_ action: PendingDeviceAction, record: PluginRecord,
                                      unusedDirectory: URL? = nil,
                                      parentMoveEntry: LocalFileActionEntry? = nil,
                                      credential: StoredDeviceCredential) async throws -> PreparedActionPreview {
        let privateKey = try P256.Signing.PrivateKey(rawRepresentation: credential.privateKey)
        let created = Date()
        guard let operationExpiry = Self.parseISO8601(action.expiresAt) else { throw DeviceSyncError.invalidResponse }
        let expires = min(created.addingTimeInterval(10 * 60), operationExpiry)
        guard expires > created else { throw DeviceSyncError.rejected("This action has expired. Request it again from the account page.") }
        let formatter = ISO8601DateFormatter()
        let createdAt = formatter.string(from: created)
        let expiresAt = formatter.string(from: expires)
        guard let boundExpiry = Self.parseISO8601(expiresAt) else { throw DeviceSyncError.invalidResponse }
        var destinationPath: String?
        var localTreeDigest: String?
        let itemURL: URL
        if action.kind == "restore" {
            guard let parentMoveOperationID = action.parentMoveOperationID,
                  let parentMoveEntry, parentMoveEntry.operationID == parentMoveOperationID,
                  parentMoveEntry.kind == "move_to_unused", parentMoveEntry.state == "completed",
                  parentMoveEntry.destinationVerified, parentMoveEntry.recordID == action.recordIDs.first,
                  parentMoveEntry.sourcePath == record.localPath,
                  Self.opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey) == action.recordIDs.first else {
                throw DeviceSyncError.rejected("The restore is not bound to a completed, verified move in this Mac's journal.")
            }
            itemURL = URL(fileURLWithPath: parentMoveEntry.destinationPath)
            guard FileManager.default.fileExists(atPath: itemURL.path),
                  !FileManager.default.fileExists(atPath: parentMoveEntry.sourcePath),
                  try LocalPluginFileActions.treeDigest(itemURL) == parentMoveEntry.treeDigest else {
                throw DeviceSyncError.rejected("The moved item or original destination changed. Request a fresh restore preview.")
            }
            destinationPath = parentMoveEntry.sourcePath
            localTreeDigest = parentMoveEntry.treeDigest
        } else {
            itemURL = URL(fileURLWithPath: record.localPath)
        }
        let isSymlink = (try? itemURL.resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink) == true
        let exists = FileManager.default.fileExists(atPath: itemURL.path)
        if action.kind == "move_to_unused" {
            guard let unusedDirectory, exists, !isSymlink,
                  FileManager.default.isReadableFile(atPath: itemURL.path) else {
                throw DeviceSyncError.rejected("The local item or selected Unused folder is unavailable. Choose a fresh action.")
            }
            let destination = try LocalPluginFileActions.previewDestination(source: itemURL, unusedDirectory: unusedDirectory)
            destinationPath = destination.path
            localTreeDigest = try LocalPluginFileActions.treeDigest(itemURL)
        } else if unusedDirectory != nil || parentMoveEntry != nil {
            throw DeviceSyncError.rejected("A destination is only valid for a move-to-Unused action.")
        }
        var previewItem: [String: Any] = [
            "record_id": action.recordIDs[0],
            "name": record.name,
            "format": record.format.rawValue,
            "version": record.version as Any? ?? NSNull(),
            "source_display_path": itemURL.standardizedFileURL.path,
            "destination_display_path": destinationPath as Any? ?? NSNull(),
            "symlink": isSymlink,
            "permission": exists && FileManager.default.isReadableFile(atPath: itemURL.path) ? "allowed" : "needs_permission"
        ]
        if let localTreeDigest { previewItem["tree_digest"] = localTreeDigest }
        var preview: [String: Any] = [
            "schema_version": 1,
            "account_id": action.accountID,
            "device_id": credential.deviceID,
            "operation_id": action.operationID,
            "nonce": action.nonce,
            "kind": action.kind,
            "generation_id": action.generationID,
            "created_at": createdAt,
            "expires_at": expiresAt,
            "items": [previewItem]
        ]
        if let parentMoveOperationID = action.parentMoveOperationID {
            guard action.kind == "restore", parentMoveEntry?.operationID == parentMoveOperationID else {
                throw DeviceSyncError.rejected("Only a restore may include its completed parent move.")
            }
            preview["parent_move_operation_id"] = parentMoveOperationID
        }
        let canonical = try JSONSerialization.data(withJSONObject: preview, options: [.sortedKeys, .withoutEscapingSlashes])
        let signature = try privateKey.signature(for: canonical)
        let base = try Self.validatedBaseURL(credential.apiBaseURL)
        let response: PreparedPreviewResponse = try await request(
            url: base.appending(path: "/v1/devices/\(credential.deviceID)/actions/\(action.operationID)/prepared-preview"),
            method: "POST", body: ["preview": preview, "signature": Self.base64URL(signature.rawRepresentation)],
            bearerToken: credential.bearerToken
        )
        guard response.operationID == action.operationID, response.state == "preview_ready",
              response.previewDigest.range(of: "^[0-9a-f]{64}$", options: .regularExpression) != nil,
              Self.parseISO8601(response.expiresAt) == boundExpiry else { throw DeviceSyncError.invalidResponse }
        return PreparedActionPreview(
            operationID: action.operationID, accountID: action.accountID, deviceID: credential.deviceID,
            generationID: action.generationID, kind: action.kind, nonce: action.nonce,
            recordID: action.recordIDs.first ?? "", record: record, digest: response.previewDigest,
            expiresAt: boundExpiry, destinationPath: destinationPath, treeDigest: localTreeDigest,
            parentMoveOperationID: action.parentMoveOperationID
        )
    }

    /// Refuse execution when the request, preview, local generation or scanned
    /// item changed while the user was reviewing it.
    public static func preparedPreviewIsCurrent(
        _ preview: PreparedActionPreview,
        action: PendingDeviceAction,
        record: PluginRecord,
        currentRecords: [PluginRecord],
        currentGenerationID: String?,
        credential: StoredDeviceCredential,
        parentMoveEntry: LocalFileActionEntry? = nil,
        now: Date = Date()
    ) -> Bool {
        let isRestore = action.kind == "restore"
        if isRestore {
            guard let parentOperationID = action.parentMoveOperationID,
                  preview.parentMoveOperationID == parentOperationID,
                  let parentMoveEntry, parentMoveEntry.operationID == parentOperationID,
                  parentMoveEntry.kind == "move_to_unused", parentMoveEntry.state == "completed",
                  parentMoveEntry.destinationVerified, parentMoveEntry.recordID == action.recordIDs.first,
                  parentMoveEntry.sourcePath == record.localPath,
                  !currentRecords.contains(record) else { return false }
        } else if parentMoveEntry != nil || action.parentMoveOperationID != nil || preview.parentMoveOperationID != nil {
            return false
        }
        guard preview.operationID == action.operationID,
              preview.accountID == action.accountID,
              preview.deviceID == credential.deviceID,
              preview.generationID == action.generationID,
              preview.kind == action.kind,
              preview.nonce == action.nonce,
              preview.recordID == action.recordIDs.first,
              action.previewDigest == preview.digest,
              let actionPreviewExpiry = action.previewExpiresAt.flatMap(parseISO8601),
              actionPreviewExpiry == preview.expiresAt,
              preview.record == record,
              preview.digest.range(of: "^[0-9a-f]{64}$", options: .regularExpression) != nil,
              preview.expiresAt > now,
              let operationExpiry = parseISO8601(action.expiresAt), operationExpiry > now,
              currentGenerationID == action.generationID,
              action.recordIDs.count == 1,
              isRestore || currentRecords.contains(record),
              opaqueRecordID(localPath: record.localPath, privateKey: credential.privateKey) == action.recordIDs[0],
              isRestore || FileManager.default.fileExists(atPath: record.localPath),
              isRestore || (try? URL(fileURLWithPath: record.localPath).resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink) != true
        else { return false }
        if requiresOwnerPasskeyConfirmation(for: action.kind) {
            guard ownerConfirmationIsCurrent(action, matching: preview, now: now) else { return false }
        }
        if action.kind == "move_to_unused" {
            guard let destinationPath = preview.destinationPath, let expectedDigest = preview.treeDigest else { return false }
            let destinationURL = URL(fileURLWithPath: destinationPath)
            let parent = destinationURL.deletingLastPathComponent()
            guard destinationURL.lastPathComponent == URL(fileURLWithPath: record.localPath).lastPathComponent,
                  (try? LocalPluginFileActions.previewDestination(source: URL(fileURLWithPath: record.localPath), unusedDirectory: parent).path) == destinationPath,
                  (try? LocalPluginFileActions.treeDigest(URL(fileURLWithPath: record.localPath))) == expectedDigest else { return false }
        } else if action.kind == "restore" {
            guard let parentMoveEntry, let destinationPath = preview.destinationPath,
                  let expectedDigest = preview.treeDigest,
                  destinationPath == parentMoveEntry.sourcePath,
                  preview.parentMoveOperationID == parentMoveEntry.operationID,
                  parentMoveEntry.destinationPath == URL(fileURLWithPath: parentMoveEntry.destinationPath).standardizedFileURL.path,
                  !FileManager.default.fileExists(atPath: destinationPath),
                  FileManager.default.fileExists(atPath: parentMoveEntry.destinationPath),
                  (try? URL(fileURLWithPath: parentMoveEntry.destinationPath).resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink) != true,
                  (try? LocalPluginFileActions.treeDigest(URL(fileURLWithPath: parentMoveEntry.destinationPath))) == expectedDigest,
                  expectedDigest == parentMoveEntry.treeDigest else { return false }
        } else if preview.destinationPath != nil || preview.treeDigest != nil {
            return false
        }
        return true
    }

    public static func requiresOwnerPasskeyConfirmation(for kind: String) -> Bool {
        ["download_installer", "open_installer", "move_to_unused", "offload", "restore",
         "trash_plugin_copy", "trash_old_installer"].contains(kind)
    }

    public static func ownerConfirmationIsCurrent(
        _ action: PendingDeviceAction,
        matching preview: PreparedActionPreview,
        now: Date = Date()
    ) -> Bool {
        guard let confirmedAt = action.ownerConfirmedAt.flatMap(parseISO8601),
              let digest = action.previewDigest,
              let expiryText = action.previewExpiresAt,
              let expiry = parseISO8601(expiryText) else { return false }
        return confirmedAt <= now && expiry > now &&
            action.operationID == preview.operationID && action.accountID == preview.accountID &&
            action.generationID == preview.generationID && action.kind == preview.kind &&
            digest == preview.digest && expiry == preview.expiresAt
    }

    private static func parseISO8601(_ value: String) -> Date? {
        let fractional = ISO8601DateFormatter()
        fractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = fractional.date(from: value) { return date }
        let wholeSeconds = ISO8601DateFormatter()
        wholeSeconds.formatOptions = [.withInternetDateTime]
        return wholeSeconds.date(from: value)
    }

    public func submitActionReceipt(_ action: PendingDeviceAction, recordID: String, completed: Bool,
                                    moveEvidence: MoveActionReceiptEvidence? = nil,
                                    credential: StoredDeviceCredential) async throws {
        let privateKey = try P256.Signing.PrivateKey(rawRepresentation: credential.privateKey)
        let completedAt = ISO8601DateFormatter().string(from: Date())
        let state = completed ? "completed" : "failed"
        var item: [String: Any] = ["record_id": recordID, "status": state]
        var receipt: [String: Any] = [
            "operation_id": action.operationID,
            "device_id": credential.deviceID,
            "generation_id": action.generationID,
            "nonce": action.nonce,
            "completed_at": completedAt,
            "state": state,
            "items": [item]
        ]
        if action.kind == "move_to_unused" || action.kind == "restore" {
            guard let moveEvidence, let previewDigest = moveEvidence.previewDigest else {
                throw DeviceSyncError.rejected("A file-action receipt must be bound to its exact owner-confirmed preview.")
            }
            if action.kind == "restore" {
                guard let parentMoveOperationID = action.parentMoveOperationID else {
                    throw DeviceSyncError.rejected("A restore receipt must name its verified parent move.")
                }
                receipt["parent_move_operation_id"] = parentMoveOperationID
            } else if action.parentMoveOperationID != nil {
                throw DeviceSyncError.rejected("A parent move can only be attached to a restore receipt.")
            }
            var evidence: [String: Any] = [:]
            if let treeDigest = moveEvidence.treeDigest { evidence["tree_digest"] = treeDigest }
            if let destinationVerified = moveEvidence.destinationVerified { evidence["destination_verified"] = destinationVerified }
            if let sourceRemoved = moveEvidence.sourceRemoved { evidence["source_removed"] = sourceRemoved }
            if let failureCode = moveEvidence.failureCode { evidence["failure_code"] = failureCode }
            item["evidence"] = evidence
            if let rescanGenerationID = moveEvidence.rescanGenerationID { item["rescan_generation_id"] = rescanGenerationID }
            receipt["items"] = [item]
            receipt["preview_digest"] = previewDigest
        } else if moveEvidence != nil {
            throw DeviceSyncError.rejected("File-action evidence cannot be attached to another action kind.")
        }
        let canonical = try JSONSerialization.data(withJSONObject: receipt, options: [.sortedKeys])
        let signature = try privateKey.signature(for: canonical)
        let body: [String: Any] = ["receipt": receipt, "signature": Self.base64URL(signature.rawRepresentation)]
        let base = try Self.validatedBaseURL(credential.apiBaseURL)
        _ = try await request(
            url: base.appending(path: "/v1/devices/\(credential.deviceID)/actions/\(action.operationID)/receipt"),
            method: "POST", body: body, bearerToken: credential.bearerToken
        ) as EmptyResponse
    }

    public func submitRevealReceipt(_ action: PendingDeviceAction, recordID: String, completed: Bool,
                                    credential: StoredDeviceCredential) async throws {
        try await submitActionReceipt(action, recordID: recordID, completed: completed, credential: credential)
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
        if method.uppercased() != "GET" {
            request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [.sortedKeys])
        }
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

private struct CheckSubmissionResponse: Decodable {
    let deviceID: String
    let generationID: String
    let accepted: Int

    enum CodingKeys: String, CodingKey {
        case deviceID = "device_id"
        case generationID = "generation_id"
        case accepted
    }
}

private struct DeviceCommandsEnvelope: Decodable {
    let commands: [PendingDeviceAction]
}

private struct PreparedPreviewResponse: Decodable {
    let operationID: String
    let state: String
    let previewDigest: String
    let expiresAt: String
    enum CodingKeys: String, CodingKey {
        case operationID = "operation_id"
        case state
        case previewDigest = "preview_digest"
        case expiresAt = "expires_at"
    }
}

