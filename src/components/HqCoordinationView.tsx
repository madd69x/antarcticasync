import React, { useState } from 'react';
import type { StationId } from '../types';
import { STATIONS } from '../services/polarService';
import { Send, Ship, MapPin, Radio, ShieldCheck, AlertCircle } from 'lucide-react';

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
    'HQ-02: Weather satellite tracking low-pressure system south of Maitri; advise securing lightweight solar arrays.'
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setDispatchedMessages([`HQ-${dispatchedMessages.length + 1}: ${broadcastText.trim()}`, ...dispatchedMessages]);
    onBroadcastMessage(broadcastText.trim());
    setBroadcastText('');
  };

  return (
    <div className="space-y-5">
      
      {/* MoES Polar Desk Masthead */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">NCPOR Central Polar Desk</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">Headland Sada, Vasco da Gama, Goa</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Indian Antarctic & Arctic Programme (IAAP) Strategic Overview
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Ship className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Summer Resupply Vessel</div>
              <div className="font-bold text-slate-800">MV Vasiliy Golovnin · In 42 Days</div>
            </div>
          </div>
        </div>

        {/* Station Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          
          {/* Bharati */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Station 01 · Larsemann Hills</span>
                <h3 className="font-bold text-slate-900 text-base">Bharati Station</h3>
                <p className="text-xs text-slate-500">69°24′S 76°11′E · 24 crew</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Nominal
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Fuel</div>
                <div className="font-bold text-slate-800 font-mono">62 Days</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Load</div>
                <div className="font-bold text-slate-800 font-mono">76.5 kW</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Temp</div>
                <div className="font-bold text-slate-800 font-mono">-28°C</div>
              </div>
            </div>

            <button
              onClick={() => onSelectStation('bharati')}
              className="w-full mt-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Switch Field View to Bharati
            </button>
          </div>

          {/* Maitri */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Station 02 · Schirmacher Oasis</span>
                <h3 className="font-bold text-slate-900 text-base">Maitri Station</h3>
                <p className="text-xs text-slate-500">70°45′S 11°44′E · 21 crew</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Nominal
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Fuel</div>
                <div className="font-bold text-slate-800 font-mono">71 Days</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Load</div>
                <div className="font-bold text-slate-800 font-mono">68.0 kW</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Temp</div>
                <div className="font-bold text-slate-800 font-mono">-32°C</div>
              </div>
            </div>

            <button
              onClick={() => onSelectStation('maitri')}
              className="w-full mt-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors"
            >
              Switch Field View to Maitri
            </button>
          </div>

          {/* Himadri */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Station 03 · Svalbard Arctic</span>
                <h3 className="font-bold text-slate-900 text-base">Himadri Station</h3>
                <p className="text-xs text-slate-500">78°55′N 11°56′E · 8 crew</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                Summer Team
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Power</div>
                <div className="font-bold text-slate-800 font-mono">Ny-Ålesund</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Sensors</div>
                <div className="font-bold text-slate-800 font-mono">100%</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">Temp</div>
                <div className="font-bold text-slate-800 font-mono">-14°C</div>
              </div>
            </div>

            <button
              onClick={() => onSelectStation('himadri')}
              className="w-full mt-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors"
            >
              Switch Field View to Himadri
            </button>
          </div>

        </div>
      </div>

      {/* HQ Directive Broadcast Simulator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Radio className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">NCPOR Directives & Operational Broadcasts</h3>
        </div>

        <form onSubmit={handleSendBroadcast} className="flex gap-2">
          <input
            type="text"
            placeholder="Type official directive or weather advisory to transmit to polar stations..."
            value={broadcastText}
            onChange={(e) => setBroadcastText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit</span>
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {dispatchedMessages.map((msg, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 flex-shrink-0"></span>
              <p className="leading-relaxed font-medium">{msg}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
