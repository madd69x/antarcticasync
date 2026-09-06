import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { computeSha256Checksum } from '../services/polarService';
import type { StationLogEntry, ConsumableItem } from '../types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: StationLogEntry[];
  consumables: ConsumableItem[];
  stationName: string;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  logs,
  consumables,
  stationName
}) => {
  const [hasExported, setHasExported] = useState(false);

  if (!isOpen) return null;

  const checksum = computeSha256Checksum(JSON.stringify(logs) + JSON.stringify(consumables));

  const handleDownloadCsv = () => {
    // Generate CSV for Logs
    const headers = ['ID', 'Timestamp', 'Author', 'Role', 'Category', 'Tag', 'Content', 'Priority', 'Synced'];
    const rows = logs.map(l => [
      l.id,
      l.timestamp,
      `"${l.authorName}"`,
      `"${l.authorRole}"`,
      l.category,
      l.tag,
      `"${l.content.replace(/"/g, '""')}"`,
      l.priority,
      l.isSynced ? 'YES' : 'NO'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${stationName.replace(/\s+/g, '_')}_SCAR_Telemetry_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setHasExported(true);
  };

  const handleDownloadJson = () => {
    // Export full SCAR Open Science Telemetry Bundle
    const bundle = {
      scientificCommittee: 'SCAR / MoES India National Antarctic Data Centre',
      station: stationName,
      exportTimestamp: new Date().toISOString(),
      integritySha256: checksum,
      consumablesAudit: consumables,
      stationLogs: logs
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${stationName.replace(/\s+/g, '_')}_SCAR_Dataset_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setHasExported(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Export SCAR Open Science Telemetry
              </h3>
              <p className="text-xs text-slate-500">
                Scientific Committee on Antarctic Research compliant open data package
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dataset Summary */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-600">
            <span>Station Origin:</span>
            <strong className="text-slate-900">{stationName}</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Logged Station Records:</span>
            <strong className="text-slate-900">{logs.length} Observation Records</strong>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Consumables &amp; Spares Tracked:</span>
            <strong className="text-slate-900">{consumables.length} Asset Items</strong>
          </div>
          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
            <span className="block text-slate-400 font-semibold mb-0.5">Cryptographic Integrity Hash:</span>
            <span className="font-mono text-emerald-700 font-semibold bg-white p-1 rounded border border-slate-200 block truncate">
              {checksum}
            </span>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadCsv}
            className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-left transition-colors space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Export CSV</span>
              <Download className="w-3.5 h-3.5 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500">
              Formatted for spreadsheet analytics, GIS mapping, and IMD records.
            </p>
          </button>

          <button
            onClick={handleDownloadJson}
            className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-left transition-colors space-y-1 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Export JSON</span>
              <Download className="w-3.5 h-3.5 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-500">
              Full machine-readable bundle with metadata and SHA-256 seal.
            </p>
          </button>
        </div>

        {hasExported && (
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dataset downloaded successfully to your local machine!</span>
          </div>
        )}

        <div className="text-right pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
