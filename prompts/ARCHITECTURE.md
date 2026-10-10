# Architecture — Ad Creative Intelligence

## 1. System overview
A responsive React application guides users through creative upload, CSV validation, feature review, statistical analysis, results exploration, and export. The MVP should be able to run locally with a bundled demo dataset and client-side parsing. Keep computation and UI separated so a backend can be added without rewriting the interface.

## 2. Architecture pattern
**Pattern:** Modular frontend application, with an optional thin Python API for heavier analysis.
**Reason:** The build is time-boxed. Vite + React gives fast setup and iteration. Keep business logic in pure TypeScript modules for testability. Do not introduce microservices.

## 3. Technology stack
### Required frontend
- React 18+ with TypeScript.
- Vite.
- React Router for page navigation.
- Tailwind CSS for styling, with reusable UI primitives inspired by shadcn/ui.
- `lucide-react` for icons.
- Recharts for charts.
- Papa Parse for CSV parsing.
- Zod for input/schema validation.
- Vitest + React Testing Library for unit/component tests.
- Playwright for critical end-to-end flows when time allows.

### MVP computation
- Client-side CSV parsing and deterministic metric calculations in TypeScript.
- Use a pure `analysis` service layer; never calculate business metrics inline inside React components.
- Image metadata and simple color/dimension heuristics may run in the browser. Do not claim robust semantic image understanding without a real model.
- Demo data should be clearly labeled as demo data.

### Optional backend, only if required
- Python 3.12 + FastAPI.
- pandas for tabular processing; Pillow for image metadata/basic processing; SciPy or statsmodels only for documented statistical methods.
- SQLite for a local prototype; PostgreSQL if persistent multi-user deployment is approved.
- Pydantic for request/response validation.
Do not add this backend merely for architectural completeness if the MVP can be delivered reliably client-side. If added, frontend requests go through a typed API client; do not call the database from UI components.

### Tooling
- npm.
- ESLint + Prettier.
- TypeScript strict mode.
- `.env` for local configuration; never commit secrets.

## 4. Main application modules
- **App shell:** routes, navigation, responsive layout.
- **Upload module:** file picker/drop zone, file limits, parsing status.
- **Validation module:** header mapping, row validation, preview, actionable errors.
- **Creative module:** image metadata, creative records, editable labels.
- **Metrics module:** derived metric calculations and zero-denominator handling.
- **Analysis module:** group comparisons, effect estimates, confidence intervals, evidence classification.
- **Results module:** KPI summary, filters, ranked findings, finding detail.
- **Export module:** CSV serialization and print-friendly report.
- **Demo module:** representative seed data for a first-run experience.

## 5. Data flow
1. User selects images and a CSV, or opens demo mode.
2. Upload layer checks extension/MIME type and configured size limits.
3. CSV parser produces headers and rows.
4. Validation layer maps source columns to canonical fields and validates rows.
5. Normalized records are stored in application state.
6. Creative feature extraction attaches provenance to each attribute.
7. Analysis service computes metrics and eligible comparisons.
8. Results pages render the findings and limitations.
9. Export service serializes the current findings/filter state.

If a backend is enabled: send validated records/metadata through a typed API, validate again server-side, and return a versioned response schema.

## 6. Project structure
```text
ad-creative-intelligence/
├── docs/
│   ├── PRD.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── CODE_STYLE.md
│   ├── TESTING.md
│   └── AGENTS.md
├── assets/
│   └── design-references/
├── public/
│   └── demo/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── charts/
│   │   └── findings/
│   ├── features/
│   │   ├── upload/
│   │   ├── validation/
│   │   ├── creatives/
│   │   ├── dashboard/
│   │   ├── results/
│   │   └── export/
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AnalyzePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ResultsPage.tsx
│   │   ├── FindingDetailPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   ├── csv/
│   │   ├── metrics/
│   │   ├── analysis/
│   │   └── export/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── data/
│   │   └── demo/
│   ├── styles/
│   └── main.tsx
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── AGENTS.md
```

## 7. Dependency rules
- Pages compose feature components; they should not contain core statistical logic.
- UI components do not parse CSVs or calculate metrics.
- `services/` must not import React components.
- `types/` contains shared domain types, not UI state.
- Upload validation happens before analysis.
- All numeric calculations live in pure, tested functions.
- No component should directly access a database.
- Do not add a dependency when a small, readable utility is sufficient.

## 8. Key technical decisions
- **React, not Streamlit:** the requested product is a custom web UI and the supplied reference depicts a responsive multi-page web app.
- **TypeScript:** reduces mistakes in canonical data and finding schemas.
- **Vite:** fast local startup and build.
- **Client-side MVP first:** minimizes setup time and avoids transmitting ad data by default.
- **Explicit provenance:** each creative attribute records whether it was automatic, imported, or manually labeled.
- **Evidence over black-box scores:** every finding carries sample sizes and limitations.

## 9. Performance and scalability
- Parse large files in a controlled way and show progress; configure maximum file sizes.
- Avoid rendering every creative thumbnail at full resolution.
- Memoize expensive derived summaries only when profiling supports it.
- Keep analysis algorithms pure so they can later move to a worker or API.
- If files become too large for browser memory, move processing to a backend or Web Worker with an explicit product decision.

## 10. Failure scenarios
- **Invalid CSV:** show row/column-level validation errors and allow correction.
- **Unreadable image:** retain the record if valid data exists; mark image metadata unavailable.
- **No matching creative:** show unmatched data/assets separately; do not silently discard.
- **Zero denominator:** return unavailable/null metric, never Infinity or NaN in the UI.
- **Too little data:** display “Underpowered” or “Not enough data,” with a reason.
- **Analysis error:** preserve uploaded inputs where safe and allow retry.
- **Export failure:** show a clear error and keep the results view intact.
- **Optional API unavailable:** show retryable status; do not pretend analysis succeeded.
