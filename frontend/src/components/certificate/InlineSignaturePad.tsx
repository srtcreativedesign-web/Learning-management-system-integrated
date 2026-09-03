import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Upload, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveCertificateImageUrl } from './CertificateCanvas';

interface InlineSignaturePadProps {
  signatureUrl: string | null;
  onSignatureChange: (dataUrl: string | null) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading?: boolean;
  strokeColorDefault?: string;
}

export const InlineSignaturePad: React.FC<InlineSignaturePadProps> = ({
  signatureUrl,
  onSignatureChange,
  onFileUpload,
  isUploading = false,
  strokeColorDefault = '#0F4F68',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState(strokeColorDefault);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const resolvedPreviewUrl = resolveCertificateImageUrl(signatureUrl);

  useEffect(() => {
    setPreviewError(false);
  }, [signatureUrl]);

  // Setup canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Auto-sync canvas content to state/preview
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange(dataUrl);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-[10.5px] font-bold text-slate-700 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-[#0F4F68]" /> Gores Tanda Tangan (Canvas Langsung):
        </label>
        {signatureUrl && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10.5px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-0.5"
          >
            <Trash2 className="w-3 h-3" /> Hapus TTD
          </button>
        )}
      </div>

      {/* Embedded Drawing Canvas Box */}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-[#0F4F68] rounded-xl bg-slate-50/70 overflow-hidden transition-colors shadow-2xs">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-28 cursor-crosshair touch-none bg-transparent"
        />

        {/* Baseline Guide */}
        <div className="absolute bottom-4 left-6 right-6 border-b border-slate-300/80 pointer-events-none flex justify-between items-center text-[9px] text-slate-400">
          <span>Garis tanda tangan</span>
          <span>✕</span>
        </div>

        {!hasDrawn && !signatureUrl && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
            <p className="text-[11px] font-medium text-slate-500">Goreskan tanda tangan langsung di sini</p>
            <p className="text-[9.5px] text-slate-400 mt-0.5">(Tarik mouse / jari di kotak ini)</p>
          </div>
        )}

        {resolvedPreviewUrl && !hasDrawn && !previewError && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-2 bg-white/90">
            <img
              src={resolvedPreviewUrl}
              alt="Signature Preview"
              className="max-h-20 object-contain"
              onError={() => setPreviewError(true)}
            />
          </div>
        )}
      </div>

      {/* Controls Strip: Palette + Upload PNG alternative */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500">Tinta:</span>
          {[
            { color: '#0F4F68', name: 'Navy' },
            { color: '#1e293b', name: 'Hitam' },
            { color: '#1d4ed8', name: 'Biru' },
          ].map((item) => (
            <button
              key={item.color}
              type="button"
              onClick={() => setStrokeColor(item.color)}
              className={`w-4.5 h-4.5 rounded-full border transition-all ${
                strokeColor === item.color
                  ? 'scale-115 border-slate-900 ring-1 ring-slate-400 shadow-2xs'
                  : 'border-white'
              }`}
              style={{ backgroundColor: item.color }}
              title={item.name}
            />
          ))}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-[10.5px] text-slate-500 hover:text-rose-600 gap-1 h-6 px-1.5 ml-1 rounded-lg"
          >
            <RotateCcw className="w-3 h-3" /> Bersihkan
          </Button>
        </div>

        {/* Upload PNG alternative */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-[10px] font-semibold h-6 rounded-lg gap-1 px-2 text-slate-600"
          >
            <Upload className="w-3 h-3" /> {isUploading ? '...' : 'Atau Upload PNG'}
          </Button>
        </div>
      </div>
    </div>
  );
};
