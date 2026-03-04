import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { DirectionalLight, Color, AmbientLight, FogExp2, Mesh, Points } from 'three';
import { Sky, Stars } from '@react-three/drei';

export function DayNightCycle({ enableShadows, graphicsQuality }: any) {
  const sunRef = useRef<DirectionalLight>(null);
  const ambientRef = useRef<AmbientLight>(null);
  const skyRef = useRef<any>(null);
  const starsRef = useRef<any>(null);

  useFrame(({ clock, scene }) => {
    const t = clock.getElapsedTime() * 0.05; // Speed of cycle
    
    // Sun position (circular path, much larger radius for long shadows)
    const radius = 500;
    const sunX = Math.cos(t) * radius;
    const sunY = Math.sin(t) * radius;
    const sunZ = Math.sin(t * 0.5) * 200; // Wobble

    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, sunZ);
      
      const dayColor = new Color('#ffffff');
      const sunsetColor = new Color('#ff7b00');
      const nightColor = new Color('#1a2b4c');

      let currentColor = new Color();
      if (sunY > 100) {
        currentColor.lerpColors(sunsetColor, dayColor, (sunY - 100) / 400);
        sunRef.current.intensity = 2.5;
      } else if (sunY > 0) {
        currentColor.lerpColors(nightColor, sunsetColor, sunY / 100);
        sunRef.current.intensity = 1.5 + (sunY / 100);
      } else {
        currentColor = nightColor;
        sunRef.current.intensity = 0.5; // Moon light
      }
      
      sunRef.current.color.copy(currentColor);
    }

    if (ambientRef.current) {
      const ambientDay = new Color('#ffffff');
      const ambientSunset = new Color('#ffb37b'); // Warm sunset ambient
      const ambientNight = new Color('#0a1931'); // Cooler, slightly brighter night ambient

      let currentAmbient = new Color();
      if (sunY > 100) {
        currentAmbient.lerpColors(ambientSunset, ambientDay, (sunY - 100) / 400);
        ambientRef.current.intensity = 0.4 + ((sunY - 100) / 400) * 0.4;
      } else if (sunY > -100) {
        currentAmbient.lerpColors(ambientNight, ambientSunset, (sunY + 100) / 200);
        ambientRef.current.intensity = 0.2 + ((sunY + 100) / 200) * 0.2;
      } else {
        currentAmbient = ambientNight;
        ambientRef.current.intensity = 0.2;
      }
      ambientRef.current.color.copy(currentAmbient);
    }

    // Background color
    const bgDay = new Color('#87CEEB');
    const bgSunset = new Color('#ffb37b');
    const bgNight = new Color('#050505');
    
    let bgColor = new Color();
    if (sunY > 100) {
      bgColor.lerpColors(bgSunset, bgDay, (sunY - 100) / 400);
    } else if (sunY > -100) {
      bgColor.lerpColors(bgNight, bgSunset, (sunY + 100) / 200);
    } else {
      bgColor = bgNight;
    }
    scene.background = bgColor;

    // Add magical fog that matches the sky color
    if (!scene.fog) {
      scene.fog = new FogExp2(bgColor, 0.008);
    } else {
      (scene.fog as FogExp2).color.copy(bgColor);
    }

    // Update Sky and Stars
    if (skyRef.current && skyRef.current.material) {
      skyRef.current.material.uniforms.sunPosition.value.set(sunX, sunY, sunZ);
    }
    
    if (starsRef.current && starsRef.current.material) {
      // Fade stars out during the day, in during the night
      const starOpacity = Math.max(0, Math.min(1, (-sunY + 100) / 200));
      starsRef.current.material.transparent = true;
      starsRef.current.material.opacity = starOpacity;
    }
  });

  return (
    <>
      <Sky ref={skyRef} distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight ref={ambientRef} />
      <directionalLight 
        ref={sunRef}
        castShadow={enableShadows} 
        shadow-mapSize={graphicsQuality === 'high' ? [4096, 4096] : graphicsQuality === 'medium' ? [2048, 2048] : [1024, 1024]}
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
        shadow-camera-near={0.1}
        shadow-camera-far={1500}
        shadow-bias={-0.0005}
      />
    </>
  );
}
