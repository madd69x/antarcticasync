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
import { SafetyMedicalView } from './components/SafetyMedicalView';
import { SyncBridgeView } from './components/SyncBridgeView';
import { NewLogModal } from './components/NewLogModal';

export const App: React.FC = () => {
  const [currentStation, setCurrentStation] = useState<StationId>('bharati');
  const [networkMode, setNetworkMode] = useState<NetworkLinkMode>('online');
  const [activeTab, setActiveTab] = useState<'overview' | 'power' | 'map' | 'logistics' | 'safety' | 'sync' | 'hq'>('overview');

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
      'Inventory Auditor',
      'Logistics Section',
      'Logistics',
      `Physical stock count updated for "${item.name}": now ${newStock.toLocaleString()} ${item.unit} (${daysRemaining} days operational buffer).`,
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
      `Station electrical bus transitioned to ${targetGen?.name || targetId}. Bus frequency holding at 50.1 Hz nominal.`,
      'Genset-Switch',
      'important',
      networkMode
    );

    await reloadData();
  };

  const currentFuelStock = consumables.find(c => c.category === 'Fuel')?.currentStock || 68200;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Institutional Top Header */}
      <Header
        currentStation={currentStation}
        onSelectStation={setCurrentStation}
        onOpenNewLogModal={() => setIsNewLogOpen(true)}
        networkMode={networkMode}
        pendingSyncCount={pendingSyncCount}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
        
        {/* Discrete Satellite Banner */}
        <SatelliteBanner
          networkMode={networkMode}
          onSetNetworkMode={handleSetNetworkMode}
          pendingCount={pendingSyncCount}
          isSyncing={isSyncing}
          onTriggerSync={handleTriggerSync}
        />

        {/* Primary Workspace Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('power')}
            className={`pb-2 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'power'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Power &amp; Microgrid
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`pb-2 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'map'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Geographic Map &amp; Traverses
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`pb-2 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'logistics'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Logistics, Waste &amp; Science
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`pb-2 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'safety'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Safety, Muster &amp; Telemedicine
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-2 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'sync'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Replication &amp; CRDT Bridge
          </button>

          <button
            onClick={() => setActiveTab('hq')}
            className={`pb-2 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'hq'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            NCPOR Strategic Command
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <DailyStationView
            currentStation={currentStation}
            weather={weather}
            lifeSupport={lifeSupport}
            logs={logs}
            onOpenNewLogModal={() => setIsNewLogOpen(true)}
            onQuickAction={handleQuickAction}
          />
        )}

        {activeTab === 'power' && (
          <PowerLifeSupportView
            generators={generators}
            lifeSupport={lifeSupport}
            currentFuelStockLitres={currentFuelStock}
            onSwitchGenerator={handleSwitchGenerator}
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

        {activeTab === 'logistics' && (
          <InventoryView
            consumables={consumables}
            logs={logs}
            stationName={STATIONS[currentStation].name}
            onUpdateStock={handleUpdateStock}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyMedicalView
            onTriggerAlertLog={async (txt) => {
              await addStationLog(
                currentStation,
                'Station Safety Officer',
                'Operations Command',
                'General',
                txt,
                'Safety-Protocol',
                'emergency',
                networkMode
              );
              await reloadData();
            }}
          />
        )}

        {activeTab === 'sync' && (
          <SyncBridgeView
            isOnline={networkMode !== 'blackout'}
            onTriggerSync={handleTriggerSync}
          />
        )}

        {activeTab === 'hq' && (
          <HqCoordinationView
            onSelectStation={(st) => {
              setCurrentStation(st);
              setActiveTab('overview');
            }}
            onBroadcastMessage={async (msg) => {
              await addStationLog(
                currentStation,
                'NCPOR Duty Officer',
                'Goa Polar Operations Desk',
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

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8 py-3.5 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            AntarcticaSync · National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences
          </span>
          <span>
            SIH 2025 · PS ID: SIH26060 · Team FrostByte
          </span>
        </div>
      </footer>

      {/* New Logbook Record Modal */}
      <NewLogModal
        isOpen={isNewLogOpen}
        onClose={() => setIsNewLogOpen(false)}
        onSubmit={handleAddLog}
      />

    </div>
  );
};
export default App;
