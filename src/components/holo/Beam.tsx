"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  progress: React.RefObject<{ beam: number; flash: number; idle: number }>;
  /** Y of the emitter surface. */
  base: number;
  height: number;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // Feather the silhouette: faces seen edge-on fade out.
    float facing = abs(dot(normalize(vNormal), normalize(vView)));
    float edge = smoothstep(0.0, 0.85, facing);
    // Bright near the emitter (uv.y = 0), fading upward.
    float vertical = pow(1.0 - vUv.y, 1.9);
    // Slow drifting streaks around the cone.
    float streak = 0.75 + 0.25 * sin(vUv.x * 46.0 + uTime * 0.6)
                        * sin(vUv.y * 9.0 - uTime * 0.9);
    // Faint horizontal bands rising through the beam.
    float band = 0.85 + 0.15 * sin(vUv.y * 60.0 - uTime * 2.4);
    float a = vertical * edge * streak * band * uOpacity;
    gl_FragColor = vec4(uColor * (0.7 + 0.6 * vertical), a);
  }
`;

/**
 * Projection cone: an open cylinder (narrow at the emitter, wide at the top)
 * with an additive shader. Bright and concentrated at the base, feathered
 * at the silhouette edges, fading upward, with slow drifting streaks.
 */
export function Beam({ progress, base, height }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color("#4fd1c5") },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const p = progress.current;
    const m = mat.current;
    const g = mesh.current;
    if (!p || !m || !g) return;
    m.uniforms.uTime.value = clock.elapsedTime;
    // Beam expands upward on activation, sits at ~0.32 alpha in idle,
    // brighter during the flash.
    const s = Math.max(0.001, p.beam);
    g.scale.set(1, s, 1);
    g.position.y = base + (height * s) / 2;
    m.uniforms.uOpacity.value = p.beam * (0.32 + p.flash * 0.5);
  });

  return (
    <mesh ref={mesh} position={[0, base + height / 2, 0]}>
      <cylinderGeometry args={[1.45, 0.3, height, 64, 1, true]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
