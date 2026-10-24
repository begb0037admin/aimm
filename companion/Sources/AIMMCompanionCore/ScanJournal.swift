import CSQLite
import Foundation

public struct ScanGenerationSummary: Codable, Equatable, Sendable {
    public let id: String
    public let startedAt: String
    public let completedAt: String
    public let rootCount: Int
    public let recordCount: Int

    public init(id: String, startedAt: String, completedAt: String,
                rootCount: Int, recordCount: Int) {
        self.id = id
        self.startedAt = startedAt
        self.completedAt = completedAt
        self.rootCount = rootCount
        self.recordCount = recordCount
    }
}

public enum ScanJournalError: Error, LocalizedError {
    case open(String)
    case execute(String)
    case prepare(String)
    case step(String)
    case missingGeneration

    public var errorDescription: String? {
        switch self {
        case .open(let message): "Could not open local scan journal: \(message)"
        case .execute(let message): "Could not update local scan journal: \(message)"
        case .prepare(let message): "Could not prepare local scan journal query: \(message)"
        case .step(let message): "Could not read local scan journal: \(message)"
        case .missingGeneration: "The requested scan generation is not in the local journal."
        }
    }
}

/// Device-local SQLite history. Paths are deliberately retained only in this file;
/// API inventory payloads are built separately and must never serialize localPath.
public final class ScanJournal {
    private var database: OpaquePointer?
    private let lock = NSRecursiveLock()

    public init(databaseURL: URL) throws {
        try FileManager.default.createDirectory(
            at: databaseURL.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        let result = sqlite3_open_v2(
            databaseURL.path,
            &database,
            SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE | SQLITE_OPEN_FULLMUTEX,
            nil
        )
        guard result == SQLITE_OK else {
            let message = database.map { String(cString: sqlite3_errmsg($0)) } ?? "SQLite returned \(result)"
            if let database { sqlite3_close(database) }
            database = nil
            throw ScanJournalError.open(message)
        }
        sqlite3_busy_timeout(database, 2_000)
        try execute("""
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS scan_generations (
              generation_id TEXT PRIMARY KEY NOT NULL,
              started_at TEXT NOT NULL,
              completed_at TEXT NOT NULL,
              root_count INTEGER NOT NULL CHECK(root_count >= 0),
              record_count INTEGER NOT NULL CHECK(record_count >= 0),
              state TEXT NOT NULL CHECK(state = 'complete')
            );
            CREATE TABLE IF NOT EXISTS plugin_records (
              generation_id TEXT NOT NULL REFERENCES scan_generations(generation_id) ON DELETE CASCADE,
              record_id TEXT NOT NULL,
              name TEXT NOT NULL,
              bundle_identifier TEXT,
              version TEXT,
              format TEXT NOT NULL CHECK(format IN ('AU', 'VST2', 'VST3', 'CLAP')),
              metadata_source TEXT NOT NULL CHECK(metadata_source IN ('infoPlist', 'filenameOnly')),
              local_path TEXT NOT NULL,
              PRIMARY KEY(generation_id, record_id)
            );
            CREATE INDEX IF NOT EXISTS plugin_records_by_generation_name
              ON plugin_records(generation_id, name);
            """)
    }

    deinit {
        if let database { sqlite3_close(database) }
    }

    /// Saves a complete generation atomically. A failed write leaves the previous
    /// complete generation intact and available for display/retry.
    public func saveCompleteGeneration(
        summary: ScanGenerationSummary,
        records: [PluginRecord]
    ) throws {
        lock.lock()
        defer { lock.unlock() }
        guard summary.recordCount == records.count else {
            throw ScanJournalError.execute("record count does not match the generation summary")
        }
        try execute("BEGIN IMMEDIATE")
        do {
            let generation = try prepare("""
                INSERT INTO scan_generations
                  (generation_id, started_at, completed_at, root_count, record_count, state)
                VALUES (?, ?, ?, ?, ?, 'complete')
                """)
            defer { sqlite3_finalize(generation) }
            bind(summary.id, at: 1, to: generation)
            bind(summary.startedAt, at: 2, to: generation)
            bind(summary.completedAt, at: 3, to: generation)
            sqlite3_bind_int64(generation, 4, sqlite3_int64(summary.rootCount))
            sqlite3_bind_int64(generation, 5, sqlite3_int64(summary.recordCount))
            try stepDone(generation)

            let statement = try prepare("""
                INSERT INTO plugin_records
                  (generation_id, record_id, name, bundle_identifier, version,
                   format, metadata_source, local_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """)
            defer { sqlite3_finalize(statement) }
            for record in records {
                sqlite3_reset(statement)
                sqlite3_clear_bindings(statement)
                bind(summary.id, at: 1, to: statement)
                bind(record.id, at: 2, to: statement)
                bind(record.name, at: 3, to: statement)
                bind(record.bundleIdentifier, at: 4, to: statement)
                bind(record.version, at: 5, to: statement)
                bind(record.format.rawValue, at: 6, to: statement)
                bind(record.metadataSource.rawValue, at: 7, to: statement)
                bind(record.localPath, at: 8, to: statement)
                try stepDone(statement)
            }
            try execute("COMMIT")
        } catch {
            try? execute("ROLLBACK")
            throw error
        }
    }

    public func latestCompleteGeneration() throws -> (summary: ScanGenerationSummary, records: [PluginRecord])? {
        lock.lock()
        defer { lock.unlock() }
        let generation = try prepare("""
            SELECT generation_id, started_at, completed_at, root_count, record_count
            FROM scan_generations WHERE state = 'complete'
            ORDER BY completed_at DESC, generation_id DESC LIMIT 1
            """)
        defer { sqlite3_finalize(generation) }
        let result = sqlite3_step(generation)
        if result == SQLITE_DONE { return nil }
        guard result == SQLITE_ROW else { throw ScanJournalError.step(errorMessage) }
        let summary = ScanGenerationSummary(
            id: columnText(generation, 0) ?? "",
            startedAt: columnText(generation, 1) ?? "",
            completedAt: columnText(generation, 2) ?? "",
            rootCount: Int(sqlite3_column_int64(generation, 3)),
            recordCount: Int(sqlite3_column_int64(generation, 4))
        )
        return (summary, try records(for: summary.id))
    }

    public func records(for generationID: String) throws -> [PluginRecord] {
        lock.lock()
        defer { lock.unlock() }
        let statement = try prepare("""
            SELECT record_id, name, bundle_identifier, version, format, metadata_source, local_path
            FROM plugin_records WHERE generation_id = ? ORDER BY name, format, local_path
            """)
        defer { sqlite3_finalize(statement) }
        bind(generationID, at: 1, to: statement)
        var records: [PluginRecord] = []
        while true {
            let result = sqlite3_step(statement)
            if result == SQLITE_DONE { return records }
            guard result == SQLITE_ROW else { throw ScanJournalError.step(errorMessage) }
            guard let format = columnText(statement, 4).flatMap(PluginFormat.init(rawValue:)),
                  let source = columnText(statement, 5).flatMap(MetadataSource.init(rawValue:)),
                  let id = columnText(statement, 0),
                  let name = columnText(statement, 1),
                  let localPath = columnText(statement, 6) else {
                throw ScanJournalError.step("invalid stored plugin record")
            }
            records.append(PluginRecord(
                id: id, name: name, bundleIdentifier: columnText(statement, 2),
                version: columnText(statement, 3), format: format,
                metadataSource: source, localPath: localPath
            ))
        }
    }

    private var errorMessage: String {
        database.map { String(cString: sqlite3_errmsg($0)) } ?? "database is closed"
    }

    private func execute(_ sql: String) throws {
        var error: UnsafeMutablePointer<CChar>?
        guard sqlite3_exec(database, sql, nil, nil, &error) == SQLITE_OK else {
            let message = error.map { String(cString: $0) } ?? errorMessage
            sqlite3_free(error)
            throw ScanJournalError.execute(message)
        }
    }

    private func prepare(_ sql: String) throws -> OpaquePointer {
        var statement: OpaquePointer?
        guard sqlite3_prepare_v2(database, sql, -1, &statement, nil) == SQLITE_OK,
              let statement else { throw ScanJournalError.prepare(errorMessage) }
        return statement
    }

    private func stepDone(_ statement: OpaquePointer?) throws {
        guard sqlite3_step(statement) == SQLITE_DONE else { throw ScanJournalError.step(errorMessage) }
    }

    private func bind(_ value: String?, at index: Int32, to statement: OpaquePointer?) {
        guard let value else { sqlite3_bind_null(statement, index); return }
        sqlite3_bind_text(statement, index, value, -1, unsafeBitCast(-1, to: sqlite3_destructor_type.self))
    }

    private func columnText(_ statement: OpaquePointer?, _ index: Int32) -> String? {
        guard let value = sqlite3_column_text(statement, index) else { return nil }
        return String(cString: value)
    }
}

public extension ScanJournal {
    static func applicationDefault() throws -> ScanJournal {
        let base = try FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        return try ScanJournal(databaseURL: base.appending(path: "AIMM/Library.sqlite3"))
    }
}
