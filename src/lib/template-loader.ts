import type { TemplateSlot } from './template-manifest';

// Cache for loaded SVG strings
const svgCache = new Map<string, string>();
const pendingLoads = new Map<string, Promise<string>>();

/**
 * Load an SVG template file and return its markup string.
 * Results are cached for subsequent calls.
 */
export async function loadTemplate(svgPath: string): Promise<string> {
  const cached = svgCache.get(svgPath);
  if (cached) return cached;

  const pending = pendingLoads.get(svgPath);
  if (pending) return pending;

  const fullPath = `/templates/${svgPath}`;
  const promise = fetch(fullPath)
    .then(res => {
      if (!res.ok) throw new Error(`Template not found: ${fullPath}`);
      return res.text();
    })
    .then(svg => {
      svgCache.set(svgPath, svg);
      pendingLoads.delete(svgPath);
      return svg;
    })
    .catch(err => {
      pendingLoads.delete(svgPath);
      throw err;
    });

  pendingLoads.set(svgPath, promise);
  return promise;
}

/**
 * Parse an SVG string into a DOM element for manipulation.
 */
export function parseSvg(svgString: string): SVGSVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) throw new Error('Invalid SVG template');
  return svg;
}

/**
 * Apply fill color to an element and its children that have fills.
 */
function applyFillRecursive(el: Element, color: string): void {
  const tagName = el.tagName.toLowerCase();
  const shapeElements = ['rect', 'circle', 'ellipse', 'path', 'polygon', 'polyline'];

  if (shapeElements.includes(tagName)) {
    const currentFill = el.getAttribute('fill');
    // Don't override 'none' fills (transparent areas are intentional)
    if (currentFill !== 'none') {
      el.setAttribute('fill', color);
    }
  }

  // Also apply via style if it has inline fill style
  const style = el.getAttribute('style');
  if (style && style.includes('fill:')) {
    el.setAttribute('style', style.replace(/fill:\s*[^;]+/, `fill: ${color}`));
  }

  // Recurse into children
  for (const child of Array.from(el.children)) {
    applyFillRecursive(child, color);
  }
}

/**
 * Create an SVG pattern element for a texture and apply it to the target element.
 */
function applyTexturePattern(
  svg: SVGSVGElement,
  el: Element,
  slotId: string,
  textureUrl: string,
  tintColor: string,
): void {
  const patternId = `texture-${slotId}`;

  // Remove existing pattern if any
  const existing = svg.getElementById(patternId);
  if (existing) existing.remove();

  // Create defs if not present
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }

  // Create pattern
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  pattern.setAttribute('id', patternId);
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  pattern.setAttribute('width', '200');
  pattern.setAttribute('height', '200');

  // Background rect with tint color
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '200');
  bg.setAttribute('height', '200');
  bg.setAttribute('fill', tintColor);
  pattern.appendChild(bg);

  // Texture image overlay
  const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  img.setAttribute('href', textureUrl);
  img.setAttribute('width', '200');
  img.setAttribute('height', '200');
  img.setAttribute('opacity', '0.3');
  img.setAttribute('preserveAspectRatio', 'none');
  pattern.appendChild(img);

  defs.appendChild(pattern);

  // Apply pattern fill to element
  applyFillRecursive(el, `url(#${patternId})`);
}

/**
 * Apply color token values to named slots in an SVG element.
 */
export function applyColorSlots(
  svg: SVGSVGElement,
  slots: TemplateSlot[],
  tokens: Record<string, string>,
  textures?: Map<string, string>,
): void {
  for (const slot of slots) {
    const el = svg.getElementById(slot.elementId);
    if (!el) continue;

    const value = tokens[slot.tokenKey];
    if (!value) continue;

    if (slot.type === 'fill') {
      applyFillRecursive(el, value);
    } else if (slot.type === 'stroke') {
      el.setAttribute('stroke', value);
    } else if (slot.type === 'pattern' && textures?.has(slot.tokenKey)) {
      const patternUrl = textures.get(slot.tokenKey)!;
      applyTexturePattern(svg, el, slot.elementId, patternUrl, value);
    }
  }
}

/**
 * Inject text content into a text slot.
 */
export function injectText(
  svg: SVGSVGElement,
  slotId: string,
  content: string,
  options: {
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    textAnchor?: 'start' | 'middle' | 'end';
    letterSpacing?: string;
  } = {},
): void {
  const container = svg.getElementById(slotId);
  if (!container) return;

  // Find existing text elements and update their content
  const textEls = container.querySelectorAll('text');
  if (textEls.length > 0) {
    textEls[0].textContent = content;
    if (options.fontSize) textEls[0].setAttribute('font-size', String(options.fontSize));
    if (options.fontFamily) textEls[0].setAttribute('font-family', options.fontFamily);
    if (options.fill) textEls[0].setAttribute('fill', options.fill);
    if (options.textAnchor) textEls[0].setAttribute('text-anchor', options.textAnchor);
    if (options.letterSpacing) textEls[0].setAttribute('letter-spacing', options.letterSpacing);
    return;
  }

  // No text element found -- create one
  const bbox = (container as SVGGraphicsElement).getBBox?.();
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.textContent = content;
  text.setAttribute('x', String(bbox ? bbox.x + bbox.width / 2 : 0));
  text.setAttribute('y', String(bbox ? bbox.y + bbox.height / 2 : 0));
  text.setAttribute('text-anchor', options.textAnchor ?? 'middle');
  text.setAttribute('dominant-baseline', 'central');
  if (options.fontSize) text.setAttribute('font-size', String(options.fontSize));
  if (options.fontFamily) text.setAttribute('font-family', options.fontFamily);
  if (options.fill) text.setAttribute('fill', options.fill);
  if (options.letterSpacing) text.setAttribute('letter-spacing', options.letterSpacing);
  container.appendChild(text);
}

/**
 * Inject a pictogram SVG into a pictogram slot.
 */
export function injectPictogram(
  svg: SVGSVGElement,
  slotId: string,
  pictogramSvg: string,
  options: {
    width: number;
    height: number;
    fill?: string;
  },
): void {
  const container = svg.getElementById(slotId);
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  // Parse the pictogram SVG
  const parser = new DOMParser();
  const picDoc = parser.parseFromString(pictogramSvg, 'image/svg+xml');
  const picSvg = picDoc.querySelector('svg');
  if (!picSvg) return;

  // Create a group with the pictogram content, scaled to fit
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Get container bounds
  const bbox = (container as SVGGraphicsElement).getBBox?.();
  if (bbox) {
    const scaleX = bbox.width / options.width;
    const scaleY = bbox.height / options.height;
    const scale = Math.min(scaleX, scaleY) * 0.85;
    const offsetX = bbox.x + (bbox.width - options.width * scale) / 2;
    const offsetY = bbox.y + (bbox.height - options.height * scale) / 2;
    g.setAttribute('transform', `translate(${offsetX}, ${offsetY}) scale(${scale})`);
  }

  // Copy pictogram elements into the group
  for (const child of Array.from(picSvg.children)) {
    const clone = child.cloneNode(true) as Element;
    if (options.fill) {
      applyFillRecursive(clone, options.fill);
    }
    g.appendChild(clone);
  }

  container.appendChild(g);
}

/**
 * Preload multiple templates for a family.
 */
export async function preloadFamily(svgPaths: string[]): Promise<void> {
  await Promise.all(svgPaths.map(p => loadTemplate(p).catch(() => null)));
}

/**
 * Clear cache (useful for dev/hot reload).
 */
export function clearTemplateCache(): void {
  svgCache.clear();
}
