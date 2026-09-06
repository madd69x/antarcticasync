import React, { useState, useEffect } from 'react';
import type { 
  StationId, 
  NetworkLinkMode, 
  StationLogEntry, 
  ConsumableItem, 
  WeatherTelemetry, 
  GeneratorTelemetry, 
  LifeSupportTelemetry 
} from './types';
import { db, seedDatabaseIfEmpty } from './db/polarDb';
import { 
  INITIAL_WEATHER, 
  INITIAL_GENERATORS, 
  INITIAL_LIFE_SUPPORT, 
  STATIONS,
  addStationLog, 
  processSyncQueue 
} from './services/polarService';

import { Header } from './components/Header';
import { SatelliteBanner } from './components/SatelliteBanner';
import { DailyStationView } from './components/DailyStationView';
import { PolarMapView } from './components/PolarMapView';
import { PowerLifeSupportView } from './components/PowerLifeSupportView';
import { InventoryView } from './components/InventoryView';
import { HqCoordinationView } from './components/HqCoordinationView';
import { SyncInspectorModal } from './components/SyncInspectorModal';
import { NewLogModal } from './components/NewLogModal';
import { CrdtPlaygroundModal } from './components/CrdtPlaygroundModal';
import { BlizzardLockdownModal } from './components/BlizzardLockdownModal';
import { SurvivalSimulatorModal } from './components/SurvivalSimulatorModal';
import { DataExportModal } from './components/DataExportModal';
import { MadridEcoModal } from './components/MadridEcoModal';
import { TelemedicineModal } from './components/TelemedicineModal';
import { JudgeTourModal } from './components/JudgeTourModal';

export const App: React.FC = () => {
  const [currentStation, setCurrentStation] = useState<StationId>('bharati');
  const [networkMode, setNetworkMode] = useState<NetworkLinkMode>('online');
  const [activeTab, setActiveTab] = useState<'daily' | 'map' | 'power' | 'inventory' | 'hq'>('daily');

  // Database states
  const [logs, setLogs] = useState<StationLogEntry[]>([]);
  const [consumables, setConsumables] = useState<ConsumableItem[]>([]);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Telemetry states
  const [weather, setWeather] = useState<WeatherTelemetry>(INITIAL_WEATHER.bharati);
  const [generators, setGenerators] = useState<GeneratorTelemetry[]>(INITIAL_GENERATORS);
  const [lifeSupport, setLifeSupport] = useState<LifeSupportTelemetry>(INITIAL_LIFE_SUPPORT);

  // Modals
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const [isSyncInspectorOpen, setIsSyncInspectorOpen] = useState(false);
  const [isCrdtPlaygroundOpen, setIsCrdtPlaygroundOpen] = useState(false);
  const [isBlizzardLockdownOpen, setIsBlizzardLockdownOpen] = useState(false);
  const [isSurvivalSimulatorOpen, setIsSurvivalSimulatorOpen] = useState(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState(false);
  const [isMadridEcoOpen, setIsMadridEcoOpen] = useState(false);
  const [isTelemedicineOpen, setIsTelemedicineOpen] = useState(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);

  // Initialize DB and load logs
  const reloadData = async () => {
    await seedDatabaseIfEmpty();
    const allLogs = await db.logs.orderBy('timestamp').reverse().toArray();
    setLogs(allLogs);
    const allConsumables = await db.consumables.toArray();
    setConsumables(allConsumables);
    const queueCount = await db.syncQueue.count();
    setPendingSyncCount(queueCount);
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Update weather whenever station changes
  useEffect(() => {
    setWeather(INITIAL_WEATHER[currentStation] || INITIAL_WEATHER.bharati);
  }, [currentStation]);

  // Subtle realistic sensor telemetry drift every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        ambientTemp: Number((prev.ambientTemp + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        windSpeed: Number((Math.max(10, prev.windSpeed + (Math.random() * 2 - 1))).toFixed(0))
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Sync processor
  const handleTriggerSync = async () => {
    if (networkMode === 'blackout') return;
    setIsSyncing(true);
    try {
      await processSyncQueue();
      await reloadData();
    } finally {
      setIsSyncing(false);
    }
  };

  // Switch network mode handler
  const handleSetNetworkMode = async (mode: NetworkLinkMode) => {
    setNetworkMode(mode);
    if (mode === 'online') {
      setIsSyncing(true);
      await processSyncQueue();
      await reloadData();
      setIsSyncing(false);
    }
  };

  // Add Log Entry handler
  const handleAddLog = async (
    authorName: string,
    authorRole: string,
    category: StationLogEntry['category'],
    content: string,
    tag: string,
    priority: StationLogEntry['priority']
  ) => {
    await addStationLog(
      currentStation,
      authorName,
      authorRole,
      category,
      content,
      tag,
      priority,
      networkMode
    );
    await reloadData();
  };

  // Quick action shortcut handler
  const handleQuickAction = async (
    actionText: string,
    category: StationLogEntry['category'],
    tag: string
  ) => {
    await addStationLog(
      currentStation,
      'Field Duty Engineer',
      'Operations Staff',
      category,
      actionText,
      tag,
      'routine',
      networkMode
    );
    await reloadData();
  };

  // Stock update handler
  const handleUpdateStock = async (id: string, newStock: number) => {
    const item = consumables.find(c => c.id === id);
    if (!item) return;

    const daysRemaining = Math.max(1, Math.round(newStock / item.burnRatePerDay));
    const status = newStock <= item.thresholdWarning ? 'Watchlist' : 'Adequate';

    await db.consumables.update(id, {
      currentStock: newStock,
      daysRemaining,
      status,
      lastInspected: 'Just now'
    });

    await addStationLog(
      currentStation,
      'Inventory Manager',
      'Logistics Bay',
      'Logistics',
      `Stock inventory count updated for "${item.name}": now ${newStock.toLocaleString()} ${item.unit} (${daysRemaining} days buffer remaining).`,
      'Stock-Audit',
      'routine',
      networkMode
    );

    await reloadData();
  };

  // Generator load switchover handler
  const handleSwitchGenerator = async (targetId: string) => {
    const updated = generators.map(gen => {
      if (gen.id === targetId) {
        return { ...gen, status: 'running' as const, loadKw: 76.5, oilPressure: 4.6, vibrationRms: 2.1 };
      } else {
        return { ...gen, status: 'standby' as const, loadKw: 0, oilPressure: 0, vibrationRms: 0 };
      }
    });
    setGenerators(updated);

    const targetGen = generators.find(g => g.id === targetId);
    await addStationLog(
      currentStation,
      'Priya Nair',
      'Station Mechanical Engineer',
      'Generator',
      `Manual microgrid load transfer executed. Station electrical bus successfully transitioned to ${targetGen?.name || targetId}. All microgrid frequencies holding nominal at 50.1 Hz.`,
      'Genset-Switch',
      'important',
      networkMode
    );

    await reloadData();
  };

  const currentFuelStock = consumables.find(c => c.category === 'Fuel')?.currentStock || 68200;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Top MoES Header */}
      <Header
        currentStation={currentStation}
        onSelectStation={setCurrentStation}
        onOpenSyncInspector={() => setIsSyncInspectorOpen(true)}
        onOpenCrdtPlayground={() => setIsCrdtPlaygroundOpen(true)}
        onOpenBlizzardLockdown={() => setIsBlizzardLockdownOpen(true)}
        onOpenSurvivalSimulator={() => setIsSurvivalSimulatorOpen(true)}
        onOpenDataExport={() => setIsDataExportOpen(true)}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
        onOpenMadridEco={() => setIsMadridEcoOpen(true)}
        onOpenTelemedicine={() => setIsTelemedicineOpen(true)}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 space-y-5">
        
        {/* Humane Satellite Banner */}
        <SatelliteBanner
          networkMode={networkMode}
          onSetNetworkMode={handleSetNetworkMode}
          pendingCount={pendingSyncCount}
          isSyncing={isSyncing}
          onTriggerSync={handleTriggerSync}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-medium overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveTab('daily')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'daily'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📋 Daily Station Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'map'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🗺️ Polar Map &amp; Convoy</span>
          </button>

          <button
            onClick={() => setActiveTab('power')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'power'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>⚡ Power &amp; Microgrid</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📦 Winter Supplies &amp; Fuel</span>
          </button>

          <button
            onClick={() => setActiveTab('hq')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'hq'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🏢 MoES HQ Coordination</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'daily' && (
          <DailyStationView
            currentStation={currentStation}
            weather={weather}
            lifeSupport={lifeSupport}
            logs={logs}
            onOpenNewLogModal={() => setIsNewLogOpen(true)}
            onQuickAction={handleQuickAction}
            onOpenMadridEco={() => setIsMadridEcoOpen(true)}
            onOpenTelemedicine={() => setIsTelemedicineOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <PolarMapView
            currentStation={currentStation}
            onSelectStation={(st) => {
              setCurrentStation(st);
            }}
          />
        )}

        {activeTab === 'power' && (
          <PowerLifeSupportView
            generators={generators}
            lifeSupport={lifeSupport}
            onSwitchGenerator={handleSwitchGenerator}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            consumables={consumables}
            onUpdateStock={handleUpdateStock}
          />
        )}

        {activeTab === 'hq' && (
          <HqCoordinationView
            onSelectStation={(st) => {
              setCurrentStation(st);
              setActiveTab('daily');
            }}
            onBroadcastMessage={async (msg) => {
              await addStationLog(
                currentStation,
                'NCPOR Duty Officer',
                'Goa Polar Operations Room',
                'General',
                `HQ DIRECTIVE RECEIVED: ${msg}`,
                'HQ-Broadcast',
                'important',
                networkMode
              );
              await reloadData();
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            AntarcticaSync · Smart India Hackathon 2025 (PS ID: SIH26060) · Team FrostByte
          </span>
          <span>
            Ministry of Earth Sciences &amp; National Centre for Polar and Ocean Research (NCPOR)
          </span>
        </div>
      </footer>

      {/* Modals */}
      <NewLogModal
        isOpen={isNewLogOpen}
        onClose={() => setIsNewLogOpen(false)}
        onSubmit={handleAddLog}
      />

      <SyncInspectorModal
        isOpen={isSyncInspectorOpen}
        onClose={() => setIsSyncInspectorOpen(false)}
        onTriggerSync={handleTriggerSync}
        isOnline={networkMode !== 'blackout'}
      />

      <CrdtPlaygroundModal
        isOpen={isCrdtPlaygroundOpen}
        onClose={() => setIsCrdtPlaygroundOpen(false)}
      />

      <BlizzardLockdownModal
        isOpen={isBlizzardLockdownOpen}
        onClose={() => setIsBlizzardLockdownOpen(false)}
        onTriggerAlertLog={async (txt) => {
          await addStationLog(
            currentStation,
            'Station Leader',
            'Master Command Room',
            'Weather',
            txt,
            'Emergency-Protocol',
            'emergency',
            networkMode
          );
          await reloadData();
        }}
      />

      <SurvivalSimulatorModal
        isOpen={isSurvivalSimulatorOpen}
        onClose={() => setIsSurvivalSimulatorOpen(false)}
        currentStockLitres={currentFuelStock}
      />

      <DataExportModal
        isOpen={isDataExportOpen}
        onClose={() => setIsDataExportOpen(false)}
        logs={logs}
        consumables={consumables}
        stationName={STATIONS[currentStation].name}
      />

      <MadridEcoModal
        isOpen={isMadridEcoOpen}
        onClose={() => setIsMadridEcoOpen(false)}
        stationName={STATIONS[currentStation].name}
      />

      <TelemedicineModal
        isOpen={isTelemedicineOpen}
        onClose={() => setIsTelemedicineOpen(false)}
        onLogEmergency={async (txt) => {
          await addStationLog(
            currentStation,
            'Dr. Ananya Joshi',
            'Station Medical Officer',
            'Medical',
            txt,
            'Telemed-Consult',
            'emergency',
            networkMode
          );
          await reloadData();
        }}
      />

      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsJudgeTourOpen(false);
        }}
        onOpenCrdt={() => setIsCrdtPlaygroundOpen(true)}
        onOpenBlizzard={() => setIsBlizzardLockdownOpen(true)}
        onOpenSimulator={() => setIsSurvivalSimulatorOpen(true)}
        onOpenMadrid={() => setIsMadridEcoOpen(true)}
      />

    </div>
  );
};
export default App;
