# Plugins sidebar - heading options (mockup only, app files untouched)

Open `options.html` (interactive). PNGs: `all-options.png`, `opt-a.png`, `opt-b.png`, `opt-c.png`.

Three levels in every option (Kevin's latest ask)
1. Heading = 17px / 800, section colour. The section you are in is filled/glowing in its colour.
2. Sub-group (e.g. Ownership: Owned / Stock Plugins / Not installed) = 12.5px / 700 label in the section colour with a small square marker and a rule, items indented under a coloured line. Favorites stays a plain item outside the sub-group.
3. Item = 13px / 500 white-grey; selected item = teal.
Motion: chevron rotates, list slides, heading glow eases in, the active marker breathes gently (brightness only). All off under prefers-reduced-motion.
Open question: the relayed note put Owned/Stock/Not installed under VIDEO CHAIN PICKS, but in the live app they sit under Library, so the mockup shows them as a sub-group in Library. Moving it is a data change only.

Shared by all three
- Headings 16-17px, weight 800, sans-serif (today: 10px grey mono caps). Items 13px / 500. Headings are now plainly bigger and bolder.
- Each section has its own colour from the existing palette: Status blue #36a8ed, Tools amber #e8b45a, Library purple #b970ff, Video Chain Picks coral #ee7777, Categories green #42c995.
- The section you are working in lights up its heading in its colour. The selected item underneath stays teal (the app's existing selected look), so the two are always different colours.
- Chevron on every heading rotates smoothly; the list slides open/closed. A small teal dot on a closed heading means "your selected item is inside".
- Heading count badge shows how many items are inside. Item counts keep their red / green / amber / grey colours.
- Only one item lit at a time. Hover = the app's purple gradient. Keyboard focus = 2px blue outline. prefers-reduced-motion switches all animation off.

A. Heading bars - each heading is a bordered bar with a coloured left edge and chevron on the right. Current section = whole bar filled in its colour. Items hang on a guide line; a teal bar slides to the selected item.
B. Tree headings - borderless, chevron on the left like folders, thick divider lines between groups. Current section gets a coloured top rule, coloured heading text and a coloured line down its items. Selected row uses the existing teal-blue tint plus a sliding bar.
C. Accordion cards - each section is its own card with a dark header and a chunky chevron tile. Current section = header filled in its colour and a coloured card outline. A solid teal pill slides to the selected item.

Recommendation: A. Clearest "this is a dropdown" (it looks like a button with a chevron), strongest heading/item contrast, cheapest to build on today's markup (existing .inv-sidebar-section-toggle button). C is the loudest but uses the most vertical space; B is the quietest.

Notes for Codex/Jacob
- Coral and green are the app's existing status colours; if Kevin dislikes them on headings, reuse blue/amber/purple. Green is close to teal, so Categories could instead be blue.
- Mockup only: no app code changed, nothing deployed. Hover is purple everywhere in the app, so the purple Library heading looks similar to a hovered item; Kevin may prefer Library amber.
