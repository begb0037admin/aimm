#!/bin/bash
# One-shot wrapper for the non-MWTM long-tail re-embed, 2026-10-06.
# Same pattern as run_mwtm_backfill.sh - prompts for the key cleanly instead
# of relying on a multi-token inline env-var command line.
set -e
cd "$(dirname "$0")"

AIMM_INGEST_KEY=""
while [ -z "$AIMM_INGEST_KEY" ]; do
  echo "Paste your AIMM_INGEST_KEY, then press Enter:"
  read AIMM_INGEST_KEY
  if [ -z "$AIMM_INGEST_KEY" ]; then
    echo "(nothing came through - try pasting again)"
  fi
done
echo "Got a key starting with: ${AIMM_INGEST_KEY:0:6}... (${#AIMM_INGEST_KEY} chars)"
echo "Starting backfill..."

export AIMM_INGEST_KEY
export AIMM_PROXY_URL="https://aimm-proxy.kevinlelitte.workers.dev"
python3 backfill_kb_embeddings.py --video-ids-file non_mwtm_longtail_succeeded_ids.txt
