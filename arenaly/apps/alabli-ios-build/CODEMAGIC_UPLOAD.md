# العبلي IPA via Codemagic

هذا المشروع جاهز للبناء على Codemagic كـ IPA.

## Workflow

اختر workflow باسم:

```text
alabli-ios-ipa
```

## Bundle ID

```text
ly.alabli.app
```

## Signing

ارفع في Codemagic شهادة Apple و provisioning profile مطابقين للـ Bundle ID:

- Distribution type: `ad_hoc`
- Bundle identifier: `ly.alabli.app`

بعد تشغيل workflow ستجد ملف `.ipa` في Artifacts.

