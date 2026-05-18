export interface OcrResult {
  text: string;
  confidence?: number;
  provider: "tesseract" | "mock";
  durationMs?: number;
}
