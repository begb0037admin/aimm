import re
p='fixsite/index.html';s=open(p,encoding='utf8').read()
def rep(a,b,count=1):
    global s
    assert a in s,('MISSING',a[:80]);s=s.replace(a,b,count)
# PLUGINS sidebar: neutral
rep('#plugins #invSidebar .inv-sidebar-card{--section-colour:#36a8ed;position:relative;margin:0 0 12px;background:var(--pv-neutral-bg);border:1px solid var(--section-colour)!important;border-radius:12px;overflow:hidden}','#plugins #invSidebar .inv-sidebar-card{position:relative;margin:0 0 12px;background:#1b1d20;border:1px solid #2c3034;border-radius:10px;overflow:hidden}')
s=re.sub(r'#plugins #invSidebar \.inv-sidebar-card(\[data-inv-section="[a-z-]+"\]|\.is-current)\{[^}]*\}\n','',s)
rep('border-radius:0;color:var(--pv-black)!important;font:500 var(--aimm-section-title-size)','border:0;border-radius:0;background:transparent;color:var(--aimm-page-heading-color);font:500 var(--aimm-section-title-size)')
rep('#plugins #invSidebar .inv-sidebar-section-toggle:focus-visible,','#plugins #invSidebar .inv-sidebar-section-toggle[aria-expanded="true"]{border-bottom:1px solid #2c3034}\n#plugins #invSidebar .inv-sidebar-section-toggle:focus-visible,')
rep('text-align:center;color:#8993a2;font:700 calc(15px','text-align:center;color:#9aa0a6;font:700 calc(15px')
s=re.sub(r'#plugins #invSidebar \[data-inv-scope="[^\]]+"\] \.inv-side-count[^{]*\{color:var\(--st-[a-z]+\)!important\}\n','',s)
rep('#plugins #invSidebar .inv-side-button:hover:not(.active):not(:disabled),\n#plugins #invSidebar .inv-side-button:focus-visible:not(.active):not(:disabled){color:var(--pv-black)!important}','#plugins #invSidebar .inv-side-button:hover:not(.active):not(:disabled),\n#plugins #invSidebar .inv-side-button:focus-visible:not(.active):not(:disabled){background:#2dd4bf;color:#0b0d10}')
# 2981 hover white removal for surfaced controls
rep(':is(.inv-btn,.inv-format,.inv-action,.inv-more,.inv-side-button,.inv-vst-option,.inv-tag-filter-option,.inv-fav,.inv-product-actions,.inv-vendor-toggle,.inv-view-menu>summary):hover:not(:disabled)',':is(.inv-action,.inv-more,.inv-vst-option,.inv-tag-filter-option,.inv-fav,.inv-product-actions,.inv-vendor-toggle):hover:not(:disabled)')
# SETTINGS
rep('#settings :is(.settings-nav a,.settings-guide,.settings-section,#aimm-account-preview){background:var(--g1)!important}','#settings :is(.settings-nav a,.settings-guide,.settings-section,#aimm-account-preview){background:var(--g1)}')
rep(':is(:hover,:focus-visible):not(:disabled),\n#settings .settings-guide summary:is(:hover,:focus-visible){color:#fff!important}',':is(:hover,:focus-visible):not(:disabled){color:var(--aimm-hover-ink)}\n#settings .settings-guide summary:is(:hover,:focus-visible){color:#fff!important}')
rep('#settings :is(#elKeyClear,#hopeUsageSttTokenClear,#rtKeyClear,#settingsReset #resetBtn):hover{color:#fff!important}','#settings :is(#elKeyClear,#hopeUsageSttTokenClear,#rtKeyClear,#settingsReset #resetBtn):hover{color:var(--aimm-hover-ink)}')
rep('#settings :is(#elKeySave,#hopeUsageSttTokenSave,#rtKeySave):is(:hover,:focus-visible){color:#fff!important}','#settings :is(#elKeySave,#hopeUsageSttTokenSave,#rtKeySave):is(:hover,:focus-visible){color:var(--aimm-hover-ink)}')
# MIXBUS
rep('#mixbus .chain-item.selected{background:#20262b;box-shadow:inset 0 0 0 2px var(--mb-teal)}','#mixbus .chain-item.selected,#mixbus .chain-item.selected:hover{background:var(--mb-teal);box-shadow:none;outline:0}')
rep('#mixbus .bus-col h4 .clear-bus-btn:hover,#mixbus .bus-col h4 .clear-bus-btn:focus-visible{color:#000;opacity:1}','#mixbus .bus-col h4 .clear-bus-btn:hover,#mixbus .bus-col h4 .clear-bus-btn:focus-visible{background:var(--mb-teal);color:var(--mb-ink);opacity:1}')
rep('#mixbus .chain-list>.chain-add:hover,#mixbus .chain-list>.chain-add:focus-visible{color:#fff}','#mixbus .chain-list>.chain-add:hover,#mixbus .chain-list>.chain-add:focus-visible{background:var(--mb-teal);color:var(--mb-ink)}')
rep('#mixbus .chain-list>.chain-add:hover .add-icon,#mixbus .chain-list>.chain-add:focus-visible .add-icon{color:#fff}','#mixbus .chain-list>.chain-add:hover .add-icon,#mixbus .chain-list>.chain-add:focus-visible .add-icon{color:var(--mb-ink)}')
rep('#mixbus .chain-panel-edit:hover,#mixbus .chain-panel-edit:focus-visible{color:#000}','#mixbus .chain-panel-edit:hover,#mixbus .chain-panel-edit:focus-visible{background:var(--mb-teal);color:var(--mb-ink)}')
rep('#mixbus .chain-edit-actions button:hover,#mixbus .chain-edit-actions button:focus-visible{color:#000}','#mixbus .chain-edit-actions button:hover,#mixbus .chain-edit-actions button:focus-visible{background:var(--mb-teal);color:var(--mb-ink)}')
rep('#mixbus .chain-toolbar button:hover,#mixbus .chain-toolbar button:focus-visible{color:#000}','#mixbus .chain-toolbar button:hover,#mixbus .chain-toolbar button:focus-visible{background:var(--mb-teal);color:var(--mb-ink)}')
rep('#mixbus .replacement-option[aria-checked="true"]:focus-visible{color:#000}','#mixbus .replacement-option[aria-checked="true"]:focus-visible{background:var(--mb-teal);box-shadow:none;color:var(--mb-ink)}')
# LIBRARY .tx joins shared hover
s=s.replace(',.chain-add,.empty-add,.aichat-quick-prompt',',.chain-add,.empty-add,#library .tx,.aichat-quick-prompt')
open(p,'w',encoding='utf8').write(s)
print('ok')
