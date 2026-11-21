# Task: Plugins sidebar - Tools and Library headers not squashed (CSS only)
Repo /Users/admin/github/aimm, branch plugins-sections (from main, build 2026-11-17.5). Edit standalone/assets/index.html and docs/STATUS.md only.
1. Append at the end of the existing Plugins tab colours CSS block:
#library .inv-sidebar-section-toggle[data-inv-section-toggle="tools"],#library .inv-sidebar-section-toggle[data-inv-section-toggle="library"]{min-height:40px;margin:8px 0 4px;padding:0 10px;font-size:11px}
(Status and Categories headers unchanged. Do not touch JS.)
2. Bump AIMM_BUILD to '2026-11-17.6'.
3. STATUS.md entry: build 2026-11-17.6, Tools and Library sidebar headers now 40px rows with spacing (were 11px, squashed); local branch plugins-sections, not deployed; rollback 2026-11-17.5.
4. One commit on plugins-sections. Do NOT merge, push or deploy.
