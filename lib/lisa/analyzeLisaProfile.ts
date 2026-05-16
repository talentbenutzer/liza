import { LisaProfileAnalysisResult, LisaFoodItem } from './types';
import { normalizeText } from '../analyzer/normalizeText';
import { predefinedLisaFoods } from './lisaFoods';

export function analyzeLisaProfile(text: string, customFoods?: LisaFoodItem[]): LisaProfileAnalysisResult {
  const normalizedText = normalizeText(text);
  
  const happyMatches: string[] = [];
  const noGoMatches: string[] = [];

  const foodsToUse = customFoods || predefinedLisaFoods;

  foodsToUse.forEach(food => {
    // Check main name and all aliases
    const searchTerms = [food.name, ...(food.aliases || [])].map(t => t.toLowerCase());
    
    let matchedName = '';
    
    for (const term of searchTerms) {
      // Create a regex to match the term as a whole word, 
      // considering German umlauts which are non-word characters in standard \b sometimes
      // Since normalizedText has punctuation replaced by spaces, we can check space boundaries
      const regex = new RegExp(`(^|\\s)${term}(?=\\s|$)`, 'i');
      if (regex.test(normalizedText)) {
        matchedName = food.name;
        break;
      }
    }

    if (matchedName) {
      if (food.status === 'no_go') {
        if (!noGoMatches.includes(matchedName)) {
          noGoMatches.push(matchedName);
        }
      } else if (food.status === 'happy') {
        if (!happyMatches.includes(matchedName)) {
          happyMatches.push(matchedName);
        }
      }
    }
  });

  let status: import('./types').RiskLevel = 'yellow';
  let summary = '';

  if (noGoMatches.length > 0) {
    status = 'red';
    summary = 'In der Zutatenliste wurden Lebensmittel oder Zutaten gefunden, die im Lisa-Profil als nicht geeignet markiert sind.';
  } else if (happyMatches.length > 0 && noGoMatches.length === 0) {
    status = 'green';
    summary = 'Die erkannten Zutaten passen nach aktuellem Lisa-Profil zu den Happy-Nahrungsmitteln. Bitte prüfe die Verpackung trotzdem selbst.';
  } else {
    status = 'yellow';
    summary = 'Die Zutatenliste konnte nicht eindeutig mit dem Lisa-Profil abgeglichen werden. Bitte manuell prüfen.';
  }

  return {
    status,
    happyMatches,
    noGoMatches,
    summary,
  };
}
