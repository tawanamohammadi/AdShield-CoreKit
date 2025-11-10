export type TestCategory = 
  | 'Google' 
  | 'Meta' 
  | 'Amazon'
  | 'Microsoft'
  | 'Social'
  | 'Mobile'
  | 'Programmatic'
  | 'Native'
  | 'eCommerce'
  | 'Audio'
  | 'Analytics'
  | 'Other';

export interface TestEndpoint {
  url: string;
  category: TestCategory;
  weight: number;
}

export type TestResultStatus = 'pending' | 'blocked' | 'loaded';

export interface ResultBreakdown {
  domain: string;
  category: TestCategory;
  status: TestResultStatus;
}

export interface BenchmarkResult {
  score: number;
  blocked: number;
  loaded: number;
  total: number;
  timestamp: string;
  breakdown: ResultBreakdown[];
}

export type TestRunStatus = 'idle' | 'running' | 'finished';
