/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { computeShader, fragmentShader, vertexShader } from "./shaders";
import Image from "next/image";

interface EffectConfig {
  mouseRadius: number;
  mouseStrength: number;

  distortionStrength: number;
  distortionThreshold: number;

  rgbShiftStrength: number;

  decaySpeed: number;
  flowStrength: number;
}

const defaultConfig: EffectConfig = {
  mouseRadius: 0.25,
  mouseStrength: 40.0,
  distortionStrength: 0.04,
  distortionThreshold: 0.03,
  rgbShiftStrength: 0.4,
  decaySpeed: 0.85,
  flowStrength: 0.15,
};

interface ImageWithEffectProps {
  imageUrl: string;
}

type ComputeVariable = {
  material: THREE.ShaderMaterial;
};

interface ImageWithEffectProps {
  imageUrl: string;
  config?: EffectConfig;
  borderRadius?: number;
}

const ImageWithEffect: React.FC<ImageWithEffectProps> = ({
  imageUrl,
  config = defaultConfig,
  borderRadius = 10,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const texture = useTexture(imageUrl);
  const { gl, viewport } = useThree();

  const gpuCompute = useRef<GPUComputationRenderer>();
  const computeVariable = useRef<ComputeVariable>();
  const prevMouse = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));

  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = 3;
  const height = width / aspect;

  useEffect(() => {
    timeRef.current = 0;
    const computeSize = 128;
    const computeRenderer = new GPUComputationRenderer(
      computeSize,
      computeSize,
      gl
    );

    const dataTexture = computeRenderer.createTexture();
    const theArray = dataTexture.image.data;
    for (let i = 0; i < theArray.length; i += 4) {
      theArray[i] = Math.random() * 2 - 1;
      theArray[i + 1] = Math.random() * 2 - 1;
      theArray[i + 2] = 0;
      theArray[i + 3] = 1;
    }

    const variable = computeRenderer.addVariable(
      "uGrid",
      computeShader,
      dataTexture
    );

    computeVariable.current = variable;

    variable.material.uniforms = {
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uDeltaMouse: { value: new THREE.Vector2(0, 0) },
      uMouseMove: { value: 0 },
      uMouseRadius: { value: config.mouseRadius },
      uMouseStrength: { value: config.mouseStrength },
      uDecaySpeed: { value: config.decaySpeed },
      uFlowStrength: { value: config.flowStrength },
      uTime: { value: 0.0 },
    };

    computeRenderer.setVariableDependencies(variable, [variable]);

    const error = computeRenderer.init();
    if (error !== null) {
      console.error(error);
    }

    gpuCompute.current = computeRenderer;

    return () => computeRenderer.dispose();
  }, [gl, config]);

  useFrame((state, delta) => {
    if (gpuCompute.current && materialRef.current && computeVariable.current) {
      timeRef.current = Math.min(timeRef.current + delta, 2);

      computeVariable.current.material.uniforms.uTime.value = timeRef.current;

      gpuCompute.current.compute();
      materialRef.current.uniforms.uGrid.value =
        gpuCompute.current.getCurrentRenderTarget(
          computeVariable.current as never
        ).texture;
    }
  });

  const handlePointerMove = (e: THREE.Event & { uv?: THREE.Vector2 }) => {
    if (!e.uv || !computeVariable.current) return;

    prevMouse.current.copy(currentMouse.current);
    currentMouse.current.set(e.uv.x, e.uv.y);

    const delta = currentMouse.current.clone().sub(prevMouse.current);

    computeVariable.current.material.uniforms.uMouse.value.copy(
      currentMouse.current
    );
    computeVariable.current.material.uniforms.uDeltaMouse.value.copy(delta);
    computeVariable.current.material.uniforms.uMouseMove.value = 1;
  };

  const handlePointerLeave = () => {
    if (!computeVariable.current) return;

    computeVariable.current.material.uniforms.uMouse.value.set(0.5, 0.5);
    computeVariable.current.material.uniforms.uDeltaMouse.value.set(0, 0);
    computeVariable.current.material.uniforms.uMouseMove.value = 0;
  };

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[width, height, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          uTexture: { value: texture },
          uGrid: { value: null },
          uImageResolution: {
            value: new THREE.Vector2(
              texture.image?.width || 1,
              texture.image?.height || 1
            ),
          },
          uViewport: {
            value: new THREE.Vector2(viewport.width, viewport.height),
          },
          uDistortionStrength: { value: config.distortionStrength },
          uDistortionThreshold: { value: config.distortionThreshold },
          uRgbShiftStrength: { value: config.rgbShiftStrength },
          uBorderRadius: {
            value: borderRadius / (texture.image?.width || 200),
          },
        }}
      />
    </mesh>
  );
};

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const useMediaQuery = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      setBreakpoints({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
      });
    };

    updateBreakpoints();
    window.addEventListener("resize", updateBreakpoints);
    return () => window.removeEventListener("resize", updateBreakpoints);
  }, []);

  return breakpoints;
};

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin:string;
  github:string;
}

interface Position extends Array<number> {
  0: number;
  1: number;
  2: number;
}

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Milad Ghamati",
      role: "FrontEnd Engineer",
      image: "./milad-ghamati.png",
      linkedin:'https://www.google.com',
      github:'https://www.google.com'
    },
    {
      name: "Mahdi Rashidi",
      role: "Cloud-Native & Backend Specialist",
      image: "./mahdi-rashidi.png",
      linkedin:'https://www.google.com',
      github:'https://www.google.com'
    },
    {
      name: "Sarah Wilson",
      role: "Senior Developer",
      image: "./team-3.jpg",
      linkedin:'https://www.google.com',
      github:'https://www.google.com'
    },
  ];

  const { isMobile, isTablet } = useMediaQuery();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getPosition = (index: number): Position => {
    if (isMobile) {
      return [0, (1 - index) * 4, 0];
    }
    if (isTablet) {
      // const row = Math.floor(index / 2);
      // const col = index % 2;
      // return [(col * 2 - 1) * 4, -row * 4, 0];
      return [0, (1 - index) * 4, 0];
    }
    return [(index - 1) * 4, 0, 0];
  };

  if (!isClient) {
    return <div className="w-full h-screen bg-gray-900">Loading...</div>;
  }

  return (
    <div className={`w-full h-[600px]`}>
      <Canvas
        camera={{
          position: [0, 0, 15],
          fov: isMobile || isTablet ? 40 : 25,
          near: 0.1,
          far: 1000,
        }}
      >
        {teamMembers.map((member, index) => (
          <group key={index} position={getPosition(index) as never}>
            <ImageWithEffect imageUrl={member.image} />
            <Html position={[0, -2, 0]} center >
              <div className="text-center bg-black bg-opacity-75 p-4 w-72 rounded">
                <h3 className="text-xl font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-gray-300">{member.role}</p>
                <div className='flex justify-center items-center my-2 space-x-2'>
                  <a href={member.github} target='_blank'>
                    <Image src={'/github.png'} alt='github' width='30' height='30'/>
                  </a>
                  <a href={member.linkedin} target='_blank'>
                    <Image src={'/linkedin.png'} alt='linkedin' width='30' height='30'/>
                  </a>
                </div>
              </div>
            </Html>
          </group>
        ))}
      </Canvas>
    </div>
  );
};

export default TeamSection;
