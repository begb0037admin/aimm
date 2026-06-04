#!/bin/bash
cd "$(dirname "$0")"

echo "🧹 Clearing git lock if present..."
rm -f .git/index.lock

echo "📦 Staging all files..."
git add -A

echo ""
echo "📝 Committing..."
git commit -m "chore: commit all untracked mockups, command scripts, and modified files"

echo ""
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Done — all files are on GitHub."
  echo "   https://github.com/begb0037admin/aimm"
  echo "   GitHub Pages: https://begb0037admin.github.io/aimm/"
else
  echo ""
  echo "❌ Push failed. Check your connection or GitHub auth."
fi

echo ""
echo "Press any key to close..."
read -n 1
