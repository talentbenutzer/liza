export type RiskLevel = 'green' | 'yellow' | 'red';
export type LisaFoodStatus = 'happy' | 'no_go';

export interface LisaFoodItem {
  id: string;
  name: string;
  category: string;
  status: LisaFoodStatus;
  aliases: string[];
  notes?: string;
}

export interface LisaProfileAnalysisResult {
  status: RiskLevel;
  happyMatches: string[];
  noGoMatches: string[];
  summary: string;
}
