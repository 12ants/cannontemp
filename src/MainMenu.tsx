import React from 'react';

export function MainMenu({ 
  onStart, 
  graphicsQuality, 
  setGraphicsQuality,
  enableShadows,
  setEnableShadows,
  enablePostProcessing,
  setEnablePostProcessing,
  enableParticles,
  setEnableParticles,
  worldSeed,
  setWorldSeed,
  worldHeight,
  setWorldHeight,
  worldRoughness,
  setWorldRoughness,
  carType,
  setCarType,
  CAR_CONFIGS
}: any) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md text-white font-mono overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <h1 className="text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tighter">
          PROCEDURAL DRIVE
        </h1>
        <p className="text-zinc-400 mb-12 tracking-widest uppercase text-sm">Explore the infinite</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          {/* Left Column: World & Vehicle */}
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h2 className="text-xl font-bold mb-4 text-emerald-400">World Generation</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1 uppercase">
                    <span>Seed</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={worldSeed} 
                      onChange={(e) => setWorldSeed(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button 
                      onClick={() => setWorldSeed(Math.floor(Math.random() * 10000))}
                      className="px-4 py-2 text-sm rounded-lg border bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                      Random
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1 uppercase">
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

                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1 uppercase">
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
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h2 className="text-xl font-bold mb-4 text-emerald-400">Vehicle Selection</h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CAR_CONFIGS).map(([key, c]: any) => (
                  <button
                    key={key}
                    onClick={() => setCarType(key)}
                    className={`py-2 px-3 text-xs rounded-lg border transition-all ${carType === key ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-black/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Graphics & Performance */}
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 h-full">
              <h2 className="text-xl font-bold mb-4 text-emerald-400">Graphics & Performance</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-zinc-400 mb-2 uppercase">Quality Preset</div>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setGraphicsQuality(q)}
                        className={`flex-1 py-2 text-xs rounded-lg border transition-all capitalize ${graphicsQuality === q ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-black/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600'}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2">
                    {graphicsQuality === 'low' && 'Best performance. Lower resolution, no anti-aliasing.'}
                    {graphicsQuality === 'medium' && 'Balanced. Good resolution and performance.'}
                    {graphicsQuality === 'high' && 'Best visuals. High resolution, requires strong GPU.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/5">
                    <div>
                      <div className="text-sm text-white">Shadows</div>
                      <div className="text-[10px] text-zinc-500">Dynamic sun and object shadows</div>
                    </div>
                    <button 
                      onClick={() => setEnableShadows(!enableShadows)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${enableShadows ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enableShadows ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/5">
                    <div>
                      <div className="text-sm text-white">Post-Processing</div>
                      <div className="text-[10px] text-zinc-500">Bloom, Ambient Occlusion, Vignette</div>
                    </div>
                    <button 
                      onClick={() => setEnablePostProcessing(!enablePostProcessing)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${enablePostProcessing ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enablePostProcessing ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/5">
                    <div>
                      <div className="text-sm text-white">Particle Effects</div>
                      <div className="text-[10px] text-zinc-500">Dust, smoke, and environmental particles</div>
                    </div>
                    <button 
                      onClick={() => setEnableParticles(!enableParticles)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${enableParticles ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enableParticles ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full md:w-auto px-16 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95"
        >
          START ENGINE
        </button>
      </div>
    </div>
  );
}
