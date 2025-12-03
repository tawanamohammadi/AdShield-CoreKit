export type ScoreBreakdown = {
  ARD: number; // Ad request density
  ADE: number; // Ad DOM elements
  BPS: number; // Blended protection score
};

export type BenchmarkSamples = {
  matchedRequests: string[];
  domElements: Array<{ selector: string; reason: string }>;
};

export type BenchmarkResult = {
  url: string;
  timestamp: number;
  resourcesTotal: number;
  adRequestsDetected: number;
  domAdsDetected: number;
  scores: ScoreBreakdown;
  samples: BenchmarkSamples;
  notes: string[];
};

export type VisitorInfo = {
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
  asn?: string;
  vpnLikely: boolean;
  vpnReason?: string;
};
