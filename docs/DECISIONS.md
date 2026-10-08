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
