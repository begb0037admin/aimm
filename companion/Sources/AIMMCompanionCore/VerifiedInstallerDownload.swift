import CryptoKit
import Foundation

#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

public struct VerifiedInstallerRoute: Sendable {
    public let artifact: MacInstallerArtifact
    public let allowedHosts: Set<String>
    public let expectedSHA256: String
    public let maximumBytes: Int64

    public init(artifact: MacInstallerArtifact, allowedHosts: Set<String>,
                expectedSHA256: String, maximumBytes: Int64) throws {
        let digest = expectedSHA256.lowercased()
        guard artifact.url.scheme?.lowercased() == "https",
              artifact.url.user == nil, artifact.url.password == nil,
              artifact.url.port == nil || artifact.url.port == 443,
              let host = artifact.url.host?.lowercased(), allowedHosts.contains(host),
              artifact.url.pathExtension.lowercased() == "dmg",
              !artifact.productKey.isEmpty, !artifact.version.isEmpty,
              digest.range(of: "^[0-9a-f]{64}$", options: .regularExpression) != nil,
              maximumBytes > 0, maximumBytes <= 2 * 1024 * 1024 * 1024 else {
            throw VerifiedInstallerDownloadError.invalidRoute
        }
        self.artifact = artifact
        self.allowedHosts = Set(allowedHosts.map { $0.lowercased() })
        self.expectedSHA256 = digest
        self.maximumBytes = maximumBytes
    }
}

public struct VerifiedInstallerReceipt: Equatable, Sendable {
    public let productKey: String
    public let version: String
    public let fileURL: URL
    public let byteCount: Int64
    public let sha256: String
}

public enum VerifiedInstallerDownloadError: Error, LocalizedError, Equatable {
    case invalidRoute
    case unsafeDestination
    case destinationExists
    case httpRejected
    case redirectRejected
    case sizeRejected
    case digestMismatch
    case invalidDiskImage
    case ioFailure(String)

    public var errorDescription: String? {
        switch self {
        case .invalidRoute: "This installer route has no trusted digest or safe HTTPS route."
        case .unsafeDestination: "The selected download folder or file is not a safe local destination."
        case .destinationExists: "An installer with this name already exists; it was left unchanged."
        case .httpRejected: "The vendor did not return a successful installer response."
        case .redirectRejected: "The installer response came from a host outside the approved route."
        case .sizeRejected: "The installer exceeds the approved download size."
        case .digestMismatch: "The downloaded installer does not match the trusted release digest."
        case .invalidDiskImage: "The downloaded file is not a complete macOS disk image."
        case .ioFailure(let message): "The installer could not be staged safely: \(message)"
        }
    }
}

/// Downloads only a route that already has a vendor-authenticated digest or a
/// reviewed signer-derived digest. The caller remains responsible for obtaining
/// that trust evidence; a vendor page URL alone is not enough to construct it.
public enum VerifiedInstallerDownload {
    public typealias Downloader = @Sendable (URLRequest) async throws -> (URL, URLResponse)

    public static func save(route: VerifiedInstallerRoute, into directory: URL,
                            downloader: @escaping Downloader,
                            fileManager: FileManager = .default) async throws -> VerifiedInstallerReceipt {
        let sourceURL = route.artifact.url
        guard sourceURL.scheme?.lowercased() == "https",
              let sourceHost = sourceURL.host?.lowercased(), route.allowedHosts.contains(sourceHost) else {
            throw VerifiedInstallerDownloadError.invalidRoute
        }
        let root = canonicalDirectory(directory)
        try validateDirectory(root, fileManager: fileManager)
        let destination = root.appending(path: route.artifact.filename).standardizedFileURL
        guard destination.deletingLastPathComponent().path == root.path else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        guard !fileManager.fileExists(atPath: destination.path) else {
            throw VerifiedInstallerDownloadError.destinationExists
        }

        var request = URLRequest(url: sourceURL, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 30)
        request.httpMethod = "GET"
        let (downloadURL, response) = try await downloader(request)
        defer { try? fileManager.removeItem(at: downloadURL) }
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw VerifiedInstallerDownloadError.httpRejected
        }
        guard let finalURL = response.url, finalURL.scheme?.lowercased() == "https",
              let finalHost = finalURL.host?.lowercased(), route.allowedHosts.contains(finalHost),
              finalURL.port == nil || finalURL.port == 443 else {
            throw VerifiedInstallerDownloadError.redirectRejected
        }
        if let mimeType = response.mimeType?.lowercased(),
           !["application/x-apple-diskimage", "application/octet-stream"].contains(mimeType) {
            throw VerifiedInstallerDownloadError.httpRejected
        }
        let sourceValues = try downloadURL.resourceValues(forKeys: [.isRegularFileKey, .isSymbolicLinkKey, .fileSizeKey])
        guard sourceValues.isRegularFile == true, sourceValues.isSymbolicLink != true,
              let byteCountInt = sourceValues.fileSize, byteCountInt > 0 else {
            throw VerifiedInstallerDownloadError.sizeRejected
        }
        let byteCount = Int64(byteCountInt)
        guard byteCount <= route.maximumBytes else { throw VerifiedInstallerDownloadError.sizeRejected }
        if let contentLength = (response as? HTTPURLResponse)?.value(forHTTPHeaderField: "Content-Length") {
            guard let declaredLength = Int64(contentLength), declaredLength == byteCount else {
                throw VerifiedInstallerDownloadError.sizeRejected
            }
        }
        guard try isCompleteDiskImage(downloadURL, byteCount: byteCount, fileManager: fileManager) else {
            throw VerifiedInstallerDownloadError.invalidDiskImage
        }
        let digest = try sha256(downloadURL, fileManager: fileManager)
        guard digest == route.expectedSHA256 else { throw VerifiedInstallerDownloadError.digestMismatch }
        guard !fileManager.fileExists(atPath: destination.path) else {
            throw VerifiedInstallerDownloadError.destinationExists
        }
        let staging = root.appending(path: ".aimm-installer-\(UUID().uuidString).partial").standardizedFileURL
        defer { try? fileManager.removeItem(at: staging) }
        do {
            try fileManager.copyItem(at: downloadURL, to: staging)
            let stagedValues = try staging.resourceValues(forKeys: [.isRegularFileKey, .isSymbolicLinkKey, .fileSizeKey])
            guard stagedValues.isRegularFile == true, stagedValues.isSymbolicLink != true,
                  stagedValues.fileSize.map(Int64.init) == byteCount,
                  try isCompleteDiskImage(staging, byteCount: byteCount, fileManager: fileManager),
                  try sha256(staging, fileManager: fileManager) == route.expectedSHA256 else {
                throw VerifiedInstallerDownloadError.digestMismatch
            }
            try fileManager.moveItem(at: staging, to: destination)
        } catch {
            if let verificationError = error as? VerifiedInstallerDownloadError { throw verificationError }
            throw VerifiedInstallerDownloadError.ioFailure(error.localizedDescription)
        }
        return VerifiedInstallerReceipt(productKey: route.artifact.productKey,
                                        version: route.artifact.version,
                                        fileURL: destination,
                                        byteCount: byteCount,
                                        sha256: digest)
    }

    private static func validateDirectory(_ directory: URL, fileManager: FileManager) throws {
        var current = directory
        while true {
            let values: URLResourceValues
            do { values = try current.resourceValues(forKeys: [.isDirectoryKey, .isSymbolicLinkKey]) }
            catch { throw VerifiedInstallerDownloadError.unsafeDestination }
            if values.isSymbolicLink == true { throw VerifiedInstallerDownloadError.unsafeDestination }
            if current.path == "/" { break }
            current.deleteLastPathComponent()
        }
        let values = try directory.resourceValues(forKeys: [.isDirectoryKey, .isWritableKey, .isSymbolicLinkKey])
        guard values.isDirectory == true, values.isWritable == true, values.isSymbolicLink != true,
              fileManager.fileExists(atPath: directory.path) else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
    }

    private static func canonicalDirectory(_ directory: URL) -> URL {
        let standardized = directory.standardizedFileURL
        let path = standardized.path
        for alias in ["/var", "/tmp"] where path == alias || path.hasPrefix(alias + "/") {
            let canonical = alias == "/var" ? "/private/var" : "/private/tmp"
            return URL(fileURLWithPath: canonical + path.dropFirst(alias.count), isDirectory: true)
        }
        return standardized
    }

    private static func isCompleteDiskImage(_ file: URL, byteCount: Int64,
                                            fileManager: FileManager) throws -> Bool {
        guard byteCount >= 512 else { return false }
        let handle = try FileHandle(forReadingFrom: file)
        defer { try? handle.close() }
        try handle.seek(toOffset: UInt64(byteCount - 512))
        return try handle.read(upToCount: 4) == Data("koly".utf8)
    }

    private static func sha256(_ file: URL, fileManager: FileManager) throws -> String {
        let handle = try FileHandle(forReadingFrom: file)
        defer { try? handle.close() }
        var hasher = SHA256()
        while let chunk = try handle.read(upToCount: 1024 * 1024), !chunk.isEmpty {
            hasher.update(data: chunk)
        }
        return hasher.finalize().map { String(format: "%02x", $0) }.joined()
    }
}
