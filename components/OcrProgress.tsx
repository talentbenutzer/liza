interface OcrProgressProps {
  progress: number;
  status: string;
}

export function OcrProgress({ progress, status }: OcrProgressProps) {
  const percentage = Math.round(progress * 100);
  
  return (
    <div className="w-full space-y-2 mt-4">
      <div className="flex justify-between text-sm font-medium">
        <span>{status}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
