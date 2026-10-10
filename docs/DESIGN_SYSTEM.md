# Design System — Ad Creative Intelligence

## 1. Design direction
- **Style:** Premium, calm, analytical SaaS.
- **Mood:** Clear, trustworthy, evidence-led, lightweight.
- **Principles:**
  1. Evidence before decoration.
  2. Strong hierarchy; one primary action per view.
  3. Explain uncertainty and limitations wherever a finding is shown.
  4. Use consistent white surfaces and purple accents.
  5. Dense data should remain scannable and responsive.

## 2. Brand
- **Name:** Ad Creative Intelligence.
- **Logo:** Simple geometric hexagon/creative-mark motif with a purple gradient; use a text fallback if no logo asset exists.
- **Voice:** Direct, calm, specific. Prefer “associated with” over “drives” or “causes.”
- **Reference:** `assets/design-references/ad-creative-intelligence-ui.png`. The screenshot shows a marketing landing page, dark-purple application sidebar, upload wizard, KPI dashboard, ranked findings, finding detail, and a mobile screen. Reuse the visual language and information architecture, not its tiny screenshot text.

## 3. Color palette
| Token | Value | Use |
|---|---|---|
| Purple 700 | `#5B21B6` | Primary action, active states |
| Purple 600 | `#6D28D9` | Links and interactive accents |
| Purple 500 | `#7C3AED` | Chart highlight, icon accent |
| Purple 100 | `#EDE9FE` | Selected backgrounds |
| Lavender 50 | `#F7F5FF` | Page background / subtle panels |
| Sidebar | `#211044` | Desktop navigation |
| Sidebar active | `#5B21B6` | Active nav item |
| White | `#FFFFFF` | Cards and main surfaces |
| Text | `#211A35` | Primary text |
| Muted text | `#6B6478` | Secondary labels |
| Border | `#E7E2EF` | Dividers and card borders |
| Success | `#16865B` | Supported/success states |
| Success bg | `#DDF7EA` | Success pill background |
| Warning | `#A66A00` | Inconclusive/warning |
| Warning bg | `#FFF2CC` | Warning pill background |
| Error | `#B42318` | Errors |
| Error bg | `#FEE4E2` | Error background |
| Info | `#2456C4` | Informational notices |

Use semantic tokens in CSS variables; do not scatter hex values through components.

## 4. Typography
- **Font:** Inter, with system sans-serif fallback.
- **Headings:** Inter, weight 600–700.
- **Body:** Inter, weight 400–500.
- **Page title:** 28–32px desktop; 24–28px mobile.
- **Section heading:** 18–22px.
- **Body:** 14–16px, line-height 1.5.
- **Metadata:** 12–13px; never use tiny text for critical data.

## 5. Spacing and shape
- Base unit: 4px.
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.
- Card radius: 12–16px.
- Input/button radius: 8–10px.
- Pills: fully rounded.
- Card padding: 16–24px depending on density.
- Borders should be subtle; use shadows sparingly.

## 6. Shadows
- Small: `0 1px 3px rgba(35, 16, 68, 0.06)`.
- Medium: `0 8px 24px rgba(35, 16, 68, 0.08)`.
- Large: `0 16px 48px rgba(35, 16, 68, 0.12)`.
Avoid stacked shadows and overly glassy surfaces.

## 7. Buttons
- **Primary:** Purple 700 fill, white text, medium weight; visible hover/focus.
- **Secondary:** White fill, purple text, subtle purple border.
- **Tertiary:** Text/ghost button for low-priority actions.
- **Danger:** Red semantic token; only for destructive actions.
- Disabled buttons must have a clear disabled appearance and must not look clickable.
- Loading actions show a spinner and prevent duplicate submissions.

## 8. Inputs and file drop zone
- Inputs: white surface, 1px border, 8–10px radius, 12px horizontal padding.
- Focus: 2px purple focus ring with sufficient contrast.
- Errors: inline message, error border, and text—not color alone.
- Drop zone: dashed lavender border, cloud-upload icon, concise supported-file guidance, visible browse button.
- CSV mapping controls must show the target field and selected source column clearly.

## 9. Cards, tables, and charts
- KPI cards: icon + label + prominent value + optional context.
- Finding cards: rank, optional creative thumbnail, title, metric/effect summary, sample size, status pill, chevron.
- Finding detail: top summary cards for effect size, confidence interval, sample size, and metric; below, group comparison chart and creative examples; then method and limitations.
- Tables: sticky header only if helpful; row hover; wrap or scroll horizontally on small screens.
- Charts: use Recharts; label axes and units; include text summaries and accessible legends. Do not use color as the only status indicator.
- Status labels: `Supported`, `Inconclusive`, `Underpowered`, `Not available`. These are evidence classifications, not quality judgments about an ad.

## 10. Navigation and page layout
- Desktop: fixed/collapsible dark-purple left sidebar with brand mark and Home, Analyze, Results, Dashboard, Settings.
- Main content: light lavender/white canvas, max-width content region, consistent top heading and optional account area.
- Landing page: white/light-lavender hero, clear headline, primary “Start Analysis” CTA, secondary learn-more action, illustrative analytics panel, four-step value proposition.
- Upload page: stepper (Upload → Validate → Analyze → Results), image drop zone, CSV upload card, expected columns callout.
- Results page: title and export action; filter chips; ranked finding list.
- Finding detail: back link, title/status, evidence summary cards, comparison chart, creative examples, method/limitations, related findings.
- Mobile: compact header, drawer or bottom navigation; stack cards; no horizontal overflow.

## 11. States
- **Loading:** Skeletons or progress indication; explain long-running work.
- **Empty:** Explain what is missing and provide one useful next action.
- **Error:** Human-readable cause and recovery action; no stack traces.
- **Success:** Confirm the action and show the next step.
- **Disabled:** Explain requirements if the reason is not obvious.

## 12. Icons
- Use Lucide icons (e.g. `lucide-react`).
- Default 16–20px; larger icons for empty/upload states.
- Use consistent stroke style.

## 13. Responsive behavior
- Mobile: < 640px.
- Tablet: 640–1023px.
- Desktop: >= 1024px.
- Desktop sidebar may become a drawer below tablet width.
- Charts and tables must remain readable at 320px width; if a table cannot reflow, allow intentional horizontal scrolling within its container.

## 14. Accessibility
- Use semantic landmarks and heading order.
- All controls have accessible names.
- Keyboard navigation and visible focus are mandatory.
- Maintain WCAG AA contrast where practical.
- Statuses include text/icon in addition to color.
- Images have meaningful alt text when informative; decorative images use empty alt text.
- Respect reduced-motion preferences.
