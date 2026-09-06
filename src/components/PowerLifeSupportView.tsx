import React from 'react';
import type { GeneratorTelemetry, LifeSupportTelemetry } from '../types';
import { Zap, AlertTriangle, CheckCircle, Activity, Thermometer, Droplets } from 'lucide-react';

interface PowerLifeSupportProps {
  generators: GeneratorTelemetry[];
  lifeSupport: LifeSupportTelemetry;
  onSwitchGenerator: (genId: string) => void;
}

export const PowerLifeSupportView: React.FC<PowerLifeSupportProps> = ({
  generators,
  lifeSupport,
  onSwitchGenerator
}) => {
  return (
    <div className="space-y-5">
      
      {/* Overview Intro */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Station Microgrid & Life Support Systems</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous isolated power generation with exhaust thermal recovery to maintain indoor warmth.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Microgrid Frequency: 50.1 Hz Nominal
            </span>
          </div>
        </div>

        {/* Predictive Maintenance Notice */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900">Predictive Service Advisory · Genset DG-1:</span>
            <p className="text-amber-800 leading-relaxed">
              Bearing vibration trend (2.4 mm/s RMS) remains stable, but run-hours ({generators[0]?.runHours} hrs) are approaching the 1,500-hr oil and injector filter inspection threshold (80 run-hours remaining). 
              Recommended action: Plan a seamless load changeover to <strong>DG-2</strong> during tomorrow’s low-demand morning window (10:00 station time).
            </p>
          </div>
        </div>

        {/* Generator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {generators.map((gen) => {
            const isRunning = gen.status === 'running';
            const loadPercent = Math.round((gen.loadKw / gen.maxKw) * 100);

            return (
              <div 
                key={gen.id}
                className={`p-4 rounded-xl border transition-all ${
                  isRunning 
                    ? 'bg-slate-50/80 border-slate-300 shadow-xs' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 text-sm">{gen.name.split('(')[0]}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isRunning 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isRunning ? 'Online & Carrying Load' : 'Warm Standby'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>Electrical Load</span>
                      <span className="font-bold text-slate-900 font-mono">{gen.loadKw} kW / {gen.maxKw} kW</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${isRunning ? 'bg-blue-600' : 'bg-slate-300'}`} 
                        style={{ width: `${isRunning ? loadPercent : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Coolant Temp</span>
                      <strong className="text-slate-800 font-mono">{gen.coolantTemp}°C</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Oil Pressure</span>
                      <strong className="text-slate-800 font-mono">{gen.oilPressure} bar</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Vibration (RMS)</span>
                      <strong className="text-slate-800 font-mono">{gen.vibrationRms} mm/s</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Run Hours</span>
                      <strong className="text-slate-800 font-mono">{gen.runHours} hrs</strong>
                    </div>
                  </div>

                  {!isRunning && (
                    <button
                      onClick={() => onSwitchGenerator(gen.id)}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                    >
                      Perform Load Switch to This Unit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Life Support & Thermal Habitat Regulation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Station Life Support & Living Habitat</h3>
        <p className="text-xs text-slate-500">Exhaust heat exchangers supply continuous warmth to living modules, medical bay, and melting tanks.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold text-xs">Indoor Thermal Balance</span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">+{lifeSupport.indoorHabitatTemp}°C</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Living Block: <strong>+21.2°C</strong></div>
              <div>Laboratories: <strong>+19.8°C</strong></div>
              <div>Medical Clinic: <strong>+22.0°C</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold text-xs">Atmospheric Purity</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">{lifeSupport.o2Saturation}% O₂</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Carbon Dioxide: <strong>{lifeSupport.co2Ppm} ppm</strong> (Fresh)</div>
              <div>Air scrubbers: <strong>Active (Nominal)</strong></div>
              <div>Negative pressure labs: <strong>Calibrated</strong></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-bold text-xs">Potable Water Snow Melter</span>
              <Droplets className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">{lifeSupport.potableWaterLitres.toLocaleString()} L</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Daily consumption: <strong>~1,450 L/day</strong></div>
              <div>Snow melter status: <strong>Online (Steam coil)</strong></div>
              <div>Water reserve buffer: <strong>~10 Days storage</strong></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
