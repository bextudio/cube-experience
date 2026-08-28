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

---

# Design QA — Experience Book Pass

- source visual truth path: `C:/Users/BF3EC~1.MOH/AppData/Local/Temp/codex-clipboard-4a62b7ae-ddd9-4a6e-82c0-b396baebc46e.png`
- implementation screenshot path: `docs/audit-book/02-book-next.png`
- drag interaction screenshot path: `docs/audit-book/03-book-drag.png`
- combined comparison path: `docs/audit-book/book-comparison.png`
- viewport: 1280 × 720 CSS px
- source pixels: 1884 × 1310
- implementation pixels: 1280 × 720
- device scale factor: 1
- density normalization: هر تصویر با حفظ نسبت در یک پنل هم‌ارتفاع قرار گرفت؛ قاب مرورگر منبع با محتوای Reader اشتباه گرفته نشد.
- state: کاتالوگ Fomento، نمایش دوصفحه‌ای

## Full-view comparison evidence

در منبع، قاب و کنترل‌ها حاضر بودند اما سطح کتاب کاملاً سفید بود. در نسخه‌ی اصلاح‌شده، صفحات واقعی Fomento داخل همان Reader دوصفحه‌ای رندر می‌شوند، نسبت 16:9 هر صفحه حفظ می‌شود و بستر کاغذ با اندازه‌ی خود Spread منطبق است.

## Focused region comparison evidence

برش جداگانه لازم نبود؛ صفحه‌ها، لبه‌ی میانی، شمارنده و هر دو کنترل در ثبت 1280 × 720 خوانا هستند. صحت Interaction علاوه بر تصویر، با تغییر شمارنده از 3–4 به 5–6 پس از Drag بررسی شد.

## Required fidelity surfaces

- Fonts and typography: تایپوگرافی خود صفحات از Asset اصلی می‌آید و بدون بازسازی یا Raster جایگزین نمایش داده می‌شود؛ متن‌های کنترلی Reader بدون تغییر باقی ماندند.
- Spacing and layout rhythm: Spread با نسبت 32:9 در مرکز قاب قرار دارد؛ بستر کاغذ دیگر فضای سفید بزرگ و نامرتبط تولید نمی‌کند.
- Colors and visual tokens: رنگ‌های خنثی Reader و توکن فیروزه‌ای Focus حفظ شدند.
- Image quality and asset fidelity: فایل‌های اصلی JPG کاتالوگ با `object-fit: contain` و بدون Crop یا بازفشرده‌سازی نمایش داده می‌شوند.
- Copy and content: شمارنده، نام کاتالوگ، برچسب‌های دسترس‌پذیری و راهنمای کشیدن صفحه درست و هماهنگ‌اند.

## Comparison history

1. P0 — صفحات Experience Book به‌علت حذف‌شدن ریشه‌ی PageFlip در چرخه‌ی دوباره‌اجرای Effect رندر نمی‌شدند.
   - Fix: راه‌اندازی PageFlip پس از آماده‌شدن تصاویر و در فریم بعدی انجام شد؛ Cleanup فقط نمونه‌ی واقعاً ساخته‌شده را نابود می‌کند.
   - Post-fix evidence: `docs/audit-book/01-book-open.png` و `docs/audit-book/02-book-next.png`.
2. P1 — سطح سفید زمینه از ابعاد Spread بزرگ‌تر بود و حتی در حالت سالم حس یک صفحه‌ی خالی می‌داد.
   - Fix: بستر کاغذ و خود کتاب به نسبت دو صفحه‌ی 16:9 یعنی 32:9 محدود و هم‌مرکز شدند.
   - Post-fix evidence: `docs/audit-book/02-book-next.png`.

## Interaction evidence

- دکمه‌ی «دو صفحه‌ی بعد» شمارنده و Spread را از 1–2 به 3–4 تغییر داد.
- Drag با Mouse از لبه‌ی راست، صفحه را ورق زد و شمارنده را به 5–6 رساند.
- Click روی صفحه فعال است و کلیدهای قبلی/بعدی همچنان کار می‌کنند.
- هیچ Error یا Warning در Console مشاهده نشد.

## Remaining findings

هیچ P0، P1 یا P2 باز باقی نمانده است. حالت لمس روی دستگاه فیزیکی در این اجرا تست نشده و به‌عنوان شکاف تست باقی می‌ماند.

final result: passed
