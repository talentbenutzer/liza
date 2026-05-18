import { ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploader({ onFileSelect, disabled }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={cameraInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />

      <Button
        variant="outline"
        className="flex-1 gap-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <Upload className="w-4 h-4" />
        Bild hochladen
      </Button>

      <Button
        variant="outline"
        className="flex-1 gap-2"
        onClick={() => cameraInputRef.current?.click()}
        disabled={disabled}
      >
        <Camera className="w-4 h-4" />
        Kamera öffnen
      </Button>
    </div>
  );
}
