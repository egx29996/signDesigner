import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Download, Camera, Move } from 'lucide-react';
import { generateSpaceComposite } from '../../lib/ai-client.ts';
import type { MockupRequest } from '../../lib/ai-client.ts';
import type { SignTypeState, DesignTokens } from '../../types/index.ts';

interface SpacePreviewProps {
  signType: SignTypeState;
  resolvedTokens: DesignTokens;
  onClose: () => void;
}

interface SignPlacement {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // 0.25 - 2.0
}

export const SpacePreview: React.FC<SpacePreviewProps> = ({
  signType,
  resolvedTokens,
  onClose,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [placement, setPlacement] = useState<SignPlacement>({ x: 50, y: 40, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // --- File handling ---

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setPhotoFile(file);
    setCompositeUrl(null);
    setPlacement({ x: 50, y: 40, scale: 1 });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // --- Sign dragging ---

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!photoUrl) return;
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [photoUrl],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPlacement((p) => ({
        ...p,
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y)),
      }));
    },
    [dragging],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  // --- Generate composite ---

  const handleGenerate = useCallback(async () => {
    if (!photoFile) return;
    setLoading(true);
    try {
      const textZone = signType.zones.find(
        (z) => z.visible && z.content.text && z.zoneType === 'primary_text',
      );
      const request: MockupRequest = {
        signSpecs: {
          width: signType.size.w,
          height: signType.size.h,
          material: resolvedTokens.faceMaterial,
          color: resolvedTokens.faceColor,
          text: textZone?.content.text ?? signType.typeName,
        },
        style: 'hallway',
      };
      const result = await generateSpaceComposite(photoFile, request);
      setCompositeUrl(result);
    } catch {
      // Stubbed — errors silently for now
    } finally {
      setLoading(false);
    }
  }, [photoFile, signType, resolvedTokens]);

  // --- Download ---

  const handleDownload = useCallback(() => {
    const url = compositeUrl ?? photoUrl;
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `space-preview-${signType.typeCode}.png`;
    link.click();
  }, [compositeUrl, photoUrl, signType.typeCode]);

  // --- Sign overlay dimensions ---
  const signW = signType.size.w * placement.scale;
  const signH = signType.size.h * placement.scale;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-elevated rounded-lg border border-border shadow-2xl w-full max-w-3xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-text-primary">
              Preview in Space
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Upload area or preview */}
          {!photoUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={[
                'w-full aspect-[16/10] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors',
                dragOver
                  ? 'border-accent bg-accent-bg'
                  : 'border-border hover:border-accent/40',
              ].join(' ')}
            >
              <Upload className="w-10 h-10 text-text-muted opacity-40" />
              <span className="text-xs text-text-muted">
                Drop a hallway or space photo here, or click to browse
              </span>
              <span className="text-[10px] text-text-muted/60">
                JPG, PNG up to 10MB
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <>
              {/* Photo with sign overlay */}
              <div
                ref={previewRef}
                className="relative w-full aspect-[16/10] rounded-lg border border-border bg-surface overflow-hidden select-none"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Background photo */}
                <img
                  src={compositeUrl ?? photoUrl}
                  alt="Space preview"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Sign overlay (only when not viewing composite) */}
                {!compositeUrl && (
                  <div
                    onPointerDown={handlePointerDown}
                    className="absolute cursor-move"
                    style={{
                      left: `${placement.x}%`,
                      top: `${placement.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${signW}px`,
                      height: `${signH}px`,
                      maxWidth: '60%',
                    }}
                  >
                    <div
                      className="w-full h-full rounded border-2 border-accent/60 shadow-lg flex items-center justify-center"
                      style={{
                        backgroundColor: resolvedTokens.faceColor,
                        borderRadius: `${resolvedTokens.cornerRadius}px`,
                      }}
                    >
                      <span
                        className="text-xs font-semibold text-center px-1"
                        style={{ color: resolvedTokens.raisedTextColor }}
                      >
                        {signType.typeName}
                      </span>
                    </div>
                    {/* Drag indicator */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/80 text-white text-[8px] font-medium">
                      <Move className="w-2.5 h-2.5" />
                      Drag
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              {!compositeUrl && (
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className="text-[10px] text-text-muted uppercase tracking-wide">
                      Scale
                    </span>
                    <input
                      type="range"
                      min="0.25"
                      max="2"
                      step="0.05"
                      value={placement.scale}
                      onChange={(e) =>
                        setPlacement((p) => ({ ...p, scale: parseFloat(e.target.value) }))
                      }
                      className="w-32 accent-accent"
                    />
                    <span className="text-text-muted text-[10px] w-8">
                      {Math.round(placement.scale * 100)}%
                    </span>
                  </label>
                  <button
                    onClick={() => {
                      setPhotoUrl(null);
                      setPhotoFile(null);
                      setCompositeUrl(null);
                    }}
                    className="text-[10px] text-text-muted hover:text-error transition-colors"
                  >
                    Remove photo
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-border gap-2">
          {(compositeUrl ?? photoUrl) && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={!photoFile || loading}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white
              disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Camera className="w-3 h-3" />
            {loading ? 'Generating...' : 'Generate AI Composite'}
          </button>
        </div>
      </div>
    </div>
  );
};
