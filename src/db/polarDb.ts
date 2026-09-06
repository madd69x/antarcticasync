import Dexie, { type Table } from 'dexie';
import type { StationLogEntry, ConsumableItem, SyncMutationPacket } from '../types';

export class AntarcticaSyncDatabase extends Dexie {
  logs!: Table<StationLogEntry, string>;
  consumables!: Table<ConsumableItem, string>;
  syncQueue!: Table<SyncMutationPacket, string>;

  constructor() {
    super('AntarcticaSyncDB');
    this.version(1).stores({
      logs: 'id, stationId, timestamp, isSynced, category',
      consumables: 'id, category, status',
      syncQueue: 'id, stationId, status, priority, timestamp'
    });
  }
}

export const db = new AntarcticaSyncDatabase();

export const INITIAL_CONSUMABLES: ConsumableItem[] = [
  {
    id: 'fuel-atf-main',
    name: 'Arctic Aviation Turbine Fuel (Jet A-1 / ATF)',
    category: 'Fuel',
    currentStock: 68200,
    unit: 'Litres',
    burnRatePerDay: 1100,
    daysRemaining: 62,
    thresholdWarning: 20000,
    status: 'Adequate',
    storageLocation: 'Bulk Fuel Farm Tanks 1 & 2',
    lastInspected: 'Today, 08:00'
  },
  {
    id: 'spares-filter-dg',
    name: 'Cummins DG Heavy Fuel & Oil Filters',
    category: 'Spares',
    currentStock: 16,
    unit: 'Units',
    burnRatePerDay: 0.1,
    daysRemaining: 160,
    thresholdWarning: 4,
    status: 'Adequate',
    storageLocation: 'Workshop Bay 2 - Spares Rack B',
    lastInspected: '2 days ago'
  },
  {
    id: 'med-oxygen',
    name: 'Medical Grade High-Pressure Oxygen (40L)',
    category: 'Medical',
    currentStock: 18,
    unit: 'Cylinders',
    burnRatePerDay: 0.05,
    daysRemaining: 360,
    thresholdWarning: 5,
    status: 'Adequate',
    storageLocation: 'Station Clinic Triage Bay',
    lastInspected: 'Yesterday'
  },
  {
    id: 'life-water-cartridge',
    name: 'Reverse Osmosis Water Purification Cartridges',
    category: 'Life Support',
    currentStock: 3,
    unit: 'Cartridges',
    burnRatePerDay: 0.033,
    daysRemaining: 90,
    thresholdWarning: 4,
    status: 'Watchlist',
    storageLocation: 'Potable Melter Pump Room',
    lastInspected: 'Yesterday'
  },
  {
    id: 'ration-pulses-grain',
    name: 'Basmati Rice, Wheat Flour & Lentils Reserve',
    category: 'Rations',
    currentStock: 2400,
    unit: 'kg',
    burnRatePerDay: 14,
    daysRemaining: 171,
    thresholdWarning: 600,
    status: 'Adequate',
    storageLocation: 'Dry Storage Chamber #1',
    lastInspected: 'Yesterday'
  },
  {
    id: 'spares-snowmobile-belts',
    name: 'Drive Belts for PistenBully & Snowmobiles',
    category: 'Spares',
    currentStock: 4,
    unit: 'Sets',
    burnRatePerDay: 0.04,
    daysRemaining: 100,
    thresholdWarning: 2,
    status: 'Adequate',
    storageLocation: 'Vehicle Hangar Locker 4',
    lastInspected: '3 days ago'
  }
];

export const INITIAL_LOGS: StationLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    authorName: 'Priya Nair',
    authorRole: 'Station Mechanical Engineer',
    category: 'Generator',
    content: 'Inspected the intake louvers on DG-1 after overnight spindrift. Small ice accumulation was manually cleared. Airflow restored to nominal 100%. Bearing vibration remains steady at 2.4 mm/s RMS.',
    tag: 'Genset-DG1',
    priority: 'routine',
    isSynced: true,
    stationId: 'bharati'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    authorName: 'Dr. Sourav Roy',
    authorRole: 'Glaciology Team Lead',
    category: 'Science',
    content: 'Completed cataloging of 12 ice-core samples extracted from the coastal shelf transect. Stored safely in cryogenic vault #2 at -80°C. Temperature logged nominal.',
    tag: 'Cryo-Vault',
    priority: 'routine',
    isSynced: true,
    stationId: 'bharati'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    authorName: 'Gurpreet Singh',
    authorRole: 'Logistics & Chef',
    category: 'Logistics',
    content: 'Weekly inventory count for dry rations and emergency preserves completed. Sufficient stocks for the full remaining 140 days of winter season with healthy buffer.',
    tag: 'Rations',
    priority: 'routine',
    isSynced: true,
    stationId: 'bharati'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    authorName: 'Amitesh Sen',
    authorRole: 'Meteorologist (IMD)',
    category: 'Weather',
    content: 'Cat-2 blizzard warning expired at 06:00 UTC. Sustained winds dropping below 28 knots. Outdoor traverse permitted within 2 km station perimeter.',
    tag: 'Safety-Briefing',
    priority: 'important',
    isSynced: true,
    stationId: 'bharati'
  }
];

export async function seedDatabaseIfEmpty() {
  const logCount = await db.logs.count();
  if (logCount === 0) {
    await db.logs.bulkAdd(INITIAL_LOGS);
  }

  const consumableCount = await db.consumables.count();
  if (consumableCount === 0) {
    await db.consumables.bulkAdd(INITIAL_CONSUMABLES);
  }
}
