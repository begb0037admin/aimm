#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "╔══════════════════════════════════════╗"
echo "║     AIMM — YouTube KB Ingestion      ║"
echo "╚══════════════════════════════════════╝"
echo ""
echo "Paste one YouTube URL, or multiple separated by spaces."
echo "Example: https://www.youtube.com/watch?v=ABC123"
echo ""
read -p "YouTube URL(s): " URLS
echo ""
read -p "Channel name:   " CHANNEL
echo ""
echo "Starting ingestion..."
echo ""
for URL in $URLS; do
  python3 scripts/ingest_yt.py "$URL" \
    --channel "$CHANNEL" \
    --cookies cookies.txt \
    --delay 5
done
echo ""
echo "✅ All done. Press any key to close."
read -n 1 -s
