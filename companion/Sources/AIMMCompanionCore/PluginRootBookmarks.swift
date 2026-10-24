import Foundation

public struct PluginRootBookmarkResolution {
    public let roots: [URL]
    public let unavailableCount: Int
}

public enum PluginRootBookmarkStore {
    private static let defaultKey = "aimmPluginCustomRootBookmarks_v1"

    @discardableResult
    public static func save(_ roots: [URL], defaults: UserDefaults = .standard) throws -> Int {
        let unique = Array(Set(roots.map(\.standardizedFileURL))).sorted { $0.path < $1.path }
        let bookmarks = try unique.map {
            try $0.bookmarkData(options: .withSecurityScope,
                                includingResourceValuesForKeys: nil, relativeTo: nil)
        }
        defaults.set(bookmarks, forKey: defaultKey)
        return bookmarks.count
    }

    public static func count(defaults: UserDefaults = .standard) -> Int {
        (defaults.array(forKey: defaultKey) as? [Data])?.count ?? 0
    }

    public static func resolve(defaults: UserDefaults = .standard,
                               fileManager: FileManager = .default) -> PluginRootBookmarkResolution {
        let bookmarks = defaults.array(forKey: defaultKey) as? [Data] ?? []
        var roots: [URL] = []
        var refreshed: [Data] = []
        var unavailable = 0
        for bookmark in bookmarks {
            do {
                var stale = false
                let url = try URL(resolvingBookmarkData: bookmark, options: .withSecurityScope,
                                  relativeTo: nil, bookmarkDataIsStale: &stale)
                var isDirectory: ObjCBool = false
                guard fileManager.fileExists(atPath: url.path, isDirectory: &isDirectory), isDirectory.boolValue,
                      (try? url.resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink) != true else {
                    unavailable += 1
                    refreshed.append(bookmark)
                    continue
                }
                roots.append(url)
                if stale {
                    refreshed.append(try url.bookmarkData(options: .withSecurityScope,
                                                          includingResourceValuesForKeys: nil, relativeTo: nil))
                } else {
                    refreshed.append(bookmark)
                }
            } catch {
                unavailable += 1
                refreshed.append(bookmark)
            }
        }
        defaults.set(refreshed, forKey: defaultKey)
        return PluginRootBookmarkResolution(roots: roots, unavailableCount: unavailable)
    }

    public static func forget(defaults: UserDefaults = .standard) {
        defaults.removeObject(forKey: defaultKey)
    }
}
