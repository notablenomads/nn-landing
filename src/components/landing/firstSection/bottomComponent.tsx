import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import useStore from "../store";
import * as THREE from "three";
import "../styles.css";
import Header from "../../header";

const VertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FragmentShader = `
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_diversity;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;

  vec2 random2(vec2 st, float seed) {
    st = vec2(dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
    return -1.0 + 2.0*fract(sin(st)*seed);
  }

  float noise(vec2 st, float seed) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(random2(i + vec2(0.0,0.0), seed), f - vec2(0.0,0.0)),
          dot(random2(i + vec2(1.0,0.0), seed), f - vec2(1.0,0.0)), u.x),
      mix(dot(random2(i + vec2(0.0,1.0), seed), f - vec2(0.0,1.0)),
          dot(random2(i + vec2(1.0,1.0), seed), f - vec2(1.0,1.0)), u.x), u.y);
  }

  float pattern(vec2 uv, float seed, float time, inout vec2 q, inout vec2 r) {
    q = vec2(noise(uv * u_diversity + vec2(0.0, 0.0), seed), 
             noise(uv * u_diversity + vec2(5.2, 1.3), seed));
             
    r = vec2(noise(uv + 4.0 * q + vec2(1.7 - time / 2.0, 9.2), seed),
             noise(uv + 4.0 * q + vec2(8.3 - time / 2.0, 2.8), seed));
             
    return noise(uv + 4.0 * r, seed);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    uv *= 1.0 + dot(uv, uv) * 0.3;
    float time = u_time / 20.0;
    mat2 rot = mat2(cos(time), sin(time), -sin(time), cos(time));
    uv = rot * uv;
    uv *= 1.4 + sin(time) * 0.3;
    uv.x -= time;

    vec2 q = vec2(0.0, 0.0);
    vec2 r = vec2(0.0, 0.0);
    float brightness = pattern(uv, 43758.5453123, time, q, r);

    float flicker = 1.0 + sin(u_time * 8.0) * 0.03;

    vec3 mixedColor = mix(u_color1, u_color2, brightness);
    mixedColor = mix(mixedColor, u_color3, brightness * brightness);

    vec3 backgroundColor = vec3(0.1, 0.1, 0.1);
    vec3 finalColor = mix(backgroundColor, mixedColor, brightness);
    
    finalColor *= flicker;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const ShaderPlane = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dividerPosition = useStore((state) => state.dividerPosition);

  const lerpColor = (start: number, end: number, t: number): number =>
    start + (end - start) * t;

  const uniforms = useMemo(
    () => ({
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_time: { value: 0 },
      u_diversity: { value: 0.5 },
      u_color1: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
      u_color2: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
      u_color3: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      const uniforms = materialRef.current.uniforms;
      uniforms.u_time.value = clock.getElapsedTime();

      const diversity = 1.0 + (dividerPosition / 100) * 5.0;
      uniforms.u_diversity.value = diversity;

      const t = dividerPosition / 100;
      const pulseEffect = Math.sin(clock.getElapsedTime() * 2) * 0.1;

      uniforms.u_color1.value.set(
        lerpColor(0.5, 0.78, t) + pulseEffect,
        lerpColor(0.5, 0.43, t),
        lerpColor(0.5, 0, t)
      );

      uniforms.u_color2.value.set(
        lerpColor(0.5, 0.78 * 0.9, t),
        lerpColor(0.5, 0.43 * 0.9, t),
        lerpColor(0.5, 0, t)
      );

      uniforms.u_color3.value.set(
        lerpColor(0.5, 0.78 * 1.1, t) + pulseEffect,
        lerpColor(0.5, 0.43 * 1.1, t),
        lerpColor(0.5, 0, t)
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VertexShader}
        fragmentShader={FragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const BottomComponent = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Header />
      <Canvas>
        <ShaderPlane />
      </Canvas>
      <div className="title-container bottom-title-container">
        <h1 className="title">Notable Nomads</h1>
        <h1 className="description">Wander, Discover, Create</h1>
      </div>
    </div>
  );
};

export default BottomComponent;
