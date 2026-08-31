import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { CURRENCIES_DATA } from '../data/currenciesData';
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  Lock, 
  CreditCard, 
  Check, 
  ShieldCheck,
  Smartphone,
  Sparkles
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    currency, 
    setCurrency, 
    language, 
    setLanguage, 
    showToast,
    user 
  } = useGuide();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [escrowAlerts, setEscrowAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F2F0FF] text-[#3D2FD1] border border-[#A38BFF]/30 mb-2">
          <Settings className="w-3.5 h-3.5 text-[#3D2FD1]" />
          <span>Preferences & Security</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#1A1633] font-display">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Manage your regional preferences, currency format, security keys, and alerts
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Regional & Currency Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#1A1633] font-display">Regional & Currency Preferences</h2>
              <p className="text-xs text-slate-500">Configure how marketplace rates and milestones are calculated</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Display Currency
              </label>
              <select
                value={currency}
                onChange={e => {
                  setCurrency(e.target.value);
                  showToast(`Marketplace currency updated to ${e.target.value}`, 'success');
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#3D2FD1]"
              >
                {CURRENCIES_DATA.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Language / Interface
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#3D2FD1]"
              >
                <option value="en">English (US - Global)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#1A1633] font-display">Security & Escrow Authorization</h2>
              <p className="text-xs text-slate-500">Protect milestone releases and account funds</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-xs sm:text-sm text-slate-800">Two-Factor Authentication (2FA)</span>
                <p className="text-xs text-slate-500">Require SMS or Authenticator code for milestone releases over $500</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={e => {
                  setTwoFactorAuth(e.target.checked);
                  showToast(e.target.checked ? '2FA Protection enabled' : '2FA Protection disabled', 'info');
                }}
                className="w-5 h-5 text-[#3D2FD1] rounded-sm focus:ring-[#3D2FD1]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-xs sm:text-sm text-slate-800">Instant Escrow Release Alerts</span>
                <p className="text-xs text-slate-500">Receive real-time push and email alerts on milestone funds transfer</p>
              </div>
              <input
                type="checkbox"
                checked={escrowAlerts}
                onChange={e => setEscrowAlerts(e.target.checked)}
                className="w-5 h-5 text-[#3D2FD1] rounded-sm focus:ring-[#3D2FD1]"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
