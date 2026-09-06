import React from 'react';
import type { StationId } from '../types';
import { STATIONS } from '../services/polarService';
import { Database, Clock, GitMerge, AlertOctagon, Flame, Download, Award, Leaf, HeartPulse } from 'lucide-react';

interface HeaderProps {
  currentStation: StationId;
  onSelectStation: (id: StationId) => void;
  onOpenSyncInspector: () => void;
  onOpenCrdtPlayground: () => void;
  onOpenBlizzardLockdown: () => void;
  onOpenSurvivalSimulator: () => void;
  onOpenDataExport: () => void;
  onOpenJudgeTour: () => void;
  onOpenMadridEco: () => void;
  onOpenTelemedicine: () => void;
  pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStation,
  onSelectStation,
  onOpenSyncInspector,
  onOpenCrdtPlayground,
  onOpenBlizzardLockdown,
  onOpenSurvivalSimulator,
  onOpenDataExport,
  onOpenJudgeTour,
  onOpenMadridEco,
  onOpenTelemedicine,
  pendingSyncCount
}) => {
  const station = STATIONS[currentStation];
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stationTimeStr = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const hqTimeStr = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left: Branding & Station Selector */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0">
            🇮🇳
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Ministry of Earth Sciences · NCPOR Goa
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {station.expeditionNumber}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-0.5">
              <select
                aria-label="Select research station"
                value={currentStation}
                onChange={(e) => onSelectStation(e.target.value as StationId)}
                className="font-bold text-slate-900 text-sm sm:text-base bg-transparent hover:bg-slate-50 border-b border-dashed border-slate-400 focus:outline-none focus:border-blue-600 cursor-pointer pr-1"
              >
                <option value="bharati">Bharati Station (Larsemann Hills, Antarctica)</option>
                <option value="maitri">Maitri Station (Schirmacher Oasis, Antarctica)</option>
                <option value="himansh">Himansh Station (Spiti, 13,500ft Himalayas)</option>
                <option value="himadri">Himadri Station (Svalbard, Arctic)</option>
              </select>
              <span className="text-xs text-slate-400 hidden xl:inline">
                {station.coordinates}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Pitch Tools & Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap self-end md:self-center">
          
          {/* Judge Tour Button (Highlight Gold) */}
          <button
            onClick={onOpenJudgeTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 text-xs font-bold shadow-xs transition-all animate-pulse"
            title="Start 3-Minute SIH Judge Pitch Walkthrough"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>Judge Pitch Tour</span>
          </button>

          {/* CRDT Playground Button */}
          <button
            onClick={onOpenCrdtPlayground}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold transition-colors"
            title="Live Split-Screen CRDT Conflict & Merge Proof"
          >
            <GitMerge className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">CRDT</span> Playground
          </button>

          {/* Blizzard Protocol Button */}
          <button
            onClick={onOpenBlizzardLockdown}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition-colors"
            title="Trigger Blizzard Code Red Emergency"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Blizzard</span> Protocol
          </button>

          {/* Fuel Simulator */}
          <button
            onClick={onOpenSurvivalSimulator}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors"
            title="Dynamic Fuel Burn Simulator"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Fuel</span> Simulator
          </button>

          {/* Madrid Eco */}
          <button
            onClick={onOpenMadridEco}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
            title="Madrid Protocol Clean Microgrid & Waste Ledger"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Madrid</span> Eco
          </button>

          {/* Telemedicine */}
          <button
            onClick={onOpenTelemedicine}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
            title="Offline AIIMS Telemedicine Consult"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">AIIMS</span> Telemed
          </button>

          {/* SCAR Exporter */}
          <button
            onClick={onOpenDataExport}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            title="Export SCAR Open Science Telemetry"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden lg:inline">SCAR</span> Export
          </button>

          {/* Storage Inspector */}
          <button
            onClick={onOpenSyncInspector}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            title="Inspect local database & sync queue"
          >
            <Database className="w-3.5 h-3.5 text-slate-600" />
            {pendingSyncCount > 0 && (
              <span className="bg-amber-100 text-amber-800 font-mono text-[10px] font-bold px-1.5 rounded-full">
                {pendingSyncCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
