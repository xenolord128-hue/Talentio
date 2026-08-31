import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES_DATA, CountryItem } from '../data/countriesData';
import { Search, ChevronDown, Check, Globe } from 'lucide-react';

interface CountrySelectorProps {
  value: string; // Country code or Country name
  onChange: (country: CountryItem) => void;
  showCallingCode?: boolean;
  className?: string;
  variant?: 'input' | 'compact' | 'phone-prefix';
  disabled?: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  showCallingCode = false,
  className = '',
  variant = 'input',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected country
  const selectedCountry = COUNTRIES_DATA.find(
    c => c.code.toUpperCase() === value?.toUpperCase() || 
         c.name.toLowerCase() === value?.toLowerCase() ||
         c.callingCode === value
  ) || COUNTRIES_DATA[0];

  // Filter countries by search query (name, code, calling code)
  const filteredCountries = COUNTRIES_DATA.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.callingCode.includes(search) ||
    c.currencyCode.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (country: CountryItem) => {
    onChange(country);
    setIsOpen(false);
    setSearch('');
  };

  if (variant === 'phone-prefix') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-3.5 min-h-[48px] rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
          title={`Selected: ${selectedCountry.name} (${selectedCountry.callingCode})`}
        >
          <span className="text-base sm:text-lg">{selectedCountry.flag}</span>
          <span className="font-mono text-slate-200">{selectedCountry.callingCode}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 max-h-72 rounded-2xl ios-glass-dark border border-[#A38BFF]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 overflow-hidden flex flex-col animate-in fade-in duration-150">
            <div className="p-2 border-b border-white/10 bg-white/5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country / calling code..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 text-white text-xs placeholder:text-slate-500 border border-white/10 focus:outline-none focus:border-[#6E5BFF]"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-1 max-h-56">
              {filteredCountries.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">No country found</div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                      country.code === selectedCountry.code
                        ? 'bg-[#3D2FD1] text-white font-bold'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-300 shrink-0 ml-2">
                      {country.callingCode}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 min-h-[48px] rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="font-medium text-white truncate">{selectedCountry.name}</span>
          {showCallingCode && (
            <span className="text-slate-400 text-xs font-mono">({selectedCountry.callingCode})</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#A38BFF]">
            {selectedCountry.currencyCode}
          </span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl ios-glass-dark border border-[#A38BFF]/40 shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-50 overflow-hidden flex flex-col animate-in fade-in duration-150">
          <div className="p-3 border-b border-white/10 bg-white/5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country (e.g. Bangladesh, Japan, USA)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 text-white text-xs sm:text-sm placeholder:text-slate-500 border border-white/10 focus:outline-none focus:border-[#6E5BFF]"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-60 p-1.5 space-y-0.5">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching country found.
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3D2FD1] text-white font-bold shadow-sm'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono opacity-75">{country.callingCode}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-[#A38BFF] font-mono uppercase">
                        {country.currencyCode}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
