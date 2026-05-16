import { UserFoodRestriction, IngredientMatch, RiskLevel, AnalysisResult } from './types';
import { normalizeText } from './normalizeText';
import { getHighestRisk } from '../utils/getHighestRisk';

export function analyzeIngredients(
  text: string,
  restrictions: UserFoodRestriction[]
): AnalysisResult {
  const normalizedText = normalizeText(text);
  const matches: IngredientMatch[] = [];

  // Very basic trace detection for "Kann Spuren von ... enthalten"
  // A better approach would be to parse the ingredients and traces separately.
  const traceKeywords = ['spuren von', 'kann spuren', 'spuren enthalten', 'kann enthalten'];
  let traceSectionStart = -1;
  
  for (const keyword of traceKeywords) {
    const idx = normalizedText.indexOf(keyword);
    if (idx !== -1) {
      if (traceSectionStart === -1 || idx < traceSectionStart) {
        traceSectionStart = idx;
      }
    }
  }

  restrictions.forEach(restriction => {
    const restrictionNameLower = restriction.name.toLowerCase();
    
    // Check if it appears in the text
    const idx = normalizedText.indexOf(restrictionNameLower);
    
    if (idx !== -1) {
      const isTrace = traceSectionStart !== -1 && idx > traceSectionStart;
      
      let risk: RiskLevel = 'green';
      let explanation = '';

      if (restriction.restrictionType === 'allergy') {
        if (!isTrace) {
          risk = 'red';
          explanation = 'Allergie direkter Treffer';
        } else {
          if (restriction.avoidTraces) {
            risk = 'red';
            explanation = 'Allergie Spurenhinweis, und Spuren sollen vermieden werden';
          } else {
            risk = 'yellow';
            explanation = 'Allergie Spurenhinweis, aber Spuren müssen nicht vermieden werden';
          }
        }
      } else if (restriction.restrictionType === 'intolerance') {
        if (!isTrace) {
          if (restriction.severity === 'high') {
            risk = 'red';
            explanation = 'Unverträglichkeit direkter Treffer (Schweregrad hoch)';
          } else {
            risk = 'yellow';
            explanation = `Unverträglichkeit direkter Treffer (Schweregrad ${restriction.severity})`;
          }
        } else {
          risk = 'yellow';
          explanation = 'Unverträglichkeit Spurenhinweis';
        }
      } else if (restriction.restrictionType === 'avoidance') {
        if (!isTrace) {
          if (restriction.severity === 'high') {
            risk = 'red';
            explanation = 'Persönliche Vermeidung direkter Treffer (Schweregrad hoch)';
          } else {
            risk = 'yellow';
            explanation = `Persönliche Vermeidung direkter Treffer (Schweregrad ${restriction.severity})`;
          }
        } else {
          risk = 'yellow';
          explanation = 'Persönliche Vermeidung Spurenhinweis';
        }
      }

      matches.push({
        matchedText: restriction.name, // the matched word in the UI
        restrictionName: restriction.name,
        restrictionType: restriction.restrictionType,
        severity: restriction.severity,
        isTraceWarning: isTrace,
        riskLevel: risk,
        explanation,
        confidence: 1.0,
      });
    }
  });

  const status = getHighestRisk(matches.map(m => m.riskLevel));
  
  let summary = '';
  if (status === 'red') {
    summary = 'Es wurden problematische Risikobegriffe gefunden. Dieses Produkt sollte anhand deines Profils kritisch geprüft oder vermieden werden.';
  } else if (status === 'yellow') {
    summary = 'Es wurden mögliche Risikobegriffe gefunden. Bitte prüfe die Zutatenliste sorgfältig.';
  } else {
    summary = 'In der erkannten Zutatenliste wurden keine passenden Risikobegriffe gefunden. Bitte prüfe die Verpackung trotzdem selbst.';
  }

  return {
    status,
    summary,
    matches,
    normalizedText,
    originalText: text,
  };
}
