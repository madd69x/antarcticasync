import React, { useState, useEffect } from 'react';
import type { StationId, ConvoyTraverse } from '../types';
import { ACTIVE_CONVOY, STATIONS } from '../services/polarService';
import { MapPin, Navigation, Radio, Satellite, Compass, ShieldAlert, Truck } from 'lucide-react';

interface PolarMapViewProps {
  currentStation: StationId;
  onSelectStation: (id: StationId) => void;
}

export const PolarMapView: React.FC<PolarMapViewProps> = ({
  currentStation,
  onSelectStation
}) => {
  const [convoy, setConvoy] = useState<ConvoyTraverse>(ACTIVE_CONVOY);
  const [nextPassSeconds, setNextPassSeconds] = useState(745); // ~12 mins

  // Satellite pass countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNextPassSeconds(prev => (prev > 1 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="space-y-5">
      
      {/* Masthead */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                Antarctic Geographic Information System (GIS)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Azimuthal Stereographic Polar Projection</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Indian Research Stations &amp; Deep-Ice Convoy Traverses
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Satellite className="w-4 h-4 text-purple-600 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Next Iridium-NEXT Pass</div>
              <div className="font-bold text-slate-800 font-mono">{formatCountdown(nextPassSeconds)} (Window: 8 min)</div>
            </div>
          </div>
        </div>

        {/* Polar Projection Map Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
          
          {/* Map Visualizer (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between min-h-[380px] text-white">
            
            {/* Compass & Projection Header */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Compass className="w-4 h-4" />
                <span>South Pole Centric (70°S - 90°S Grid)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                WGS-84 Antarctic Polar Stereo
              </span>
            </div>

            {/* SVG Polar Grid & Station Markers */}
            <div className="relative my-6 flex items-center justify-center">
              <svg viewBox="0 0 500 360" className="w-full max-h-[300px] select-none">
                {/* Latitude Rings */}
                <circle cx="250" cy="180" r="160" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="250" cy="180" r="110" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                <circle cx="250" cy="180" r="60" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                
                {/* Lat labels */}
                <text x="254" y="30" fill="#64748b" fontSize="9" fontFamily="monospace">70°S</text>
                <text x="254" y="80" fill="#64748b" fontSize="9" fontFamily="monospace">80°S</text>
                <text x="254" y="176" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">South Pole (90°S)</text>
                <circle cx="250" cy="180" r="3" fill="#94a3b8" />

                {/* Continental Ice Shelf Silhouette representation */}
                <path
                  d="M 120 180 Q 150 90 250 80 Q 360 80 400 160 Q 420 240 330 290 Q 230 310 140 250 Z"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />

                {/* Indian Station 1: Bharati (Larsemann Hills, 69°S 76°E - East Antarctica) */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => onSelectStation('bharati')}
                >
                  <circle cx="370" cy="120" r="8" fill="#0284c7" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="370" cy="120" r="5" fill="#38bdf8" />
                  <text x="382" y="118" fill="#e0f2fe" fontSize="11" fontWeight="bold">Bharati Station</text>
                  <text x="382" y="129" fill="#7dd3fc" fontSize="9" fontFamily="monospace">69°24′S 76°11′E (Active)</text>
                </g>

                {/* Indian Station 2: Maitri (Schirmacher Oasis, 70°S 11°E - Queen Maud Land) */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => onSelectStation('maitri')}
                >
                  <circle cx="160" cy="130" r="8" fill="#10b981" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="160" cy="130" r="5" fill="#34d399" />
                  <text x="90" y="125" fill="#ecfdf5" fontSize="11" fontWeight="bold">Maitri Station</text>
                  <text x="80" y="136" fill="#6ee7b7" fontSize="9" fontFamily="monospace">70°45′S 11°44′E</text>
                </g>

                {/* Historical Dakshin Gangotri (70°S 12°E) */}
                <g className="cursor-default opacity-70">
                  <circle cx="180" cy="150" r="3" fill="#94a3b8" />
                  <text x="190" y="153" fill="#94a3b8" fontSize="9">Dakshin Gangotri (Historical)</text>
                </g>

                {/* Convoy Traverse Route from Bharati Inland */}
                <path
                  d="M 370 120 Q 350 145 325 160"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                
                {/* Active Convoy Marker */}
                <g className="animate-pulse">
                  <circle cx="325" cy="160" r="6" fill="#f59e0b" />
                  <text x="336" y="164" fill="#fef3c7" fontSize="10" fontWeight="bold">PB-01 Convoy</text>
                  <text x="336" y="175" fill="#fde68a" fontSize="8" fontFamily="monospace">64 km inland</text>
                </g>
              </svg>
            </div>

            {/* Map Legend */}
            <div className="flex items-center justify-between z-10 text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Bharati (Selected)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Maitri</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Active PistenBully Convoy</span>
              </div>
              <span className="font-mono text-cyan-300">Scale: 1:5,000,000</span>
            </div>

          </div>

          {/* Right Column: Convoy Telemetry Details & Scalability */}
          <div className="space-y-4">
            
            {/* Active Inland Convoy Card */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Active Traverse Convoy
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  VHF: Nominal
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Mission Name</span>
                  <strong className="text-slate-900">{convoy.name}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-slate-400 block">Lead Unit:</span>
                    <strong className="text-slate-800 font-mono">{convoy.leadVehicle}</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-slate-400 block">Current Speed:</span>
                    <strong className="text-slate-800 font-mono">{convoy.speedKmh} km/h</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-slate-400 block">Distance from Base:</span>
                    <strong className="text-slate-800 font-mono">{convoy.distanceFromBaseKm} km / {convoy.totalDistanceKm} km</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-amber-200">
                    <span className="text-slate-400 block">Fuel on-board:</span>
                    <strong className="text-slate-800 font-mono">{convoy.fuelOnBoardLitres} L (ATF)</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 pt-1">
                  Crew on-board: <strong>{convoy.crewMembers.join(', ')}</strong>
                </div>
              </div>
            </div>

            {/* Proof of Scalability: Himalayan Station Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Scalability Proof · Himalayas</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">13,500 ft</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Himansh Research Station</h4>
              <p className="text-xs text-slate-500">
                Chandra Basin, Spiti Valley, Himachal Pradesh. Running the exact same AntarcticaSync offline architecture over solar microgrids.
              </p>
              <button
                onClick={() => onSelectStation('himansh')}
                className="w-full mt-2 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Switch View to Himansh Station
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
