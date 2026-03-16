// ---------------------------------------------------------------------------
// AI API Client — stubbed for now, will connect to real API later
// ---------------------------------------------------------------------------

export interface MockupRequest {
  signSpecs: {
    width: number;
    height: number;
    material: string;
    color: string;
    text: string;
  };
  style: 'wall_mounted' | 'hallway' | 'lobby';
}

export interface MockupResponse {
  imageUrl: string;
  prompt: string;
}

/**
 * Generate a placeholder SVG that resembles a mockup preview.
 */
function buildPlaceholderSvg(
  label: string,
  w: number,
  h: number,
  bgColor: string,
): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1f35"/>
      <stop offset="100%" stop-color="#0c0f1a"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect x="${w * 0.15}" y="${h * 0.2}" width="${w * 0.7}" height="${h * 0.5}" rx="8"
        fill="${bgColor}" opacity="0.85" stroke="#3B82F6" stroke-width="2"/>
  <text x="${w / 2}" y="${h * 0.48}" text-anchor="middle" font-size="18"
        font-family="system-ui" fill="#E2E8F0" font-weight="600">${label}</text>
  <text x="${w / 2}" y="${h * 0.56}" text-anchor="middle" font-size="11"
        font-family="system-ui" fill="#64748B">AI-generated preview placeholder</text>
  <text x="${w / 2}" y="${h * 0.88}" text-anchor="middle" font-size="10"
        font-family="system-ui" fill="#3B82F6">EGX Sign Designer</text>
</svg>`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Generate an AI mockup of the sign in context.
 * Currently stubbed — simulates a 2-second delay and returns a placeholder SVG.
 */
export async function generateMockup(
  request: MockupRequest,
): Promise<MockupResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const imageUrl = buildPlaceholderSvg(
    request.signSpecs.text || 'Sign Preview',
    640,
    480,
    request.signSpecs.color || '#2D2D2D',
  );

  return {
    imageUrl,
    prompt: `Generated ${request.style} mockup for ${request.signSpecs.width}"x${request.signSpecs.height}" ${request.signSpecs.material} sign`,
  };
}

/**
 * Composite a sign onto a user-uploaded space photo.
 * Currently stubbed — simulates a 3-second delay and returns a placeholder.
 */
export async function generateSpaceComposite(
  _photo: File,
  signSpecs: MockupRequest,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return buildPlaceholderSvg(
    signSpecs.signSpecs.text || 'Space Composite',
    800,
    600,
    signSpecs.signSpecs.color || '#2D2D2D',
  );
}
