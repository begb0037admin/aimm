import AppKit
import SwiftUI

struct CompanionMenuLayout<Buttons: View>: View {
    let status: String
    @ViewBuilder let buttons: Buttons

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(status)
                .font(.callout)
                .foregroundStyle(.secondary)
                .lineLimit(3)
                .fixedSize(horizontal: false, vertical: true)
            Divider()
                .padding(.vertical, 4)
            VStack(spacing: 8) {
                buttons
            }
            .frame(maxWidth: .infinity)
            .controlSize(.regular)
        }
        .frame(width: 248, alignment: .leading)
        .padding(16)
    }
}

struct CompanionWindowLayout<Extra: View>: View {
    let title: String
    let subtitle: String
    let statusText: String
    let statusDot: Color
    let statusLabel: String
    let statusTrailing: String?
    let address: String
    let caption: String
    let captionColor: Color
    let explainer: String
    let extra: Extra

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: 14) {
                    HStack(spacing: 12) {
                        Image(nsImage: NSApp.applicationIconImage)
                            .resizable()
                            .frame(width: 56, height: 56)
                        VStack(alignment: .leading, spacing: 3) {
                            Text(title)
                                .font(.title2.weight(.semibold))
                            Text(subtitle)
                                .foregroundStyle(.secondary)
                        }
                    }

                    Text(statusText)
                        .font(.body)
                        .frame(maxWidth: .infinity, minHeight: 54, alignment: .leading)
                        .padding(12)
                        .background(.quaternary.opacity(0.55), in: RoundedRectangle(cornerRadius: 10))

                    HStack {
                        Circle()
                            .fill(statusDot)
                            .frame(width: 9, height: 9)
                        Text(statusLabel)
                            .foregroundStyle(.secondary)
                        Spacer()
                        if let statusTrailing {
                            Text(statusTrailing)
                                .monospacedDigit()
                                .foregroundStyle(.secondary)
                        }
                    }

                    Text(caption)
                        .font(.caption)
                        .foregroundStyle(captionColor)

                    Text(explainer)
                        .font(.callout)
                        .foregroundStyle(.secondary)
                        .fixedSize(horizontal: false, vertical: true)

                    extra
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.bottom, 14)
            }
            .background(VerticalScrollerHider())

            HStack {
                Text("Listening service: \(address)")
                    .font(.caption.monospaced())
                    .foregroundStyle(.tertiary)
                Spacer()
                Button("Open AIMM") {
                    NSWorkspace.shared.open(URL(string: "https://aimixmasters.com/")!)
                }
                .buttonStyle(.borderedProminent)
            }
            .padding(.top, 14)
        }
        .padding(24)
    }
}

private struct VerticalScrollerHider: NSViewRepresentable {
    func makeNSView(context: Context) -> NSView {
        let view = NSView()
        DispatchQueue.main.async { hideScroller(above: view) }
        return view
    }

    func updateNSView(_ view: NSView, context: Context) {
        DispatchQueue.main.async { hideScroller(above: view) }
    }

    private func hideScroller(above view: NSView) {
        var ancestor = view.superview
        while let current = ancestor {
            if let scrollView = current as? NSScrollView {
                scrollView.hasVerticalScroller = false
                return
            }
            ancestor = current.superview
        }
    }
}
