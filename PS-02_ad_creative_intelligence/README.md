# PS-02 — Ad Creative Intelligence · Dataset

**Brand:** *Halcyon* — a fictional insulated water bottle brand selling online through Meta (Facebook /
Instagram) ads. All images and numbers are synthetic.

**Files**
- `creatives/` — 150 ad images, `ad_001.png` … `ad_150.png` (800 × 800 px)
- `creative_performance.csv` — one row per image

| Column | Meaning |
|---|---|
| creative_id | AD001 – AD150 |
| filename | Matching image file in `creatives/` |
| platform | Where the ad ran (Meta) |
| launch_date | Date the ad started running |
| spend | Money spent on this ad (USD) |
| impressions | Times the ad was shown |
| clicks | Clicks on the ad |
| purchases | Orders placed after clicking |
| revenue | Value of those orders (USD) |

**Your job:** extract visual attributes from the images **automatically** (no hand-labelling), then report
which attributes are genuinely associated with better performance — with effect sizes and how many ads each
finding rests on.

**Watch out for:** ads received very different budgets, so compare **rates** (clicks ÷ impressions,
purchases ÷ clicks), not totals. With 150 ads, many apparent patterns are just chance. Saying "we can't
tell" about an attribute is a valid — and scored — answer.
