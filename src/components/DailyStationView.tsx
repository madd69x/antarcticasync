import React, { useState } from 'react';
import type { StationId, WeatherTelemetry, LifeSupportTelemetry, StationLogEntry } from '../types';
import { STATIONS } from '../services/polarService';
import { speakText, stopSpeaking, isSpeaking } from '../services/speechService';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Users, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Wrench, 
  Sparkles,
  Volume2,
  Square,
  Leaf,
  HeartPulse
} from 'lucide-react';

interface DailyStationViewProps {
  currentStation: StationId;
  weather: WeatherTelemetry;
  lifeSupport: LifeSupportTelemetry;
  logs: StationLogEntry[];
  onOpenNewLogModal: () => void;
  onQuickAction: (actionText: string, category: StationLogEntry['category'], tag: string) => void;
  onOpenMadridEco: () => void;
  onOpenTelemedicine: () => void;
}

export const DailyStationView: React.FC<DailyStationViewProps> = ({
  currentStation,
  weather,
  lifeSupport,
  logs,
  onOpenNewLogModal,
  onQuickAction,
  onOpenMadridEco,
  onOpenTelemedicine
}) => {
  const station = STATIONS[currentStation];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getBriefingText = () => {
    if (currentStation === 'bharati') {
      return `Good morning Bharati Station crew. This is your morning station operations briefing for day 142 of winter-over. Exterior temperature is minus ${Math.abs(weather.ambientTemp).toFixed(0)} degrees Celsius, with wind chill at minus ${Math.abs(weather.windChill).toFixed(0)} degrees. Exterior winds have eased to ${weather.windSpeed.toFixed(0)} knots. Outdoor movements are permitted within the 2 kilometer perimeter ropes. Habitat indoor heating is nominal at positive 21 degrees. Potable water melting reserves stand at ${lifeSupport.potableWaterLitres.toLocaleString()} litres. All 24 winter-over personnel are accounted for. Diesel Generator 1 is online and carrying the microgrid load. Have a safe and productive day.`;
    } else if (currentStation === 'maitri') {
      return `Good morning Maitri Station crew. Schirmacher oasis temperature is minus ${Math.abs(weather.ambientTemp).toFixed(0)} degrees Celsius with winds at ${weather.windSpeed.toFixed(0)} knots. Priyadarshini water pump trace heating is nominal. Generator 2 is carrying load. All 21 winter-over personnel are safe.`;
    } else {
      return `Good morning Himansh Himalayan station crew. Spiti valley cold desert temperature is minus ${Math.abs(weather.ambientTemp).toFixed(0)} degrees Celsius. Atmospheric pressure is 615 hectopascals. Glaciology monitoring is active.`;
    }
  };

  const handleToggleVoiceBriefing = () => {
    if (isAudioPlaying) {
      stopSpeaking();
      setIsAudioPlaying(false);
    } else {
      setIsAudioPlaying(true);
      speakText(getBriefingText(), () => setIsAudioPlaying(false));
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Station Morning Briefing Notice with Audio Briefing Button */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 text-xl font-bold">
            ☀️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Station Master Briefing · Winter-Over Season
              </span>
              <span className="text-[10px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                Issued 06:30 Station Time
              </span>
            </div>
            <p className="text-xs text-amber-950/90 mt-1 leading-relaxed">
              {currentStation === 'bharati' ? (
                'Exterior winds eased to 24 knots following yesterday’s spindrift. Outdoor movements approved within the 2 km coastal perimeter with standard check-in radios. Diesel Generator #1 running stably; routine oil & fuel filter swap scheduled for 14:00 by Mechanical Engineer Priya Nair.'
              ) : currentStation === 'maitri' ? (
                'Schirmacher Oasis weather holding with moderate southern katabatic winds (28 knots). Lake Priyadarshini water pumping line trace heating verified at +6°C. DG-2 currently carrying the station load.'
              ) : currentStation === 'himansh' ? (
                'Chandra Basin cold desert weather calm (-18.6°C). Solar PV battery banks holding at 88% charge. Deep-core ice temperature sensor telemetry logged nominal.'
              ) : (
                'Ny-Ålesund fjord research boats standing down due to morning swells. Atmospheric gas chromatography lab calibration scheduled today.'
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-end md:self-center flex-shrink-0">
          {/* Hands-Free Voice Briefing Button */}
          <button
            onClick={handleToggleVoiceBriefing}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
              isAudioPlaying 
                ? 'bg-amber-700 text-white animate-pulse' 
                : 'bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300'
            }`}
            title="Read morning briefing aloud using hands-free voice synthesizer"
          >
            {isAudioPlaying ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Stop Audio Briefing</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Hands-Free Audio Briefing</span>
              </>
            )}
          </button>

          <div className="text-xs text-amber-900/80 font-medium bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 whitespace-nowrap text-center">
            Leader: <strong>{station.stationLeader.split('(')[0]}</strong>
          </div>
        </div>
      </div>

      {/* 4 Vital Polar Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Outside Weather */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Exterior Polar Weather</span>
            <Thermometer className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {weather.ambientTemp.toFixed(1)}°C
            </span>
            <span className="text-xs text-slate-500">
              Chill {weather.windChill.toFixed(0)}°C
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed.toFixed(0)} kt · {weather.windDirection}</span>
          </div>
        </div>

        {/* Metric 2: Habitat Living Comfort */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Habitat &amp; Lab Climate</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              +{lifeSupport.indoorHabitatTemp.toFixed(1)}°C
            </span>
            <span className="text-xs text-slate-500">
              Hum {lifeSupport.indoorHumidity}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Heating Loops Nominal</span>
          </div>
        </div>

        {/* Metric 3: Potable Water Melter */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Potable Water Melter</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {lifeSupport.potableWaterLitres.toLocaleString()} L
            </span>
            <span className="text-xs text-slate-500">
              {Math.round((lifeSupport.potableWaterLitres / lifeSupport.potableWaterCapacity) * 100)}%
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium">
            Melter active · 1,800 L/day rate
          </div>
        </div>

        {/* Metric 4: Crew Safety */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Winter-Over Roster</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {lifeSupport.crewAccountedFor} / {lifeSupport.totalCrew}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">100%</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>All personnel accounted for</span>
          </div>
        </div>

      </div>

      {/* Main Split: Shift Handover Notes + Quick Action Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left 2 Cols: Shift Handover Notes */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Station Log &amp; Shift Handover Notes</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic field observations recorded by wintering scientists and engineers.
              </p>
            </div>

            <button
              onClick={onOpenNewLogModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Entry</span>
            </button>
          </div>

          {/* Filter & Search Ribbon */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes by author, keyword, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs py-0.5">
              {['all', 'generator', 'science', 'logistics', 'weather'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Log Entries List */}
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No shift notes found matching the search criteria.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const dateObj = new Date(log.timestamp);
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isToday = new Date().toDateString() === dateObj.toDateString();

                return (
                  <div 
                    key={log.id} 
                    className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-50/80 border border-slate-200 text-xs space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.authorName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 text-[11px]">{log.authorRole}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{isToday ? `Today at ${timeStr}` : `${dateObj.toLocaleDateString()} ${timeStr}`}</span>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-normal">
                      {log.content}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                          #{log.tag}
                        </span>
                        <span className="capitalize text-slate-500 font-medium">
                          {log.category}
                        </span>
                      </div>

                      <div>
                        {log.isSynced ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Synced to HQ</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ⏳ Saved on device (Queued)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right 1 Col: Fuel, Eco-Tracker & Quick Actions */}
        <div className="space-y-4">
          
          {/* Quick Shortcuts to Eco-Tracker & Telemedicine */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenMadridEco}
              className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left hover:bg-emerald-100/60 transition-colors space-y-1 shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Madrid Eco</span>
              </div>
              <p className="text-[11px] text-emerald-900/70">
                11.8 kW clean microgrid &amp; waste ledger
              </p>
            </button>

            <button
              onClick={onOpenTelemedicine}
              className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-left hover:bg-rose-100/60 transition-colors space-y-1 shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                <span>AIIMS Telemed</span>
              </div>
              <p className="text-[11px] text-rose-900/70">
                9.4KB burst consult for isolated winter
              </p>
            </button>
          </div>

          {/* Fuel & Power Quick Glance Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Station Power Status</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                DG-1 Online
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Current Microgrid Load</span>
                  <span className="font-bold text-slate-900 font-mono">76.5 kW / 150 kW</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '51%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Bulk Arctic Diesel (Jet A-1)</span>
                  <span className="font-bold text-slate-900 font-mono">68,200 L (~62 days)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
              <span>Coolant: <strong className="text-slate-700">82.4°C</strong></span>
              <span>Oil Pressure: <strong className="text-slate-700">4.6 bar</strong></span>
              <span>Vibration: <strong className="text-slate-700">2.4 mm/s</strong></span>
            </div>
          </div>

          {/* Common Field Quick Entry Buttons */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Common Field Logs</h3>
              <p className="text-[11px] text-slate-500">Quick 1-click logs for high-frequency daily station tasks.</p>
            </div>

            <button
              onClick={() => onQuickAction('Recorded daily fuel tank dip gauge: 68,200 L in main tank', 'Generator', 'Fuel-Dip')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs text-slate-700 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Fuel className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium">Log Daily Fuel Dip</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600">Daily routine</span>
            </button>

            <button
              onClick={() => onQuickAction('Checked snowmelter trace heating and raw snow intake chute. Melter operating at 1,800 L/day.', 'Logistics', 'Water-Melter')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs text-slate-700 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-medium">Potable Water Melter Check</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600">Morning routine</span>
            </button>

            <button
              onClick={() => onQuickAction('Inspected emergency medical oxygen manifold in triage bay. Pressure at 150 bar.', 'Medical', 'Clinic-O2')}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs text-slate-700 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">Medical Oxygen Inspection</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600">Weekly routine</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
