import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FAMILIES, type FamilyDef, type FamilyTier } from '../../lib/families-data';
import { usePackageStore } from '../../stores/package-store';
import { SignRenderer } from '../svg/SignRenderer';
import { getDefaultZones } from '../../lib/sign-type-defaults';
import type { SignTypeState, DesignTokens } from '../../types';

const TIER_STYLES: Record<FamilyTier, { label: string; bg: string; text: string; border: string }> = {
  good:    { label: 'Good',    bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  better:  { label: 'Better',  bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  best:    { label: 'Best',    bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'border-purple-500/30' },
  premium: { label: 'Premium', bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30' },
};

/**
 * Build a minimal SignTypeState for preview rendering (Room ID sign).
 */
function buildPreviewSign(_tokens: DesignTokens): SignTypeState {
  return {
    id: 'room_id',
    typeCode: 'H',
    typeName: 'Room ID',
    size: { w: 8, h: 8 },
    zones: getDefaultZones('H'),
    tokenOverrides: {},
    quantity: 1,
  };
}

export const FamilySelection: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = (familyId: string) => {
    usePackageStore.getState().loadFamily(familyId);
    navigate('/designer');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
      {/* Page title */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-text-primary tracking-wide">
          Choose Your Sign Family
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-lg">
          Each family defines the materials, colors, typography, and construction style
          for your entire sign package. You can customize everything after selecting.
        </p>
      </div>

      {/* Family cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full">
        {FAMILIES.map((family) => (
          <FamilyCard
            key={family.id}
            family={family}
            onSelect={() => handleSelect(family.id)}
          />
        ))}
      </div>

      {/* Try Configurator */}
      <div className="mt-8">
        <Link
          to="/configure"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg border border-accent/30 text-accent hover:bg-accent-bg transition-colors"
        >
          Try Configurator Mode
          <span className="text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded bg-accent-bg text-accent-light">
            New
          </span>
        </Link>
      </div>

      {/* Footer */}
      <p className="text-xs text-text-muted mt-10">
        Powered by EGX Group &mdash; Make Your Projects One Trade Lighter
      </p>
    </div>
  );
};

interface FamilyCardProps {
  family: FamilyDef;
  onSelect: () => void;
}

const FamilyCard: React.FC<FamilyCardProps> = ({ family, onSelect }) => {
  const tier = TIER_STYLES[family.tier];
  const previewSign = buildPreviewSign(family.defaultTokens);

  return (
    <div className="flex flex-col bg-surface-elevated border border-border rounded-lg overflow-hidden hover:border-border-active transition-colors group">
      {/* Preview area */}
      <div className="flex items-center justify-center py-6 px-4 bg-surface-hover/50">
        <SignRenderer
          signType={previewSign}
          resolvedTokens={family.defaultTokens}
          scale={0.9}
        />
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Tier badge */}
        <span
          className={`self-start px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${tier.bg} ${tier.text} ${tier.border}`}
        >
          {tier.label}
        </span>

        {/* Family name */}
        <h2 className="text-lg font-bold text-text-primary">{family.name}</h2>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed flex-1">
          {family.description}
        </p>

        {/* Select button */}
        <button
          onClick={onSelect}
          className="mt-2 w-full py-2 text-sm font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90 transition-opacity"
        >
          Select Family
        </button>
      </div>
    </div>
  );
};
