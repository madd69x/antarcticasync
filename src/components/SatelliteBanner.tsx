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
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      
      {/* Status Info */}
      <div className="flex items-start sm:items-center gap-3">
        <div className="mt-0.5 sm:mt-0 flex-shrink-0">
          {networkMode === 'online' && (
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Wifi className="w-4 h-4" />
            </div>
          )}
          {networkMode === 'patchy' && (
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
          )}
          {networkMode === 'blackout' && (
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <WifiOff className="w-4 h-4" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900">
              {networkMode === 'online' && 'Satellite Link Connected (Inmarsat-C / Starlink)'}
              {networkMode === 'patchy' && 'Intermittent Narrowband (Iridium 2.4 kbps)'}
              {networkMode === 'blackout' && 'Polar Blizzard Blackout (Offline)'}
            </span>

            {pendingCount === 0 ? (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                ✓ All station records up to date
              </span>
            ) : (
              <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                ⏳ {pendingCount} update{pendingCount > 1 ? 's' : ''} saved locally on this machine
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {networkMode === 'online' && (
              'Continuous two-way telemetry synchronization active with Ministry of Earth Sciences cloud hub.'
            )}
            {networkMode === 'patchy' && (
              'Low-bandwidth mode active. High-priority safety updates take precedence; routine logs queued locally.'
            )}
            {networkMode === 'blackout' && (
              'No satellite contact. You can freely log entries and fuel readings — everything is preserved locally in your browser and will automatically replicate when the link recovers.'
            )}
          </p>
        </div>
      </div>

      {/* Simulator Controls & Sync Trigger */}
      <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
        {pendingCount > 0 && networkMode !== 'blackout' && (
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        )}

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-[11px] text-slate-400 font-medium px-1.5 hidden sm:inline">Simulate Link:</span>
          
          <button
            onClick={() => onSetNetworkMode('online')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              networkMode === 'online'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal
          </button>

          <button
            onClick={() => onSetNetworkMode('patchy')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              networkMode === 'patchy'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patchy (2.4k)
          </button>

          <button
            onClick={() => onSetNetworkMode('blackout')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              networkMode === 'blackout'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blackout
          </button>
        </div>
      </div>

    </div>
  );
};
