export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const fragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uGrid;
uniform vec2 uImageResolution;
uniform vec2 uViewport;
uniform float uDistortionStrength;
uniform float uDistortionThreshold;
uniform float uRgbShiftStrength;

varying vec2 vUv;

float roundedBoxSDF(vec2 centerUV, vec2 size, float radius) {
  vec2 q = abs(centerUV) - size + radius;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

void main() {
  vec2 ratio = vec2(
    min(1.0, uViewport.x / uViewport.y),
    min(1.0, uViewport.y / uViewport.x)
  );
  
  vec2 uv = vUv;
  vec4 displacement = texture2D(uGrid, vUv);
  
  // Calculate rounded corners
  vec2 centerUV = vUv * 2.0 - 1.0;
  float radius = 0.05;
  float distance = roundedBoxSDF(centerUV, vec2(1.0), radius);
  
  if (distance > 0.0) {
    discard;
  }
  
  float dist = length(displacement.rg);
  vec4 color;
  
  if(dist > uDistortionThreshold) {
    vec2 flow = displacement.rg;
    vec2 distortedUv = uv + flow * uDistortionStrength;
    vec2 shift = flow * uRgbShiftStrength;
    
    vec2 redUv = distortedUv + shift;
    vec2 greenUv = distortedUv;
    vec2 blueUv = distortedUv - shift;
    
    redUv = clamp(redUv, 0.0, 1.0);
    greenUv = clamp(greenUv, 0.0, 1.0);
    blueUv = clamp(blueUv, 0.0, 1.0);
    
    float r = texture2D(uTexture, redUv).r;
    float g = texture2D(uTexture, greenUv).g;
    float b = texture2D(uTexture, blueUv).b;
    
    color = vec4(r, g, b, 1.0);
  } else {
    // Only apply grayscale to the non-distorted parts
    vec4 texColor = texture2D(uTexture, uv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    color = vec4(vec3(gray), texColor.a);
  }
  
  gl_FragColor = color;
}
`;

export const computeShader = `
uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uMouseMove;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uDecaySpeed;
uniform float uFlowStrength;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 color = texture2D(uGrid, uv);
  
  float dist = distance(uv, uMouse);
  // Modified smoothstep to create a more gradual, borderless falloff
  float falloff = smoothstep(uMouseRadius * 1.5, 0.0, dist);
  
  vec2 flow = uDeltaMouse * uMouseStrength * falloff;
  color.rg = color.rg * uDecaySpeed + flow * uFlowStrength;
  
  gl_FragColor = color;
}
`;
