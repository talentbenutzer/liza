'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { extractTextFromImage } from '@/lib/ocr/extractTextFromImage';
import { Upload, Camera, AlertCircle } from 'lucide-react';

export function ScanClient() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [ocrError, setOcrError] = useState('');

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    
    if (!isOcrRunning) {
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOcrRunning]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const processFile = async (file: File) => {
    stopCamera();
    setIsOcrRunning(true);
    setOcrError('');

    try {
      const result = await extractTextFromImage(file);

      if (result.text && result.text.trim().length > 0) {
        sessionStorage.setItem('liza_current_scan', result.text);
        router.push('/result');
      } else {
        setOcrError('Es konnte kein Text erkannt werden. Bitte versuche ein schärferes Foto.');
        setIsOcrRunning(false);
      }
    } catch (error) {
      console.error('OCR failed:', error);
      setOcrError('OCR ist fehlgeschlagen. Bitte versuche es erneut.');
      setIsOcrRunning(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0) {
      setOcrError('Kamera ist noch nicht bereit.');
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) {
        setOcrError('Konnte kein Bild aufnehmen.');
        return;
      }
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      processFile(file);
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (isOcrRunning) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
        <div className="flex gap-4 text-7xl font-bold text-primary tracking-widest">
          {['L', 'I', 'Z', 'A'].map((letter, i) => (
            <span 
              key={i} 
              className="animate-bounce drop-shadow-md"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="text-xl font-bold text-muted-foreground animate-pulse text-center">
          Zutaten werden überprüft ...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 flex flex-col items-center animate-in fade-in duration-500 pb-20">
      
      {ocrError && (
        <div className="bg-destructive/15 text-destructive border border-destructive/20 p-4 rounded-xl flex gap-3 items-start w-full">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="text-sm font-medium leading-relaxed">
            {ocrError}
          </div>
        </div>
      )}

      <div className="w-full text-center space-y-2">
        <h1 className="text-3xl font-bold">Zutaten scannen</h1>
        <p className="text-muted-foreground text-sm">Fotografiere die Zutatenliste</p>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border-[6px] border-white/50">
        {stream ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="text-white/50 flex flex-col items-center justify-center gap-2">
            <Camera className="w-8 h-8 opacity-50" />
            <span>Kamera wird gestartet...</span>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Viewfinder overlay */}
        <div className="absolute inset-8 border-2 border-white/30 rounded-2xl pointer-events-none" />
        
        {/* Prominent Red Capture Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 bg-[var(--liza-red)] rounded-full border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            aria-label="Foto aufnehmen"
          >
            <Camera className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {/* Upload Button at the bottom */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      
      <div className="flex w-full gap-4">
        <Button 
          variant="outline" 
          size="lg"
          className="flex-1 rounded-full gap-2 shadow-sm font-semibold h-14"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-5 h-5" />
          Bild hochladen
        </Button>

        <Button 
          variant="secondary"
          size="lg"
          className="rounded-full gap-2 shadow-sm font-semibold h-14 px-6"
          onClick={() => {
            sessionStorage.setItem('liza_current_scan', 'Zutaten: Zucker, Weizenmehl, Magermilchpulver, Kakaobutter, Erdnüsse, Sojalecithin. Kann Spuren von Haselnüssen enthalten.');
            router.push('/result');
          }}
        >
          Mock
        </Button>
      </div>
    </div>
  );
}
