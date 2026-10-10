# Data Model — Ad Creative Intelligence

## 1. Database strategy
**MVP default:** No server database required. Keep the current analysis in memory and load bundled demo data. If persistence is useful, store only user-approved session metadata locally; do not store raw uploaded files without a clear user-facing reason.
**Optional backend:** SQLite for a local prototype, PostgreSQL for multi-user deployment after that scope is approved.

## 2. Naming conventions
- TypeScript properties: `camelCase`.
- Database tables/columns (if enabled): `snake_case`.
- Primary keys: UUIDs or stable generated IDs.
- Timestamps: ISO 8601 UTC.
- Missing/unknown values: `null`, not empty strings or fabricated zeros.
- Keep imported source fields separate from normalized canonical fields.

## 3. Domain entities
### AnalysisSession
Purpose: One upload/demo analysis run.
- `id: string`
- `name: string`
- `source: "upload" | "demo"`
- `createdAt: string`
- `status: "draft" | "validating" | "ready" | "analyzing" | "complete" | "error"`
- `metricSelection: MetricKey`
- `recordCount: number`
- `warnings: ValidationWarning[]`

### Creative
Purpose: An advertisement creative and its optional image asset.
- `id: string`
- `analysisSessionId: string`
- `sourceCreativeId: string | null`
- `name: string | null`
- `imageObjectUrl: string | null` (temporary browser URL; revoke when no longer needed)
- `imageFileName: string | null`
- `imageWidth: number | null`
- `imageHeight: number | null`
- `aspectRatio: number | null`
- `attributes: CreativeAttribute[]`
- `matchStatus: "matched" | "image_missing" | "performance_missing" | "unmatched"`

### PerformanceRecord
Purpose: Aggregated performance data for a creative and optional campaign/time period.
- `id: string`
- `analysisSessionId: string`
- `creativeId: string | null`
- `sourceRowNumber: number`
- `campaignId: string | null`
- `date: string | null`
- `impressions: number | null`
- `clicks: number | null`
- `conversions: number | null`
- `spend: number | null`
- `revenue: number | null`
- `rawFields: Record<string, string | number | null>`

### CreativeAttribute
Purpose: One attribute value plus provenance.
- `key: string`
- `value: string | number | boolean | null`
- `source: "heuristic" | "imported" | "manual"`
- `confidence: number | null` (only if a real, defined confidence value exists)
- `reviewed: boolean`

### Finding
Purpose: An inspectable association between an attribute/group and a metric.
- `id: string`
- `analysisSessionId: string`
- `attributeKey: string`
- `metric: MetricKey`
- `groupLabels: string[]`
- `groupValues: number[]`
- `effectSize: number | null`
- `confidenceInterval: [number, number] | null`
- `sampleSize: number`
- `status: "supported" | "inconclusive" | "underpowered" | "not_available"`
- `method: string`
- `limitations: string[]`
- `summary: string`

## 4. Relationships
- One `AnalysisSession` has many `Creative` records.
- One `AnalysisSession` has many `PerformanceRecord` rows.
- A `PerformanceRecord` may link to a `Creative` by canonical creative ID.
- One `AnalysisSession` has many `Finding` records.
- Creative attributes belong to a creative and carry provenance.

## 5. Constraints and validation
- IDs must be stable within one session.
- Impressions, clicks, conversions, spend, and revenue cannot be negative.
- When data represents compatible aggregation, clicks should not exceed impressions and conversions should not exceed clicks; flag exceptions for review rather than assuming every source uses identical attribution windows.
- Avoid duplicate rows caused by accidental repeated imports; report duplicates and require an explicit policy.
- Metrics must handle missing values and zero denominators.
- Findings must retain their method, sample size, group labels, and limitations.

## 6. Indexes (backend only)
- `performance_records(analysis_session_id, creative_id)`
- `findings(analysis_session_id, metric, status)`
- `creatives(analysis_session_id, source_creative_id)`
Add indexes only when a real query pattern justifies them.

## 7. Validation and migration rules
- Validate incoming data both in the UI and server-side if an API exists.
- Document schema changes and add migrations before persistent deployment.
- Test migrations against a representative fixture.
- Never silently discard unknown CSV columns; preserve them as raw fields where feasible.

## 8. Deletion, auditing, sensitive data
- MVP: clear current session on reset/refresh unless an explicit local save feature exists.
- Revoke temporary object URLs when no longer needed.
- If persistent sessions are added, define deletion/retention behavior before release.
- Do not store account identifiers or personal data that is not required for analysis.
- Do not log raw uploaded rows or creative file contents.

## 9. Demo data
Provide a small, labeled demo dataset with several creatives, a range of impressions/clicks/outcomes, and enough group variation to demonstrate the UI. Include edge-case fixtures separately for tests. Demo values must never be presented as a user's real account data.
