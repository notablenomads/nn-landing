import React, { useRef, useState, useMemo, useCallback, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SimplePopup from "@/components/simplePopup";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "..";
import { Toaster } from "sonner";
import WizardContent from "./wizardContent";
import wizardSteps from "./steps";

interface MatrixCharactersProps {
  isHovered: boolean;
}

interface SceneProps {
  isHovered: boolean;
}

interface CharacterProps {
  position: [number, number, number];
  material: THREE.MeshPhongMaterial;
  initialChar: string;
  characters: string;
  onRef: (el: ExtendedObject3D | null) => void;
}

interface ExtendedObject3D extends THREE.Object3D {
  material?: THREE.MeshPhongMaterial;
  text?: string;
}

interface WizardStepData {
  [key: string]: unknown;
}

type CharacterRefArray = (ExtendedObject3D | null)[];

// Utility functions
const generateCharacter = (characters: string): string =>
  characters[Math.floor(Math.random() * characters.length)];

const precomputeColors = () => ({
  baseColor: new THREE.Color(0.5, 0.5, 0.5),
  targetColor: new THREE.Color().setHSL(36 / 360, 0.91, 0.55),
  workingColor: new THREE.Color(),
});

const Character = memo<CharacterProps>(
  ({ position, material, initialChar, characters, onRef }) => (
    <Text
      ref={onRef}
      position={position}
      fontSize={0.2}
      font="/fonts/RevolutionGothic_Regular.otf"
      anchorX="center"
      anchorY="middle"
      characters={characters}
      material={material.clone()}
    >
      {initialChar}
    </Text>
  )
);

Character.displayName = "Character";

const MatrixCharacters = memo<MatrixCharactersProps>(({ isHovered }) => {
  const { viewport } = useThree();
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
      initialChars[i] = generateCharacter(characters);
    }

    return { positions, initialChars, cellSize, rows, cols };
  }, [viewport.width, viewport.height, characters]);

  const sharedMaterial = useMemo(() => {
    const { targetColor } = precomputeColors();
    return new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.6,
      emissive: targetColor.clone(),
      emissiveIntensity: 0,
      shininess: 0,
    });
  }, []);

  const characterRefs = useRef<CharacterRefArray>([]);
  const waveRef = useRef<number>(0);
  const charStates = useRef<string[]>(initialChars);
  const { baseColor, targetColor, workingColor } = useMemo(
    precomputeColors,
    []
  );

  useFrame((_, delta: number) => {
    waveRef.current = isHovered
      ? Math.min(waveRef.current + delta * 0.5, 1)
      : Math.max(waveRef.current - delta * 0.5, 0);

    const wave = waveRef.current;
    const viewportHeight = viewport.height;

    characterRefs.current.forEach((char, i) => {
      if (!char?.material) return;

      const y = positions[i][1];
      const normalizedY = (y + viewportHeight / 2) / viewportHeight + 0.25;
      const intensity = Math.max(0, 1 - Math.abs(normalizedY - wave) * 1.5);

      const material = char.material;

      workingColor.copy(baseColor).lerp(targetColor, intensity);
      material.color.copy(workingColor);
      material.opacity = 0.6 + intensity * 0.4;
      material.emissiveIntensity = intensity * 2.5;
      material.emissive.copy(workingColor);

      if (intensity > 0.2 && Math.random() < 0.03) {
        const newChar = generateCharacter(characters);
        charStates.current[i] = newChar;
        char.text = newChar;
      }
    });
  });

  const setCharacterRef = useCallback(
    (el: ExtendedObject3D | null, index: number) => {
      if (characterRefs.current) {
        characterRefs.current[index] = el;
      }
    },
    []
  );

  return (
    <group>
      {positions.map((position, i) => (
        <Character
          key={i}
          position={position}
          material={sharedMaterial}
          initialChar={charStates.current[i]}
          characters={characters}
          onRef={(el) => setCharacterRef(el, i)}
        />
      ))}
    </group>
  );
});

MatrixCharacters.displayName = "MatrixCharacters";

const Scene = memo<SceneProps>(({ isHovered }) => (
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

interface FeatureItemProps {
  text: string;
  isHovered: boolean;
}

const FeatureItem = memo<FeatureItemProps>(({ text, isHovered }) => (
  <li
    className={`flex items-center gap-2 transition-all duration-300 text-lg ${
      isHovered
        ? "text-white [text-shadow:_0_0_12px_rgba(255,255,255,0.3),_0_0_6px_rgba(255,255,255,0.2)]"
        : "text-white/60"
    }`}
  >
    <div
      className={`w-1 h-1 rounded-full transition-all duration-300 ${
        isHovered
          ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          : "bg-white/60"
      }`}
    />
    {text}
  </li>
));

FeatureItem.displayName = "FeatureItem";

const featureItems: readonly string[] = [
  "Free Consultation",
  "Custom Project Roadmap",
  "Technical Guidance",
  "Budget Planning",
] as const;

export default function Wizard() {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleComplete = useCallback((data: WizardStepData): void => {
    console.log("Wizard completed with data:", data);
  }, []);

  const handleMouseEnter = useCallback((): void => setIsHovered(true), []);
  const handleMouseLeave = useCallback((): void => setIsHovered(false), []);
  const handleOpen = useCallback((): void => setIsOpen(true), []);
  const handleClose = useCallback((): void => setIsOpen(false), []);

  return (
    <section
      className="relative min-h-400 h-[55dvh] bg-black overflow-hidden"
      id="quote"
    >
      <div className="absolute inset-0">
        <Canvas
          dpr={Math.min(1.5, window.devicePixelRatio)}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance" as const,
            depth: false,
            stencil: false,
            precision: "lowp" as const,
          }}
          performance={{ min: 0.5 }}
        >
          <Scene isHovered={isHovered} />
        </Canvas>
      </div>

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

      <div className="absolute inset-0 flex justify-center items-center text-center">
        <div className="relative container mx-auto px-4 flex flex-col justify-center z-20 h-full">
          <div className="text-white">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-300 ${
                isHovered
                  ? "[text-shadow:_0_0_20px_rgba(255,255,255,0.5),_0_0_10px_rgba(255,255,255,0.3)]"
                  : ""
              }`}
            >
              Ready to Build Your Next Project?
            </h2>
            <p
              className={`text-lg mb-6 max-w-2xl mx-auto transition-all duration-300 ${
                isHovered
                  ? "text-white [text-shadow:_0_0_15px_rgba(255,255,255,0.4),_0_0_8px_rgba(255,255,255,0.2)]"
                  : "text-white/70"
              }`}
            >
              Get a free consultation and project roadmap tailored to your
              needs. Our wizard will guide you through the process in just a few
              minutes.
            </p>
            <ul className="grid grid-cols-2 gap-4 mb-8 text-sm place-items-center max-w-2xl mx-auto">
              {featureItems.map((text) => (
                <FeatureItem key={text} text={text} isHovered={isHovered} />
              ))}
            </ul>
            <Button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              size="lg"
              onClick={handleOpen}
              className="bg-white text-gray-900 hover:bg-white/90 font-semibold relative z-30"
            >
              Request A Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <SimplePopup isOpen={isOpen} onClose={handleClose}>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <WizardContent
                steps={wizardSteps}
                onComplete={handleComplete}
                onStepChange={(step: number) =>
                  console.log("Current step:", step)
                }
              />
            </QueryClientProvider>
          </SimplePopup>
        </div>
      </div>
    </section>
  );
}
