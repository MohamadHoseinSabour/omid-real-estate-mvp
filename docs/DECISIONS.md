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
