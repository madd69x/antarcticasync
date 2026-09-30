import React, { useState, useEffect } from 'react';
import { db } from '../db/polarDb';
import type { SyncMutationPacket } from '../types';
import { computeSha256Checksum } from '../services/polarService';
import { 
  GitMerge, 
  Database, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Zap, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Server 
} from 'lucide-react';

interface SyncBridgeViewProps {
  isOnline: boolean;
  onTriggerSync: () => void;
}

export const SyncBridgeView: React.FC<SyncBridgeViewProps> = ({
  isOnline,
  onTriggerSync
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'crdt' | 'inspector'>('architecture');

  // QoS Simulated Packets
  const [qosPackets, setQosPackets] = useState<Array<{
    id: string;
    type: string;
    priorityLevel: number; // 0 for P0, 1 for P1, 2 for P2
    priorityLabel: string;
    rawBytes: number;
    compressedBytes: number;
    timestamp: string;
    checksum: string;
  }>>([
    {
      id: 'PKT-9421',
      type: 'Routine Shift Handover',
      priorityLevel: 2,
      priorityLabel: 'P2: Routine Log',
      rawBytes: 4200,
      compressedBytes: 546,
      timestamp: 'Just now',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  ]);
  const [isBursting, setIsBursting] = useState(false);
  const [deliveredCount, setDeliveredCount] = useState(14);

  // CRDT Simulation states
  const [isPartitioned, setIsPartitioned] = useState(true);
  const [stationEditVal, setStationEditVal] = useState(64200);
  const [hqAllocationVal, setHqAllocationVal] = useState(5000);
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationComplete, setReconciliationComplete] = useState(false);
  const [vectorClockStation, setVectorClockStation] = useState({ bh: 105, hq: 512 });
  const [vectorClockHq, setVectorClockHq] = useState({ bh: 104, hq: 513 });
  const [mergedState, setMergedState] = useState<{
    effectiveStock: number;
    allocatedForTraverse: number;
    checksum: string;
    compressionPct: number;
  } | null>(null);

  // Inspector states
  const [queueItems, setQueueItems] = useState<SyncMutationPacket[]>([]);
  const [localLogsCount, setLocalLogsCount] = useState(0);
  const [selectedPacket, setSelectedPacket] = useState<SyncMutationPacket | null>(null);

  const loadInspectorData = async () => {
    const queue = await db.syncQueue.toArray();
    setQueueItems(queue);
    const count = await db.logs.count();
    setLocalLogsCount(count);
    if (queue.length > 0 && !selectedPacket) {
      setSelectedPacket(queue[0]);
    }
  };

  useEffect(() => {
    loadInspectorData();
  }, [activeTab]);

  const handleSimulateEditStation = () => {
    setStationEditVal(prev => prev - 800);
    setVectorClockStation(prev => ({ ...prev, bh: prev.bh + 1 }));
    setReconciliationComplete(false);
  };

  const handleSimulateEditHq = () => {
    setHqAllocationVal(prev => prev + 1000);
    setVectorClockHq(prev => ({ ...prev, hq: prev.hq + 1 }));
    setReconciliationComplete(false);
  };

  const handleRunCrdtMerge = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsPartitioned(false);
      setIsReconciling(false);
      setReconciliationComplete(true);

      const checksumData = `CRDT_STATE_BHARATI_MOES_${stationEditVal}_${hqAllocationVal}`;
      setMergedState({
        effectiveStock: stationEditVal,
        allocatedForTraverse: hqAllocationVal,
        checksum: computeSha256Checksum(checksumData),
        compressionPct: 87
      });
    }, 1200);
  };

  const handleResetCrdt = () => {
    setIsPartitioned(true);
    setStationEditVal(64200);
    setHqAllocationVal(5000);
    setReconciliationComplete(false);
    setMergedState(null);
    setVectorClockStation({ bh: 105, hq: 512 });
    setVectorClockHq({ bh: 104, hq: 513 });
  };

  const handleAddQosPacket = (type: string, priorityLevel: number, priorityLabel: string, rawBytes: number) => {
    const newPkt = {
      id: `PKT-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      priorityLevel,
      priorityLabel,
      rawBytes,
      compressedBytes: Math.round(rawBytes * 0.13), // 87% Brotli reduction
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      checksum: computeSha256Checksum(`${type}_${Date.now()}`)
    };
    // Prioritized queue: sort ascending by priorityLevel (0: P0 ECG/SOS first, then 1: P1 Telemetry, then 2: P2 Routine)
    setQosPackets(prev => [...prev, newPkt].sort((a, b) => a.priorityLevel - b.priorityLevel));
  };

  const handleTransmitBurstQueue = () => {
    if (qosPackets.length === 0) return;
    setIsBursting(true);
    setTimeout(() => {
      setDeliveredCount(prev => prev + qosPackets.length);
      setQosPackets([]);
      setIsBursting(false);
    }, 1400);
  };

  return (
    <div className="space-y-4">
      
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold overflow-x-auto no-scrollbar touch-pan-x -mx-3 px-3 sm:mx-0 sm:px-0 pb-0.5">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`min-h-[38px] flex items-center pb-2 px-3 border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === 'architecture'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Three-Tier Architecture &amp; QoS Queue
        </button>

        <button
          onClick={() => setActiveTab('crdt')}
          className={`min-h-[38px] flex items-center pb-2 px-3 border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === 'crdt'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          CRDT Concurrent Merge Terminal
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`min-h-[38px] flex items-center pb-2 px-3 border-b-2 transition-all whitespace-nowrap flex-shrink-0 ${
            activeTab === 'inspector'
              ? 'border-slate-900 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          IndexedDB Packet Inspector
        </button>
      </div>

      {/* SUB-TAB 0: THREE-TIER ARCHITECTURE & QOS QUEUE */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-mono uppercase">
                  SIH Presentation Slide 3 Architecture
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Delay-Tolerant Networking (DTN RFC 9171)
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-1">
                Multi-Tier Edge-to-Cloud Telemetry Pipeline
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                Demonstrates how packets generated offline at Antarctic research stations traverse the narrowband satellite relay link into the MoES Cloud Hub in Goa.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
                <span className="text-[9px] text-slate-400 block uppercase font-sans">Delivered to Goa</span>
                <strong className="text-emerald-700 font-bold">{deliveredCount} Packets</strong>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
                <span className="text-[9px] text-slate-400 block uppercase font-sans">In Queue</span>
                <strong className="text-amber-700 font-bold">{qosPackets.length} Pending</strong>
              </div>
            </div>
          </div>

          {/* Interactive Three-Tier Visual Flow */}
          <div className="space-y-3">
            
            {/* LAYER 01: ANTARCTIC STATION */}
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-sky-900 bg-sky-200 px-2 py-0.5 rounded font-mono">
                    LAYER 01
                  </span>
                  <span className="font-bold text-xs text-sky-950 uppercase">
                    Antarctic Station (Offline-First Edge Suite)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-sky-800 bg-white border border-sky-200 px-2 py-0.5 rounded font-semibold">
                  7d Offline Ready · Dexie.js ACID Store
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-sky-100 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">React 18 PWA</span>
                  <span className="text-slate-500 text-[11px] block">Field Tablet &amp; Mobile GUI</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-sky-100 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">Dexie.js Local Store</span>
                  <span className="text-slate-500 text-[11px] block">IndexedDB ACID Persistence</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-sky-100 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">Sensor Gateway</span>
                  <span className="text-slate-500 text-[11px] block">Microgrid &amp; Met Telemetry</span>
                </div>
              </div>
            </div>

            {/* LAYER 02: SYNC BRIDGE */}
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-purple-900 bg-purple-200 px-2 py-0.5 rounded font-mono">
                    LAYER 02
                  </span>
                  <span className="font-bold text-xs text-purple-950 uppercase">
                    Sync Bridge (Intermittent Satellite Relay Link)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-purple-800 bg-white border border-purple-200 px-2 py-0.5 rounded font-semibold">
                  87% Compressed · Iridium SBD 2.4 kbps
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">CRDT Conflict Resolution</span>
                  <span className="text-slate-500 text-[11px] block">Deterministic Vector Clocks</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">Brotli Delta Packaging</span>
                  <span className="text-slate-500 text-[11px] block">87% Narrowband Reduction</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">Prioritized Queue</span>
                  <span className="text-slate-500 text-[11px] block">Telemetry QoS (ECG First)</span>
                </div>
              </div>
            </div>

            {/* LAYER 03: MOES CLOUD HUB */}
            <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-100/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded font-mono">
                    LAYER 03
                  </span>
                  <span className="font-bold text-xs text-slate-900 uppercase">
                    MoES Cloud Hub (Central Mission HQ Goa/Delhi)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-700 bg-white border border-slate-300 px-2 py-0.5 rounded font-semibold">
                  High-Availability Cloud · Ingestion &amp; Archive
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">Node.js API Gateway</span>
                  <span className="text-slate-500 text-[11px] block">REST &amp; Demux Ingest</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">PostgreSQL Master</span>
                  <span className="text-slate-500 text-[11px] block">ACID Relational Ledger</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">MongoDB Aggregation</span>
                  <span className="text-slate-500 text-[11px] block">Time-Series Telemetry</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-0.5">
                  <span className="font-bold text-slate-900 block">Alerting Engine</span>
                  <span className="text-slate-500 text-[11px] block">Automated SOS &amp; SMS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive QoS Queue Simulator Controls */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Test Priority Queue Dispatcher
                </h4>
                <p className="text-[11px] text-slate-500">
                  Inject packets of different priorities to observe QoS re-ordering (P0 ECG leaps ahead of P1 &amp; P2).
                </p>
              </div>

              {qosPackets.length > 0 && (
                <button
                  onClick={handleTransmitBurstQueue}
                  disabled={isBursting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBursting ? 'animate-spin' : ''}`} />
                  <span>{isBursting ? 'Burst Transmitting...' : `Transmit ${qosPackets.length} Packets via LEO Window`}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleAddQosPacket('Clinical Telemedicine ECG Dossier', 0, 'P0: Critical (ECG/SOS)', 9400)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-rose-600" />
                <span>+ Dispatch P0: Telemedicine ECG (Priority 1)</span>
              </button>

              <button
                onClick={() => handleAddQosPacket('Microgrid Generator Voltage Drift', 1, 'P1: Telemetry', 1800)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Dispatch P1: Microgrid Telemetry</span>
              </button>

              <button
                onClick={() => handleAddQosPacket('Station Routine Shift Handover', 2, 'P2: Routine Log', 3600)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Dispatch P2: Routine Shift Log</span>
              </button>
            </div>

            {/* In-Transit Queue Display */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Active In-Transit Queue (Sorted by QoS Strict Priority)
              </span>

              {qosPackets.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 font-mono">
                  [All packets delivered to MoES Cloud Hub in Goa · Queue Ready for Next Satellite Pass]
                </div>
              ) : (
                <div className="space-y-1.5 font-mono text-xs">
                  {qosPackets.map((pkt, idx) => (
                    <div 
                      key={pkt.id} 
                      className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                        pkt.priorityLevel === 0 
                          ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-bold' 
                          : pkt.priorityLevel === 1 
                          ? 'bg-amber-50/60 border-amber-200 text-amber-950 font-semibold' 
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                          #{idx + 1}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          pkt.priorityLevel === 0 ? 'bg-rose-600 text-white' : pkt.priorityLevel === 1 ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {pkt.priorityLabel}
                        </span>
                        <span className="font-sans text-xs">{pkt.type}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-600">
                        <span>Raw: {pkt.rawBytes} B</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">Brotli Diff: {pkt.compressedBytes} B (-87%)</span>
                        <span>•</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={pkt.checksum}>
                          SHA-256: {pkt.checksum.slice(0, 10)}...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 1: CRDT TERMINAL */}
      {activeTab === 'crdt' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Conflict-Free Replicated Data Type (CRDT) Side-by-Side Replication
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simulates concurrent state mutation during satellite blackout partition, followed by deterministic vector-clock reconciliation upon link recovery.
            </p>
          </div>

          {/* Network Partition State */}
          <div className="p-3 rounded border border-slate-200 bg-slate-50 text-xs flex items-center justify-between font-mono">
            <span>
              Link State: {isPartitioned ? '[Satellite Link Broken · Network Partition Active]' : '[Satellite Window Open · Bidirectional Replication Complete]'}
            </span>
            <span className="text-[11px] text-slate-500">
              {isPartitioned ? 'Diverging local nodes' : 'States converged'}
            </span>
          </div>

          {/* Split Screen Terminals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Node A Bharati */}
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-xs uppercase font-mono">
                  Node A: Bharati Station (Offline Terminal)
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                  IndexedDB
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded border border-slate-200 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Tank 1 Physical Measurement</span>
                  <div className="text-2xl font-bold font-mono text-slate-900">{stationEditVal.toLocaleString()} L</div>
                  <span className="text-[10px] text-slate-500 font-mono">Measured by Station Mechanic</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans mb-0.5">Vector Clock</span>
                  <div>node_bharati: {vectorClockStation.bh}</div>
                  <div>node_moes_hq: {vectorClockStation.hq}</div>
                </div>
              </div>

              <button
                onClick={handleSimulateEditStation}
                className="w-full py-1.5 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold shadow-xs"
              >
                Log Fuel Consumption (-800 L)
              </button>
            </div>

            {/* Right: Node B MoES HQ */}
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-xs uppercase font-mono">
                  Node B: MoES Central Desk (Goa Online)
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                  Central MongoDB
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded border border-slate-200 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Traverse Allocation</span>
                  <div className="text-2xl font-bold font-mono text-slate-900">{hqAllocationVal.toLocaleString()} L</div>
                  <span className="text-[10px] text-slate-500 font-mono">Approved by NCPOR Mission Director</span>
                </div>

                <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans mb-0.5">Vector Clock</span>
                  <div>node_bharati: {vectorClockHq.bh}</div>
                  <div>node_moes_hq: {vectorClockHq.hq}</div>
                </div>
              </div>

              <button
                onClick={handleSimulateEditHq}
                className="w-full py-1.5 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold shadow-xs"
              >
                Allocate Traverse Fuel (+1,000 L)
              </button>
            </div>

          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2 text-xs">
            <span className="text-slate-500">
              Trigger mutations above to advance local vector clocks independently, then execute CRDT auto-merge.
            </span>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleResetCrdt}
                className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-center"
              >
                Reset Simulation
              </button>

              <button
                onClick={handleRunCrdtMerge}
                disabled={isReconciling}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs disabled:opacity-50 text-center"
              >
                {isReconciling ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Reconciling Vectors...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run CRDT Auto-Merge</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reconciliation Result Card */}
          {reconciliationComplete && mergedState && (
            <div className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-2 font-mono">
              <div className="flex justify-between items-center text-slate-800 font-bold border-b border-slate-200 pb-1.5">
                <span>[CRDT DETERMINISTIC RESOLUTION SUCCEEDED]</span>
                <span className="text-[11px] text-emerald-700">Bandwidth Reduced: {mergedState.compressionPct}% via Diff</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans">Tank Effective Stock:</span>
                  <strong className="text-slate-900">{mergedState.effectiveStock.toLocaleString()} L</strong>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans">Traverse Allocation:</span>
                  <strong className="text-slate-900">{mergedState.allocatedForTraverse.toLocaleString()} L</strong>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200 truncate">
                  <span className="text-slate-400 block text-[10px] font-sans">SHA-256 Integrity Seal:</span>
                  <strong className="text-slate-700 text-[10px]">{mergedState.checksum}</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 font-sans pt-1">
                Both operations were mathematically commutative and converged to the exact same state at Bharati Station and MoES HQ without manual collision.
              </p>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: INDEXEDDB INSPECTOR */}
      {activeTab === 'inspector' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              On-Device IndexedDB Storage &amp; Transmission Queue
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Transparent inspection of local browser tables and pending packets waiting for satellite connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 text-[10px] font-sans block font-semibold">Local Storage Store</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">IndexedDB / Dexie.js</div>
              <span className="text-[10px] text-slate-500 mt-1 block">{localLogsCount} records persisted</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 text-[10px] font-sans block font-semibold">Replication Logic</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">CRDT Vector Clocks</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Deterministic State Merge</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 text-[10px] font-sans block font-semibold">Transmission Buffer</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{queueItems.length} Pending Packets</div>
              <span className="text-[10px] text-slate-500 mt-1 block">~82% Diff Compression</span>
            </div>
          </div>

          {/* Queue Inspection */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Pending Queue Packets
            </span>

            {queueItems.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded border border-dashed border-slate-200 text-xs text-slate-500 font-mono">
                [Queue is empty · All records synchronized with MoES Central Hub]
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {queueItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPacket(item)}
                      className={`p-2.5 rounded border text-xs cursor-pointer font-mono ${
                        selectedPacket?.id === item.id 
                          ? 'border-slate-800 bg-slate-100 font-semibold' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{item.entityType}</span>
                        <span className="text-slate-400 text-[10px]">{item.id.slice(0, 10)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                        <span>Priority: {item.priority}</span>
                        <span>{item.compressedBytes} B (raw {item.sizeBytes} B)</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  {selectedPacket ? (
                    <pre className="p-3 bg-slate-900 text-slate-300 font-mono text-[11px] rounded overflow-x-auto max-h-56">
                      {JSON.stringify(selectedPacket, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded border border-slate-200 font-mono">
                      Select a packet to inspect payload
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Sync Button */}
          {queueItems.length > 0 && isOnline && (
            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                onClick={onTriggerSync}
                className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
              >
                Transmit All Queued Packets
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
