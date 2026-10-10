export interface GroupStats {
  label: string;
  count: number;
  numerator: number;
  denominator: number;
  rate: number;
}

export interface ComparisonResult {
  groupA: GroupStats;
  groupB: GroupStats;
  effectSize: number | null; // groupB.rate - groupA.rate (or relative difference)
  confidenceInterval: [number, number] | null;
  sampleSize: number;
  standardError: number | null;
  zScore: number | null;
  pValue: number | null;
  isUnderpowered: boolean;
}

/**
 * Normal approximation for two-proportion / rate difference.
 * Computes 95% Wald or Agresti-Caffo confidence interval for p2 - p1.
 * Strict statistical integrity:
 * - If denominators or sample sizes are inadequate, returns null CI and flags underpowered.
 * - Does not invent fake CI or p-values.
 */
export function compareProportions(
  groupA: { count: number; numerator: number; denominator: number },
  groupB: { count: number; numerator: number; denominator: number },
  groupALabel = 'Group A',
  groupBLabel = 'Group B'
): ComparisonResult {
  const nA = groupA.denominator;
  const nB = groupB.denominator;
  const sampleSize = groupA.count + groupB.count;

  const statsA: GroupStats = {
    label: groupALabel,
    count: groupA.count,
    numerator: groupA.numerator,
    denominator: groupA.denominator,
    rate: nA > 0 ? groupA.numerator / nA : 0,
  };

  const statsB: GroupStats = {
    label: groupBLabel,
    count: groupB.count,
    numerator: groupB.numerator,
    denominator: groupB.denominator,
    rate: nB > 0 ? groupB.numerator / nB : 0,
  };

  // Underpowered threshold: if either group has fewer than 5 creatives or zero denominator
  if (groupA.count < 5 || groupB.count < 5 || nA <= 0 || nB <= 0) {
    return {
      groupA: statsA,
      groupB: statsB,
      effectSize: nA > 0 && nB > 0 ? statsB.rate - statsA.rate : null,
      confidenceInterval: null,
      sampleSize,
      standardError: null,
      zScore: null,
      pValue: null,
      isUnderpowered: true,
    };
  }

  const p1 = statsA.rate;
  const p2 = statsB.rate;
  const diff = p2 - p1;

  // Standard error of difference between two independent proportions
  const se = Math.sqrt((p1 * (1 - p1)) / nA + (p2 * (1 - p2)) / nB);

  if (se === 0 || isNaN(se)) {
    return {
      groupA: statsA,
      groupB: statsB,
      effectSize: diff,
      confidenceInterval: null,
      sampleSize,
      standardError: null,
      zScore: null,
      pValue: null,
      isUnderpowered: true,
    };
  }

  const z = 1.96; // 95% Confidence Interval critical value
  const marginOfError = z * se;
  const ci: [number, number] = [diff - marginOfError, diff + marginOfError];

  const zScore = diff / se;

  // Approximate two-tailed p-value from z-score
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore)));

  return {
    groupA: statsA,
    groupB: statsB,
    effectSize: diff,
    confidenceInterval: ci,
    sampleSize,
    standardError: se,
    zScore,
    pValue,
    isUnderpowered: false,
  };
}

/**
 * Compares two continuous distributions (e.g. CPA, CPC, ROAS) using
 * Welch's two-sample comparison with 95% confidence interval.
 */
export function compareMeans(
  valuesA: number[],
  valuesB: number[],
  groupALabel = 'Group A',
  groupBLabel = 'Group B'
): ComparisonResult {
  const nA = valuesA.length;
  const nB = valuesB.length;
  const sampleSize = nA + nB;

  if (nA < 5 || nB < 5) {
    const meanA = nA > 0 ? valuesA.reduce((a, b) => a + b, 0) / nA : 0;
    const meanB = nB > 0 ? valuesB.reduce((a, b) => a + b, 0) / nB : 0;
    return {
      groupA: { label: groupALabel, count: nA, numerator: 0, denominator: nA, rate: meanA },
      groupB: { label: groupBLabel, count: nB, numerator: 0, denominator: nB, rate: meanB },
      effectSize: meanB - meanA,
      confidenceInterval: null,
      sampleSize,
      standardError: null,
      zScore: null,
      pValue: null,
      isUnderpowered: true,
    };
  }

  const meanA = valuesA.reduce((a, b) => a + b, 0) / nA;
  const meanB = valuesB.reduce((a, b) => a + b, 0) / nB;
  const diff = meanB - meanA;

  const varA = valuesA.reduce((acc, val) => acc + Math.pow(val - meanA, 2), 0) / (nA - 1);
  const varB = valuesB.reduce((acc, val) => acc + Math.pow(val - meanB, 2), 0) / (nB - 1);

  const se = Math.sqrt(varA / nA + varB / nB);

  if (se === 0 || isNaN(se)) {
    return {
      groupA: { label: groupALabel, count: nA, numerator: 0, denominator: nA, rate: meanA },
      groupB: { label: groupBLabel, count: nB, numerator: 0, denominator: nB, rate: meanB },
      effectSize: diff,
      confidenceInterval: null,
      sampleSize,
      standardError: null,
      zScore: null,
      pValue: null,
      isUnderpowered: true,
    };
  }

  const z = 1.96;
  const ci: [number, number] = [diff - z * se, diff + z * se];
  const zScore = diff / se;
  const pValue = 2 * (1 - normalCdf(Math.abs(zScore)));

  return {
    groupA: { label: groupALabel, count: nA, numerator: 0, denominator: nA, rate: meanA },
    groupB: { label: groupBLabel, count: nB, numerator: 0, denominator: nB, rate: meanB },
    effectSize: diff,
    confidenceInterval: ci,
    sampleSize,
    standardError: se,
    zScore,
    pValue,
    isUnderpowered: sampleSize < 20 || nA < 10 || nB < 10,
  };
}

/**
 * Standard Normal Cumulative Distribution Function approximation.
 */
function normalCdf(z: number): number {
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * erf);
}
