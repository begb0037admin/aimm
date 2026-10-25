import CryptoKit
import Foundation

#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
#if canImport(Darwin)
import Darwin
#elseif canImport(Glibc)
import Glibc
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
        case .invalidDiskImage: "The downloaded file is not a structurally valid macOS disk image."
        case .ioFailure(let message): "The installer could not be staged safely: \(message)"
        }
    }
}

/// Downloads only a route that already has a vendor-authenticated digest or a
/// reviewed signer-derived digest. The caller remains responsible for obtaining
/// that trust evidence; a vendor page URL alone is not enough to construct it.
public enum VerifiedInstallerDownload {
    public static func save(route: VerifiedInstallerRoute, into directory: URL,
                            fileManager: FileManager = .default) async throws -> VerifiedInstallerReceipt {
        guard isAllowedURL(route.artifact.url, hosts: route.allowedHosts) else {
            throw VerifiedInstallerDownloadError.invalidRoute
        }
        let root = canonicalDirectory(directory)
        let (destination, staging, stagingHandle) = try preparePaths(route: route, root: root, fileManager: fileManager)
        defer { try? fileManager.removeItem(at: staging) }

        let redirectPolicy = InstallerRedirectPolicy(allowedHosts: route.allowedHosts)
        let configuration = URLSessionConfiguration.ephemeral
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60 * 60
        let session = URLSession(configuration: configuration, delegate: redirectPolicy, delegateQueue: nil)
        defer { session.invalidateAndCancel() }
        var request = URLRequest(url: route.artifact.url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 30)
        request.httpMethod = "GET"
        let (bytes, response): (URLSession.AsyncBytes, URLResponse)
        do { (bytes, response) = try await session.bytes(for: request) }
        catch {
            if redirectPolicy.didRejectRedirect { throw VerifiedInstallerDownloadError.redirectRejected }
            throw VerifiedInstallerDownloadError.httpRejected
        }
        return try await saveResponse(route: route, response: response, bytes: bytes,
            redirectRejected: redirectPolicy.didRejectRedirect, root: root,
            destination: destination, staging: staging, stagingHandle: stagingHandle, fileManager: fileManager)
    }

    @_spi(Testing)
    public static func saveFixture(route: VerifiedInstallerRoute, into directory: URL,
                                   response: HTTPURLResponse,
                                   bytes: AsyncThrowingStream<UInt8, Error>,
                                   redirectRejected: Bool = false,
                                   fileManager: FileManager = .default) async throws -> VerifiedInstallerReceipt {
        let root = canonicalDirectory(directory)
        let (destination, staging, stagingHandle) = try preparePaths(route: route, root: root, fileManager: fileManager)
        defer { try? fileManager.removeItem(at: staging) }
        return try await saveResponse(route: route, response: response, bytes: bytes,
            redirectRejected: redirectRejected, root: root, destination: destination,
            staging: staging, stagingHandle: stagingHandle, fileManager: fileManager)
    }

    @_spi(Testing)
    public static func allowsRedirectForTesting(to url: URL, allowedHosts: Set<String>) -> Bool {
        isAllowedURL(url, hosts: Set(allowedHosts.map { $0.lowercased() }))
    }

    private static func preparePaths(route: VerifiedInstallerRoute, root: URL,
                                     fileManager: FileManager) throws -> (URL, URL, FileHandle) {
        try validateDirectory(root)
        let destination = root.appending(path: route.artifact.filename).standardizedFileURL
        guard destination.deletingLastPathComponent().path == root.path else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        guard !fileManager.fileExists(atPath: destination.path) else {
            throw VerifiedInstallerDownloadError.destinationExists
        }
        let staging = root.appending(path: ".aimm-installer-\(UUID().uuidString).partial").standardizedFileURL
        guard staging.deletingLastPathComponent().path == root.path else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        let descriptor = open(staging.path, O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW, S_IRUSR | S_IWUSR)
        guard descriptor >= 0 else { throw VerifiedInstallerDownloadError.unsafeDestination }
        let handle = FileHandle(fileDescriptor: descriptor, closeOnDealloc: true)
        return (destination, staging, handle)
    }

    private static func saveResponse<S: AsyncSequence>(route: VerifiedInstallerRoute,
        response: URLResponse, bytes: S, redirectRejected: Bool, root: URL,
        destination: URL, staging: URL, stagingHandle: FileHandle,
        fileManager: FileManager) async throws -> VerifiedInstallerReceipt
        where S.Element == UInt8 {
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            if redirectRejected { throw VerifiedInstallerDownloadError.redirectRejected }
            throw VerifiedInstallerDownloadError.httpRejected
        }
        guard let finalURL = response.url, isAllowedURL(finalURL, hosts: route.allowedHosts) else {
            throw VerifiedInstallerDownloadError.redirectRejected
        }
        guard let contentType = http.value(forHTTPHeaderField: "Content-Type")?.lowercased(),
              let mimeType = contentType.split(separator: ";", maxSplits: 1).first.map(String.init),
              ["application/x-apple-diskimage", "application/octet-stream"].contains(mimeType) else {
            throw VerifiedInstallerDownloadError.httpRejected
        }
        if let contentLength = http.value(forHTTPHeaderField: "Content-Length") {
            guard let declaredLength = Int64(contentLength), declaredLength > 0,
                  declaredLength <= route.maximumBytes else {
                throw VerifiedInstallerDownloadError.sizeRejected
            }
        }
        try validateDirectory(root)
        let initialValues = try staging.resourceValues(forKeys: [.isRegularFileKey, .isSymbolicLinkKey])
        guard initialValues.isRegularFile == true, initialValues.isSymbolicLink != true else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        let handle = stagingHandle
        var byteCount: Int64 = 0
        var buffer = Data()
        do {
            for try await byte in bytes {
                byteCount += 1
                guard byteCount <= route.maximumBytes else { throw VerifiedInstallerDownloadError.sizeRejected }
                buffer.append(byte)
                if buffer.count == 64 * 1024 {
                    try handle.write(contentsOf: buffer)
                    buffer.removeAll(keepingCapacity: true)
                }
            }
            if !buffer.isEmpty { try handle.write(contentsOf: buffer) }
            try handle.synchronize()
            try handle.close()
        } catch {
            try? handle.close()
            if let downloadError = error as? VerifiedInstallerDownloadError { throw downloadError }
            throw VerifiedInstallerDownloadError.httpRejected
        }
        if let contentLength = http.value(forHTTPHeaderField: "Content-Length"),
           Int64(contentLength) != byteCount {
            throw VerifiedInstallerDownloadError.sizeRejected
        }
        let stagedValues = try staging.resourceValues(forKeys: [.isRegularFileKey, .isSymbolicLinkKey, .fileSizeKey])
        guard stagedValues.isRegularFile == true, stagedValues.isSymbolicLink != true,
              stagedValues.fileSize.map(Int64.init) == byteCount else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        guard try isStructurallyValidDiskImage(staging, byteCount: byteCount) else {
            throw VerifiedInstallerDownloadError.invalidDiskImage
        }
        let digest = try sha256(staging)
        guard digest == route.expectedSHA256 else { throw VerifiedInstallerDownloadError.digestMismatch }
        try validateDirectory(root)
        guard staging.deletingLastPathComponent().path == root.path else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        guard !fileManager.fileExists(atPath: destination.path) else {
            throw VerifiedInstallerDownloadError.destinationExists
        }
        do { try fileManager.moveItem(at: staging, to: destination) }
        catch { throw VerifiedInstallerDownloadError.ioFailure(error.localizedDescription) }
        return VerifiedInstallerReceipt(productKey: route.artifact.productKey,
            version: route.artifact.version, fileURL: destination, byteCount: byteCount, sha256: digest)
    }

    private static func isAllowedURL(_ url: URL, hosts: Set<String>) -> Bool {
        guard url.scheme?.lowercased() == "https",
              url.user == nil, url.password == nil,
              url.port == nil || url.port == 443,
              let host = url.host?.lowercased() else { return false }
        return hosts.contains(host)
    }

    private static func validateDirectory(_ directory: URL) throws {
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
        guard values.isDirectory == true, values.isWritable == true, values.isSymbolicLink != true else {
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

    private static func isStructurallyValidDiskImage(_ file: URL, byteCount: Int64) throws -> Bool {
        guard byteCount >= 512 else { return false }
        let handle = try FileHandle(forReadingFrom: file)
        defer { try? handle.close() }
        let trailerOffset = UInt64(byteCount - 512)
        try handle.seek(toOffset: trailerOffset)
        guard let trailer = try handle.read(upToCount: 512), trailer.count == 512,
              trailer.prefix(4) == Data("koly".utf8),
              bigEndianUInt32(trailer, at: 4) == 4,
              bigEndianUInt32(trailer, at: 8) == 512 else { return false }
        let dataOffset = bigEndianUInt64(trailer, at: 24)
        let dataLength = bigEndianUInt64(trailer, at: 32)
        let segmentNumber = bigEndianUInt32(trailer, at: 56)
        let segmentCount = bigEndianUInt32(trailer, at: 60)
        let plistOffset = bigEndianUInt64(trailer, at: 120)
        let plistLength = bigEndianUInt64(trailer, at: 128)
        let footerOffset = UInt64(byteCount - 512)
        guard dataLength > 0, dataOffset <= footerOffset, dataLength <= footerOffset - dataOffset,
              (plistLength == 0 || (plistOffset <= footerOffset && plistLength <= footerOffset - plistOffset)),
              segmentNumber == 1, segmentCount == 1 else { return false }
        return true
    }

    private static func bigEndianUInt32(_ data: Data, at offset: Int) -> UInt32 {
        data[offset..<(offset + 4)].reduce(UInt32.zero) { ($0 << 8) | UInt32($1) }
    }

    private static func bigEndianUInt64(_ data: Data, at offset: Int) -> UInt64 {
        data[offset..<(offset + 8)].reduce(UInt64.zero) { ($0 << 8) | UInt64($1) }
    }

    private static func sha256(_ file: URL) throws -> String {
        let handle = try FileHandle(forReadingFrom: file)
        defer { try? handle.close() }
        var hasher = SHA256()
        while let chunk = try handle.read(upToCount: 1024 * 1024), !chunk.isEmpty {
            hasher.update(data: chunk)
        }
        return hasher.finalize().map { String(format: "%02x", $0) }.joined()
    }
}

private final class InstallerRedirectPolicy: NSObject, URLSessionTaskDelegate, @unchecked Sendable {
    private let allowedHosts: Set<String>
    private let lock = NSLock()
    private var rejectedRedirect = false

    var didRejectRedirect: Bool {
        lock.lock()
        defer { lock.unlock() }
        return rejectedRedirect
    }

    init(allowedHosts: Set<String>) {
        self.allowedHosts = Set(allowedHosts.map { $0.lowercased() })
    }

    func urlSession(_ session: URLSession, task: URLSessionTask,
                    willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest,
                    completionHandler: @escaping (URLRequest?) -> Void) {
        guard let url = request.url,
              url.scheme?.lowercased() == "https",
              url.user == nil, url.password == nil,
              url.port == nil || url.port == 443,
              let host = url.host?.lowercased(), allowedHosts.contains(host) else {
            lock.lock()
            rejectedRedirect = true
            lock.unlock()
            completionHandler(nil)
            return
        }
        completionHandler(request)
    }
}
