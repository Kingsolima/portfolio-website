"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

type Progress = { build: number; scan: number; idle: number };

type Props = {
  src: string;
  progress: React.RefObject<Progress>;
  /** World Y of the bottom edge of the projection. */
  bottom: number;
  /** World width of the projection plane. */
  width: number;
  motion: boolean;
  /** Current drag rotation in radians, eased by the parent. Read only here. */
  spin: React.RefObject<{ target: number; current: number }>;
};

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Gentle surface ripple so the plane does not read as flat glass.
    p.z += sin(uv.y * 22.0 + uTime * 1.4) * 0.008 * uMotion;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform float uTime;
  uniform float uBuild;
  uniform float uScan;
  uniform float uMotion;
  uniform float uIdle;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    vec2 uv = vUv;

    // Slice assembly: 28 horizontal bands appear in a scrambled order,
    // each sliding in sideways as it resolves.
    float slice = floor(uv.y * 28.0);
    float order = hash(slice * 7.31 + 1.7);
    float reveal = smoothstep(order * 0.75, order * 0.75 + 0.22, uBuild);
    uv.x += (1.0 - reveal) * (hash(slice * 3.7) - 0.5) * 0.7;

    // Rare horizontal tear: about once every few seconds, one band
    // shifts for a fraction of a second.
    float gate = step(0.965, hash(floor(uTime * 1.5)));
    float bandY = hash(floor(uTime * 1.5) + 11.0);
    float inBand = step(bandY, uv.y) * step(uv.y, bandY + 0.05);
    uv.x += gate * inBand * (hash(floor(uTime * 24.0)) - 0.5) * 0.14 * uMotion * min(1.0, uIdle);

    vec4 tex = texture2D(map, uv);
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

    // Cyan ramp: shadows deep teal, highlights toward white-cyan.
    vec3 hi = mix(uColor, vec3(0.88, 1.0, 1.0), pow(lum, 1.6));
    vec3 col = mix(uColor * 0.30, hi, smoothstep(0.02, 0.95, lum));

    // Fine scanlines with slow independent drift.
    float scan = 0.72 + 0.28 * sin(uv.y * 420.0 - uTime * 5.0 * uMotion);
    col *= scan;

    // Edge glow from the alpha gradient.
    vec2 px = vec2(0.008, 0.006);
    float aL = texture2D(map, uv - vec2(px.x, 0.0)).a;
    float aR = texture2D(map, uv + vec2(px.x, 0.0)).a;
    float aU = texture2D(map, uv + vec2(0.0, px.y)).a;
    float aD = texture2D(map, uv - vec2(0.0, px.y)).a;
    float edge = clamp(abs(aL - aR) + abs(aU - aD), 0.0, 1.0);
    col += uColor * edge * 1.6;

    // Reveal scan line: a bright bar sweeping bottom to top.
    float sl = uScan < 0.0 ? 0.0 : exp(-pow((uv.y - uScan) * 34.0, 2.0));
    col += vec3(0.9, 1.0, 1.0) * sl * 1.2;

    // Brighter toward the base where the beam feeds it.
    col += uColor * smoothstep(0.45, 0.0, uv.y) * 0.35;

    // Restrained flicker in idle.
    float fl = 1.0 - (0.06 + 0.04 * sin(uTime * 3.1)) * abs(sin(uTime * 41.0) * sin(uTime * 17.0)) * uMotion * min(1.0, uIdle);

    float a = tex.a * reveal * uOpacity * fl;
    a += sl * tex.a * 0.35;
    // Dissolve the very bottom into the beam.
    a *= smoothstep(0.0, 0.07, uv.y);
    // Keep the top of the projection slightly thinner, like light losing coherence.
    a *= 1.0 - 0.18 * smoothstep(0.7, 1.0, uv.y);

    gl_FragColor = vec4(col * a, a);
  }
`;

function makeUniforms(map: THREE.Texture, opacity: number) {
  return {
    map: { value: map },
    uTime: { value: 0 },
    uBuild: { value: 0 },
    uScan: { value: -1 },
    uMotion: { value: 1 },
    uIdle: { value: 0 },
    uOpacity: { value: opacity },
    uColor: { value: new THREE.Color("#4fd1c5") },
  };
}

/**
 * The projected person. Any cutout image works: PNG alpha defines the
 * silhouette, luminance drives the cyan ramp. The shader handles slice
 * assembly, the reveal scan line, scanlines, edge glow, flicker and rare
 * horizontal tears. Two planes: the main image and a dim offset copy behind
 * it for depth separation.
 */
export function HoloBust({ src, progress, bottom, width, motion, spin }: Props) {
  const loaded = useLoader(THREE.TextureLoader, src);

  // Configure a clone (shares the image data) so the cached loader result
  // is never mutated.
  const texture = useMemo(() => {
    const t = loaded.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, [loaded]);

  const img = texture.image as { width: number; height: number } | undefined;
  const aspect = img && img.width ? img.height / img.width : 1.4;
  const height = width * aspect;

  const group = useRef<THREE.Group>(null);
  const frontMat = useRef<THREE.ShaderMaterial>(null);
  const backMat = useRef<THREE.ShaderMaterial>(null);
  const frontUniforms = useMemo(() => makeUniforms(texture, 1.0), [texture]);
  const backUniforms = useMemo(() => makeUniforms(texture, 0.35), [texture]);

  useFrame(({ clock }) => {
    const p = progress.current;
    if (!p) return;
    const t = clock.elapsedTime;
    for (const m of [frontMat.current, backMat.current]) {
      if (!m) continue;
      m.uniforms.uTime.value = t;
      m.uniforms.uBuild.value = p.build;
      m.uniforms.uScan.value = p.scan;
      m.uniforms.uMotion.value = motion ? 1 : 0;
      m.uniforms.uIdle.value = p.idle;
    }
    const g = group.current;
    if (g) {
      // Slow float once idle
      g.position.y =
        bottom + (motion ? Math.sin(t * 0.9) * 0.03 * Math.min(1, p.idle) : 0);
      g.rotation.y = spin.current?.current ?? 0;
    }
  });

  const materialProps = {
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  };

  return (
    <group ref={group} position={[0, bottom, 0]}>
      <mesh position={[0.04, height / 2 + 0.02, -0.06]}>
        <planeGeometry args={[width, height, 1, 48]} />
        <shaderMaterial ref={backMat} uniforms={backUniforms} {...materialProps} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height, 1, 48]} />
        <shaderMaterial ref={frontMat} uniforms={frontUniforms} {...materialProps} />
      </mesh>
    </group>
  );
}
