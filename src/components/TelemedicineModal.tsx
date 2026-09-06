import React, { useState } from 'react';
import { X, HeartPulse, Send, ShieldAlert, CheckCircle2, FileText, Activity, Lock } from 'lucide-react';
import type { TelemedicineCase } from '../types';

interface TelemedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogEmergency: (text: string) => void;
}

export const TelemedicineModal: React.FC<TelemedicineModalProps> = ({
  isOpen,
  onClose,
  onLogEmergency
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<'hypothermia' | 'co' | 'appendicitis'>('hypothermia');
  const [patientId, setPatientId] = useState('CREW-07 (Field Mechanic)');
  const [coreTemp, setCoreTemp] = useState('34.2');
  const [heartRate, setHeartRate] = useState('52');
  const [spo2, setSpo2] = useState('94');
  const [isPackaging, setIsPackaging] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen) return null;

  const handleTransmitBurst = () => {
    setIsPackaging(true);
    setTimeout(() => {
      setIsPackaging(false);
      setIsDispatched(true);
      onLogEmergency(`TELEMEDICINE CONSULT TRANSMITTED: Case ${patientId} (Core Temp: ${coreTemp}°C) dispatched to AIIMS New Delhi Polar Medical Board via 9.4KB Iridium burst.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Offline Polar Telemedicine &amp; AIIMS Consult Packager
                </h3>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  Life-Critical
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AIIMS New Delhi / INHS Asvini async medical consult for isolated winter-over crews
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Protocol Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <button
            onClick={() => setSelectedProtocol('hypothermia')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedProtocol === 'hypothermia' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Moderate Hypothermia Triage
          </button>
          <button
            onClick={() => setSelectedProtocol('co')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedProtocol === 'co' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Carbon Monoxide Exposure (Genset)
          </button>
          <button
            onClick={() => setSelectedProtocol('appendicitis')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedProtocol === 'appendicitis' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Suspected Acute Appendicitis
          </button>
        </div>

        {/* Clinical Guidelines Strip */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
          <strong className="text-slate-900 block font-semibold">
            {selectedProtocol === 'hypothermia' && 'Offline Triage: Core Body Temp < 35°C (Moderate Systemic Hypothermia)'}
            {selectedProtocol === 'co' && 'Offline Triage: Carbon Monoxide Inhalation / Exhaust Gas Intoxication'}
            {selectedProtocol === 'appendicitis' && 'Offline Triage: Right Lower Quadrant Abdominal Pain in Polar Isolation'}
          </strong>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {selectedProtocol === 'hypothermia' && 'Active trunk rewarming with warmed blankets (+40°C). Administer warmed humidified O₂ via mask. Strict cardiac monitoring (avoid sudden rough handling to prevent ventricular fibrillation).'}
            {selectedProtocol === 'co' && 'Remove from generator manifold area immediately. Administer 100% normobaric oxygen via non-rebreather reservoir mask at 15 L/min for minimum 4 hours.'}
            {selectedProtocol === 'appendicitis' && 'Immediate ultrasound confirmation in station clinic. With zero evacuation possibility in polar night, prepare conservative IV antibiotic triple regimen (Ceftriaxone + Metronidazole).'}
          </p>
        </div>

        {/* Patient Vitals Entry Form */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
              Patient Telemetry &amp; Micro-Dossier
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Station Clinic Unit #1</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Patient Callsign</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Core Temp (°C)</label>
              <input
                type="text"
                value={coreTemp}
                onChange={(e) => setCoreTemp(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Heart Rate (BPM)</label>
              <input
                type="text"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">SpO₂ (%)</label>
              <input
                type="text"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Ultra-Compressed Micro-Packet Preview */}
        <div className="p-3 bg-slate-900 text-cyan-300 font-mono text-[11px] rounded-xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[10px] font-sans border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3 text-emerald-400" /> AES-256 Encrypted Telemedicine Burst Dossier</span>
            <span className="text-cyan-400 font-bold">Size: 9.4 KB (Fit for 30s Iridium window)</span>
          </div>
          <div className="truncate text-slate-300">
            {`{ "caseId": "MED-BHARATI-2026-09", "consultTo": "AIIMS_DELHI_POLAR_BOARD", "patient": "${patientId}", "coreTemp": "${coreTemp}C", "HR": ${heartRate}, "SpO2": "${spo2}%", "ecgLead2Snippet": "0.12,0.18,0.85,-0.20,0.15", "notes": "Cold exposure during perimeter traverse." }`}
          </div>
        </div>

        {/* Transmit Action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">
            Routing: Bharati Station Clinic ➔ Iridium Narrowband ➔ AIIMS Polar Health Desk
          </span>

          <button
            onClick={handleTransmitBurst}
            disabled={isPackaging || isDispatched}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            {isPackaging ? (
              <span>Compressing &amp; Encrypting...</span>
            ) : isDispatched ? (
              <span>✓ Dispatched to AIIMS</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Teleconsult Burst</span>
              </>
            )}
          </button>
        </div>

        {isDispatched && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Case packet queued into transmission buffer. Will auto-burst at next Iridium satellite pass (window in ~12 mins).
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
