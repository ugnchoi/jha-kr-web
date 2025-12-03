# jha.kr — Implementation Playbook (v1)

**Scope:** End‑to‑end implementation guidance for rebuilding **jha.kr** with an SEO‑first, CMS‑driven architecture.  
**Audience:** Engineering, DevOps, Content/Ops, QA, and Design.  
**Chosen baseline:** **Next.js (App Router) + TypeScript + Tailwind CSS + Radix UI** on **Vercel**, with **Sanity** as headless CMS.

---

## 1) Goals & Non‑Goals
**Goals**
- Search‑optimized site with fast page loads and stable Core Web Vitals.
- Non‑technical editors can publish **news/announcements** regularly (preview, schedule, rollback).
- Clean information architecture aligned to sitemap agreed earlier.
- Robust content model for Programs, Co‑op, Events, News, Gallery, Alumni, Admissions.
- Safe handling of images/media, especially minors’ images.

**Non‑Goals**
- Custom forum, LMS, or complex auth in phase 1.
- Native apps or heavy client‑side interactivity beyond editorial needs.

---

## 2) High‑Level Architecture
- **Frontend:** Next.js 14+ (App Router, React Server Components) on Vercel.  
- **CMS:** Sanity (managed SaaS), separate Studio at **admin.jha.kr** (or a protected `/studio` route).  
- **Media:** CMS media (Sanity assets) + `next/image` optimization pipeline.  
- **Data fetch:** Static generation (SSG) with **Incremental Static Regeneration** (ISR) + **on‑publish revalidation** via Sanity webhooks.  
- **Edge/CDN:** Vercel edge network for caching and global distribution.  
- **Analytics & Monitoring:** GA4, Vercel Analytics, Sentry.  
- **Search Console:** Google + Naver submission with sitemaps.  
- **Security:** TLS, HSTS, strict redirects, admin hardening.

---

## 3) Information Architecture (IA)
**Primary navigation:** About / Programs / Homeschool Q&A / Co‑op / Activities / Alumni / News / Gallery / Admissions  
**Depth:** Max depth 3 (e.g., Co‑op → Monday → Announcements).  
**Key hubs:** Programs, Co‑op, Activities, News.  
**Admissions** is a first‑class route; “About” links to it, but canonical lives at `/admissions`.

---

## 4) URL & Routing Policy
- **Domain:** `https://jha.kr` (no `www`).  
- **No trailing slash**; ensure 301 from `/path/` → `/path`.  
- **Canonicalization:** One canonical per logical page.  
- **Language:** Slugs in **English**, titles in **Korean** (UI/SEO).  
- **Examples**
  - `/programs/ezra`, `/programs/timothy-daniel`, `/admissions`, `/news/2025-first-half-admissions`
  - `/coop/monday`, `/coop/monday/announcements`, `/coop/monday/activities`
  - `/activities/orchestra-choir`, `/gallery/photos`, `/gallery/videos`

**Redirects**
- Legacy paths (e.g., `/2025`) → mapped 301 to new `/news/...` or `/admissions/...`.  
- Consolidate synonyms (news/notice/event) under `/news`.

---

## 5) Technology Stack (Selected)
**Framework & Language**
- Next.js 14+ (App Router, RSC, Route Handlers), TypeScript strict.

**UI & Styling**
- Tailwind CSS (design tokens, responsiveness), Radix UI (accessible primitives), optional shadcn/ui for accelerated scaffolding.  
- Icon set (Lucide/Phosphor).  
- Fonts: Pretendard or Noto Sans KR; self‑hosted subsets; `display=swap`; preload critical.

**SEO & Social**
- Per‑page metadata with Next’s metadata API; canonical, robots, OpenGraph/Twitter.  
- JSON‑LD for Organization, Article/News, Event, Course, FAQ, Breadcrumb.  
- Dynamic OG images for news/posts (Vercel OG/image response).  
- Sitemaps: root `sitemap.xml` + sectioned sitemaps (`/sitemaps/general.xml`, `/sitemaps/news.xml`).

**CMS Integration**
- Sanity content schemas; preview mode (draft review), scheduled publishing, roles/permissions.  
- Webhooks → revalidate tags/paths for ISR.

**Forms**
- React Hook Form + Zod validation.  
- Server Actions or API route to email (Postmark/SES) + Cloudflare Turnstile anti‑bot.

**Maps (KR)**
- Naver Map or Kakao Map SDK on Contact/Access page.

**Internationalization**
- Default `ko-KR`; architecture ready for `en` later (hreflang).

**Testing & Quality**
- ESLint + Prettier; unit (Vitest/Jest), E2E (Playwright); Storybook for UI review.  
- Monitoring: Sentry (errors/perf), Vercel Analytics, GA4.

---

## 6) Content Model (CMS)
> Implement as Sanity document/types; adapt naming to your style guide. All content objects include `seo` fields and `visibility` flags where needed.

**Common SEO fields (reused on all types)**
- `metaTitle`, `metaDescription`, `ogTitle`, `ogDescription`, `ogImage`, `canonical`, `noindex`.

**Post / News**
- Fields: `title`, `slug`, `excerpt`, `body (rich)`, `coverImage{asset, alt}`, `category (notice|news|event)`, `tags[]`, `author`, `publishedAt`, `updatedAt`, `featured (bool)`.  
- Schema intent: `NewsArticle` or `Article`.

**Event**
- Fields: `title`, `slug`, `summary`, `body`, `startDateTime`, `endDateTime`, `location{name,address,geo?}`, `organizer{name,url}`, `images[]`, `registrationUrl?`.  
- Schema intent: `Event`.

**Program**
- Fields: `titleKo`, `slugEn`, `overview`, `curriculum[]` (modules/outcomes), `ageRange`, `heroImage`, `ctaLink` (to Admissions), `faq[]`.  
- Schema intent: `Course`.

**Co‑op**
- Fields: `type` (monday|saturday), `intro`, references to `announcements[]` (Post), `activities[]` (Media/Album or Post).

**Media / Gallery**
- Fields: `title`, `slug`, `type` (photo|video), `assets[] {url, alt, caption, credit}`, `youtubeId?`, `publishedAt`.  
- For minors: `consent` metadata and storage policy indicators.

**Page (Static)**
- Fields: `title`, `slug`, `body`, `hero`, `contactInfo?` (for About/Contact), SEO block.

**Taxonomies**
- `category`, `tag`, `cohort/year` (for admissions/news filtering).

---

## 7) Editorial Workflow
- **Roles:** Admin, Editor, Author, Viewer.  
- **States:** Draft → In review → Scheduled/Published.  
- **Preview:** Editors see draft in preview URL (no indexing).  
- **Publishing:** On publish/update, Sanity webhook triggers:
  - **Home**: revalidate home tag.  
  - **News list/detail**: revalidate post tag and affected slugs.  
  - **Section hubs** (Programs/Co‑op/Activities): revalidate section tags.
- **Versioning & rollback:** Use CMS history; maintain change log.  
- **Media governance:** Alt text mandatory; credit/license fields; PII/EXIF strip.

---

## 8) SEO & Discoverability
**Metadata**
- Title ≤ 60 chars; Description 110–160 chars; include core terms (“홈스쿨”, “코업”, 과정명, “입학”).  
- One `<h1>` per page; heading hierarchy correct.  
- Anchors use meaningful text (“입학 안내 보기”).

**Sitemaps & Robots**
- `robots.txt` allows `/`, disallows `/admin`, `/studio`, `/draft`.  
- Submit sitemaps to Google Search Console & Naver Search Advisor.

**Structured Data**
- Organization on home; BreadcrumbList on nested pages; NewsArticle on posts; Event on events; Course on programs; FAQPage on Q&A.

**Internal Linking**
- Hub → details; related posts widget; breadcrumbs; footer links to Admissions/News.

**KR Social Sharing**
- OG tags guaranteed; ensure KakaoTalk/Naver previews are consistent (image 1200×630 or similar).

---

## 9) Performance & CWV Targets
- **Budgets:** LCP < 2.5s, INP < 200ms, CLS < 0.1 on 4G mid‑tier Android.  
- **Images:** WebP/AVIF; sizes per layout; lazy‑load below fold; width/height set; decode async.  
- **Fonts:** Preload primary; subset KR glyphs; fallbacks defined.  
- **JS:** Ship only what’s needed; RSC first; defer non‑critical; route‑level code split.  
- **Caching:**  
  - Static pages with ISR (60–300s typical) and tag‑based revalidation.  
  - CDN cache enabled; immutable assets hashed.  
- **Streaming:** Use App Router streaming on content‑heavy pages.  
- **Monitoring:** Track CWV in GA4 and Vercel; set regression alerts.

---

## 10) Accessibility & UX
- WCAG 2.1 AA (KWCAG) alignment: color contrast, focus rings, skip links, keyboard navigation.  
- Radix UI primitives for ARIA correctness.  
- Media captions for videos; alt text policy; table semantics.  
- Language attr `lang="ko-KR"`; time/date in KR locale.

---

## 11) Forms, Email, Anti‑Spam
- Contact/Admissions intent forms: client validation (Zod), server validation, rate limiting.  
- Email provider: Postmark/SES; store minimal submission data.  
- Anti‑bot: Cloudflare Turnstile; honeypot field fallback.  
- PII retention policy and admin‑only access.

---

## 12) Security & Privacy
- HTTPS + HSTS; strict redirect from `http` and `www` to apex.  
- Admin (Studio) behind SSO/2FA if possible; IP allowlist or Basic Auth at minimum.  
- Sanity tokens with least privilege; environment secrets via Vercel/secret manager.  
- Content featuring minors: consent workflow and takedown procedure.  
- Backups: CMS export schedule + asset backup (if applicable).

---

## 13) Analytics, Logging, Observability
- GA4: pageviews, outbound clicks, video plays, form submissions.  
- Vercel Analytics: performance, edge insights.  
- Sentry: error tracking + performance traces; release tagging.  
- Search Console & Naver: coverage, enhancements, queries; sitemaps resubmission on major launches.

---

## 14) Environments & Configuration
- **Envs:** `development` (local), `preview` (PR), `production`.  
- **Secrets:** Sanity project ID/dataset/read token; email API key; map SDK key; Turnstile keys.  
- **Time zone:** Asia/Seoul for build/publish timestamps.  
- **Caching policy:** Documented TTLs per route; tag names for revalidation.

---

## 15) CI/CD & Branching
- Git branching: `main` (prod), `develop` (staging/preview), feature branches.  
- PR checks: type‑check, lint, unit tests, E2E smoke for critical paths (Home, News list/detail, Admissions form).  
- Preview deploys on every PR for product/content review.  
- Production deploy requires green checks + approver gate.  
- Rollback: immediate via Vercel deployment pinning.

---

## 16) Migration & Redirects
- Inventory legacy URLs (news, admissions years).  
- Map to new routes; generate 301 rules.  
- Content migration: import posts/events/media into CMS with authorship and publish dates preserved.  
- Validate with crawl (Screaming Frog or similar) and 404 log monitoring.

---

## 17) Testing Strategy & Acceptance
**Unit:** utilities (formatting, SEO builders), content mappers.  
**E2E (critical user journeys):**
- Navigate Home → Programs → Program detail (links/crumbs).  
- News list pagination → post detail (OG/metadata present).  
- Co‑op Monday/Saturday hubs → announcements/activities.  
- Gallery photo/video pages open, alt captions present.  
- Admissions form submit success/failure paths; anti‑bot OK.  
**Accessibility:** automated axe + manual keyboard checks.  
**SEO checks:** titles, descriptions, canonical, structured data validity (Rich Results Test).  
**Performance:** Lighthouse CI thresholds and CWV watch.

**Definition of Done (per page/template)**
- Meets IA and content spec; SEO fields populated; JSON‑LD valid.  
- LCP/CLS/INP within budget; a11y audit passes.  
- Preview works; publish triggers ISR; sitemaps include URL.  
- Analytics events fire; error logs clear.

---

## 18) Rollout Plan (Phased)
**Phase 0 – Foundation (1–2 weeks)**  
- Repo setup, base framework, design tokens, header/footer, Studio project, schemas scaffold.

**Phase 1 – Core Content (2–3 weeks)**  
- Programs, News (list/detail), Admissions, About/Contact, Gallery.  
- SEO pipeline, sitemaps/robots, preview & webhooks, initial redirects.

**Phase 2 – Co‑op & Activities (1–2 weeks)**  
- Monday/Saturday hubs, announcements/activities; alumni testimonials; event model.

**Phase 3 – Hardening (1–2 weeks)**  
- a11y/perf passes, analytics, E2E suite, editorial training, Search Console/Naver submission, cutover.

---

## 19) Operational Playbooks
**On publish (news/event/program):**
1) Editor publishes in CMS → webhook fires.  
2) Vercel ISR revalidates tagged pages (detail + listing + home highlights).  
3) Check sitemaps updated if new URL; validate structured data.  
4) Social share preview sanity check (OG image/title).  

**On incident (content error or broken deploy):**
- Roll back to last stable deploy on Vercel; hotfix branch; postmortem with Sentry traces.

---

## 20) KR‑Specific Considerations
- Submit site to **Naver Search Advisor** (ownership verification, sitemap).  
- Ensure OG metas render correctly in **KakaoTalk** and **Naver Band/Blog**.  
- Use **Naver/Kakao Map SDK** for “오시는 길”, with fallback static map image for no‑JS.  
- Typography and line‑height tuned for Korean readability.

---

## 21) Risk Log (Initial)
- **Editor UX complexity:** Mitigate with tailored CMS Studio (only needed fields, grouped forms).  
- **Image/PII exposure:** Enforce alt/consent; strip EXIF; review workflow.  
- **Indexing delay post‑launch:** Pre‑submit sitemaps; request indexing for changed hubs; keep redirects clean.  
- **Performance regressions:** Guard with budgets, CI Lighthouse, Sentry performance alerts.

---

## 22) Appendices
**A. Route Inventory (initial)**
- `/`, `/about`, `/about/vision-mission`, `/about/history`, `/about/contact`  
- `/programs`, `/programs/timothy-daniel`, `/programs/ezra`, `/programs/vision`, `/programs/dht`  
- `/faq`, `/faq/what-is-homeschool`, `/faq/ask-anything`, `/faq/family-stories`  
- `/coop`, `/coop/monday`, `/coop/monday/announcements`, `/coop/monday/activities`, `/coop/saturday/...`  
- `/activities`, `/activities/orchestra-choir`, `/activities/reading-gate`, `/activities/bap-han-geurout/...`  
- `/alumni`, `/alumni/activities`, `/alumni/testimonials`  
- `/news` (list + detail slugs)  
- `/gallery`, `/gallery/photos`, `/gallery/videos`  
- `/admissions`

**B. Tag‑Based Revalidation (example mapping)**
- `tag:home` → homepage sections.  
- `tag:post` → `/news`, `/news/[slug]`.  
- `tag:event` → events hubs + detail.  
- `tag:program` → programs hub + affected detail page.  
- `tag:coop` → co‑op hubs + child pages.  

**C. Content Quality Guidelines**
- Lead with value (“홈스쿨·코업 공동체…”) in first 150 characters.  
- Use descriptive subtitles and subheads; avoid walls of text.  
- Alt text: who, what, where (no redundant “image of”).  
- Keep file names semantic in English (`orchestra-concert-2025.jpg`).

---

**Final Notes**
- This document is implementation‑ready and does not include code; teams can onboard immediately.  
- If helpful, a separate addendum can provide the Sanity schema checklist, Vercel env checklist, and redirect mapping worksheet to accelerate setup.
