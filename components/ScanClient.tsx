'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUploader } from './ImageUploader';
import { OcrProgress } from './OcrProgress';
import { extractTextFromImage } from '@/lib/ocr/extractTextFromImage';
import { AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';

export function ScanClient() {
  const router = useRouter();
  const [text, setText] = useState('');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [ocrError, setOcrError] = useState('');

  // Cleanup object URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOcrError('');
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRunOcr = async () => {
    if (!selectedFile) {
      setOcrError('Bitte wähle zuerst ein Bild aus.');
      return;
    }

    setIsOcrRunning(true);
    setOcrError('');
    setOcrProgress(0);
    setOcrStatus('OCR wird vorbereitet');

    try {
      const result = await extractTextFromImage(selectedFile, (progress, status) => {
        setOcrProgress(progress);
        setOcrStatus(status);
      });

      if (result.text && result.text.trim().length > 0) {
        setText(result.text);
        setOcrStatus('Erkennung abgeschlossen');
      } else {
        setOcrError('Es konnte kein Text erkannt werden. Bitte versuche ein schärferes Foto oder füge den Text manuell ein.');
      }
    } catch (error) {
      console.error('OCR failed:', error);
      setOcrError('OCR ist fehlgeschlagen. Bitte versuche es erneut oder nutze die manuelle Eingabe.');
    } finally {
      setIsOcrRunning(false);
    }
  };

  const handleMockData = () => {
    setText('Zutaten: Zucker, Weizenmehl, Magermilchpulver, Kakaobutter, Erdnüsse, Sojalecithin. Kann Spuren von Haselnüssen enthalten.');
    setOcrError('');
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    sessionStorage.setItem('liza_current_scan', text);
    router.push('/result');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Zutaten scannen</h1>
        <p className="text-muted-foreground">
          Fotografiere oder lade ein Bild der Zutatenliste hoch. Achte auf gutes Licht, scharfen Fokus und möglichst geraden Winkel.
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6 space-y-6">
          
          <div className="space-y-4">
            <ImageUploader onFileSelect={handleFileSelect} disabled={isOcrRunning} />
            
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-full max-w-sm rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Vorschau der Zutatenliste" className="w-full h-auto object-contain max-h-64 bg-black/5" />
                </div>
              </div>
            )}
            
            {selectedFile && !isOcrRunning && (
              <Button 
                onClick={handleRunOcr} 
                className="w-full gap-2"
                size="lg"
              >
                <ImageIcon className="w-5 h-5" />
                Text aus Bild erkennen
              </Button>
            )}

            {isOcrRunning && (
              <Button disabled className="w-full gap-2" size="lg">
                <FileText className="w-5 h-5 animate-pulse" />
                Erkennung läuft...
              </Button>
            )}

            {isOcrRunning && (
              <OcrProgress progress={ocrProgress} status={ocrStatus} />
            )}

            {ocrError && (
              <div className="bg-destructive/15 text-destructive border border-destructive/20 p-4 rounded-md flex gap-3 items-start mt-4">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="text-sm font-medium leading-relaxed">
                  {ocrError}
                </div>
              </div>
            )}
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ergebnis & Analyse
              </span>
            </div>
          </div>

          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Erkannter Text erscheint hier oder Zutatenliste manuell einfügen..."
            className="min-h-[150px] text-lg p-4 resize-y"
            disabled={isOcrRunning}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button variant="outline" onClick={handleMockData} className="w-full sm:w-auto" disabled={isOcrRunning}>
              Mock-Zutatenliste verwenden
            </Button>
            <Button size="lg" onClick={handleAnalyze} disabled={!text.trim() || isOcrRunning} className="w-full sm:w-auto px-8">
              Analyse starten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
