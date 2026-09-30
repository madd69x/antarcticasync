import React from 'react';
import type { NetworkLinkMode } from '../types';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface SatelliteBannerProps {
  networkMode: NetworkLinkMode;
  onSetNetworkMode: (mode: NetworkLinkMode) => void;
  pendingCount: number;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

export const SatelliteBanner: React.FC<SatelliteBannerProps> = ({
  networkMode,
  onSetNetworkMode,
  pendingCount,
  isSyncing,
  onTriggerSync
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
      
      {/* Status Info */}
      <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
        <div className="mt-0.5 sm:mt-0 flex-shrink-0 text-slate-600">
          {networkMode === 'online' && (
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
              <Wifi className="w-3.5 h-3.5 text-slate-800" />
            </div>
          )}
          {networkMode === 'patchy' && (
            <div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center border border-amber-200">
              <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
          )}
          {networkMode === 'blackout' && (
            <div className="w-7 h-7 rounded-md bg-rose-50 flex items-center justify-center border border-rose-200">
              <WifiOff className="w-3.5 h-3.5 text-rose-700" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-900">
              {networkMode === 'online' && 'Satellite Link Operational (LEO Burst Relay / Inmarsat)'}
              {networkMode === 'patchy' && 'Intermittent Narrowband (Iridium SBD 2.4 kbps)'}
              {networkMode === 'blackout' && 'Atmospheric Partition (Blizzard Blackout · Zero Satellite Link)'}
            </span>

            {pendingCount === 0 ? (
              <span className="text-[10px] sm:text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
                ✓ Local store synchronized · SHA-256 Verified
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] text-rose-900 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                ⚠️ [{pendingCount} mutation(s) buffered in Edge IndexedDB]
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-mono">
            <span>Bandwidth: <strong className="text-slate-700">{networkMode === 'online' ? '<64 kbps (Burst)' : networkMode === 'patchy' ? '2.4 kbps' : '0 kbps'}</strong></span>
            <span>•</span>
            <span>Latency: <strong className="text-slate-700">{networkMode === 'blackout' ? '0ms (Local)' : '>800ms (Sat)'}</strong></span>
            <span>•</span>
            <span className="hidden sm:inline">QoS: <strong className="text-slate-700">P0: SOS / ECG First</strong></span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            {networkMode === 'online' && (
              'Two-way differential replication active with NCPOR Central Hub in Goa via Brotli delta packaging.'
            )}
            {networkMode === 'patchy' && (
              'Narrowband constraint: Telemetry QoS prioritizes emergency life-support packets; routine records held in local queue.'
            )}
            {networkMode === 'blackout' && (
              'Zero satellite connectivity. All mutations write directly to on-device IndexedDB with vector clocks and will reconcile automatically when link recovers.'
            )}
          </p>
        </div>
      </div>

      {/* Simulator Controls & Sync Trigger */}
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        {pendingCount > 0 && networkMode !== 'blackout' && (
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 animate-pulse"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Transmitting Burst...' : `Transmit Queue (${pendingCount})`}</span>
          </button>
        )}

        <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-1.5 hidden lg:inline">Link Simulator:</span>
          
          <button
            onClick={() => onSetNetworkMode('online')}
            className={`px-2.5 py-1 rounded text-xs transition-all text-center font-medium ${
              networkMode === 'online'
                ? 'bg-white text-emerald-800 font-bold shadow-2xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟢 Nominal
          </button>

          <button
            onClick={() => onSetNetworkMode('patchy')}
            className={`px-2.5 py-1 rounded text-xs transition-all text-center font-medium ${
              networkMode === 'patchy'
                ? 'bg-white text-amber-800 font-bold shadow-2xs border border-amber-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟡 Narrowband
          </button>

          <button
            onClick={() => onSetNetworkMode('blackout')}
            className={`px-2.5 py-1 rounded text-xs transition-all text-center font-medium ${
              networkMode === 'blackout'
                ? 'bg-white text-rose-800 font-bold shadow-2xs border border-rose-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔴 Blackout
          </button>
        </div>
      </div>

    </div>
  );
};
