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

public struct MacInstallerArtifact: Equatable, Sendable {
    public let productKey: String
    public let version: String
    public let url: URL
    public let filename: String

    public init(productKey: String, version: String, url: URL) {
        self.productKey = productKey
        self.version = version
        self.url = url
        self.filename = url.lastPathComponent
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

    /// Extracts direct macOS DMG links only when they appear after a current
    /// FabFilter product/version heading on the official downloads page.
    /// The caller still verifies the host and response again before download.
    public static func parseMacInstallerArtifacts(from html: String) -> [String: MacInstallerArtifact] {
        guard let anchorPattern = try? NSRegularExpression(
            pattern: #"(?is)<a\b[^>]*?href\s*=\s*(?:\"([^\"]*)\"|'([^']*)')[^>]*>(.*?)</a>"#
        ), let tagPattern = try? NSRegularExpression(pattern: #"(?is)<[^>]+>"#),
        let versionPattern = try? NSRegularExpression(pattern: #"(?i)plug-in\s+([0-9]+(?:\.[0-9]+)+)"#) else { return [:] }
        let range = NSRange(html.startIndex..., in: html)
        let anchors = anchorPattern.matches(in: html, range: range).compactMap { match -> (String, String)? in
            guard let labelRange = Range(match.range(at: 3), in: html),
                  let label = Range(match.range(at: match.range(at: 1).location == NSNotFound ? 2 : 1), in: html) else { return nil }
            let href = String(html[label]).trimmingCharacters(in: .whitespacesAndNewlines)
            let text = tagPattern.stringByReplacingMatches(in: String(html[labelRange]),
                range: NSRange(String(html[labelRange]).startIndex..., in: String(html[labelRange])), withTemplate: " ")
                .replacingOccurrences(of: "&nbsp;", with: " ")
                .replacingOccurrences(of: "&amp;", with: "&")
                .replacingOccurrences(of: "&quot;", with: "\"")
                .trimmingCharacters(in: .whitespacesAndNewlines)
            return (href, text)
        }
        guard !anchors.isEmpty else { return [:] }

        let page = URL(string: "https://www.fabfilter.com/download")!
        var artifacts: [String: MacInstallerArtifact] = [:]
        for index in anchors.indices {
            let heading = anchors[index].1
            let prefix = "Download FabFilter "
            guard heading.hasPrefix(prefix),
                  let key = productKey(in: String(heading.dropFirst(prefix.count))),
                  let match = versionPattern.firstMatch(in: heading, range: NSRange(heading.startIndex..., in: heading)),
                  let versionRange = Range(match.range(at: 1), in: heading) else { continue }
            let version = String(heading[versionRange])
            let end = anchors.index(after: index)..<(anchors.endIndex)
            var macURL: URL?
            for next in end {
                if anchors[next].1.hasPrefix(prefix) { break }
                guard anchors[next].1.caseInsensitiveCompare("Download for macOS") == .orderedSame,
                      let resolved = URL(string: anchors[next].0, relativeTo: page)?.absoluteURL,
                      resolved.scheme?.lowercased() == "https",
                      resolved.host?.lowercased() == "cdn-b.fabfilter.com",
                      resolved.user == nil, resolved.password == nil,
                      resolved.query == nil, resolved.fragment == nil,
                      resolved.pathExtension.lowercased() == "dmg" else { continue }
                macURL = resolved
                break
            }
            if let macURL {
                artifacts[key] = MacInstallerArtifact(productKey: key, version: version, url: macURL)
            }
        }
        return artifacts
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

    /// A fixed, vendor-owned destination. The server never supplies the URL.
    public static func vendorSiteURL(for record: PluginRecord) -> URL? {
        guard productKey(for: record) != nil else { return nil }
        return URL(string: "https://www.fabfilter.com/download")
    }

    public static func observation(for record: PluginRecord, recordID: String,
                                   catalog: [String: String], checkedAt: String) -> PluginCheckObservation {
        let installed = record.version
        guard let key = productKey(for: record) else {
            return PluginCheckObservation(recordID: recordID, installedVersion: installed, latestVersion: nil,
                                          result: "manual", sourceType: "manual", checkedAt: checkedAt,
                                          route: "manual", comparisonReason: "manual_check_required")
        }
        guard let latest = catalog[key] else {
            return sourceFailure(for: record, recordID: recordID, checkedAt: checkedAt)
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

public enum VoxengoStatusAdapter {
    private static let numericVersionPattern = #"(?i)\bversion\s+([0-9]+(?:\.[0-9]+){1,5})\s*,"#

    /// Parses product/version pairs from Voxengo's public downloads page.
    /// A row is accepted only when the same product section includes a Mac download.
    public static func parseVersions(from html: String) -> [String: String] {
        guard let sectionPattern = try? NSRegularExpression(
            pattern: #"(?is)<h2\b[^>]*>(.*?)</h2>(.*?)(?=<h2\b|$)"#
        ), let tagPattern = try? NSRegularExpression(pattern: #"(?is)<[^>]+>"#) else { return [:] }
        let fullRange = NSRange(html.startIndex..., in: html)
        var versions: [String: String] = [:]
        for section in sectionPattern.matches(in: html, range: fullRange) {
            guard let titleRange = Range(section.range(at: 1), in: html),
                  let bodyRange = Range(section.range(at: 2), in: html) else { continue }
            let title = plainText(String(html[titleRange]), tagPattern: tagPattern)
            let body = plainText(String(html[bodyRange]), tagPattern: tagPattern)
            guard let key = productKey(in: title),
                  body.localizedCaseInsensitiveContains("Download AU, AAX, VST3 for Mac"),
                  let versionMatch = try? NSRegularExpression(pattern: numericVersionPattern)
                    .firstMatch(in: body, range: NSRange(body.startIndex..., in: body)),
                  let versionRange = Range(versionMatch.range(at: 1), in: body) else { continue }
            versions[key] = String(body[versionRange])
        }
        return versions
    }

    public static func productKey(for record: PluginRecord) -> String? {
        let bundleMatches = record.bundleIdentifier?.localizedLowercase.contains("voxengo") == true
        let name = record.name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard bundleMatches || name.localizedLowercase.hasPrefix("voxengo ") else { return nil }
        return productKey(in: name)
    }

    public static func vendorSiteURL(for record: PluginRecord) -> URL? {
        guard productKey(for: record) != nil else { return nil }
        return URL(string: "https://www.voxengo.com/downloads/")
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
        var name = rawName.trimmingCharacters(in: .whitespacesAndNewlines).localizedLowercase
        guard name.hasPrefix("voxengo ") else { return nil }
        name = String(name.dropFirst("voxengo ".count))
        if name.hasSuffix(" free") { name = String(name.dropLast(" free".count)) }
        return name.isEmpty ? nil : name
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

    private static func plainText(_ html: String, tagPattern: NSRegularExpression) -> String {
        tagPattern.stringByReplacingMatches(in: html, range: NSRange(html.startIndex..., in: html), withTemplate: " ")
            .replacingOccurrences(of: "&nbsp;", with: " ")
            .replacingOccurrences(of: "&amp;", with: "&")
            .replacingOccurrences(of: "&#39;", with: "'")
            .replacingOccurrences(of: "&quot;", with: "\"")
            .replacingOccurrences(of: "&#8212;", with: "—")
            .replacingOccurrences(of: "&#8211;", with: "–")
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

public enum UHeStatusAdapter {
    fileprivate static let releasePages: [String: URL] = [
        "diva": URL(string: "https://u-he.com/products/diva/")!,
        "hive 2": URL(string: "https://u-he.com/products/hive/")!,
        "zebra 3": URL(string: "https://u-he.com/products/plug-ins/zebra3/")!
    ]

    public static func parseVersions(fromPages pages: [String: String]) -> [String: String] {
        var versions: [String: String] = [:]
        for (key, html) in pages {
            guard releasePages[key] != nil, let version = parseVersion(from: html, productKey: key) else { continue }
            versions[key] = version
        }
        return versions
    }

    public static func productKey(for record: PluginRecord) -> String? {
        let bundle = record.bundleIdentifier?.lowercased() ?? ""
        guard bundle.contains("u-he") else { return nil }
        let name = record.name.trimmingCharacters(in: .whitespacesAndNewlines)
            .folding(options: [.diacriticInsensitive, .caseInsensitive], locale: .current)
            .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
            .lowercased()
        if name == "diva" { return "diva" }
        if name == "hive 2" || name == "hive2" { return "hive 2" }
        if name == "zebra 3" || name == "zebra3" { return "zebra 3" }
        return nil
    }

    public static func vendorSiteURL(for record: PluginRecord) -> URL? {
        guard let key = productKey(for: record) else { return nil }
        return releasePages[key]
    }

    public static func vendorName(for record: PluginRecord) -> String? {
        productKey(for: record) == nil ? nil : "u-he"
    }

    public static func observation(for record: PluginRecord, recordID: String,
                                   catalog: [String: String], checkedAt: String) -> PluginCheckObservation {
        let installed = record.version
        guard let key = productKey(for: record) else {
            return PluginCheckObservation(recordID: recordID, installedVersion: installed, latestVersion: nil,
                                          result: "manual", sourceType: "manual", checkedAt: checkedAt,
                                          route: "manual", comparisonReason: "manual_check_required")
        }
        guard let latest = catalog[key] else {
            return sourceFailure(for: record, recordID: recordID, checkedAt: checkedAt)
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

    private static func parseVersion(from html: String, productKey: String) -> String? {
        guard let tagPattern = try? NSRegularExpression(pattern: #"(?is)<[^>]+>"#) else { return nil }
        let text = tagPattern.stringByReplacingMatches(in: html, range: NSRange(html.startIndex..., in: html), withTemplate: " ")
            .replacingOccurrences(of: "&nbsp;", with: " ")
            .replacingOccurrences(of: "&amp;", with: "&")
            .replacingOccurrences(of: "&#39;", with: "'")
        guard text.localizedCaseInsensitiveContains("macOS") else { return nil }
        let pattern: String
        switch productKey {
        case "diva": pattern = #"(?i)\bDiva\s+([0-9]+(?:\.[0-9]+){1,5})\s*\(revision\s+[0-9]+\)"#
        case "hive 2": pattern = #"(?i)\bHive\s*2\s+([0-9]+(?:\.[0-9]+){1,5})\s*\(revision\s+[0-9]+\)"#
        case "zebra 3": pattern = #"(?i)\bVersion\s+([0-9]+(?:\.[0-9]+){1,5})\s*\(rev\.\s*[0-9]+\)"#
        default: return nil
        }
        guard let expression = try? NSRegularExpression(pattern: pattern),
              let match = expression.firstMatch(in: text, range: NSRange(text.startIndex..., in: text)),
              let range = Range(match.range(at: 1), in: text) else { return nil }
        return String(text[range])
    }

    private static func compareNumericVersions(_ installed: String, _ latest: String) -> Int? {
        func components(_ value: String) -> [Int]? {
            let parts = value.split(separator: ".", omittingEmptySubsequences: false)
            let values = parts.compactMap { Int($0) }
            guard !parts.isEmpty, parts.count <= 6,
                  parts.allSatisfy({ !$0.isEmpty && $0.allSatisfy(\.isNumber) }), values.count == parts.count else { return nil }
            return values
        }
        guard let left = components(installed), let right = components(latest) else { return nil }
        for index in 0..<max(left.count, right.count) {
            let lhs = index < left.count ? left[index] : 0
            let rhs = index < right.count ? right[index] : 0
            if lhs != rhs { return lhs < rhs ? -1 : 1 }
        }
        return 0
    }
}

public enum VendorSiteActionAdapter {
    public static func vendorSiteURL(for record: PluginRecord) -> URL? {
        FabFilterStatusAdapter.vendorSiteURL(for: record) ?? VoxengoStatusAdapter.vendorSiteURL(for: record) ?? UHeStatusAdapter.vendorSiteURL(for: record)
    }

    public static func vendorName(for record: PluginRecord) -> String? {
        if FabFilterStatusAdapter.vendorSiteURL(for: record) != nil { return "FabFilter" }
        if VoxengoStatusAdapter.vendorSiteURL(for: record) != nil { return "Voxengo" }
        if UHeStatusAdapter.vendorSiteURL(for: record) != nil { return "u-he" }
        return nil
    }
}

public actor FabFilterPublicCatalogClient {
    public typealias PageFetcher = @Sendable (URLRequest) async throws -> (Data, URLResponse)
    public static let shared = FabFilterPublicCatalogClient()
    private static let page = URL(string: "https://www.fabfilter.com/download")!
    private let pageFetcher: PageFetcher
    private var cachedVersions: [String: String]?
    private var cachedHTML: String?
    private var cacheExpiry: Date?

    public init(pageFetcher customPageFetcher: PageFetcher? = nil) {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.timeoutIntervalForRequest = 10
        configuration.timeoutIntervalForResource = 15
        let delegate = FabFilterRedirectDelegate()
        let session = URLSession(configuration: configuration, delegate: delegate, delegateQueue: nil)
        self.pageFetcher = customPageFetcher ?? { request in try await session.data(for: request) }
    }

    public func latestVersions(now: Date = Date()) async throws -> [String: String] {
        if let cachedVersions, let cacheExpiry, cacheExpiry > now { return cachedVersions }
        let html = try await downloadsPage(now: now)
        let versions = FabFilterStatusAdapter.parseVersions(from: html)
        guard !versions.isEmpty else {
            throw DeviceSyncError.rejected("FabFilter's public version page no longer matches the supported format.")
        }
        cachedVersions = versions
        return versions
    }

    public func currentMacInstaller(for productKey: String, now: Date = Date()) async throws -> MacInstallerArtifact {
        guard productKey == "pro-q 4" else {
            throw DeviceSyncError.rejected("Direct installer routing is not enabled for this FabFilter product.")
        }
        let html = try await downloadsPage(now: now)
        let versions = FabFilterStatusAdapter.parseVersions(from: html)
        let artifacts = FabFilterStatusAdapter.parseMacInstallerArtifacts(from: html)
        guard let version = versions[productKey], let artifact = artifacts[productKey], artifact.version == version else {
            throw DeviceSyncError.rejected("FabFilter's current macOS installer route could not be verified.")
        }
        return artifact
    }

    private func downloadsPage(now: Date) async throws -> String {
        if let cachedHTML, let cacheExpiry, cacheExpiry > now { return cachedHTML }
        let (data, response) = try await pageFetcher(URLRequest(url: Self.page,
            cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10))
        guard let http = response as? HTTPURLResponse, http.statusCode == 200,
              response.url?.scheme == "https", response.url?.host == "www.fabfilter.com",
              response.mimeType?.localizedLowercase == "text/html", data.count <= 2 * 1024 * 1024,
              let html = String(data: data, encoding: .utf8) else {
            throw DeviceSyncError.rejected("FabFilter's public version page returned an unsupported response.")
        }
        cachedHTML = html
        cacheExpiry = now.addingTimeInterval(2 * 60 * 60)
        return html
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

public actor VoxengoPublicCatalogClient {
    public static let shared = VoxengoPublicCatalogClient()
    private static let page = URL(string: "https://www.voxengo.com/downloads/")!
    private let session: URLSession
    private var cachedVersions: [String: String]?
    private var cacheExpiry: Date?

    public init() {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.timeoutIntervalForRequest = 10
        configuration.timeoutIntervalForResource = 15
        self.session = URLSession(configuration: configuration, delegate: VoxengoRedirectDelegate(), delegateQueue: nil)
    }

    public func latestVersions(now: Date = Date()) async throws -> [String: String] {
        if let cachedVersions, let cacheExpiry, cacheExpiry > now { return cachedVersions }
        let (data, response) = try await session.data(for: URLRequest(url: Self.page, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10))
        guard let http = response as? HTTPURLResponse, http.statusCode == 200,
              response.url?.scheme == "https", response.url?.host == "www.voxengo.com",
              response.mimeType?.localizedLowercase == "text/html", data.count <= 2 * 1024 * 1024,
              let html = String(data: data, encoding: .utf8) else {
            throw DeviceSyncError.rejected("Voxengo's public downloads page returned an unsupported response.")
        }
        let versions = VoxengoStatusAdapter.parseVersions(from: html)
        guard !versions.isEmpty else {
            throw DeviceSyncError.rejected("Voxengo's public downloads page no longer matches the supported format.")
        }
        cachedVersions = versions
        cacheExpiry = now.addingTimeInterval(2 * 60 * 60)
        return versions
    }
}

private final class VoxengoRedirectDelegate: NSObject, URLSessionTaskDelegate, @unchecked Sendable {
    func urlSession(_ session: URLSession, task: URLSessionTask,
                    willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest,
                    completionHandler: @escaping (URLRequest?) -> Void) {
        guard request.url?.scheme == "https", request.url?.host == "www.voxengo.com",
              request.url?.port == nil || request.url?.port == 443 else {
            completionHandler(nil)
            return
        }
        completionHandler(request)
    }
}

public actor UHePublicCatalogClient {
    public typealias PageFetcher = @Sendable (URLRequest) async throws -> (Data, URLResponse)
    public static let shared = UHePublicCatalogClient()
    private let pageFetcher: PageFetcher
    private var cachedVersions: [String: String]?
    private var cacheExpiry: Date?

    public init(pageFetcher customPageFetcher: PageFetcher? = nil) {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.timeoutIntervalForRequest = 10
        configuration.timeoutIntervalForResource = 20
        let session = URLSession(configuration: configuration, delegate: UHeRedirectDelegate(), delegateQueue: nil)
        self.pageFetcher = customPageFetcher ?? { request in try await session.data(for: request) }
    }

    public func latestVersions(now: Date = Date()) async throws -> [String: String] {
        if let cachedVersions, let cacheExpiry, cacheExpiry > now { return cachedVersions }
        var versions: [String: String] = [:]
        for (key, url) in UHeStatusAdapter.releasePages {
            do {
                let request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10)
                let (data, response) = try await pageFetcher(request)
                guard let http = response as? HTTPURLResponse, http.statusCode == 200,
                      response.url?.scheme == "https", response.url?.host == "u-he.com",
                      response.mimeType?.localizedLowercase == "text/html", data.count <= 2 * 1024 * 1024,
                      let html = String(data: data, encoding: .utf8),
                      let version = UHeStatusAdapter.parseVersions(fromPages: [key: html])[key] else {
                    continue
                }
                versions[key] = version
            } catch {
                // Keep the failure scoped to this product. Other official pages
                // can still provide a valid observation in the same check.
            }
        }
        guard !versions.isEmpty else {
            throw DeviceSyncError.rejected("u-he's public product pages no longer match the supported format.")
        }
        cachedVersions = versions
        cacheExpiry = now.addingTimeInterval(versions.count == UHeStatusAdapter.releasePages.count ? 2 * 60 * 60 : 5 * 60)
        return versions
    }
}

private final class UHeRedirectDelegate: NSObject, URLSessionTaskDelegate, @unchecked Sendable {
    func urlSession(_ session: URLSession, task: URLSessionTask,
                    willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest,
                    completionHandler: @escaping (URLRequest?) -> Void) {
        guard request.url?.scheme == "https", request.url?.host == "u-he.com",
              request.url?.port == nil || request.url?.port == 443 else {
            completionHandler(nil)
            return
        }
        completionHandler(request)
    }
}
