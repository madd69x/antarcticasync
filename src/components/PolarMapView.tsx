import React, { useState, useEffect } from 'react';
import type { StationId, ConvoyTraverse } from '../types';
import { ACTIVE_CONVOY, STATIONS } from '../services/polarService';
import { Compass, Satellite, Navigation, Truck } from 'lucide-react';

interface PolarMapViewProps {
  currentStation: StationId;
  onSelectStation: (id: StationId) => void;
}

export const PolarMapView: React.FC<PolarMapViewProps> = ({
  currentStation,
  onSelectStation
}) => {
  const [convoy, setConvoy] = useState<ConvoyTraverse>(ACTIVE_CONVOY);
  const [nextPassSeconds, setNextPassSeconds] = useState(745);

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
    <div className="space-y-4">
      
      {/* Masthead */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Antarctic Geographic Information System (GIS)
            </span>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-0.5">
              Azimuthal South Polar Stereographic Projection (70°S - 90°S)
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs font-mono self-start sm:self-auto">
            <Satellite className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-sans font-semibold block">Next Orbital Window:</span>
              <span className="font-bold text-slate-800">{formatCountdown(nextPassSeconds)} (Iridium-NEXT)</span>
            </div>
          </div>
        </div>

        {/* Polar Projection Map & Traverses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mt-3">
          
          {/* Map Visualizer (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-lg p-3 sm:p-4 relative overflow-hidden flex flex-col justify-between min-h-[340px] sm:min-h-[380px] text-white">
            
            <div className="flex justify-between items-center z-10 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono text-slate-300">
                <Compass className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="truncate">Polar Stereo WGS-84</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                True South 90°S
              </span>
            </div>

            <div className="relative my-3 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 500 360" className="w-full max-h-[260px] sm:max-h-[300px] select-none">
                {/* Latitude Rings */}
                <circle cx="250" cy="180" r="160" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="250" cy="180" r="110" fill="none" stroke="#1e293b" strokeWidth="1" />
                <circle cx="250" cy="180" r="60" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Lat labels */}
                <text x="254" y="28" fill="#64748b" fontSize="9" fontFamily="monospace">70°S</text>
                <text x="254" y="78" fill="#64748b" fontSize="9" fontFamily="monospace">80°S</text>
                <text x="254" y="176" fill="#cbd5e1" fontSize="10" fontFamily="monospace" fontWeight="bold">South Pole (90°S)</text>
                <circle cx="250" cy="180" r="2.5" fill="#cbd5e1" />

                {/* Continental Silhouette */}
                <path
                  d="M 120 180 Q 150 90 250 80 Q 360 80 400 160 Q 420 240 330 290 Q 230 310 140 250 Z"
                  fill="#0b1120"
                  stroke="#475569"
                  strokeWidth="1.2"
                />

                {/* Station: Bharati */}
                <g 
                  className="cursor-pointer"
                  onClick={() => onSelectStation('bharati')}
                >
                  <circle cx="370" cy="120" r="6" fill="#38bdf8" />
                  <text x="382" y="118" fill="#f8fafc" fontSize="10" fontWeight="bold">Bharati Station</text>
                  <text x="382" y="128" fill="#94a3b8" fontSize="8" fontFamily="monospace">69°24′S 76°11′E</text>
                </g>

                {/* Station: Maitri */}
                <g 
                  className="cursor-pointer"
                  onClick={() => onSelectStation('maitri')}
                >
                  <circle cx="160" cy="130" r="6" fill="#34d399" />
                  <text x="95" y="125" fill="#f8fafc" fontSize="10" fontWeight="bold">Maitri Station</text>
                  <text x="85" y="135" fill="#94a3b8" fontSize="8" fontFamily="monospace">70°45′S 11°44′E</text>
                </g>

                {/* Historical: Dakshin Gangotri */}
                <g className="cursor-default opacity-60">
                  <circle cx="180" cy="150" r="3" fill="#64748b" />
                  <text x="190" y="153" fill="#64748b" fontSize="8">Dakshin Gangotri</text>
                </g>

                {/* Convoy Traverse Route */}
                <path
                  d="M 370 120 Q 350 145 325 160"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                
                {/* Active Convoy Marker */}
                <g>
                  <circle cx="325" cy="160" r="5" fill="#f59e0b" />
                  <text x="335" y="163" fill="#fef3c7" fontSize="9" fontWeight="bold">PB-01 Convoy</text>
                  <text x="335" y="173" fill="#cbd5e1" fontSize="8" fontFamily="monospace">64.2 km inland</text>
                </g>
              </svg>
            </div>

            {/* Quick Station Tap Buttons for Mobile Thumb Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x pb-2 pt-1 border-t border-slate-800 text-[11px] font-mono">
              <span className="text-slate-400 mr-1 text-[10px] uppercase">Focus:</span>
              <button
                onClick={() => onSelectStation('bharati')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  currentStation === 'bharati' ? 'bg-sky-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Bharati
              </button>
              <button
                onClick={() => onSelectStation('maitri')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  currentStation === 'maitri' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Maitri
              </button>
              <button
                onClick={() => onSelectStation('himansh')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  currentStation === 'himansh' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Himansh
              </button>
            </div>

            <div className="flex items-center justify-between z-10 text-[10px] sm:text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex-wrap gap-2 font-mono">
              <div className="flex items-center gap-3">
                <span>Scale: 1:5,000,000</span>
                <span>Projection: Polar WGS-84</span>
              </div>
              <span className="text-slate-400">PB-01 Traverse Active</span>
            </div>

          </div>

          {/* Right Column: Convoy Telemetry Details & Scalability */}
          <div className="space-y-3">
            
            {/* Active Inland Convoy Card */}
            <div className="p-3.5 rounded border border-slate-200 bg-white space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Active Inland Traverse
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  VHF: Nominal
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mission Designation</span>
                  <strong className="text-slate-900">{convoy.name}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">Lead Unit:</span>
                    <strong className="text-slate-800">{convoy.leadVehicle}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">Traverse Speed:</span>
                    <strong className="text-slate-800">{convoy.speedKmh} km/h</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">Distance from Base:</span>
                    <strong className="text-slate-800">{convoy.distanceFromBaseKm} km / {convoy.totalDistanceKm} km</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-sans font-semibold">Fuel on-board:</span>
                    <strong className="text-slate-800">{convoy.fuelOnBoardLitres} L (ATF)</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 pt-1">
                  Crew: <strong>{convoy.crewMembers.join(', ')}</strong>
                </div>
              </div>
            </div>

            {/* Himalayan Scalability Reference */}
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">High-Altitude Cryosphere</span>
                <span className="text-[10px] font-mono text-slate-600 bg-white px-1.5 rounded border border-slate-200">13,500 ft</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Himansh Research Station</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Chandra Basin, Spiti Valley, Himachal Pradesh. Running the exact same offline-first architecture over high-altitude solar microgrids.
              </p>
              <button
                onClick={() => onSelectStation('himansh')}
                className="w-full mt-1.5 py-1 text-xs font-semibold rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition-colors"
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
