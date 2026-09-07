import React, { useState } from 'react';
import type { StationId, WeatherTelemetry, LifeSupportTelemetry, StationLogEntry } from '../types';
import { STATIONS } from '../services/polarService';
import { speakText, stopSpeaking } from '../services/speechService';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Users, 
  Plus, 
  Search, 
  Clock, 
  Volume2, 
  Square,
  CheckCircle2
} from 'lucide-react';

interface DailyStationViewProps {
  currentStation: StationId;
  weather: WeatherTelemetry;
  lifeSupport: LifeSupportTelemetry;
  logs: StationLogEntry[];
  onOpenNewLogModal: () => void;
  onQuickAction: (actionText: string, category: StationLogEntry['category'], tag: string) => void;
}

export const DailyStationView: React.FC<DailyStationViewProps> = ({
  currentStation,
  weather,
  lifeSupport,
  logs,
  onOpenNewLogModal,
  onQuickAction
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
      return `Bharati Station operations briefing. Exterior temperature is minus ${Math.abs(weather.ambientTemp).toFixed(0)} degrees Celsius, with wind chill at minus ${Math.abs(weather.windChill).toFixed(0)} degrees. Exterior winds at ${weather.windSpeed.toFixed(0)} knots. Outdoor movements permitted within 2 kilometer perimeter ropes. Habitat indoor heating is nominal at positive 21 degrees. Potable water reserves stand at ${lifeSupport.potableWaterLitres.toLocaleString()} litres. All 24 personnel accounted for. Diesel Generator 1 is online and carrying the microgrid load.`;
    } else if (currentStation === 'maitri') {
      return `Maitri Station operations briefing. Schirmacher Oasis temperature is minus ${Math.abs(weather.ambientTemp).toFixed(0)} degrees Celsius with winds at ${weather.windSpeed.toFixed(0)} knots. Priyadarshini water pump trace heating verified. Generator 2 carrying load. All 21 personnel accounted for.`;
    } else {
      return `Himansh Himalayan Station operations briefing. Chandra Basin temperature is minus ${Math.abs(weather.ambientTemp).toFixed(0)} degrees Celsius. Atmospheric pressure is 615 hectopascals. Glaciology monitoring is active.`;
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
    <div className="space-y-4">
      
      {/* Station Master Daily Briefing Notice */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Station Operational Advisory
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.2 rounded border border-slate-200">
              06:30 UTC
            </span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed max-w-4xl">
            {currentStation === 'bharati' ? (
              'Exterior winds stabilized at 24 knots following overnight spindrift. Outer movements authorized within standard 2.0 km coastal perimeter tether line. Diesel Generator 1 running nominal; scheduled oil and fuel filter servicing set for 14:00 UTC by Station Mechanical Engineer Priya Nair.'
            ) : currentStation === 'maitri' ? (
              'Schirmacher Oasis weather stable with southern katabatic winds at 28 knots. Lake Priyadarshini water pumping line trace heating verified at +6.0°C. DG-2 currently carrying the station microgrid.'
            ) : currentStation === 'himansh' ? (
              'Chandra Basin cold desert weather nominal (-18.6°C). High-altitude solar battery banks holding at 88% capacity. Deep-core thermistor strings recording steady baseline temperatures.'
            ) : (
              'Ny-Ålesund fjord research maritime sorties suspended due to morning swells. Atmospheric gas chromatography calibration underway in laboratory module.'
            )}
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
          <button
            onClick={handleToggleVoiceBriefing}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold border transition-colors ${
              isAudioPlaying 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Square className="w-3 h-3" />
                <span>Stop Voice Briefing</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-slate-500" />
                <span>Voice Briefing</span>
              </>
            )}
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Leader: <strong className="text-slate-800">{station.stationLeader.split('(')[0]}</strong>
          </span>
        </div>
      </div>

      {/* 4 Key Polar Operational Vital Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        
        {/* Metric 1: Outside Weather */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 sm:p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Exterior Ambient</span>
            <Thermometer className="w-3.5 h-3.5 flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold font-mono text-slate-900">
              {weather.ambientTemp.toFixed(1)}°C
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
              Chill {weather.windChill.toFixed(0)}°C
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 font-mono pt-1 truncate">
            Wind: {weather.windSpeed.toFixed(0)} kt ({weather.windDirection})
          </div>
        </div>

        {/* Metric 2: Habitat Living Comfort */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 sm:p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Internal Habitat</span>
            <span className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold font-mono flex-shrink-0">[Nominal]</span>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold font-mono text-slate-900">
              +{lifeSupport.indoorHabitatTemp.toFixed(1)}°C
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
              Hum {lifeSupport.indoorHumidity}%
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 font-mono pt-1 truncate">
            Loop A &amp; B Balanced
          </div>
        </div>

        {/* Metric 3: Potable Water Melter */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 sm:p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Potable Reservoir</span>
            <Droplets className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold font-mono text-slate-900">
              {lifeSupport.potableWaterLitres.toLocaleString()} L
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
              {Math.round((lifeSupport.potableWaterLitres / lifeSupport.potableWaterCapacity) * 100)}%
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 font-mono pt-1 truncate">
            Melter active (1,800 L/d)
          </div>
        </div>

        {/* Metric 4: Crew Safety */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 sm:p-3.5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">Muster Roster</span>
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold font-mono text-slate-900">
              {lifeSupport.crewAccountedFor}/{lifeSupport.totalCrew}
            </span>
            <span className="text-[11px] sm:text-xs text-emerald-700 font-semibold font-mono">100%</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-600 font-mono pt-1 truncate">
            All crew in shelter
          </div>
        </div>

      </div>

      {/* Main Split: Shift Logbook Table + Common Operational Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Shift Handover Notes Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Station Operations Logbook
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Official shift handover records entered by wintering scientific and technical staff.
              </p>
            </div>

            <button
              onClick={onOpenNewLogModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Log</span>
            </button>
          </div>

          {/* Filter and Search Ribbon */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter logbook by keyword, author, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-800 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar touch-pan-x text-xs py-0.5">
              {['all', 'generator', 'science', 'logistics', 'weather'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded capitalize text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
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
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded border border-dashed border-slate-200 font-mono">
                No entries found matching the filter query.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const dateObj = new Date(log.timestamp);
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                const dateStr = dateObj.toISOString().slice(0, 10);

                return (
                  <div 
                    key={log.id} 
                    className="p-3 rounded border border-slate-200 bg-slate-50/70 hover:bg-slate-50 text-xs space-y-1.5 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.authorName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-mono text-[11px]">{log.authorRole}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{dateStr} {timeStr} UTC</span>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                      {log.content}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-200">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="bg-white text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 text-[10px]">
                          tag:{log.tag}
                        </span>
                        <span className="capitalize text-slate-500">
                          cat:{log.category}
                        </span>
                      </div>

                      <div>
                        {log.isSynced ? (
                          <span className="text-emerald-700 font-mono text-[10px] font-semibold">
                            [Synced to MoES]
                          </span>
                        ) : (
                          <span className="text-amber-800 font-mono text-[10px] font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            [IndexedDB Queued]
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

        {/* Right 1 Col: Common Operational Action Shortcuts */}
        <div className="space-y-3">
          
          {/* Power Quick Glance */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Microgrid Bus Status
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 border border-slate-200">
                DG-1 Primary
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-mono">
                  <span>Electrical Output</span>
                  <span className="font-bold text-slate-900">76.5 kW / 150 kW</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-800 h-full rounded-full" style={{ width: '51%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-mono">
                  <span>Bulk Arctic Fuel</span>
                  <span className="font-bold text-slate-900">68,200 L (~62 days)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-800 h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Coolant: 82.4°C</span>
              <span>Oil: 4.6 bar</span>
              <span>Vib: 2.4 mm/s</span>
            </div>
          </div>

          {/* Common Field Logs */}
          <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              High-Frequency Field Logging
            </span>

            <button
              onClick={() => onQuickAction('Recorded physical fuel tank dip measurement: 68,200 L in main tank', 'Generator', 'Fuel-Dip')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors text-xs text-slate-700 flex items-center justify-between"
            >
              <span className="font-medium">Log Fuel Tank Dip</span>
              <span className="text-[10px] font-mono text-slate-400">Daily routine</span>
            </button>

            <button
              onClick={() => onQuickAction('Inspected snowmelter steam trace loop and raw intake chute. Melter online at 1,800 L/day.', 'Logistics', 'Water-Melter')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors text-xs text-slate-700 flex items-center justify-between"
            >
              <span className="font-medium">Melter Loop Inspection</span>
              <span className="text-[10px] font-mono text-slate-400">Morning routine</span>
            </button>

            <button
              onClick={() => onQuickAction('Verified medical emergency high-pressure oxygen manifold at 150 bar. Valve seals nominal.', 'Medical', 'Clinic-O2')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:bg-slate-50 transition-colors text-xs text-slate-700 flex items-center justify-between"
            >
              <span className="font-medium">Medical Oxygen Inspection</span>
              <span className="text-[10px] font-mono text-slate-400">Weekly routine</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
