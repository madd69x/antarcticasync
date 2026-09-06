import { db } from '../db/polarDb';
import type { 
  StationId, 
  StationInfo, 
  WeatherTelemetry, 
  GeneratorTelemetry, 
  LifeSupportTelemetry, 
  StationLogEntry, 
  SyncMutationPacket,
  NetworkLinkMode,
  ConvoyTraverse,
  MusterCrewMember
} from '../types';

export const STATIONS: Record<StationId, StationInfo> = {
  bharati: {
    id: 'bharati',
    name: 'Bharati Research Station',
    region: 'Larsemann Hills, East Antarctica',
    coordinates: '69°24′28″S 76°11′14″E',
    crewCount: 24,
    expeditionNumber: '44th Indian Antarctic Expedition',
    stationLeader: 'Dr. H. S. Rawat (Scientist-F, NCPOR)',
    establishedYear: 2012,
    elevation: '35 m above sea level',
    type: 'antarctic'
  },
  maitri: {
    id: 'maitri',
    name: 'Maitri Research Station',
    region: 'Schirmacher Oasis, Queen Maud Land',
    coordinates: '70°45′57″S 11°44′09″E',
    crewCount: 21,
    expeditionNumber: '44th Indian Antarctic Expedition',
    stationLeader: 'Dr. K. N. Venkatesh (Geophysicist, NGRI)',
    establishedYear: 1989,
    elevation: '117 m above sea level',
    type: 'antarctic'
  },
  himadri: {
    id: 'himadri',
    name: 'Himadri Arctic Station',
    region: 'Ny-Ålesund, Svalbard, Norway',
    coordinates: '78°55′N 11°56′E',
    crewCount: 8,
    expeditionNumber: '17th Indian Arctic Expedition',
    stationLeader: 'Dr. A. B. Roy (Glaciologist)',
    establishedYear: 2008,
    elevation: '15 m above sea level',
    type: 'arctic'
  },
  himansh: {
    id: 'himansh',
    name: 'Himansh Himalayan Station',
    region: 'Chandra Basin, Spiti Valley, Himachal Pradesh',
    coordinates: '32°24′N 77°37′E',
    crewCount: 6,
    expeditionNumber: 'National Cryosphere Programme',
    stationLeader: 'Dr. R. P. Singh (High-Altitude Glaciologist)',
    establishedYear: 2016,
    elevation: '4,080 m (13,500 ft) above sea level',
    type: 'himalayan'
  }
};

export const INITIAL_WEATHER: Record<StationId, WeatherTelemetry> = {
  bharati: {
    ambientTemp: -28.4,
    windChill: -39.2,
    windSpeed: 24.5,
    windGust: 32.0,
    windDirection: 'ESE (115°)',
    blizzardCategory: 'None',
    atmosphericPressure: 984.6,
    relativeHumidity: 42,
    visibilityKm: 18.5,
    lastUpdated: 'Live IMD Polar Sensor'
  },
  maitri: {
    ambientTemp: -32.1,
    windChill: -44.8,
    windSpeed: 28.0,
    windGust: 37.5,
    windDirection: 'S (185°)',
    blizzardCategory: 'Cat-1 Advisory',
    atmosphericPressure: 978.2,
    relativeHumidity: 39,
    visibilityKm: 12.0,
    lastUpdated: 'Live IMD Polar Sensor'
  },
  himadri: {
    ambientTemp: -14.2,
    windChill: -21.0,
    windSpeed: 16.0,
    windGust: 22.0,
    windDirection: 'NW (310°)',
    blizzardCategory: 'None',
    atmosphericPressure: 1004.1,
    relativeHumidity: 65,
    visibilityKm: 25.0,
    lastUpdated: 'Live Ny-Ålesund Sensor'
  },
  himansh: {
    ambientTemp: -18.6,
    windChill: -26.4,
    windSpeed: 21.0,
    windGust: 34.0,
    windDirection: 'WNW (290°)',
    blizzardCategory: 'Cat-1 Advisory',
    atmosphericPressure: 615.4, // High altitude atmospheric pressure
    relativeHumidity: 28,
    visibilityKm: 30.0,
    lastUpdated: 'Live Spiti Automatic Weather Station'
  }
};

export const INITIAL_GENERATORS: GeneratorTelemetry[] = [
  {
    id: 'dg-1',
    name: 'Main Diesel Generator #1 (Caterpillar 3406)',
    status: 'running',
    loadKw: 76.5,
    maxKw: 150.0,
    coolantTemp: 82.4,
    oilPressure: 4.6,
    vibrationRms: 2.4,
    exhaustTemp: 342,
    runHours: 1420,
    nextServiceHours: 1500
  },
  {
    id: 'dg-2',
    name: 'Backup Diesel Generator #2 (Caterpillar 3406)',
    status: 'standby',
    loadKw: 0,
    maxKw: 150.0,
    coolantTemp: 42.0,
    oilPressure: 0,
    vibrationRms: 0,
    exhaustTemp: 24,
    runHours: 1180,
    nextServiceHours: 1500
  },
  {
    id: 'dg-3',
    name: 'Emergency Life-Support Generator #3',
    status: 'standby',
    loadKw: 0,
    maxKw: 80.0,
    coolantTemp: 38.5,
    oilPressure: 0,
    vibrationRms: 0,
    exhaustTemp: 20,
    runHours: 410,
    nextServiceHours: 1000
  }
];

export const INITIAL_LIFE_SUPPORT: LifeSupportTelemetry = {
  indoorHabitatTemp: 21.2,
  indoorHumidity: 38,
  o2Saturation: 99.4,
  co2Ppm: 540,
  potableWaterLitres: 14200,
  potableWaterCapacity: 18000,
  snowMelterActive: true,
  radiatorLoopActive: true,
  crewAccountedFor: 24,
  totalCrew: 24
};

// Active Deep-Glacier Inland Convoy Traverse
export const ACTIVE_CONVOY: ConvoyTraverse = {
  convoyId: 'CONVOY-44-A',
  name: 'Amery Ice Shelf Scientific Traverse',
  leadVehicle: 'PistenBully 300 Polar Track (PB-01)',
  destination: 'Subglacial Lake Sampling Camp #3',
  distanceFromBaseKm: 64.2,
  totalDistanceKm: 180.0,
  speedKmh: 14.5,
  fuelOnBoardLitres: 1850,
  crewMembers: ['Dr. Sourav Roy (Glaciologist)', 'Vikram Jadhav (Field Mechanic)'],
  vhfSignalStatus: 'Strong',
  lat: -69.642,
  lon: 75.821
};

// Muster Crew list for Blizzard Protocol
export const INITIAL_MUSTER_CREW: MusterCrewMember[] = [
  { id: 'c1', name: 'Dr. H. S. Rawat', role: 'Station Leader', locationModule: 'Main Living Module', status: 'Safe & Accounted', lastPing: '1 min ago' },
  { id: 'c2', name: 'Priya Nair', role: 'Station Mechanical Engineer', locationModule: 'Generator Room', status: 'Safe & Accounted', lastPing: 'Just now' },
  { id: 'c3', name: 'Dr. Sourav Roy', role: 'Glaciologist', locationModule: 'Main Living Module', status: 'Safe & Accounted', lastPing: '3 mins ago' },
  { id: 'c4', name: 'Gurpreet Singh', role: 'Logistics & Chef', locationModule: 'Main Living Module', status: 'Safe & Accounted', lastPing: '2 mins ago' },
  { id: 'c5', name: 'Dr. Ananya Joshi', role: 'Station Medical Officer', locationModule: 'Medical Bay', status: 'Safe & Accounted', lastPing: 'Just now' },
  { id: 'c6', name: 'Amitesh Sen', role: 'Meteorologist (IMD)', locationModule: 'Upper Met Deck', status: 'Safe & Accounted', lastPing: '1 min ago' },
  { id: 'c7', name: 'Vikram Jadhav', role: 'Vehicle Mechanic', locationModule: 'Main Living Module', status: 'Safe & Accounted', lastPing: '4 mins ago' },
  { id: 'c8', name: 'Col. Sanjeev Mehra', role: 'Communication Specialist', locationModule: 'Main Living Module', status: 'Safe & Accounted', lastPing: 'Just now' }
];

let localVectorClock = 104;

export async function addStationLog(
  stationId: StationId,
  authorName: string,
  authorRole: string,
  category: StationLogEntry['category'],
  content: string,
  tag: string,
  priority: StationLogEntry['priority'],
  networkMode: NetworkLinkMode
): Promise<StationLogEntry> {
  localVectorClock++;
  const isOnline = networkMode === 'online';

  const newLog: StationLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    authorName,
    authorRole,
    category,
    content,
    tag,
    priority,
    isSynced: isOnline,
    stationId
  };

  await db.logs.add(newLog);

  if (!isOnline) {
    const rawPayload = JSON.stringify(newLog);
    const rawBytes = new Blob([rawPayload]).size;
    const compressedBytes = Math.max(48, Math.round(rawBytes * 0.18));

    const packet: SyncMutationPacket = {
      id: `pkt-${Date.now()}`,
      stationId,
      timestamp: newLog.timestamp,
      entityType: 'LOG_ENTRY',
      payload: newLog,
      vectorClock: { [`node_${stationId}`]: localVectorClock, node_moes_hq: 512 },
      status: 'pending',
      priority: priority === 'emergency' ? 'critical' : priority === 'important' ? 'high' : 'normal',
      sizeBytes: rawBytes,
      compressedBytes
    };

    await db.syncQueue.add(packet);
  }

  return newLog;
}

export async function processSyncQueue(): Promise<number> {
  const pendingItems = await db.syncQueue.where('status').equals('pending').toArray();
  if (pendingItems.length === 0) return 0;

  for (const item of pendingItems) {
    if (item.entityType === 'LOG_ENTRY' && item.payload?.id) {
      await db.logs.update(item.payload.id, { isSynced: true });
    }
    await db.syncQueue.delete(item.id);
  }

  return pendingItems.length;
}

// Generate simple deterministic SHA-256-like hex checksum for demo integrity
export function computeSha256Checksum(data: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    hash ^= data.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  const hex = hash.toString(16).padStart(8, '0');
  return `sha256:7f4c${hex}9a12e34b07d581f62d8c3e`;
}
