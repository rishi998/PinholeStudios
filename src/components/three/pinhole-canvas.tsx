"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";

export type SceneKind = "aperture" | "stage" | "room";

function Aperture({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (paused || !group.current) return;
    group.current.rotation.z += delta * 0.22;
  });

  return (
    <group ref={group}>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[0.95, 0.14, 0.05]} />
            <meshStandardMaterial color="#e8a317" metalness={0.65} roughness={0.28} />
          </mesh>
        );
      })}
      <mesh>
        <circleGeometry args={[0.42, 48]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function Volumes({ paused, color }: { paused: boolean; color: string }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (paused || !group.current) return;
    group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      <Float speed={paused ? 0 : 1.2} floatIntensity={paused ? 0 : 0.5} rotationIntensity={paused ? 0 : 0.2}>
        <mesh position={[-0.7, 0.15, 0]}>
          <boxGeometry args={[1.15, 0.72, 0.72]} />
          <meshStandardMaterial color={color} metalness={0.25} roughness={0.42} />
        </mesh>
      </Float>
      <mesh position={[0.95, -0.15, -0.35]}>
        <boxGeometry args={[0.62, 1.05, 0.5]} />
        <meshStandardMaterial color="#1b1b1b" metalness={0.45} roughness={0.38} />
      </mesh>
    </group>
  );
}

function Room({ paused }: { paused: boolean }) {
  const pin = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (paused || !pin.current) return;
    pin.current.position.y = 0.55 + Math.sin(clock.elapsedTime * 2) * 0.08;
  });

  return (
    <group>
      <mesh position={[0, 0.1, -1.15]}>
        <boxGeometry args={[3.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#16301f" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial color="#2a2418" />
      </mesh>
      <mesh ref={pin} position={[-0.7, 0.55, -0.95]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#e8a317" emissive="#e8a317" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.75, 0.25, -0.95]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#e8a317" emissive="#e8a317" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

export function PinholeCanvas({
  kind = "aperture",
  color = "#c9842a",
  className,
}: {
  kind?: SceneKind;
  color?: string;
  className?: string;
}) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const apply = () => setPaused(motion.matches || Boolean(saveData));
    apply();
    motion.addEventListener("change", apply);
    return () => motion.removeEventListener("change", apply);
  }, []);

  return (
    <div className={`relative bg-[radial-gradient(circle_at_28%_18%,#7a4e16,transparent_42%),linear-gradient(165deg,#2c1d12_0%,#120e0b_55%,#1a241c_100%)] ${className ?? ""}`}>
      <Canvas
        aria-label="Animated studio graphic"
        camera={{ position: [0, 0.2, 4.4], fov: 42 }}
        className="pointer-events-none h-full! w-full!"
        dpr={[1, 1.5]}
        frameloop={paused ? "demand" : "always"}
        gl={{ antialias: true, alpha: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#1a140e"]} />
        <mesh position={[0, 0, -2.6]}>
          <planeGeometry args={[16, 9]} />
          <meshBasicMaterial color="#2a1b10" />
        </mesh>
        <gridHelper args={[14, 14, "#e8a317", "#4a3422"]} position={[0, -1.45, 0]} />
        <ambientLight intensity={0.55} />
        <pointLight position={[2.2, 1.8, 3]} intensity={22} color="#f0b429" />
        <pointLight position={[-2, -1, 2]} intensity={8} color="#fff4d6" />
        {kind === "aperture" ? <Aperture paused={paused} /> : null}
        {kind === "stage" ? <Volumes paused={paused} color={color} /> : null}
        {kind === "room" ? <Room paused={paused} /> : null}
      </Canvas>
    </div>
  );
}
