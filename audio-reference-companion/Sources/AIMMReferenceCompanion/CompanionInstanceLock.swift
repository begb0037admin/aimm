import Darwin
import Foundation

/// Keeps the local audio bridge single-owner even when users launch different
/// copies of the app bundle from Finder, Downloads, or the build folder.
final class CompanionInstanceLock {
    static let shared = CompanionInstanceLock()

    let isPrimary: Bool
    private let descriptor: Int32

    private init() {
        let support = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            .appendingPathComponent("AIMM", isDirectory: true)
        do {
            try FileManager.default.createDirectory(at: support, withIntermediateDirectories: true)
        } catch {
            descriptor = -1
            isPrimary = false
            return
        }

        let lockURL = support.appendingPathComponent("audio-reference-companion.lock")
        let fd = Darwin.open(lockURL.path, O_CREAT | O_RDWR, S_IRUSR | S_IWUSR)
        guard fd >= 0 else {
            descriptor = -1
            isPrimary = false
            return
        }
        if flock(fd, LOCK_EX | LOCK_NB) == 0 {
            descriptor = fd
            isPrimary = true
        } else {
            Darwin.close(fd)
            descriptor = -1
            isPrimary = false
        }
    }

    deinit {
        if descriptor >= 0 {
            flock(descriptor, LOCK_UN)
            Darwin.close(descriptor)
        }
    }
}
