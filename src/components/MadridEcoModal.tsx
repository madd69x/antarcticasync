import React, { useState } from 'react';
import { X, Leaf, Wind, Sun, ShieldCheck, Recycle, CheckCircle2 } from 'lucide-react';
import type { RenewableMetrics } from '../types';

interface MadridEcoModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationName: string;
}

export const MadridEcoModal: React.FC<MadridEcoModalProps> = ({
  isOpen,
  onClose,
  stationName
}) => {
  const [metrics, setMetrics] = useState<RenewableMetrics>({
    windTurbinesKw: 11.8,
    solarPvKw: 0.0, // Polar winter (0 sun); in summer up to 42 kW
    totalRenewableKw: 11.8,
    dieselSavedLitresYtd: 18450,
    co2AvoidedTonsYtd: 48.8,
    retrogradeWasteBarrels: {
      hazardousChemicals: 14,
      electronicScrap: 8,
      incineratorAsh: 22,
      bioSafetyRecycled: 18
    }
  });

  const [isPolarSummer, setIsPolarSummer] = useState(false);

  if (!isOpen) return null;

  const toggleSeason = () => {
    const nextSummer = !isPolarSummer;
    setIsPolarSummer(nextSummer);
    setMetrics(prev => ({
      ...prev,
      solarPvKw: nextSummer ? 36.5 : 0.0,
      totalRenewableKw: nextSummer ? 11.8 + 36.5 : 11.8
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Madrid Protocol Environmental &amp; Net-Zero Tracker
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Eco-Station
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Compliance with the Protocol on Environmental Protection to the Antarctic Treaty
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Season Toggle & Status */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-emerald-950 block">Antarctic Clean Microgrid Integration</span>
            <p className="text-emerald-900/80 text-[11px] mt-0.5">
              Bharati operates vertical-axis wind turbines and summer solar arrays to displace diesel burn.
            </p>
          </div>
          <button
            onClick={toggleSeason}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors whitespace-nowrap"
          >
            {isPolarSummer ? 'Switch to Polar Winter (24hr Night)' : 'Simulate Polar Summer (24hr Sun)'}
          </button>
        </div>

        {/* Clean Energy Generation Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium">Wind Turbines (WT-1 &amp; 2)</span>
              <Wind className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">{metrics.windTurbinesKw} kW</div>
            <span className="text-[10px] text-emerald-700 font-semibold">Vertical axis · Blizzard rated</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-medium">Bifacial Solar PV Array</span>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">{metrics.solarPvKw} kW</div>
            <span className="text-[10px] text-slate-400">
              {isPolarSummer ? '24hr Midnight Sun Yield' : 'Polar Night (0 kW Sun)'}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="font-medium">Total Clean Energy</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-900">{metrics.totalRenewableKw.toFixed(1)} kW</div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Displacing ~{((metrics.totalRenewableKw / 76.5) * 100).toFixed(0)}% generator load
            </span>
          </div>
        </div>

        {/* YTD Carbon Offset Counter */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block text-[11px]">Diesel Fuel Burn Avoided (YTD):</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
              {metrics.dieselSavedLitresYtd.toLocaleString()} Litres
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Direct logistics fuel reduction</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Carbon Soot &amp; CO₂ Offset (YTD):</span>
            <div className="text-xl font-bold font-mono text-emerald-700 mt-0.5">
              {metrics.co2AvoidedTonsYtd} Metric Tons
            </div>
            <span className="text-[10px] text-slate-500">Protects polar albedo reflectance</span>
          </div>
        </div>

        {/* Madrid Protocol Retrograde Waste Ledger */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Recycle className="w-4 h-4 text-emerald-600" />
              <span>Madrid Protocol Annex III: Retrograde Waste Ledger</span>
            </div>
            <span className="text-[10px] text-slate-500 font-normal">100% Non-combustible returned</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Hazardous Waste</span>
              <strong className="text-slate-800 font-mono">{metrics.retrogradeWasteBarrels.hazardousChemicals} Barrels</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">E-Scrap Crates</span>
              <strong className="text-slate-800 font-mono">{metrics.retrogradeWasteBarrels.electronicScrap} Crates</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Incinerator Ash</span>
              <strong className="text-slate-800 font-mono">{metrics.retrogradeWasteBarrels.incineratorAsh} Barrels</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Bio-Safety Pack</span>
              <strong className="text-slate-800 font-mono">{metrics.retrogradeWasteBarrels.bioSafetyRecycled} Drums</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            All 62 sealed containers staged at the Larsemann Hills coastal helipad for loading onto <em>MV Vasiliy Golovnin</em>. Zero environmental discharge to the Antarctic continent.
          </p>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
