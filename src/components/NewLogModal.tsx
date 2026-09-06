import React, { useState } from 'react';
import type { StationLogEntry } from '../types';
import { X, Send, PenTool } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Record Station Shift Note</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Author Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Station Role</label>
              <input
                type="text"
                required
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StationLogEntry['category'])}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
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
              <label className="block text-slate-500 font-semibold mb-1">Tag / Equipment</label>
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Snow-Melter"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as StationLogEntry['priority'])}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="routine">Routine</option>
                <option value="important">Important</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Observation / Shift Notes</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe observation, maintenance action taken, or scientific measurement..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-500">
            Note: This entry is saved immediately into your browser&apos;s local IndexedDB. It will replicate to MoES HQ as soon as satellite connectivity permits.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Entry</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
