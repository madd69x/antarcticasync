import React, { useState } from 'react';
import type { GeneratorTelemetry, LifeSupportTelemetry } from '../types';
import { Sliders, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PowerLifeSupportProps {
  generators: GeneratorTelemetry[];
  lifeSupport: LifeSupportTelemetry;
  currentFuelStockLitres: number;
  onSwitchGenerator: (genId: string) => void;
}

export const PowerLifeSupportView: React.FC<PowerLifeSupportProps> = ({
  generators,
  lifeSupport,
  currentFuelStockLitres,
  onSwitchGenerator
}) => {
  // Fuel burn simulation sliders embedded directly
  const [simTemp, setSimTemp] = useState(-38);
  const [simWind, setSimWind] = useState(45);

  const tempDelta = Math.abs(simTemp);
  const calculatedDailyBurn = Math.round(800 + (tempDelta * 14) + (simWind * 6) + (24 * 4));
  const daysUntilExhaustion = Math.max(1, Math.floor(currentFuelStockLitres / calculatedDailyBurn));
  const targetDays = 58; // MV Vasiliy Golovnin arrival
  const bufferDays = daysUntilExhaustion - targetDays;
  const isCritical = bufferDays <= 0;

  return (
    <div className="space-y-4">
      
      {/* Overview Intro */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Station Microgrid &amp; Life Support Generation
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Continuous isolated power generation with exhaust thermal recovery to living modules.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Bus Frequency: 50.1 Hz Nominal
            </span>
          </div>
        </div>

        {/* Predictive Maintenance Notice */}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded p-3 flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Predictive Service Advisory · Genset DG-1</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Bearing vibration trend (2.4 mm/s RMS) is stable. Run-hours ({generators[0]?.runHours} hrs) are within 80 hours of the 1,500-hr injector filter inspection threshold. 
              Recommended action: Plan load changeover to DG-2 during tomorrow’s low-demand window (10:00 UTC).
            </p>
          </div>
        </div>

        {/* Generator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          {generators.map((gen) => {
            const isRunning = gen.status === 'running';
            const loadPercent = Math.round((gen.loadKw / gen.maxKw) * 100);

            return (
              <div 
                key={gen.id}
                className={`p-3.5 rounded border transition-all ${
                  isRunning 
                    ? 'bg-slate-50/70 border-slate-300 shadow-2xs' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-xs">{gen.name.split('(')[0]}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isRunning 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {isRunning ? 'Carrying Load' : 'Warm Standby'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1 font-mono text-[11px]">
                      <span>Load Distribution</span>
                      <span className="font-bold text-slate-900">{gen.loadKw} kW / {gen.maxKw} kW</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${isRunning ? 'bg-slate-800' : 'bg-slate-400'}`} 
                        style={{ width: `${isRunning ? loadPercent : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-slate-600 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">Coolant</span>
                      <strong className="text-slate-800">{gen.coolantTemp}°C</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">Oil Pressure</span>
                      <strong className="text-slate-800">{gen.oilPressure} bar</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">Vibration RMS</span>
                      <strong className="text-slate-800">{gen.vibrationRms} mm/s</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-sans font-semibold">Run Hours</span>
                      <strong className="text-slate-800">{gen.runHours} hrs</strong>
                    </div>
                  </div>

                  {!isRunning && (
                    <button
                      onClick={() => onSwitchGenerator(gen.id)}
                      className="w-full mt-1.5 py-1 px-2.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs transition-colors"
                    >
                      Execute Load Transfer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Thermodynamic Fuel Burn Simulator */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Thermodynamic Fuel Depletion Forecaster
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simulates ambient sub-zero temperature stress and katabatic winds on fuel burn rate vs resupply ship arrival.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Current Stock: <strong>{currentFuelStockLitres.toLocaleString()} L</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Sliders */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Exterior Ambient Temperature</span>
                <span className="font-mono text-slate-900 font-bold">{simTemp}°C</span>
              </div>
              <input
                type="range"
                min="-65"
                max="-10"
                value={simTemp}
                onChange={(e) => setSimTemp(Number(e.target.value))}
                className="w-full accent-slate-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-65°C (Polar Deep Winter)</span>
                <span>-10°C (Summer)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Katabatic Blizzard Winds</span>
                <span className="font-mono text-slate-900 font-bold">{simWind} Knots</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={simWind}
                onChange={(e) => setSimWind(Number(e.target.value))}
                className="w-full accent-slate-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10 kt (Calm)</span>
                <span>85 kt (Severe Whiteout)</span>
              </div>
            </div>
          </div>

          {/* Outcome Metric Cards */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calculated Burn Rate</span>
              <div className="text-xl font-bold font-mono text-slate-900">~{calculatedDailyBurn.toLocaleString()} L/day</div>
              <span className="text-[10px] text-slate-500">Radiator thermal loop load</span>
            </div>

            <div className={`p-3 rounded border space-y-1 ${
              isCritical ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected Endurance</span>
              <div className={`text-xl font-bold font-mono ${isCritical ? 'text-rose-700' : 'text-slate-900'}`}>
                {daysUntilExhaustion} Days
              </div>
              <span className={`text-[10px] font-mono ${isCritical ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                Vessel docks in {targetDays} days
              </span>
            </div>

            <div className="col-span-2 p-2.5 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Target: MV Vasiliy Golovnin Arrival</span>
                <span className={bufferDays >= 0 ? 'text-emerald-700 font-mono' : 'text-rose-700 font-mono'}>
                  {bufferDays >= 0 ? `+${bufferDays} Days Safety Buffer` : `Deficit: ${Math.abs(bufferDays)} Days Short!`}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${isCritical ? 'bg-rose-600' : 'bg-slate-800'}`}
                  style={{ width: `${Math.min(100, (daysUntilExhaustion / (targetDays + 20)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
