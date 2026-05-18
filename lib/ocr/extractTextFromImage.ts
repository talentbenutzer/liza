import { OcrResult } from './types';
import { recognizeWithTesseract } from './providers/tesseractOcrProvider';

export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number, status: string) => void
): Promise<OcrResult> {
  return recognizeWithTesseract(file, onProgress);
}
