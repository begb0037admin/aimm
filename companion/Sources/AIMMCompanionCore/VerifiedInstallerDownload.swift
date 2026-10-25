import CryptoKit
import CACL
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
    /// POSIX file identity captured at publication. Any future installer-open
    /// flow must re-open with no-follow semantics and compare both fields.
    public let deviceID: UInt64
    public let fileID: UInt64
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
        let (destination, privateName, stagingName, rootFD, stagingDirectoryFD, stagingFD) = try preparePaths(route: route, root: root)
        defer {
            _ = unlinkat(stagingDirectoryFD, stagingName, 0)
            _ = close(stagingFD)
            _ = close(stagingDirectoryFD)
            _ = unlinkat(rootFD, privateName, AT_REMOVEDIR)
            _ = close(rootFD)
        }

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
            redirectRejected: redirectPolicy.didRejectRedirect,
            root: root, destination: destination, stagingName: stagingName,
            rootFD: rootFD, stagingDirectoryFD: stagingDirectoryFD, stagingFD: stagingFD)
    }

    @_spi(Testing)
    public static func saveFixture(route: VerifiedInstallerRoute, into directory: URL,
                                   response: HTTPURLResponse,
                                   bytes: AsyncThrowingStream<UInt8, Error>,
                                   redirectRejected: Bool = false,
                                   beforeResponse: (@Sendable () -> Void)? = nil,
                                   fileManager: FileManager = .default) async throws -> VerifiedInstallerReceipt {
        let root = canonicalDirectory(directory)
        let (destination, privateName, stagingName, rootFD, stagingDirectoryFD, stagingFD) = try preparePaths(route: route, root: root)
        defer {
            _ = unlinkat(stagingDirectoryFD, stagingName, 0)
            _ = close(stagingFD)
            _ = close(stagingDirectoryFD)
            _ = unlinkat(rootFD, privateName, AT_REMOVEDIR)
            _ = close(rootFD)
        }
        beforeResponse?()
        return try await saveResponse(route: route, response: response, bytes: bytes,
            redirectRejected: redirectRejected, root: root, destination: destination,
            stagingName: stagingName, rootFD: rootFD,
            stagingDirectoryFD: stagingDirectoryFD, stagingFD: stagingFD)
    }

    @_spi(Testing)
    public static func allowsRedirectForTesting(to url: URL, allowedHosts: Set<String>) -> Bool {
        isAllowedURL(url, hosts: Set(allowedHosts.map { $0.lowercased() }))
    }

    @_spi(Testing)
    public static func redirectDelegateRejectsBeforeSecondRequestForTesting() async -> Bool {
        InstallerRedirectProbeURLProtocol.reset()
        let policy = InstallerRedirectPolicy(allowedHosts: ["vendor.example"])
        let configuration = URLSessionConfiguration.ephemeral
        configuration.timeoutIntervalForRequest = 5
        configuration.timeoutIntervalForResource = 5
        configuration.protocolClasses = [InstallerRedirectProbeURLProtocol.self]
        let session = URLSession(configuration: configuration, delegate: policy, delegateQueue: nil)
        defer { session.invalidateAndCancel() }
        do {
            _ = try await session.data(from: URL(string: "https://vendor.example/start.dmg")!)
        } catch { }
        return policy.didRejectRedirect && InstallerRedirectProbeURLProtocol.requestedHosts == ["vendor.example"]
    }

    private static func preparePaths(route: VerifiedInstallerRoute, root: URL) throws -> (URL, String, String, Int32, Int32, Int32) {
        try validateDirectory(root)
        let rootFD = try openDirectoryChain(root)
        let name = route.artifact.filename
        guard !name.isEmpty,
              name != ".", name != "..", !name.contains("/"), !name.contains("\\") else {
            _ = close(rootFD)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        let destination = root.appending(path: route.artifact.filename).standardizedFileURL
        guard destination.deletingLastPathComponent().path == root.path else {
            _ = close(rootFD)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        var destinationInfo = stat()
        if fstatat(rootFD, name, &destinationInfo, AT_SYMLINK_NOFOLLOW) == 0 {
            _ = close(rootFD)
            throw VerifiedInstallerDownloadError.destinationExists
        }
        guard errno == ENOENT else { _ = close(rootFD); throw VerifiedInstallerDownloadError.unsafeDestination }
        let privateName = ".aimm-installer-stage-\(UUID().uuidString)"
        guard mkdirat(rootFD, privateName, S_IRWXU) == 0 else {
            _ = close(rootFD)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        let stagingDirectoryFD = openat(rootFD, privateName, O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC)
        guard stagingDirectoryFD >= 0 else {
            _ = unlinkat(rootFD, privateName, AT_REMOVEDIR)
            _ = close(rootFD)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        var directoryInfo = stat()
        guard fstat(stagingDirectoryFD, &directoryInfo) == 0,
              (directoryInfo.st_mode & S_IFMT) == S_IFDIR,
              directoryInfo.st_uid == getuid(),
              (directoryInfo.st_mode & 0o700) == 0o700,
              (directoryInfo.st_mode & 0o077) == 0 else {
            _ = close(stagingDirectoryFD)
            _ = unlinkat(rootFD, privateName, AT_REMOVEDIR)
            _ = close(rootFD)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        let stagingName = ".partial-\(UUID().uuidString)"
        let descriptor = openat(stagingDirectoryFD, stagingName,
            O_RDWR | O_CREAT | O_EXCL | O_NOFOLLOW | O_CLOEXEC, S_IRUSR | S_IWUSR)
        guard descriptor >= 0 else {
            _ = close(stagingDirectoryFD)
            _ = unlinkat(rootFD, privateName, AT_REMOVEDIR)
            _ = close(rootFD)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        return (destination, privateName, stagingName, rootFD, stagingDirectoryFD, descriptor)
    }

    private static func saveResponse<S: AsyncSequence>(route: VerifiedInstallerRoute,
        response: URLResponse, bytes: S, redirectRejected: Bool, root: URL,
        destination: URL, stagingName: String, rootFD: Int32,
        stagingDirectoryFD: Int32, stagingFD: Int32) async throws -> VerifiedInstallerReceipt
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
        var initialInfo = stat()
        guard fstat(stagingFD, &initialInfo) == 0, (initialInfo.st_mode & S_IFMT) == S_IFREG else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        var byteCount: Int64 = 0
        var buffer = Data()
        do {
            for try await byte in bytes {
                byteCount += 1
                guard byteCount <= route.maximumBytes else { throw VerifiedInstallerDownloadError.sizeRejected }
                buffer.append(byte)
                if buffer.count == 64 * 1024 {
                    try writeAll(buffer, to: stagingFD)
                    buffer.removeAll(keepingCapacity: true)
                }
            }
            if !buffer.isEmpty { try writeAll(buffer, to: stagingFD) }
            guard fsync(stagingFD) == 0 else { throw posixError() }
        } catch {
            if let downloadError = error as? VerifiedInstallerDownloadError { throw downloadError }
            throw VerifiedInstallerDownloadError.httpRejected
        }
        if let contentLength = http.value(forHTTPHeaderField: "Content-Length"),
           Int64(contentLength) != byteCount {
            throw VerifiedInstallerDownloadError.sizeRejected
        }
        var stagedInfo = stat()
        guard fstat(stagingFD, &stagedInfo) == 0, (stagedInfo.st_mode & S_IFMT) == S_IFREG,
              stagedInfo.st_size == byteCount else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        guard try isStructurallyValidDiskImage(stagingFD, byteCount: byteCount) else {
            throw VerifiedInstallerDownloadError.invalidDiskImage
        }
        let digest = try sha256(stagingFD)
        guard digest == route.expectedSHA256 else { throw VerifiedInstallerDownloadError.digestMismatch }
        var finalInfo = stat()
        if fstat(stagingFD, &finalInfo) != 0 || finalInfo.st_dev != initialInfo.st_dev || finalInfo.st_ino != initialInfo.st_ino {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        var stagedPathInfo = stat()
        guard fstatat(stagingDirectoryFD, stagingName, &stagedPathInfo, AT_SYMLINK_NOFOLLOW) == 0,
              stagedPathInfo.st_dev == finalInfo.st_dev, stagedPathInfo.st_ino == finalInfo.st_ino,
              (stagedPathInfo.st_mode & S_IFMT) == S_IFREG else {
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        guard renameNoReplace(fromFD: stagingDirectoryFD, from: stagingName,
                              toFD: rootFD, to: route.artifact.filename) else {
            if errno == EEXIST { throw VerifiedInstallerDownloadError.destinationExists }
            throw VerifiedInstallerDownloadError.ioFailure(String(cString: strerror(errno)))
        }
        guard pathStillNamesPublishedFile(root: root, rootFD: rootFD,
                                          filename: route.artifact.filename, expected: finalInfo) else {
            removePublishedFileIfMatching(rootFD: rootFD, filename: route.artifact.filename, expected: finalInfo)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        return VerifiedInstallerReceipt(productKey: route.artifact.productKey,
            version: route.artifact.version, fileURL: destination, byteCount: byteCount,
            sha256: digest, deviceID: UInt64(finalInfo.st_dev), fileID: UInt64(finalInfo.st_ino))
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

    private static func isStructurallyValidDiskImage(_ descriptor: Int32, byteCount: Int64) throws -> Bool {
        guard byteCount >= 512 else { return false }
        let trailerOffset = UInt64(byteCount - 512)
        let trailer = try readExactly(descriptor, offset: trailerOffset, count: 512)
        guard trailer.count == 512,
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

    private static func sha256(_ descriptor: Int32) throws -> String {
        var hasher = SHA256()
        var offset: off_t = 0
        var buffer = [UInt8](repeating: 0, count: 1024 * 1024)
        while true {
            let count = pread(descriptor, &buffer, buffer.count, offset)
            if count == 0 { break }
            guard count > 0 else { throw posixError() }
            hasher.update(data: Data(buffer.prefix(count)))
            offset += off_t(count)
        }
        return hasher.finalize().map { String(format: "%02x", $0) }.joined()
    }

    private static func openDirectoryChain(_ directory: URL) throws -> Int32 {
        var current = open("/", O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC)
        guard current >= 0 else { throw VerifiedInstallerDownloadError.unsafeDestination }
        for component in directory.pathComponents.dropFirst() {
            let next = openat(current, component, O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC)
            guard next >= 0 else { _ = close(current); throw VerifiedInstallerDownloadError.unsafeDestination }
            _ = close(current)
            current = next
        }
        var info = stat()
        guard fstat(current, &info) == 0,
              (info.st_mode & S_IFMT) == S_IFDIR,
              info.st_uid == getuid(),
              (info.st_mode & 0o200) != 0,
              (info.st_mode & 0o022) == 0,
              !hasSharedWriteACL(current) else {
            _ = close(current)
            throw VerifiedInstallerDownloadError.unsafeDestination
        }
        return current
    }

    private static func hasSharedWriteACL(_ descriptor: Int32) -> Bool {
        #if canImport(Darwin)
        guard let acl = acl_get_fd_np(descriptor, ACL_TYPE_EXTENDED) else {
            return errno != ENOENT
        }
        defer { _ = acl_free(UnsafeMutableRawPointer(acl)) }
        var textLength: ssize_t = 0
        guard let text = acl_to_text(acl, &textLength) else { return true }
        defer { _ = acl_free(UnsafeMutableRawPointer(text)) }
        let entries = String(cString: text).split(separator: "\n").dropFirst()
        // Refuse any extended ACL rather than trying to interpret platform
        // specific allow/deny inheritance rules. This is deliberately strict.
        return !entries.isEmpty
        #else
        return false
        #endif
    }

    private static func writeAll(_ data: Data, to descriptor: Int32) throws {
        try data.withUnsafeBytes { raw in
            guard let base = raw.baseAddress else { return }
            var offset = 0
            while offset < raw.count {
                let written = write(descriptor, base.advanced(by: offset), raw.count - offset)
                if written < 0 && errno == EINTR { continue }
                guard written > 0 else { throw posixError() }
                offset += written
            }
        }
    }

    private static func readExactly(_ descriptor: Int32, offset: UInt64, count: Int) throws -> Data {
        var bytes = [UInt8](repeating: 0, count: count)
        var total = 0
        while total < count {
            let readCount = bytes.withUnsafeMutableBytes { raw in
                pread(descriptor, raw.baseAddress!.advanced(by: total), count - total, off_t(offset) + off_t(total))
            }
            if readCount < 0 && errno == EINTR { continue }
            guard readCount > 0 else { if readCount == 0 { break }; throw posixError() }
            total += readCount
        }
        return Data(bytes.prefix(total))
    }

    private static func posixError() -> Error {
        VerifiedInstallerDownloadError.ioFailure(String(cString: strerror(errno)))
    }

    private static func renameNoReplace(fromFD: Int32, from: String, toFD: Int32, to: String) -> Bool {
        #if canImport(Darwin)
        return renameatx_np(fromFD, from, toFD, to, UInt32(RENAME_EXCL)) == 0
        #else
        return renameat2(fromFD, from, toFD, to, UInt32(RENAME_NOREPLACE)) == 0
        #endif
    }

    private static func pathStillNamesPublishedFile(root: URL, rootFD: Int32,
        filename: String, expected: stat) -> Bool {
        let pathFD: Int32
        do { pathFD = try openDirectoryChain(root) }
        catch { return false }
        defer { _ = close(pathFD) }
        var pinnedDirectory = stat()
        var pathDirectory = stat()
        guard fstat(rootFD, &pinnedDirectory) == 0,
              fstat(pathFD, &pathDirectory) == 0,
              pinnedDirectory.st_dev == pathDirectory.st_dev,
              pinnedDirectory.st_ino == pathDirectory.st_ino else { return false }
        var pinnedFile = stat()
        var pathFile = stat()
        guard fstatat(rootFD, filename, &pinnedFile, AT_SYMLINK_NOFOLLOW) == 0,
              fstatat(pathFD, filename, &pathFile, AT_SYMLINK_NOFOLLOW) == 0 else { return false }
        return pinnedFile.st_dev == expected.st_dev && pinnedFile.st_ino == expected.st_ino &&
            pathFile.st_dev == expected.st_dev && pathFile.st_ino == expected.st_ino &&
            (pathFile.st_mode & S_IFMT) == S_IFREG
    }

    private static func removePublishedFileIfMatching(rootFD: Int32, filename: String, expected: stat) {
        var current = stat()
        guard fstatat(rootFD, filename, &current, AT_SYMLINK_NOFOLLOW) == 0,
              current.st_dev == expected.st_dev, current.st_ino == expected.st_ino else { return }
        _ = unlinkat(rootFD, filename, 0)
    }
}

/// Intercepts requests before networking and asks URLSession to follow a hostile
/// redirect. The test passes only when the installed delegate rejects it before
/// a request for the hostile host reaches this protocol.
private final class InstallerRedirectProbeURLProtocol: URLProtocol, @unchecked Sendable {
    private static let lock = NSLock()
    nonisolated(unsafe) private static var hosts: [String] = []
    static var requestedHosts: [String] { lock.lock(); defer { lock.unlock() }; return hosts }
    static func reset() { lock.lock(); hosts = []; lock.unlock() }

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func startLoading() {
        guard let host = request.url?.host?.lowercased() else { return }
        Self.lock.lock(); Self.hosts.append(host); Self.lock.unlock()
        guard host == "vendor.example", let target = URL(string: "https://attacker.invalid/collect") else {
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: nil)!
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocolDidFinishLoading(self)
            return
        }
        let response = HTTPURLResponse(url: request.url!, statusCode: 302, httpVersion: "HTTP/1.1",
                                       headerFields: ["Location": target.absoluteString])!
        client?.urlProtocol(self, wasRedirectedTo: URLRequest(url: target), redirectResponse: response)
    }
    override func stopLoading() { }
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
