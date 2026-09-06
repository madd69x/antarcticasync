import React, { useState } from 'react';
import { X, Flame, Sliders, AlertTriangle, CheckCircle, Calendar, Plane, Ship } from 'lucide-react';

interface SurvivalSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStockLitres: number;
}

export const SurvivalSimulatorModal: React.FC<SurvivalSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentStockLitres
}) => {
  const [simTemp, setSimTemp] = useState(-38);
  const [simWind, setSimWind] = useState(45);
  const [simCrew, setSimCrew] = useState(24);

  if (!isOpen) return null;

  // Thermodynamic heat loss calculation
  // As ambient temp drops below 0°C, radiator thermal demand and fuel viscosity increase burn rate
  const tempDelta = Math.abs(simTemp);
  const calculatedDailyBurn = Math.round(800 + (tempDelta * 14) + (simWind * 6) + (simCrew * 4));
  const daysUntilExhaustion = Math.max(1, Math.floor(currentStockLitres / calculatedDailyBurn));

  // Resupply ship target: 58 days away (Jan 18)
  const targetDays = 58;
  const bufferDays = daysUntilExhaustion - targetDays;
  const isSafe = bufferDays > 10;
  const isCritical = bufferDays <= 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Dynamic Winter Survival &amp; Fuel Burn Forecaster
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  Predictive AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Thermodynamic model predicting diesel depletion under severe polar blizzard conditions
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Climate Sliders */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700 uppercase tracking-wide text-[11px]">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Simulate Climate &amp; Polar Weather Stress</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Exterior Polar Temperature</span>
                <span className="font-mono text-blue-700 text-sm font-bold">{simTemp}°C</span>
              </div>
              <input
                type="range"
                min="-65"
                max="-10"
                value={simTemp}
                onChange={(e) => setSimTemp(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-65°C (Polar Deep Winter)</span>
                <span>-35°C (Average)</span>
                <span>-10°C (Summer)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Sustained Blizzard Wind Speed</span>
                <span className="font-mono text-blue-700 text-sm font-bold">{simWind} Knots</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={simWind}
                onChange={(e) => setSimWind(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 kt (Calm)</span>
                <span>45 kt (Gale)</span>
                <span>85 kt (Severe Whiteout)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Forecast Outcome */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Current Reserve:</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
              {currentStockLitres.toLocaleString()} L
            </div>
            <span className="text-[10px] text-slate-500">Arctic Grade Jet A-1</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Simulated Burn Rate:</span>
            <div className="text-xl font-bold font-mono text-amber-700 mt-0.5">
              ~{calculatedDailyBurn.toLocaleString()} L/day
            </div>
            <span className="text-[10px] text-slate-500">Heat recovery + microgrid</span>
          </div>

          <div className={`p-3 rounded-xl border ${
            isCritical ? 'bg-rose-50 border-rose-300' : isSafe ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
          }`}>
            <span className="text-slate-500 block text-[11px]">Projected Endurance:</span>
            <div className={`text-xl font-bold font-mono mt-0.5 ${
              isCritical ? 'text-rose-700' : isSafe ? 'text-emerald-800' : 'text-amber-800'
            }`}>
              {daysUntilExhaustion} Days
            </div>
            <span className={`text-[10px] font-semibold ${isCritical ? 'text-rose-600' : 'text-slate-600'}`}>
              Resupply in {targetDays} days
            </span>
          </div>
        </div>

        {/* Resupply Vessel vs Fuel Margin Timeline */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Ship className="w-4 h-4 text-blue-600" />
              <span>Target: MV Vasiliy Golovnin Arrival (58 Days Away)</span>
            </div>
            <span className={`font-bold ${bufferDays >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {bufferDays >= 0 ? `+${bufferDays} Days Safety Buffer` : `DEFICIT: ${Math.abs(bufferDays)} Days Short!`}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isCritical ? 'bg-rose-600' : isSafe ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (daysUntilExhaustion / (targetDays + 20)) * 100)}%` }}
            ></div>
          </div>

          {isCritical && (
            <div className="p-2.5 rounded-lg bg-rose-100/70 border border-rose-300 text-rose-900 text-[11px] flex items-start gap-2 mt-2">
              <Plane className="w-4 h-4 text-rose-700 mt-0.5 flex-shrink-0" />
              <div>
                <strong>AUTOMATED ADVISORY DISPATCH TO NCPOR GOA:</strong>
                <p className="mt-0.5">
                  At this burn rate, fuel runs out before ship arrival. Recommend pre-authorizing emergency ski-plane fuel ferry (Basler BT-67 from Cape Town via Troll Station).
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
