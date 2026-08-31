import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Sun, Moon, Contrast, Check, ChevronDown } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'compact' | 'expanded' | 'dropdown' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { theme, setTheme, cycleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    {
      mode: 'light',
      label: 'Light Mode',
      icon: Sun,
      description: 'Clean high-contrast daytime interface'
    },
    {
      mode: 'dark',
      label: 'Dark Mode',
      icon: Moon,
      description: 'Deep midnight palette for low-light environments'
    },
    {
      mode: 'high-contrast',
      label: 'High Contrast',
      icon: Contrast,
      description: 'Maximum contrast (WCAG AAA) for enhanced accessibility'
    }
  ];

  const currentOption = options.find((opt) => opt.mode === theme) || options[0];
  const CurrentIcon = currentOption.icon;

  if (variant === 'segmented') {
    return (
      <div 
        role="radiogroup" 
        aria-label="Theme selection"
        className={`inline-flex items-center p-1 rounded-2xl bg-white/10 dark:bg-black/40 high-contrast:bg-black border border-white/15 dark:border-white/10 high-contrast:border-yellow-400 backdrop-blur-md ${className}`}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.mode;
          return (
            <button
              key={opt.mode}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.mode)}
              title={opt.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#3D2FD1] text-white shadow-md high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 high-contrast:text-white high-contrast:hover:bg-white/20'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'high-contrast:text-black' : ''}`} />
              <span className="capitalize hidden sm:inline">{opt.mode.replace('-', ' ')}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={`space-y-1.5 ${className}`}>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
          Interface Theme
        </span>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#3D2FD1] text-white shadow-md high-contrast:bg-yellow-400 high-contrast:text-black font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-white high-contrast:text-black' : 'text-[#A38BFF]'}`} />
                <span className="text-[11px] font-bold leading-tight">{opt.mode === 'high-contrast' ? 'Contrast' : opt.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Dropdown / Compact Mode with accessible menu
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 min-h-[40px] sm:min-h-[42px] rounded-xl bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 backdrop-blur-md text-slate-200 hover:text-white border border-white/15 transition-all cursor-pointer"
        aria-label={`Theme: ${currentOption.label}. Click to choose theme.`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Current: ${currentOption.label} (Click to switch)`}
      >
        <CurrentIcon className="w-4 h-4 text-[#A38BFF] high-contrast:text-yellow-400" />
        <span className="text-xs font-bold hidden xl:inline capitalize">
          {theme.replace('-', ' ')}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 rounded-2xl ios-glass-dark dark:bg-[#120F24] high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 p-1.5 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150 border border-white/10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 high-contrast:text-yellow-400 uppercase tracking-wider border-b border-white/10 mb-1">
            Display Appearance
          </div>

          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                role="menuitem"
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#3D2FD1] text-white high-contrast:bg-yellow-400 high-contrast:text-black font-black'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white high-contrast:text-white high-contrast:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white high-contrast:text-black' : 'text-[#A38BFF]'}`} />
                  <div>
                    <div>{opt.label}</div>
                    <div className={`text-[10px] font-normal ${isSelected ? 'text-white/80 high-contrast:text-black/80' : 'text-slate-400'}`}>
                      {opt.description.split(' for')[0]}
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
