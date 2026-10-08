# Architecture Decision Records

## ADR-000: Project Bootstrapping

**Date:** 2026-10-08
**Status:** Accepted

**Decision:** Use phased development approach with gate approvals between phases.

**Context:** The project is an MVP real estate agency website with a static public site (GitHub Pages) and a Supabase-powered dashboard. A phased approach reduces risk and ensures alignment at each stage.

**Alternatives Considered:**
1. Build everything at once — rejected due to higher risk of misalignment
2. Prototype-first approach — rejected as the spec is already detailed enough

**Consequences:** Each phase requires explicit approval before proceeding. This adds communication overhead but ensures quality and alignment.

---

*Decisions are numbered ADR-NNN and appended to this file.*

---

## ADR-001: Static Site Generator

**Date:** 2026-10-08
**Status:** Accepted
**Decision:** Astro (over Jekyll)

**Rationale:** Component model, first-class Tailwind, islands architecture (zero JS by default), dashboard SPA colocation.

**Full document:** [ADR-001-stack.md](./ADR-001-stack.md)

---

## ADR-002: Key Project Decisions (Phase 2)

**Date:** 2026-10-08
**Status:** Accepted

| Decision | Choice | Reason |
|---|---|---|
| واحد پول | تومان | درخواست کاربر |
| واحد متراژ | متر مربع | استاندارد ایران |
| رنگ‌بندی | آبی + طلایی | اعتماد + لوکس |
| نقشه | نشان (neshan.org) | سرویس محلی ایران |
| بک‌اند | Supabase Free | رایگان، Postgres + Auth + RLS |
| کیف پول | فقط حسابداری | بدون پرداخت آنلاین (خارج MVP) |
| آنالیتیکس | فعلاً غیرفعال | درخواست کاربر |
| صفحات حقوقی | بله | حریم خصوصی + قوانین |
| لوگو | متنی (فونت) | لوگو ندارند |
| دامنه | GitHub Pages | دامنه اختصاصی ندارند |

---

## ADR-003: Co-Brokering (MLS), Multi-Role Property Access & Wallet Adjustments

**Date:** 2026-10-09
**Status:** Accepted

**Context & Decisions:**
1. **سطوح بالاتر از مشاور (مدیرکل و منشی):**
   - مشاهده کلیه فایل‌های ملکی با برچسب مشخص مشاور مسئول (نام، عکس، شماره تماس).
   - امکان ویرایش کامل هر ملک و بازتخصیص آن به مشاور دیگر در مودال ویرایش.
   - امکان حذف دائم ملک (مخصوص مدیرکل با تاییدیه).
2. **فروش مشارکتی / فایلینگ همکاران (`/dashboard/co-filing/`):**
   - صفحه اختصاصی MLS برای مشاوران جهت مشاهده فایل‌های دیگر همکاران با اطلاعات کامل و امکان تماس مستقیم.
   - فرم «ثبت مشتری یا اعلام فروش مشارکتی».
   - فرمول تقسیم پورسانت: ۳۰٪ از کل کمیسیون آژانس سهم مشاوران است؛ در فروش مشارکتی این مقدار به صورت ۵۰/۵۰ (هر مشاور ۱۵٪ کل کمیسیون) بین مشاور صاحب فایل و مشاور خریدار تقسیم می‌شود.
3. **تایید تسویه پورسانت با یک کلیک (1-Click Payout Approval):**
   - معاملات تا پیش از تایید در وضعیت `pending_approval` قرار می‌گیرند.
   - مدیرکل یا منشی با یک کلیک روی دکمه «تایید و واریز به کیف پول»، پورسانت محاسبه‌شده را مستقیماً به حساب کیف پول مشاور (یا هر دو مشاور در فروش مشارکتی) واریز می‌کند.
4. **تعدیل دستی کیف پول مشاوران:**
   - مدیرکل و منشی می‌توانند هر مبلغی را به کیف پول مشاوران اضافه (پاداش) یا کسر (مساعده/جریمه) کنند.
   - درج «دلیل و شرح دقیق تراکنش» اجباری است و در دفتر کل ثبت می‌شود.

---

### ADR-011: تثبیت استایل هدر، اصلاح دکمه‌ها و ریدایرکت خودکار مسیرهای ۴۰۴ داشبورد
**Status:** Approved
**Date:** 2026-10-09

**تصمیم‌ها:**
1. **استایل هدر داشبورد:** پالت Tailwind با تعریف کامل طیف‌های رنگی ۵۰ تا ۹۵۰ برای `primary` و `accent` تکمیل شد؛ همچنین استایل خطی پایدار (`#0a192f` و بوردر `#cda34f`) به تگ `<header>` افزوده شد تا از نمایش پایدار رنگ هدر در هر شرایطی اطمینان حاصل شود.
2. **عدم شکست دکمه‌ها:** افزودن کلاس‌های `whitespace-nowrap` و `shrink-0` به تمام دکمه‌ها، سرستون‌های جداول (`<th>`) و نشان‌های کاربری در تمام صفحات داشبورد، تا متن دکمه‌ها هرگز دوخطی نشود.
3. **حل خطای ۴۰۴ در `/sales/` و مسیرهای مستقیم:**
   - تغییر لینک‌های نسبی به آدرس‌های مطلق مبتنی بر `${baseUrl}/dashboard/.../`.
   - ایجاد صفحات واسط ریدایرکت خودکار در ریشه (`src/pages/sales.astro`, `wallet.astro`, `co-filing.astro`, `leads.astro`) تا اگر کاربری مستقیماً به آدرسی مثل `/sales/` وارد شد، بلافاصله و با رفرش متاتگ و اسکریپت به `/dashboard/sales/` هدایت گردد.

---

### ADR-012: یکپارچه‌سازی کامپوننت هیرو سه‌بعدی Tilted Grid و بازطراحی بخش هیرو لندینگ
**Status:** Approved
**Date:** 2026-10-09

**تصمیم‌ها:**
1. **استفاده از جزایر تعاملی React در Astro:** نصب و راه‌اندازی `@astrojs/react` در کنار پکیج‌های `clsx` و `tailwind-merge` برای پشتیبانی از الگوی کامپوننت‌های مدرن شبیه shadcn.
2. **کامپوننت TiltedGridHero در `src/components/ui/`:** پیاده‌سازی افکت چرخش استوانه‌ای سه‌بعدی ۳D Cylinder Ribbon با CSS transforms و ResizeObserver برای نمایش روان تصاویر املاک لوکس منطقه گلستان اهواز در پس‌زمینه.
3. **تطبیق کامل با هویت بصری و نیازمندی‌های املاک امید:**
   - بکارگیری عکس‌های باکیفیت و متناسب املاک مسکونی، پنت‌هاوس و ویلایی گلستان.
   - حفظ دو دکمه اصلی هدف‌گذاری (`🏷️ می‌خواهم بفروشم` و `🔍 می‌خواهم بخرم`) با کلاس `.hero-intent-btn` و اسکرول نرم به فرم مشاوره `#consultation` با استفاده از Event Delegation روی داکیومنت.
   - حفظ نوار آمار کلیدی با طراحی مدرن گلاسمورفیک (Glassmorphism) و کنتراست بالای متن برای رعایت دسترسی‌پذیری (A11Y).
