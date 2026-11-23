# Mix Check type measurements

Measured in headless Chrome on the real page served from `standalone/assets/index.html` at 1900px, before the Library and MixBus changes. Values are computed styles at default text scale. The `mc-core-label` result is the reference for ordinary labels; Mix Check also uses 700 for a few specific controls and large measurement figures.

| Role / selector | Family | Size | Weight | Colour | Letter spacing |
|---|---|---:|---:|---|---|
| Section title `#mcSpecsTitle` | Inter, -apple-system, sans-serif | 28px | 700 | rgb(241, 244, 248) | -0.98px |
| Small label `.mc-core-label` | -apple-system, system-ui, Segoe UI, Roboto, sans-serif | 13px | 500 | rgb(156, 163, 175) | normal |
| Secondary label `.mc-measure-label` | same system stack | 13px | 500 | rgb(156, 163, 175) | normal |
| Unit `.unit-sub` | same system stack | 12px | 500 | rgb(156, 163, 175) | normal |
| Source button `.mc-specs-source button` | Inter, -apple-system, sans-serif | 13px | 700 | rgb(9, 7, 13) | normal |
| Secondary text `.mc-saved-targets-active` | system stack | 14px | 500 | rgb(180, 192, 207) | normal |
| Small heading `.mc-saved-targets-label` | system stack | 15px | 700 | rgb(104, 211, 230) | normal |
| Main value `.mc-core-value` | -apple-system, system-ui, Helvetica Neue, Arial, sans-serif | 26px | 700 | rgb(45, 212, 191) | normal |
| Detail value `.mc-measure-value` | same value stack | 26px | 700 | rgb(243, 244, 246) | normal |
| Collapsible label `.mc-more-measurements summary` | system stack | 13px | 600 | rgb(156, 163, 175) | normal |

Mix Check's large measurement values are deliberately bold. Library and MixBus have no equivalent meter display, so their ordinary row values use the 500 weight of Mix Check's labels and secondary text. The summary above was hidden in the default view; its computed style is recorded for comparison only.
