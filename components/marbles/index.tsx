"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { useControls } from "leva";

interface TubeProps {
  position: THREE.Vector3 | [number, number, number];
  radius?: number;
  thickness?: number;
  amount?: number;
}

interface GridProps {
  sideLength?: number;
  spacing?: number;
}

interface MovingLightProps {
  index: number;
}

const Tube: React.FC<TubeProps> = ({ position, radius = 6, thickness = 2, amount = 15 }) => {
  const materialProps = useControls("Tube Material", {
    roughness: { value: 1.0, min: 0, max: 1 },
    metalness: { value: 0.0, min: 0, max: 1 },
    emissive: "#000000",
    color: "#333333",
    flatShading: true,
  });

  const tubeProps = useControls("Tube Geometry", {
    radius: { value: radius, min: 1, max: 20 },
    thickness: { value: thickness, min: 0.5, max: 5 },
    amount: { value: amount, min: 1, max: 30 },
    height: { value: 15, min: 1, max: 50, label: "Height" },
    bevelThickness: { value: 0.3, min: 0, max: 1 },
    bevelSize: { value: 0.2, min: 0, max: 1 },
  });

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, tubeProps.radius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, tubeProps.radius - tubeProps.thickness, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: tubeProps.height,
      bevelEnabled: true,
      bevelThickness: tubeProps.bevelThickness,
      bevelSize: tubeProps.bevelSize,
      bevelSegments: 1,
    });
    geo.center();
    return geo;
  }, [tubeProps]);

  return (
    <mesh geometry={geometry} position={position} castShadow receiveShadow>
      <meshStandardMaterial
        color={materialProps.color}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        emissive={materialProps.emissive}
        flatShading={materialProps.flatShading}
      />
    </mesh>
  );
};

const Grid: React.FC<GridProps> = ({ sideLength = 10, spacing = 12.6 }) => {
  const gridProps = useControls("Grid", {
    sideLength: { value: sideLength, min: 1, max: 20, step: 1 },
    spacing: { value: spacing, min: 5, max: 30 },
  });

  return (
    <group>
      {Array.from({ length: gridProps.sideLength }, (_, i) =>
        Array.from({ length: gridProps.sideLength }, (_, j) => (
          <Tube
            key={`${i}-${j}`}
            position={[
              (i - gridProps.sideLength / 2) * gridProps.spacing,
              0,
              (j - gridProps.sideLength / 2) * gridProps.spacing,
            ]}
          />
        ))
      )}
    </group>
  );
};

const MovingLight: React.FC<MovingLightProps> = ({ index }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const spacing = 12.6;
  const gridSize = 10;
  const halfGrid = ((gridSize - 1) * spacing) / 2;

  const randomX = THREE.MathUtils.randFloat(-halfGrid, halfGrid);
  const randomZ = THREE.MathUtils.randFloat(-halfGrid, halfGrid);

  const lightProps = useControls(`Moving Light ${index + 1}`, {
    color: "#f82c91",
    intensity: { value: 300, min: 0, max: 500 },
    distance: { value: 35, min: 0, max: 100 },
    decay: { value: 2.5, min: 0, max: 5 },
    height: { value: 18, min: -20, max: 50 },
  });

  useEffect(() => {
    if (!groupRef.current || !lightRef.current) return;

    gsap.to(groupRef.current.position, {
      y: lightProps.height,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: index * 0.3,
    });

    gsap.to(lightRef.current, {
      intensity: lightProps.intensity * 4,
      distance: lightProps.distance * 2,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.3,
    });
  }, [index, lightProps]);

  return (
    <group ref={groupRef} position={[randomX, -5, randomZ]}>
      <pointLight
        ref={lightRef}
        color={lightProps.color}
        intensity={lightProps.intensity}
        distance={lightProps.distance}
        decay={lightProps.decay}
        castShadow
      />
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={lightProps.color} />
      </mesh>
    </group>
  );
};

const Scene: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const outerLightProps = useControls("Outer Light", {
    enabled: true,
    color: "#ffffff",
    intensity: { value: 2, min: 0, max: 4 },
    positionX: { value: 100, min: -200, max: 200 },
    positionY: { value: 100, min: -200, max: 200 },
    positionZ: { value: 100, min: -200, max: 200 },
  });

  const cameraProps = useControls("Camera", {
    position: {
      value: { x: 75, y: 85, z: 200 },
      step: 10,
    },
    fov: { value: 13, min: 1, max: 50 }, // Increased FOV
  });

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [cameraProps.position]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[cameraProps.position.x, cameraProps.position.y, cameraProps.position.z]}
        fov={cameraProps.fov}
        near={1}
        far={1000}
      />
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.03} />
      <spotLight
        position={[0, 50, 0]}
        intensity={0.4}
        distance={100}
        angle={Math.PI}
        penumbra={2.0}
        decay={1.0}
        castShadow
      />

      {outerLightProps.enabled && (
        <directionalLight
          color={outerLightProps.color}
          intensity={outerLightProps.intensity}
          position={[outerLightProps.positionX, outerLightProps.positionY, outerLightProps.positionZ]}
          castShadow
        />
      )}

      {[0, 1, 2].map((index) => (
        <MovingLight key={index} index={index} />
      ))}
      <Grid />
    </>
  );
};

const TubesAnimation: React.FC = () => {
  return (
    <div className="w-full h-screen relative">
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.8) 100%)",
          mixBlendMode: "multiply",
        }}
      />
      <Canvas
        shadows
        gl={{
          antialias: true,
          logarithmicDepthBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default TubesAnimation;
