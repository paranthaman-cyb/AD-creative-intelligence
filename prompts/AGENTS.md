# AI Coding Agent Instructions — Ad Creative Intelligence

## 1. Project context
- **Project:** Ad Creative Intelligence.
- **Purpose:** Analyze advertisement creative assets alongside performance CSV data and present transparent, evidence-based associations.
- **Primary users:** Performance marketers, growth analysts, and creative strategists.
- **UI:** React web application, white-and-purple design, responsive dashboard and analysis flows.
- **Hard constraint:** Do not use Streamlit.

## 2. Read the source of truth
Before significant changes, read the relevant files in `docs/`:
- `PRD.md` — product behavior and scope.
- `DESIGN_SYSTEM.md` — visual language and screen guidance.
- `ARCHITECTURE.md` — stack, modules, project structure, dependency rules.
- `DATABASE.md` — domain data shapes and persistence assumptions.
- `SECURITY.md` — upload/data protection.
- `CODE_STYLE.md` — implementation conventions.
- `TESTING.md` — validation requirements.

The design screenshot is at `assets/design-references/ad-creative-intelligence-ui.png`. Treat it as a reference for information architecture and styling, not a source of exact implementation details. The second reference image, `assets/design-references/document-map-reference.png`, shows the eight-document map.

## 3. Stack guardrails
- React + TypeScript + Vite.
- Tailwind CSS; reusable UI primitives inspired by shadcn/ui.
- React Router, Lucide React, Recharts, Papa Parse, Zod.
- Vitest + React Testing Library; Playwright for E2E if configured.
- No Streamlit and no unrelated framework substitution.
- Client-side-first MVP. Add FastAPI/Python only if the task genuinely requires server-side processing or persistence, and update architecture docs first.

## 4. Implementation workflow
For non-trivial work:
1. Inspect the current repository and the relevant documentation.
2. Confirm the existing stack and scripts before editing.
3. Identify affected files and dependencies.
4. Write a short implementation plan.
5. Implement one coherent feature at a time.
6. Add or update tests for business logic and critical UI states.
7. Run applicable tests, lint, typecheck, and build.
8. Review the diff for unrelated changes and update docs if needed.

## 5. Product and evidence rules
- Do not invent product requirements; flag unresolved decisions.
- Use the canonical domain types from the project.
- Keep CSV parsing, metrics, statistics, and export logic outside React rendering components.
- Never fabricate p-values, confidence intervals, sample sizes, or model confidence.
- Show the sample size, method, and limitations for each inferential finding.
- Describe results as associations; do not claim that a creative attribute caused an outcome.
- Clearly label demo data.
- Distinguish unavailable/missing values from actual zero values.
- Make the source of each creative attribute visible: heuristic, imported, or manual.

## 6. Design rules
- Follow the white/lavender canvas, dark-purple sidebar, purple primary action, white cards, subtle borders, and accessible status treatments in `DESIGN_SYSTEM.md`.
- Reuse components instead of duplicating visual patterns.
- Keep landing, upload, dashboard, results, and finding-detail screens visually consistent.
- Make the interface responsive; no accidental horizontal page overflow.
- All controls must work, have accessible names, and expose visible focus states.
- Do not use color alone to communicate supported/inconclusive/underpowered status.

## 7. Security rules
- Treat uploads and CSV cell contents as untrusted.
- Validate file type, size, parsing, and numeric fields.
- Render CSV values as text; never inject them as HTML.
- Never commit secrets or real user datasets.
- Do not send uploaded data to external services unless the user explicitly approves the behavior and the UI discloses it.
- Avoid logging raw CSV rows or image contents.

## 8. Conflict handling
If code, documentation, and a request disagree:
1. Identify the specific conflict.
2. Prefer the user's latest explicit requirement if it is safe and technically feasible.
3. Update affected documentation when the decision is clear.
4. Ask a concise clarification when the decision materially affects scope, data, security, or architecture. Do not silently guess.

## 9. Completion report
When a task is finished, report:
- What changed and the key files.
- Tests, lint, typecheck, and build actually run, with outcomes.
- Any checks not run.
- Known limitations, assumptions, or unresolved decisions.
A task is not complete merely because code was written.
