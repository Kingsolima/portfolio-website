"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TEAL = new THREE.Color("#4fd1c5");
const WHITE = new THREE.Color("#ffffff");

type Props = {
  /** Emitter brightness driver, read every frame. */
  glow: React.RefObject<{ level: number }>;
  onActivate?: () => void;
};

/**
 * Original, Mandalorian-inspired tracking puck: a squat beveled disc in
 * dark gunmetal with a brushed light-metal rim, panel seams, four lugs and a
 * recessed cyan emitter. All geometry and surface maps are procedural, so
 * there is no model file and nothing to license.
 */
export function Puck({ glow, onActivate }: Props) {
  const maps = useMemo(() => makeSurfaceMaps(), []);
  const emitterMat = useRef<THREE.MeshBasicMaterial>(null);
  const rimMat = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const level = glow.current?.level ?? 0.4;
    if (emitterMat.current) {
      emitterMat.current.color.copy(TEAL).lerp(WHITE, Math.min(1, level * 0.35));
      emitterMat.current.opacity = Math.min(1, 0.55 + level * 0.5);
    }
    if (rimMat.current) rimMat.current.opacity = Math.min(1, 0.4 + level * 0.6);
    if (light.current) light.current.intensity = 1.5 + level * 9;
  });

  return (
    <group onClick={onActivate}>
      {/* Body: dark gunmetal with seams and wear */}
      <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.98, 1.0, 0.26, 96]} />
        <meshPhysicalMaterial
          color="#343c43"
          metalness={0.9}
          roughness={0.38}
          roughnessMap={maps.roughness}
          bumpMap={maps.bump}
          bumpScale={0.012}
          clearcoat={0.25}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* Top bevel ring: brushed light metal */}
      <mesh position={[0, 0.262, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.93, 0.055, 24, 128]} />
        <meshStandardMaterial
          color="#aeb6bd"
          metalness={1}
          roughness={0.24}
          roughnessMap={maps.brushed}
        />
      </mesh>

      {/* Side groove */}
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.012, 8, 128]} />
        <meshStandardMaterial color="#0b0e10" metalness={0.8} roughness={0.6} />
      </mesh>

      {/* Lugs at the rim */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.78, 0.275, Math.sin(a) * 0.78]}
          >
            <cylinderGeometry args={[0.045, 0.05, 0.03, 24]} />
            <meshStandardMaterial color="#8f989f" metalness={1} roughness={0.3} />
          </mesh>
        );
      })}

      {/* Recess around the emitter */}
      <mesh position={[0, 0.245, 0]}>
        <cylinderGeometry args={[0.44, 0.4, 0.05, 64]} />
        <meshStandardMaterial color="#05080a" metalness={0.6} roughness={0.7} />
      </mesh>

      {/* Emitter lens */}
      <mesh position={[0, 0.236, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.36, 64]} />
        <meshBasicMaterial
          ref={emitterMat}
          color={TEAL}
          transparent
          toneMapped={false}
        />
      </mesh>

      {/* Emitter rim light */}
      <mesh position={[0, 0.262, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.014, 12, 96]} />
        <meshBasicMaterial ref={rimMat} color={TEAL} transparent toneMapped={false} />
      </mesh>

      {/* Cyan spill onto the puck and surface */}
      <pointLight
        ref={light}
        position={[0, 0.55, 0]}
        color={TEAL}
        distance={4.5}
        decay={2}
        intensity={2}
      />
    </group>
  );
}

/**
 * Procedural surface maps drawn on 2D canvases: a roughness map with
 * radial wear, a bump map with panel seams, and a brushed map for the rim.
 */
function makeSurfaceMaps() {
  const size = 512;

  const rough = document.createElement("canvas");
  rough.width = rough.height = size;
  const rc = rough.getContext("2d")!;
  rc.fillStyle = "#8a8a8a";
  rc.fillRect(0, 0, size, size);
  // Noise speckle for micro-wear
  for (let i = 0; i < 9000; i++) {
    const v = 110 + Math.floor(Math.random() * 90);
    rc.fillStyle = `rgb(${v},${v},${v})`;
    rc.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1);
  }
  // A few scuffs
  rc.strokeStyle = "rgba(220,220,220,0.35)";
  rc.lineWidth = 1;
  for (let i = 0; i < 14; i++) {
    rc.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    rc.moveTo(x, y);
    rc.lineTo(x + (Math.random() - 0.5) * 80, y + (Math.random() - 0.5) * 8);
    rc.stroke();
  }

  const bump = document.createElement("canvas");
  bump.width = bump.height = size;
  const bc = bump.getContext("2d")!;
  bc.fillStyle = "#808080";
  bc.fillRect(0, 0, size, size);
  // Panel seams: vertical lines around the cylinder wall (u axis)
  bc.strokeStyle = "#2a2a2a";
  bc.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const x = (i / 6) * size + 20;
    bc.beginPath();
    bc.moveTo(x, 0);
    bc.lineTo(x, size);
    bc.stroke();
  }
  // Horizontal seam band
  bc.beginPath();
  bc.moveTo(0, size * 0.62);
  bc.lineTo(size, size * 0.62);
  bc.stroke();
  // Small rivets along the band
  bc.fillStyle = "#d0d0d0";
  for (let i = 0; i < 12; i++) {
    bc.beginPath();
    bc.arc((i / 12) * size + 12, size * 0.62, 4, 0, Math.PI * 2);
    bc.fill();
  }

  const brushed = document.createElement("canvas");
  brushed.width = size;
  brushed.height = 64;
  const kc = brushed.getContext("2d")!;
  kc.fillStyle = "#666";
  kc.fillRect(0, 0, size, 64);
  for (let i = 0; i < 2500; i++) {
    const v = 70 + Math.floor(Math.random() * 90);
    kc.fillStyle = `rgb(${v},${v},${v})`;
    kc.fillRect(Math.random() * size, Math.random() * 64, 6 + Math.random() * 30, 1);
  }

  const mk = (c: HTMLCanvasElement, repeatX = 1) => {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, 1);
    t.anisotropy = 4;
    return t;
  };
  return { roughness: mk(rough), bump: mk(bump), brushed: mk(brushed, 3) };
}
