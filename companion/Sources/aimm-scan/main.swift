import AIMMCompanionCore
import Darwin
import Foundation

let arguments = Array(CommandLine.arguments.dropFirst())
var roots: [URL] = []
var index = 0
while index < arguments.count {
    guard arguments[index] == "--root", index + 1 < arguments.count else {
        fputs("Usage: aimm-scan --root <explicit-directory> [--root <directory> ...]\n", stderr)
        exit(2)
    }
    roots.append(URL(fileURLWithPath: arguments[index + 1], isDirectory: true))
    index += 2
}
guard !roots.isEmpty else {
    fputs("No folder was scanned. Pass one or more explicitly selected --root directories.\n", stderr)
    exit(2)
}
do {
    let records = try PluginScanner().scan(roots: roots)
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
    FileHandle.standardOutput.write(try encoder.encode(records))
    FileHandle.standardOutput.write(Data([0x0A]))
} catch {
    fputs("Scan failed: \(error)\n", stderr)
    exit(1)
}
