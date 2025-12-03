# jha.kr

SEO-first, CMS-driven website for JHA (Korea). Built with Next.js 14+, Sanity, and Vercel.

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ (use `nvm use`)
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Architecture

- **Framework:** Next.js (App Router)
- **CMS:** Sanity
- **Styling:** Tailwind CSS + Radix UI
- **Deployment:** Vercel

## 🧊 Sanity Studio

- Copy `env.example` → `.env.local`, then fill the Sanity values (project `lwvgcasl`, dataset `production`).
- Start the embedded Studio via `npm run dev` → [http://localhost:3000/studio](http://localhost:3000/studio).
- Standalone/hosted workflows:
  - `npm run studio:dev` — faster schema hot reload on `http://localhost:3333`.
  - `npm run studio:deploy` — deploy Studio to Sanity’s managed hosting.
  - `npm run studio:manage` — open the Sanity manage dashboard for datasets, tokens, and webhooks.
- Detailed instructions live in `docs/sanity-studio-setup.md`.

## 📂 Directory Structure

- `src/app`: App Router pages and layouts
- `src/components`: UI components (atomic designish)
- `src/lib`: Utilities, CMS clients, SEO helpers
- `styles`: Global styles and tokens

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
