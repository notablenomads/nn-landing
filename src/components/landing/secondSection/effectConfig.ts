interface EffectConfig {
  mouseRadius: number;
  mouseStrength: number;
  distortionStrength: number;
  distortionThreshold: number;
  rgbShiftStrength: number;
  decaySpeed: number;
  flowStrength: number;
}

export const defaultConfig: EffectConfig = {
  mouseRadius: 0.15,
  mouseStrength: 400.0,
  distortionStrength: 0.015,
  distortionThreshold: 0.001,
  rgbShiftStrength: 0.006,
  decaySpeed: 0.85,
  flowStrength: 0.15,
};

export type { EffectConfig };
