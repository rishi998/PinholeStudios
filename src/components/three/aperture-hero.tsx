"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

function Iris({ open }: { open: number }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const x = state.pointer.x * 0.35;
    const y = state.pointer.y * 0.2;
    group.current.rotation.y += (x - group.current.rotation.y) * 0.08;
    group.current.rotation.x += (y - group.current.rotation.x) * 0.08;
    group.current.rotation.z += 0.002;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[1.55, 0.08, 24, 80]} />
        <meshPhysicalMaterial color="#e8a317" metalness={1} roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => {
        const angle = (index / 9) * Math.PI * 2;
        const radius = 0.72 + open * 0.45;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle + open]}>
            <boxGeometry args={[0.95, 0.16, 0.05]} />
            <meshPhysicalMaterial color="#ffb020" metalness={1} roughness={0.25} clearcoat={1} />
          </mesh>
        );
      })}
      <mesh>
        <circleGeometry args={[0.28 + open * 0.15, 48]} />
        <meshBasicMaterial color="#07060a" />
      </mesh>
      <pointLight position={[2, 2, 3]} intensity={20} color="#ffb020" />
      <ambientLight intensity={0.35} />
    </group>
  );
}

export function ApertureHero({ open = 0.2 }: { open?: number }) {
  return (
    <div className="h-full w-full bg-[radial-gradient(circle_at_50%_40%,#3a2412,transparent_55%),#07060a]">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#07060a"]} />
        <Iris open={open} />
      </Canvas>
    </div>
  );
}
