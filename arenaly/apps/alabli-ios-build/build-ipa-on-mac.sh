#!/usr/bin/env bash
set -euo pipefail

if [[ "$(uname)" != "Darwin" ]]; then
  echo "This script must run on macOS with Xcode installed."
  exit 1
fi

if [[ -z "${APPLE_TEAM_ID:-}" ]]; then
  echo "Set APPLE_TEAM_ID first, for example: export APPLE_TEAM_ID=ABCDE12345"
  exit 1
fi

if [[ ! -d "ios/App/App.xcworkspace" ]]; then
  npx cap add ios
fi

npx cap sync ios

rm -rf build
mkdir -p build

xcodebuild \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath build/alabli.xcarchive \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  archive

xcodebuild \
  -exportArchive \
  -archivePath build/alabli.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ExportOptions.plist

if [[ -f "build/ipa/App.ipa" ]]; then
  mv "build/ipa/App.ipa" "build/ipa/alabli.ipa"
fi

echo "IPA ready: build/ipa/alabli.ipa"
