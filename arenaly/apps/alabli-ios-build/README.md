# العبلي iOS IPA Build Kit

هذه الحزمة لا تبني IPA على Windows. Apple تتطلب macOS + Xcode + توقيع Apple حتى يشتغل الملف على iPhone.

## المتطلبات على Mac

- macOS
- Xcode
- Node.js
- Apple Developer Team ID

## البناء

```bash
cd apps/alabli-ios-build
npm install
npm run add:ios
npm run sync:ios

export APPLE_TEAM_ID=YOUR_TEAM_ID
chmod +x build-ipa-on-mac.sh
./build-ipa-on-mac.sh
```

بعد نجاح البناء ستجد الملف هنا:

```text
build/ipa/alabli.ipa
```

إذا كان الهدف تجربة على جهاز iPhone خارج App Store، غيّر `method` في `ExportOptions.plist` إلى `development` أو `ad-hoc` حسب شهادة Apple عندك.
