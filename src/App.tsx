import { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, Debug } from '@react-three/cannon';
import { Environment, OrbitControls, AdaptiveDpr, AdaptiveEvents, Bvh } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping, N8AO } from '@react-three/postprocessing';
import { Vehicle } from './Vehicle';
import { Ground } from './Ground';
import { ProceduralWorld } from './ProceduralWorld';
import { RuralTown, StartingArea } from './Terrain';
import { DayNightCycle } from './DayNightCycle';
import { DebugWindow } from './DebugWindow';
import { Effects } from './Effects';
import { Joystick } from './Joystick';
import { Player } from './Player';
import { debugData } from './store';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MainMenu } from './MainMenu';

const CAR_CONFIGS = {
  volvo: { radius: 0.5, width: 2.0, height: -0.2, front: 1.6, back: -1.4, force: 7000, name: 'Volvo 140' },
  sports: { radius: 0.4, width: 2.1, height: -0.1, front: 1.7, back: -1.6, force: 10000, name: '80s Sports' },
  muscle: { radius: 0.55, width: 2.1, height: -0.15, front: 1.8, back: -1.7, force: 9000, name: '60s Muscle' },
  soviet: { radius: 0.45, width: 1.9, height: -0.2, front: 1.5, back: -1.4, force: 5000, name: 'Soviet Classic' },
  euro: { radius: 0.35, width: 1.8, height: -0.15, front: 1.3, back: -1.2, force: 4000, name: 'Euro Compact' },
};

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [isDebug, setIsDebug] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(false);
  const [cameraMode, setCameraMode] = useState<'third-person' | 'first-person' | 'free'>('third-person');
  const [cameraDistance, setCameraDistance] = useState(10);
  const [cameraSensitivity, setCameraSensitivity] = useState(1);
  const [carType, setCarType] = useState<keyof typeof CAR_CONFIGS>('volvo');
  
  const [playerState, setPlayerState] = useState<'driving' | 'walking'>('driving');
  const [showSettings, setShowSettings] = useState(false);
  const [showControlsUI, setShowControlsUI] = useState(true);
  const [steeringType, setSteeringType] = useState<'buttons' | 'joystick'>('buttons');

  // Performance Settings
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [enableShadows, setEnableShadows] = useState(false);
  const [enablePostProcessing, setEnablePostProcessing] = useState(false);
  const [enableParticles, setEnableParticles] = useState(false);

  // World Creator Settings
  const [worldSeed, setWorldSeed] = useState(1337);
  const [worldHeight, setWorldHeight] = useState(1);
  const [worldRoughness, setWorldRoughness] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.key === 'Escape') {
          setShowSettings(prev => !prev);
        }
        if (e.key.toLowerCase() === 'c') {
          setIsDebug((prev) => !prev);
        }
        if (e.key.toLowerCase() === 'v') {
          setCameraMode((prev) => {
            if (prev === 'third-person') return 'first-person';
            if (prev === 'first-person') return 'free';
            return 'third-person';
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const sceneContents = useMemo(() => (
    <>
      <Vehicle 
        key={carType} 
        carType={carType} 
        cameraMode={cameraMode} 
        cameraDistance={cameraDistance} 
        steeringType={steeringType}
        position={[0, 2, 200]} 
        rotation={[0, -Math.PI / 2, 0]} 
        angularVelocity={[0, 0, 0]} 
        isActive={playerState === 'driving'}
        onExitVehicle={() => setPlayerState('walking')}
        {...CAR_CONFIGS[carType]} 
      />
      {playerState === 'walking' && (
        <Player 
          position={[
            debugData.position[0] + 2, 
            debugData.position[1] + 1, 
            debugData.position[2]
          ]} 
          onEnterVehicle={() => setPlayerState('driving')} 
        />
      )}
      <ProceduralWorld 
        key={`${worldSeed}-${worldHeight}-${worldRoughness}`}
        size={128} 
        elementSize={16} 
        seed={worldSeed} 
        heightMultiplier={worldHeight} 
        roughnessMultiplier={worldRoughness} 
      />
      
      {/* Rural Town Environment */}
      <RuralTown position={[200, 0, 200]} />
      
      {/* Desolate Starting Area */}
      <StartingArea position={[0, 0, 0]} />
    </>
  ), [carType, cameraMode, cameraDistance, steeringType, playerState]);

  return (
    <div className="w-full h-screen bg-zinc-900">
      {gameState === 'menu' && (
        <MainMenu 
          onStart={() => setGameState('playing')}
          graphicsQuality={graphicsQuality}
          setGraphicsQuality={setGraphicsQuality}
          enableShadows={enableShadows}
          setEnableShadows={setEnableShadows}
          enablePostProcessing={enablePostProcessing}
          setEnablePostProcessing={setEnablePostProcessing}
          enableParticles={enableParticles}
          setEnableParticles={setEnableParticles}
          worldSeed={worldSeed}
          setWorldSeed={setWorldSeed}
          worldHeight={worldHeight}
          setWorldHeight={setWorldHeight}
          worldRoughness={worldRoughness}
          setWorldRoughness={setWorldRoughness}
          carType={carType}
          setCarType={setCarType}
          CAR_CONFIGS={CAR_CONFIGS}
        />
      )}

      {gameState === 'playing' && !showSettings && (
        <>
          <DebugWindow />
          {showControlsUI && (
            <div className="absolute top-4 left-4 z-10 text-white font-mono text-sm bg-black/50 p-4 rounded-xl pointer-events-auto shadow-lg border border-white/10">
              <button 
                onClick={() => setShowControlsUI(false)} 
                className="absolute top-2 right-2 text-zinc-400 hover:text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close Controls Guide"
              >
                ✕
              </button>
              <h1 className="text-xl font-bold mb-2 pr-6 text-emerald-400">3D Car Game</h1>
              <p className="mb-1"><span className="text-zinc-400">W/A/S/D:</span> Move / Drive</p>
              <p className="mb-1"><span className="text-zinc-400">Arrows:</span> Look Around</p>
              <p className="mb-1"><span className="text-zinc-400">Space:</span> Brake / Jump</p>
              <p className="mb-1"><span className="text-zinc-400">Shift:</span> Sprint (Walking)</p>
              <p className="mb-1"><span className="text-zinc-400">R:</span> Reset Position</p>
              <p className="mb-1"><span className="text-zinc-400">E / Enter:</span> {playerState === 'driving' ? 'Exit Vehicle' : 'Enter Vehicle'}</p>
              <p className="mb-1"><span className="text-zinc-400">C:</span> Toggle Collision</p>
              <p><span className="text-zinc-400">V:</span> Camera Mode</p>
            </div>
          )}
        </>
      )}
      <Canvas 
        shadows={enableShadows} 
        dpr={graphicsQuality === 'high' ? [1, 2] : graphicsQuality === 'medium' ? [1, 1.5] : [1, 1]} 
        performance={{ min: 0.5 }} 
        camera={{ position: [0, 5, 15], fov: 50 }}
      >
        <Bvh firstHitOnly>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          {cameraMode === 'free' && <OrbitControls makeDefault rotateSpeed={cameraSensitivity} />}
          
          <DayNightCycle enableShadows={enableShadows} graphicsQuality={graphicsQuality} />
          
          <Physics broadphase="SAP" gravity={[0, -9.81, 0]} isPaused={gameState === 'menu' || showSettings}>
            {isDebug ? <Debug>{sceneContents}</Debug> : sceneContents}
          </Physics>
          {enableParticles && <Effects />}

          <Environment preset="city" />
          {enablePostProcessing && (
            <EffectComposer>
              {graphicsQuality !== 'low' && <N8AO aoRadius={2} intensity={2} halfRes />}
              <Bloom luminanceThreshold={0.5} mipmapBlur intensity={2} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
              <ToneMapping />
            </EffectComposer>
          )}
        </Bvh>
      </Canvas>

      {/* Main Menu Overlay */}
      {playerState === 'walking' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 text-white px-6 py-3 rounded-full font-mono text-sm border border-white/20 backdrop-blur-md">
            Click to look around. Press E to enter vehicle.
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {gameState === 'playing' && showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md text-white font-mono p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 p-6 rounded-xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-emerald-400 tracking-wider">SETTINGS</h2>
              <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-white p-2">✕</button>
            </div>
            
            <div className="space-y-6">
              <button 
                onClick={() => {
                  setShowSettings(false);
                  setGameState('menu');
                }}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold tracking-wider transition-colors"
              >
                RETURN TO MAIN MENU
              </button>

              <div>
                <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wider">Vehicle</div>
                <div className="flex gap-2">
                  {Object.entries(CAR_CONFIGS).map(([key, c]) => (
                    <button
                      key={key}
                      onClick={() => setCarType(key as any)}
                      className={`flex-1 py-2 px-2 text-xs rounded border transition-colors ${carType === key ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                  <span>Controls Guide</span>
                  <button 
                    onClick={() => setShowControlsUI(prev => !prev)}
                    className={`px-3 py-1 rounded border transition-colors ${showControlsUI ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {showControlsUI ? 'SHOWN' : 'HIDDEN'}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                  <span>Touch Controls</span>
                  <button 
                    onClick={() => setShowTouchControls(prev => !prev)}
                    className={`px-3 py-1 rounded border transition-colors ${showTouchControls ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {showTouchControls ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
                {showTouchControls && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setSteeringType('buttons')}
                      className={`flex-1 py-2 px-2 text-xs rounded border transition-colors ${steeringType === 'buttons' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                      Buttons
                    </button>
                    <button
                      onClick={() => setSteeringType('joystick')}
                      className={`flex-1 py-2 px-2 text-xs rounded border transition-colors ${steeringType === 'joystick' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                      Joystick
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                  <span>Camera Distance</span>
                  <span className="text-emerald-400">{cameraDistance}</span>
                </div>
                <input 
                  type="range" min="5" max="20" step="1" 
                  value={cameraDistance} 
                  onChange={(e) => setCameraDistance(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                  <span>Free Cam Sensitivity</span>
                  <span className="text-emerald-400">{cameraSensitivity.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.1" max="3" step="0.1" 
                  value={cameraSensitivity} 
                  onChange={(e) => setCameraSensitivity(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wider">World Creator</div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">World Seed</span>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={worldSeed} 
                      onChange={(e) => setWorldSeed(parseInt(e.target.value) || 0)}
                      className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                    />
                    <button 
                      onClick={() => setWorldSeed(Math.floor(Math.random() * 10000))}
                      className="px-2 py-1 text-xs rounded border bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700"
                    >
                      Random
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                    <span>Mountain Height</span>
                    <span className="text-emerald-400">{worldHeight.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="0" max="3" step="0.1" 
                    value={worldHeight} 
                    onChange={(e) => setWorldHeight(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-zinc-400 mb-2 uppercase tracking-wider">
                    <span>Terrain Roughness</span>
                    <span className="text-emerald-400">{worldRoughness.toFixed(1)}x</span>
                  </div>
                  <input 
                    type="range" min="0" max="3" step="0.1" 
                    value={worldRoughness} 
                    onChange={(e) => setWorldRoughness(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wider">Performance & Graphics</div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">Graphics Quality</span>
                  <div className="flex gap-1">
                    {['low', 'medium', 'high'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setGraphicsQuality(q as any)}
                        className={`px-3 py-1 text-xs rounded border transition-colors capitalize ${graphicsQuality === q ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">Shadows</span>
                  <button 
                    onClick={() => setEnableShadows(prev => !prev)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${enableShadows ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {enableShadows ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">Post-Processing</span>
                  <button 
                    onClick={() => setEnablePostProcessing(prev => !prev)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${enablePostProcessing ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {enablePostProcessing ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">Particle Effects</span>
                  <button 
                    onClick={() => setEnableParticles(prev => !prev)}
                    className={`px-3 py-1 text-xs rounded border transition-colors ${enableParticles ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {enableParticles ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-Game HUD */}
      {gameState === 'playing' && !showSettings && (
        <>
          <button 
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 z-20 w-12 h-12 bg-zinc-800/50 backdrop-blur border border-zinc-600 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors shadow-lg"
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          {/* Touch Controls UI */}
          {showTouchControls && (
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end pointer-events-none">
              {/* Steering (Left Side) */}
              <div className="pointer-events-auto">
                {steeringType === 'joystick' ? (
                  <Joystick />
                ) : (
                  <div className="flex gap-4">
                    <button 
                      className="w-16 h-16 bg-zinc-800/80 backdrop-blur border-2 border-zinc-600 rounded-full flex items-center justify-center text-white active:bg-zinc-600 active:scale-95 transition-all select-none shadow-lg"
                      onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', key: 'ArrowLeft' }))}
                      onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft', key: 'ArrowLeft' }))}
                      onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft', key: 'ArrowLeft' }))}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button 
                      className="w-16 h-16 bg-zinc-800/80 backdrop-blur border-2 border-zinc-600 rounded-full flex items-center justify-center text-white active:bg-zinc-600 active:scale-95 transition-all select-none shadow-lg"
                      onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', key: 'ArrowRight' }))}
                      onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight', key: 'ArrowRight' }))}
                      onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight', key: 'ArrowRight' }))}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Pedals (Right Side) */}
              <div className="flex gap-4 pointer-events-auto">
                <button 
                  className="w-16 h-16 bg-red-900/80 backdrop-blur border-2 border-red-700 rounded-full flex items-center justify-center text-white active:bg-red-700 active:scale-95 transition-all select-none shadow-lg"
                  onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' }))}
                  onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' }))}
                  onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ' }))}
                >
                  <span className="font-bold text-xs uppercase">Brake</span>
                </button>
                <button 
                  className="w-16 h-24 bg-emerald-900/80 backdrop-blur border-2 border-emerald-700 rounded-full flex items-center justify-center text-white active:bg-emerald-700 active:scale-95 transition-all select-none shadow-lg"
                  onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp' }))}
                  onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp', key: 'ArrowUp' }))}
                  onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp', key: 'ArrowUp' }))}
                >
                  <span className="font-bold text-xs uppercase">Gas</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
