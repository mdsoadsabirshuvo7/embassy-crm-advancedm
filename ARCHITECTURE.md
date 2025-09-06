# Architecture Overview

## Stack
- Vite + React + TypeScript
- TanStack React Query for async/data cache (migrating from custom DataContext)
- LocalStorage + lightweight offline wrapper for persistence & audit trail
- Tailwind + shadcn/ui component primitives

## Data Layers
1. Services (`src/services/*`): CRUD wrappers around LocalStorageService or remote (future)
2. React Query hooks (`src/hooks/*`): Cache & optimistic updates
3. Contexts (`src/contexts/*`): Auth, Modules, Notifications, legacy DataContext (being decomposed)
4. UI Components: Presentational, minimal business logic

## State Migration Plan
- Expense slice completed with React Query + optimistic mutations
- Next candidates: Tasks, Clients
- Each migration introduces: `use<Domain>Query`, mutation hooks, invalidation on write

## Audit Logging
- `auditLogger` writes structured entries to offline storage `audit_logs`
- Viewer component lazy loads and exports via `ExportService`

## Export Pipeline
- Single `ExportService` dynamically imports heavy libs (jspdf/xlsx)
- `useExport` hook (not shown here) provides UI wiring

## Permission System
- Module gating via `ModuleContext`
- Fine-grained action policy via `utils/permissions.ts` (action -> roles)
- `AccessDenied` surfaces quick-enable button if role allows

## Theming & UX
- Dark/light via design tokens (pending contrast audit task)
- Column chooser preferences persisted per table via localStorage (example: Expenses)

## Schema Versioning
- `LocalStorageService` tracks `crm_schema_version`, runs linear migrations

## Error Boundaries
- Global (root) + per-route (e.g. Expenses) boundaries to isolate failures

## Pending / Roadmap
- Migrate Tasks to React Query with optimistic updates + audit logging
- Add Vitest + RTL harness & initial smoke tests
- Implement dark mode contrast analyzer script
- Add prefetch-on-hover for sidebar nav (dynamic import warming)
- Optional service worker shell + asset caching
- Normalize relational selectors (employees/clients) into lookup caches

## Build & Performance
- Route-level code splitting via `React.lazy`
- Manual chunk strategy in `vite.config.ts` (not shown) for vendor separation

---
This document should evolve with each architectural change—please keep it updated.
