/**
 * SVG Serializer — converts SVG DOM elements to PNG data URLs
 * for embedding in jsPDF documents.
 */

/**
 * Serialize an SVG element to a PNG data URL at the given scale.
 * Uses the SVG → Canvas → toDataURL pipeline.
 */
export async function svgToPng(
  svgElement: SVGSVGElement,
  scale: number = 2,
): Promise<string> {
  // Clone the SVG so we don't mutate the original
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Ensure the SVG has explicit dimensions
  const width = svgElement.width.baseVal.value || svgElement.viewBox.baseVal.width;
  const height = svgElement.height.baseVal.value || svgElement.viewBox.baseVal.height;

  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  // Inline all computed styles
  inlineStyles(svgElement, clone);

  // Serialize to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    return await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to render SVG to canvas'));
      };
      img.src = url;
    });
  } finally {
    // cleanup handled in callbacks above
  }
}

/**
 * Copy computed styles from original elements to cloned elements.
 * This ensures patterns, fonts, and colors render correctly when
 * the SVG is rendered outside the DOM context.
 */
function inlineStyles(original: Element, clone: Element): void {
  const computed = window.getComputedStyle(original);
  const important = [
    'font-family', 'font-size', 'font-weight', 'font-style',
    'fill', 'stroke', 'stroke-width', 'opacity',
    'text-anchor', 'dominant-baseline', 'letter-spacing',
  ];

  for (const prop of important) {
    const value = computed.getPropertyValue(prop);
    if (value) {
      (clone as SVGElement).style.setProperty(prop, value);
    }
  }

  const origChildren = original.children;
  const cloneChildren = clone.children;
  for (let i = 0; i < origChildren.length && i < cloneChildren.length; i++) {
    inlineStyles(origChildren[i], cloneChildren[i]);
  }
}

/**
 * Render an off-screen SVG to PNG. Creates a temporary SVG element,
 * renders it, and returns the data URL. Used when we need to render
 * a sign that isn't currently in the DOM.
 */
export async function renderOffscreenSvgToPng(
  svgMarkup: string,
  width: number,
  height: number,
  scale: number = 2,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to render offscreen SVG'));
    };
    img.src = url;
  });
}
