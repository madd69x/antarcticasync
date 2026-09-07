import React, { useState, useEffect } from 'react';
import { db } from '../db/polarDb';
import type { SyncMutationPacket } from '../types';
import { computeSha256Checksum } from '../services/polarService';
import { GitMerge, Database, RefreshCw, Play, CheckCircle2 } from 'lucide-react';

interface SyncBridgeViewProps {
  isOnline: boolean;
  onTriggerSync: () => void;
}

export const SyncBridgeView: React.FC<SyncBridgeViewProps> = ({
  isOnline,
  onTriggerSync
}) => {
  const [activeTab, setActiveTab] = useState<'crdt' | 'inspector'>('crdt');

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

  return (
    <div className="space-y-4">
      
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('crdt')}
          className={`pb-2 px-3 border-b-2 transition-all ${
            activeTab === 'crdt'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          CRDT Concurrent Conflict &amp; Merge Terminal
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`pb-2 px-3 border-b-2 transition-all ${
            activeTab === 'inspector'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          IndexedDB Local Storage &amp; Packet Inspector
        </button>
      </div>

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

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCrdt}
                className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
              >
                Reset Simulation
              </button>

              <button
                onClick={handleRunCrdtMerge}
                disabled={isReconciling}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs disabled:opacity-50"
              >
                {isReconciling ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Reconciling Vectors...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Reopen Satellite Link &amp; Run CRDT Merge</span>
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
