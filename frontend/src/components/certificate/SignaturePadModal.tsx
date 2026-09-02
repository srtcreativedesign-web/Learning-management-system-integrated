import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, X, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  signerTitle?: string;
  signerName?: string;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  signerTitle = 'Penandatangan',
  signerName = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#0F4F68'); // Navy default
  const [strokeWidth, setStrokeWidth] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    // Initialize canvas on modal open
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set internal resolution based on device pixel ratio for super-sharp retina strokes
      const dpr = window.devicePixelRatio || 2;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, rect.width, rect.height);
      setHasSignature(false);
    }, 50);
  }, [isOpen]);

  if (!isOpen) return null;

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
    ctx.lineWidth = strokeWidth;
    setIsDrawing(true);
    setHasSignature(true);
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
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
  };

  const handleApplySignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    // Export transparent PNG
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F4F68] text-white flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Gores Tanda Tangan Digital
              </h3>
              <p className="text-[11px] text-slate-400">
                {signerTitle}: <strong className="text-slate-700">{signerName || 'Pejabat'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Body */}
        <div className="p-5 space-y-3">
          <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-56 cursor-crosshair touch-none"
            />

            {/* Baseline Guide */}
            <div className="absolute bottom-10 left-8 right-8 border-b border-slate-300 pointer-events-none flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>Tanda tangan di atas garis</span>
              <span>✕</span>
            </div>

            {!hasSignature && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
                <PenTool className="w-6 h-6 mb-1 text-slate-300" />
                <p>Goreskan tanda tangan Anda di sini</p>
                <p className="text-[10px] text-slate-400 mt-0.5">(Gunakan mouse, touchpad, atau jari pada layar sentuh)</p>
              </div>
            )}
          </div>

          {/* Color & Pen Thickness Palette */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Warna Tinta:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { color: '#0F4F68', name: 'Navy' },
                  { color: '#1e293b', name: 'Hitam Pekat' },
                  { color: '#1d4ed8', name: 'Biru Ballpoint' },
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => setStrokeColor(item.color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      strokeColor === item.color
                        ? 'scale-110 border-slate-900 shadow-xs ring-2 ring-slate-300'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearCanvas}
              className="text-xs text-slate-500 hover:text-rose-600 gap-1 h-8 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Bersihkan
            </Button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs rounded-xl h-9"
          >
            Batal
          </Button>

          <Button
            size="sm"
            onClick={handleApplySignature}
            disabled={!hasSignature}
            className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white font-bold text-xs gap-1.5 rounded-xl h-9 px-4 shadow-xs"
          >
            <Check className="w-4 h-4" /> Terapkan TTD
          </Button>
        </div>
      </div>
    </div>
  );
};
