import React, { useState } from 'react';
import { AlertOctagon, Users, Zap, BookOpen, HeartPulse, Send, Lock, CheckCircle2 } from 'lucide-react';
import { INITIAL_MUSTER_CREW } from '../services/polarService';
import type { MusterCrewMember } from '../types';

interface SafetyMedicalViewProps {
  onTriggerAlertLog: (text: string) => void;
}

export const SafetyMedicalView: React.FC<SafetyMedicalViewProps> = ({
  onTriggerAlertLog
}) => {
  const [activeTab, setActiveTab] = useState<'blizzard' | 'telemed'>('blizzard');
  
  // Blizzard Protocol states
  const [crewList] = useState<MusterCrewMember[]>(INITIAL_MUSTER_CREW);
  const [isBlizzardActive, setIsBlizzardActive] = useState(false);
  const [loadSheddingActive, setLoadSheddingActive] = useState(false);
  const [selectedRunbook, setSelectedRunbook] = useState<'gentrip' | 'lostperson' | 'frostbite'>('gentrip');

  // Telemed states
  const [selectedProtocol, setSelectedProtocol] = useState<'hypothermia' | 'co' | 'appendicitis'>('hypothermia');
  const [patientId, setPatientId] = useState('CREW-07 (Field Mechanic)');
  const [coreTemp, setCoreTemp] = useState('34.2');
  const [heartRate, setHeartRate] = useState('52');
  const [spo2, setSpo2] = useState('94');
  const [isPackaging, setIsPackaging] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  const handleToggleBlizzard = () => {
    const next = !isBlizzardActive;
    setIsBlizzardActive(next);
    if (next) {
      setLoadSheddingActive(true);
      onTriggerAlertLog('EMERGENCY CODE RED: Category-3 Polar Blizzard Lockdown initiated. Non-essential loads shed to preserve habitat heating.');
    } else {
      setLoadSheddingActive(false);
      onTriggerAlertLog('BLIZZARD STAND DOWN: Weather advisory downgraded. Non-essential circuits restored.');
    }
  };

  const handleTransmitBurst = () => {
    setIsPackaging(true);
    setTimeout(() => {
      setIsPackaging(false);
      setIsDispatched(true);
      onTriggerAlertLog(`TELEMEDICINE CONSULT TRANSMITTED: Case ${patientId} (Core Temp: ${coreTemp}°C) dispatched to AIIMS New Delhi Polar Medical Board via 9.4KB Iridium burst.`);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold overflow-x-auto no-scrollbar touch-pan-x -mx-3 px-3 sm:mx-0 sm:px-0 pb-0.5">
        <button
          onClick={() => setActiveTab('blizzard')}
          className={`min-h-[38px] flex items-center pb-2 px-3 border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === 'blizzard'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Blizzard Lockdown &amp; Safety Muster
        </button>

        <button
          onClick={() => setActiveTab('telemed')}
          className={`min-h-[38px] flex items-center pb-2 px-3 border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === 'telemed'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          AIIMS Offline Telemedicine &amp; Triage
        </button>
      </div>

      {/* SUB-TAB 1: BLIZZARD LOCKDOWN */}
      {activeTab === 'blizzard' && (
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs space-y-4">
          
          {/* Master Trigger Strip */}
          <div className={`p-3.5 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isBlizzardActive ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                {isBlizzardActive ? 'Blizzard Code Red Active' : 'Station Weather Status: Operational (No Active Alarm)'}
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {isBlizzardActive 
                  ? 'Severe whiteout (>55 knots). Outdoor movement prohibited. Radio tether muster active.' 
                  : 'Initiating protocol enforces station lockdown, verifies muster roster, and sheds non-essential electrical circuits.'}
              </p>
            </div>

            <button
              onClick={handleToggleBlizzard}
              className={`w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded text-xs font-bold transition-all text-center whitespace-nowrap ${
                isBlizzardActive 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                  : 'bg-rose-700 hover:bg-rose-800 text-white'
              }`}
            >
              {isBlizzardActive ? 'Stand Down Emergency' : 'Initiate Blizzard Code Red'}
            </button>
          </div>

          {/* Grid: Crew Muster vs Smart Load Shedder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Muster Checklist */}
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Personnel Safety Muster (24/24)
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                  100% In Shelter
                </span>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {crewList.map((crew) => (
                  <div key={crew.id} className="p-2 bg-white rounded border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800">{crew.name}</span>
                      <span className="text-slate-400 text-[10px] block font-mono">{crew.role}</span>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <span className="text-slate-700 block">{crew.locationModule}</span>
                      <span className="text-emerald-700 text-[10px] font-semibold">[Verified]</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                Guide Cables: LOCKED · External Air Sensors: ONLINE
              </div>
            </div>

            {/* Smart Circuit Load Shedder */}
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Smart Microgrid Load Shedder
                </span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  loadSheddingActive ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {loadSheddingActive ? 'Shedding: -32 kW Saved' : 'All Circuits Online'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">Habitat Heat Radiator Exchanger</span>
                    <span className="text-slate-400 text-[10px] block font-mono">Thermal loop</span>
                  </div>
                  <span className="text-emerald-700 font-mono text-xs font-bold">[Guaranteed]</span>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">Clinic Oxygen Concentrator</span>
                    <span className="text-slate-400 text-[10px] block font-mono">High-pressure</span>
                  </div>
                  <span className="text-emerald-700 font-mono text-xs font-bold">[Guaranteed]</span>
                </div>

                <div className={`p-2 rounded border flex justify-between items-center ${
                  loadSheddingActive ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className="font-bold">Heavy Laundry / Dryer Units</span>
                    <span className="text-slate-400 text-[10px] block font-mono">18 kW load</span>
                  </div>
                  <span className={`font-mono text-xs font-semibold ${loadSheddingActive ? 'text-rose-700' : 'text-slate-600'}`}>
                    {loadSheddingActive ? '[SHED]' : '[ONLINE]'}
                  </span>
                </div>

                <div className={`p-2 rounded border flex justify-between items-center ${
                  loadSheddingActive ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className="font-bold">Recreation Module Space Heating</span>
                    <span className="text-slate-400 text-[10px] block font-mono">14 kW load</span>
                  </div>
                  <span className={`font-mono text-xs font-semibold ${loadSheddingActive ? 'text-rose-700' : 'text-slate-600'}`}>
                    {loadSheddingActive ? '[SHED]' : '[ONLINE]'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setLoadSheddingActive(!loadSheddingActive)}
                className="w-full mt-1 py-1 px-2 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold"
              >
                {loadSheddingActive ? 'Restore Non-Essential Circuits' : 'Force Shed Non-Essential Circuits'}
              </button>
            </div>

          </div>

          {/* Emergency Runbooks */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Offline Standard Operating Runbooks
              </span>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setSelectedRunbook('gentrip')}
                  className={`px-2 py-0.5 rounded text-xs ${
                    selectedRunbook === 'gentrip' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Genset Trip
                </button>
                <button
                  onClick={() => setSelectedRunbook('lostperson')}
                  className={`px-2 py-0.5 rounded text-xs ${
                    selectedRunbook === 'lostperson' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Whiteout Search Line
                </button>
                <button
                  onClick={() => setSelectedRunbook('frostbite')}
                  className={`px-2 py-0.5 rounded text-xs ${
                    selectedRunbook === 'frostbite' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Frostbite Protocol
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
              {selectedRunbook === 'gentrip' && (
                <>
                  [RUNBOOK EM-01: GENERATOR TRIP IN BLIZZARD]<br/>
                  1. Check DG-2 pre-heater temperature &gt; +40°C.<br/>
                  2. Turn manual transfer switch to POSITION 2 (DG-2 Primary). Do not crank for &gt; 15 sec.<br/>
                  3. When frequency reaches 50 Hz, close Main Bus Breaker CB-101.<br/>
                  4. Inspect DG-1 fuel line heat tracing before restart attempt.
                </>
              )}
              {selectedRunbook === 'lostperson' && (
                <>
                  [RUNBOOK EM-04: WHITEOUT SEARCH &amp; RESCUE TETHER]<br/>
                  1. Zero visibility rule: No sortie without karabiner anchored to 12mm steel guide cable.<br/>
                  2. Search team minimum 3 personnel tied at 5m intervals with VHF Channel 16.<br/>
                  3. Station fog horn activated on 30-second interval; exterior strobe array powered on.
                </>
              )}
              {selectedRunbook === 'frostbite' && (
                <>
                  [RUNBOOK MED-02: GRADE-3 DEEP TISSUE FROSTBITE]<br/>
                  1. Do not rub with snow or massage affected limbs (cellular crystallization risk).<br/>
                  2. Immerse in water bath strictly calibrated between 37°C - 39°C for 20-40 minutes.<br/>
                  3. Administer warmed IV fluids; monitor core temperature continuously.
                </>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: AIIMS TELEMEDICINE */}
      {activeTab === 'telemed' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              AIIMS New Delhi Polar Telemedicine Consult Packager
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Asynchronous encrypted clinical triage for winter isolation when physical medical evacuation is impossible.
            </p>
          </div>

          {/* Protocol Selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x text-xs pb-1">
            <button
              onClick={() => setSelectedProtocol('hypothermia')}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                selectedProtocol === 'hypothermia' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Systemic Hypothermia
            </button>
            <button
              onClick={() => setSelectedProtocol('co')}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                selectedProtocol === 'co' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Carbon Monoxide
            </button>
            <button
              onClick={() => setSelectedProtocol('appendicitis')}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                selectedProtocol === 'appendicitis' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Acute Appendicitis
            </button>
          </div>

          {/* Clinical Guidance */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
            {selectedProtocol === 'hypothermia' && (
              <>
                [CLINICAL PROTOCOL: CORE TEMP &lt; 35°C HYPOTHERMIA]<br/>
                Trunk rewarming with warmed blankets (+40°C). Humidified O₂ via mask. Strict cardiac monitoring (avoid rough movement to prevent ventricular fibrillation).
              </>
            )}
            {selectedProtocol === 'co' && (
              <>
                [CLINICAL PROTOCOL: GENERATOR EXHAUST EXPOSURE]<br/>
                Remove patient from generator bay immediately. Administer 100% normobaric oxygen via non-rebreather reservoir mask at 15 L/min for minimum 4 hours.
              </>
            )}
            {selectedProtocol === 'appendicitis' && (
              <>
                [CLINICAL PROTOCOL: RIGHT LOWER QUADRANT PAIN]<br/>
                Perform clinic ultrasound scan. With zero evacuation possibility in polar winter, prepare conservative IV triple antibiotic regimen (Ceftriaxone + Metronidazole).
              </>
            )}
          </div>

          {/* Vitals Form */}
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-3 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Patient Vitals &amp; Case Packet
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-slate-500 mb-1 text-[11px]">Patient Callsign</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px]">Core Temp (°C)</label>
                <input
                  type="text"
                  value={coreTemp}
                  onChange={(e) => setCoreTemp(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px]">Heart Rate (BPM)</label>
                <input
                  type="text"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 text-[11px]">SpO₂ (%)</label>
                <input
                  type="text"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Compressed Packet Preview */}
          <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[11px] rounded space-y-1">
            <div className="flex flex-col sm:flex-row justify-between text-slate-400 text-[10px] border-b border-slate-800 pb-1 gap-1">
              <span>AES-256 Encrypted Teleconsult Dossier</span>
              <span>Compressed Size: 9.4 KB (30s window)</span>
            </div>
            <div className="truncate text-slate-300 pt-1">
              {`{ "caseId": "MED-BH-26-09", "dest": "AIIMS_POLAR_BOARD", "patient": "${patientId}", "coreTemp": "${coreTemp}C", "HR": ${heartRate}, "SpO2": "${spo2}%" }`}
            </div>
          </div>

          {/* Transmit Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <span className="text-[11px] text-slate-500 font-mono">
              Route: Bharati Clinic ➔ Iridium Narrowband ➔ AIIMS
            </span>

            <button
              onClick={handleTransmitBurst}
              disabled={isPackaging || isDispatched}
              className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-xs disabled:opacity-50 w-full sm:w-auto"
            >
              {isPackaging ? (
                <span>Packaging Dossier...</span>
              ) : isDispatched ? (
                <span>[Dispatched to AIIMS]</span>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Transmit Teleconsult Burst</span>
                </>
              )}
            </button>
          </div>

          {isDispatched && (
            <div className="p-2 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-mono">
              [Case packet queued in burst buffer. Transmission scheduled at next Iridium satellite pass in ~12 mins.]
            </div>
          )}

        </div>
      )}

    </div>
  );
};
