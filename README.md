# Logos

**Live:** https://logos-91c8e.web.app/

Logos is an AI-powered Bible study and devotional web application. It combines scripture reading, daily devotionals, an AI conversational mentor, journaling, and a Retrieval-Augmented Generation (RAG) pipeline backed by a curated library of theological and philosophical source material.

---

## Features

- **Bible Reader** -- Full Bible reading experience powered by the YouVersion Platform API. Supports multiple translations (BSB, NIV, WEB), chapter-by-chapter navigation with cross-book boundaries, and a chapter picker with OT/NT grouping.
- **Today Page** -- Daily verse of the day (curated rotation), AI-generated daily prayer via Gemini, and streak tracking.
- **AI Mentor ("Peter")** -- Conversational AI grounded in logic and historical evidence. Uses a tiered RAG system to retrieve context from vectorized theological, philosophical, and historical sources before responding.
- **Diary / Journal** -- Personal journaling with entry management backed by Firestore.
- **Annotations** -- Highlight and annotate Bible passages.
- **User Profiles** -- Firebase Authentication with onboarding flow and user profile management.
- **RAG Pipeline** -- PDF ingestion, semantic chunking, Vertex AI embeddings, Firestore vector search (`findNearest`), semantic caching, and multi-model tiering (Gemini Flash / Pro).

---

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Frontend         | React, Vite, TypeScript, Tailwind CSS            |
| UI Components    | Shadcn UI, Framer Motion                         |
| API Layer        | tRPC (end-to-end type safety)                    |
| Data Fetching    | TanStack Query                                   |
| Backend          | Firebase Cloud Functions (Node.js 22)            |
| Database         | Firestore (NoSQL + native vector search)         |
| AI / LLM         | Vertex AI (Gemini Flash, Gemini Pro)             |
| Embeddings       | Vertex AI text-embedding-004                     |
| Auth             | Firebase Authentication                          |
| Hosting          | Firebase Hosting                                 |
| Build System     | Turborepo, pnpm workspaces                       |
| CI/CD            | GitHub Actions, Workload Identity Federation     |
| Testing          | Vitest                                           |
| Code Quality     | ESLint, Prettier, Husky, lint-staged, Changesets |

---

## Project Structure

```
logos/
├── apps/
│   ├── web/                  # React frontend (Vite + Tailwind)
│   │   └── src/
│   │       ├── pages/        # TodayPage, BiblePage, DiaryPage, ProfilePage,
│   │       │                 # Auth, Onboarding, LandingPage, Splash
│   │       ├── components/   # Organized by feature: bible/, today/, diary/,
│   │       │                 # profile/, layout/, atoms/
│   │       ├── hooks/        # useBible, useDiary, useStreak, useAnnotations,
│   │       │                 # useReadingProgress, useBibleSettings
│   │       ├── lib/          # tRPC client, query client, AI modal context
│   │       └── providers/    # AuthProvider, QueryProvider
│   │
│   └── functions/            # Firebase Cloud Functions (tRPC backend)
│       └── src/
│           ├── trpc/routers/ # bible, diary, annotations, user routers
│           ├── rag.ts        # RAG pipeline (retrieval, context assembly)
│           ├── gcsIngest.ts  # PDF ingestion from Cloud Storage
│           ├── chunking.ts   # Semantic text chunking
│           ├── embeddings.ts # Vertex AI embedding generation
│           └── bookCatalog.ts# Source library metadata and catalog
│
├── packages/
│   ├── ui/                   # Shared React components (Header, Counter, Shadcn UI)
│   ├── shared/               # Shared Zod schemas and TypeScript types
│   ├── config/               # Shared project configuration
│   ├── eslint-config/        # Shared ESLint rules
│   └── typescript-config/    # Shared tsconfig base
│
├── sources/                  # PDF source library for RAG (theology,
│                             # philosophy, history -- organized by tier)
├── docs/                     # Design docs, implementation notes, CI/CD guides
├── scripts/                  # Infrastructure setup scripts (WIF)
├── .github/workflows/        # CI, deploy-dev, deploy-stage, deploy-main,
│                             # release, dependency-review
├── firebase.json             # Hosting + Functions configuration
├── firestore.rules           # Security rules
├── turbo.json                # Turborepo pipeline config
└── pnpm-workspace.yaml       # Workspace definition (apps/*, packages/*)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
git clone <your-repo-url>
cd logos
pnpm install
```

### Development

```bash
# Start development servers
pnpm dev

# Run all quality checks (lint, typecheck, build, test)
pnpm precheck

# Run tests
pnpm test

# Build for production
pnpm build
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values. The backend requires a YouVersion API key (stored in Google Secret Manager) and Vertex AI credentials.

---

## Scripts Reference

| Command              | Description                                   |
| -------------------- | --------------------------------------------- |
| `pnpm dev`           | Start development servers                     |
| `pnpm build`         | Build all packages for production             |
| `pnpm test`          | Run all tests                                 |
| `pnpm test:coverage` | Run tests with coverage report                |
| `pnpm lint`          | Lint all packages                             |
| `pnpm lint:fix`      | Auto-fix lint issues                          |
| `pnpm format`        | Format code with Prettier                     |
| `pnpm format:check`  | Check code formatting                         |
| `pnpm typecheck`     | Run TypeScript type checking                  |
| `pnpm precheck`      | Run all checks (lint, typecheck, build, test) |
| `pnpm changeset`     | Create a changeset for versioning             |
| `pnpm sync:lint`     | Check dependency version consistency          |
| `pnpm sync:fix`      | Fix dependency version mismatches             |

---

## CI/CD Pipeline

Deployments use GitHub Actions with Workload Identity Federation for keyless GCP authentication.

| Branch  | Environment | Deployment    |
| ------- | ----------- | ------------- |
| `dev`   | Development | Auto on push  |
| `stage` | Staging     | Auto on push  |
| `main`  | Production  | Manual trigger|

See [docs/ci-cd/CI-CD-Pipeline-Guide.md](docs/ci-cd/CI-CD-Pipeline-Guide.md) for detailed setup instructions.

---

## Boilerplate

The monorepo scaffolding and infrastructure for this project is provided by **Hytel**. The original boilerplate includes the Turborepo workspace configuration, shared packages structure, CI/CD pipelines, ESLint/Prettier/Husky tooling, and the tRPC + React starter wiring.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and guidelines.

---

## License

This project is private.
