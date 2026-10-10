# Product Requirements Document — Ad Creative Intelligence

## 1. Product Overview
- **Product name:** Ad Creative Intelligence
- **One-line description:** A React web app that analyzes advertisement creative assets alongside performance data and presents evidence-based associations between creative attributes and campaign outcomes.
- **Product type:** Analytics web application / MVP.
- **Primary platform:** Responsive web.
- **Primary visual reference:** `assets/design-references/ad-creative-intelligence-ui.png`. Use it as the direction for layout, hierarchy, navigation, and the white-and-purple visual theme—not as a pixel-perfect implementation target.
- **Documentation basis:** Adapted from the eight core document structure in *The Vibe Coding Blueprint* supplied with this project.

## 2. Problem
Creative teams often review ads and performance spreadsheets separately. This makes it hard to identify which visual or copy attributes are associated with better results, and makes conclusions difficult to audit.
The app should bring creative assets, campaign metrics, extracted features, statistical comparisons, and evidence/limitations into one workflow.

## 3. Goals
### Primary goal
Enable a user to upload ad images and a CSV of performance data, validate the inputs, and inspect ranked creative findings with effect sizes, confidence intervals, sample sizes, and caveats.

### Secondary goals
- Make the upload and analysis process understandable in a short session.
- Show the evidence behind each finding rather than only a score or label.
- Support exporting findings and summary data.
- Keep the MVP fast to implement and usable with a demo dataset.

## 4. Target users
### Performance marketer / growth analyst
Needs to compare creative variations, identify patterns associated with CTR, CVR, CPA, and conversions, and explain findings to stakeholders.
Pain points: scattered assets and spreadsheets; uncertain sample sizes; confusing or overstated causal claims.

### Creative strategist / designer
Needs to understand which creative attributes are associated with performance and view example creatives alongside findings.
Pain points: vague feedback; lack of evidence; difficulty translating aggregate metrics into creative changes.

## 5. Core user stories
- As a marketer, I want to upload multiple ad images and a CSV so I can analyze creatives and performance together.
- As a user, I want column mapping and validation feedback so I can fix malformed data before analysis.
- As a user, I want to see ranked findings and their evidence strength so I can distinguish supported, inconclusive, and underpowered results.
- As a user, I want to open a finding to inspect group comparisons, sample size, confidence interval, example ads, method, and limitations.
- As a user, I want to filter findings by status and metric so I can focus on relevant results.
- As a user, I want to export a report so I can share analysis outside the app.

## 6. MVP features
### Feature A — Upload & validate
**Purpose:** Accept ad images and performance CSV data.
**Flow:** Choose/drop images → choose CSV → parse headers and sample rows → map required fields → validate → continue to results.
**Inputs:** JPG, JPEG, PNG, WebP images; CSV file.
**Expected CSV fields:** `ad_id` or `creative_id`, `impressions`, `clicks`, and at least one outcome metric such as `conversions`, `spend`, or `revenue`. Optional fields include `campaign_id`, `ad_name`, `headline`, `description`, `date`, `platform`, and precomputed creative labels.
**Acceptance criteria:**
- Reject unsupported file types and files above configured limits with actionable messages.
- Show parsed row count, column names, and validation errors before analysis.
- Validate numeric fields, non-negative values, unique/usable creative identifiers, and clicks not exceeding impressions where the row represents the same aggregation.
- Let users correct column mapping before proceeding.
- Preserve a clear empty, loading, success, and error state.
**Edge cases:** Empty CSV, malformed rows, duplicate IDs, missing images, images without matching data, zero impressions, inconsistent column names.

### Feature B — Creative feature extraction
**Purpose:** Create an initial set of inspectable creative attributes.
**MVP approach:** Prefer deterministic, transparent heuristics and user-provided labels over pretending to have a trained computer-vision model. Extract image dimensions/aspect ratio and a dominant-color approximation; allow manual or CSV-supplied labels for attributes such as contrast, text density, product-centered layout, CTA presence, and dominant color.
**Acceptance criteria:**
- Display which attributes were automatically derived versus manually supplied.
- Allow users to review/edit labels where feasible.
- Never imply an attribute is detected reliably if it is only a heuristic.
- Handle corrupt or unreadable images gracefully.

### Feature C — Performance analysis
**Purpose:** Compare creative attribute groups against selected performance metrics.
**Metrics:** CTR = clicks / impressions; CVR = conversions / clicks when available; CPC = spend / clicks; CPA = spend / conversions; ROAS = revenue / spend when available. Guard against division by zero.
**Acceptance criteria:**
- Explain metric definitions and denominators.
- Show group sizes and raw counts alongside derived rates.
- Compute an effect estimate and uncertainty interval where supported by the selected method.
- Label results `Supported`, `Inconclusive`, or `Underpowered` using documented thresholds.
- Include limitations and use association language, not causal claims.
- If the sample is too small or required fields are missing, explain why no inference is shown.

### Feature D — Results dashboard
**Purpose:** Provide a quick overview of analysis.
**Acceptance criteria:**
- Show KPI cards for creatives analyzed, impressions, clicks, and conversions when available.
- Show metric trends only when dates or a valid ordered dimension exist.
- Show an evidence summary by finding status.
- Show top-performing creative examples with the selected metric.
- Make the selected metric and filters visible.

### Feature E — Finding details
**Purpose:** Explain one finding in a way that is auditable.
**Acceptance criteria:**
- Show attribute/metric, effect size, confidence interval (if computed), sample size, group comparison, example creatives, method, assumptions, and limitations.
- Provide a plain-language summary that does not overstate evidence.
- Distinguish missing data from zero values.
- Provide links back to related findings/results.

### Feature F — Export
**Purpose:** Export a shareable analysis summary.
**MVP:** CSV export for findings and a concise printable report view. Do not promise a PDF generator unless it is implemented and tested.
**Acceptance criteria:** Export respects current filters where applicable; exported fields are labeled; empty exports are handled.

## 7. Non-goals for the MVP
- No autonomous campaign changes, ad publishing, or budget allocation.
- No causal claims that a creative attribute caused performance.
- No guaranteed AI/ML visual understanding or trained model.
- No multi-user collaboration, billing, or enterprise permissions in the initial demo.
- No external ad-platform integrations unless separately scoped.
- No production-grade cloud persistence requirement for the first local prototype.

## 8. MVP scope
### Must have
- React responsive UI with white/purple theme.
- Upload and CSV validation.
- A demo dataset and demo mode.
- Core metrics and transparent findings.
- Results list, finding detail, dashboard, and CSV export.
- Loading, empty, success, and error states.
- Responsive layout and accessible controls.

### Nice to have
- Editable creative labels.
- Saved local analysis session.
- Printable report.
- More statistical tests and richer image feature extraction.

### Future
- Authenticated workspaces and durable cloud storage.
- Ad platform integrations.
- Model-assisted attribute tagging with user review.
- Team sharing and scheduled reporting.

## 9. Success metrics
- A user can reach a valid results view from the demo dataset without instructions.
- Invalid CSVs receive actionable feedback rather than crashing.
- Every displayed finding includes a metric, sample size, and a caveat/method.
- The main upload-to-results flow works at desktop and mobile widths.
- Exported data matches the visible filtered findings.

## 10. Constraints
- **Technical:** React + TypeScript; no Streamlit; browser UI built as a normal web app.
- **Time:** Initial build is time-boxed; prioritize a coherent working MVP over broad feature count.
- **Design:** White surfaces, purple accents, dark-purple sidebar, subtle lavender backgrounds, rounded cards, readable typography.
- **Data:** Treat uploaded ad data as untrusted input; avoid sending it to external services without explicit consent.

## 11. Assumptions and unresolved decisions
- Initial development can run locally with a demo dataset and client-side CSV parsing.
- If a backend is added, use the architecture described in `ARCHITECTURE.md`; do not invent a second stack.
- Maximum file sizes and final inference thresholds must be set in code/config and documented before release.
- Confirm whether this is strictly a local demo or will be deployed with persistent user accounts before implementing authentication/storage.

## 12. Definition of done
- [ ] Core requirements implemented.
- [ ] Upload → validate → analyze → results flow works.
- [ ] Metric calculations have unit tests, including zero-denominator cases.
- [ ] Invalid files and malformed rows produce useful errors.
- [ ] Desktop and mobile layouts checked.
- [ ] Tests, lint, typecheck, and production build run and results are reported honestly.
- [ ] Security and data-handling requirements are followed.
- [ ] Documentation reflects the implemented behavior.
