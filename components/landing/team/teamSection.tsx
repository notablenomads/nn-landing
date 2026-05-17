import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { computeShader, fragmentShader, vertexShader } from "./shaders";
import Image from "next/image";
import PopupWrapper from "@/components/landing/team/popupWrapper";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  github: string;
  description: string;
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

interface TeamFrameLayout {
  frameWidth: number;
  frameHeight: number;
  spacing: number;
  labelOffset: number;
}

interface ImageWithEffectProps {
  imageUrl: string;
  frame: TeamFrameLayout;
  config?: EffectConfig;
  borderRadius?: number;
}

/** Uniform portrait frame (width ÷ height). */
const PORTRAIT_RATIO = 3 / 5;

function getTextureCoverTransform(imageWidth: number, imageHeight: number) {
  const imageAspect = imageWidth / imageHeight;

  if (imageAspect > PORTRAIT_RATIO) {
    const scaleX = PORTRAIT_RATIO / imageAspect;
    return {
      scale: new THREE.Vector2(scaleX, 1),
      offset: new THREE.Vector2((1 - scaleX) / 2, 0),
    };
  }

  const scaleY = imageAspect / PORTRAIT_RATIO;
  return {
    scale: new THREE.Vector2(1, scaleY),
    offset: new THREE.Vector2(0, (1 - scaleY) / 2),
  };
}

function useTeamWebGLLayout(): TeamFrameLayout {
  const [layout, setLayout] = useState<TeamFrameLayout>({
    frameWidth: 3.25,
    frameHeight: 3.25 / PORTRAIT_RATIO,
    spacing: 4.25,
    labelOffset: 3.8,
  });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const scale = Math.min(Math.max(vw / 1280, 0.92), 1.22);
      const frameWidth = 3.25 * scale;
      const frameHeight = frameWidth / PORTRAIT_RATIO;

      setLayout({
        frameWidth,
        frameHeight,
        spacing: 4.25 * scale,
        labelOffset: frameHeight / 2 + 1.15,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
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
    role: "Frontend Artisan & Pixel Perfectionist",
    image: "/team/milad-ghamati.png",
    linkedin: "https://www.linkedin.com/in/milad-ghamati-0517a8151/",
    github: "https://github.com/Moouren",
    description:
      "I'm Milad, a FrontEnd Engineer with 7+ years of experience, I have led and contributed to successful projects, utilizing ReactJS, Next.js, and modern JavaScript libraries. I’ve built cutting-edge dashboards, developed reusable libraries, and implemented performance improvements across multiple platforms. My expertise in mentoring teams and leading code reviews has helped establish efficient development practices and enhanced project outcomes.",
  },
  {
    name: "Mahdi Rashidi",
    role: "Logic Weaver & Cloudsmith",
    image: "/team/mahdi-rashidi.png",
    linkedin: "https://www.linkedin.com/in/mrdevx/",
    github: "https://github.com/MRdevX",
    description:
      "I'm Mahdi Rashidi, a Backend Engineer and Software Architect with 9+ years of experience building scalable backend services and microservices aligned with business needs. Skilled in TypeScript and NestJS, I specialize in cloud-native applications and high-performance architectures.",
  },
  {
    name: "Amirhossein Samiazar",
    role: "AI Wizard & Machine Learning Maestro",
    image: "/team/amir-sami.png",
    linkedin: "https://www.linkedin.com/in/amirhosein-samiazar/",
    github: "https://github.com/ahsami",
    description:
      "With over 10 years of experience in software development and AI engineering, " +
      "I specialize in building intelligent systems and machine learning solutions. " +
      "My expertise spans natural language processing, computer vision, and deep learning, " +
      "with hands-on experience in deploying AI models at scale. I've led teams in developing " +
      "AI-powered applications, from recommendation systems to automated decision-making tools, " +
      "while maintaining a focus on ethical AI practices and performance optimization.",
  },
  {
    name: "Ali Bakhtiyari",
    role: "Flutter Wizard & Mobile App Maestro",
    image: "/team/ali-bakhtiyari.png",
    linkedin: "https://www.linkedin.com/in/alibakhtiyari/",
    github: "https://github.com/alibt",
    description:
      "I'm a Flutter Developer with more than 5 years of experience.\n" +
      "I have developed and maintained mobile app projects on\n" +
      " clean architecture/bloc+cubit and MVVM/Provider for android and iOS.\n" +
      "As a team member, I try to understand the priorities and come up with solutions aligned with them.",
  },
];

// WebGL Image Effect Component
const ImageWithEffect: React.FC<ImageWithEffectProps> = ({
  imageUrl,
  frame,
  config = defaultConfig,
  borderRadius = 10,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const texture = useTexture(imageUrl);
  const { gl, viewport } = useThree();

  const gpuCompute = useRef<GPUComputationRenderer | null>(null);
  const computeVariable = useRef<ComputeVariable | null>(null);
  const prevMouse = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));

  const image = texture.image as HTMLImageElement | undefined;
  const imageWidth = image?.width || 1;
  const imageHeight = image?.height || 1;
  const coverTransform = getTextureCoverTransform(imageWidth, imageHeight);

  useEffect(() => {
    timeRef.current = 0;
    const computeSize = 128;
    const computeRenderer = new GPUComputationRenderer(
      computeSize,
      computeSize,
      gl
    );

    const dataTexture = computeRenderer.createTexture();
    // Cast image.data to Uint8Array first
    const theArray = dataTexture.image.data as Uint8Array;
    for (let i = 0; i < theArray.length; i += 4) {
      // Convert the -1 to 1 range to 0 to 255 for Uint8Array
      theArray[i] = ((Math.random() * 2 - 1) * 0.5 + 0.5) * 255;
      theArray[i + 1] = ((Math.random() * 2 - 1) * 0.5 + 0.5) * 255;
      theArray[i + 2] = 127.5; // Middle value for 0
      theArray[i + 3] = 255; // Full alpha
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
      <planeGeometry
        args={[frame.frameWidth, frame.frameHeight, 32, 32]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          uTexture: { value: texture },
          uGrid: { value: null },
          uImageResolution: {
            value: new THREE.Vector2(imageWidth, imageHeight),
          },
          uViewport: {
            value: new THREE.Vector2(viewport.width, viewport.height),
          },
          uTextureScale: { value: coverTransform.scale },
          uTextureOffset: { value: coverTransform.offset },
          uDistortionStrength: { value: config.distortionStrength },
          uDistortionThreshold: { value: config.distortionThreshold },
          uRgbShiftStrength: { value: config.rgbShiftStrength },
          uBorderRadius: {
            value: borderRadius / imageWidth,
          },
        }}
      />
    </mesh>
  );
};

const MobileTeamSection: React.FC = () => {
  return (
    <div className="w-full py-12 sm:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative mb-4 aspect-[3/5] w-full max-w-[300px] overflow-hidden rounded-lg shadow-lg shadow-black/40 ring-1 ring-white/10 sm:max-w-none">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top filter grayscale transition-all duration-300 hover:grayscale-0"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority={index < 2}
                />
              </div>
              <div className="w-full max-w-[300px] rounded bg-black/75 p-4 text-center sm:max-w-none">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-300 mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <Image
                      src="/social/github.png"
                      alt="GitHub"
                      width={30}
                      height={30}
                      className="rounded"
                    />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    <Image
                      src="/social/linkedin.png"
                      alt="LinkedIn"
                      width={30}
                      height={30}
                      className="rounded"
                    />
                  </a>
                </div>
                <PopupWrapper title={member.name}>
                  {member.description}
                </PopupWrapper>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WebGLTeamSection: React.FC = () => {
  const layout = useTeamWebGLLayout();
  const memberCount = teamMembers.length;
  const totalWidth = (memberCount - 1) * layout.spacing;
  const cameraZ = Math.max(
    18,
    totalWidth * 1.35 + layout.frameHeight * 0.55
  );
  const cameraFOV = Math.max(25, 20 + memberCount * 2);

  return (
    <div className="w-full min-h-[560px] h-[min(860px,88vh)]">
      <Canvas
        camera={{
          position: [0, 0, cameraZ],
          fov: cameraFOV,
          near: 0.1,
          far: 1000,
        }}
      >
        {teamMembers.map((member, index) => {
          const xPosition =
            (index - (memberCount - 1) / 2) * layout.spacing;

          return (
            <group key={index} position={[xPosition, 0, 0]}>
              <ImageWithEffect imageUrl={member.image} frame={layout} />
              <Html position={[0, -layout.labelOffset, 0]} center>
                <div className="text-center bg-black bg-opacity-75 p-4 w-72 rounded">
                  <h3 className="text-lg font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-300">{member.role}</p>
                  <div className="flex justify-center space-x-4 my-2">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/social/github.png"
                        alt="GitHub"
                        width={30}
                        height={30}
                      />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/social/linkedin.png"
                        alt="LinkedIn"
                        width={30}
                        height={30}
                      />
                    </a>
                  </div>
                  <PopupWrapper title={member.name}>
                    {member.description}
                  </PopupWrapper>
                </div>
              </Html>
            </group>
          );
        })}
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
      setIsMobile(window.innerWidth < 1024);
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
