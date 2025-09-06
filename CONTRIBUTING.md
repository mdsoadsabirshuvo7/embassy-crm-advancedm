# Contributing

Thank you for your interest in improving this project.

## Workflow
1. Fork & clone
2. Create feature branch from `main`
3. Run dev: `npm run dev`
4. Ensure lint passes: `npm run lint`
5. Keep changes atomic & documented in PR description

## Code Standards
- TypeScript strict where practical
- Prefer React Query for new data slices (localStorage backed)
- Dynamic import heavy libs (pdf/excel) via existing ExportService
- Keep UI components presentational; move logic to hooks/services
- Log mutations via `auditLogger`
- Use `POLICY` map for fine-grained permission checks

## Testing
- Add/extend Vitest + RTL smoke tests for new pages/components (pending test harness expansion)

## Performance
- Leverage route-level lazy imports
- Avoid large inline objects in render paths; memoize derived arrays

## Accessibility
- Provide descriptive text for interactive icons
- Maintain focus order & keyboard operability

## Commits
Format: `feat: ...`, `fix: ...`, `refactor: ...`, `docs: ...`, `test: ...`, `perf: ...`

## Releases
- Increment version in `package.json` when shipping user-visible features

## Security
- Do not commit secrets
- Report vulnerabilities privately first

---
Happy building!
