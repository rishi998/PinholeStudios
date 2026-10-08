"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { DoubleSide, type Vector3Tuple } from "three";

export const cameraPresets: Record<string, { label: string; position: Vector3Tuple; target: Vector3Tuple }> = {
  overview: { label: "Overview", position: [14, 8, 16], target: [0, 1, 0] },
  "empty-studio": { label: "Empty floor", position: [0, 3.2, 8], target: [0, 1.2, 0] },
  "green-screen-studio": { label: "Green screen", position: [-8, 3, 6], target: [-8, 1.4, -2] },
  "the-house-setup": { label: "House", position: [6, 3.4, 2], target: [8, 1, -1] },
  "white-cyclorama": { label: "Cyclorama", position: [0, 3, -8], target: [0, 1.2, -12] },
  "podcast-setup": { label: "Podcast", position: [8, 2.6, 8], target: [10, 1, 6] },
  "garden-area": { label: "Garden", position: [-6, 3, 12], target: [-8, 0.4, 10] },
  "lawn-area": { label: "Lawn", position: [4, 4, 14], target: [6, 0.3, 12] },
};

function Set({ hour }: { hour: "midday" | "golden" }) {
  const sun = hour === "golden" ? "#ff8a3d" : "#fff4d6";
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#2a2724" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.2, -2]}>
        <boxGeometry args={[6, 2.4, 4]} />
        <meshStandardMaterial color="#1a181c" roughness={0.8} />
      </mesh>
      <mesh position={[-8, 1.6, -1]}>
        <boxGeometry args={[4.5, 3.2, 3]} />
        <meshStandardMaterial color="#1f8a4c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.5, -12]}>
        <sphereGeometry args={[3.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.35} side={DoubleSide} />
      </mesh>
      <mesh position={[8.2, 0.8, -1]}>
        <boxGeometry args={[2.2, 1.6, 2]} />
        <meshStandardMaterial color="#c9842a" roughness={0.6} />
      </mesh>
      <mesh position={[10.2, 0.45, 6]}>
        <boxGeometry args={[2.4, 0.12, 1.1]} />
        <meshStandardMaterial color="#3a2a22" roughness={0.4} />
      </mesh>
      {[0, 1].map((index) => (
        <mesh key={index} position={[9.4 + index * 1.2, 0.9, 6]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[-8, 0.05, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 24]} />
        <meshStandardMaterial color="#1f6b3a" />
      </mesh>
      <mesh position={[6, 0.04, 12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 24]} />
        <meshStandardMaterial color="#3d8f4a" />
      </mesh>
      <directionalLight position={[8, 10, 6]} intensity={hour === "golden" ? 2.4 : 1.6} color={sun} castShadow />
      <ambientLight intensity={0.35} />
      <pointLight position={[-8, 3, -1]} intensity={8} color="#b6ffd0" />
      <ContactShadows opacity={0.45} scale={24} blur={2.4} far={6} />
      <fog attach="fog" args={["#07060a", 12, 32]} />
    </group>
  );
}

function Rig({ position, target }: { position: Vector3Tuple; target: Vector3Tuple }) {
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(target[0], target[1], target[2]);
  }, [camera, position, target]);
  return null;
}

export function StudioScene({
  studio = "overview",
  hour = "midday",
  className = "h-[420px]",
}: {
  studio?: string;
  hour?: "midday" | "golden";
  className?: string;
}) {
  const view = cameraPresets[studio] ?? cameraPresets.overview;
  if (!view) return null;

  return (
    <div className={`overflow-hidden rounded-3xl border border-border bg-card ${className}`} data-demo-preset={studio}>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: view.position, fov: 42 }} gl={{ antialias: true }}>
        <color attach="background" args={["#07060a"]} />
        <Rig position={view.position} target={view.target} />
        <Set hour={hour} />
      </Canvas>
    </div>
  );
}
