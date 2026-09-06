import React, { useState } from 'react';
import { X, Award, ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Play, ExternalLink } from 'lucide-react';

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'daily' | 'map' | 'power' | 'inventory' | 'hq') => void;
  onOpenCrdt: () => void;
  onOpenBlizzard: () => void;
  onOpenSimulator: () => void;
  onOpenMadrid: () => void;
}

export const JudgeTourModal: React.FC<JudgeTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenCrdt,
  onOpenBlizzard,
  onOpenSimulator,
  onOpenMadrid
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: '1. Problem Context & Humane Station Operations',
      subtitle: 'MoES SIH26060 · Remote Polar Management',
      badge: 'Architecture Pillar 1',
      description: 'AntarcticaSync replaces disjointed spreadsheets with a resilient, offline-first digital mission control. It features dual clocks (Antarctica UTC+5 vs HQ IST), authentic station leader briefings, and life-support survival vitals (indoor +21°C climate, snow-melter water reserves, and crew safety count).',
      actionLabel: 'View Daily Station Operations',
      action: () => {
        onNavigateTab('daily');
      }
    },
    {
      title: '2. Offline Persistence & Live CRDT Merge Proof',
      subtitle: 'True Disconnected Operations under Satellite Blackouts',
      badge: 'The Technical Proof',
      description: 'Built with browser IndexedDB and deterministic Conflict-Free Replicated Data Types (CRDTs). When satellite link breaks in polar blizzards, transactions queue locally with vector clocks. Upon link recovery, delta synchronization achieves ~87% bandwidth compression with cryptographic SHA-256 integrity.',
      actionLabel: 'Launch Live CRDT Split-Screen Playground',
      action: () => {
        onClose();
        onOpenCrdt();
      }
    },
    {
      title: '3. South Polar Stereographic Map & Convoy Tracker',
      subtitle: 'High-Latitude Cartography & Inland Field Traverses',
      badge: 'Geographic Oversight',
      description: 'Standard Web-Mercator maps distort and fail at the poles. Our azimuthal stereographic projection plots Bharati (Larsemann Hills), Maitri (Schirmacher Oasis), and tracks live PistenBully inland scientific traverses across the Amery Ice Shelf with real-time GPS and orbital satellite pass timers.',
      actionLabel: 'Explore Antarctic Polar Projection Map',
      action: () => {
        onNavigateTab('map');
        onClose();
      }
    },
    {
      title: '4. Blizzard "Code Red" Lockdown & Smart Load Shedding',
      subtitle: 'Life-or-Death Polar Extreme Environmental Safety',
      badge: 'Operational Safety',
      description: 'In whiteouts (>55 knots, -50°C), a single click initiates station lockdown. The system conducts automated 24/24 muster tracking across shelter modules and sheds non-essential electrical circuits (-32 kW) to guarantee 100% uninterrupted power to radiators and clinic oxygen.',
      actionLabel: 'Test Blizzard Protocol & Load Shedder',
      action: () => {
        onClose();
        onOpenBlizzard();
      }
    },
    {
      title: '5. Dynamic Winter Survival Forecaster & National Scalability',
      subtitle: 'Smart Automation & Adaptation to the Himalayas',
      badge: 'Predictive Analytics',
      description: 'Dynamic thermodynamic calculation: simulates extreme blizzards (-65°C) to predict diesel exhaustion date against the MV Vasiliy Golovnin supply ship arrival. Plus, Slide 5 scalability is proven with 1-click switching to Himansh Research Station in the 13,500 ft Himalayas.',
      actionLabel: 'Open Fuel Exhaustion Simulator',
      action: () => {
        onClose();
        onOpenSimulator();
      }
    }
  ];

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Judge Presentation &amp; Pitch Guide
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  3-Min Pitch
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Step {currentStep + 1} of {tourSteps.length} · Demonstrating SIH26060 Ministry of Earth Sciences Solution
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5">
          {tourSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step Content Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {step.badge}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Pillar 0{currentStep + 1}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900">
              {step.title}
            </h4>
            <div className="text-xs font-semibold text-slate-500">
              {step.subtitle}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {step.description}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/80">
            <button
              onClick={step.action}
              className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>{step.actionLabel}</span>
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-slate-400 text-[11px]">
            Use this guide to walk judges through your 5 technical pillars
          </span>

          {currentStep < tourSteps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(tourSteps.length - 1, prev + 1))}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              <span>Finish Tour</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
