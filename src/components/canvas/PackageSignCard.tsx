import React from 'react';
import type { SignTypeState, DesignTokens } from '../../types';
import { SignRenderer } from '../svg/SignRenderer';

interface PackageSignCardProps {
  signType: SignTypeState;
  resolvedTokens: DesignTokens;
  isActive: boolean;
  onClick: () => void;
}

export const PackageSignCard: React.FC<PackageSignCardProps> = React.memo(
  ({ signType, resolvedTokens, isActive, onClick }) => {
    const PX = 25;
    const maxCardW = 200;
    const maxCardH = 160;
    const svgW = signType.size.w * PX + 20;
    const svgH = signType.size.h * PX + 34;
    const scale = Math.min(maxCardW / svgW, maxCardH / svgH, 1.2);

    const cardClass = [
      'relative flex flex-col items-center gap-2 rounded-lg p-3 transition-all',
      isActive
        ? 'bg-accent-bg-strong border-2 border-accent/50 shadow-lg shadow-accent/10'
        : 'bg-surface-elevated border border-border hover:border-border-active hover:bg-surface-hover',
    ].join(' ');

    return (
      <button
        type="button"
        onClick={onClick}
        className={cardClass}
      >
        {/* Quantity badge */}
        {signType.quantity > 0 && (
          <span className="absolute top-2 right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[10px] font-bold">
            {signType.quantity}
          </span>
        )}

        {/* SVG Preview */}
        <div className="flex items-center justify-center" style={{ minHeight: maxCardH * 0.7 }}>
          <SignRenderer
            signType={signType}
            resolvedTokens={resolvedTokens}
            scale={scale}
            showDimensions={false}
          />
        </div>

        {/* Label */}
        <div className="flex flex-col items-center gap-0.5 w-full">
          <span className="text-[11px] font-semibold text-text-primary truncate max-w-full">
            {signType.typeName}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <span className="font-mono">{signType.typeCode}</span>
            <span>{'\u00B7'}</span>
            <span>{signType.size.w}{'\u2033'}{'\u00D7'}{signType.size.h}{'\u2033'}</span>
          </div>
        </div>
      </button>
    );
  }
);

PackageSignCard.displayName = 'PackageSignCard';
