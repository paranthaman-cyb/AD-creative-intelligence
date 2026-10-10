import {
  Creative,
  PerformanceRecord,
  Finding,
  AggregateMetrics,
  TrendDataPoint,
} from '../../types';

// Visual SVG mock placeholders encoded as clean data URIs for offline, self-contained display
export const MOCK_IMAGES = {
  sneakerPurple: '/purple_sneaker_ad.jpg',
  bottleCosmetic: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" rx="20" fill="%233B286D"/><text x="40" y="60" font-family="Inter,sans-serif" font-weight="bold" font-size="24" fill="%23FFFFFF">Better</text><text x="40" y="90" font-family="Inter,sans-serif" font-weight="bold" font-size="24" fill="%23FFFFFF">Together</text><rect x="220" y="100" width="80" height="200" rx="20" fill="%23E9D5FF"/><rect x="245" y="70" width="30" height="30" rx="6" fill="%23C084FC"/><text x="235" y="210" font-family="Inter,sans-serif" font-size="12" fill="%235B21B6">GLOW</text></svg>`,
  summerSale: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" rx="20" fill="%23F59E0B"/><rect x="40" y="120" width="320" height="160" rx="12" fill="%231E1B4B"/><text x="60" y="180" font-family="Inter,sans-serif" font-weight="bold" font-size="32" fill="%23FBBF24">Summer</text><text x="60" y="230" font-family="Inter,sans-serif" font-weight="bold" font-size="44" fill="%23FFFFFF">Sale</text><text x="60" y="260" font-family="Inter,sans-serif" font-size="16" fill="%23FDE68A">UP TO 50% OFF</text></svg>`,
  freshNatural: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" rx="20" fill="%23065F46"/><circle cx="200" cy="200" r="110" fill="%2310B981" opacity="0.4"/><text x="40" y="70" font-family="Inter,sans-serif" font-weight="bold" font-size="26" fill="%23FFFFFF">Fresh &amp; Natural</text><circle cx="200" cy="200" r="70" fill="%2334D399"/><text x="160" y="206" font-family="Inter,sans-serif" font-weight="600" font-size="18" fill="%23064E3B">ORGANIC</text></svg>`,
  limitedOfferRed: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" rx="20" fill="%23DC2626"/><rect x="40" y="60" width="160" height="32" rx="6" fill="%237F1D1D"/><text x="50" y="82" font-family="Inter,sans-serif" font-weight="bold" font-size="14" fill="%23FFFFFF">LIMITED TIME OFFER</text><circle cx="200" cy="220" r="90" fill="%23FFFFFF"/><text x="150" y="230" font-family="Inter,sans-serif" font-weight="bold" font-size="32" fill="%23DC2626">-30%</text></svg>`,
  lowContrastMuted: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" rx="20" fill="%239CA3AF"/><rect x="80" y="120" width="240" height="160" rx="12" fill="%236B7280"/><text x="120" y="190" font-family="Inter,sans-serif" font-weight="500" font-size="20" fill="%23E5E7EB">New Collection</text><text x="140" y="230" font-family="Inter,sans-serif" font-size="14" fill="%23D1D5DB">Subtle Shades</text></svg>`,
  highContrastVibrant: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" rx="20" fill="%2309090B"/><rect x="60" y="100" width="280" height="200" rx="16" fill="%237C3AED"/><text x="90" y="180" font-family="Inter,sans-serif" font-weight="bold" font-size="32" fill="%23FFFFFF">Bigger</text><text x="90" y="225" font-family="Inter,sans-serif" font-weight="bold" font-size="32" fill="%23FBBF24">Dreams</text><rect x="90" y="250" width="100" height="32" rx="6" fill="%23FFFFFF"/><text x="110" y="271" font-family="Inter,sans-serif" font-weight="bold" font-size="12" fill="%2309090B">SHOP NOW</text></svg>`,
};

export const DEMO_AGGREGATES: AggregateMetrics = {
  totalCreatives: 60,
  totalImpressions: 543210,
  totalClicks: 28460,
  totalConversions: 2843,
  totalSpend: 73996,
  totalRevenue: 221988,
  ctr: 28460 / 543210, // ~0.0524 (5.2%)
  cvr: 2843 / 28460,   // ~0.0999 (10.0%)
  cpc: 73996 / 28460,  // ~$2.60
  cpa: 73996 / 2843,   // ~$26.03
  roas: 221988 / 73996, // ~3.00x
};

export const DEMO_TRENDS: TrendDataPoint[] = [
  { dateOrIndex: 'Jan', impressions: 72000, clicks: 3456, conversions: 340, ctr: 0.048, cvr: 0.098, cpc: 2.75, cpa: 27.9 },
  { dateOrIndex: 'Feb', impressions: 81000, clicks: 3645, conversions: 372, ctr: 0.045, cvr: 0.102, cpc: 2.68, cpa: 26.2 },
  { dateOrIndex: 'Mar', impressions: 89000, clicks: 4539, conversions: 450, ctr: 0.051, cvr: 0.099, cpc: 2.62, cpa: 26.4 },
  { dateOrIndex: 'Apr', impressions: 94000, clicks: 5546, conversions: 562, ctr: 0.059, cvr: 0.101, cpc: 2.58, cpa: 25.5 },
  { dateOrIndex: 'May', impressions: 101000, clicks: 6868, conversions: 690, ctr: 0.068, cvr: 0.100, cpc: 2.54, cpa: 25.3 },
  { dateOrIndex: 'Jun', impressions: 106210, clicks: 8406, conversions: 829, ctr: 0.079, cvr: 0.099, cpc: 2.48, cpa: 25.1 },
];

export const DEMO_FINDINGS: Finding[] = [
  {
    id: 'finding_contrast_ctr',
    analysisSessionId: 'demo_session',
    attributeKey: 'color_contrast',
    attributeLabel: 'Color Contrast',
    metric: 'ctr',
    groupLabels: ['Low Contrast', 'High Contrast'],
    groupValues: [0.024, 0.052], // 2.4% vs 5.2%
    groupCounts: [28, 32],
    groupRawNumerators: [5880, 22580],
    groupRawDenominators: [245000, 298210],
    effectSize: 0.028, // +2.8 percentage points
    confidenceInterval: [0.012, 0.044], // [1.2%, 4.4%]
    sampleSize: 60,
    status: 'supported',
    method: "Two-sample proportion comparison with 95% Wald confidence interval comparing aggregate CTR across creative groups.",
    limitations: [
      'Observational association across 60 creatives; does not establish direct causal effect.',
      'High-contrast creatives were also tested with slightly higher bids in late-stage campaigns.',
      'Audience fatigue may differ between color palettes over extended run periods.',
    ],
    summary: 'Higher visual contrast is associated with higher click-through rate (CTR).',
    imageExamples: [
      {
        label: 'Low Contrast',
        imageUrl: MOCK_IMAGES.lowContrastMuted,
        metricValue: 0.024,
        name: 'Muted Lifestyle Baseline',
      },
      {
        label: 'High Contrast',
        imageUrl: MOCK_IMAGES.highContrastVibrant,
        metricValue: 0.052,
        name: 'Vibrant Neon Bold',
      },
    ],
    relatedFindingIds: ['finding_brightness_ctr', 'finding_text_density_ctr'],
  },
  {
    id: 'finding_text_area_cvr',
    analysisSessionId: 'demo_session',
    attributeKey: 'text_area',
    attributeLabel: 'Text Area',
    metric: 'cvr',
    groupLabels: ['Heavy Text (>40%)', 'Moderate Text (<20%)'],
    groupValues: [0.082, 0.099],
    groupCounts: [25, 35],
    groupRawNumerators: [820, 2023],
    groupRawDenominators: [10000, 20460],
    effectSize: 0.017, // +1.7%
    confidenceInterval: [0.003, 0.031], // [0.3%, 3.1%]
    sampleSize: 60,
    status: 'inconclusive',
    method: "Comparison of conversion rates with 95% confidence interval on attributed click volume.",
    limitations: [
      'Confidence interval touches near-zero boundaries when adjusted for multi-campaign variability.',
      'Varying landing page copy matches between ads may explain conversion divergence.',
    ],
    summary: 'Moderate text area shows higher conversion rate compared to heavy-text variations.',
    imageExamples: [
      {
        label: 'Heavy Text',
        imageUrl: MOCK_IMAGES.summerSale,
        metricValue: 0.082,
        name: 'Promo Headline Heavy',
      },
      {
        label: 'Moderate Text',
        imageUrl: MOCK_IMAGES.sneakerPurple,
        metricValue: 0.099,
        name: 'Clean Minimalist Focus',
      },
    ],
  },
  {
    id: 'finding_product_centered_ctr',
    analysisSessionId: 'demo_session',
    attributeKey: 'product_layout',
    attributeLabel: 'Product-Centered Layout',
    metric: 'ctr',
    groupLabels: ['Lifestyle / Ambient', 'Hero Product Centered'],
    groupValues: [0.038, 0.059],
    groupCounts: [20, 40],
    groupRawNumerators: [6840, 21620],
    groupRawDenominators: [180000, 363210],
    effectSize: 0.021, // +2.1%
    confidenceInterval: [-0.005, 0.047], // [-0.5%, 4.7%]
    sampleSize: 60,
    status: 'underpowered',
    method: "Two-group rate test with 95% confidence interval. High variance in lifestyle category.",
    limitations: [
      'Confidence interval crosses zero [-0.5%, 4.7%], precluding statistically supported conclusion.',
      'Small lifestyle subset (n=20) lacks sufficient statistical power to confirm positive effect.',
    ],
    summary: 'Product-centered layouts tend to perform better, but sample power remains insufficient.',
    imageExamples: [
      {
        label: 'Lifestyle / Ambient',
        imageUrl: MOCK_IMAGES.freshNatural,
        metricValue: 0.038,
        name: 'Organic In-Situ Photo',
      },
      {
        label: 'Hero Product Centered',
        imageUrl: MOCK_IMAGES.sneakerPurple,
        metricValue: 0.059,
        name: 'Direct Hero Product Showcase',
      },
    ],
  },
  {
    id: 'finding_red_color_cpa',
    analysisSessionId: 'demo_session',
    attributeKey: 'red_accent',
    attributeLabel: 'Red Accent Elements',
    metric: 'cpa',
    groupLabels: ['Without Red Accents', 'With Red Accents'],
    groupValues: [28.40, 24.82], // lower CPA is better (-12.6%)
    groupCounts: [26, 34],
    groupRawNumerators: [36920, 37076],
    groupRawDenominators: [1300, 1543],
    effectSize: -0.126, // -12.6% reduction in CPA
    confidenceInterval: [-0.204, -0.048], // [-20.4%, -4.8%]
    sampleSize: 60,
    status: 'supported',
    method: "Relative difference in CPA with log-normal standard error approximation.",
    limitations: [
      'Red accent creatives were frequently bundled with time-limited discount offers.',
      'Urgency copy on red ads may be the underlying driver rather than color hue alone.',
    ],
    summary: 'Red accent elements are associated with a 12.6% lower Cost Per Acquisition (CPA).',
    imageExamples: [
      {
        label: 'Without Red Accents',
        imageUrl: MOCK_IMAGES.bottleCosmetic,
        metricValue: 28.40,
        name: 'Cool Palette Baseline',
      },
      {
        label: 'With Red Accents',
        imageUrl: MOCK_IMAGES.limitedOfferRed,
        metricValue: 24.82,
        name: 'Urgency Red Badge Offer',
      },
    ],
  },
  {
    id: 'finding_cta_prominence_ctr',
    analysisSessionId: 'demo_session',
    attributeKey: 'cta_prominence',
    attributeLabel: 'CTA Button Prominence',
    metric: 'ctr',
    groupLabels: ['Subtle Text Link', 'High-Contrast Solid Button'],
    groupValues: [0.039, 0.058],
    groupCounts: [22, 38],
    groupRawNumerators: [7410, 21050],
    groupRawDenominators: [190000, 353210],
    effectSize: 0.019,
    confidenceInterval: [0.008, 0.030],
    sampleSize: 60,
    status: 'supported',
    method: "Two-sample proportion comparison with 95% Wald interval.",
    limitations: [
      'Button prominence correlates with overall visual clarity of value proposition.',
      'Desktop vs mobile placement interaction was not separated.',
    ],
    summary: 'High-contrast solid CTA buttons are associated with 1.9% higher CTR.',
  },
  {
    id: 'finding_brightness_ctr',
    analysisSessionId: 'demo_session',
    attributeKey: 'brightness',
    attributeLabel: 'Visual Brightness',
    metric: 'ctr',
    groupLabels: ['Standard Brightness', 'High Brightness'],
    groupValues: [0.047, 0.055],
    groupCounts: [30, 30],
    groupRawNumerators: [12690, 15770],
    groupRawDenominators: [270000, 273210],
    effectSize: 0.008,
    confidenceInterval: [-0.004, 0.020],
    sampleSize: 60,
    status: 'inconclusive',
    method: "Difference in proportions with 95% Wald confidence interval.",
    limitations: [
      '95% interval crosses zero [-0.4%, 2.0%]; difference cannot be distinguished from noise.',
      'Heuristic pixel luminance used rather than perceptual contrast score.',
    ],
    summary: 'High brightness shows a slight upward trend in CTR, but remains statistically inconclusive.',
  },
  {
    id: 'finding_human_face_ctr',
    analysisSessionId: 'demo_session',
    attributeKey: 'human_face',
    attributeLabel: 'Human Face Presence',
    metric: 'ctr',
    groupLabels: ['No Human Subject', 'Human Face Featured'],
    groupValues: [0.043, 0.057],
    groupCounts: [28, 32],
    groupRawNumerators: [10750, 17710],
    groupRawDenominators: [250000, 293210],
    effectSize: 0.014,
    confidenceInterval: [0.002, 0.026],
    sampleSize: 60,
    status: 'supported',
    method: "Two-sample proportion comparison on aggregated impressions.",
    limitations: [
      'Emotional expression and model demographics vary substantially.',
      'Platform algorithms may favor human presence in feed placements.',
    ],
    summary: 'Ads featuring a human face show a supported 1.4% higher click-through rate.',
  },
  {
    id: 'finding_headline_words_cvr',
    analysisSessionId: 'demo_session',
    attributeKey: 'headline_length',
    attributeLabel: 'Headline Length',
    metric: 'cvr',
    groupLabels: ['Short (1-4 words)', 'Long (5+ words)'],
    groupValues: [0.103, 0.098],
    groupCounts: [32, 28],
    groupRawNumerators: [1648, 1195],
    groupRawDenominators: [16000, 12460],
    effectSize: -0.005,
    confidenceInterval: [-0.018, 0.008],
    sampleSize: 60,
    status: 'inconclusive',
    method: "Two-sample proportion comparison on converted clicks.",
    limitations: [
      'Effect size is minimal and 95% confidence interval crosses zero.',
      'Product category complexity influences optimal headline word count.',
    ],
    summary: 'Headline length shows no definitive association with conversion rate.',
  },
  {
    id: 'finding_discount_badge_ctr',
    analysisSessionId: 'demo_session',
    attributeKey: 'discount_badge',
    attributeLabel: 'Discount Percentage Badge',
    metric: 'ctr',
    groupLabels: ['Standard Price', 'Discount Badge Highlight'],
    groupValues: [0.045, 0.077],
    groupCounts: [12, 12],
    groupRawNumerators: [4500, 7700],
    groupRawDenominators: [100000, 100000],
    effectSize: 0.032,
    confidenceInterval: [-0.011, 0.075],
    sampleSize: 24,
    status: 'underpowered',
    method: "Two-sample proportion test on limited creative cohort.",
    limitations: [
      'Small cohort size (n=24) produces wide confidence interval spanning negative territory.',
      'Requires additional creative variations to achieve adequate statistical power.',
    ],
    summary: 'Discount badge highlights indicate strong positive potential but remain underpowered.',
  },
  {
    id: 'finding_motion_video_ctr',
    analysisSessionId: 'demo_session',
    attributeKey: 'video_motion',
    attributeLabel: 'Animated Motion Style',
    metric: 'ctr',
    groupLabels: ['Static Graphics', 'Subtle Motion / Loop'],
    groupValues: [0.048, 0.072],
    groupCounts: [8, 10],
    groupRawNumerators: [3840, 5760],
    groupRawDenominators: [80000, 80000],
    effectSize: 0.024,
    confidenceInterval: [-0.015, 0.063],
    sampleSize: 18,
    status: 'underpowered',
    method: "Two-sample test on small motion asset sample.",
    limitations: [
      'Sample size (n=18) is below the minimum threshold of 20 creatives.',
      'Confidence interval is too wide for decision-making.',
    ],
    summary: 'Motion variations are underpowered with only 18 total sample assets.',
  },
  {
    id: 'finding_lifestyle_cpa',
    analysisSessionId: 'demo_session',
    attributeKey: 'lifestyle_setting',
    attributeLabel: 'Lifestyle Setting',
    metric: 'cpa',
    groupLabels: ['Studio Background', 'Outdoor Lifestyle'],
    groupValues: [26.20, 25.12],
    groupCounts: [10, 10],
    groupRawNumerators: [13100, 12560],
    groupRawDenominators: [500, 500],
    effectSize: -0.041,
    confidenceInterval: [-0.112, 0.030],
    sampleSize: 20,
    status: 'underpowered',
    method: "Comparison of mean CPA across 20 creative samples.",
    limitations: [
      'Insufficient statistical power (n=20) to separate true variance from noise.',
    ],
    summary: 'Lifestyle setting comparisons are underpowered.',
  },
  {
    id: 'finding_minimalist_cvr',
    analysisSessionId: 'demo_session',
    attributeKey: 'minimalist_bg',
    attributeLabel: 'Minimalist Background',
    metric: 'cvr',
    groupLabels: ['Complex Scene', 'Minimalist Plain Backdrop'],
    groupValues: [0.091, 0.102],
    groupCounts: [25, 35],
    groupRawNumerators: [1001, 1842],
    groupRawDenominators: [11000, 17460],
    effectSize: 0.011,
    confidenceInterval: [-0.002, 0.024],
    sampleSize: 60,
    status: 'inconclusive',
    method: "Two-sample proportion comparison with 95% Wald interval.",
    limitations: [
      'Interval strictly touches null effect [-0.2%, 2.4%]. Inconclusive.',
    ],
    summary: 'Backdrop minimalism shows weak correlation with conversion rate.',
  },
];

export const DEMO_CREATIVES: Creative[] = [
  {
    id: 'cr_01',
    analysisSessionId: 'demo_session',
    sourceCreativeId: 'ad_sneaker_purple_01',
    name: 'Step Forward in Style (Sneaker)',
    headline: 'Step Forward in Style',
    imageUrl: MOCK_IMAGES.sneakerPurple,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: '#7C3AED',
    matchStatus: 'matched',
    attributes: [
      { key: 'color_contrast', name: 'Color Contrast', value: 'High Contrast', source: 'imported', confidence: null, reviewed: true },
      { key: 'product_layout', name: 'Product Layout', value: 'Hero Product Centered', source: 'imported', confidence: null, reviewed: true },
      { key: 'cta_prominence', name: 'CTA Prominence', value: 'High-Contrast Solid Button', source: 'imported', confidence: null, reviewed: true },
      { key: 'text_area', name: 'Text Area', value: 'Moderate Text (<20%)', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'red_accent', name: 'Red Accent', value: 'Without Red Accents', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'aspect_ratio', name: 'Aspect Ratio', value: '1:1 Square', source: 'heuristic', confidence: null, reviewed: true },
    ],
  },
  {
    id: 'cr_02',
    analysisSessionId: 'demo_session',
    sourceCreativeId: 'ad_glow_bottle_02',
    name: 'Better Together Cosmetic Bottle',
    headline: 'Better Together',
    imageUrl: MOCK_IMAGES.bottleCosmetic,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: '#3B286D',
    matchStatus: 'matched',
    attributes: [
      { key: 'color_contrast', name: 'Color Contrast', value: 'High Contrast', source: 'imported', confidence: null, reviewed: true },
      { key: 'product_layout', name: 'Product Layout', value: 'Hero Product Centered', source: 'imported', confidence: null, reviewed: true },
      { key: 'cta_prominence', name: 'CTA Prominence', value: 'Subtle Text Link', source: 'imported', confidence: null, reviewed: true },
      { key: 'text_area', name: 'Text Area', value: 'Moderate Text (<20%)', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'red_accent', name: 'Red Accent', value: 'Without Red Accents', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'aspect_ratio', name: 'Aspect Ratio', value: '1:1 Square', source: 'heuristic', confidence: null, reviewed: true },
    ],
  },
  {
    id: 'cr_03',
    analysisSessionId: 'demo_session',
    sourceCreativeId: 'ad_summer_sale_03',
    name: 'Summer Sale Promo 50% Off',
    headline: 'Summer Sale Up To 50% Off',
    imageUrl: MOCK_IMAGES.summerSale,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: '#F59E0B',
    matchStatus: 'matched',
    attributes: [
      { key: 'color_contrast', name: 'Color Contrast', value: 'High Contrast', source: 'imported', confidence: null, reviewed: true },
      { key: 'product_layout', name: 'Product Layout', value: 'Lifestyle / Ambient', source: 'imported', confidence: null, reviewed: true },
      { key: 'cta_prominence', name: 'CTA Prominence', value: 'High-Contrast Solid Button', source: 'imported', confidence: null, reviewed: true },
      { key: 'text_area', name: 'Text Area', value: 'Heavy Text (>40%)', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'red_accent', name: 'Red Accent', value: 'Without Red Accents', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'aspect_ratio', name: 'Aspect Ratio', value: '1:1 Square', source: 'heuristic', confidence: null, reviewed: true },
    ],
  },
  {
    id: 'cr_04',
    analysisSessionId: 'demo_session',
    sourceCreativeId: 'ad_fresh_natural_04',
    name: 'Fresh & Natural Organic',
    headline: 'Fresh & Natural Organic',
    imageUrl: MOCK_IMAGES.freshNatural,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: '#065F46',
    matchStatus: 'matched',
    attributes: [
      { key: 'color_contrast', name: 'Color Contrast', value: 'Low Contrast', source: 'imported', confidence: null, reviewed: true },
      { key: 'product_layout', name: 'Product Layout', value: 'Lifestyle / Ambient', source: 'imported', confidence: null, reviewed: true },
      { key: 'cta_prominence', name: 'CTA Prominence', value: 'Subtle Text Link', source: 'imported', confidence: null, reviewed: true },
      { key: 'text_area', name: 'Text Area', value: 'Moderate Text (<20%)', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'red_accent', name: 'Red Accent', value: 'Without Red Accents', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'aspect_ratio', name: 'Aspect Ratio', value: '1:1 Square', source: 'heuristic', confidence: null, reviewed: true },
    ],
  },
  {
    id: 'cr_05',
    analysisSessionId: 'demo_session',
    sourceCreativeId: 'ad_limited_offer_05',
    name: 'Limited Time Offer Red Urgency',
    headline: 'Limited Time Offer -30%',
    imageUrl: MOCK_IMAGES.limitedOfferRed,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: '#DC2626',
    matchStatus: 'matched',
    attributes: [
      { key: 'color_contrast', name: 'Color Contrast', value: 'High Contrast', source: 'imported', confidence: null, reviewed: true },
      { key: 'product_layout', name: 'Product Layout', value: 'Hero Product Centered', source: 'imported', confidence: null, reviewed: true },
      { key: 'cta_prominence', name: 'CTA Prominence', value: 'High-Contrast Solid Button', source: 'imported', confidence: null, reviewed: true },
      { key: 'text_area', name: 'Text Area', value: 'Moderate Text (<20%)', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'red_accent', name: 'Red Accent', value: 'With Red Accents', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'aspect_ratio', name: 'Aspect Ratio', value: '1:1 Square', source: 'heuristic', confidence: null, reviewed: true },
    ],
  },
  {
    id: 'cr_06',
    analysisSessionId: 'demo_session',
    sourceCreativeId: 'ad_low_contrast_06',
    name: 'New Collection Muted Beige',
    headline: 'New Collection Subtle Shades',
    imageUrl: MOCK_IMAGES.lowContrastMuted,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: '#9CA3AF',
    matchStatus: 'matched',
    attributes: [
      { key: 'color_contrast', name: 'Color Contrast', value: 'Low Contrast', source: 'imported', confidence: null, reviewed: true },
      { key: 'product_layout', name: 'Product Layout', value: 'Lifestyle / Ambient', source: 'imported', confidence: null, reviewed: true },
      { key: 'cta_prominence', name: 'CTA Prominence', value: 'Subtle Text Link', source: 'imported', confidence: null, reviewed: true },
      { key: 'text_area', name: 'Text Area', value: 'Moderate Text (<20%)', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'red_accent', name: 'Red Accent', value: 'Without Red Accents', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'aspect_ratio', name: 'Aspect Ratio', value: '1:1 Square', source: 'heuristic', confidence: null, reviewed: true },
    ],
  },
  {
    id: 'cr_07',
    analysisSessionId: 'demo_session',
    sourceCreativeId: 'ad_high_contrast_07',
    name: 'Bigger Dreams Neon Bold',
    headline: 'Bigger Dreams',
    imageUrl: MOCK_IMAGES.highContrastVibrant,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: '#09090B',
    matchStatus: 'matched',
    attributes: [
      { key: 'color_contrast', name: 'Color Contrast', value: 'High Contrast', source: 'imported', confidence: null, reviewed: true },
      { key: 'product_layout', name: 'Product Layout', value: 'Hero Product Centered', source: 'imported', confidence: null, reviewed: true },
      { key: 'cta_prominence', name: 'CTA Prominence', value: 'High-Contrast Solid Button', source: 'imported', confidence: null, reviewed: true },
      { key: 'text_area', name: 'Text Area', value: 'Moderate Text (<20%)', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'red_accent', name: 'Red Accent', value: 'Without Red Accents', source: 'heuristic', confidence: null, reviewed: true },
      { key: 'aspect_ratio', name: 'Aspect Ratio', value: '1:1 Square', source: 'heuristic', confidence: null, reviewed: true },
    ],
  },
];

// Fill out remaining demo creative representations to reach 60 items
for (let i = 8; i <= 60; i++) {
  const isHighContrast = i % 2 === 0;
  const isHeroProduct = i % 3 !== 0;
  const hasRed = i % 4 === 0;
  const isHeavyText = i % 5 === 0;
  const hasSolidCta = i % 2 === 0;

  DEMO_CREATIVES.push({
    id: `cr_${i < 10 ? '0' + i : i}`,
    analysisSessionId: 'demo_session',
    sourceCreativeId: `ad_creative_${i < 10 ? '0' + i : i}`,
    name: `Performance Ad Variant #${i}`,
    headline: `Unlock Better Results #${i}`,
    imageUrl: isHighContrast ? MOCK_IMAGES.highContrastVibrant : MOCK_IMAGES.lowContrastMuted,
    aspectRatio: 1.0,
    imageWidth: 1080,
    imageHeight: 1080,
    dominantColor: isHighContrast ? '#5B21B6' : '#9CA3AF',
    matchStatus: 'matched',
    attributes: [
      {
        key: 'color_contrast',
        name: 'Color Contrast',
        value: isHighContrast ? 'High Contrast' : 'Low Contrast',
        source: 'imported',
        confidence: null,
        reviewed: false,
      },
      {
        key: 'product_layout',
        name: 'Product Layout',
        value: isHeroProduct ? 'Hero Product Centered' : 'Lifestyle / Ambient',
        source: 'imported',
        confidence: null,
        reviewed: false,
      },
      {
        key: 'red_accent',
        name: 'Red Accent',
        value: hasRed ? 'With Red Accents' : 'Without Red Accents',
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      },
      {
        key: 'text_area',
        name: 'Text Area',
        value: isHeavyText ? 'Heavy Text (>40%)' : 'Moderate Text (<20%)',
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      },
      {
        key: 'cta_prominence',
        name: 'CTA Prominence',
        value: hasSolidCta ? 'High-Contrast Solid Button' : 'Subtle Text Link',
        source: 'imported',
        confidence: null,
        reviewed: false,
      },
      {
        key: 'aspect_ratio',
        name: 'Aspect Ratio',
        value: '1:1 Square',
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      },
    ],
  });
}

// Generate matching PerformanceRecords for all 60 demo creatives
export const DEMO_PERFORMANCE_RECORDS: PerformanceRecord[] = DEMO_CREATIVES.map((creative, index) => {
  const isHighContrast = creative.attributes.some((a) => a.key === 'color_contrast' && a.value === 'High Contrast');
  const hasRed = creative.attributes.some((a) => a.key === 'red_accent' && a.value === 'With Red Accents');

  // Baseline impressions per creative around 8,000 - 10,000
  const impressions = Math.round(7500 + (index * 47) % 3200);
  // High contrast has higher CTR (around 5.2% vs 2.4%)
  const ctr = isHighContrast ? 0.052 + (index % 5) * 0.002 : 0.024 + (index % 4) * 0.002;
  const clicks = Math.round(impressions * ctr);
  // CVR around 9% - 11%
  const cvr = 0.098 + (index % 3) * 0.005;
  const conversions = Math.round(clicks * cvr);
  // CPA around $24-$28
  const cpaTarget = hasRed ? 24.8 : 28.4;
  const spend = Math.round(conversions * cpaTarget);
  const revenue = Math.round(spend * 3.0);

  return {
    id: `perf_rec_${creative.id}`,
    analysisSessionId: 'demo_session',
    creativeId: creative.sourceCreativeId || creative.id,
    sourceRowNumber: index + 1,
    campaignId: `camp_2026_${(index % 4) + 1}`,
    date: `2026-06-${(index % 28) + 1}`,
    impressions,
    clicks,
    conversions,
    spend,
    revenue,
    rawFields: {
      ad_id: creative.sourceCreativeId,
      ad_name: creative.name,
      impressions,
      clicks,
      conversions,
      spend,
      revenue,
      color_contrast: isHighContrast ? 'High Contrast' : 'Low Contrast',
      product_layout: creative.attributes.find((a) => a.key === 'product_layout')?.value as string,
    },
  };
});

/**
 * Downloadable sample CSV representation for testing upload flow.
 */
export const SAMPLE_CSV_CONTENT = [
  'ad_id,ad_name,impressions,clicks,conversions,spend,revenue,color_contrast,product_layout,cta_style',
  ...DEMO_PERFORMANCE_RECORDS.slice(0, 60).map((r, i) => {
    const c = DEMO_CREATIVES[i];
    const contrast = c.attributes.find((a) => a.key === 'color_contrast')?.value || 'Low Contrast';
    const layout = c.attributes.find((a) => a.key === 'product_layout')?.value || 'Hero Product Centered';
    const cta = c.attributes.find((a) => a.key === 'cta_prominence')?.value || 'High-Contrast Solid Button';
    return `${r.creativeId},"${c.name}",${r.impressions},${r.clicks},${r.conversions},${r.spend},${r.revenue},"${contrast}","${layout}","${cta}"`;
  }),
].join('\r\n');
