import React, { useRef, useMemo, useCallback, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

interface MatrixBackgroundProps {
  isHovered?: boolean;
  className?: string;
}

const MatrixCharacters = memo<{ isHovered: boolean }>(({ isHovered }) => {
  const { viewport } = useThree();
  const initAnimationRef = useRef(0);
  const isInitializedRef = useRef(false);
  const characters = useMemo(
    () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()",
    []
  );

  const { positions, initialChars } = useMemo(() => {
    const cellSize = 0.35;
    const cols = Math.ceil(viewport.width / cellSize);
    const rows = Math.ceil(viewport.height / cellSize);
    const positions: [number, number, number][] = [];
    const initialChars: string[] = [];
    const totalCells = cols * rows;

    positions.length = totalCells;
    initialChars.length = totalCells;

    for (let i = 0; i < totalCells; i++) {
      const x = i % cols;
      const y = Math.floor(i / cols);
      positions[i] = [
        x * cellSize - viewport.width / 2,
        y * cellSize - viewport.height / 2,
        0,
      ];
      initialChars[i] =
        characters[Math.floor(Math.random() * characters.length)];
    }

    return { positions, initialChars };
  }, [viewport.width, viewport.height, characters]);

  const sharedMaterial = useMemo(() => {
    const targetColor = new THREE.Color().setHSL(36 / 360, 0.91, 0.55);
    return new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0,
      emissive: targetColor.clone(),
      emissiveIntensity: 0,
      shininess: 0,
    });
  }, []);

  const characterRefs = useRef<
    (THREE.Object3D & { material?: THREE.MeshPhongMaterial; text?: string })[]
  >([]);
  const waveRef = useRef<number>(0);
  const charStates = useRef<string[]>(initialChars);
  const baseColor = useMemo(() => new THREE.Color(0.5, 0.5, 0.5), []);
  const targetColor = useMemo(
    () => new THREE.Color().setHSL(36 / 360, 0.91, 0.55),
    []
  );
  const workingColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta: number) => {
    // Safety check for component mount/unmount and resize scenarios
    if (
      !characterRefs.current ||
      characterRefs.current.length !== positions.length
    ) {
      return;
    }

    // Slower, smoother initialization
    initAnimationRef.current = Math.min(
      initAnimationRef.current + delta * 0.4,
      1
    );

    // Only start wave effect after initialization is complete
    if (initAnimationRef.current === 1) {
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
      }
      waveRef.current = isHovered
        ? Math.min(waveRef.current + delta * 0.5, 1)
        : Math.max(waveRef.current - delta * 0.5, 0);
    }

    const initProgress = initAnimationRef.current;
    const wave = waveRef.current;
    const viewportHeight = viewport.height;

    characterRefs.current.forEach((char, i) => {
      // Safety checks for undefined/null values
      if (!char?.material || !positions[i]) return;

      const y = positions[i][1];
      const normalizedY = (y + viewportHeight / 2) / viewportHeight;

      // Smoother initialization wave
      const initWave = (normalizedY + 0.2) / 1.2; // Adjust wave range
      const initOpacity = Math.max(
        0,
        Math.min(1, (initProgress - initWave) * 3)
      );

      // Regular wave effect
      const wavePosition = (normalizedY + wave * 0.5) % 1;
      const waveIntensity = isInitializedRef.current
        ? Math.max(0, 1 - Math.abs(wavePosition - 0.5) * 2)
        : 0;

      const finalIntensity = Math.max(initOpacity, waveIntensity);

      const material = char.material;

      // Smooth color and opacity transitions
      workingColor.copy(baseColor).lerp(targetColor, finalIntensity);
      material.color.lerp(workingColor, 0.1);
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        0.6 * finalIntensity,
        0.1
      );
      material.emissiveIntensity = THREE.MathUtils.lerp(
        material.emissiveIntensity,
        finalIntensity * 2.5,
        0.1
      );
      material.emissive.lerp(workingColor, 0.1);

      // Smoother character changes - add safety check for characters array
      if (
        finalIntensity > 0.2 &&
        Math.random() < 0.02 &&
        characters.length > 0
      ) {
        const newChar =
          characters[Math.floor(Math.random() * characters.length)];
        charStates.current[i] = newChar;
        char.text = newChar;
      }
    });
  });

  const setCharacterRef = useCallback(
    (
      el:
        | (THREE.Object3D & {
            material?: THREE.MeshPhongMaterial;
            text?: string;
          })
        | null,
      index: number
    ) => {
      if (characterRefs.current && el) {
        characterRefs.current[index] = el;
      }
    },
    []
  );

  return (
    <group>
      {positions.map((position, i) => (
        <Text
          key={i}
          ref={(el) => setCharacterRef(el, i)}
          position={position}
          fontSize={0.2}
          font="/fonts/RevolutionGothic_Regular.otf"
          anchorX="center"
          anchorY="middle"
          characters={characters}
          material={sharedMaterial.clone()}
        >
          {charStates.current[i]}
        </Text>
      ))}
    </group>
  );
});

MatrixCharacters.displayName = "MatrixCharacters";

const Scene = memo<{ isHovered: boolean }>(({ isHovered }) => (
  <React.Suspense fallback={null}>
    <ambientLight intensity={0.5} />
    <MatrixCharacters isHovered={isHovered} />
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={1.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  </React.Suspense>
));

Scene.displayName = "Scene";

const MatrixBackground = memo<MatrixBackgroundProps>(
  ({ isHovered = false, className = "" }) => {
    return (
      <div className={`relative ${className} overflow-hidden`}>
        <Canvas
          dpr={Math.min(1.5, window.devicePixelRatio)}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            depth: false,
            stencil: false,
            precision: "lowp",
          }}
          performance={{ min: 0.5 }}
        >
          <Scene isHovered={isHovered} />
        </Canvas>
        <div
          className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>
    );
  }
);

MatrixBackground.displayName = "MatrixBackground";

export default MatrixBackground;
