import React, { useState, Suspense } from 'react';
import { X, Box, RotateCcw } from 'lucide-react';
import { SignPreview3D } from './SignPreview3D.tsx';
import type { DesignTokens } from '../../types/index.ts';

interface Sign3DModalProps {
  width: number;
  height: number;
  tokens: DesignTokens;
  text?: string;
  onClose: () => void;
}

type Quality = 'low' | 'medium' | 'high';

export const Sign3DModal: React.FC<Sign3DModalProps> = ({
  width,
  height,
  tokens,
  text,
  onClose,
}) => {
  const [showWall, setShowWall] = useState(true);
  const [showShadows, setShowShadows] = useState(true);
  const [quality, setQuality] = useState<Quality>('medium');

  // Force re-mount the canvas when quality changes (to re-init renderer)
  const [canvasKey, setCanvasKey] = useState(0);
  const handleQualityChange = (q: Quality) => {
    setQuality(q);
    setCanvasKey((k) => k + 1);
  };

  // Quality is available for future pixel-ratio / shadow-map adjustments
  void quality;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-surface-elevated/90 border-b border-border">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-text-primary">
            3D Preview
          </span>
          <span className="text-[10px] text-text-muted ml-2">
            {width}" x {height}" &mdash; {tokens.constructionType.replace(/_/g, ' ')}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-text-muted">Loading 3D scene...</span>
              </div>
            </div>
          }
        >
          <SignPreview3D
            key={canvasKey}
            width={width}
            height={height}
            tokens={tokens}
            text={text}
            showWall={showWall}
            showShadows={showShadows}
          />
        </Suspense>

        {/* Floating controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated/90 border border-border backdrop-blur-sm shadow-xl">
          {/* Show wall toggle */}
          <ToggleChip
            label="Wall"
            active={showWall}
            onClick={() => setShowWall((v) => !v)}
          />

          {/* Show shadows toggle */}
          <ToggleChip
            label="Shadows"
            active={showShadows}
            onClick={() => setShowShadows((v) => !v)}
          />

          <div className="w-px h-5 bg-border mx-1" />

          {/* Quality selector */}
          <span className="text-[9px] text-text-muted uppercase tracking-wide mr-1">
            Quality
          </span>
          {(['low', 'medium', 'high'] as const).map((q) => (
            <button
              key={q}
              onClick={() => handleQualityChange(q)}
              className={[
                'px-2 py-0.5 text-[10px] font-medium rounded transition-colors',
                quality === q
                  ? 'bg-accent-bg text-accent'
                  : 'text-text-muted hover:text-text-secondary',
              ].join(' ')}
            >
              {q.charAt(0).toUpperCase() + q.slice(1)}
            </button>
          ))}

          <div className="w-px h-5 bg-border mx-1" />

          {/* Reset view hint */}
          <div className="flex items-center gap-1 text-[9px] text-text-muted">
            <RotateCcw className="w-3 h-3" />
            Drag to orbit
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Small toggle chip
// ---------------------------------------------------------------------------

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors',
        active
          ? 'border-accent bg-accent-bg text-accent'
          : 'border-border text-text-muted hover:border-accent/40',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
