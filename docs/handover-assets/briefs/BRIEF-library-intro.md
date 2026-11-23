# BRIEF: Library tab intro (Kevin, 23 Nov 2026: "every tab has a brief")
Branch library-bars, standalone/assets/index.html. In AIMM_TAB_INTROS (near line 11756) the library entry is {title:'Library',description:''}. Change it to exactly:
library:{title:'Build a library Hope can learn from',description:'Add videos, review Hope\'s tips, and keep notes and saved chats in one place.'}
Confirm the intro header (#tabIntroTitle / #tabIntroDescription) renders the same as on the other tabs when Library is active, with no layout change elsewhere. Bump AIMM_BUILD to 2026-11-23.9 and the 3 stamp tests; run node --test tests/*.test.mjs; do not commit. Report in 3 lines.
