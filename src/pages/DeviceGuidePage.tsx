import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { DEVICE_MATRIX } from '../data/deviceData';
import { DeviceBadge } from '../components/DeviceBadge';
import { DeviceAvailability } from '../types';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Sparkles,
  Info,
  HelpCircle
} from 'lucide-react';

export const DeviceGuidePage: React.FC = () => {
  const { language, activeDeviceFilter, setActiveDeviceFilter } = useGuide();
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: isBn ? 'সব ফিচার' : 'All Operations' },
    { id: 'Gigs', label: isBn ? 'গিগ ম্যানেজমেন্ট' : 'Gig Operations' },
    { id: 'Communication', label: isBn ? 'মেসেজিং ও অফার' : 'Inbox & Offers' },
    { id: 'Orders', label: isBn ? 'অর্ডার প্রসেসিং' : 'Order Execution' },
    { id: 'Finance', label: isBn ? 'আর্নিংস ও উইথড্র' : 'Finance & Payout' },
    { id: 'Account', label: isBn ? 'অ্যাকাউন্ট ও সিকিউরিটি' : 'Account & Security' },
    { id: 'Analytics', label: isBn ? 'অ্যানালিটিক্স ও প্রমোশন' : 'Analytics & Promotion' }
  ];

  const getDeviceStatus = (dev: any): { status: DeviceAvailability; note: string; noteBn?: string } => {
    if (!dev) return { status: 'desktop_required', note: 'Not supported' };
    if (typeof dev === 'string') {
      const lower = dev.toLowerCase();
      const s: DeviceAvailability = 
        lower.includes('full') || lower.includes('avail') || lower.includes('yes') ? 'available' :
        lower.includes('limit') ? 'limited' :
        lower.includes('require') || lower.includes('no') || lower.includes('not') ? 'desktop_required' :
        'desktop_recommended';
      return { status: s, note: dev };
    }
    return {
      status: (dev.status as DeviceAvailability) || 'available',
      note: dev.note || '',
      noteBn: dev.noteBn
    };
  };

  const filteredItems = DEVICE_MATRIX.filter(item => {
    if (selectedCategory !== 'all' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (activeDeviceFilter === 'mobile') {
      const mob = getDeviceStatus(item.mobileApp);
      return mob.status === 'available' || mob.status === 'limited';
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Laptop className="w-3.5 h-3.5" />
          <span>{isBn ? 'ডিভাইস ক্যাপাবিলিটি গাইড ও ম্যাট্রিক্স' : 'Device Capability Matrix'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'মোবাইল বনাম কম্পিউটার: কোন কাজ কোথায় করবেন?' : 'Mobile vs Desktop: Complete Work Guide'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isBn
            ? 'ফাইভার অ্যাপ ও ডেস্কটপ ওয়েবের মধ্যে ফিচারের স্পষ্ট পার্থক্য রয়েছে। মেসেজের দ্রুত উত্তর মোবাইল অ্যাপে দেওয়া গেলেও গিগ তৈরি, সোর্স ফাইল ডেলিভারি ও ট্যাক্স ফর্ম পূরণে কম্পিউটার আবশ্যক।'
            : 'Fiverr Mobile App excels at rapid inbox replies and status checks, while Desktop is required for Gig Creation, file delivery, and verification.'}
        </p>

        {/* Quick Device Filter Pills */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device Capability Matrix Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6 font-bold">{isBn ? 'ফিচার / কাজ' : 'Operation / Task'}</th>
                <th className="py-4 px-4 font-bold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mobile App</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Tablet className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mobile Web</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Desktop Browser</span>
                  </div>
                </th>
                <th className="py-4 px-6 font-bold text-right">{isBn ? 'সুপারিশ' : 'Best Device'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredItems.map(item => {
                const mobApp = getDeviceStatus(item.mobileApp);
                const mobWeb = getDeviceStatus(item.mobileWeb);
                const deskWeb = getDeviceStatus(item.desktopWeb);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    
                    {/* Task Name & Details */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {isBn ? item.featureNameBn : item.featureName}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 capitalize">
                        Category: {item.category}
                      </span>
                    </td>

                    {/* Mobile App */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <DeviceBadge status={mobApp.status} size="sm" showText={false} />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[120px] text-center line-clamp-2">
                          {isBn ? (mobApp.noteBn || mobApp.note) : mobApp.note}
                        </span>
                      </div>
                    </td>

                    {/* Mobile Web */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <DeviceBadge status={mobWeb.status} size="sm" showText={false} />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[120px] text-center line-clamp-2">
                          {isBn ? (mobWeb.noteBn || mobWeb.note) : mobWeb.note}
                        </span>
                      </div>
                    </td>

                    {/* Desktop Web */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <DeviceBadge status={deskWeb.status} size="sm" showText={false} />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[120px] text-center line-clamp-2">
                          {isBn ? (deskWeb.noteBn || deskWeb.note) : deskWeb.note}
                        </span>
                      </div>
                    </td>

                    {/* Recommendation */}
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase font-mono ${
                        item.recommendedDevice === 'desktop'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : item.recommendedDevice === 'mobile'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}>
                        {item.recommendedDevice}
                      </span>
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
