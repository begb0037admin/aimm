// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "AIMMCompanion",
    platforms: [.macOS(.v13)],
    products: [
        .library(name: "AIMMCompanionCore", targets: ["AIMMCompanionCore"]),
        .executable(name: "aimm-scan", targets: ["aimm-scan"]),
        .executable(name: "aimm-companion", targets: ["aimm-companion"]),
        .executable(name: "aimm-journal-check", targets: ["aimm-journal-check"])
    ],
    targets: [
        .systemLibrary(name: "CSQLite", path: "Sources/CSQLite"),
        .systemLibrary(name: "CACL", path: "Sources/CACL"),
        .target(name: "AIMMCompanionCore", dependencies: ["CSQLite", "CACL"]),
        .executableTarget(name: "aimm-scan", dependencies: ["AIMMCompanionCore"]),
        .executableTarget(name: "aimm-companion", dependencies: ["AIMMCompanionCore"]),
        .executableTarget(name: "aimm-journal-check", dependencies: ["AIMMCompanionCore"])
    ]
)
