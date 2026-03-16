import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, RoundedBox, Text, ContactShadows } from '@react-three/drei';
import type { DesignTokens } from '../../types/index.ts';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SignPreview3DProps {
  width: number;   // inches
  height: number;  // inches
  tokens: DesignTokens;
  text?: string;
  showWall?: boolean;
  showShadows?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components (rendered inside Canvas)
// ---------------------------------------------------------------------------

/** The main sign face panel. */
function SignFace({
  width,
  height,
  color,
  material,
  cornerRadius,
}: {
  width: number;
  height: number;
  color: string;
  material: string;
  cornerRadius: number;
}) {
  const depth = 0.25;
  // Clamp corner radius to half of shortest side
  const maxRadius = Math.min(width, height) / 2;
  const radius = Math.min(cornerRadius * 0.05, maxRadius * 0.4);

  const metalness = material === 'metal' ? 0.8 : material === 'acrylic' ? 0.3 : 0.05;
  const roughness = material === 'metal' ? 0.2 : material === 'acrylic' ? 0.15 : 0.7;

  return (
    <RoundedBox args={[width, height, depth]} radius={radius} smoothness={4}>
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </RoundedBox>
  );
}

/** Backer panel for two_piece / three_piece construction. */
function BackerPanel({
  width,
  height,
  color,
  cornerRadius,
}: {
  width: number;
  height: number;
  color: string;
  cornerRadius: number;
}) {
  const backerW = width + 0.6;
  const backerH = height + 0.6;
  const depth = 0.15;
  const maxRadius = Math.min(backerW, backerH) / 2;
  const radius = Math.min(cornerRadius * 0.05, maxRadius * 0.4);

  return (
    <group position={[0, 0, -0.25]}>
      <RoundedBox args={[backerW, backerH, depth]} radius={radius} smoothness={4}>
        <meshStandardMaterial color={color} metalness={0.05} roughness={0.8} />
      </RoundedBox>
    </group>
  );
}

/** Sign text on the face. */
function SignText({
  text,
  color,
  width,
  height,
}: {
  text: string;
  color: string;
  width: number;
  height: number;
}) {
  // Scale font to roughly fit the sign face
  const fontSize = Math.min(width * 0.12, height * 0.25, 1.8);

  return (
    <Text
      position={[0, 0, 0.14]}
      fontSize={fontSize}
      color={color}
      maxWidth={width * 0.85}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
      font={undefined}
    >
      {text}
    </Text>
  );
}

/** Wall background plane. */
function WallPlane() {
  return (
    <mesh position={[0, 0, -1.5]} receiveShadow>
      <planeGeometry args={[40, 30]} />
      <meshStandardMaterial color="#e8e4df" roughness={0.9} metalness={0} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const SignPreview3D: React.FC<SignPreview3DProps> = ({
  width,
  height,
  tokens,
  text = '',
  showWall = true,
  showShadows = true,
}) => {
  const isMultiPiece =
    tokens.constructionType === 'two_piece' ||
    tokens.constructionType === 'three_piece';

  // Scale so the sign fills the viewport nicely
  const maxDim = Math.max(width, height);
  const cameraDistance = useMemo(() => maxDim * 1.6 + 4, [maxDim]);

  return (
    <Canvas
      camera={{ position: [0, 0, cameraDistance], fov: 35 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#0C0F1A' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, -5]} intensity={0.3} />

      {/* Environment for reflections on metal materials */}
      <Environment preset="city" />

      {/* Wall */}
      {showWall && <WallPlane />}

      {/* Sign group */}
      <group>
        {/* Backer (behind face) */}
        {isMultiPiece && (
          <BackerPanel
            width={width}
            height={height}
            color={tokens.backerColor}
            cornerRadius={tokens.cornerRadius}
          />
        )}

        {/* Face panel */}
        <SignFace
          width={width}
          height={height}
          color={tokens.faceColor}
          material={tokens.faceMaterial}
          cornerRadius={tokens.cornerRadius}
        />

        {/* Text */}
        {text && (
          <SignText
            text={text}
            color={tokens.raisedTextColor}
            width={width}
            height={height}
          />
        )}
      </group>

      {/* Contact shadows */}
      {showShadows && (
        <ContactShadows
          position={[0, -(height / 2 + 1), 0]}
          opacity={0.35}
          scale={maxDim * 2}
          blur={2.5}
        />
      )}

      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={cameraDistance * 0.5}
        maxDistance={cameraDistance * 3}
      />
    </Canvas>
  );
};
