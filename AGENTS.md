<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository facts

- Single npm package: Next.js 16.4.6 App Router, React 19.3, TypeScript. `package-lock.json` is authoritative; use `npm ci` and npm scripts. README's pnpm/yarn/bun and `app/page.tsx` hints are create-next-app boilerplate; the real homepage is `src/app/(public)/page.tsx`.
- App Router uses `src/app`, with `@/*` -> `src/*`. `(public)` owns the shared navbar/footer layout; `(auth)` is URL-less (`/sign-in`, `/sign-up`).
- `src/components/ui/*` are shadcn-generated (`components.json`, style `base-nova`). Tailwind 4 lives in `src/app/globals.css` plus the Turbopack loader in `next.config.ts`; there is no `tailwind.config.*`.
- Auth is Better Auth: `src/app/lib/auth.ts` (Mongo + Google OAuth), `src/app/api/auth/[...all]/route.ts` (catch-all API), `src/app/lib/auth-client.ts` (browser client). Role redirects target `/dashboard/{customer,technician,admin}`, but those routes do not exist yet.

## Commands and checks

- `npm run dev`, `npm run build`, `npm run start`, `npm run lint`. No test or typecheck script; use `npx --no-install tsc --noEmit`.
- `npm run build` and `tsc --noEmit` passed on 2026-11-22.
- `npm run lint` currently fails on unmodified generated/legacy files: `src/components/ui/carousel.tsx:98` and `src/hooks/use-mobile.ts:14` (`react-hooks/set-state-in-effect`, enabled by React Compiler). Don't chase these unless you touch those files.
- Use `npm run build` (not just dev) when changing routing, caching, or `useSearchParams`; dev can hide prerender/Suspense failures.

## Environment and Next 16 quirks

- `.env` is gitignored; needed keys: `MONGODB_URI`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. `MONGODB_URI` is required for dev/build because `auth.ts` constructs `MongoClient` at import time. No `.env.example`, DB compose file, or migrations.
- `BETTER_AUTH_URL` is read in browser-imported `auth-client.ts` without `NEXT_PUBLIC_`; Next does not inline it. Verify before debugging auth base URL/redirects.
- `next.config.ts` enables `cacheComponents` + `partialPrefetching` and React Compiler. Data is dynamic by default; don't add `runtime` route segment exports. Read installed docs in `node_modules/next/dist/docs/` before changing cache/navigation behavior.
- Do not edit the managed blocks between `nextjs-agent-rules` / `nextjs-agent-feedback` markers; `next dev` rewrites them (feedback block may appear on first dev run).
- Client components using `useSearchParams` must stay inside `Suspense` for production builds (sign-in already does).
