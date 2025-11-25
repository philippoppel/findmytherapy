# Repository Guidelines

This pnpm + Turbo monorepo coordinates a Next.js client, background workers, and shared packages. Follow the practices below to contribute effectively.

## Project Structure & Module Organization

- `apps/web`: Next.js 14 app; UI lives in `app/` routes, reusable pieces in `components/`, shared hooks in `lib/`, locale bundles in `i18n/`.
- `apps/worker`: BullMQ worker in `src/`; builds into `dist/` for queue processing.
- `packages/db`: Prisma schema (`prisma/schema.prisma`) and database utilities shared across services.
- `packages/ui`: React + Tailwind components exported for web and future surfaces.
- `packages/config`, `packages/tsconfig`, `packages/eslint-config`: centralize environment, TypeScript, and lint settings.
- `infrastructure/terraform`: AWS IaC; keep in sync with schema and queue changes.

## Build, Test, and Development Commands

- `pnpm install`: install workspace dependencies respecting the lockfile.
- `pnpm dev`: run Turbo-powered dev servers (`next dev` and worker `tsx watch`).
- `pnpm --filter web build` / `pnpm --filter worker build`: produce optimized builds for each app.
- `pnpm test`: run the Turbo test pipeline (Jest per package, emits `coverage/`).
- `pnpm lint` and `pnpm format`: enforce ESLint + Prettier before committing.
- `docker-compose up -d`: start Postgres, Redis, and Mailhog for local development.

## Coding Style & Naming Conventions

- TypeScript everywhere; prefer explicit interfaces and narrow types (lint forbids `any`).
- Components and hooks use PascalCase and `useX` naming; utilities use camelCase file names.
- Use Tailwind utility-first styling; colocate class-heavy variants with `class-variance-authority`.
- Prettier governs formatting (2-space indent, trailing commas); keep imports sorted logically.

## Testing Guidelines

- Add Jest specs alongside source files as `*.test.ts[x]`; mock Prisma/Stripe via fixtures.
- Accessibility and e2e checks run through Playwright (`pnpm e2e`, `pnpm e2e:ui`); tag slow suites with `@slow`.
- Ensure coverage thresholds stay stable; review combined reports under `coverage/lcov-report/index.html`.

## Commit & Pull Request Guidelines

- Use Conventional Commits (`feat(web): add therapist filters`) to optimize Turbo caching and changelog hygiene.
- Keep commits scoped and linted; Husky + lint-staged run ESLint/Prettier on staged files.
- Open PRs with a summary, testing evidence (`pnpm test` output), linked issue, and UI screenshots for frontend tweaks.
- Request reviews from owners of affected packages; call out schema changes so Terraform/DB owners can coordinate.

## Environment & Security Notes

- Copy environment templates from `.env.example`; never commit secrets.
- Run Prisma flows (`pnpm db:push`, `pnpm db:seed`) whenever altering `packages/db/prisma/schema.prisma`.
- Keep Stripe CLI listening locally (`pnpm stripe:listen`) when developing payment flows.
