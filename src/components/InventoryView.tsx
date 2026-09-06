import React, { useState } from 'react';
import type { ConsumableItem } from '../types';
import { Search, Filter, AlertCircle, CheckCircle, Clock, PackagePlus } from 'lucide-react';

interface InventoryViewProps {
  consumables: ConsumableItem[];
  onUpdateStock: (id: string, newStock: number) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  consumables,
  onUpdateStock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

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

  return (
    <div className="space-y-5">
      
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Winter-Over Critical Consumables & Spares</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks survival reserves throughout the 8-month isolation window until the summer expedition vessel arrives.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Bulk Arctic Fuel: ~62 Days Burn
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by supply item or storage location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
            {['All', 'Fuel', 'Spares', 'Medical', 'Life Support', 'Rations'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
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

        {/* Items Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Current Stock</th>
                <th className="py-2.5 px-3">Daily Burn Rate</th>
                <th className="py-2.5 px-3">Remaining Buffer</th>
                <th className="py-2.5 px-3">Storage Location</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isWatch = item.status === 'Watchlist';
                const isCrit = item.status === 'Critical';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400">Inspected {item.lastInspected}</div>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {item.currentStock.toLocaleString()}
                      </span>
                      <span className="text-slate-500 ml-1">{item.unit}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-mono">
                      ~{item.burnRatePerDay} {item.unit}/day
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold font-mono ${
                          isCrit ? 'text-rose-600' : isWatch ? 'text-amber-600' : 'text-slate-800'
                        }`}>
                          {item.daysRemaining} days
                        </span>
                        {isWatch && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                            Watchlist
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {item.storageLocation}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handlePromptStockUpdate(item)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-[11px] transition-colors"
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

    </div>
  );
};
