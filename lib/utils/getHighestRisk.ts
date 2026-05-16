import { RiskLevel } from '../analyzer/types';

export function getHighestRisk(risks: RiskLevel[]): RiskLevel {
  if (risks.includes('red')) return 'red';
  if (risks.includes('yellow')) return 'yellow';
  return 'green';
}
