import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { computeShader, fragmentShader, vertexShader } from "./shaders";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  github: string;
}

interface EffectConfig {
  mouseRadius: number;
  mouseStrength: number;
  distortionStrength: number;
  distortionThreshold: number;
  rgbShiftStrength: number;
  decaySpeed: number;
  flowStrength: number;
}

interface ImageWithEffectProps {
  imageUrl: string;
  config?: EffectConfig;
  borderRadius?: number;
}

type ComputeVariable = {
  material: THREE.ShaderMaterial;
};

const defaultConfig: EffectConfig = {
  mouseRadius: 0.25,
  mouseStrength: 40.0,
  distortionStrength: 0.04,
  distortionThreshold: 0.03,
  rgbShiftStrength: 0.4,
  decaySpeed: 0.85,
  flowStrength: 0.15,
};
const teamMembers: TeamMember[] = [
  {
    name: "Milad Ghamati",
    role: "Co-Founder & \nFrontend Engineer",
    image: "/milad-ghamati.png",
    linkedin: "https://www.linkedin.com/in/milad-ghamati-0517a8151/",
    github: "https://github.com/Moouren",
  },
  {
    name: "Mahdi Rashidi",
    role: "Co-Founder & \nBackend Engineer",
    image: "/mahdi-rashidi.png",
    linkedin: "https://www.linkedin.com/in/mrdevx/",
    github: "https://github.com/MRdevX",
  },
  {
    name: "Sarah Wilson",
    role: "Senior Developer",
    image: "/team-3.jpg",
    linkedin: "https://www.google.com",
    github: "https://www.google.com",
  },
];

// WebGL Image Effect Component
const ImageWithEffect: React.FC<ImageWithEffectProps> = ({ imageUrl, config = defaultConfig, borderRadius = 10 }) => {
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
    const computeRenderer = new GPUComputationRenderer(computeSize, computeSize, gl);

    const dataTexture = computeRenderer.createTexture();
    const theArray = dataTexture.image.data;
    for (let i = 0; i < theArray.length; i += 4) {
      theArray[i] = Math.random() * 2 - 1;
      theArray[i + 1] = Math.random() * 2 - 1;
      theArray[i + 2] = 0;
      theArray[i + 3] = 1;
    }

    const variable = computeRenderer.addVariable("uGrid", computeShader, dataTexture);

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
      materialRef.current.uniforms.uGrid.value = gpuCompute.current.getCurrentRenderTarget(
        computeVariable.current as never
      ).texture;
    }
  });

  const handlePointerMove = (e: THREE.Event & { uv?: THREE.Vector2 }) => {
    if (!e.uv || !computeVariable.current) return;

    prevMouse.current.copy(currentMouse.current);
    currentMouse.current.set(e.uv.x, e.uv.y);

    const delta = currentMouse.current.clone().sub(prevMouse.current);

    computeVariable.current.material.uniforms.uMouse.value.copy(currentMouse.current);
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
    <mesh ref={meshRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
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
            value: new THREE.Vector2(texture.image?.width || 1, texture.image?.height || 1),
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

const MobileTeamSection: React.FC = () => {
  return (
    <div className="w-full py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-64 h-64 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index < 2}
                />
              </div>
              <div className="text-center bg-black bg-opacity-75 p-4 w-64 rounded">
                <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-gray-300 mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <Image src="/github.png" alt="GitHub" width={30} height={30} className="rounded" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <Image src="/linkedin.png" alt="LinkedIn" width={30} height={30} className="rounded" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// WebGL Team Section Component
const WebGLTeamSection: React.FC = () => {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{
          position: [0, 0, 15],
          fov: 25,
          near: 0.1,
          far: 1000,
        }}
      >
        {teamMembers.map((member, index) => (
          <group key={index} position={[(index - 1) * 4, 0, 0]}>
            <ImageWithEffect imageUrl={member.image} />
            <Html position={[0, -2, 0]} center>
              <div className="text-center bg-black bg-opacity-75 p-4 w-72 rounded">
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-gray-300">{member.role}</p>
                <div className="flex justify-center space-x-4 my-2">
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <Image src="/github.png" alt="GitHub" width={30} height={30} />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Image src="/linkedin.png" alt="LinkedIn" width={30} height={30} />
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

// Main Responsive Component
const TeamSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isClient) {
    return <div className="w-full h-screen bg-gray-900">Loading...</div>;
  }

  return isMobile ? <MobileTeamSection /> : <WebGLTeamSection />;
};

export default TeamSection;
