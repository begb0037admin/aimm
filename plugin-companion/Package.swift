// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "AIMMPluginCompanion",
    platforms: [.macOS(.v13)],
    products: [.executable(name: "aimm-plugin-companion", targets: ["AIMMPluginCompanion"])],
    targets: [
        .executableTarget(name: "AIMMPluginCompanion"),
        .testTarget(name: "AIMMPluginCompanionTests", dependencies: ["AIMMPluginCompanion"],
                    swiftSettings: [.unsafeFlags(["-F", "/Library/Developer/CommandLineTools/Library/Developer/Frameworks"])],
                    linkerSettings: [.unsafeFlags(["-F", "/Library/Developer/CommandLineTools/Library/Developer/Frameworks", "-Xlinker", "-rpath", "-Xlinker", "/Library/Developer/CommandLineTools/Library/Developer/Frameworks", "-Xlinker", "-rpath", "-Xlinker", "/Library/Developer/CommandLineTools/Library/Developer/usr/lib"])])
    ],
    swiftLanguageModes: [.v5]
)
