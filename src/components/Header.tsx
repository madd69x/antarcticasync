import React, { useState, useEffect } from 'react';
import type { StationId, NetworkLinkMode } from '../types';
import { STATIONS } from '../services/polarService';
import { Clock, Plus, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentStation: StationId;
  onSelectStation: (id: StationId) => void;
  onOpenNewLogModal: () => void;
  networkMode: NetworkLinkMode;
  pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStation,
  onSelectStation,
  onOpenNewLogModal,
  networkMode,
  pendingSyncCount
}) => {
  const station = STATIONS[currentStation];
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stationTimeStr = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const hqTimeStr = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        
        {/* Institutional Identity & Station Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Scientific Polar Grid Insignia */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center border border-slate-800 shadow-xs flex-shrink-0">
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-slate-100" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Polar coordinate rings */}
              <circle cx="12" cy="12" r="9.5" strokeOpacity="0.3" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="6" strokeOpacity="0.8" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              {/* Directional crosshairs */}
              <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" strokeOpacity="0.7" />
              {/* High-latitude azimuth needle */}
              <path d="m14 10-4 4" stroke="#38bdf8" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-wider truncate">
                NCPOR · MoES, India
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[9px] sm:text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                {station.expeditionNumber}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 min-w-0">
              <select
                aria-label="Select research station"
                value={currentStation}
                onChange={(e) => onSelectStation(e.target.value as StationId)}
                className="font-bold text-slate-900 text-sm sm:text-base bg-transparent hover:bg-slate-50 border-b border-slate-300 focus:outline-none focus:border-slate-800 cursor-pointer pr-2 py-0.5 max-w-full truncate"
              >
                <option value="bharati">Bharati Station (Antarctica)</option>
                <option value="maitri">Maitri Station (Antarctica)</option>
                <option value="himansh">Himansh Station (Himalayas)</option>
                <option value="himadri">Himadri Station (Arctic)</option>
              </select>
              <span className="text-xs text-slate-400 font-mono hidden lg:inline flex-shrink-0">
                {station.coordinates}
              </span>
            </div>
          </div>
        </div>

        {/* Quiet Clocks, Link State, and Primary Action Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 justify-between md:justify-end flex-wrap sm:flex-nowrap border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
          
          {/* Dual Clocks */}
          <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <div className="flex items-center gap-1 text-slate-700">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-sans font-semibold">STN</span>
              <span className="font-semibold">{stationTimeStr}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-sans font-semibold">HQ</span>
              <span>{hqTimeStr}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Satellite Status Pill */}
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600 font-medium whitespace-nowrap">
              {networkMode === 'online' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                  <span className="hidden sm:inline">Uplink Nominal</span>
                  <span className="sm:hidden text-[11px]">Online</span>
                </>
              )}
              {networkMode === 'patchy' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                  <span className="hidden sm:inline">Iridium 2.4k</span>
                  <span className="sm:hidden text-[11px]">Iridium</span>
                </>
              )}
              {networkMode === 'blackout' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-600 flex-shrink-0"></span>
                  <span className="hidden sm:inline">Partitioned</span>
                  <span className="sm:hidden text-[11px]">Offline</span>
                </>
              )}
              {pendingSyncCount > 0 && (
                <span className="ml-1 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 rounded">
                  {pendingSyncCount}
                </span>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewLogModal}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record<span className="hidden sm:inline">&nbsp;Note</span></span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
