export type RestrictionType = 'intolerance' | 'allergy' | 'avoidance';
export type Severity = 'low' | 'medium' | 'high';
export type RiskLevel = 'green' | 'yellow' | 'red';

export interface UserFoodRestriction {
  id: string;
  name: string;
  restrictionType: RestrictionType;
  severity: Severity;
  avoidTraces: boolean;
  notes?: string;
  createdAt: number;
}

export interface IngredientMatch {
  matchedText: string;
  restrictionName: string;
  restrictionType: RestrictionType;
  severity: Severity;
  isTraceWarning: boolean;
  riskLevel: RiskLevel;
  explanation: string;
  confidence: number;
}

export interface AnalysisResult {
  status: RiskLevel;
  summary: string;
  matches: IngredientMatch[];
  normalizedText: string;
  originalText: string;
}

export interface ScanHistoryItem {
  id: string;
  createdAt: number;
  originalText: string;
  correctedText?: string;
  resultStatus: RiskLevel;
  matches: IngredientMatch[];
  lisaProfileResult?: import('../lisa/types').LisaProfileAnalysisResult;
}
