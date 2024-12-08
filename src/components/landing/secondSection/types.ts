// types.ts
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";

export interface EffectConfig {
  distortionStrength: number;
  rgbShiftStrength: number;
  mouseSpeed: number;
  effectRadius: number;
  decaySpeed: number;
  rgbChannelMultipliers: {
    red: number;
    green: number;
    blue: number;
  };
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  position: [number, number, number];
  dimensions: any;
}

export interface DistortionImageProps {
  imageUrl: string;
  width: number;
  height: number;
  isResponsive: boolean;
}

export interface ShaderUniforms {
  uTexture: { value: THREE.Texture | null };
  uGrid: { value: THREE.Texture | null };
  uContainerResolution: { value: THREE.Vector2 };
  uImageResolution: { value: THREE.Vector2 };
}

export interface ComputeUniforms {
  uMouse: { value: THREE.Vector2 };
  uDeltaMouse: { value: THREE.Vector2 };
  uMouseMove: { value: number };
}

// Additional type exports
export type PointerMoveEvent = ThreeEvent<PointerEvent>;

export interface MaterialRefs {
  material: THREE.ShaderMaterial | null;
}

export interface MeshRefs {
  mesh: THREE.Mesh | null;
}

export interface GPGPUVariable extends THREE.ShaderMaterial {
  material: {
    uniforms: ComputeUniforms;
  };
}

export interface TextureData {
  image: {
    data: Float32Array;
    width: number;
    height: number;
  };
  needsUpdate: boolean;
}
export interface TeamMemberProps {
  imageUrl: string;
  width: number;
  height: number;
  isResponsive?: boolean;
}
