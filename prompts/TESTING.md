# Testing Strategy — Ad Creative Intelligence

## 1. Testing goals
Verify the app accepts valid inputs, rejects invalid data safely, calculates metrics correctly, represents uncertainty honestly, and supports the upload-to-results journey at desktop and mobile sizes.

## 2. Test types and tools
- **Unit:** Vitest.
- **Component/integration:** Vitest + React Testing Library + user-event.
- **End-to-end:** Playwright.
- **Static checks:** ESLint and TypeScript.
Do not claim a check passed unless it was actually run.

## 3. Test organization
```text
tests/
├── unit/
│   ├── csv-validation.test.ts
│   ├── metrics.test.ts
│   ├── analysis.test.ts
│   └── export.test.ts
├── integration/
│   ├── upload-flow.test.tsx
│   └── results-filtering.test.tsx
└── e2e/
    └── core-analysis.spec.ts
```

## 4. Critical test cases
### CSV parsing and validation
- Valid CSV with expected headers.
- Alternate header mapping.
- Empty file, header-only file, malformed row, duplicate creative ID.
- Quoted commas, escaped quotes, and embedded newlines.
- Negative values, non-numeric values, missing required columns.
- Clicks greater than impressions where aggregation makes the comparison valid.
- Extra unknown columns are preserved or clearly reported.
- Oversized and unsupported files are rejected.

### Metric calculations
- CTR from clicks/impressions.
- CVR from conversions/clicks.
- CPC from spend/clicks.
- CPA from spend/conversions.
- ROAS from revenue/spend.
- Zero denominator returns unavailable/null, never NaN/Infinity.
- Missing values remain missing, not zero.
- Aggregated rates use correct numerators and denominators rather than blindly averaging row-level percentages.

### Statistical findings
- Group sample sizes are accurate.
- Effect-size direction is labeled clearly.
- Confidence interval is only shown when a supported method calculates it.
- Underpowered/ineligible groups do not receive a fabricated confidence interval.
- Status thresholds are tested and documented.
- Findings contain method and limitations.
- Results are described as associations, not causal effects.

### UI and flows
- Demo mode reaches dashboard/results.
- Upload screen displays selected filenames and validation errors.
- User can correct column mapping.
- Loading, empty, success, and error states render.
- Finding filters update visible results.
- Finding detail shows effect, sample size, method, and limitations.
- Export output matches the current results/filter selection.
- Keyboard navigation, focus visibility, labels, and status text are present.
- Layout works at 320px, tablet, and desktop widths.

## 5. Critical user flow
**Flow: Demo or upload → results**
1. User opens landing page.
2. User selects Start Analysis or Demo Mode.
3. User uploads image assets and CSV, or loads demo data.
4. App parses CSV and displays validation preview.
5. User maps required columns and confirms validation.
6. App calculates available metrics and eligible findings.
7. User inspects dashboard and filters findings.
8. User opens one finding and reads method/limitations.
9. User exports findings.
**Expected result:** No crash; each visible metric is valid; missing or unsupported analysis is explained.

## 6. Coverage and prioritization
Prioritize correct business logic over a headline coverage percentage. Target high coverage for metric functions, CSV validation, and evidence classification. Cover each critical flow and known failure state. Avoid tests that merely duplicate implementation details.

## 7. Commands
Expected scripts (add to `package.json`):
- `npm run dev` — start Vite.
- `npm run build` — production build.
- `npm run lint` — ESLint.
- `npm run typecheck` — TypeScript check.
- `npm run test` — Vitest.
- `npm run test:e2e` — Playwright, if configured.
The agent must confirm actual script names in `package.json` before running or documenting them as available.

## 8. Definition of done
- [ ] Relevant unit/component tests pass.
- [ ] Lint passes.
- [ ] Type check passes.
- [ ] Production build passes.
- [ ] Critical flow is manually or automatically verified.
- [ ] No blocking console errors.
- [ ] Known limitations and unrun checks are reported.
