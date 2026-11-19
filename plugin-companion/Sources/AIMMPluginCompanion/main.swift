import Foundation

if CommandLine.arguments.dropFirst().contains("--scan-json") {
    let inventory = PluginScanner.scan()
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.sortedKeys]
    if let data = try? encoder.encode(inventory), let json = String(data: data, encoding: .utf8) {
        print(json)
    } else {
        fputs("Could not encode inventory\n", stderr)
        exit(1)
    }
} else {
    AIMMPluginCompanionApp.main()
}
