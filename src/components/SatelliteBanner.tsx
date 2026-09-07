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
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      
      {/* Status Info */}
      <div className="flex items-start sm:items-center gap-3">
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

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-900">
              {networkMode === 'online' && 'Satellite Link Operational (Inmarsat-C / Polar Relay)'}
              {networkMode === 'patchy' && 'Intermittent Narrowband (Iridium 2.4 kbps)'}
              {networkMode === 'blackout' && 'Polar Atmospheric Partition (Offline)'}
            </span>

            {pendingCount === 0 ? (
              <span className="text-[11px] text-slate-500 font-mono">
                [Local store synchronized]
              </span>
            ) : (
              <span className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded font-mono">
                [{pendingCount} mutation(s) held in local IndexedDB]
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5">
            {networkMode === 'online' && (
              'Two-way differential replication active with NCPOR Central Hub in Goa.'
            )}
            {networkMode === 'patchy' && (
              'Narrowband constraint: Life-support alerts prioritize transmission; routine records held in local queue.'
            )}
            {networkMode === 'blackout' && (
              'Zero satellite connectivity. All mutations write directly to on-device IndexedDB and will reconcile automatically when link recovers.'
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Transmitting...' : 'Transmit Queue'}</span>
          </button>
        )}

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 hidden sm:inline">Link Simulation:</span>
          
          <button
            onClick={() => onSetNetworkMode('online')}
            className={`px-2 py-0.5 rounded text-xs transition-all ${
              networkMode === 'online'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nominal
          </button>

          <button
            onClick={() => onSetNetworkMode('patchy')}
            className={`px-2 py-0.5 rounded text-xs transition-all ${
              networkMode === 'patchy'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Narrowband
          </button>

          <button
            onClick={() => onSetNetworkMode('blackout')}
            className={`px-2 py-0.5 rounded text-xs transition-all ${
              networkMode === 'blackout'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Partitioned
          </button>
        </div>
      </div>

    </div>
  );
};
