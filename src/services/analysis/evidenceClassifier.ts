import {
  Creative,
  PerformanceRecord,
  Finding,
  MetricKey,
  EvidenceStatus,
  ExampleCreativeDisplay,
} from '../../types';
import { compareProportions, compareMeans } from './statisticalTests';
import { formatPercent, getMetricShortLabel } from '../metrics/formatters';

interface AttributeGroupData {
  attributeKey: string;
  attributeLabel: string;
  groupA: {
    label: string;
    creatives: Creative[];
    records: PerformanceRecord[];
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
  };
  groupB: {
    label: string;
    creatives: Creative[];
    records: PerformanceRecord[];
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
  };
}

/**
 * Discovers binary or contrasting attribute groups across the creative collection.
 */
export function extractAttributeGroups(
  creatives: Creative[],
  performance: PerformanceRecord[]
): AttributeGroupData[] {
  // Map creativeId -> PerformanceRecord[]
  const perfMap = new Map<string, PerformanceRecord[]>();
  for (const record of performance) {
    if (!record.creativeId) continue;
    const list = perfMap.get(record.creativeId) || [];
    list.push(record);
    perfMap.set(record.creativeId, list);
  }

  // Find all distinct attribute keys
  const attrKeyMap = new Map<string, { label: string; values: Set<string> }>();
  for (const c of creatives) {
    for (const attr of c.attributes) {
      if (attr.value === null || attr.value === undefined) continue;
      const strVal = String(attr.value).trim();
      if (!attrKeyMap.has(attr.key)) {
        attrKeyMap.set(attr.key, { label: attr.name, values: new Set() });
      }
      attrKeyMap.get(attr.key)!.values.add(strVal);
    }
  }

  const groups: AttributeGroupData[] = [];

  const aggregateGroupData = (cList: Creative[]) => {
    let impressions = 0;
    let clicks = 0;
    let conversions = 0;
    let spend = 0;
    let revenue = 0;
    const records: PerformanceRecord[] = [];

    for (const c of cList) {
      const pRecords = perfMap.get(c.sourceCreativeId || c.id) || [];
      for (const p of pRecords) {
        records.push(p);
        impressions += p.impressions || 0;
        clicks += p.clicks || 0;
        conversions += p.conversions || 0;
        spend += p.spend || 0;
        revenue += p.revenue || 0;
      }
    }

    return {
      creatives: cList,
      records,
      impressions,
      clicks,
      conversions,
      spend,
      revenue,
    };
  };

  for (const [key, info] of attrKeyMap.entries()) {
    const valList = Array.from(info.values);
    if (valList.length < 2) continue;

    // Build pairs of values
    const pairs: [string, string][] = [];

    if (valList.includes('Low Contrast') && valList.includes('High Contrast')) {
      pairs.push(['Low Contrast', 'High Contrast']);
    } else if (valList.includes('Muted Brightness') && valList.includes('High Brightness')) {
      pairs.push(['Muted Brightness', 'High Brightness']);
    } else if (valList.includes('Muted Saturation') && valList.includes('Vibrant Saturation')) {
      pairs.push(['Muted Saturation', 'Vibrant Saturation']);
    } else if (valList.includes('Clean / Minimalist') && valList.includes('Detailed / Text-Heavy')) {
      pairs.push(['Detailed / Text-Heavy', 'Clean / Minimalist']);
    } else if (valList.includes('Cool (Blue/Cyan)') && valList.includes('Warm (Orange/Red/Brown)')) {
      pairs.push(['Warm (Orange/Red/Brown)', 'Cool (Blue/Cyan)']);
      if (valList.includes('Natural (Green/Olive)')) {
        pairs.push(['Natural (Green/Olive)', 'Cool (Blue/Cyan)']);
      }
    } else if (valList.includes('Low') && valList.includes('High')) {
      pairs.push(['Low', 'High']);
    } else if (valList.includes('No') && valList.includes('Yes')) {
      pairs.push(['No', 'Yes']);
    } else {
      pairs.push([valList[0], valList[1]]);
    }

    for (const [valA, valB] of pairs) {
      const creativesA = creatives.filter((c) =>
        c.attributes.some((a) => a.key === key && String(a.value).trim() === valA)
      );
      const creativesB = creatives.filter((c) =>
        c.attributes.some((a) => a.key === key && String(a.value).trim() === valB)
      );

      if (creativesA.length === 0 || creativesB.length === 0) continue;

      groups.push({
        attributeKey: key,
        attributeLabel: info.label,
        groupA: {
          label: valA,
          ...aggregateGroupData(creativesA),
        },
        groupB: {
          label: valB,
          ...aggregateGroupData(creativesB),
        },
      });
    }
  }

  return groups;
}

/**
 * Builds findings for each attribute group and metric combination.
 */
export function generateFindings(
  creatives: Creative[],
  performance: PerformanceRecord[],
  sessionId = 'current'
): Finding[] {
  const attributeGroups = extractAttributeGroups(creatives, performance);
  const findings: Finding[] = [];

  for (const group of attributeGroups) {
    const metricsToTest: MetricKey[] = ['ctr'];
    if (group.groupA.conversions > 0 || group.groupB.conversions > 0) {
      metricsToTest.push('cvr');
    }
    if (group.groupA.spend > 0 || group.groupB.spend > 0) {
      if (group.groupA.conversions > 0 || group.groupB.conversions > 0) {
        metricsToTest.push('cpa');
      }
      if (group.groupA.revenue > 0 || group.groupB.revenue > 0) {
        metricsToTest.push('roas');
      }
    }

    for (const metric of metricsToTest) {
      const sampleSize = group.groupA.creatives.length + group.groupB.creatives.length;
      let rateA = 0;
      let rateB = 0;
      let diff = 0;
      let ci: [number, number] | null = null;
      let status: EvidenceStatus = 'inconclusive';
      let method = '';

      if (metric === 'ctr' || metric === 'cvr') {
        const numA = metric === 'ctr' ? group.groupA.clicks : group.groupA.conversions;
        const denA = metric === 'ctr' ? group.groupA.impressions : group.groupA.clicks;
        const numB = metric === 'ctr' ? group.groupB.clicks : group.groupB.conversions;
        const denB = metric === 'ctr' ? group.groupB.impressions : group.groupB.clicks;

        if (denA === 0 || denB === 0) continue;

        rateA = numA / denA;
        rateB = numB / denB;
        diff = rateB - rateA;

        const stats = compareProportions(
          { count: group.groupA.creatives.length, numerator: numA, denominator: denA },
          { count: group.groupB.creatives.length, numerator: numB, denominator: denB },
          group.groupA.label,
          group.groupB.label
        );

        ci = stats.confidenceInterval;
        method = `Two-sample proportion comparison with 95% Wald confidence interval on aggregated ${getMetricShortLabel(metric)} rates.`;

        // Strict evidence classification rules
        if (sampleSize < 20 || group.groupA.creatives.length < 10 || group.groupB.creatives.length < 10) {
          status = 'underpowered';
        } else if (ci) {
          const [low, high] = ci;
          if ((low > 0 && high > 0) || (low < 0 && high < 0)) {
            status = 'supported';
          } else {
            status = 'inconclusive';
          }
        }
      } else if (metric === 'cpa' || metric === 'roas') {
        // Continuous creative-level metrics
        const getValues = (cList: Creative[]) => {
          return cList.map((c) => {
            const p = performance.find((r) => r.creativeId === (c.sourceCreativeId || c.id));
            if (!p) return null;
            if (metric === 'cpa') {
              return p.conversions && p.conversions > 0 && p.spend !== null && p.spend !== undefined
                ? p.spend / p.conversions
                : null;
            } else {
              return p.spend && p.spend > 0 && p.revenue !== null && p.revenue !== undefined
                ? p.revenue / p.spend
                : null;
            }
          }).filter((v): v is number => v !== null && !isNaN(v));
        };

        const valsA = getValues(group.groupA.creatives);
        const valsB = getValues(group.groupB.creatives);

        if (valsA.length < 5 || valsB.length < 5) continue;

        const meanA = valsA.reduce((a, b) => a + b, 0) / valsA.length;
        const meanB = valsB.reduce((a, b) => a + b, 0) / valsB.length;
        rateA = meanA;
        rateB = meanB;
        diff = meanB - meanA;

        const stats = compareMeans(valsA, valsB, group.groupA.label, group.groupB.label);
        ci = stats.confidenceInterval;
        method = `Welch's two-sample comparison with 95% confidence interval on creative-level ${getMetricShortLabel(metric)}.`;

        if (sampleSize < 20 || valsA.length < 10 || valsB.length < 10) {
          status = 'underpowered';
        } else if (ci) {
          const [low, high] = ci;
          if ((low > 0 && high > 0) || (low < 0 && high < 0)) {
            status = 'supported';
          } else {
            status = 'inconclusive';
          }
        }
      }

      const higherOrLower = diff >= 0 ? 'higher' : 'lower';
      const metricLabel = getMetricShortLabel(metric);
      const isRate = metric === 'ctr' || metric === 'cvr';
      const formattedDiff = isRate
        ? formatPercent(Math.abs(diff))
        : metric === 'cpa' || metric === 'cpc'
        ? `$${Math.abs(diff).toFixed(2)}`
        : metric === 'roas'
        ? `${Math.abs(diff).toFixed(2)}x`
        : `${diff.toFixed(2)}`;
      const summary = `${group.groupB.label} is associated with ${formattedDiff} ${higherOrLower} ${metricLabel} compared to ${group.groupA.label}.`;

      // Representative creative examples
      const imageExamples: ExampleCreativeDisplay[] = [];
      const exA = group.groupA.creatives[0];
      if (exA) {
        imageExamples.push({
          label: group.groupA.label,
          imageUrl: exA.imageUrl || undefined,
          metricValue: rateA,
          creativeId: exA.id,
          name: exA.name || group.groupA.label,
        });
      }
      const exB = group.groupB.creatives[0];
      if (exB) {
        imageExamples.push({
          label: group.groupB.label,
          imageUrl: exB.imageUrl || undefined,
          metricValue: rateB,
          creativeId: exB.id,
          name: exB.name || group.groupB.label,
        });
      }

      findings.push({
        id: `finding_${group.attributeKey}_${group.groupA.label.slice(0, 4)}_${metric}`,
        analysisSessionId: sessionId,
        attributeKey: group.attributeKey,
        attributeLabel: group.attributeLabel,
        metric,
        groupLabels: [group.groupA.label, group.groupB.label],
        groupValues: [rateA, rateB],
        groupCounts: [group.groupA.creatives.length, group.groupB.creatives.length],
        groupRawNumerators: [group.groupA.clicks, group.groupB.clicks],
        groupRawDenominators: [group.groupA.impressions, group.groupB.impressions],
        effectSize: diff,
        confidenceInterval: ci,
        sampleSize,
        status,
        method,
        limitations: [
          'Observational correlation across Halcyon campaign creatives; does not establish verified causality.',
          'Meta ad delivery algorithms allocate impressions non-randomly based on early auction feedback.',
          'Unobserved external variables (audience targeting, seasonal bidding) may influence performance.',
        ],
        summary,
        imageExamples,
      });
    }
  }

  // Sort: Supported first, then Inconclusive, then Underpowered, descending by significance
  findings.sort((a, b) => {
    const statusOrder: Record<EvidenceStatus, number> = {
      supported: 0,
      inconclusive: 1,
      underpowered: 2,
      not_available: 3,
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return Math.abs(b.effectSize || 0) - Math.abs(a.effectSize || 0);
  });

  return findings;
}
