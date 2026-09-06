import React, { useState } from 'react';
import { X, AlertOctagon, Users, ShieldAlert, Zap, CheckCircle2, BookOpen, AlertTriangle } from 'lucide-react';
import { INITIAL_MUSTER_CREW } from '../services/polarService';
import type { MusterCrewMember } from '../types';

interface BlizzardLockdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAlertLog: (text: string) => void;
}

export const BlizzardLockdownModal: React.FC<BlizzardLockdownModalProps> = ({
  isOpen,
  onClose,
  onTriggerAlertLog
}) => {
  const [crewList, setCrewList] = useState<MusterCrewMember[]>(INITIAL_MUSTER_CREW);
  const [isBlizzardActive, setIsBlizzardActive] = useState(false);
  const [loadSheddingActive, setLoadSheddingActive] = useState(false);
  const [selectedRunbook, setSelectedRunbook] = useState<'gentrip' | 'lostperson' | 'frostbite'>('gentrip');

  if (!isOpen) return null;

  const handleToggleBlizzard = () => {
    const nextState = !isBlizzardActive;
    setIsBlizzardActive(nextState);
    if (nextState) {
      setLoadSheddingActive(true);
      onTriggerAlertLog('EMERGENCY CODE RED: Category-3 Polar Blizzard Lockdown initiated. Non-essential loads shed to preserve habitat heating.');
    } else {
      setLoadSheddingActive(false);
      onTriggerAlertLog('BLIZZARD STAND DOWN: Weather advisory downgraded. Load shedding deactivated.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isBlizzardActive ? 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Station Blizzard Lockdown &amp; Emergency Muster Protocol
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isBlizzardActive ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isBlizzardActive ? 'CODE RED ACTIVE' : 'Standby Protocol'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated personnel roll-call, microgrid smart load shedding, and offline survival runbooks
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Trigger Strip */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isBlizzardActive ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="font-bold text-slate-900 text-sm block">
              {isBlizzardActive ? '⚠️ Blizzard Emergency Mode Engaged' : 'Station Weather Status: Operational (No Active Alert)'}
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              {isBlizzardActive 
                ? 'High winds (>55 knots). Outdoor movement prohibited. Radio safety muster confirmed.' 
                : 'Initiating protocol will trigger station alarm, muster roll-call check, and shed non-essential microgrid circuits.'}
            </p>
          </div>

          <button
            onClick={handleToggleBlizzard}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all whitespace-nowrap ${
              isBlizzardActive 
                ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                : 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
            }`}
          >
            {isBlizzardActive ? 'Stand Down Emergency' : 'Initiate Blizzard Code Red'}
          </button>
        </div>

        {/* Main Grid: Crew Muster vs Smart Load Shedder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
          
          {/* Crew Muster Checklist */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-700" />
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Personnel Safety Muster (24/24)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  100% Inside Shelter
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {crewList.map((crew) => (
                  <div key={crew.id} className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800">{crew.name}</span>
                      <span className="text-slate-400 text-[11px] block">{crew.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-medium text-slate-700 block">{crew.locationModule}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ Accounted</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              Perimeter ropes: <strong>LOCKED</strong> · External door sensors: <strong>CLOSED</strong>
            </div>
          </div>

          {/* Smart Load Shedder & Microgrid Preservation */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Smart Circuit Load Shedder
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  loadSheddingActive ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {loadSheddingActive ? 'Shedding: -32 kW Saved' : 'Normal Bus (All Circuits On)'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">Habitat Heat Recovery Radiators</span>
                    <span className="text-slate-400 text-[11px] block">Life support critical</span>
                  </div>
                  <span className="text-emerald-700 font-bold text-xs">Priority 1 (Guaranteed)</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">Medical Clinic Oxygen Generator</span>
                    <span className="text-slate-400 text-[11px] block">High-pressure manifold</span>
                  </div>
                  <span className="text-emerald-700 font-bold text-xs">Priority 1 (Guaranteed)</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex justify-between items-center transition-colors ${
                  loadSheddingActive ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className="font-bold">Heavy Laundry &amp; Dishwasher Units</span>
                    <span className="text-slate-400 text-[11px] block">18 kW load</span>
                  </div>
                  <span className={`font-semibold text-xs ${loadSheddingActive ? 'text-rose-700' : 'text-slate-600'}`}>
                    {loadSheddingActive ? 'SHED (OFFLINE)' : 'ONLINE'}
                  </span>
                </div>

                <div className={`p-2.5 rounded-lg border flex justify-between items-center transition-colors ${
                  loadSheddingActive ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className="font-bold">Recreation Module Space Heating</span>
                    <span className="text-slate-400 text-[11px] block">14 kW load</span>
                  </div>
                  <span className={`font-semibold text-xs ${loadSheddingActive ? 'text-rose-700' : 'text-slate-600'}`}>
                    {loadSheddingActive ? 'SHED (OFFLINE)' : 'ONLINE'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setLoadSheddingActive(!loadSheddingActive)}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold"
            >
              {loadSheddingActive ? 'Restore Non-Essential Circuits' : 'Force Shed Non-Essential Circuits'}
            </button>
          </div>

        </div>

        {/* Offline Emergency Runbooks */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Offline Survival Runbooks (Cached Locally in Browser)
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setSelectedRunbook('gentrip')}
                className={`px-2.5 py-1 rounded-md font-medium text-xs ${
                  selectedRunbook === 'gentrip' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Genset Trip Recovery
              </button>
              <button
                onClick={() => setSelectedRunbook('lostperson')}
                className={`px-2.5 py-1 rounded-md font-medium text-xs ${
                  selectedRunbook === 'lostperson' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Whiteout Search Line
              </button>
              <button
                onClick={() => setSelectedRunbook('frostbite')}
                className={`px-2.5 py-1 rounded-md font-medium text-xs ${
                  selectedRunbook === 'frostbite' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Severe Frostbite Protocol
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
            {selectedRunbook === 'gentrip' && (
              <>
                <strong>RUNBOOK #EM-01: DIESEL GENERATOR SUDDEN TRIP IN BLIZZARD</strong><br/>
                1. Verify DG-2 pre-heater temperature &gt; +40°C on local control panel.<br/>
                2. Switch manual key switch to POSITION 2 (DG-2 Primary). Do not crank for &gt; 15 seconds.<br/>
                3. Once frequency stabilizes at 50 Hz, engage Station Main Bus Breaker CB-101.<br/>
                4. Inspect DG-1 fuel line heat tracing for freeze-up before attempting restart.
              </>
            )}
            {selectedRunbook === 'lostperson' && (
              <>
                <strong>RUNBOOK #EM-04: WHITEOUT SEARCH &amp; RESCUE TETHER PROTOCOL</strong><br/>
                1. Zero visibility rule: No individual may step onto external platform without karabiner anchored to 12mm guide cable.<br/>
                2. Search team must consist of minimum 3 personnel tied at 5-metre intervals with VHF radios on Ch-16.<br/>
                3. Station fog horn activated on 30-second interval; exterior strobe array powered on.
              </>
            )}
            {selectedRunbook === 'frostbite' && (
              <>
                <strong>RUNBOOK #MED-02: GRADE-3 DEEP TISSUE FROSTBITE STABILIZATION</strong><br/>
                1. Do not rub with snow or massage affected limbs (causes ice crystal cellular fracture).<br/>
                2. Immerse in water bath strictly calibrated between 37°C - 39°C for 20 to 40 minutes.<br/>
                3. Administer IV fluids warmed to 38°C; prepare hyperbaric or oxygen chamber protocol.
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
