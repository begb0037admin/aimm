// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "AIMMCompanion",
    platforms: [.macOS(.v13)],
    products: [
        .library(name: "AIMMCompanionCore", targets: ["AIMMCompanionCore"]),
        .executable(name: "aimm-scan", targets: ["aimm-scan"])
    ],
    targets: [
        .target(name: "AIMMCompanionCore"),
        .executableTarget(name: "aimm-scan", dependencies: ["AIMMCompanionCore"])
    ]
)
