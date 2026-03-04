import { useMemo, useRef, useEffect } from 'react';
import { useHeightfield, useCylinder, useBox } from '@react-three/cannon';
import { createNoise2D } from 'simplex-noise';
import { Mesh, BufferGeometry, Float32BufferAttribute, Color, Group, InstancedMesh, Object3D } from 'three';
import { useFrame } from '@react-three/fiber';

function Fireflies({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 2 + i) * 0.5 + 1;
      child.position.x = Math.sin(t * 1.5 + i * 2) * 1.5;
      child.position.z = Math.cos(t * 1.8 + i * 3) * 1.5;
      (child as any).material.opacity = (Math.sin(t * 3 + i) + 1) / 2;
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial color="#a3e635" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Campfire({ position }: { position: [number, number, number] }) {
  const fireRef = useRef<any>(null);
  const lightRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sunY = Math.sin(t * 0.05) * 500;
    const isNight = sunY < 0;
    
    if (fireRef.current) {
      fireRef.current.scale.y = 1 + Math.sin(t * 15) * 0.2;
      fireRef.current.visible = isNight;
    }
    if (lightRef.current) {
      lightRef.current.intensity = isNight ? 2 + Math.sin(t * 15) * 0.5 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Logs */}
      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[0, -Math.PI / 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      {/* Rocks */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[Math.sin((i / 6) * Math.PI * 2) * 0.5, 0.05, Math.cos((i / 6) * Math.PI * 2) * 0.5]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 6, 6]} />
          <meshStandardMaterial color="#52525b" />
        </mesh>
      ))}
      {/* Fire */}
      <mesh ref={fireRef} position={[0, 0.4, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.5, 0]} distance={10} color="#f97316" castShadow />
    </group>
  );
}

function Snowman({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 1.7, 0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.05, 0.2, 8]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.1, 1.75, 0.22]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0.1, 1.75, 0.22]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function ProceduralDetail({ position, type, detailType }: { position: [number, number, number], type: string, detailType: string }) {
  if (type === 'forest') {
    if (detailType === 'campfire') return <Campfire position={position} />;
    if (detailType === 'fireflies') return <Fireflies position={position} />;
    // Bush
    return (
      <mesh position={[position[0], position[1] + 0.5, position[2]]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
    );
  }
  
  if (type === 'desert') {
    // Dead bush / scrub
    return (
      <group position={[position[0], position[1] + 0.3, position[2]]}>
        {[...Array(3)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, (Math.PI / 4) * (i - 1)]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 4]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))}
      </group>
    );
  }
  
  if (type === 'snow') {
    if (detailType === 'snowman') return <Snowman position={position} />;
    // Ice crystal
    return (
      <mesh position={[position[0], position[1] + 0.5, position[2]]} castShadow receiveShadow>
        <coneGeometry args={[0.3, 1, 4]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.1} metalness={0.8} transparent opacity={0.8} />
      </mesh>
    );
  }
  
  return null;
}

function ProceduralTree({ position, scale, type = 'forest' }: { position: [number, number, number], scale: number, type?: 'forest' | 'desert' | 'snow' }) {
  const [ref] = useCylinder(() => ({
    type: 'Static',
    position: [position[0], position[1] + 1 * scale, position[2]],
    args: [0.2 * scale, 0.2 * scale, 2 * scale, 8]
  }));

  if (type === 'desert') {
    // Cactus
    return (
      <group>
        <mesh ref={ref as any} castShadow receiveShadow>
          <cylinderGeometry args={[0.3 * scale, 0.3 * scale, 3 * scale, 8]} />
          <meshStandardMaterial color="#166534" roughness={0.9} />
        </mesh>
        <mesh position={[0.5 * scale, position[1] + 1.5 * scale, position[2]]} castShadow receiveShadow rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 1.5 * scale, 8]} />
          <meshStandardMaterial color="#166534" roughness={0.9} />
        </mesh>
        <mesh position={[-0.5 * scale, position[1] + 1 * scale, position[2]]} castShadow receiveShadow rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 1.5 * scale, 8]} />
          <meshStandardMaterial color="#166534" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (type === 'snow') {
    // Pine tree with snow
    return (
      <group>
        <mesh ref={ref as any} castShadow receiveShadow>
          <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 2 * scale, 8]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[position[0], position[1] + 2 * scale, position[2]]} castShadow receiveShadow>
          <coneGeometry args={[1.5 * scale, 3 * scale, 8]} />
          <meshStandardMaterial color="#0f766e" roughness={0.8} />
        </mesh>
        <mesh position={[position[0], position[1] + 3.5 * scale, position[2]]} castShadow receiveShadow>
          <coneGeometry args={[1 * scale, 2 * scale, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  // Default Forest Tree
  return (
    <group>
      <mesh ref={ref as any} castShadow receiveShadow>
        <cylinderGeometry args={[0.2 * scale, 0.2 * scale, 2 * scale, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[position[0], position[1] + 2.5 * scale, position[2]]} castShadow receiveShadow>
        <sphereGeometry args={[1.5 * scale, 8, 8]} />
        <meshStandardMaterial color="#065f46" roughness={0.8} />
      </mesh>
    </group>
  );
}

function ProceduralRock({ position, scale, rotation, type = 'forest' }: { position: [number, number, number], scale: number, rotation: [number, number, number], type?: 'forest' | 'desert' | 'snow' }) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [position[0], position[1] + 0.5 * scale, position[2]],
    rotation,
    args: [scale, scale, scale]
  }));

  let rockColor = "#52525b"; // Default gray
  if (type === 'desert') rockColor = "#b45309"; // Sandstone
  if (type === 'snow') rockColor = "#e2e8f0"; // Icy rock

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={[scale, scale, scale]} />
      <meshStandardMaterial color={rockColor} roughness={0.9} />
    </mesh>
  );
}

export function ProceduralWorld({ size = 128, elementSize = 4, seed = 1337, heightMultiplier = 1, roughnessMultiplier = 1 }: any) {
  const { heights, geometry, trees, rocks, details } = useMemo(() => {
    // We use a simple seeded random replacement for consistent noise
    // In a real app, you'd use a proper PRNG like alea
    let seedVal = seed;
    const random = () => {
      const x = Math.sin(seedVal++) * 10000;
      return x - Math.floor(x);
    };
    
    const noise2D = createNoise2D(random);
    const biomeNoise2D = createNoise2D(() => {
      const x = Math.sin(seedVal++ * 1.5) * 10000;
      return x - Math.floor(x);
    });
    const featureNoise2D = createNoise2D(() => {
      const x = Math.sin(seedVal++ * 2.5) * 10000;
      return x - Math.floor(x);
    });
    
    const heights: number[][] = [];
    const vertices = [];
    const indices = [];
    const colors = [];
    const color = new Color();
    
    const trees: { id: string, position: [number, number, number], scale: number, type: 'forest' | 'desert' | 'snow' }[] = [];
    const rocks: { id: string, position: [number, number, number], scale: number, rotation: [number, number, number], type: 'forest' | 'desert' | 'snow' }[] = [];
    const details: { id: string, position: [number, number, number], type: 'forest' | 'desert' | 'snow', detailType: string }[] = [];
    
    const worldSize = (size - 1) * elementSize;
    const centerX = worldSize / 2;
    const centerY = worldSize / 2;
    
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        const x = i * elementSize;
        const y = j * elementSize;
        
        // Determine biome based on low-frequency noise
        const biomeVal = biomeNoise2D(x * 0.0005, y * 0.0005);
        let biome: 'forest' | 'desert' | 'snow' = 'forest';
        if (biomeVal < -0.3) biome = 'desert';
        else if (biomeVal > 0.4) biome = 'snow';

        // Multi-octave noise for varied terrain features
        let h = 0;
        
        let isRiver = false;
        let isCanyon = false;
        let isLake = false;
        
        // Adjust height generation based on biome
        let localHeightMultiplier = heightMultiplier;
        if (biome === 'desert') {
          // Deserts are flatter with rolling dunes
          h += noise2D(x * 0.002 * roughnessMultiplier, y * 0.002 * roughnessMultiplier) * 30 * heightMultiplier;
          h += noise2D(x * 0.01 * roughnessMultiplier, y * 0.01 * roughnessMultiplier) * 5 * heightMultiplier;
          
          // Canyons
          const canyonNoise = Math.abs(featureNoise2D(x * 0.0015, y * 0.0015));
          if (canyonNoise < 0.04) {
            isCanyon = true;
            const canyonDepth = (0.04 - canyonNoise) * 1500 * heightMultiplier;
            h -= canyonDepth;
          }
        } else if (biome === 'snow') {
          // Snow mountains are jagged and tall
          localHeightMultiplier *= 1.5;
          h += noise2D(x * 0.001 * roughnessMultiplier, y * 0.001 * roughnessMultiplier) * 200 * localHeightMultiplier;
          h += Math.abs(noise2D(x * 0.005 * roughnessMultiplier, y * 0.005 * roughnessMultiplier)) * 80 * localHeightMultiplier; // Ridges
          h += noise2D(x * 0.02 * roughnessMultiplier, y * 0.02 * roughnessMultiplier) * 20 * localHeightMultiplier;
          
          // Frozen Lakes
          const lakeNoise = featureNoise2D(x * 0.002, y * 0.002);
          if (lakeNoise > 0.65) {
            isLake = true;
            // Flatten the lake area and lower it slightly
            h = h * 0.1 - 5; 
          }
        } else {
          // Forest (default)
          h += noise2D(x * 0.001 * roughnessMultiplier, y * 0.001 * roughnessMultiplier) * 150 * heightMultiplier;
          h += noise2D(x * 0.005 * roughnessMultiplier, y * 0.005 * roughnessMultiplier) * 50 * heightMultiplier;
          h += noise2D(x * 0.02 * roughnessMultiplier, y * 0.02 * roughnessMultiplier) * 15 * heightMultiplier;
          h += noise2D(x * 0.1 * roughnessMultiplier, y * 0.1 * roughnessMultiplier) * 2 * heightMultiplier;
          
          // Rivers
          const riverNoise = Math.abs(featureNoise2D(x * 0.001, y * 0.001));
          if (riverNoise < 0.03) {
            isRiver = true;
            const riverDepth = (0.03 - riverNoise) * 800 * heightMultiplier;
            h -= riverDepth;
          }
        }
        
        // Flatten the center for the race track / spawn area
        const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const flattenRadius = 300; // Keep a large area flat for the track
        const blend = Math.max(0, Math.min(1, (distFromCenter - flattenRadius) / 100));
        
        // Smooth step blend
        const smoothBlend = blend * blend * (3 - 2 * blend);
        
        h = h * smoothBlend;
        
        // Ensure edges are high to create a valley/bowl effect
        const distFromEdge = Math.min(x, y, worldSize - x, worldSize - y);
        if (distFromEdge < 100) {
           h += (100 - distFromEdge) * 0.5;
        }
        
        row.push(h);
        
        // Local space: x = i * elementSize, y = j * elementSize, z = h
        vertices.push(x, y, h);
        
        // Color based on height, slope, and biome
        if (isCanyon) {
          color.set('#78350f'); // Dark brown/red canyon rock
        } else if (isRiver) {
          color.set('#0284c7'); // River blue
        } else if (isLake) {
          color.set('#bae6fd'); // Frozen lake ice
        } else if (biome === 'desert') {
          if (h < 5) color.set('#d97706'); // Darker sand
          else if (h < 30) color.set('#f59e0b'); // Mid sand
          else if (h < 60) color.set('#fbbf24'); // Light sand
          else color.set('#fcd34d'); // Very light sand/rock
        } else if (biome === 'snow') {
          if (h < 10) color.set('#94a3b8'); // Base rock
          else if (h < 40) color.set('#cbd5e1'); // Light rock / patchy snow
          else if (h < 80) color.set('#f1f5f9'); // Snow
          else color.set('#ffffff'); // Deep snow
        } else {
          // Forest
          if (h < -20) color.set('#27272a'); // Deep rock
          else if (h < 5) color.set('#166534'); // Low grass
          else if (h < 30) color.set('#15803d'); // Mid grass
          else if (h < 60) color.set('#4d7c0f'); // High grass
          else if (h < 100) color.set('#78716c'); // Rock/Mountain
          else color.set('#f8fafc'); // Snow cap
        }
        
        // Add some noise to color
        const colorNoise = noise2D(x * 0.1, y * 0.1) * 0.05;
        color.r = Math.max(0, Math.min(1, color.r + colorNoise));
        color.g = Math.max(0, Math.min(1, color.g + colorNoise));
        color.b = Math.max(0, Math.min(1, color.b + colorNoise));
        
        colors.push(color.r, color.g, color.b);
        
        // Add objects
        if (h > 2 && h < 60 && distFromCenter > flattenRadius + 20 && !isRiver && !isCanyon && !isLake) {
          // Tree clusters based on noise
          const treeNoise = noise2D(x * 0.05, y * 0.05);
          
          let treeThreshold = 0.3;
          let treeChance = 0.92;
          
          if (biome === 'desert') {
            treeThreshold = 0.6; // Fewer cacti
            treeChance = 0.98;
          } else if (biome === 'snow') {
            treeThreshold = 0.4;
            treeChance = 0.95;
          }

          if (treeNoise > treeThreshold && random() > treeChance) {
            trees.push({
              id: `tree-${i}-${j}`,
              position: [x - worldSize / 2, h - 0.1, worldSize / 2 - y],
              scale: 1 + random() * 2.5, // More varied tree sizes
              type: biome
            });
          }
          
          // Rock clusters
          const rockNoise = noise2D(x * 0.1, y * 0.1);
          let rockThreshold = 0.5;
          let rockChance = 0.95;
          
          if (biome === 'desert') {
            rockThreshold = 0.3; // More rocks in desert
            rockChance = 0.9;
          } else if (biome === 'snow') {
            rockThreshold = 0.4;
            rockChance = 0.92;
          }

          if (rockNoise > rockThreshold && random() > rockChance) {
            rocks.push({
              id: `rock-${i}-${j}`,
              position: [x - worldSize / 2, h - 0.1, worldSize / 2 - y],
              scale: 1 + random() * 4, // Larger rocks possible
              rotation: [random() * Math.PI, random() * Math.PI, random() * Math.PI],
              type: biome
            });
          }
          
          // Details (bushes, campfires, snowmen, etc.)
          const detailNoise = noise2D(x * 0.2, y * 0.2);
          if (detailNoise > 0.6 && random() > 0.8) {
            let detailType = 'bush';
            const r = random();
            
            if (biome === 'forest') {
              if (r > 0.95) detailType = 'campfire';
              else if (r > 0.7) detailType = 'fireflies';
            } else if (biome === 'snow') {
              if (r > 0.9) detailType = 'snowman';
              else detailType = 'crystal';
            } else if (biome === 'desert') {
              detailType = 'scrub';
            }

            details.push({
              id: `detail-${i}-${j}`,
              position: [x - worldSize / 2, h - 0.1, worldSize / 2 - y],
              type: biome,
              detailType
            });
          }
        }
      }
      heights.push(row);
    }
    
    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size - 1; j++) {
        const a = i * size + j;
        const b = i * size + (j + 1);
        const c = (i + 1) * size + j;
        const d = (i + 1) * size + (j + 1);
        
        indices.push(a, c, d);
        indices.push(a, d, b);
      }
    }
    
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    
    return { heights, geometry: geo, trees, rocks, details };
  }, [size, elementSize, seed, heightMultiplier, roughnessMultiplier]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const worldSize = (size - 1) * elementSize;

  const [ref] = useHeightfield(
    () => ({
      args: [
        heights,
        {
          elementSize,
        },
      ],
      position: [-worldSize / 2, -0.1, worldSize / 2],
      rotation: [-Math.PI / 2, 0, 0],
    }),
    useRef<Mesh>(null)
  );

  return (
    <group>
      <mesh ref={ref} receiveShadow geometry={geometry}>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} />
      </mesh>
      
      <InstancedTrees trees={trees} />
      <InstancedRocks rocks={rocks} />
      <InstancedDetails details={details} />
      
      {details.filter(d => ['campfire', 'fireflies', 'snowman'].includes(d.detailType)).map(detail => (
        <ProceduralDetail key={detail.id} position={detail.position} type={detail.type} detailType={detail.detailType} />
      ))}
    </group>
  );
}

// Performance Optimization: Instanced Meshes for Details
function InstancedDetails({ details }: { details: any[] }) {
  const bushes = details.filter(d => d.detailType === 'bush');
  const scrubs = details.filter(d => d.detailType === 'scrub');
  const crystals = details.filter(d => d.detailType === 'crystal');

  return (
    <group>
      {bushes.length > 0 && <InstancedBushes bushes={bushes} />}
      {scrubs.length > 0 && <InstancedScrubs scrubs={scrubs} />}
      {crystals.length > 0 && <InstancedCrystals crystals={crystals} />}
    </group>
  );
}

function InstancedBushes({ bushes }: { bushes: any[] }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (meshRef.current) {
      bushes.forEach((bush, i) => {
        dummy.position.set(bush.position[0], bush.position[1] + 0.5, bush.position[2]);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [bushes, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, bushes.length]} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial color="#15803d" roughness={0.9} />
    </instancedMesh>
  );
}

function InstancedScrubs({ scrubs }: { scrubs: any[] }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (meshRef.current) {
      scrubs.forEach((scrub, i) => {
        // We'll just instance one of the 3 sticks for simplicity, or we can instance 3x the amount
        // To keep it simple, let's just make it a single slightly larger stick or a small cluster
        dummy.position.set(scrub.position[0], scrub.position[1] + 0.3, scrub.position[2]);
        dummy.scale.set(1, 1, 1);
        dummy.rotation.set(0, 0, Math.PI / 4);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [scrubs, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, scrubs.length]} castShadow receiveShadow>
      <cylinderGeometry args={[0.05, 0.05, 0.8, 4]} />
      <meshStandardMaterial color="#78350f" />
    </instancedMesh>
  );
}

function InstancedCrystals({ crystals }: { crystals: any[] }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (meshRef.current) {
      crystals.forEach((crystal, i) => {
        dummy.position.set(crystal.position[0], crystal.position[1] + 0.5, crystal.position[2]);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [crystals, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, crystals.length]} castShadow receiveShadow>
      <coneGeometry args={[0.3, 1, 4]} />
      <meshStandardMaterial color="#bae6fd" roughness={0.1} metalness={0.8} transparent opacity={0.8} />
    </instancedMesh>
  );
}

// Performance Optimization: Instanced Meshes for Trees
function InstancedTrees({ trees }: { trees: any[] }) {
  const forestTrees = trees.filter(t => t.type === 'forest');
  const snowTrees = trees.filter(t => t.type === 'snow');
  const desertTrees = trees.filter(t => t.type === 'desert');

  return (
    <group>
      {forestTrees.length > 0 && <InstancedForestTrees trees={forestTrees} />}
      {snowTrees.length > 0 && <InstancedSnowTrees trees={snowTrees} />}
      {desertTrees.length > 0 && <InstancedDesertTrees trees={desertTrees} />}
    </group>
  );
}

function InstancedForestTrees({ trees }: { trees: any[] }) {
  const trunkRef = useRef<InstancedMesh>(null);
  const leavesRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (trunkRef.current && leavesRef.current) {
      trees.forEach((tree, i) => {
        dummy.position.set(tree.position[0], tree.position[1] + 1 * tree.scale, tree.position[2]);
        dummy.scale.set(tree.scale, tree.scale, tree.scale);
        dummy.updateMatrix();
        trunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(tree.position[0], tree.position[1] + 2.5 * tree.scale, tree.position[2]);
        dummy.updateMatrix();
        leavesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      trunkRef.current.instanceMatrix.needsUpdate = true;
      leavesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [trees, dummy]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color="#78350f" />
      </instancedMesh>
      <instancedMesh ref={leavesRef} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#065f46" roughness={0.8} />
      </instancedMesh>
    </group>
  );
}

function InstancedSnowTrees({ trees }: { trees: any[] }) {
  const trunkRef = useRef<InstancedMesh>(null);
  const leaves1Ref = useRef<InstancedMesh>(null);
  const leaves2Ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (trunkRef.current && leaves1Ref.current && leaves2Ref.current) {
      trees.forEach((tree, i) => {
        dummy.position.set(tree.position[0], tree.position[1] + 1 * tree.scale, tree.position[2]);
        dummy.scale.set(tree.scale, tree.scale, tree.scale);
        dummy.updateMatrix();
        trunkRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(tree.position[0], tree.position[1] + 2 * tree.scale, tree.position[2]);
        dummy.updateMatrix();
        leaves1Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(tree.position[0], tree.position[1] + 3.5 * tree.scale, tree.position[2]);
        dummy.updateMatrix();
        leaves2Ref.current!.setMatrixAt(i, dummy.matrix);
      });
      trunkRef.current.instanceMatrix.needsUpdate = true;
      leaves1Ref.current.instanceMatrix.needsUpdate = true;
      leaves2Ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [trees, dummy]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color="#451a03" />
      </instancedMesh>
      <instancedMesh ref={leaves1Ref} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#0f766e" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={leaves2Ref} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

function InstancedDesertTrees({ trees }: { trees: any[] }) {
  const mainRef = useRef<InstancedMesh>(null);
  const arm1Ref = useRef<InstancedMesh>(null);
  const arm2Ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (mainRef.current && arm1Ref.current && arm2Ref.current) {
      trees.forEach((tree, i) => {
        dummy.position.set(tree.position[0], tree.position[1] + 1.5 * tree.scale, tree.position[2]);
        dummy.scale.set(tree.scale, tree.scale, tree.scale);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        mainRef.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(tree.position[0] + 0.5 * tree.scale, tree.position[1] + 1.5 * tree.scale, tree.position[2]);
        dummy.rotation.set(0, 0, Math.PI / 4);
        dummy.updateMatrix();
        arm1Ref.current!.setMatrixAt(i, dummy.matrix);

        dummy.position.set(tree.position[0] - 0.5 * tree.scale, tree.position[1] + 1 * tree.scale, tree.position[2]);
        dummy.rotation.set(0, 0, -Math.PI / 4);
        dummy.updateMatrix();
        arm2Ref.current!.setMatrixAt(i, dummy.matrix);
      });
      mainRef.current.instanceMatrix.needsUpdate = true;
      arm1Ref.current.instanceMatrix.needsUpdate = true;
      arm2Ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [trees, dummy]);

  return (
    <group>
      <instancedMesh ref={mainRef} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={arm1Ref} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={arm2Ref} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

// Performance Optimization: Instanced Meshes for Rocks
function InstancedRocks({ rocks }: { rocks: any[] }) {
  const forestRocks = rocks.filter(r => r.type === 'forest');
  const snowRocks = rocks.filter(r => r.type === 'snow');
  const desertRocks = rocks.filter(r => r.type === 'desert');

  return (
    <group>
      {forestRocks.length > 0 && <InstancedRockGroup rocks={forestRocks} color="#52525b" />}
      {snowRocks.length > 0 && <InstancedRockGroup rocks={snowRocks} color="#e2e8f0" />}
      {desertRocks.length > 0 && <InstancedRockGroup rocks={desertRocks} color="#b45309" />}
    </group>
  );
}

function InstancedRockGroup({ rocks, color }: { rocks: any[], color: string }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useEffect(() => {
    if (meshRef.current) {
      rocks.forEach((rock, i) => {
        dummy.position.set(rock.position[0], rock.position[1] + 0.5 * rock.scale, rock.position[2]);
        dummy.scale.set(rock.scale, rock.scale * 0.8, rock.scale);
        dummy.rotation.set(rock.rotation[0], rock.rotation[1], rock.rotation[2]);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [rocks, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, rocks.length]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </instancedMesh>
  );
}
