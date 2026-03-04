import { useBox, useCylinder, useCompoundBody } from '@react-three/cannon';
import { useRef, useMemo } from 'react';
import { Mesh, Group, CanvasTexture, RepeatWrapping } from 'three';

import { useFrame } from '@react-three/fiber';

export function Ramp({ position, rotation, args = [10, 2, 10], color = '#444' }: any) {
  const [ref] = useBox(
    () => ({
      type: 'Static',
      position,
      rotation,
      args,
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function SpeedBump({ position, width = 8, radius = 0.3 }: any) {
  const [ref] = useCylinder(
    () => ({
      type: 'Static',
      position,
      rotation: [0, 0, Math.PI / 2],
      args: [radius, radius, width, 16],
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, width, 16]} />
      <meshStandardMaterial color="#eab308" />
    </mesh>
  );
}

export function Platform({ position, args = [10, 2, 10], color = '#333' }: any) {
  const [ref] = useBox(
    () => ({
      type: 'Static',
      position,
      args,
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function Tunnel({ position = [0, 0, 0], rotation = [0, 0, 0], length = 20, width = 8, height = 4, color = '#3f3f46' }: any) {
  const wallThickness = 1;
  const roofThickness = 1;

  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [-width / 2 - wallThickness / 2, height / 2, 0], args: [wallThickness, height, length] },
        { type: 'Box', position: [width / 2 + wallThickness / 2, height / 2, 0], args: [wallThickness, height, length] },
        { type: 'Box', position: [0, height + roofThickness / 2, 0], args: [width + wallThickness * 2, roofThickness, length] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[-width / 2 - wallThickness / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, length]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[width / 2 + wallThickness / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, height, length]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, height + roofThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + wallThickness * 2, roofThickness, length]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <pointLight position={[0, height - 0.5, 0]} intensity={2} distance={15} color="#fbbf24" />
      <pointLight position={[0, height - 0.5, length / 3]} intensity={2} distance={15} color="#fbbf24" />
      <pointLight position={[0, height - 0.5, -length / 3]} intensity={2} distance={15} color="#fbbf24" />
    </group>
  );
}

export function Bridge({ position = [0, 0, 0], rotation = [0, 0, 0], length = 30, width = 10, height = 5, color = '#52525b' }: any) {
  const deckThickness = 0.5;
  const railHeight = 1;
  const railThickness = 0.5;

  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [0, height, 0], args: [width, deckThickness, length] },
        { type: 'Box', position: [-width / 2 + railThickness / 2, height + railHeight / 2 + deckThickness / 2, 0], args: [railThickness, railHeight, length] },
        { type: 'Box', position: [width / 2 - railThickness / 2, height + railHeight / 2 + deckThickness / 2, 0], args: [railThickness, railHeight, length] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, height, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, deckThickness, length]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-width / 2 + railThickness / 2, height + railHeight / 2 + deckThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railThickness, railHeight, length]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[width / 2 - railThickness / 2, height + railHeight / 2 + deckThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[railThickness, railHeight, length]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-width / 2 + 1, height / 2, length / 3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, height]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>
      <mesh position={[width / 2 - 1, height / 2, length / 3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, height]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>
      <mesh position={[-width / 2 + 1, height / 2, -length / 3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, height]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>
      <mesh position={[width / 2 - 1, height / 2, -length / 3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, height]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>
    </group>
  );
}

export function Tree({ position, scale = 1 }: any) {
  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      shapes: [
        { type: 'Cylinder', position: [0, 1 * scale, 0], args: [0.2 * scale, 0.2 * scale, 2 * scale, 8] },
        { type: 'Sphere', position: [0, 2.5 * scale, 0], args: [1.5 * scale] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, 1 * scale, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 2 * scale, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 2.5 * scale, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.5 * scale, 16, 16]} />
        <meshStandardMaterial color="#065f46" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function House({ position, rotation = [0, 0, 0], color = '#fef3c7', roofColor = '#7f1d1d' }: any) {
  const lightRef1 = useRef<any>(null);
  const lightRef2 = useRef<any>(null);
  const windowRef1 = useRef<any>(null);
  const windowRef2 = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycleT = t * 0.05;
    const sunY = Math.sin(cycleT) * 500;
    const nightFactor = Math.max(0, Math.min(1, (50 - sunY) / 50));

    const flicker = Math.sin(t * 10) * 0.1 + Math.sin(t * 25) * 0.05;
    const targetIntensity = nightFactor * (0.5 + flicker);

    if (lightRef1.current) lightRef1.current.intensity = targetIntensity;
    if (lightRef2.current) lightRef2.current.intensity = targetIntensity;
    if (windowRef1.current) windowRef1.current.emissiveIntensity = nightFactor * 1.5;
    if (windowRef2.current) windowRef2.current.emissiveIntensity = nightFactor * 1.5;
  });

  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [0, 2.5, 0], args: [8, 5, 6] },
        { type: 'Box', position: [0, 6, 0], args: [8.5, 2, 6.5] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 5, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 6.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0, 6, 3, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
      <mesh position={[0, 1.5, 3.01]} castShadow receiveShadow>
        <planeGeometry args={[1.5, 3]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Glowing Windows */}
      <mesh position={[-2, 2.5, 3.01]} castShadow receiveShadow>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial ref={windowRef1} color="#fde047" emissive="#fde047" emissiveIntensity={0} />
      </mesh>
      <pointLight ref={lightRef1} position={[-2, 2.5, 3.5]} intensity={0} distance={10} color="#fde047" />
      
      <mesh position={[2, 2.5, 3.01]} castShadow receiveShadow>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial ref={windowRef2} color="#fde047" emissive="#fde047" emissiveIntensity={0} />
      </mesh>
      <pointLight ref={lightRef2} position={[2, 2.5, 3.5]} intensity={0} distance={10} color="#fde047" />
    </group>
  );
}

export function Tavern({ position, rotation = [0, 0, 0] }: any) {
  const lightRef1 = useRef<any>(null);
  const lightRef2 = useRef<any>(null);
  const exteriorLightRef = useRef<any>(null);
  const windowRef1 = useRef<any>(null);
  const windowRef2 = useRef<any>(null);
  const exteriorLanternRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycleT = t * 0.05;
    const sunY = Math.sin(cycleT) * 500;
    const nightFactor = Math.max(0, Math.min(1, (50 - sunY) / 50));

    const flicker = Math.sin(t * 8) * 0.2 + Math.sin(t * 18) * 0.1;
    
    if (lightRef1.current) lightRef1.current.intensity = nightFactor * (1 + flicker);
    if (lightRef2.current) lightRef2.current.intensity = nightFactor * (1 + flicker);
    if (exteriorLightRef.current) exteriorLightRef.current.intensity = nightFactor * (1.5 + flicker * 0.5);
    
    if (windowRef1.current) windowRef1.current.emissiveIntensity = nightFactor * 1.5;
    if (windowRef2.current) windowRef2.current.emissiveIntensity = nightFactor * 1.5;
    if (exteriorLanternRef.current) exteriorLanternRef.current.emissiveIntensity = nightFactor * 2;
  });

  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [0, 4, 0], args: [14, 8, 10] },
        { type: 'Box', position: [0, 9, 0], args: [15, 3, 11] }, // Roof
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 8, 10]} />
        <meshStandardMaterial color="#78350f" /> {/* Dark wood */}
      </mesh>
      <mesh position={[0, 9, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0, 8, 4, 4]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      {/* Warm windows */}
      <mesh position={[-3, 3, 5.01]} castShadow>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial ref={windowRef1} color="#fde047" emissive="#fde047" emissiveIntensity={0} />
      </mesh>
      <pointLight ref={lightRef1} position={[-3, 3, 6]} intensity={0} distance={15} color="#fde047" />
      
      <mesh position={[3, 3, 5.01]} castShadow>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial ref={windowRef2} color="#fde047" emissive="#fde047" emissiveIntensity={0} />
      </mesh>
      <pointLight ref={lightRef2} position={[3, 3, 6]} intensity={0} distance={15} color="#fde047" />
      
      {/* Exterior Lantern */}
      <mesh position={[0, 4.5, 5.5]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial ref={exteriorLanternRef} color="#f97316" emissive="#f97316" emissiveIntensity={0} />
      </mesh>
      <pointLight ref={exteriorLightRef} position={[0, 4.5, 6]} intensity={0} distance={20} color="#f97316" />

      {/* Door */}
      <mesh position={[0, 2, 5.01]} castShadow>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
    </group>
  );
}

export function Barn({ position, rotation = [0, 0, 0] }: any) {
  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [0, 4, 0], args: [16, 8, 20] },
        { type: 'Box', position: [0, 10, 0], args: [16, 4, 20] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 8, 20]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0, 10, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 4, 20]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Barn Doors */}
      <mesh position={[0, 3, 10.01]} castShadow receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Cross on doors */}
      <mesh position={[0, 3, 10.02]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
        <planeGeometry args={[0.5, 8]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <mesh position={[0, 3, 10.02]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
        <planeGeometry args={[0.5, 8]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
    </group>
  );
}

export function Fence({ position, rotation = [0, 0, 0], length = 10 }: any) {
  const [ref] = useBox(
    () => ({
      type: 'Static',
      position,
      rotation,
      args: [length, 1.5, 0.2],
    }),
    useRef<Mesh>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 1.5, 0.2]} />
        <meshStandardMaterial color="#d4d4d8" transparent opacity={0.0} /> {/* Invisible collision */}
      </mesh>
      {/* Visual posts */}
      {Array.from({ length: Math.floor(length / 2) + 1 }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + i * 2, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.5, 0.2]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
      ))}
      {/* Horizontal rails */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.2, 0.1]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.2, 0.1]} />
        <meshStandardMaterial color="#fef3c7" />
      </mesh>
    </group>
  );
}

export function LanternPost({ position, rotation = [0, 0, 0] }: any) {
  const emissiveRef = useRef<any>(null);
  const innerOrbRef = useRef<any>(null);
  const lightRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.05;
    const sunY = Math.sin(t) * 500;
    const targetIntensity = Math.max(0, Math.min(1, (50 - sunY) / 50));
    
    if (emissiveRef.current) {
      emissiveRef.current.emissiveIntensity = targetIntensity * 2;
      emissiveRef.current.opacity = 0.4 + targetIntensity * 0.4;
    }
    if (innerOrbRef.current) {
      innerOrbRef.current.emissiveIntensity = targetIntensity * 4;
    }
    if (lightRef.current) {
      lightRef.current.intensity = targetIntensity * 2.5;
    }
  });

  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [0, 3, 0], args: [0.3, 6, 0.3] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 6, 0.3]} />
        <meshStandardMaterial color="#292524" />
      </mesh>
      <mesh position={[0, 5.8, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      <mesh position={[0, 5.3, 0.9]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.6, 4]} />
        <meshStandardMaterial ref={emissiveRef} color="#fef08a" emissive="#fef08a" emissiveIntensity={0} transparent opacity={0.4} />
      </mesh>
      {/* Inner glowing orb for better bloom */}
      <mesh position={[0, 5.3, 0.9]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial ref={innerOrbRef} color="#ffffff" emissive="#ffffff" emissiveIntensity={0} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 5.3, 0.9]} intensity={0} distance={25} color="#fef08a" />
    </group>
  );
}

export function MagicalTree({ position, scale = 1 }: any) {
  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      shapes: [
        { type: 'Cylinder', position: [0, 2 * scale, 0], args: [0.5 * scale, 0.8 * scale, 4 * scale, 8] },
        { type: 'Sphere', position: [0, 5 * scale, 0], args: [3 * scale] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      <mesh position={[0, 2 * scale, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5 * scale, 0.8 * scale, 4 * scale, 8]} />
        <meshStandardMaterial color="#292524" />
      </mesh>
      <mesh position={[0, 5 * scale, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3 * scale, 16, 16]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.5} transparent opacity={0.9} />
      </mesh>
      {/* Magical glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 1.5) * 2 * scale, 4 * scale + Math.cos(i) * 2 * scale, Math.sin(i * 2.5) * 2 * scale]}>
          <sphereGeometry args={[0.2 * scale]} />
          <meshStandardMaterial color="#c4b5fd" emissive="#c4b5fd" emissiveIntensity={2} />
          <pointLight intensity={0.5} distance={5 * scale} color="#c4b5fd" />
        </mesh>
      ))}
      <pointLight position={[0, 5 * scale, 0]} intensity={2} distance={20 * scale} color="#8b5cf6" />
    </group>
  );
}

export function Well({ position, scale = 1 }: any) {
  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      shapes: [
        { type: 'Cylinder', position: [0, 0.5 * scale, 0], args: [1 * scale, 1 * scale, 1 * scale, 8] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      {/* Base */}
      <mesh position={[0, 0.5 * scale, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1 * scale, 1 * scale, 1 * scale, 12]} />
        <meshStandardMaterial color="#57534e" roughness={0.9} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.8 * scale, 0]} receiveShadow>
        <cylinderGeometry args={[0.8 * scale, 0.8 * scale, 0.1 * scale, 12]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Roof supports */}
      <mesh position={[-0.8 * scale, 1.5 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2 * scale, 2 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[0.8 * scale, 1.5 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2 * scale, 2 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.8 * scale, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5 * scale, 1 * scale, 4]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
      {/* Magical glow inside well */}
      <pointLight position={[0, 1 * scale, 0]} intensity={1} distance={5 * scale} color="#38bdf8" />
    </group>
  );
}

export function Barrel({ position, rotation = [0, 0, 0], scale = 1 }: any) {
  const [ref] = useCylinder(
    () => ({
      type: 'Static',
      position,
      rotation,
      args: [0.4 * scale, 0.4 * scale, 1 * scale, 8],
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <cylinderGeometry args={[0.4 * scale, 0.4 * scale, 1 * scale, 8]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
  );
}

export function Bench({ position, rotation = [0, 0, 0], scale = 1 }: any) {
  const [ref] = useBox(
    () => ({
      type: 'Static',
      position,
      rotation,
      args: [2 * scale, 0.5 * scale, 0.8 * scale],
    }),
    useRef<Mesh>(null)
  );

  return (
    <group ref={ref as any}>
      {/* Seat */}
      <mesh position={[0, 0.5 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[2 * scale, 0.1 * scale, 0.8 * scale]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.8 * scale, 0.25 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1 * scale, 0.5 * scale, 0.6 * scale]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      <mesh position={[0.8 * scale, 0.25 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1 * scale, 0.5 * scale, 0.6 * scale]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
    </group>
  );
}

export function GlowingMushroom({ position, scale = 1, color = "#a855f7" }: any) {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.2 * scale, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05 * scale, 0.1 * scale, 0.4 * scale, 8]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.4 * scale, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.25 * scale, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[0, 0.5 * scale, 0]} intensity={0.5} distance={3 * scale} color={color} />
    </group>
  );
}

export function TownFireflies({ position, count = 20, spread = 10 }: any) {
  const groupRef = useRef<Group>(null);
  const fireflies = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * spread,
      y: Math.random() * 4 + 1,
      z: (Math.random() - 0.5) * spread,
      speed: Math.random() * 0.02 + 0.01,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count, spread]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const data = fireflies[i];
        child.position.y = data.y + Math.sin(t * data.speed * 50 + data.offset) * 0.5;
        child.position.x = data.x + Math.cos(t * data.speed * 30 + data.offset) * 0.5;
        child.position.z = data.z + Math.sin(t * data.speed * 40 + data.offset) * 0.5;
        const mat = (child as Mesh).material as any;
        if (mat) mat.emissiveIntensity = Math.max(0.1, Math.sin(t * 2 + data.offset) * 2);
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {fireflies.map((data, i) => (
        <mesh key={i} position={[data.x, data.y, data.z]}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshStandardMaterial color="#bef264" emissive="#bef264" emissiveIntensity={1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function TownCampfire({ position }: any) {
  const fireRef = useRef<any>(null);
  const lightRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sunY = Math.sin(t * 0.05) * 500;
    const nightFactor = Math.max(0, Math.min(1, (50 - sunY) / 50));
    
    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(t * 15) * 0.2;
      fireRef.current.visible = nightFactor > 0;
    }
    if (lightRef.current) {
      lightRef.current.intensity = nightFactor * (2 + Math.sin(t * 15) * 0.5);
    }
  });

  return (
    <group position={position}>
      {/* Stone Ring */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.sin((i / 8) * Math.PI * 2) * 0.8, 0.1, Math.cos((i / 8) * Math.PI * 2) * 0.8]} castShadow receiveShadow>
          <sphereGeometry args={[0.2, 6, 6]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
      ))}
      {/* Logs */}
      <mesh position={[0, 0.15, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Fire */}
      <mesh ref={fireRef} position={[0, 0.5, 0]}>
        <coneGeometry args={[0.4, 1, 8]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.6, 0]} distance={15} color="#f97316" castShadow />
    </group>
  );
}

export function FloatingLanterns({ position, count = 5, spread = 5 }: any) {
  const groupRef = useRef<Group>(null);
  const lanterns = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * spread,
      y: Math.random() * 2 + 3,
      z: (Math.random() - 0.5) * spread,
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count, spread]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const data = lanterns[i];
        child.position.y = data.y + Math.sin(t * data.speed + data.offset) * 0.5;
        // Subtle sway
        child.position.x = data.x + Math.sin(t * data.speed * 0.5 + data.offset) * 0.2;
        child.position.z = data.z + Math.cos(t * data.speed * 0.5 + data.offset) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {lanterns.map((data, i) => (
        <group key={i} position={[data.x, data.y, data.z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.1, 0.3, 6]} />
            <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.5} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <coneGeometry args={[0.16, 0.1, 6]} />
            <meshStandardMaterial color="#431407" />
          </mesh>
          <pointLight intensity={0.5} distance={8} color="#f97316" />
        </group>
      ))}
    </group>
  );
}

export function StoneArch({ position, rotation = [0, 0, 0], scale = 1 }: any) {
  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [-2 * scale, 2.5 * scale, 0], args: [1 * scale, 5 * scale, 1 * scale] },
        { type: 'Box', position: [2 * scale, 2.5 * scale, 0], args: [1 * scale, 5 * scale, 1 * scale] },
        { type: 'Box', position: [0, 5.5 * scale, 0], args: [5 * scale, 1 * scale, 1 * scale] },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref as any}>
      {/* Left Pillar */}
      <mesh position={[-2 * scale, 2.5 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[1 * scale, 5 * scale, 1 * scale]} />
        <meshStandardMaterial color="#292524" roughness={0.9} />
      </mesh>
      {/* Right Pillar */}
      <mesh position={[2 * scale, 2.5 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[1 * scale, 5 * scale, 1 * scale]} />
        <meshStandardMaterial color="#292524" roughness={0.9} />
      </mesh>
      {/* Top Arch */}
      <mesh position={[0, 5.5 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[5 * scale, 1 * scale, 1 * scale]} />
        <meshStandardMaterial color="#292524" roughness={0.9} />
      </mesh>
      {/* Glowing Runes */}
      <mesh position={[-2 * scale, 3 * scale, 0.51 * scale]}>
        <planeGeometry args={[0.4 * scale, 1.5 * scale]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
      <mesh position={[2 * scale, 3 * scale, 0.51 * scale]}>
        <planeGeometry args={[0.4 * scale, 1.5 * scale]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 5.5 * scale, 0.51 * scale]}>
        <planeGeometry args={[2 * scale, 0.4 * scale]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 4 * scale, 0]} intensity={1} distance={10 * scale} color="#38bdf8" />
    </group>
  );
}

export function RuralTown() {
  return (
    <group>
      {/* Main Street */}
      <Road position={[0, 0, 0]} length={400} width={16} />
      
      {/* Cross Street */}
      <Road position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={200} width={12} />

      {/* Town Square / Park */}
      <Platform position={[30, 0.05, 30]} args={[40, 0.1, 40]} color="#44403c" />
      <Well position={[30, 0, 30]} scale={1.5} />
      <TownCampfire position={[38, 0, 38]} />
      <MagicalTree position={[20, 0, 20]} scale={2.5} />
      <Tree position={[40, 0, 20]} scale={2.5} />
      <Tree position={[20, 0, 40]} scale={1.8} />
      <MagicalTree position={[40, 0, 40]} scale={2.2} />
      
      <Bench position={[25, 0, 30]} rotation={[0, Math.PI / 2, 0]} />
      <Bench position={[35, 0, 30]} rotation={[0, -Math.PI / 2, 0]} />
      <Bench position={[30, 0, 25]} rotation={[0, 0, 0]} />
      <Bench position={[30, 0, 35]} rotation={[0, Math.PI, 0]} />
      <Bench position={[36, 0, 38]} rotation={[0, -Math.PI / 4, 0]} />

      <TownFireflies position={[30, 0, 30]} count={30} spread={15} />
      <FloatingLanterns position={[30, 0, 30]} count={8} spread={12} />

      {/* Tavern (Replaces Gas Station) */}
      <Tavern position={[-30, 0, -30]} rotation={[0, Math.PI / 2, 0]} />
      <Barrel position={[-25, 0, -25]} />
      <Barrel position={[-25, 0, -26]} />
      <Barrel position={[-26, 0, -25.5]} />
      <Bench position={[-25, 0, -32]} rotation={[0, Math.PI / 2, 0]} />
      <TownFireflies position={[-30, 0, -30]} count={15} spread={10} />
      <FloatingLanterns position={[-30, 0, -30]} count={5} spread={8} />

      {/* Houses along Main Street */}
      <House position={[-20, 0, 20]} rotation={[0, Math.PI, 0]} color="#1e293b" roofColor="#0f172a" />
      <House position={[-40, 0, 20]} rotation={[0, Math.PI, 0]} color="#4c1d95" roofColor="#2e1065" />
      <House position={[-60, 0, 20]} rotation={[0, Math.PI, 0]} color="#064e3b" roofColor="#022c22" />
      
      <House position={[20, 0, -20]} rotation={[0, 0, 0]} color="#7f1d1d" roofColor="#450a0a" />
      <House position={[40, 0, -20]} rotation={[0, 0, 0]} color="#3f3f46" roofColor="#18181b" />
      <House position={[60, 0, -20]} rotation={[0, 0, 0]} color="#78350f" roofColor="#451a03" />

      {/* Town Entrance Archways */}
      <StoneArch position={[0, 0, 100]} scale={1.5} />
      <StoneArch position={[0, 0, -100]} scale={1.5} />
      <StoneArch position={[100, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
      <StoneArch position={[-100, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />

      {/* Barn on the outskirts */}
      <Barn position={[100, 0, 80]} rotation={[0, -Math.PI / 4, 0]} />
      <Fence position={[80, 0, 60]} rotation={[0, Math.PI / 4, 0]} length={40} />
      <Fence position={[120, 0, 60]} rotation={[0, -Math.PI / 4, 0]} length={40} />
      <Tree position={[110, 0, 100]} scale={3} />
      <Tree position={[90, 0, 90]} scale={2.5} />

      {/* Lantern Posts */}
      <LanternPost position={[-10, 0, 10]} rotation={[0, Math.PI, 0]} />
      <LanternPost position={[-30, 0, 10]} rotation={[0, Math.PI, 0]} />
      <LanternPost position={[-50, 0, 10]} rotation={[0, Math.PI, 0]} />
      
      <LanternPost position={[10, 0, -10]} rotation={[0, 0, 0]} />
      <LanternPost position={[30, 0, -10]} rotation={[0, 0, 0]} />
      <LanternPost position={[50, 0, -10]} rotation={[0, 0, 0]} />
      
      <LanternPost position={[10, 0, 30]} rotation={[0, Math.PI / 2, 0]} />
      <LanternPost position={[10, 0, 50]} rotation={[0, Math.PI / 2, 0]} />
      
      <LanternPost position={[-10, 0, -30]} rotation={[0, -Math.PI / 2, 0]} />
      <LanternPost position={[-10, 0, -50]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Fences around houses */}
      <Fence position={[-20, 0, 30]} length={16} />
      <Fence position={[-40, 0, 30]} length={16} />
      <Fence position={[-60, 0, 30]} length={16} />
      <Fence position={[-12, 0, 20]} rotation={[0, Math.PI / 2, 0]} length={20} />
      <Fence position={[-68, 0, 20]} rotation={[0, Math.PI / 2, 0]} length={20} />

      {/* Glowing Mushrooms in dark corners */}
      <GlowingMushroom position={[-18, 0, 28]} scale={1.5} color="#ec4899" />
      <GlowingMushroom position={[-19, 0, 29]} scale={1} color="#ec4899" />
      <GlowingMushroom position={[-42, 0, 28]} scale={1.2} color="#8b5cf6" />
      <GlowingMushroom position={[22, 0, -18]} scale={1.8} color="#3b82f6" />
      <GlowingMushroom position={[24, 0, -19]} scale={1.2} color="#3b82f6" />

      {/* More Magical Trees & Normal Trees */}
      <MagicalTree position={[-30, 0, 25]} scale={1.5} />
      <Tree position={[-50, 0, 25]} scale={1.8} />
      <MagicalTree position={[30, 0, -25]} scale={1.6} />
      <Tree position={[50, 0, -25]} scale={1.4} />
      <Tree position={[-80, 0, -40]} scale={4} />
      <Tree position={[-90, 0, -20]} scale={3.5} />
      <MagicalTree position={[-70, 0, -60]} scale={4.5} />
      
      <TownFireflies position={[-70, 0, -60]} count={20} spread={12} />
    </group>
  );
}

export function Road({ position = [0, 0, 0], rotation = [0, 0, 0], length = 1000, width = 16 }: any) {
  const sidewalkWidth = 2.5;
  const sidewalkHeight = 0.08; // subtle lip
  const roadWidth = width - sidewalkWidth * 2;

  const [ref] = useCompoundBody(
    () => ({
      type: 'Static',
      position,
      rotation,
      shapes: [
        { type: 'Box', position: [-(roadWidth / 2 + sidewalkWidth / 2), sidewalkHeight / 2, 0], args: [sidewalkWidth, sidewalkHeight, length] },
        { type: 'Box', position: [(roadWidth / 2 + sidewalkWidth / 2), sidewalkHeight / 2, 0], args: [sidewalkWidth, sidewalkHeight, length] },
      ],
    }),
    useRef<Group>(null)
  );

  const lineTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#44403c'; // Stone/Dirt color
      context.fillRect(0, 0, 512, 512);
      
      // Draw some cobblestone lines
      context.fillStyle = '#292524';
      for(let i=0; i<512; i+=32) {
        context.fillRect(0, i, 512, 2);
        context.fillRect(i, 0, 2, 512);
      }
      
      // Add dirt/moss patches for a more organic feel
      for(let i=0; i<100; i++) {
        context.fillStyle = Math.random() > 0.5 ? '#1c1917' : '#3f6212';
        context.globalAlpha = 0.3;
        context.beginPath();
        context.arc(Math.random() * 512, Math.random() * 512, Math.random() * 20 + 5, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1.0;

      // Left Kerb (stone)
      context.fillStyle = '#57534e';
      context.fillRect(0, 0, 32, 512);

      // Right Kerb (stone)
      context.fillStyle = '#57534e';
      context.fillRect(480, 0, 32, 512);
    }
    const tex = new CanvasTexture(canvas);
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(1, length / 10);
    tex.anisotropy = 16;
    return tex;
  }, [length]);

  return (
    <group ref={ref as any}>
      {/* Road Surface */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadWidth, length]} />
        <meshStandardMaterial map={lineTexture} roughness={0.8} />
      </mesh>
      
      {/* Left Sidewalk */}
      <mesh position={[-(roadWidth / 2 + sidewalkWidth / 2), sidewalkHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[sidewalkWidth, sidewalkHeight, length]} />
        <meshStandardMaterial color="#555555" roughness={0.9} />
      </mesh>

      {/* Right Sidewalk */}
      <mesh position={[(roadWidth / 2 + sidewalkWidth / 2), sidewalkHeight / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[sidewalkWidth, sidewalkHeight, length]} />
        <meshStandardMaterial color="#555555" roughness={0.9} />
      </mesh>
    </group>
  );
}
