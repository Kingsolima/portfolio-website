"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Puck } from "./Puck";
import { Beam } from "./Beam";
import { HoloBust } from "./HoloBust";
import { phaseAt, progressAt, STILL, type Phase } from "./sequence";

export type HoloSceneProps = {
  portrait: string;
  /** Animate. False renders the finished hologram, still. */
  motion: boolean;
  /** Skip postprocessing and reduce particle count. */
  lowTier: boolean;
  /** Render loop runs only while visible. */
  active: boolean;
  /** Increment to (re)start the activation sequence. */
  replayToken: number;
  onPhase: (phase: Phase) => void;
  onReady: () => void;
};

const EMITTER_Y = 0.262;
const BUST_BOTTOM = 0.95;
const BUST_WIDTH = 1.75;
const BEAM_HEIGHT = 3.1;

/** Default export so `next/dynamic` can lazy-load the whole 3D bundle. */
export default function HoloScene(props: HoloSceneProps) {
  return (
    <Canvas
      dpr={props.lowTier ? 1 : [1, 1.75]}
      frameloop={props.active ? "always" : "never"}
      gl={{
        antialias: !props.lowTier,
        powerPreference: "high-performance",
        alpha: false,
      }}
      camera={{ position: [0, 2.05, 7.2], fov: 34, near: 0.1, far: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#0b0d0e"]} />
      <fog attach="fog" args={["#0b0d0e", 7, 13]} />
      <Suspense fallback={null}>
        <Stage {...props} />
      </Suspense>
    </Canvas>
  );
}

function Stage({
  portrait,
  motion,
  lowTier,
  replayToken,
  onPhase,
  onReady,
}: HoloSceneProps) {
  // Activation clock. null = standby.
  const startAt = useRef<number | null>(null);
  const lastPhase = useRef<Phase>("standby");
  const progress = useRef(motion ? progressAt(null) : STILL);
  const glow = useRef({ level: 0.4 });
  const spin = useRef({ target: 0, current: 0 });
  const clockRef = useRef(0);
  const readySent = useRef(false);
  // Set by a direct click on the puck before the wrapper's auto-start fires.
  const [clicked, setClicked] = useState(false);
  // Whether the bust has ever been activated (mounts the image plane).
  const started = !motion || replayToken > 0 || clicked;

  // Replay requests from the wrapper (initial auto-start included).
  useEffect(() => {
    if (!motion) return;
    if (replayToken === 0) return;
    startAt.current = clockRef.current;
  }, [replayToken, motion]);

  useFrame(({ clock, camera }) => {
    clockRef.current = clock.elapsedTime;
    if (!readySent.current) {
      readySent.current = true;
      onReady();
    }
    // Ease drag rotation toward its target.
    spin.current.current += (spin.current.target - spin.current.current) * 0.08;

    const t = startAt.current === null ? null : clock.elapsedTime - startAt.current;

    if (motion) {
      progress.current = progressAt(t);
      const phase = phaseAt(t);
      if (phase !== lastPhase.current) {
        lastPhase.current = phase;
        onPhase(phase);
      }
      // Emitter: faint standby pulse, big flash at activation, steady idle glow.
      const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.2);
      glow.current.level =
        t === null
          ? 0.25 + 0.2 * pulse
          : 0.9 + progress.current.flash * 2.6 + 0.12 * pulse;

      // Slow camera sway in idle for depth.
      const idle = Math.min(1, progress.current.idle / 3);
      camera.position.x = Math.sin(clock.elapsedTime * 0.18) * 0.22 * idle;
      camera.position.y = 2.05 + Math.sin(clock.elapsedTime * 0.13) * 0.06 * idle;
      camera.lookAt(0, 1.95, 0);
    } else {
      // Still scene: finished hologram, no motion, report idle once.
      glow.current.level = 1.0;
      camera.lookAt(0, 1.95, 0);
      if (lastPhase.current !== "idle") {
        lastPhase.current = "idle";
        onPhase("idle");
      }
    }
  });

  const activate = () => {
    if (!motion) return;
    startAt.current = clockRef.current;
    setClicked(true);
  };

  // Drag to rotate the bust, restrained to about ±25°.
  const dragging = useRef<{ x: number; start: number } | null>(null);
  const onDown = (e: { clientX: number; stopPropagation: () => void }) => {
    dragging.current = { x: e.clientX, start: spin.current.target };
  };
  const onMove = (e: { clientX: number }) => {
    const d = dragging.current;
    if (!d) return;
    spin.current.target = THREE.MathUtils.clamp(
      d.start + (e.clientX - d.x) * 0.005,
      -0.45,
      0.45,
    );
  };
  const onUp = () => {
    dragging.current = null;
  };

  return (
    <>
      {/* Lighting: low ambient, a warm rim key for the metal, cyan from the puck */}
      <ambientLight intensity={0.16} />
      <directionalLight
        position={[3.5, 4, 2.5]}
        intensity={1.3}
        color="#ffd9a8"
        castShadow={false}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.25} color="#8fb3ff" />
      <Environment resolution={128}>
        <Lightformer
          form="ring"
          intensity={2}
          color="#4fd1c5"
          position={[0, 3, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={3}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#ffe2b8"
          position={[4, 3, 3]}
          scale={[3, 1, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#9fb8ff"
          position={[-4, 2, -3]}
          scale={[3, 1, 1]}
        />
      </Environment>

      {/* Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#10141a" roughness={0.88} metalness={0.15} />
      </mesh>
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.75}
        scale={6}
        blur={2.4}
        far={1.6}
        color="#000000"
        frames={motion ? Infinity : 1}
      />

      <Puck glow={glow} onActivate={activate} />

      {/* Invisible drag surface over the projection */}
      <mesh
        position={[0, BUST_BOTTOM + 1.3, 0.1]}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClick={activate}
        visible={false}
      >
        <planeGeometry args={[2.4, 2.8]} />
      </mesh>

      <Beam progress={progress} base={EMITTER_Y} height={BEAM_HEIGHT} />

      {started ? (
        <Suspense fallback={null}>
          <HoloBust
            src={portrait}
            progress={progress}
            bottom={BUST_BOTTOM}
            width={BUST_WIDTH}
            motion={motion}
            spin={spin}
          />
        </Suspense>
      ) : null}

      {motion && started ? (
        <Sparkles
          count={lowTier ? 18 : 40}
          position={[0, 1.9, 0]}
          scale={[1.6, 2.6, 1.2]}
          size={lowTier ? 1.5 : 2.2}
          speed={0.25}
          opacity={0.55}
          color="#8fe9e0"
          noise={0.6}
        />
      ) : null}

      {!lowTier ? (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.22} darkness={0.72} />
        </EffectComposer>
      ) : null}
    </>
  );
}
