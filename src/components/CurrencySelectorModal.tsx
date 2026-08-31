import React, { useState, useEffect, useRef } from 'react';
import { useGuide } from '../context/GuideContext';
import { CURRENCIES_DATA, CurrencyItem } from '../data/currenciesData';
import { X, Search, Check, Globe, Sparkles } from 'lucide-react';

interface CurrencySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencySelectorModal: React.FC<CurrencySelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currency, setCurrency, showToast } = useGuide();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'popular' | 'asia' | 'europe' | 'americas' | 'mideast'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-focus search input and handle ESC key & click outside
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const popularCodes = ['USD', 'BDT', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'AED', 'SGD', 'JPY', 'SAR', 'CHF'];

  const filteredCurrencies = CURRENCIES_DATA.filter(c => {
    const q = search.trim().toLowerCase();
    const matchesSearch = 
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (selectedRegion === 'popular') {
      return popularCodes.includes(c.code);
    }
    if (selectedRegion === 'asia') {
      return ['BDT', 'INR', 'PKR', 'SGD', 'JPY', 'CNY', 'MYR', 'THB', 'IDR', 'PHP', 'VND', 'KRW', 'LKR'].includes(c.code);
    }
    if (selectedRegion === 'europe') {
      return ['EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'TRY', 'RUB'].includes(c.code);
    }
    if (selectedRegion === 'americas') {
      return ['USD', 'CAD', 'BRL', 'MXN', 'ARS', 'CLP', 'COP'].includes(c.code);
    }
    if (selectedRegion === 'mideast') {
      return ['AED', 'SAR', 'QAR', 'KWD', 'OMR', 'BHD', 'EGP', 'ILS', 'ZAR', 'NGN'].includes(c.code);
    }
    return true;
  });

  const handleSelect = (item: CurrencyItem) => {
    setCurrency(item.code);
    showToast(`Currency changed to ${item.code} (${item.symbol}) - Prices converted globally`, 'success');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-start justify-center sm:justify-end sm:pr-24 pt-16 sm:pt-20 px-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Dropdown Container — Styled and aligned identically to Profile Dropdown */}
      <div 
        ref={dropdownRef}
        className="w-full max-w-[340px] sm:max-w-md bg-[#171330] text-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-[#120F24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3D2FD1] flex items-center justify-center text-white shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Select Currency</h3>
              <p className="text-[11px] text-slate-400">150+ Global Currencies Supported</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close currency dropdown"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-3 bg-[#0E0B1F] border-b border-white/10 shrink-0 space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A38BFF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search USD, BDT, EUR, GBP, INR..."
              className="w-full pl-8.5 pr-8 py-2 rounded-xl bg-black/50 text-white text-xs placeholder:text-slate-500 border border-white/15 focus:outline-none focus:border-[#A38BFF] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[11px] font-bold">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedRegion === 'all'
                  ? 'bg-[#3D2FD1] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRegion('popular')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedRegion === 'popular'
                  ? 'bg-[#3D2FD1] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Popular</span>
            </button>
            <button
              onClick={() => setSelectedRegion('asia')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedRegion === 'asia'
                  ? 'bg-[#3D2FD1] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Asia
            </button>
            <button
              onClick={() => setSelectedRegion('europe')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedRegion === 'europe'
                  ? 'bg-[#3D2FD1] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Europe
            </button>
            <button
              onClick={() => setSelectedRegion('americas')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedRegion === 'americas'
                  ? 'bg-[#3D2FD1] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Americas
            </button>
            <button
              onClick={() => setSelectedRegion('mideast')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedRegion === 'mideast'
                  ? 'bg-[#3D2FD1] text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Middle East
            </button>
          </div>
        </div>

        {/* Currency List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-2.5 space-y-1">
          {filteredCurrencies.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1">
              <Search className="w-6 h-6 text-slate-500 mx-auto" />
              <p className="font-bold text-xs">No currencies found</p>
              <p className="text-[11px] text-slate-500">Try searching "USD" or "BDT"</p>
            </div>
          ) : (
            filteredCurrencies.map((item) => {
              const isSelected = item.code === currency;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D2FD1]/40 border-[#A38BFF] text-white ring-1 ring-[#A38BFF]/50'
                      : 'bg-white/5 hover:bg-white/10 border-transparent text-slate-200 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{item.flag}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-extrabold text-xs text-white">{item.code}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white/10 text-[#A38BFF]">
                          {item.symbol}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{item.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-[#3D2FD1] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.exchangeRateToUSD !== 1 ? `≈ ${item.exchangeRateToUSD.toFixed(1)}` : 'Base'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-3.5 py-2 bg-[#0E0B1F] border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <span>Active: <strong className="text-white font-mono">{currency}</strong></span>
          <span>Live marketplace conversion</span>
        </div>
      </div>
    </div>
  );
};
