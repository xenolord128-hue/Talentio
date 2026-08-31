import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { SHORTCUTS_REGISTRY, ShortcutItem } from '../hooks/useGlobalKeyShortcuts';
import { 
  Keyboard, 
  X, 
  Search, 
  Sparkles, 
  Command, 
  Compass, 
  Layers, 
  Eye, 
  Zap, 
  Check 
} from 'lucide-react';

export const ShortcutsHelpModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useGuide();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isShortcutsModalOpen) return null;

  const categories = ['All', 'Modals & Search', 'Actions', 'Navigation', 'Accessibility'];

  const filteredShortcuts = SHORTCUTS_REGISTRY.filter((s: ShortcutItem) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesQuery = 
      s.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.actionName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.keys.some(k => k.toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Modals & Search':
        return <Search className="w-3.5 h-3.5 text-[#6E5BFF]" />;
      case 'Actions':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'Navigation':
        return <Compass className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Accessibility':
        return <Eye className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-[#A38BFF]" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div 
        className="w-full max-w-2xl bg-[#1A1633] high-contrast:bg-black border border-white/15 high-contrast:border-2 high-contrast:border-yellow-400 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-gradient-to-r from-[#201B42] to-[#1A1633]">
          <div className="flex items-center gap-3">
            <TalentioLogo size="sm" variant="black" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#3D2FD1]/40 border border-[#A38BFF]/30 text-[#A38BFF]">
                  Productivity Engine
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Press <kbd className="px-1 py-0.5 rounded bg-black/50 border border-white/20 text-white text-[10px]">Esc</kbd> to exit
                </span>
              </div>
              <h3 id="shortcuts-title" className="text-lg sm:text-xl font-black text-white font-display mt-0.5 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[#A38BFF]" />
                Keyboard Shortcuts Reference
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-black/20 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter shortcuts by key, action, or description..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#6E5BFF] transition-all"
              autoFocus
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#3D2FD1] text-white shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat !== 'All' && getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No shortcuts found matching "{filterQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredShortcuts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all"
                >
                  <div className="flex flex-col pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {getCategoryIcon(item.category)}
                      <span className="text-xs font-bold text-white leading-tight">
                        {item.actionName}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-snug">
                      {item.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-1 rounded-lg bg-black/60 border border-white/20 text-white font-mono text-[11px] font-bold shadow-inner min-w-[24px] text-center"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Notes */}
        <div className="p-4 border-t border-white/10 bg-black/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#A38BFF]" />
            <span>Power navigation active on all marketplace pages</span>
          </div>

          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
