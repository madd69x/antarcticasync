import React, { useState } from 'react';
import type { ConsumableItem, StationLogEntry } from '../types';
import { Search, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { computeSha256Checksum } from '../services/polarService';

interface InventoryViewProps {
  consumables: ConsumableItem[];
  logs: StationLogEntry[];
  stationName: string;
  onUpdateStock: (id: string, newStock: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  consumables,
  logs,
  stationName,
  onUpdateStock
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'madrid' | 'scar'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isPolarSummer, setIsPolarSummer] = useState(false);
  const [hasExported, setHasExported] = useState(false);

  const filteredItems = consumables.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePromptStockUpdate = (item: ConsumableItem) => {
    const entered = prompt(`Enter new measured quantity for "${item.name}" (in ${item.unit}):`, item.currentStock.toString());
    if (entered !== null && !isNaN(Number(entered))) {
      onUpdateStock(item.id, Number(entered));
    }
  };

  // SCAR Export Handlers
  const checksum = computeSha256Checksum(JSON.stringify(logs) + JSON.stringify(consumables));

  const handleDownloadCsv = () => {
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
    link.setAttribute('download', `${stationName.replace(/\s+/g, '_')}_SCAR_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setHasExported(true);
  };

  const handleDownloadJson = () => {
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
    <div className="space-y-4">
      
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`pb-2 px-3 border-b-2 transition-all ${
            activeSubTab === 'inventory'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Consumables &amp; Spares Ledger
        </button>

        <button
          onClick={() => setActiveSubTab('madrid')}
          className={`pb-2 px-3 border-b-2 transition-all ${
            activeSubTab === 'madrid'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Madrid Protocol Waste &amp; Clean Energy
        </button>

        <button
          onClick={() => setActiveSubTab('scar')}
          className={`pb-2 px-3 border-b-2 transition-all ${
            activeSubTab === 'scar'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          SCAR Scientific Telemetry Export
        </button>
      </div>

      {/* SUB-TAB 1: INVENTORY TABLE */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Winter-Over Critical Consumables &amp; Spares
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tracks survival buffer duration throughout the 8-month winter isolation window.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Bulk Arctic Fuel: ~62 Days Burn
            </span>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by item description or storage locker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-slate-800 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs py-0.5">
              {['All', 'Fuel', 'Spares', 'Medical', 'Life Support', 'Rations'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2 px-2.5">Item Description</th>
                  <th className="py-2 px-2.5">Category</th>
                  <th className="py-2 px-2.5">Current Stock</th>
                  <th className="py-2 px-2.5">Daily Burn</th>
                  <th className="py-2 px-2.5">Remaining Buffer</th>
                  <th className="py-2 px-2.5">Storage Location</th>
                  <th className="py-2 px-2.5 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const isWatch = item.status === 'Watchlist';
                  const isCrit = item.status === 'Critical';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-2.5">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Inspected: {item.lastInspected}</div>
                      </td>

                      <td className="py-2.5 px-2.5 text-slate-600">
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded font-mono text-[10px] border border-slate-200">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-2.5 px-2.5">
                        <span className="font-bold text-slate-900 font-mono">
                          {item.currentStock.toLocaleString()}
                        </span>
                        <span className="text-slate-500 ml-1 font-mono text-[11px]">{item.unit}</span>
                      </td>

                      <td className="py-2.5 px-2.5 text-slate-600 font-mono text-[11px]">
                        ~{item.burnRatePerDay} {item.unit}/day
                      </td>

                      <td className="py-2.5 px-2.5">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`font-semibold ${
                            isCrit ? 'text-rose-700' : isWatch ? 'text-amber-700' : 'text-slate-800'
                          }`}>
                            {item.daysRemaining} days
                          </span>
                          {isWatch && (
                            <span className="text-[9px] bg-amber-50 text-amber-900 px-1 rounded border border-amber-200 font-bold">
                              WATCH
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-2.5 text-slate-500 text-[11px]">
                        {item.storageLocation}
                      </td>

                      <td className="py-2.5 px-2.5 text-right">
                        <button
                          onClick={() => handlePromptStockUpdate(item)}
                          className="px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-[11px] transition-colors"
                        >
                          Update Count
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MADRID PROTOCOL WASTE & CLEAN ENERGY */}
      {activeSubTab === 'madrid' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Madrid Protocol Environmental Compliance &amp; Retrograde Waste Ledger
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Compliance with Annex III to the Protocol on Environmental Protection to the Antarctic Treaty.
              </p>
            </div>
            <button
              onClick={() => setIsPolarSummer(!isPolarSummer)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold transition-colors"
            >
              {isPolarSummer ? 'Switch to Polar Winter (24hr Night)' : 'Simulate Polar Summer (24hr Sun)'}
            </button>
          </div>

          {/* Renewable Generation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wind Turbines (WT-1 &amp; 2)</span>
              <div className="text-xl font-bold font-mono text-slate-900">11.8 kW</div>
              <span className="text-[10px] text-slate-500 font-mono">Vertical axis · Blizzard rated</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bifacial Solar PV</span>
              <div className="text-xl font-bold font-mono text-slate-900">{isPolarSummer ? '36.5 kW' : '0.0 kW'}</div>
              <span className="text-[10px] text-slate-500 font-mono">
                {isPolarSummer ? '24hr Midnight Sun yield' : 'Polar Night (0 kW solar)'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diesel Saved (YTD)</span>
              <div className="text-xl font-bold font-mono text-slate-900">18,450 Litres</div>
              <span className="text-[10px] text-emerald-700 font-mono">48.8 Metric Tons CO₂ avoided</span>
            </div>
          </div>

          {/* Retrograde Waste Ledger */}
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Annex III Retrograde Waste Inventory (Staged for Vessel Return)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold">Hazardous Chemical Waste</span>
                <strong className="text-slate-900 text-sm">14 Drums</strong>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold">Electronic Scrap Crates</span>
                <strong className="text-slate-900 text-sm">8 Crates</strong>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold">High-Temp Incinerator Ash</span>
                <strong className="text-slate-900 text-sm">22 Drums</strong>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-sans font-semibold">Bio-Safety Treated Pack</span>
                <strong className="text-slate-900 text-sm">18 Units</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              All 62 sealed containers staged at Larsemann Hills coastal container yard for mandatory loading aboard <em>MV Vasiliy Golovnin</em>. Zero environmental discharge to the Antarctic continent.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SCAR EXPORT */}
      {activeSubTab === 'scar' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              SCAR &amp; IMD Scientific Telemetry Data Exporter
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Standardized Scientific Committee on Antarctic Research open data package with digital cryptographic seal.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Station Origin:</span>
              <strong className="text-slate-800">{stationName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Observation Records:</span>
              <strong className="text-slate-800">{logs.length} Records</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tracked Assets:</span>
              <strong className="text-slate-800">{consumables.length} Items</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">SHA-256 Hash Seal:</span>
              <span className="text-slate-700 font-bold truncate max-w-xs">{checksum}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDownloadCsv}
              className="p-3 rounded border border-slate-200 hover:bg-slate-50 text-left transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs uppercase">Download CSV File</span>
                <Download className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <p className="text-[11px] text-slate-500">
                Tabular format for spreadsheet analytics, GIS mapping, and meteorological archives.
              </p>
            </button>

            <button
              onClick={handleDownloadJson}
              className="p-3 rounded border border-slate-200 hover:bg-slate-50 text-left transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs uppercase">Download JSON Bundle</span>
                <Download className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <p className="text-[11px] text-slate-500">
                Full machine-readable archive with metadata and cryptographic signature.
              </p>
            </button>
          </div>

          {hasExported && (
            <div className="p-2 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-mono">
              [Export file generated and downloaded to local machine]
            </div>
          )}
        </div>
      )}

    </div>
  );
};
