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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Institutional Identity & Station Selector */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider flex-shrink-0">
            NCPOR
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Ministry of Earth Sciences, Government of India
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {station.expeditionNumber}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-0.5">
              <select
                aria-label="Select research station"
                value={currentStation}
                onChange={(e) => onSelectStation(e.target.value as StationId)}
                className="font-bold text-slate-900 text-base bg-transparent hover:bg-slate-50 border-b border-slate-300 focus:outline-none focus:border-slate-800 cursor-pointer pr-2 py-0.5"
              >
                <option value="bharati">Bharati Station (Larsemann Hills, Antarctica)</option>
                <option value="maitri">Maitri Station (Schirmacher Oasis, Antarctica)</option>
                <option value="himansh">Himansh Station (Spiti Valley, Himalayas)</option>
                <option value="himadri">Himadri Station (Svalbard, Arctic)</option>
              </select>
              <span className="text-xs text-slate-400 font-mono hidden lg:inline">
                {station.coordinates}
              </span>
            </div>
          </div>
        </div>

        {/* Quiet Clocks, Link State, and Single Primary Action */}
        <div className="flex items-center gap-3 self-end md:self-center">
          
          {/* Dual Clocks */}
          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Station</span>
              <span className="font-semibold">{stationTimeStr}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold">HQ</span>
              <span>{hqTimeStr} IST</span>
            </div>
          </div>

          {/* Satellite Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-600 font-medium">
            {networkMode === 'online' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Uplink Nominal</span>
              </>
            )}
            {networkMode === 'patchy' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Iridium 2.4k</span>
              </>
            )}
            {networkMode === 'blackout' && (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>Partitioned</span>
              </>
            )}
            {pendingSyncCount > 0 && (
              <span className="ml-1 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 rounded">
                {pendingSyncCount} queued
              </span>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewLogModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Note</span>
          </button>

        </div>

      </div>
    </header>
  );
};
