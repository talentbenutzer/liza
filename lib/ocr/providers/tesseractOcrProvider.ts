import { OcrResult } from '../types';

export async function recognizeWithTesseract(
  file: File,
  onProgress?: (progress: number, status: string) => void
): Promise<OcrResult> {
  const startTime = Date.now();
  
  // Dynamically import tesseract.js to avoid SSR issues
  const { createWorker } = await import('tesseract.js');
  
  const worker = await createWorker('deu', 1, {
    logger: (m: any) => {
      if (onProgress) {
        if (m.status === 'recognizing text') {
          onProgress(m.progress, 'Text wird erkannt');
        } else {
          onProgress(0, 'OCR wird vorbereitet');
        }
      }
    }
  });

  try {
    const ret = await worker.recognize(file);
    const durationMs = Date.now() - startTime;
    
    return {
      text: ret.data.text,
      confidence: ret.data.confidence,
      provider: 'tesseract',
      durationMs
    };
  } finally {
    await worker.terminate();
  }
}
