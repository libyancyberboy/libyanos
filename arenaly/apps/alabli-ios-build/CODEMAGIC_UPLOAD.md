# العبلي IPA via Codemagic

هذا المشروع جاهز للبناء على Codemagic كـ IPA.

## Workflow

اختر واحد من workflows الموجودة في `codemagic.yaml`:

```text
alabli-ios-ipa
```

أو:

```text
Default Workflow
```

إذا ظهر لك في اللوج:

```text
Install Flutter dependencies
```

فهذا يعني أن Codemagic يستخدم إعداد Flutter الافتراضي، وليس ملف `codemagic.yaml`.
غيّر المشروع إلى YAML workflow أو ابدأ build من workflow أعلاه.

## Bundle ID

```text
ly.alabli.app
```

## Signing

ارفع في Codemagic شهادة Apple و provisioning profile مطابقين للـ Bundle ID:

- Distribution type: `ad_hoc`
- Bundle identifier: `ly.alabli.app`

بعد تشغيل workflow ستجد ملف `.ipa` في Artifacts.
