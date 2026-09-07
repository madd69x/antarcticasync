import React, { useState } from 'react';
import type { StationLogEntry } from '../types';
import { X, Send } from 'lucide-react';

interface NewLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    authorName: string,
    authorRole: string,
    category: StationLogEntry['category'],
    content: string,
    tag: string,
    priority: StationLogEntry['priority']
  ) => void;
}

export const NewLogModal: React.FC<NewLogModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [authorName, setAuthorName] = useState('Priya Nair');
  const [authorRole, setAuthorRole] = useState('Station Mechanical Engineer');
  const [category, setCategory] = useState<StationLogEntry['category']>('Generator');
  const [tag, setTag] = useState('Genset-DG1');
  const [priority, setPriority] = useState<StationLogEntry['priority']>('routine');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(authorName, authorRole, category, content.trim(), tag.trim(), priority);
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full p-4 sm:p-5 shadow-xl space-y-3.5 my-auto max-h-[94vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Record Station Logbook Entry
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Writes directly to local IndexedDB store</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Author Full Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Station Role</label>
              <input
                type="text"
                required
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StationLogEntry['category'])}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-800 font-medium"
              >
                <option value="Generator">Generator</option>
                <option value="Weather">Weather</option>
                <option value="Science">Science</option>
                <option value="Logistics">Logistics</option>
                <option value="Medical">Medical</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Tag / Equipment</label>
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Genset-DG1"
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as StationLogEntry['priority'])}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-800 font-medium"
              >
                <option value="routine">Routine</option>
                <option value="important">Important</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Observation / Handover Record</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record detailed observations, mechanical servicing completed, or scientific specimen notes..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-800 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Commit Entry</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
