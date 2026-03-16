import React, { useState, useCallback } from 'react';
import { X, Sparkles, Download, Image } from 'lucide-react';
import type { SignTypeState, DesignTokens } from '../../types/index.ts';
import { generateMockup } from '../../lib/ai-client.ts';
import type { MockupRequest } from '../../lib/ai-client.ts';

interface MockupGeneratorProps {
  signType: SignTypeState;
  resolvedTokens: DesignTokens;
  onClose: () => void;
}

type MockupStyle = MockupRequest['style'];

const STYLE_OPTIONS: { value: MockupStyle; label: string }[] = [
  { value: 'wall_mounted', label: 'Wall Mounted' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'lobby', label: 'Lobby' },
];

const MAX_MOCKUPS_PER_SESSION = 5;

export const MockupGenerator: React.FC<MockupGeneratorProps> = ({
  signType,
  resolvedTokens,
  onClose,
}) => {
  const [style, setStyle] = useState<MockupStyle>('wall_mounted');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; prompt: string } | null>(null);
  const [remaining, setRemaining] = useState(MAX_MOCKUPS_PER_SESSION);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (remaining <= 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Extract first text from zones for the mockup label
      const textZone = signType.zones.find(
        (z) => z.visible && z.content.text && z.zoneType === 'primary_text',
      );
      const signText = textZone?.content.text ?? signType.typeName;

      const request: MockupRequest = {
        signSpecs: {
          width: signType.size.w,
          height: signType.size.h,
          material: resolvedTokens.faceMaterial,
          color: resolvedTokens.faceColor,
          text: signText,
        },
        style,
      };

      const res = await generateMockup(request);
      setResult(res);
      setRemaining((r) => r - 1);
    } catch (_e) {
      setError('Failed to generate mockup. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [signType, resolvedTokens, style, remaining]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `mockup-${signType.typeCode}-${style}.svg`;
    link.click();
  }, [result, signType.typeCode, style]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-elevated rounded-lg border border-border shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-text-primary">
              AI Mockup Generator
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
          {/* Sign info */}
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="px-2 py-0.5 rounded bg-accent-bg text-accent font-medium">
              {signType.typeCode}
            </span>
            <span>
              {signType.size.w}" x {signType.size.h}"
            </span>
            <span className="text-text-muted">|</span>
            <span>{resolvedTokens.faceMaterial}</span>
          </div>

          {/* Style selector */}
          <div>
            <label className="block text-[11px] text-text-muted uppercase tracking-wide mb-1.5">
              Scene Style
            </label>
            <div className="flex gap-2">
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStyle(opt.value)}
                  className={[
                    'px-3 py-1.5 text-xs font-medium rounded border transition-colors',
                    style === opt.value
                      ? 'border-accent bg-accent-bg text-accent'
                      : 'border-border text-text-secondary hover:border-accent/40 hover:text-text-primary',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview area */}
          <div className="relative w-full aspect-[4/3] rounded-lg border border-border bg-surface overflow-hidden flex items-center justify-center">
            {loading && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-text-muted">
                  Generating mockup...
                </span>
              </div>
            )}

            {!loading && !result && (
              <div className="flex flex-col items-center gap-2 text-text-muted">
                <Image className="w-10 h-10 opacity-30" />
                <span className="text-xs">
                  Click "Generate" to create an AI mockup
                </span>
              </div>
            )}

            {!loading && result && (
              <img
                src={result.imageUrl}
                alt="AI Mockup Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Prompt info */}
          {result && (
            <p className="text-[10px] text-text-muted italic">{result.prompt}</p>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-error">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <span className="text-[10px] text-text-muted">
            {remaining} mockup{remaining !== 1 ? 's' : ''} remaining this session
          </span>
          <div className="flex items-center gap-2">
            {result && (
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
              disabled={loading || remaining <= 0}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white
                disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              <Sparkles className="w-3 h-3" />
              {loading ? 'Generating...' : 'Generate Mockup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
