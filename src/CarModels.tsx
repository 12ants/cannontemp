import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial, PointLight, BoxGeometry, CylinderGeometry } from 'three';
import { debugData } from './store';

// Shared geometries and materials for performance
const sharedMaterials = {
  glass: new MeshStandardMaterial({ color: "#111111", roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.8 }),
  chrome: new MeshStandardMaterial({ color: "#e5e7eb", roughness: 0.1, metalness: 1.0 }),
  rubber: new MeshStandardMaterial({ color: "#111111", roughness: 0.9 }),
  sovietBody: new MeshStandardMaterial({ color: "#d4d4ce", roughness: 0.4, metalness: 0.2 }),
  euroBody: new MeshStandardMaterial({ color: "#fef08a", roughness: 0.3, metalness: 0.3 }),
  sportsBody: new MeshStandardMaterial({ color: "#f8fafc", roughness: 0.2, metalness: 0.6 }),
  muscleBody: new MeshStandardMaterial({ color: "#ef4444", roughness: 0.2, metalness: 0.5 }),
  volvoBody: new MeshStandardMaterial({ color: "#f8fafc", roughness: 0.3, metalness: 0.4 }),
  grille: new MeshStandardMaterial({ color: "#111111", roughness: 0.8, metalness: 0.5 }),
  interior: new MeshStandardMaterial({ color: "#27272a", roughness: 0.9 }),
};

function BrakeLight({ position, args, geometry: Geometry = 'boxGeometry', rotation }: any) {
  const materialRef = useRef<MeshStandardMaterial>(null);
  const lightRef = useRef<PointLight>(null);
  
  useFrame(() => {
    const isBraking = debugData.isBraking;
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = isBraking ? 4 : 0.5;
    }
    if (lightRef.current) {
      lightRef.current.intensity = isBraking ? 2 : 0;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        {Geometry === 'boxGeometry' ? <boxGeometry args={args} /> : <cylinderGeometry args={args} />}
        <meshStandardMaterial ref={materialRef} color="#dc2626" emissive="#ff0000" toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} color="#ff0000" distance={3} intensity={0} position={[0, 0, -0.2]} />
    </group>
  );
}

function HeadLight({ position, args, geometry: Geometry = 'boxGeometry', rotation }: any) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        {Geometry === 'boxGeometry' ? <boxGeometry args={args} /> : <cylinderGeometry args={args} />}
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight color="#ffffff" distance={10} intensity={1} position={[0, 0, 0.2]} />
    </group>
  );
}

function CarInterior({ position, color = "#27272a" }: { position: [number, number, number], color?: string }) {
  const steeringWheelRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    // Animate steering wheel based on input
    const steering = debugData.steering; // -1 to 1
    if (steeringWheelRef.current) {
      steeringWheelRef.current.rotation.z = -steering * Math.PI * 0.8;
    }
    
    // Animate driver arms to follow steering wheel
    if (leftArmRef.current && rightArmRef.current) {
      // Base rotation
      leftArmRef.current.rotation.set(-Math.PI / 4, 0, Math.PI / 8);
      rightArmRef.current.rotation.set(-Math.PI / 4, 0, -Math.PI / 8);
      
      // Add steering offset
      leftArmRef.current.rotation.x += steering * 0.2;
      leftArmRef.current.rotation.z += steering * 0.3;
      
      rightArmRef.current.rotation.x -= steering * 0.2;
      rightArmRef.current.rotation.z += steering * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Dashboard Base */}
      <mesh position={[0, 0.1, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.25, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      
      {/* Instrument Cluster Binnacle */}
      <mesh position={[0.3, 0.25, 0.55]} rotation={[-Math.PI / 12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.15, 0.15]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      
      {/* Dials (Speedometer & Tachometer) */}
      <mesh position={[0.25, 0.25, 0.47]} rotation={[Math.PI / 2 - Math.PI / 12, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.35, 0.25, 0.47]} rotation={[Math.PI / 2 - Math.PI / 12, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
      </mesh>

      {/* Center Infotainment Screen */}
      <mesh position={[0, 0.2, 0.48]} rotation={[-Math.PI / 16, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.12, 0.02]} />
        <meshStandardMaterial color="#000000" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.47]} rotation={[-Math.PI / 16, 0, 0]}>
        <planeGeometry args={[0.18, 0.1]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>

      {/* AC Vents */}
      <mesh position={[-0.15, 0.2, 0.48]} rotation={[-Math.PI / 16, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.04, 0.02]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.15, 0.2, 0.48]} rotation={[-Math.PI / 16, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.04, 0.02]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Center Console */}
      <mesh position={[0, -0.05, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.15, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      
      {/* Gear Shifter */}
      <group position={[0, 0.1, 0.2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.015, 0.02, 0.15, 8]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.5} />
        </mesh>
        {/* Shifter Boot */}
        <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.06, 0.08, 8]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>

      {/* Steering Column */}
      <mesh position={[0.3, 0.15, 0.4]} rotation={[Math.PI / 6, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      
      {/* Steering Wheel Group (Animated) */}
      <group position={[0.3, 0.25, 0.25]} rotation={[Math.PI / 3, 0, 0]} ref={steeringWheelRef}>
        {/* Rim */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[0.16, 0.025, 16, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.8} />
        </mesh>
        {/* Center Hub */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Spokes */}
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.6} />
        </mesh>
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.6} />
        </mesh>
        <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.6} />
        </mesh>
      </group>

      {/* Driver Seat */}
      <mesh position={[0.3, -0.1, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.15, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.25, -0.4]} rotation={[-Math.PI / 12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.6, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Headrest */}
      <mesh position={[0.3, 0.6, -0.45]} rotation={[-Math.PI / 12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.15, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Passenger Seat */}
      <mesh position={[-0.3, -0.1, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.15, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.25, -0.4]} rotation={[-Math.PI / 12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.6, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.6, -0.45]} rotation={[-Math.PI / 12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.15, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Driver (Detailed) */}
      <group position={[0.3, 0.1, -0.2]}>
        {/* Torso */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.45, 0.2]} />
          <meshStandardMaterial color="#1e40af" /> {/* Dark Blue jacket */}
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>

        {/* Head */}
        <group position={[0, 0.55, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#fcd34d" /> {/* Skin tone */}
          </mesh>
          {/* Hair / Cap */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
            <meshStandardMaterial color="#b91c1c" /> {/* Red cap */}
          </mesh>
          {/* Cap Brim */}
          <mesh position={[0, 0.05, 0.1]} rotation={[0.1, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.02, 0.15]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
          {/* Sunglasses */}
          <mesh position={[0, 0, 0.11]} castShadow receiveShadow>
            <boxGeometry args={[0.18, 0.05, 0.02]} />
            <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.8} />
          </mesh>
        </group>

        {/* Left Arm */}
        <mesh ref={leftArmRef} position={[-0.22, 0.2, 0.15]} castShadow receiveShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#1e40af" />
          {/* Hand */}
          <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        </mesh>

        {/* Right Arm */}
        <mesh ref={rightArmRef} position={[0.22, 0.2, 0.15]} castShadow receiveShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#1e40af" />
          {/* Hand */}
          <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        </mesh>
      </group>
    </group>
  );
}

export function SovietClassic() {
  return (
    <>
      {/* Main Body */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow material={sharedMaterials.sovietBody}>
        <boxGeometry args={[1.65, 0.45, 4.1]} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.25, -0.2]} castShadow receiveShadow material={sharedMaterials.sovietBody}>
        <boxGeometry args={[1.35, 0.45, 1.8]} />
      </mesh>
      {/* Interior */}
      <CarInterior position={[0, 0.1, -0.2]} color="#1f2937" />
      {/* Windows */}
      <mesh position={[0, 0.25, -0.2]} castShadow receiveShadow material={sharedMaterials.glass}>
        <boxGeometry args={[1.4, 0.35, 1.85]} />
      </mesh>
      {/* Grille */}
      <mesh position={[0, -0.15, 2.06]} castShadow receiveShadow material={sharedMaterials.grille}>
        <boxGeometry args={[1.2, 0.25, 0.05]} />
      </mesh>
      {/* Headlights (Round) */}
      <HeadLight position={[0.5, -0.15, 2.08]} rotation={[Math.PI / 2, 0, 0]} args={[0.12, 0.12, 0.05, 16]} geometry="cylinderGeometry" />
      <HeadLight position={[-0.5, -0.15, 2.08]} rotation={[Math.PI / 2, 0, 0]} args={[0.12, 0.12, 0.05, 16]} geometry="cylinderGeometry" />
      {/* Chrome Bumpers */}
      <mesh position={[0, -0.35, 2.1]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.7, 0.1, 0.15]} />
      </mesh>
      <mesh position={[0, -0.35, -2.1]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.7, 0.1, 0.15]} />
      </mesh>
      {/* Taillights */}
      <BrakeLight position={[0.6, -0.15, -2.06]} args={[0.2, 0.4, 0.05]} />
      <BrakeLight position={[-0.6, -0.15, -2.06]} args={[0.2, 0.4, 0.05]} />
      {/* Side Mirrors */}
      <mesh position={[0.7, 0.2, 0.4]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[0.15, 0.15, 0.1]} />
      </mesh>
      <mesh position={[-0.7, 0.2, 0.4]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[0.15, 0.15, 0.1]} />
      </mesh>
    </>
  );
}

export function EuroCompact() {
  return (
    <>
      {/* Main Body */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow material={sharedMaterials.euroBody}>
        <boxGeometry args={[1.5, 0.4, 3.2]} />
      </mesh>
      {/* Cabin (Rounded) */}
      <mesh position={[0, 0.2, -0.1]} castShadow receiveShadow material={sharedMaterials.euroBody}>
        <boxGeometry args={[1.2, 0.4, 1.5]} />
      </mesh>
      {/* Interior */}
      <CarInterior position={[0, 0.1, -0.1]} color="#374151" />
      {/* Windows */}
      <mesh position={[0, 0.2, -0.1]} castShadow receiveShadow material={sharedMaterials.glass}>
        <boxGeometry args={[1.25, 0.3, 1.55]} />
      </mesh>
      {/* Grille */}
      <mesh position={[0, -0.15, 1.61]} castShadow receiveShadow material={sharedMaterials.grille}>
        <boxGeometry args={[0.6, 0.2, 0.05]} />
      </mesh>
      {/* Headlights (Round) */}
      <HeadLight position={[0.45, -0.1, 1.6]} rotation={[Math.PI / 2, 0, 0]} args={[0.15, 0.15, 0.05, 16]} geometry="cylinderGeometry" />
      <HeadLight position={[-0.45, -0.1, 1.6]} rotation={[Math.PI / 2, 0, 0]} args={[0.15, 0.15, 0.05, 16]} geometry="cylinderGeometry" />
      {/* Chrome Bumpers */}
      <mesh position={[0, -0.35, 1.65]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.4, 0.08, 0.1]} />
      </mesh>
      <mesh position={[0, -0.35, -1.65]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.4, 0.08, 0.1]} />
      </mesh>
      {/* Taillights */}
      <BrakeLight position={[0.5, -0.15, -1.61]} args={[0.15, 0.2, 0.05]} />
      <BrakeLight position={[-0.5, -0.15, -1.61]} args={[0.15, 0.2, 0.05]} />
    </>
  );
}
export function Volvo140() {
  return (
    <>
      {/* Lower Body */}
      <mesh position={[0, -0.25, 0]} castShadow receiveShadow material={sharedMaterials.volvoBody}>
        <boxGeometry args={[1.7, 0.5, 4]} />
      </mesh>
      {/* Black Trim Line */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow material={sharedMaterials.rubber}>
        <boxGeometry args={[1.72, 0.05, 4.02]} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.25, -0.2]} castShadow receiveShadow material={sharedMaterials.volvoBody}>
        <boxGeometry args={[1.4, 0.5, 2]} />
      </mesh>
      {/* Interior (visible through glass) */}
      <CarInterior position={[0, 0.1, -0.2]} color="#4b5563" />
      {/* Windows (Inner dark block) */}
      <mesh position={[0, 0.25, -0.2]} castShadow receiveShadow material={sharedMaterials.glass}>
        <boxGeometry args={[1.45, 0.4, 2.05]} />
      </mesh>
      {/* Front Grille */}
      <mesh position={[0, -0.15, 2.01]} castShadow receiveShadow material={sharedMaterials.grille}>
        <boxGeometry args={[0.8, 0.25, 0.1]} />
      </mesh>
      {/* Headlights */}
      <HeadLight position={[0.6, -0.15, 2.01]} args={[0.25, 0.25, 0.1]} />
      <HeadLight position={[-0.6, -0.15, 2.01]} args={[0.25, 0.25, 0.1]} />
      {/* Bumpers */}
      <mesh position={[0, -0.4, 2.05]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.8, 0.15, 0.2]} />
      </mesh>
      <mesh position={[0, -0.4, -2.05]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.8, 0.15, 0.2]} />
      </mesh>
      {/* Taillights */}
      <BrakeLight position={[0.6, -0.15, -2.01]} args={[0.3, 0.3, 0.1]} />
      <BrakeLight position={[-0.6, -0.15, -2.01]} args={[0.3, 0.3, 0.1]} />
      {/* Roof Rack */}
      <mesh position={[0, 0.52, 0.2]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.4, 0.05, 0.05]} />
      </mesh>
      <mesh position={[0, 0.52, -0.5]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.4, 0.05, 0.05]} />
      </mesh>
      {/* Side Mirrors */}
      <mesh position={[0.75, 0.2, 0.4]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
      </mesh>
      <mesh position={[-0.75, 0.2, 0.4]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
      </mesh>
      {/* Exhaust */}
      <mesh position={[0.6, -0.4, -2.1]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
      </mesh>
      {/* License Plates */}
      <mesh position={[0, -0.3, 2.16]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.15, 0.02]} />
        <meshStandardMaterial color="#eab308" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.3, -2.16]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.15, 0.02]} />
        <meshStandardMaterial color="#eab308" roughness={0.5} />
      </mesh>
      {/* Door Handles */}
      <mesh position={[0.86, 0.05, 0.2]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[0.05, 0.05, 0.2]} />
      </mesh>
      <mesh position={[-0.86, 0.05, 0.2]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[0.05, 0.05, 0.2]} />
      </mesh>
    </>
  );
}

export function SportsCar80s() {
  return (
    <>
      {/* Main Body (Wedge) */}
      <mesh position={[0, -0.2, 0.1]} castShadow receiveShadow material={sharedMaterials.sportsBody}>
        <boxGeometry args={[1.8, 0.3, 4.2]} />
      </mesh>
      {/* Black Trim */}
      <mesh position={[0, -0.2, 0.1]} castShadow receiveShadow material={sharedMaterials.rubber}>
        <boxGeometry args={[1.82, 0.05, 4.22]} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.1, -0.4]} castShadow receiveShadow material={sharedMaterials.sportsBody}>
        <boxGeometry args={[1.4, 0.35, 1.8]} />
      </mesh>
      {/* Interior */}
      <CarInterior position={[0, 0.0, -0.4]} color="#111827" />
      {/* Windows */}
      <mesh position={[0, 0.1, -0.4]} castShadow receiveShadow material={sharedMaterials.glass}>
        <boxGeometry args={[1.45, 0.3, 1.85]} />
      </mesh>
      {/* Pop-up Headlights */}
      <mesh position={[0.6, -0.05, 2.0]} castShadow receiveShadow material={sharedMaterials.sportsBody}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
      </mesh>
      <mesh position={[-0.6, -0.05, 2.0]} castShadow receiveShadow material={sharedMaterials.sportsBody}>
        <boxGeometry args={[0.3, 0.1, 0.2]} />
      </mesh>
      <HeadLight position={[0.6, -0.05, 2.11]} args={[0.25, 0.05, 0.05]} />
      <HeadLight position={[-0.6, -0.05, 2.11]} args={[0.25, 0.05, 0.05]} />
      {/* Spoiler */}
      <mesh position={[0, 0.2, -1.9]} castShadow receiveShadow material={sharedMaterials.sportsBody}>
        <boxGeometry args={[1.7, 0.05, 0.4]} />
      </mesh>
      <mesh position={[0.7, 0.0, -1.9]} castShadow receiveShadow material={sharedMaterials.sportsBody}>
        <boxGeometry args={[0.05, 0.4, 0.3]} />
      </mesh>
      <mesh position={[-0.7, 0.0, -1.9]} castShadow receiveShadow material={sharedMaterials.sportsBody}>
        <boxGeometry args={[0.05, 0.4, 0.3]} />
      </mesh>
      {/* Taillights (Full width strip) */}
      <BrakeLight position={[0, -0.15, -2.01]} args={[1.6, 0.15, 0.1]} />
      {/* Exhaust */}
      <mesh position={[0.3, -0.35, -2.05]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
      </mesh>
      <mesh position={[-0.3, -0.35, -2.05]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
      </mesh>
    </>
  );
}

export function MuscleCar60s() {
  return (
    <>
      {/* Main Body */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow material={sharedMaterials.muscleBody}>
        <boxGeometry args={[1.75, 0.45, 4.4]} />
      </mesh>
      {/* Racing Stripes */}
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.46, 4.41]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.2, -0.3]} castShadow receiveShadow material={sharedMaterials.muscleBody}>
        <boxGeometry args={[1.4, 0.35, 1.6]} />
      </mesh>
      {/* Interior */}
      <CarInterior position={[0, 0.1, -0.3]} color="#000000" />
      {/* Windows */}
      <mesh position={[0, 0.2, -0.3]} castShadow receiveShadow material={sharedMaterials.glass}>
        <boxGeometry args={[1.45, 0.25, 1.65]} />
      </mesh>
      {/* Engine Blower */}
      <mesh position={[0, 0.15, 1.2]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
      </mesh>
      <mesh position={[0, 0.25, 1.2]} castShadow receiveShadow material={sharedMaterials.grille}>
        <boxGeometry args={[0.2, 0.1, 0.4]} />
      </mesh>
      {/* Front Grille */}
      <mesh position={[0, -0.15, 2.21]} castShadow receiveShadow material={sharedMaterials.grille}>
        <boxGeometry args={[1.6, 0.25, 0.1]} />
      </mesh>
      {/* Headlights (Round) */}
      <HeadLight position={[0.6, -0.15, 2.22]} rotation={[Math.PI / 2, 0, 0]} args={[0.1, 0.1, 0.1, 16]} geometry="cylinderGeometry" />
      <HeadLight position={[-0.6, -0.15, 2.22]} rotation={[Math.PI / 2, 0, 0]} args={[0.1, 0.1, 0.1, 16]} geometry="cylinderGeometry" />
      {/* Bumpers */}
      <mesh position={[0, -0.35, 2.25]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.8, 0.15, 0.2]} />
      </mesh>
      <mesh position={[0, -0.35, -2.25]} castShadow receiveShadow material={sharedMaterials.chrome}>
        <boxGeometry args={[1.8, 0.15, 0.2]} />
      </mesh>
      {/* Taillights */}
      <BrakeLight position={[0.6, -0.15, -2.21]} args={[0.4, 0.15, 0.1]} />
      <BrakeLight position={[-0.6, -0.15, -2.21]} args={[0.4, 0.15, 0.1]} />
    </>
  );
}
