// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "AIMMReferenceCompanion",
    platforms: [.macOS(.v13)],
    products: [.executable(name: "aimm-reference-companion", targets: ["AIMMReferenceCompanion"])],
    targets: [.executableTarget(name: "AIMMReferenceCompanion")],
    swiftLanguageModes: [.v5]
)
