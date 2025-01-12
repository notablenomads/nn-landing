import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { Leva, useControls } from "leva";
// import { Leva } from "leva";
import {
  EffectComposer,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import useStore from "../../store";

import BackTechBackground from "@/components/landing/jumbo/tech/backTech";

import PezDuckModel from "../models/PezDucky";

interface TechStackTowerProps {
  withEffects?: boolean;
}

const Floor = () => {
  const { floorColor, floorSize, position, roughness, metalness } = useControls(
    "Floor",
    {
      floorColor: { value: "#e0e0e0" },
      floorSize: { value: 10, min: 5, max: 50, step: 1 },
      floorHeight: { value: -0.1, min: -2, max: 0, step: 0.01 },
      roughness: { value: 0.45, min: 0, max: 1, step: 0.01 },
      metalness: { value: 0.1, min: 0, max: 1, step: 0.01 },
      position: {
        value: { x: 0, y: -0.1, z: 0 },
        step: 0.1,
        joystick: "invertY",
      },
    }
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[position.x, position.y, position.z]}
      receiveShadow
    >
      <planeGeometry args={[floorSize, floorSize]} />
      <meshStandardMaterial
        color={floorColor}
        roughness={roughness}
        metalness={metalness}
        transparent
        opacity={0.8}
      />
      <shadowMaterial transparent opacity={0.2} color="black" />
    </mesh>
  );
};

const SunLight = () => {
  const { sunPosition, sunColor, sunIntensity } = useControls("Sun", {
    sunPosition: {
      value: { x: 20, y: 15, z: 5 },
      step: 1,
    },
    sunColor: { value: "#ffffff" },
    sunIntensity: { value: 1.5, min: 0, max: 5, step: 0.1 },
  });

  // Remove the mesh completely and only keep the light
  return (
    <pointLight
      position={[sunPosition.x, sunPosition.y, sunPosition.z]}
      color={sunColor}
      intensity={sunIntensity}
    />
  );
};

const AnimatedScene = ({ withEffects = false }) => {
  const modelRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const initialAnimationRef = useRef(true);
  const animationProgressRef = useRef(0);
  const mousePosition = useRef({ x: 0, y: 0 });

  const startPos = {
    x: -25,
    y: 25,
    z: 35,
  };

  const { mouseRotationIntensity, rotationSmoothing } = useControls(
    "Mouse Rotation",
    {
      mouseRotationIntensity: { value: 0.15, min: 0, max: 1, step: 0.01 },
      rotationSmoothing: { value: 0.1, min: 0.01, max: 0.5, step: 0.01 },
    }
  );

  const { modelRotation, modelScale, modelPosition } = useControls("Model", {
    modelRotation: { value: -6.8, min: -10, max: 0, step: 0.01 },
    modelScale: { value: 0.3, min: 0.1, max: 5, step: 0.1 },
    modelPosition: {
      value: { x: 5, y: 0, z: 0 },
      step: 0.1,
    },
  });

  const {
    cameraPositionX,
    cameraPositionY,
    cameraPositionZ,
    cameraRotationX,
    cameraRotationY,
    cameraFov,
    cameraNear,
    cameraFar,
  } = useControls("Camera", {
    cameraPositionX: { value: -12, min: -50, max: 50, step: 1 },
    cameraPositionY: { value: 12, min: -50, max: 50, step: 1 },
    cameraPositionZ: { value: 26, min: -50, max: 50, step: 1 },
    cameraRotationX: { value: -0.2, min: -Math.PI, max: Math.PI, step: 0.01 },
    cameraRotationY: { value: -0.2, min: -Math.PI, max: Math.PI, step: 0.01 },
    cameraFov: { value: 54, min: 10, max: 120, step: 1 },
    cameraNear: { value: 0.1, min: 0.1, max: 50, step: 0.1 },
    cameraFar: { value: 1000, min: 100, max: 5000, step: 100 },
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: 0,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (initialAnimationRef.current) {
      animationProgressRef.current = THREE.MathUtils.lerp(
        animationProgressRef.current,
        1,
        0.02
      );

      const progress = animationProgressRef.current;

      camera.position.x = THREE.MathUtils.lerp(
        startPos.x,
        cameraPositionX,
        progress
      );
      camera.position.y = THREE.MathUtils.lerp(
        startPos.y,
        cameraPositionY,
        progress
      );
      camera.position.z = THREE.MathUtils.lerp(
        startPos.z,
        cameraPositionZ,
        progress
      );

      if (progress > 0.99) {
        initialAnimationRef.current = false;
      }
    } else {
      camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
    }

    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler(cameraRotationX, cameraRotationY, 0, "XYZ");
    quaternion.setFromEuler(euler);
    camera.quaternion.copy(quaternion);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    camera.fov = cameraFov;
    camera.near = cameraNear;
    camera.far = cameraFar;
    camera.updateProjectionMatrix();

    if (modelRef.current) {
      const targetRotationY =
        modelRotation + mousePosition.current.x * mouseRotationIntensity;
      const targetRotationX = mousePosition.current.y * mouseRotationIntensity;

      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        targetRotationY,
        rotationSmoothing
      );

      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        targetRotationX,
        rotationSmoothing
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 10, 2]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-near={1}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
        shadow-radius={4}
      />
      <group
        ref={modelRef}
        scale={modelScale}
        position={[modelPosition.x, modelPosition.y, modelPosition.z]}
      >
        <PezDuckModel />
      </group>
      <Floor />
      {withEffects && <SunLight />}
    </>
  );
};

const Effects: React.FC = () => {
  const dividerPosition = useStore((state) => state.dividerPosition);
  const screenHeight = window.innerHeight;

  const progress = Math.max(
    0,
    Math.min(1, (dividerPosition / screenHeight) * 3)
  );

  const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
  };

  const noiseOpacity = lerp(0.4, 0, progress);
  const aberrationStrength = lerp(0.008, 0, progress);

  return (
    <EffectComposer multisampling={0}>
      {/* <Bloom
        intensity={bloomStrength}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur
        resolutionScale={0.5}
      /> */}
      <Noise
        opacity={noiseOpacity}
        blendFunction={BlendFunction.SOFT_LIGHT}
        premultiply={false}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(aberrationStrength)}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};
const TechStackTower: React.FC<TechStackTowerProps> = ({
  withEffects = false,
}) => {
  return (
    <>
      <Leva collapsed={false} oneLineLabels flat hidden={false} />
      <BackTechBackground activeNeon={withEffects} />
      <div className="absolute inset-0">
        <Canvas shadows gl={{ antialias: true }}>
          <AnimatedScene withEffects={withEffects} />
          <Environment preset="city" />
          {withEffects && <Effects />}
        </Canvas>
      </div>
    </>
  );
};

export default TechStackTower;
