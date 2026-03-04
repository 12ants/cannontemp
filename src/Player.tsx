import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCylinder } from '@react-three/cannon';
import { Vector3, Mesh, Quaternion, Euler, Group, MathUtils } from 'three';
import { useControls } from './useControls';
import { debugData } from './store';

const WALK_SPEED = 6;
const SPRINT_SPEED = 12;
const JUMP_FORCE = 6;
const TURN_SPEED = 3;

const direction = new Vector3();
const _euler = new Euler(0, 0, 0, 'YXZ');
const _quaternion = new Quaternion();

export function Player({ position = [0, 2, 0], onEnterVehicle }: { position?: [number, number, number], onEnterVehicle: () => void }) {
  const [ref, api] = useCylinder(
    () => ({
      mass: 75,
      type: 'Dynamic',
      position,
      args: [0.4, 0.4, 1.8, 16],
      fixedRotation: true,
      linearDamping: 0.9,
      angularDamping: 0.9,
      friction: 0.1, // Reduce friction to prevent getting stuck
      material: {
        friction: 0.1,
        restitution: 0.0
      }
    }),
    useRef<Group>(null)
  );

  const { forward, backward, left, right, lookLeft, lookRight, lookUp, lookDown, interact, brake, sprint } = useControls();
  const velocity = useRef([0, 0, 0]);
  const playerPosition = useRef([0, 0, 0]);
  const [canJump, setCanJump] = useState(true);
  
  const cameraYaw = useRef(0);
  const cameraPitch = useRef(0.2);
  const playerYaw = useRef(0);

  // Model refs for animation
  const torso = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const flashlightRef = useRef<any>(null);
  const flashlightConeRef = useRef<any>(null);

  useEffect(() => {
    const unsubVel = api.velocity.subscribe((v) => {
      velocity.current = v;
      if (Math.abs(v[1]) < 0.05) {
        setCanJump(true);
      }
    });
    const unsubPos = api.position.subscribe((p) => (playerPosition.current = p));
    return () => {
      unsubVel();
      unsubPos();
    };
  }, [api]);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Camera Look
    if (lookLeft) cameraYaw.current += TURN_SPEED * delta;
    if (lookRight) cameraYaw.current -= TURN_SPEED * delta;
    if (lookUp) cameraPitch.current -= TURN_SPEED * delta;
    if (lookDown) cameraPitch.current += TURN_SPEED * delta;
    
    // Clamp pitch to prevent flipping
    cameraPitch.current = MathUtils.clamp(cameraPitch.current, -Math.PI / 4, Math.PI / 3);

    // Movement relative to camera yaw
    const currentSpeed = sprint ? SPRINT_SPEED : WALK_SPEED;
    const moveZ = Number(backward) - Number(forward);
    const moveX = Number(right) - Number(left);
    
    direction.set(moveX, 0, moveZ);
    
    const isMoving = direction.lengthSq() > 0.1;

    if (isMoving) {
      direction.normalize().multiplyScalar(currentSpeed);
      
      // Apply camera yaw to movement direction
      _euler.set(0, cameraYaw.current, 0, 'YXZ');
      direction.applyEuler(_euler);
      
      // Rotate player model to face movement direction smoothly
      const targetYaw = Math.atan2(direction.x, direction.z);
      
      // Smooth rotation towards target yaw
      // Need to handle the wrap-around at PI/-PI
      let diff = targetYaw - playerYaw.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      
      playerYaw.current += diff * 10 * delta;
      
      _euler.set(0, playerYaw.current, 0, 'YXZ');
      _quaternion.setFromEuler(_euler);
      ref.current.quaternion.copy(_quaternion);

      api.velocity.set(direction.x, velocity.current[1], direction.z);
    } else {
      // Allow damping to stop the player
      api.velocity.set(velocity.current[0] * 0.8, velocity.current[1], velocity.current[2] * 0.8);
    }

    // Jump
    if (brake && canJump) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
      setCanJump(false);
    }

    // Animations
    const speed = Math.sqrt(velocity.current[0] ** 2 + velocity.current[2] ** 2);
    const time = state.clock.getElapsedTime();
    
    // Flashlight logic (turn on at night)
    const cycleT = time * 0.05;
    const sunY = Math.sin(cycleT) * 500;
    const isNight = sunY < 0;
    
    if (flashlightRef.current) {
      flashlightRef.current.intensity = isNight ? 2 : 0;
    }
    if (flashlightConeRef.current) {
      flashlightConeRef.current.opacity = isNight ? 0.15 : 0;
    }
    
    if (speed > 0.5 && leftLeg.current && rightLeg.current && leftArm.current && rightArm.current && torso.current) {
      const strideFreq = sprint ? 15 : 10;
      const strideAmp = sprint ? 0.8 : 0.5;
      leftLeg.current.rotation.x = Math.sin(time * strideFreq) * strideAmp;
      rightLeg.current.rotation.x = Math.sin(time * strideFreq + Math.PI) * strideAmp;
      leftArm.current.rotation.x = Math.sin(time * strideFreq + Math.PI) * strideAmp;
      rightArm.current.rotation.x = Math.sin(time * strideFreq) * strideAmp;
      
      // Torso bobbing and slight rotation
      torso.current.position.y = 1.1 + Math.abs(Math.sin(time * strideFreq)) * 0.05;
      torso.current.rotation.y = Math.sin(time * strideFreq) * 0.1;
      torso.current.rotation.z = Math.sin(time * strideFreq) * 0.05;
    } else if (leftLeg.current && rightLeg.current && leftArm.current && rightArm.current && torso.current) {
      // Return to idle
      leftLeg.current.rotation.x = MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.1);
      rightLeg.current.rotation.x = MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.1);
      leftArm.current.rotation.x = MathUtils.lerp(leftArm.current.rotation.x, 0, 0.1);
      rightArm.current.rotation.x = MathUtils.lerp(rightArm.current.rotation.x, 0, 0.1);
      
      // Idle breathing
      torso.current.position.y = 1.1 + Math.sin(time * 2) * 0.02;
      torso.current.rotation.y = MathUtils.lerp(torso.current.rotation.y, 0, 0.1);
      torso.current.rotation.z = MathUtils.lerp(torso.current.rotation.z, 0, 0.1);
    }

    // Camera follow (Third Person Orbit)
    const cameraDistance = 5;
    
    const targetPos = new Vector3(...playerPosition.current);
    
    // Calculate camera position using spherical coordinates based on yaw and pitch
    const cameraOffset = new Vector3(
      Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * cameraDistance,
      Math.sin(cameraPitch.current) * cameraDistance,
      Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * cameraDistance
    );
    
    const desiredCameraPos = targetPos.clone().add(cameraOffset);
    
    // Smoothly interpolate camera position
    state.camera.position.lerp(desiredCameraPos, 0.2);
    
    // Look at player's head
    const lookAtPos = targetPos.clone();
    lookAtPos.y += 0.8; // Look slightly up
    state.camera.lookAt(lookAtPos);

    // Interact to enter vehicle
    if (interact) {
      const carPos = new Vector3(...debugData.position);
      const playerPos = new Vector3(...playerPosition.current);
      const distance = playerPos.distanceTo(carPos);
      
      if (distance < 5) {
        onEnterVehicle();
      }
    }
  });

  return (
    <group ref={ref as any}>
      {/* Invisible collision cylinder */}
      <mesh visible={false}>
        <cylinderGeometry args={[0.4, 0.4, 1.8, 16]} />
        <meshBasicMaterial />
      </mesh>

      {/* Visual Model */}
      <group position={[0, -0.9, 0]}>
        {/* Torso Group (bobs up and down) */}
        <group ref={torso as any} position={[0, 1.1, 0]}>
          {/* Main Torso */}
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.6, 0.3]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.7} /> {/* Blue jacket */}
          </mesh>
          
          {/* Backpack */}
          <mesh position={[0, 0.05, -0.2]} castShadow>
            <boxGeometry args={[0.4, 0.45, 0.15]} />
            <meshStandardMaterial color="#b45309" roughness={0.9} /> {/* Brown leather */}
          </mesh>
          {/* Bedroll on backpack */}
          <mesh position={[0, -0.25, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.45, 8]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.9} /> {/* Green bedroll */}
          </mesh>

          {/* Head */}
          <group position={[0, 0.45, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.35, 0.35, 0.35]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.4} /> {/* Skin tone */}
            </mesh>
            
            {/* Beanie Hat */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.36, 0.15, 0.36]} />
              <meshStandardMaterial color="#ef4444" roughness={0.9} /> {/* Red beanie */}
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color="#ef4444" roughness={0.9} /> {/* Pom pom */}
            </mesh>
            
            {/* Face/Eyes indicator */}
            <mesh position={[0, 0.05, 0.18]} castShadow>
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color="#1f2937" /> {/* Sunglasses/Eyes */}
            </mesh>
          </group>

          {/* Left Arm */}
          <group position={[-0.35, 0.2, 0]} ref={leftArm as any}>
            <mesh position={[0, -0.25, 0]} castShadow>
              <boxGeometry args={[0.15, 0.6, 0.15]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.7} /> {/* Jacket sleeve */}
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.6, 0]} castShadow>
              <boxGeometry args={[0.12, 0.15, 0.12]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.4} />
            </mesh>
          </group>

          {/* Right Arm (Holding Flashlight) */}
          <group position={[0.35, 0.2, 0]} ref={rightArm as any}>
            <mesh position={[0, -0.25, 0]} castShadow>
              <boxGeometry args={[0.15, 0.6, 0.15]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.7} /> {/* Jacket sleeve */}
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.6, 0]} castShadow>
              <boxGeometry args={[0.12, 0.15, 0.12]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.4} />
            </mesh>
            {/* Flashlight */}
            <group position={[0, -0.6, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
                <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.04, 0.05, 8]} />
                <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Flashlight Beam */}
              <spotLight
                ref={flashlightRef}
                position={[0, 0.15, 0]}
                angle={0.5}
                penumbra={0.5}
                intensity={0}
                distance={20}
                color="#fef08a"
                castShadow
              />
              {/* Volumetric cone fake */}
              <mesh position={[0, 2.15, 0]} ref={flashlightConeRef}>
                <cylinderGeometry args={[1.5, 0.05, 4, 16]} />
                <meshBasicMaterial color="#fef08a" transparent opacity={0} depthWrite={false} blending={2} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Left Leg */}
        <group position={[-0.15, 0.8, 0]} ref={leftLeg as any}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.2, 0.7, 0.2]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} /> {/* Dark pants */}
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.75, 0.05]} castShadow>
            <boxGeometry args={[0.22, 0.15, 0.3]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} /> {/* Brown boots */}
          </mesh>
        </group>

        {/* Right Leg */}
        <group position={[0.15, 0.8, 0]} ref={rightLeg as any}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.2, 0.7, 0.2]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} /> {/* Dark pants */}
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.75, 0.05]} castShadow>
            <boxGeometry args={[0.22, 0.15, 0.3]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} /> {/* Brown boots */}
          </mesh>
        </group>
      </group>
    </group>
  );
}
