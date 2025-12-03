# jha.kr — Project Starter Repo Checklist

> Use this checklist to stand up the repository to production‑readiness.  
> Baseline stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Radix UI + Sanity (Headless CMS) + Vercel**.  
> This file is intentionally practical—no pseudo‑code, only disciplined, actionable items.

---

## A) Repository & Governance

- [ ] Create Git repository under the correct org; add admins/maintainers.
- [ ] Protect `main` branch (required PR, 1–2 code owners, passing checks, no direct pushes).
- [ ] Define branches: `main` (prod), `develop` (preview/staging), `feat/*` (feature).
- [ ] Add `README.md` (overview, run, build, deploy, envs, contact).
- [ ] Add `CODEOWNERS` with component ownership and review rules.
- [ ] Add PR template and Issue templates (bug, feature, chore).
- [ ] Choose license and add `LICENSE` (company standard or MIT).
- [ ] Add `.gitignore` for Node/Next/Vercel/OS artifacts.
- [ ] Enable Dependabot/Renovate for dependency & security updates.
- [ ] Enable GitHub “Secret scanning” and “Dependabot alerts”.
- [ ] Add `SECURITY.md` (vuln disclosure channel) and `CONTRIBUTING.md` (workflow).

---

## B) Tooling & Standards

- [ ] Pin Node LTS (e.g., `.nvmrc`) and package manager (pnpm/npm) with lockfile.
- [ ] TypeScript strict mode enabled; `tsconfig` aligned with App Router.
- [ ] ESLint + Prettier configured (TypeScript/React/a11y plugins).
- [ ] EditorConfig added; VS Code workspace recommendations documented.
- [ ] Conventional Commits policy (commitlint) and CHANGELOG strategy defined.
- [ ] Husky pre‑commit: lint, typecheck, format. Pre‑push: tests.
- [ ] Add `scripts` in `package.json` (dev, build, start, lint, typecheck, test, e2e, analyze).

---

## C) Application Skeleton (Next.js App Router)

- [ ] Create routes: `/`, `/about`, `/programs`, `/faq`, `/coop`, `/activities`, `/alumni`, `/news`, `/gallery`, `/admissions`.
- [ ] Add Route Handlers: `/sitemap.xml`, `/robots.txt` (and `/feed.xml` if used).
- [ ] Shell layout: header/nav/footer + skip‑to‑content link.
- [ ] Directory layout agreed:
  - [ ] `app/` (routes, layouts, route handlers)
  - [ ] `components/` (ui, layout, blocks)
  - [ ] `lib/` (cms, seo, utils)
  - [ ] `styles/` (global.css, tokens)
  - [ ] `public/` (static assets)
  - [ ] `docs/` (internal docs, this checklist)
- [ ] `.env.example` added; **no secrets** in repo.
- [ ] Initial content placeholders so pages render and pass smoke tests.

---

## D) Styling & Design System

- [ ] Tailwind installed; tokens (colors/spacing/typography/radius/shadows) set in `tailwind.config`.
- [ ] Base typography adjusted for Korean readability (line‑height, letter‑spacing).
- [ ] Radix UI primitives integrated; selected patterns documented (Dialog, Dropdown, Accordion, Tabs).
- [ ] Optional shadcn/ui components generated and themed to tokens.
- [ ] Icon set chosen (Lucide/Phosphor) and usage guidelines added.
- [ ] Font strategy: Pretendard/Noto Sans KR self‑hosted subsets, preload, `display=swap`.

---

## E) CMS (Sanity) Integration

- [ ] Sanity project created; datasets: `production` (+ optional `staging`).
- [ ] Sanity Studio hosted at `admin.jha.kr` (or protected `/studio`) with auth.
- [ ] Content types created: `post`, `event`, `program`, `coop`, `media`, `page`, shared `seo` block.
- [ ] Roles/permissions/workflow: Author → Editor → Publish; audit/history enabled.
- [ ] Draft preview implemented (preview URL visible to editors only).
- [ ] Webhooks on publish/update/delete → ISR revalidation endpoints.
- [ ] Media policy enforced: alt text mandatory; credit/license fields; EXIF stripped.
- [ ] CORS origins set for studio and site; API tokens with least privilege.

---

## F) Data Fetching & Caching Strategy

- [ ] Rendering modes per route documented and applied:
  - [ ] Home (`/`): ISR (short TTL), tag = `home`.
  - [ ] News list/detail: ISR with tag = `post`, plus list tag = `post:list`.
  - [ ] Programs hub/detail: SSG or long‑TTL ISR; tag = `program` (if ISR).
  - [ ] Co‑op & Gallery: ISR (moderate TTL); tags = `coop`, `media`.
  - [ ] Admissions: ISR (short TTL); tag = `admissions`.
- [ ] Revalidation endpoints accept tag(s) and path(s); CMS webhooks mapped to tags.
- [ ] Loading/fallback states and streaming defined for content‑heavy routes.

---

## G) SEO & Social

- [ ] Per‑page metadata via Next metadata API (title, description, canonical, robots).
- [ ] Structured data generators: Organization, BreadcrumbList, Article/NewsArticle, Event, Course, FAQ.
- [ ] OG/Twitter defaults + per‑item overrides; social image template prepared (1200×630 min).
- [ ] Sitemaps set up:
  - [ ] Root `sitemap.xml` linking to `sitemaps/general.xml`, `sitemaps/news.xml` (and images/videos if used).
  - [ ] `lastmod` populated for every URL.
- [ ] `robots.txt` with sitemap locations; disallow `/admin`, `/studio`, `/draft`.
- [ ] Submit sitemaps to Google Search Console & Naver Search Advisor.
- [ ] Internal linking rules documented (hub → detail, related posts, breadcrumbs).

---

## H) Performance & Core Web Vitals

- [ ] Budgets: **LCP < 2.5 s**, **INP < 200 ms**, **CLS < 0.1** (mobile).
- [ ] `next/image` configured (allowed domains, responsive sizes, placeholders).
- [ ] Fonts: subset KR, preload, `display=swap`, fallbacks set.
- [ ] JS minimized: Server Components by default; client components only where needed; dynamic imports for heavy UI.
- [ ] Third‑party scripts reviewed; defer or remove non‑essential.
- [ ] Route‑level streaming for long pages.
- [ ] Monitoring dashboards for CWV (Vercel + GA4) created.

---

## I) Accessibility (WCAG 2.2 AA)

- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`) and one H1 per page.
- [ ] Keyboard navigation verified; visible focus; no focus traps.
- [ ] Color contrast ≥ AA; tokens documented.
- [ ] Images have meaningful alt text; captions/transcripts for key videos.
- [ ] Forms: labels, error messaging, live regions as needed; a11y linting in CI.

---

## J) Security & Privacy

- [ ] HTTPS enforced; HSTS; canonical domain redirect (http→https, www↔apex unified).
- [ ] Security headers: CSP (allowlist), X‑Content‑Type‑Options, Referrer‑Policy, Permissions‑Policy.
- [ ] Admin (Studio) protected via SSO/2FA or Basic Auth + IP allowlist.
- [ ] Secrets in Vercel/secret manager; Sanity tokens least privilege.
- [ ] Forms: Cloudflare Turnstile, rate limiting, server‑side validation; PII retention policy.
- [ ] Media of minors: consent workflow; takedown process documented.

---

## K) Analytics & Monitoring

- [ ] GA4 configured (pageview, outbound, video plays, form submissions).
- [ ] Vercel Analytics/Speed Insights enabled.
- [ ] Sentry DSN set (errors + performance traces); release tagging turned on.
- [ ] Search Console/Naver dashboards monitored for coverage and enhancements.
- [ ] Alerts for error spikes and CWV regressions configured.

---

## L) CI/CD & Environments

- [ ] Environments: `development` (local), `preview` (PR), `production` (jha.kr).
- [ ] CI checks: typecheck, lint, unit tests, E2E smoke, Lighthouse (mobile budgets) on key routes.
- [ ] Preview deploys on every PR; link auto‑posted to PR.
- [ ] Production deploy gated by green checks + approved reviews.
- [ ] Revalidation endpoints tested end‑to‑end from CMS webhook.
- [ ] Scheduled tasks (if any): regenerate feeds/sitemaps daily.
- [ ] Backup/restore runbook for CMS data and assets.

---

## M) Testing Strategy

- [ ] Unit tests for helpers (formatting, SEO builders, CMS mappers).
- [ ] Component tests for critical UI (navigation, cards, forms).
- [ ] E2E flows (Playwright):
  - [ ] Home → Programs → Program detail.
  - [ ] News list pagination → Post detail (OG/meta present).
  - [ ] Co‑op Monday/Saturday → announcements/activities.
  - [ ] Gallery photo/video views.
  - [ ] Admissions form submit (valid/invalid/spam).
- [ ] Accessibility tests (axe) + manual keyboard checks.
- [ ] Performance checks in CI for `/`, `/news`, `/news/[slug]`, `/programs/[slug]`, `/admissions`.

---

## N) Content Migration & Redirects

- [ ] Inventory legacy URLs and assets; create redirect map.
- [ ] Configure 301s (trailing slash normalization, legacy `/2025` → new `/news/...` or `/admissions`).
- [ ] Import posts/events/media to CMS with original publish dates/authors.
- [ ] Post‑migration crawl; fix 404s; minimize redirect chains (< 2).

---

## O) Pre‑Launch QA (Go/No‑Go)

- [ ] Metadata (title/description), canonical, robots present on all key pages.
- [ ] JSON‑LD valid (Organization, Breadcrumb, NewsArticle, Event, Course, FAQ).
- [ ] Sitemaps/robots accessible; Search Console shows initial indexing.
- [ ] CWV budgets met on mobile in pre‑prod.
- [ ] Forms deliver mail; spam protection proven.
- [ ] A11y checks pass; no blocking issues.
- [ ] Error logs clean during smoke flows.

---

## P) Post‑Launch (Week 1)

- [ ] Monitor Search Console/Naver for coverage & errors.
- [ ] Validate OG previews on KakaoTalk/Naver share.
- [ ] Review Sentry for runtime errors; hotfix as needed.
- [ ] Editors publish at least one announcement; live within ~60 s (ISR).
- [ ] Review CWV (RUM) and address any regressions.

---

## Q) Owner & Artifacts Register

- [ ] Domain/DNS & SSL ownership and renewal process.
- [ ] CMS roles/permissions & content governance owner.
- [ ] CI/CD and environment secrets owner.
- [ ] Redirect map and migration logs location.
- [ ] Incident process and on‑call rotation.

---

## Appendix A — Directory Skeleton (reference)

```
/ (repo root)
  app/
    page.tsx                # Home
    sitemap.ts              # sitemap.xml handler
    robots.ts               # robots.txt handler
    about/...
    programs/...
    faq/...
    coop/...
    activities/...
    alumni/...
    news/...
    gallery/...
    admissions/...
  components/
    ui/                     # primitive UI
    layout/                 # header, footer, nav, breadcrumb
    blocks/                 # hero, post list, cards
  lib/
    cms/                    # CMS client, queries
    seo/                    # metadata builders, json-ld helpers
    utils/                  # formatting, links
  public/
    og/                     # OG images, favicons
  styles/
    globals.css
  .github/
    workflows/              # ci.yml (build, lint, tests, lighthouse)
    ISSUE_TEMPLATE/
    PULL_REQUEST_TEMPLATE.md
  README.md
  CODEOWNERS
  LICENSE
  SECURITY.md
  CONTRIBUTING.md
  .gitignore
  .editorconfig
```

---

## Appendix B — Environment Variables (baseline)

- `NEXT_PUBLIC_SITE_URL=https://jha.kr`
- `SANITY_PROJECT_ID=...`
- `SANITY_DATASET=production`
- `SANITY_API_READ_TOKEN=...` (if required for preview)
- `SENTRY_DSN=...`
- `GA4_MEASUREMENT_ID=...`
- `TURNSTILE_SITE_KEY=...` / `TURNSTILE_SECRET_KEY=...`
- `EMAIL_PROVIDER_API_KEY=...` (Postmark/SES)
- `MAP_SDK_KEY=...` (Naver/Kakao)

> Keep secrets out of the repo; manage via Vercel/environment secrets.

---

## Appendix C — Revalidation Tags (example mapping)

- `home` → homepage sections
- `post`, `post:list` → `/news` list and details
- `program` → programs hub and details
- `coop` → co‑op hubs and child pages
- `media` → gallery/media pages
- `admissions` → admissions pages and widgets

---

## Appendix D — Branch Protection (suggested settings)

- [ ] Require pull request reviews before merging (min 1–2)
- [ ] Require status checks to pass (typecheck, lint, unit, e2e, lighthouse)
- [ ] Require branches up to date before merging
- [ ] Restrict who can push to `main`
- [ ] Block force pushes and deletions on `main`

---

**Status:** This checklist is ready to commit as `docs/REPO_STARTER_CHECKLIST.md`.  
Keep it in sync with the implementation playbook and update as the team’s conventions evolve.
