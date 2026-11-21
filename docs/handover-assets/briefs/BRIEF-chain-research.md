# BRIEF — chain research (READ-ONLY on the repo; write only to /tmp/chain-research/<CHAIN>/)
Chain = $CHAIN (one of: drums, 808, master). Repeat the method of /Users/admin/aimm-previews/vocal-chains/build_report.py and REPORT.md (read both first) but for this chain only.
Inputs: the 738 transcripts in /Users/admin/github/aimm/docs/knowledge/*.md (do not edit), ownership ONLY from /Users/admin/aimm-previews/inventory-scan.json.
Chain scope: $SCOPE
Genre weighting: tag every relevant video with a genre (trap, drill, hip-hop/boom bap, R&B, pop, rock, EDM, lo-fi, other) from title/transcript. Trap/drill/hip-hop videos get weight 3, R&B/lo-fi 2, everything else 1. Plug-in "weighted videos" = sum of weights; also keep plain video counts and a per-genre count table for ALL genres found.
Do:
1. Select relevant videos (title pass + full-body pass, like the vocal method); list them with title, creator, video id, genre, weight, named plug-ins in transcript order.
2. Tally every named plug-in (plain count + weighted). Normalise names (e.g. 'Pro-Q 3'), publisher where known.
3. Resolve each against the scan: owned exact / owned close version / not owned. For not owned, suggest 1-3 owned equivalents with the same job (resolve to real scanned names; never invent). Separate DAW stock plug-ins (Logic Pro 13 list at /Users/admin/github/aimm/standalone/assets/vocal-favs.json stock.logic) from third-party.
4. Write /tmp/chain-research/$CHAIN/REPORT.md (method, counts, genre table, relevant videos, plug-in tally with weights, owned/close/missing/stock) and /tmp/chain-research/$CHAIN/data.json shaped like vocal-favs.json (owned[], stock.logic[], missing[] with equivalents, plus chain:"$CHAIN", genres{}). Report counts and anything unresolved.
Do not modify any repo file, do not push or deploy.
