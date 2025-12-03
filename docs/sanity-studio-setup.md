# Sanity Studio Setup

> Reference: [Sanity Studio docs](https://www.sanity.io/studio) (`/sanity-io/sanity` @ Context7). Follow these steps to get the local Studio and Vercel deployment working with project `lwvgcasl`.

---

## 1. Prerequisites

- Sanity account with access to org `oWyKeBw8T` and project `lwvgcasl`.
- Node.js 22+ (run `nvm use`).
- npm 10+ (ships with Node 22).
- Local Sanity CLI (optional but convenient): `npm install -g sanity` or `npx sanity@latest login`.

## 2. Install dependencies

```bash
npm install
```

> This also makes the `sanity` CLI available through `node_modules/.bin`.

## 3. Configure environment variables

1. Copy `env.example` → `.env.local`.
2. Fill in the values:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=lwvgcasl
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-12-03
SANITY_API_READ_TOKEN=<optional read/token for ISR or previews>
SANITY_REVALIDATE_SECRET=<shared secret for webhook-triggered revalidate>
```

3. Restart `npm run dev` so Next.js picks up the env file.

## 4. Sanity project housekeeping

Run each once per developer:

```bash
npx sanity@latest login        # Browser flow
npx sanity@latest init --env   # Ensures CLI knows about project lwvgcasl
npx sanity@latest dataset list # Sanity dataset inventory (expect production)
```

Ensure Content Lake CORS origins allow:

- `http://localhost:3000`
- `http://localhost:3333` (used by `sanity dev`)
- Production domain(s) from Vercel deployments, e.g. `https://jha.kr`, `https://*.vercel.app`.

## 5. Running Studio locally

Option A (recommended): run the Next.js dev server and use the embedded route.

```bash
npm run dev
# open http://localhost:3000/studio
```

Option B: run standalone Studio via the CLI (faster hot reload when editing schema).

```bash
npm run studio:dev
# served at http://localhost:3333
```

## 6. Deploying Studio

Sanity hosts their Studio for authenticated editors (handy if you do not want to expose `/studio` publicly).

```bash
npm run studio:deploy
```

During the first deploy, Sanity will prompt for the project. Select `lwvgcasl / production`. Subsequent runs reuse `.sanity/runtimeData`.

## 7. Managing the project

- `npm run studio:manage` opens the Sanity management UI (`sanity manage`), where you configure collaborators, datasets, tokens, and webhooks.
- Create a **Viewer** token for Next.js ISR revalidation or previews and store it as `SANITY_API_READ_TOKEN`.
- Configure a webhook (listen to `create`, `update`, `delete`) that calls your Vercel `/api/revalidate` endpoint with `SANITY_REVALIDATE_SECRET`.

## 8. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Missing environment variable` error | Ensure `.env.local` exists and matches `env.example`, then restart dev server. |
| `Dataset not found` when visiting Studio | Verify `NEXT_PUBLIC_SANITY_DATASET` matches Sanity dataset ID (default `production`). |
| `CORS Origin` errors in console | Add the origin (localhost or deployed domain) to *Project → API → CORS Origins* in Sanity manage. |
| `Not Authorized` inside Studio | Run `npx sanity@latest login` to re-authenticate; confirm your account has Editor or greater in project `lwvgcasl`. |

---

## 9. Next steps

- Keep schema definitions in `src/sanity/schemaTypes/**`.
- Use `structure.ts` to curate the Studio navigation.
- Tag Sanity fetches (`sanityFetch({ tags: [...] })`) so Vercel revalidation can stay granular.
- Singletons to remember:
  - `Home Page` (`homePage` schema)
  - `Admissions Page`
  - General pages (`About`, `Alumni`, `FAQ`, `Gallery`) powered by the `generalPage` schema. Each lives under its own menu item so you always edit the correct document.

