# BRIEF — Plugin Companion window must LOOK IDENTICAL to Audio Reference window (worktree /Users/admin/aimm-wt-window, branch companion-window)
Kevin: "they should look identical in terms of layout, size etc. Audio icon is smaller than plugin." Rebuild plugin-companion WindowView.swift as a structural copy of audio-reference-companion/Sources/AIMMReferenceCompanion/App.swift `CompanionWindow` (read it; copy values literally):
- Root: VStack(alignment:.leading, spacing:14), .padding(24). Window .frame(minWidth:420,minHeight:300), NO defaultSize override (let content size it like audio), still freely resizable.
- Header HStack(spacing:12): icon 34pt (audio uses font size 34). Use the plug icon at exactly 34x34 pt (circle crop to match audio's circle.fill treatment; purple plug on purple circle, or the existing AppIcon cropped to a circle), VStack(spacing:3): Text title .font(.title2.weight(.semibold)) and subtitle .foregroundStyle(.secondary).
- Status text: .font(.body), .frame(maxWidth:.infinity, minHeight:54, alignment:.leading), .padding(12), .background(.quaternary.opacity(0.55), in: RoundedRectangle(cornerRadius:10)). (Currently the box background is missing — fix.)
- Status row: HStack with 9x9 Circle (green/amber), Text .foregroundStyle(.secondary), Spacer.
- Address line: .font(.caption), .foregroundStyle(.secondary).
- Explainer: .font(.callout), .foregroundStyle(.secondary), .fixedSize(horizontal:false, vertical:true) (the paragraph(s) as before).
- Count chips and Scan now / Show Unused folder buttons: keep, between explainer and footer, using system default styles (.font(.callout)/.bordered) so they feel native; chips small.
- Spacer(minLength:0) then footer HStack: Text .font(.caption.monospaced()) .foregroundStyle(.tertiary) left, Spacer, Button("Open AIMM") with .buttonStyle(.borderedProminent) (blue), right.
- Do NOT wrap in a ScrollView if it changes alignment; at minimum size it may clip, that matches audio. If you need scrolling, only apply when the window is smaller than content, never at default size.
- Window default size: verify by build + screenshot that default size is close to the audio window (about 640 wide). Compare side by side: launch both, `screencapture -x -R` them or full screen, open the PNG, and report visible differences you fixed.
Then: swift build; `.build/debug/aimm-plugin-companion --self-test` (all PASS); quit running companion with osascript, `sh build-app.sh`; relaunch with `open -a "$HOME/Applications/AIMM Plugin Companion.app"`; commit on branch, no push. Report.
