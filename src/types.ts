export type StationId = 'bharati' | 'maitri' | 'himadri' | 'himansh';

export type NetworkLinkMode = 'online' | 'patchy' | 'blackout';

export interface StationInfo {
  id: StationId;
  name: string;
  region: string;
  coordinates: string;
  crewCount: number;
  expeditionNumber: string;
  stationLeader: string;
  establishedYear: number;
  elevation: string;
  type: 'antarctic' | 'arctic' | 'himalayan';
}

export interface WeatherTelemetry {
  ambientTemp: number; // °C
  windChill: number;   // °C
  windSpeed: number;   // Knots
  windGust: number;    // Knots
  windDirection: string;
  blizzardCategory: 'None' | 'Cat-1 Advisory' | 'Cat-2 Warning' | 'Cat-3 Severe';
  atmosphericPressure: number; // hPa
  relativeHumidity: number;    // %
  visibilityKm: number;
  lastUpdated: string;
}

export interface GeneratorTelemetry {
  id: string;
  name: string;
  status: 'running' | 'standby' | 'maintenance' | 'offline';
  loadKw: number;
  maxKw: number;
  coolantTemp: number; // °C (75-90 nominal)
  oilPressure: number; // bar (4.0-5.2 nominal)
  vibrationRms: number;// mm/s (< 2.5 nominal, > 3.5 warning)
  exhaustTemp: number; // °C (heat recovery to radiators)
  runHours: number;
  nextServiceHours: number;
}

export interface LifeSupportTelemetry {
  indoorHabitatTemp: number; // °C
  indoorHumidity: number;    // %
  o2Saturation: number;      // %
  co2Ppm: number;
  potableWaterLitres: number;
  potableWaterCapacity: number;
  snowMelterActive: boolean;
  radiatorLoopActive: boolean;
  crewAccountedFor: number;
  totalCrew: number;
}

export interface ConsumableItem {
  id: string;
  name: string;
  category: 'Fuel' | 'Spares' | 'Medical' | 'Life Support' | 'Rations';
  currentStock: number;
  unit: string;
  burnRatePerDay: number;
  daysRemaining: number;
  thresholdWarning: number;
  status: 'Adequate' | 'Watchlist' | 'Critical';
  storageLocation: string;
  lastInspected: string;
}

export interface StationLogEntry {
  id: string;
  timestamp: string;
  authorName: string;
  authorRole: string;
  category: 'Generator' | 'Weather' | 'Science' | 'Logistics' | 'Medical' | 'General';
  content: string;
  tag: string;
  priority: 'routine' | 'important' | 'emergency';
  isSynced: boolean;
  stationId: StationId;
}

export interface SyncMutationPacket {
  id: string;
  stationId: StationId;
  timestamp: string;
  entityType: 'LOG_ENTRY' | 'ASSET_UPDATE' | 'GENERATOR_CHECK' | 'ALERT_ACK';
  payload: any;
  vectorClock: { [nodeId: string]: number };
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'critical';
  sizeBytes: number;
  compressedBytes: number;
}

// Convoy Traverse Telemetry
export interface ConvoyTraverse {
  convoyId: string;
  name: string;
  leadVehicle: string;
  destination: string;
  distanceFromBaseKm: number;
  totalDistanceKm: number;
  speedKmh: number;
  fuelOnBoardLitres: number;
  crewMembers: string[];
  vhfSignalStatus: 'Strong' | 'Intermittent' | 'Lost';
  lat: number;
  lon: number;
}

// Muster Crew Member
export interface MusterCrewMember {
  id: string;
  name: string;
  role: string;
  locationModule: 'Main Living Module' | 'Generator Room' | 'Medical Bay' | 'Upper Met Deck' | 'Out on Perimeter Ropes';
  status: 'Safe & Accounted' | 'Alert: Outside Shelter';
  lastPing: string;
}

// Renewable & Madrid Protocol Environmental Metrics
export interface RenewableMetrics {
  windTurbinesKw: number;
  solarPvKw: number;
  totalRenewableKw: number;
  dieselSavedLitresYtd: number;
  co2AvoidedTonsYtd: number;
  retrogradeWasteBarrels: {
    hazardousChemicals: number;
    electronicScrap: number;
    incineratorAsh: number;
    bioSafetyRecycled: number;
  };
}

// Telemedicine Case
export interface TelemedicineCase {
  caseId: string;
  patientCallsign: string;
  chiefComplaint: string;
  triageCategory: 'Urgent Consult' | 'Routine Clinical' | 'Life-Threatening';
  vitals: {
    heartRateBpm: number;
    bloodPressure: string;
    coreTempC: number;
    spo2Pct: number;
  };
  recommendedAction: string;
  isPackagedForBurst: boolean;
  packetSizeKb: number;
}
