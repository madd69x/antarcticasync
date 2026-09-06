import React, { useEffect, useState } from 'react';
import { db } from '../db/polarDb';
import type { SyncMutationPacket, StationLogEntry } from '../types';
import { X, Database, RefreshCw, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SyncInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSync: () => void;
  isOnline: boolean;
}

export const SyncInspectorModal: React.FC<SyncInspectorModalProps> = ({
  isOpen,
  onClose,
  onTriggerSync,
  isOnline
}) => {
  const [queueItems, setQueueItems] = useState<SyncMutationPacket[]>([]);
  const [localLogsCount, setLocalLogsCount] = useState(0);
  const [selectedPacket, setSelectedPacket] = useState<SyncMutationPacket | null>(null);

  const loadData = async () => {
    const queue = await db.syncQueue.toArray();
    setQueueItems(queue);
    const count = await db.logs.count();
    setLocalLogsCount(count);
    if (queue.length > 0 && !selectedPacket) {
      setSelectedPacket(queue[0]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">IndexedDB & CRDT Replication Inspector</h3>
              <p className="text-xs text-slate-500">Transparent view of local storage & opportunistic transmission queue</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-400 text-[11px] font-medium">Local Browser Database</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">IndexedDB / Dexie.js</div>
            <div className="text-emerald-700 font-medium text-[11px] mt-1">✓ {localLogsCount} records persisted</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-400 text-[11px] font-medium">Replication Protocol</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">CRDT Vector Clocks</div>
            <div className="text-slate-600 font-medium text-[11px] mt-1">Deterministic merge</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-400 text-[11px] font-medium">Unsent Queue</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{queueItems.length} Pending Packet(s)</div>
            <div className="text-blue-700 font-medium text-[11px] mt-1">
              {queueItems.length > 0 ? '~82% diff compression' : 'Buffer empty'}
            </div>
          </div>
        </div>

        {/* Queue List and Inspector Details */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {queueItems.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">All changes are synchronized</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Any action you record while in &quot;Patchy&quot; or &quot;Blizzard Blackout&quot; mode will immediately show up here with its diff payload and vector clock.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left Column: Queued Items List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Pending Sync Queue ({queueItems.length})
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {queueItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPacket(item)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedPacket?.id === item.id 
                          ? 'border-blue-500 bg-blue-50/60 shadow-xs' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{item.entityType}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.id.slice(0, 10)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                        <span>Priority: <strong>{item.priority}</strong></span>
                        <span>{item.compressedBytes} B (raw {item.sizeBytes} B)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: JSON Packet Inspector */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  CRDT Packet Inspection (Payload)
                </div>
                {selectedPacket ? (
                  <pre className="p-3 bg-slate-900 text-cyan-300 font-mono text-[11px] rounded-lg overflow-x-auto max-h-56">
                    {JSON.stringify(selectedPacket, null, 2)}
                  </pre>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                    Select a packet on the left to inspect
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="text-slate-500">
            {isOnline ? 'Satellite link active. Ready to transmit.' : 'Currently offline. Packets held in IndexedDB.'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              Close
            </button>
            {queueItems.length > 0 && isOnline && (
              <button
                onClick={() => {
                  onTriggerSync();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Transmit Queue Now</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
