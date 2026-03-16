import React, { useEffect, useRef, useState, useMemo } from 'react';
import { loadTemplate, parseSvg, applyColorSlots, injectText } from '../../lib/template-loader';
import { getTemplateConfig } from '../../lib/template-manifest';
import { getTexture, generateTexturePattern } from '../../lib/texture-registry';
import type { SignTypeState, DesignTokens } from '../../types';

interface TemplateRendererProps {
  signType: SignTypeState;
  resolvedTokens: DesignTokens;
  familyId: string;
  scale?: number;
  className?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  signType,
  resolvedTokens,
  familyId,
  scale = 1,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = useMemo(
    () => getTemplateConfig(familyId, signType.id),
    [familyId, signType.id],
  );

  // Load SVG template
  useEffect(() => {
    if (!config) {
      setError('No template found');
      return;
    }

    let cancelled = false;
    loadTemplate(config.svgPath)
      .then(svg => {
        if (!cancelled) {
          setSvgMarkup(svg);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      });

    return () => { cancelled = true; };
  }, [config]);

  // Process and render SVG
  useEffect(() => {
    if (!svgMarkup || !config || !containerRef.current) return;

    try {
      const svg = parseSvg(svgMarkup);

      // Build token map from resolved tokens
      const tokenMap: Record<string, string> = {
        faceColor: resolvedTokens.faceColor,
        raisedTextColor: resolvedTokens.raisedTextColor,
        accentColor: resolvedTokens.accentColor,
        insertBgColor: resolvedTokens.insertBgColor,
        insertTextColor: resolvedTokens.insertTextColor,
      };

      // Apply color slots
      applyColorSlots(svg, config.colorSlots, tokenMap);

      // Apply texture if face material has a texture
      const faceMaterial = resolvedTokens.faceMaterial;
      const texture = getTexture(faceMaterial);
      if (texture && texture.imagePath) {
        const patternMarkup = generateTexturePattern(texture, 'face-texture', resolvedTokens.faceColor);
        if (patternMarkup) {
          let defs = svg.querySelector('defs');
          if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svg.insertBefore(defs, svg.firstChild);
          }
          // Parse and append pattern
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${patternMarkup}</svg>`;
          const patternEl = tempDiv.querySelector('pattern');
          if (patternEl) {
            defs.appendChild(svg.ownerDocument.importNode(patternEl, true));
            // Apply pattern to face-fill element
            const faceEl = svg.getElementById('face-fill');
            if (faceEl) {
              const shapes = faceEl.querySelectorAll('rect, path, circle, ellipse, polygon');
              shapes.forEach(shape => shape.setAttribute('fill', 'url(#face-texture)'));
              if (['rect', 'path', 'circle', 'ellipse', 'polygon'].includes(faceEl.tagName.toLowerCase())) {
                faceEl.setAttribute('fill', 'url(#face-texture)');
              }
            }
          }
        }
      }

      // Inject text into text slots
      for (const textSlot of config.textSlots) {
        const zone = signType.zones.find(z => z.zoneType === textSlot.zoneType);
        const content = zone?.content.text || textSlot.defaultContent || '';
        if (content) {
          injectText(svg, textSlot.elementId, content, {
            fontFamily: resolvedTokens.fontFamily,
            fill: resolvedTokens.raisedTextColor,
          });
        }
      }

      // Set viewBox and sizing
      const viewBox = config.viewBox || svg.getAttribute('viewBox') || '0 0 200 200';
      const parts = viewBox.split(' ').map(Number);
      const vbW = parts[2] ?? 200;
      const vbH = parts[3] ?? 200;
      svg.setAttribute('viewBox', viewBox);
      svg.setAttribute('width', String(vbW * scale));
      svg.setAttribute('height', String(vbH * scale));
      svg.removeAttribute('xmlns:xlink');

      // Render into container
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(svg);
    } catch (err) {
      setError(String(err));
    }
  }, [svgMarkup, config, resolvedTokens, signType, scale]);

  if (error) {
    return null; // Silently fail -- SignRenderer will use fallback
  }

  return <div ref={containerRef} className={className} />;
};

TemplateRenderer.displayName = 'TemplateRenderer';
