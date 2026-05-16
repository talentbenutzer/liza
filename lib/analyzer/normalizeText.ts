export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\n\r]+/g, ' ')       // replace newlines with spaces
    .replace(/[.,:;()]/g, ' ')      // remove punctuation
    .replace(/\s{2,}/g, ' ')        // replace multiple spaces
    .trim();
}

export function extractIngredients(text: string): string[] {
  // Try to find the start of the ingredients list, e.g., "Zutaten:"
  const normalized = text.toLowerCase();
  let content = text;
  
  const zutatenIndex = normalized.indexOf('zutaten:');
  if (zutatenIndex !== -1) {
    content = text.substring(zutatenIndex + 8);
  }
  
  // Split by commas
  return content.split(',').map(item => item.trim()).filter(Boolean);
}
