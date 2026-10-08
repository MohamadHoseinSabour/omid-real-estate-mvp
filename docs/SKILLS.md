# Installed Skills & Capabilities

> **Context:** This project runs in **Antigravity IDE** (Google DeepMind), not Claude Code.
> The `npx skills` CLI referenced in the original spec (`AGENTS.md`) is specific to the Claude Code ecosystem and is **not available** here.
> Instead, Antigravity has its own built-in skill system with pre-installed skills.

## Available & Relevant Skills

The following skills are pre-installed in the global config (`~/.gemini/config/skills/`) and will be used in this project:

| Skill | Source | Purpose in This Project | Phase | Safety Check |
|---|---|---|---|---|
| `seo-audit` | Global config (coreyhaines31/marketingskills) | Full SEO audit of public pages | 5 | ✅ No secrets needed, no external data send |
| `schema` | Global config (coreyhaines31/marketingskills) | JSON-LD: RealEstateListing, Organization, Article, BreadcrumbList | 5 | ✅ Safe |
| `copywriting` | Global config (coreyhaines31/marketingskills) | Hero text, services, commission explanations | 4, 5 | ✅ Safe |
| `site-architecture` | Global config (coreyhaines31/marketingskills) | Sitemap planning, URL structure, navigation | 2 | ✅ Safe |
| `cro` | Global config (coreyhaines31/marketingskills) | Conversion optimization for forms and pages | 4, 5 | ✅ Safe |
| `content-strategy` | Global config (coreyhaines31/marketingskills) | Blog content planning | 4 | ✅ Safe |
| `image` | Global config (coreyhaines31/marketingskills) | Generating placeholder images, OG images | 4 | ✅ Safe |
| `agy-customizations` | Built-in (Antigravity) | Managing skills, rules, and plugins | All | ✅ Safe |
| `antigravity-guide` | Built-in (Antigravity) | Reference for Antigravity features | All | ✅ Safe |

## Not Available (Claude Code Ecosystem Only)

The following skills were listed in the original spec but are **not available** in Antigravity IDE. Their functionality is covered by alternative approaches:

| Original Skill | Original Source | Alternative in This Project |
|---|---|---|
| `frontend-design` | anthropics/skills | Manual design system creation + Section 5 RTL rules in AGENTS.md |
| `webapp-testing` | anthropics/skills | Manual Playwright test writing |
| `web-design-guidelines` | vercel-labs/agent-skills | WCAG AA guidelines + Section 5 of AGENTS.md |
| `brainstorming` | obra/superpowers | Direct agent capability |
| `writing-plans` | obra/superpowers | Direct agent capability (phased approach in AGENTS.md) |
| `executing-plans` | obra/superpowers | Direct agent capability |
| `test-driven-development` | obra/superpowers | Manual TDD workflow |
| `systematic-debugging` | obra/superpowers | Direct agent capability |
| `requesting-code-review` | obra/superpowers | Manual code review at Phase 7 |
| `verification-before-completion` | obra/superpowers | Phase gate system in AGENTS.md |
| `supabase-postgres-best-practices` | supabase/agent-skills | Supabase official documentation reference |

## Notes

1. **RTL/Persian skill:** No quality RTL/Persian web development skill was found. Section 5 of `AGENTS.md` serves as the authoritative RTL guideline.
2. **Total active skills:** 9 (within the 12-skill limit).
3. **Superpowers skills conflict:** Not applicable — these skills are not available, and their workflows (TDD, planning, review) are handled by the phased approach defined in `AGENTS.md`.

---

*Last updated: 2026-10-08*
