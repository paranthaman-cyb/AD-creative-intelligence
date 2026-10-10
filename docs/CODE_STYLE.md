# Code Style & Conventions — Ad Creative Intelligence

## 1. General principles
- Prefer readable, direct TypeScript over clever abstractions.
- Keep changes focused and avoid unrelated rewrites.
- Reuse established UI components and utilities.
- Keep business logic separate from rendering.
- Name assumptions and limitations explicitly.
- Do not invent product behavior that conflicts with `PRD.md`.

## 2. Naming
- React components and types: `PascalCase`.
- Functions, hooks, variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for fixed global configuration; otherwise `camelCase`.
- Hooks: `useSomething`.
- Component files: `FindingCard.tsx`, `UploadDropzone.tsx`.
- Utility files: `calculateMetrics.ts`, `validateCsv.ts`.
- CSS variables: `--color-primary`, `--surface-card`.
- Domain fields: `camelCase` in TypeScript; `snake_case` in persisted database schema.

## 3. Folder rules
- Route-level screens live in `src/pages/`.
- Reusable visual primitives live in `src/components/ui/`.
- Domain-specific components live in `src/features/<feature>/`.
- Pure business logic lives in `src/services/`.
- Shared types live in `src/types/`.
- Demo fixtures live in `src/data/demo/`.
- Tests live in `tests/` or next to the module when that pattern is established.
- Keep docs and reference images out of the compiled `src/` tree.

## 4. TypeScript and React
- Enable strict TypeScript.
- Avoid `any`; use `unknown` and narrow it when input is untrusted.
- Use function components and hooks.
- Use props for component inputs; avoid hidden global state.
- Keep components focused; extract a child when it clarifies responsibility or supports reuse.
- Use stable keys when rendering lists.
- Do not suppress TypeScript errors to get a build through without understanding the issue.

## 5. Imports and dependencies
- Group imports consistently: React/external packages, internal modules, types, styles.
- Use the configured alias (e.g. `@/`) only if it is set up and documented.
- Avoid circular dependencies.
- Do not add a dependency for functionality that can be implemented clearly with existing tools.
- Use `Papa Parse`, `Zod`, and `Recharts` for their defined purposes; do not duplicate them with ad hoc alternatives.

## 6. Business logic
- Metric and statistical functions must be pure where possible.
- Document metric formulas, denominator, and missing-data behavior.
- Never return `NaN` or `Infinity` for display.
- Distinguish unavailable values from zero.
- Keep thresholds for evidence classification centralized and documented.
- Include method and caveats with each finding.
- Use association language; do not claim causality.

## 7. Error handling
- Validate at boundaries.
- Return typed validation results for expected input problems.
- Use user-facing errors with recovery actions.
- Keep developer diagnostics separate from end-user copy.
- Do not swallow errors or use empty catch blocks.
- Do not show raw stack traces in the UI.

## 8. Comments and documentation
Comments explain why a decision exists, not what an obvious line does.
Update documentation when behavior, data shape, metric definition, dependencies, or security posture changes.

## 9. Formatting and checks
- Formatter: Prettier.
- Linter: ESLint.
- Type checking: `tsc --noEmit`.
- Unit/component tests: Vitest + React Testing Library.
- E2E: Playwright for critical flows when configured.
- Keep scripts in `package.json` accurate; do not claim a command exists until it is added.

## 10. Do / Don't
### Do
- Follow `DESIGN_SYSTEM.md`.
- Add tests for metric calculations and parsing edge cases.
- Keep status text accessible without color.
- Make assumptions explicit.

### Don't
- Add Streamlit.
- Put statistical calculations inside JSX.
- Use fake statistical confidence values.
- Add AI model claims without a real implementation.
- Commit uploaded user data, secrets, build artifacts, or local environment files.
