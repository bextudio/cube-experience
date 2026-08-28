# Design QA — Copy & Playback Pass

- source visual truth path: `docs/audit/performance-copy-start.png`
- implementation screenshot path: `docs/audit/performance-copy-final.png`
- combined comparison path: `docs/audit/performance-copy-comparison.png`
- viewport: 1280 × 720 CSS px
- source pixels: 1280 × 720
- implementation pixels: 1280 × 720
- device scale factor: 1
- density normalization: none required
- state: فصل ۰۱، لوپ آغاز، رابط بدون Modal

## Full-view comparison evidence

چیدمان، اندازه‌ی پنل روایت، جایگاه ناوبری، ریل فصل‌ها، هدر، لوگو، کنترل‌های صدا/توقف، رنگ‌ها و نسبت نمایش ویدیو میان منبع و نسخه‌ی نهایی ثابت مانده است. تفاوت فریم مکعب ناشی از زمان متفاوت ثبت در ویدیوی لوپ است و Design drift محسوب نمی‌شود.

## Focused region comparison evidence

برش جداگانه لازم نبود؛ متن اصلی، کنترل‌های پایین صفحه و ریل فصل‌ها در تصویر 1280 × 720 خوانا هستند. حالت Hover دکمه‌ی «ادامه» جداگانه با Computed Style و ثبت تصویری بررسی شد.

## Required fidelity surfaces

- Fonts and typography: Vazirmatn، وزن‌ها، اندازه‌ها، ارتفاع خط و شکست عنوان بدون تغییر ناخواسته باقی ماندند.
- Spacing and layout rhythm: فریم، فاصله‌ها، شعاع‌ها و محل پنل‌ها ثابت ماند.
- Colors and visual tokens: توکن فیروزه‌ای و سطوح سفید حفظ شد؛ کنتراست Hover دکمه‌ی اصلی اصلاح شد.
- Image quality and asset fidelity: هیچ ویدیو، لوگو یا تصویر جایگزین یا بازفشرده نشد.
- Copy and content: فرمان‌ها کوتاه، فارسی طبیعی و نشانه‌گذاری/نیم‌فاصله یکدست شد.

## Comparison history

1. P2 — متن دکمه‌ی «ادامه» در Hover به رنگ فیروزه‌ای روی پس‌زمینه‌ی فیروزه‌ای درمی‌آمد و عملاً ناپدید می‌شد.
   - Fix: رنگ متن Hover دکمه‌ی اصلی به سفید قفل شد.
   - Post-fix evidence: `docs/audit/performance-copy-final.png` و Computed Style نهایی.

## Interaction evidence

- شروع از لوپ فصل ۰۱ و ورود به ویدیوی ۰۲ آزمایش شد.
- فعال‌شدن بازگشت در میانه‌ی ویدیوی ۰۲ و Seek به نسخه‌ی معکوس آزمایش شد.
- پایان ویدیوی ورود و تحویل به لوپ شهر آزمایش شد.
- خطای Console یا Warning مشاهده نشد.

## Remaining findings

هیچ P0، P1 یا P2 باز باقی نمانده است. ثبت Dropped Frame در این Browser در دسترس نبود و به‌عنوان محدودیت اندازه‌گیری مستند شد.

final result: passed
