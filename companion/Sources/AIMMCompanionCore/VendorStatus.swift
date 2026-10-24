import Foundation

public struct PluginCheckObservation: Sendable {
    public let recordID: String
    public let installedVersion: String?
    public let latestVersion: String?
    public let result: String
    public let sourceType: String
    public let checkedAt: String
    public let lastGoodAt: String?
    public let errorCode: String?
    public let route: String?
    public let comparisonReason: String?

    public init(recordID: String, installedVersion: String?, latestVersion: String?, result: String,
                sourceType: String, checkedAt: String, lastGoodAt: String? = nil,
                errorCode: String? = nil, route: String? = nil, comparisonReason: String? = nil) {
        self.recordID = recordID
        self.installedVersion = installedVersion
        self.latestVersion = latestVersion
        self.result = result
        self.sourceType = sourceType
        self.checkedAt = checkedAt
        self.lastGoodAt = lastGoodAt
        self.errorCode = errorCode
        self.route = route
        self.comparisonReason = comparisonReason
    }
}

public enum FabFilterStatusAdapter {
    private static let productStems = [
        "pro-mb", "pro-ds", "pro-g", "pro-q", "pro-c", "pro-l", "pro-r",
        "saturn", "timeless", "volcano", "twin", "simplon", "micro", "one"
    ]

    /// Parses product/version headings from FabFilter's public download page.
    /// Only the page's current downloadable products are included.
    public static func parseVersions(from html: String) -> [String: String] {
        let anchors = matches(in: html, pattern: #"(?is)<a\b[^>]*>(.*?)</a>"#)
        guard let tagPattern = try? NSRegularExpression(pattern: #"(?is)<[^>]+>"#),
              let versionPattern = try? NSRegularExpression(pattern: #"(?i)plug-in\s+([0-9]+(?:\.[0-9]+)+)"#) else { return [:] }
        var versions: [String: String] = [:]
        for anchor in anchors {
            let text = tagPattern.stringByReplacingMatches(
                in: anchor, range: NSRange(anchor.startIndex..., in: anchor), withTemplate: " "
            ).replacingOccurrences(of: "&nbsp;", with: " ")
                .replacingOccurrences(of: "&amp;", with: "&")
                .replacingOccurrences(of: "&#39;", with: "'")
                .replacingOccurrences(of: "&quot;", with: "\"")
                .replacingOccurrences(of: "&#8212;", with: "—")
                .trimmingCharacters(in: .whitespacesAndNewlines)
            guard text.hasPrefix("Download FabFilter "),
                  let key = productKey(in: String(text.dropFirst("Download FabFilter ".count))),
                  let versionRange = versionPattern.firstMatch(in: text, range: NSRange(text.startIndex..., in: text))?.range(at: 1),
                  let range = Range(versionRange, in: text) else { continue }
            versions[key] = String(text[range])
        }
        return versions
    }

    public static func productKey(for record: PluginRecord) -> String? {
        let bundleMatches = record.bundleIdentifier?.localizedLowercase.contains("fabfilter") == true
        var name = record.name.trimmingCharacters(in: .whitespacesAndNewlines)
        if name.localizedLowercase.hasPrefix("fabfilter ") {
            name = String(name.dropFirst("FabFilter ".count))
        } else if !bundleMatches {
            return nil
        }
        return productKey(in: name)
    }

    public static func observation(for record: PluginRecord, recordID: String,
                                   catalog: [String: String], checkedAt: String) -> PluginCheckObservation {
        let installed = record.version
        guard let key = productKey(for: record), let latest = catalog[key] else {
            return PluginCheckObservation(recordID: recordID, installedVersion: installed, latestVersion: nil,
                                          result: "manual", sourceType: "manual", checkedAt: checkedAt,
                                          route: "manual", comparisonReason: "manual_check_required")
        }
        guard let installed, let comparison = compareNumericVersions(installed, latest) else {
            return PluginCheckObservation(recordID: recordID, installedVersion: installed, latestVersion: latest,
                                          result: "manual", sourceType: "public_vendor", checkedAt: checkedAt,
                                          route: "vendor_site", comparisonReason: installed == nil ? "version_missing" : "version_unparseable")
        }
        let isUpdate = comparison < 0
        return PluginCheckObservation(recordID: recordID, installedVersion: installed, latestVersion: latest,
                                      result: isUpdate ? "update" : "up_to_date", sourceType: "public_vendor",
                                      checkedAt: checkedAt, lastGoodAt: checkedAt, route: "vendor_site",
                                      comparisonReason: isUpdate ? "numeric_version_newer" : "numeric_version_current")
    }

    public static func sourceFailure(for record: PluginRecord, recordID: String,
                                     checkedAt: String) -> PluginCheckObservation {
        guard productKey(for: record) != nil else {
            return PluginCheckObservation(recordID: recordID, installedVersion: record.version, latestVersion: nil,
                                          result: "manual", sourceType: "manual", checkedAt: checkedAt,
                                          route: "manual", comparisonReason: "manual_check_required")
        }
        return PluginCheckObservation(recordID: recordID, installedVersion: record.version, latestVersion: nil,
                                      result: "error", sourceType: "public_vendor", checkedAt: checkedAt,
                                      errorCode: "source_unavailable", route: "vendor_site")
    }

    private static func productKey(in rawName: String) -> String? {
        let name = rawName.trimmingCharacters(in: .whitespacesAndNewlines).localizedLowercase
        for stem in productStems {
            guard name.hasPrefix(stem) else { continue }
            let suffix = String(name.dropFirst(stem.count))
            let leadingDigits = suffix.drop(while: { $0 == " " || $0 == "-" })
                .prefix(while: { $0.isNumber })
            let key = leadingDigits.isEmpty ? stem : "\(stem) \(leadingDigits)"
            return key
        }
        return nil
    }

    private static func compareNumericVersions(_ installed: String, _ latest: String) -> Int? {
        func components(_ value: String) -> [Int]? {
            let parts = value.split(separator: ".", omittingEmptySubsequences: false)
            let numbers = parts.compactMap { Int($0) }
            guard !parts.isEmpty, parts.count <= 6,
                  parts.allSatisfy({ !$0.isEmpty && $0.allSatisfy(\.isNumber) }),
                  numbers.count == parts.count else { return nil }
            return numbers
        }
        guard let left = components(installed), let right = components(latest) else { return nil }
        for index in 0..<max(left.count, right.count) {
            let lhs = index < left.count ? left[index] : 0
            let rhs = index < right.count ? right[index] : 0
            if lhs != rhs { return lhs < rhs ? -1 : 1 }
        }
        return 0
    }

    private static func matches(in value: String, pattern: String) -> [String] {
        guard let expression = try? NSRegularExpression(pattern: pattern) else { return [] }
        let range = NSRange(value.startIndex..., in: value)
        return expression.matches(in: value, range: range).compactMap { match in
            guard let capture = Range(match.range(at: 1), in: value) else { return nil }
            return String(value[capture])
        }
    }
}

public actor FabFilterPublicCatalogClient {
    public static let shared = FabFilterPublicCatalogClient()
    private static let page = URL(string: "https://www.fabfilter.com/download")!
    private let session: URLSession
    private var cachedVersions: [String: String]?
    private var cacheExpiry: Date?

    public init() {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.timeoutIntervalForRequest = 10
        configuration.timeoutIntervalForResource = 15
        let delegate = FabFilterRedirectDelegate()
        self.session = URLSession(configuration: configuration, delegate: delegate, delegateQueue: nil)
    }

    public func latestVersions(now: Date = Date()) async throws -> [String: String] {
        if let cachedVersions, let cacheExpiry, cacheExpiry > now { return cachedVersions }
        let (data, response) = try await session.data(for: URLRequest(url: Self.page, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10))
        guard let http = response as? HTTPURLResponse, http.statusCode == 200,
              response.url?.scheme == "https", response.url?.host == "www.fabfilter.com",
              response.mimeType?.localizedLowercase == "text/html", data.count <= 2 * 1024 * 1024,
              let html = String(data: data, encoding: .utf8) else {
            throw DeviceSyncError.rejected("FabFilter's public version page returned an unsupported response.")
        }
        let versions = FabFilterStatusAdapter.parseVersions(from: html)
        guard !versions.isEmpty else {
            throw DeviceSyncError.rejected("FabFilter's public version page no longer matches the supported format.")
        }
        cachedVersions = versions
        cacheExpiry = now.addingTimeInterval(2 * 60 * 60)
        return versions
    }
}

private final class FabFilterRedirectDelegate: NSObject, URLSessionTaskDelegate, @unchecked Sendable {
    func urlSession(_ session: URLSession, task: URLSessionTask,
                    willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest,
                    completionHandler: @escaping (URLRequest?) -> Void) {
        guard request.url?.scheme == "https", request.url?.host == "www.fabfilter.com",
              request.url?.port == nil || request.url?.port == 443 else {
            completionHandler(nil)
            return
        }
        completionHandler(request)
    }
}
