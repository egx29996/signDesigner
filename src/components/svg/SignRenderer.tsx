import React from 'react';
import type { SignTypeState, DesignTokens } from '../../types';
import { calculateLayout, type ZoneLayout } from '../../lib/layout-engine';
import { FONT_OPTIONS, MATERIALS } from '../../lib/constants';
import { MaterialPatternDefs } from './textures/MaterialPatternDefs';
import { BackerZone } from './zones/BackerZone';
import { HeaderZone } from './zones/HeaderZone';
import { PrimaryTextZone } from './zones/PrimaryTextZone';
import { BrailleZone } from './zones/BrailleZone';
import { DividerZone } from './zones/DividerZone';
import { InsertZone } from './zones/InsertZone';
import { PictogramZone } from './zones/PictogramZone';
import { DirectionalZone } from './zones/DirectionalZone';
import { ListingZone } from './zones/ListingZone';
import { AvailabilityZone } from './zones/AvailabilityZone';
import { CodeInfoZone } from './zones/CodeInfoZone';
import { TemplateRenderer } from './TemplateRenderer';
import { getTemplateConfig } from '../../lib/template-manifest';
import { usePackageStore } from '../../stores/package-store';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PX_PER_INCH = 25;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SignRendererProps {
  signType: SignTypeState;
  resolvedTokens: DesignTokens;
  familyId?: string;
  scale?: number;
  showDimensions?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFontCss(fontFamilyId: string): string {
  const font = FONT_OPTIONS.find((f) => f.id === fontFamilyId);
  return font?.css ?? "'DM Sans', sans-serif";
}

function getMaterialFill(materialId: string, solidColor: string): string {
  if (materialId === 'solid') return solidColor;
  const mat = MATERIALS.find((m) => m.id === materialId);
  if (!mat || mat.type === 'solid') return solidColor;
  return `url(#mat-${materialId})`;
}

// ---------------------------------------------------------------------------
// Zone renderer — dispatches to the correct zone component
// ---------------------------------------------------------------------------

function renderZone(
  layout: ZoneLayout,
  signType: SignTypeState,
  tokens: DesignTokens,
  fontCss: string,
): React.ReactNode {
  const { x, y, width, height, zoneType, zoneId } = layout;
  const zone = signType.zones.find((z) => z.id === zoneId);
  if (!zone) return null;

  const { content } = zone;

  switch (zoneType) {
    case 'header':
      return (
        <HeaderZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          accentColor={tokens.accentColor}
          cornerRadius={tokens.cornerRadius}
        />
      );

    case 'primary_text':
    case 'secondary_text':
      return (
        <PrimaryTextZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          text={content.text ?? ''}
          textColor={tokens.raisedTextColor}
          fontCss={fontCss}
        />
      );

    case 'braille':
      return (
        <BrailleZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          text={content.text ?? ''}
          dotColor={tokens.raisedTextColor}
        />
      );

    case 'divider':
      return (
        <DividerZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          style={tokens.dividerStyle}
          color={tokens.accentColor}
        />
      );

    case 'insert':
      return (
        <InsertZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          bgColor={tokens.insertBgColor}
          textColor={tokens.insertTextColor}
          text={content.text ?? ''}
          fontCss={fontCss}
        />
      );

    case 'pictogram':
      return (
        <PictogramZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          icon={content.icon ?? 'restroom_unisex'}
          color={tokens.raisedTextColor}
          family={tokens.pictogramFamily}
        />
      );

    case 'directional':
      return (
        <DirectionalZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          rows={content.rows ?? []}
          textColor={tokens.raisedTextColor}
          fontCss={fontCss}
        />
      );

    case 'listing':
      return (
        <ListingZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          rows={content.rows ?? []}
          textColor={tokens.raisedTextColor}
          fontCss={fontCss}
        />
      );

    case 'availability':
      return (
        <AvailabilityZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          state={content.state ?? 'available'}
          fontCss={fontCss}
        />
      );

    case 'code_info':
      return (
        <CodeInfoZone
          key={zoneId}
          x={x}
          y={y}
          width={width}
          height={height}
          text={content.text ?? ''}
          textColor={tokens.raisedTextColor}
          fontCss={fontCss}
        />
      );

    case 'backer':
      // Backer is rendered separately — skip in zone loop
      return null;

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// SignRenderer
// ---------------------------------------------------------------------------

export const SignRenderer: React.FC<SignRendererProps> = React.memo(
  ({ signType, resolvedTokens, familyId: familyIdProp, scale = 1, showDimensions = false }) => {
    // Resolve familyId from prop or store
    const storeFamilyId = usePackageStore((s) => s.familyId);
    const familyId = familyIdProp ?? storeFamilyId;

    // Template-first rendering: if an SVG template exists, use it
    const templateConfig = getTemplateConfig(familyId, signType.id);
    if (templateConfig) {
      return (
        <TemplateRenderer
          signType={signType}
          resolvedTokens={resolvedTokens}
          familyId={familyId}
          scale={scale}
        />
      );
    }

    // Fallback: programmatic SVG rendering
    const { w, h } = signType.size;
    const totalW = w * PX_PER_INCH;
    const totalH = h * PX_PER_INCH;

    const fontCss = getFontCss(resolvedTokens.fontFamily);
    const faceFill = getMaterialFill(resolvedTokens.faceMaterial, resolvedTokens.faceColor);

    // Run layout engine
    const layouts = calculateLayout(w, h, signType.zones, PX_PER_INCH);

    // Dimension label height (space above the sign)
    const dimLabelH = showDimensions ? 24 : 0;

    // SVG viewBox with room for dimension labels + shadow bleed
    const viewW = totalW + 20;
    const viewH = totalH + dimLabelH + 20;

    return (
      <svg
        width={viewW * scale}
        height={viewH * scale}
        viewBox={`-10 ${-dimLabelH - 10} ${viewW} ${viewH}`}
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <MaterialPatternDefs />

        {/* Dimension label */}
        {showDimensions && (
          <text
            x={totalW / 2}
            y={-dimLabelH + 14}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={11}
            fontFamily="system-ui, sans-serif"
          >
            {w}&Prime; &times; {h}&Prime;
          </text>
        )}

        {/* Backer panel (behind main face) */}
        {resolvedTokens.constructionType !== 'single_piece' && (
          <BackerZone
            width={totalW}
            height={totalH}
            cornerRadius={resolvedTokens.cornerRadius}
            constructionType={resolvedTokens.constructionType}
          />
        )}

        {/* Main sign body */}
        <rect
          x={0}
          y={0}
          width={totalW}
          height={totalH}
          rx={resolvedTokens.cornerRadius}
          ry={resolvedTokens.cornerRadius}
          fill={faceFill}
          filter="url(#sign-shadow)"
        />

        {/* Render each zone */}
        {layouts.map((layout) =>
          renderZone(layout, signType, resolvedTokens, fontCss)
        )}
      </svg>
    );
  }
);

SignRenderer.displayName = 'SignRenderer';
