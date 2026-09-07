import React, { useState } from 'react';
import type { StationId } from '../types';
import { Send, Ship, Radio } from 'lucide-react';

interface HqCoordinationViewProps {
  onSelectStation: (id: StationId) => void;
  onBroadcastMessage: (msg: string) => void;
}

export const HqCoordinationView: React.FC<HqCoordinationViewProps> = ({
  onSelectStation,
  onBroadcastMessage
}) => {
  const [broadcastText, setBroadcastText] = useState('');
  const [dispatchedMessages, setDispatchedMessages] = useState<string[]>([
    'HQ-01: Approved scheduled changeover to DG-2 for Bharati Station maintenance window.',
    'HQ-02: Satellite telemetry tracking low-pressure katabatic trough south of Maitri; secure auxiliary solar masts.'
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setDispatchedMessages([`HQ-${dispatchedMessages.length + 1}: ${broadcastText.trim()}`, ...dispatchedMessages]);
    onBroadcastMessage(broadcastText.trim());
    setBroadcastText('');
  };

  return (
    <div className="space-y-4">
      
      {/* Masthead */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              National Centre for Polar and Ocean Research (NCPOR)
            </span>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-0.5">
              Polar Strategic Command &amp; Multi-Station Operations Desk (Goa)
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs font-mono">
            <Ship className="w-3.5 h-3.5 text-slate-600" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold block">Summer Resupply Voyage</span>
              <span className="font-bold text-slate-800">MV Vasiliy Golovnin · 42 Days to Departure</span>
            </div>
          </div>
        </div>

        {/* Station Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          
          {/* Bharati */}
          <div className="p-3.5 rounded border border-slate-300 bg-slate-50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Station 01 · Larsemann Hills</span>
                <h3 className="font-bold text-slate-900 text-sm">Bharati Station</h3>
                <span className="text-[11px] font-mono text-slate-500">69°24′S 76°11′E · 24 crew</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold border border-emerald-200">
                Operational
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Fuel</span>
                <strong className="text-slate-800">62 Days</strong>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Load</span>
                <strong className="text-slate-800">76.5 kW</strong>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Temp</span>
                <strong className="text-slate-800">-28°C</strong>
              </div>
            </div>

            <button
              onClick={() => onSelectStation('bharati')}
              className="w-full py-1 text-xs font-semibold rounded bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              Switch Field View to Bharati
            </button>
          </div>

          {/* Maitri */}
          <div className="p-3.5 rounded border border-slate-200 bg-white space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Station 02 · Schirmacher Oasis</span>
                <h3 className="font-bold text-slate-900 text-sm">Maitri Station</h3>
                <span className="text-[11px] font-mono text-slate-500">70°45′S 11°44′E · 21 crew</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold border border-emerald-200">
                Operational
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Fuel</span>
                <strong className="text-slate-800">71 Days</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Load</span>
                <strong className="text-slate-800">68.0 kW</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Temp</span>
                <strong className="text-slate-800">-32°C</strong>
              </div>
            </div>

            <button
              onClick={() => onSelectStation('maitri')}
              className="w-full py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-900 text-white transition-colors"
            >
              Switch Field View to Maitri
            </button>
          </div>

          {/* Himansh */}
          <div className="p-3.5 rounded border border-slate-200 bg-white space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Station 03 · Spiti Himalayas</span>
                <h3 className="font-bold text-slate-900 text-sm">Himansh Station</h3>
                <span className="text-[11px] font-mono text-slate-500">32°24′N 77°37′E · 6 crew</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">
                High Altitude
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Pressure</span>
                <strong className="text-slate-800">615 hPa</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Solar</span>
                <strong className="text-slate-800">88% Batt</strong>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[9px] text-slate-400 block font-sans">Temp</span>
                <strong className="text-slate-800">-18°C</strong>
              </div>
            </div>

            <button
              onClick={() => onSelectStation('himansh')}
              className="w-full py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-900 text-white transition-colors"
            >
              Switch Field View to Himansh
            </button>
          </div>

        </div>
      </div>

      {/* Directives Broadcast Console */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Radio className="w-3.5 h-3.5 text-slate-600" />
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            NCPOR Operational Directives &amp; Broadcast Dispatch
          </h3>
        </div>

        <form onSubmit={handleSendBroadcast} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter official directive or advisory to transmit to polar stations..."
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-800"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>Transmit</span>
          </button>
        </form>

        <div className="space-y-1.5 pt-1">
          {dispatchedMessages.map((msg, idx) => (
            <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-mono">
              {msg}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
