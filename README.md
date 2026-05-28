<!-- README.md -->

# AIGC Friendly Frontend

`aigc-friendly-frontend` is the companion frontend baseline for
`../aigc-friendly-backend`.

It is not expected to fully integrate with the backend on day one. The current goal is to provide a
small, AI-friendly React frontend that already matches the backend's architectural direction:
clear ownership, explicit boundaries, GraphQL-first ingress, readable rule docs, and enough runtime
structure for AI agents to safely extend.

## Positioning

The backend is a NestJS + GraphQL framework baseline with strict
`adapters -> usecases -> modules -> infrastructure` rules, auth/session contracts, account and
verification primitives, AI/email worker queues, and async audit records.

This frontend mirrors that philosophy on the client side:

- stable code is split into `app / pages / widgets / features / entities / shared`
- experiments go through `labs`
- throwaway prototypes go through `sandbox`
- GraphQL access goes through `src/shared/graphql`
- AI interaction UI stays separate from normal business UI
- backend-specific screens are added only when their owner and route contract are clear

## Current Scope

Included now:

- React 19 + TypeScript + Vite
- React Router Data Mode
- Ant Design for business UI
- Ant Design X for AI interaction UI
- Tailwind 4 for layout wrappers
- Apollo GraphQL client/runtime
- App shell, route catalog, local AI sidecar, labs, sandbox
- GraphQL ingress error model aligned with backend `UNAUTHENTICATED` semantics
- Generic upstream access lifecycle without concrete upstream business interfaces
- Rule docs for layering, dependencies, infrastructure, labs, sandbox, and stable clean splitting

Not included yet:

- generated GraphQL schema/types
- real login/register/account pages
- async task or worker audit screens
- backend-specific business workflows
- payload crypto tooling or concrete upstream API payload adapters

## Backend Alignment

The frontend currently assumes these backend contracts:

- GraphQL endpoint is configured with `VITE_GRAPHQL_ENDPOINT`
- auth/session failure is detected through top-level GraphQL errors where
  `errors[].extensions.code === 'UNAUTHENTICATED'`
- `extensions.errorCode` is diagnostic/detail information, not a production branching contract
- HTTP `401` is only a transport fallback
- frontend auth refresh, when added, should be injected into `shared/graphql` through
  `configureGraphQLRuntime`

Relevant local docs:

- [docs/project-convention/graphql-error-model.md](./docs/project-convention/graphql-error-model.md)
- [docs/project-convention/graphql-ingress-auth-boundary.md](./docs/project-convention/graphql-ingress-auth-boundary.md)
- [docs/project-convention/upstream-access-frontend-ownership.md](./docs/project-convention/upstream-access-frontend-ownership.md)

Backend source of truth remains in `../aigc-friendly-backend/docs/api/` and
`../aigc-friendly-backend/docs/common/`.

## Quick Start

```bash
npm install
npm run dev
```

Useful checks:

```bash
npx tsc --noEmit
npm run lint
npm run format:check
npm run build
```

For larger changes, run:

```bash
npm run check
```

## Env

Env files live under `env/`, matching the backend workspace convention.

For local backend pairing, create `env/.env.development.local`:

```bash
VITE_APP_ENV=dev
VITE_GRAPHQL_ENDPOINT=http://127.0.0.1:3000/graphql
VITE_API_HEALTH_ENDPOINT=http://127.0.0.1:3000/health
```

The frontend can still run without the backend. The current workbench and local sidecar do not
require a live API.

## Structure

```txt
src/
  app/       router, layout shell, providers, navigation truth
  pages/     route-level composition
  widgets/   page-scale reusable UI blocks
  features/  user actions and local workflows
  entities/  stable business types and lifecycle models
  shared/    generic infra and ownerless utilities
  labs/      gated production experiments
  sandbox/   dev/test-only prototypes
```

Read [docs/README.md](./docs/README.md) before asking an AI agent to add new code.

## Development Rules

- Use public barrels for cross-module imports.
- Keep stable code independent from `labs` and `sandbox`, except route registration in
  `app/router`.
- Use Ant Design component APIs and tokens for business UI.
- Use Ant Design X only for AI interaction surfaces.
- Put Tailwind classes on wrapper elements, not on Ant Design component bodies.
- Put concrete backend API adapters in the owning feature/lab, not in `shared/graphql`.
- Keep GraphQL transport behavior in `shared/graphql`.

## Roadmap

Likely next steps:

- add auth feature around backend `login` and session restore
- add minimal public auth pages when backend route intent is confirmed
- add account/profile surfaces after the frontend view model is clear
- add async task audit views for AI/email worker debugging
- add generated or typed GraphQL operation workflow when the schema stabilizes for frontend use
