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
