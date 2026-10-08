# ADR-001: Static Site Generator — Astro vs Jekyll

**Date:** 2026-10-08
**Status:** Accepted
**Decision:** **Astro**

## Context

We need a static site generator for the public-facing pages of Omid Real Estate, hosted on GitHub Pages. The site must support:
- RTL/Persian content (`lang="fa" dir="rtl"`)
- Tailwind CSS with RTL logical properties
- Component-based architecture for reusable cards, galleries, calculators
- Dashboard SPA (under `/dashboard/`) with Supabase integration
- Good developer experience for future maintainers

## Options Compared

| Criteria | Jekyll | Astro |
|---|---|---|
| **GitHub Pages native** | ✅ Built-in (no Actions needed) | ❌ Needs GitHub Actions for build |
| **Tailwind CSS** | 🟡 Possible but manual PostCSS setup | ✅ First-class integration |
| **Component model** | 🟡 Liquid partials (limited) | ✅ `.astro` components + islands |
| **JS interactivity** | 🟡 Must add Alpine/vanilla manually | ✅ Islands architecture (ship zero JS by default, add where needed) |
| **Dashboard SPA** | 🟡 Separate folder, no integration | ✅ Can colocate in same project, use `client:only` for Supabase |
| **Build speed** | 🟡 Acceptable for small sites | ✅ Very fast (Vite-based) |
| **Learning curve** | ✅ Simple for content sites | 🟡 Slightly more complex |
| **RTL support** | ✅ HTML is RTL-agnostic | ✅ Same |
| **Self-hosted fonts** | ✅ Yes | ✅ Yes |
| **Community / Ecosystem** | 🟡 Mature but declining | ✅ Growing, active plugins |
| **Alpine.js** | ✅ Easy to add | ✅ Built-in `@astrojs/alpinejs` |

## Decision

**Astro** is the better choice because:
1. **Component model** makes property cards, galleries, and calculators reusable
2. **Islands architecture** ships zero JS by default (great for performance) and allows adding interactivity only where needed
3. **Tailwind integration** is first-class and avoids manual PostCSS configuration
4. **Dashboard SPA** can be colocated in the same project using `client:only` directives
5. **Vite-based** build is fast and modern

The trade-off is needing a GitHub Action for build+deploy, but this is a one-time setup and gives us more control over the build pipeline.

## Consequences

- Need to set up GitHub Actions workflow for `astro build` → GitHub Pages
- Team members editing content need to understand Astro's file-based routing
- Alpine.js will be used for lightweight interactivity (forms, filters, galleries)
- Swiper for image galleries, Leaflet replaced by Neshan Maps

---

*Recorded in: docs/DECISIONS.md as ADR-001*
