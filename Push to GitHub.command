#!/bin/bash
cd "$(dirname "$0")"
echo "📤 Pushing AIMM to GitHub..."
git push origin main
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Done — GitHub Pages will update in ~1 minute."
  echo "   https://begb0037admin.github.io/aimm/"
else
  echo ""
  echo "❌ Push failed. Check your connection or GitHub auth."
fi
echo ""
echo "Press any key to close..."
read -n 1
