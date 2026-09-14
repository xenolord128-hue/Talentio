import React, { useState } from 'react';
import { 
  Advertisement, 
  AdPlacementLocation, 
  AdDeviceTarget, 
  AdFormat, 
  AdSpacing 
} from '../../types';
import { useAds } from '../../context/AdContext';
import { PUBLIC_PAGES_OPTIONS } from '../../data/defaultAds';
import { AdRenderer } from '../ads/AdRenderer';
import { 
  Plus, 
  Sparkles, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Power, 
  RotateCcw, 
  Search, 
  Filter, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Layers, 
  Code2, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Maximize2
} from 'lucide-react';

export const AdManagementView: React.FC = () => {
  const { 
    ads, 
    globalAdsEnabled, 
    setGlobalAdsEnabled, 
    toggleAd, 
    saveAd, 
    deleteAd, 
    duplicateAd, 
    resetToDefaultAds 
  } = useAds();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [previewModalAd, setPreviewModalAd] = useState<Advertisement | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formTab, setFormTab] = useState<'config' | 'preview'>('config');
  const [formData, setFormData] = useState<Partial<Advertisement>>({
    name: '',
    network: 'Adsterra',
    format: 'banner_728x90',
    width: 728,
    height: 90,
    placement: 'below_hero',
    devices: 'desktop',
    enabled: true,
    priority: 1,
    spacing: 'standard',
    targetPages: ['home', 'services', 'freelancers'],
    allowOnPrivatePages: false,
    code: ''
  });

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingAd(null);
    setFormData({
      id: `ad-${Date.now()}`,
      name: 'New Adsterra Banner',
      network: 'Adsterra',
      format: 'banner_728x90',
      width: 728,
      height: 90,
      placement: 'below_hero',
      devices: 'desktop',
      enabled: true,
      priority: ads.length + 1,
      spacing: 'standard',
      targetPages: ['home', 'services', 'freelancers', 'search'],
      allowOnPrivatePages: false,
      code: `<script>\n  atOptions = {\n    'key' : 'sample_key_here',\n    'format' : 'iframe',\n    'height' : 90,\n    'width' : 728,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/sample_key_here/invoke.js"></script>`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setFormTab('config');
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({ ...ad });
    setFormTab('config');
    setIsEditModalOpen(true);
  };

  // Format selection auto-configures standard dimensions
  const handleFormatChange = (format: AdFormat) => {
    let width = formData.width || 728;
    let height = formData.height || 90;
    let defaultPlacement: AdPlacementLocation = formData.placement || 'below_hero';
    let defaultDevices: AdDeviceTarget = formData.devices || 'all';

    switch (format) {
      case 'banner_468x60':
        width = 468;
        height = 60;
        defaultPlacement = 'top_banner';
        defaultDevices = 'all';
        break;
      case 'banner_728x90':
        width = 728;
        height = 90;
        defaultPlacement = 'below_hero';
        defaultDevices = 'desktop';
        break;
      case 'sidebar_160x300':
        width = 160;
        height = 300;
        defaultPlacement = 'sidebar';
        defaultDevices = 'desktop';
        break;
      case 'mobile_320x50':
        width = 320;
        height = 50;
        defaultPlacement = 'mobile_banner';
        defaultDevices = 'mobile';
        break;
      case 'container':
        width = 300;
        height = 250;
        defaultPlacement = 'between_content';
        defaultDevices = 'all';
        break;
      case 'script':
        width = 1;
        height = 1;
        defaultPlacement = 'custom';
        defaultDevices = 'all';
        break;
      case 'custom':
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      format,
      width,
      height,
      placement: defaultPlacement,
      devices: defaultDevices
    }));
  };

  // Save form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Please provide an ad name and advertising code.');
      return;
    }

    // Prohibit intrusive popup / direct link scripts that ruin user experience
    if (
      formData.code?.includes('1822920cd10687d189b60424e04ba451') ||
      formData.code?.includes('profitableratecpmnetwork.com/18/22/92') ||
      formData.format === 'script'
    ) {
      alert('Intrusive popup/push notification scripts are prohibited to protect user experience. Please use standard iframe or container banners.');
      return;
    }

    const finalAd: Advertisement = {
      id: editingAd ? editingAd.id : (formData.id || `ad-${Date.now()}`),
      name: formData.name || 'Untitled Ad',
      network: formData.network || 'Adsterra',
      format: (formData.format as AdFormat) || 'banner_728x90',
      width: Number(formData.width) || 728,
      height: Number(formData.height) || 90,
      placement: (formData.placement as AdPlacementLocation) || 'below_hero',
      devices: (formData.devices as AdDeviceTarget) || 'all',
      enabled: formData.enabled !== undefined ? formData.enabled : true,
      priority: Number(formData.priority) || 1,
      spacing: (formData.spacing as AdSpacing) || 'standard',
      targetPages: formData.targetPages || ['home', 'services', 'freelancers'],
      allowOnPrivatePages: Boolean(formData.allowOnPrivatePages),
      code: formData.code || '',
      createdAt: editingAd?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveAd(finalAd);
    setIsEditModalOpen(false);
    setSaveSuccessMsg(`Advertisement "${finalAd.name}" saved successfully.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Toggle page in targetPages array
  const handleToggleTargetPage = (pageId: string) => {
    const current = formData.targetPages || [];
    if (current.includes(pageId)) {
      setFormData({
        ...formData,
        targetPages: current.filter(p => p !== pageId)
      });
    } else {
      setFormData({
        ...formData,
        targetPages: [...current, pageId]
      });
    }
  };

  // Filtered ads list
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.format.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlacement = placementFilter === 'all' || ad.placement === placementFilter;
    const matchesDevice = deviceFilter === 'all' || ad.devices === deviceFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && ad.enabled) || 
      (statusFilter === 'disabled' && !ad.enabled);

    return matchesSearch && matchesPlacement && matchesDevice && matchesStatus;
  }).sort((a, b) => a.priority - b.priority);

  // Quick stats
  const totalCount = ads.length;
  const activeCount = ads.filter(a => a.enabled).length;
  const desktopCount = ads.filter(a => a.devices === 'desktop' || a.devices === 'all').length;
  const mobileCount = ads.filter(a => a.devices === 'mobile' || a.devices === 'all').length;

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER & MASTER GLOBAL TOGGLE */}
      <div className="bg-white dark:bg-[#15112B] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F2F0FF] dark:bg-[#201A45] text-[#3D2FD1] dark:text-[#9B8CFF]">
              <Layers className="w-3.5 h-3.5" />
              <span>Adsterra Monetization Engine</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              Ad Management &amp; Monetization
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Configure, paste, preview and toggle Adsterra advertising tags dynamically. Placements are restricted strictly to public marketplace pages by default to protect sensitive user workflows.
            </p>
          </div>

          {/* Master Global Switch */}
          <div className="flex flex-col items-end gap-2 bg-slate-50 dark:bg-[#1B1635] p-4 rounded-xl border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Global Ads
              </span>
              <button
                type="button"
                id="global-ads-toggle-btn"
                onClick={() => setGlobalAdsEnabled(!globalAdsEnabled)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#3D2FD1] ${
                  globalAdsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={globalAdsEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    globalAdsEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <span className={`w-2 h-2 rounded-full ${globalAdsEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className={globalAdsEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                {globalAdsEnabled ? 'Monetization Active' : 'Ads Globally Suspended'}
              </span>
            </div>
          </div>
        </div>

        {/* Success toast */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#15112B] p-4 rounded-xl border border-slate-200 dark:border-white/10">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Placements</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-[#15112B] p-4 rounded-xl border border-slate-200 dark:border-white/10">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active Advertisements</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-display">{activeCount}</p>
        </div>
        <div className="bg-white dark:bg-[#15112B] p-4 rounded-xl border border-slate-200 dark:border-white/10">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Desktop Coverage</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display">{desktopCount}</p>
        </div>
        <div className="bg-white dark:bg-[#15112B] p-4 rounded-xl border border-slate-200 dark:border-white/10">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Mobile Coverage</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-display">{mobileCount}</p>
        </div>
      </div>

      {/* 3. CONTROLS BAR: SEARCH, FILTERS, ADD AD BUTTON */}
      <div className="bg-white dark:bg-[#15112B] rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ad label, network..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#3D2FD1]"
            />
          </div>

          {/* Placement Filter */}
          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Placements</option>
            <option value="top_banner">Top Banner</option>
            <option value="below_hero">Below Hero</option>
            <option value="between_content">Between Content</option>
            <option value="feed_marketplace">Feed/Marketplace</option>
            <option value="sidebar">Sidebar</option>
            <option value="before_footer">Before Footer</option>
            <option value="footer">Footer</option>
            <option value="mobile_banner">Mobile Banner</option>
            <option value="custom">Custom / Script</option>
          </select>

          {/* Device Filter */}
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Devices</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-1.5 transition-colors"
            title="Reset to the default 6 Adsterra placements"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Restore Adsterra Codes</span>
          </button>

          <button
            type="button"
            id="add-advertisement-btn"
            onClick={handleOpenAddModal}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#3224B8] text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Advertisement</span>
          </button>
        </div>
      </div>

      {/* 4. ADS TABLE (ACCORDING TO USER SPECIFICATION) */}
      <div className="bg-white dark:bg-[#15112B] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/75 dark:bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Ad Placement &amp; Network</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Placement</th>
                <th className="py-3.5 px-4">Devices</th>
                <th className="py-3.5 px-4 text-center">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs text-slate-700 dark:text-slate-300">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No advertisements found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust filters or click "+ Add Advertisement" to configure an ad placement.</p>
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => {
                  return (
                    <tr 
                      key={ad.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Name & Network */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{ad.name}</span>
                          {ad.allowOnPrivatePages && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold" title="Allowed on private pages">
                              Workspace
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span className="font-semibold text-slate-500 dark:text-slate-400">{ad.network}</span>
                          <span>•</span>
                          <span>{ad.targetPages?.length || 0} Pages</span>
                        </div>
                      </td>

                      {/* Format & Dimensions */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {ad.format === 'banner_468x60' && '468×60'}
                          {ad.format === 'banner_728x90' && '728×90'}
                          {ad.format === 'sidebar_160x300' && '160×300'}
                          {ad.format === 'mobile_320x50' && '320×50'}
                          {ad.format === 'container' && 'Container'}
                          {ad.format === 'script' && 'Script'}
                          {ad.format === 'custom' && `${ad.width}×${ad.height}`}
                        </span>
                      </td>

                      {/* Placement */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-700 dark:text-slate-300 font-medium">
                          {ad.placement.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Devices */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          {ad.devices === 'all' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                              <Monitor className="w-3 h-3" /> All Devices
                            </span>
                          )}
                          {ad.devices === 'desktop' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                              <Monitor className="w-3 h-3" /> Desktop
                            </span>
                          )}
                          {ad.devices === 'tablet' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                              <Tablet className="w-3 h-3" /> Tablet
                            </span>
                          )}
                          {ad.devices === 'mobile' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                              <Smartphone className="w-3 h-3" /> Mobile
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                        #{ad.priority}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => toggleAd(ad.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            ad.enabled
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${ad.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{ad.enabled ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewModalAd(ad);
                              setPreviewDevice(ad.devices === 'mobile' ? 'mobile' : 'desktop');
                            }}
                            className="p-1.5 text-slate-500 hover:text-[#3D2FD1] hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Live Preview Ad"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(ad)}
                            className="p-1.5 text-slate-500 hover:text-[#3D2FD1] hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit Ad Settings & Code"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Duplicate Button */}
                          <button
                            type="button"
                            onClick={() => duplicateAd(ad.id)}
                            className="p-1.5 text-slate-500 hover:text-[#3D2FD1] hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Duplicate Placement"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(ad.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                            title="Delete Advertisement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD / EDIT ADVERTISEMENT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#15112B] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02]">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
                  {editingAd ? 'Edit Advertisement Placement' : 'Create New Advertisement Placement'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure Adsterra or third-party tags with target devices, dimensions, and pages.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch between Code Config and Live Preview inside Modal */}
                <div className="flex items-center p-0.5 rounded-lg bg-slate-200 dark:bg-white/10 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setFormTab('config')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      formTab === 'config' 
                        ? 'bg-white dark:bg-[#201A45] text-[#3D2FD1] dark:text-white shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Configuration
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTab('preview')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      formTab === 'preview' 
                        ? 'bg-white dark:bg-[#201A45] text-[#3D2FD1] dark:text-white shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {formTab === 'config' ? (
              <form onSubmit={handleSaveForm} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                
                {/* 1. Name & Network */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Advertisement Name / Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., AD 4 — 728×90 Leaderboard"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-[#3D2FD1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ad Network / Provider
                    </label>
                    <input
                      type="text"
                      value={formData.network || 'Adsterra'}
                      onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                      placeholder="e.g., Adsterra, Google AdSense, Custom"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-[#3D2FD1]"
                    />
                  </div>
                </div>

                {/* 2. Format, Width, Height */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Format Preset
                    </label>
                    <select
                      value={formData.format || 'banner_728x90'}
                      onChange={(e) => handleFormatChange(e.target.value as AdFormat)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#1B1635] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="banner_728x90">728×90 Leaderboard Banner</option>
                      <option value="banner_468x60">468×60 Standard Banner</option>
                      <option value="sidebar_160x300">160×300 Skyscraper Sidebar</option>
                      <option value="mobile_320x50">320×50 Mobile Banner</option>
                      <option value="container">Adsterra Container / Invoke</option>
                      <option value="custom">Custom Dimensions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={formData.width || 728}
                      onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#1B1635] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={formData.height || 90}
                      onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#1B1635] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Placement, Devices, Spacing, Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Placement Location
                    </label>
                    <select
                      value={formData.placement || 'below_hero'}
                      onChange={(e) => setFormData({ ...formData, placement: e.target.value as AdPlacementLocation })}
                      className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="top_banner">Top Banner</option>
                      <option value="below_hero">Below Hero</option>
                      <option value="between_content">Between Content</option>
                      <option value="feed_marketplace">Feed / Marketplace</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="before_footer">Before Footer</option>
                      <option value="footer">Footer</option>
                      <option value="mobile_banner">Mobile Banner</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Target Devices
                    </label>
                    <select
                      value={formData.devices || 'all'}
                      onChange={(e) => setFormData({ ...formData, devices: e.target.value as AdDeviceTarget })}
                      className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="all">All Devices</option>
                      <option value="desktop">Desktop Only</option>
                      <option value="tablet">Tablet Only</option>
                      <option value="mobile">Mobile Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Margin Spacing
                    </label>
                    <select
                      value={formData.spacing || 'standard'}
                      onChange={(e) => setFormData({ ...formData, spacing: e.target.value as AdSpacing })}
                      className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="none">None (0px)</option>
                      <option value="compact">Compact (8-12px)</option>
                      <option value="standard">Standard (16-24px)</option>
                      <option value="relaxed">Relaxed (24-40px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Priority Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={formData.priority || 1}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                      className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Page Targeting (Multi-Select) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Page Targeting (Public Discovery Pages)
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, targetPages: PUBLIC_PAGES_OPTIONS.map(p => p.id) })}
                      className="text-[11px] font-semibold text-[#3D2FD1] hover:underline"
                    >
                      Select All Public Pages
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                    {PUBLIC_PAGES_OPTIONS.map(page => {
                      const isChecked = formData.targetPages?.includes(page.id);
                      return (
                        <label 
                          key={page.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                            isChecked 
                              ? 'bg-white dark:bg-[#201A45] text-[#3D2FD1] dark:text-white font-bold shadow-xs' 
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleTargetPage(page.id)}
                            className="rounded border-slate-300 text-[#3D2FD1] focus:ring-[#3D2FD1]"
                          />
                          <span className="truncate">{page.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Security Protection & Private Page Gate */}
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl space-y-2">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Private Workspace &amp; Authentication Shield
                      </span>
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                        By default, advertisements are strictly suppressed on Admin, Chat/Messages, Dashboard, Orders, Escrow, and Settings pages.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1 text-xs text-amber-800 dark:text-amber-200 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.allowOnPrivatePages)}
                      onChange={(e) => setFormData({ ...formData, allowOnPrivatePages: e.target.checked })}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Explicitly allow this advertisement on private/authenticated workspace pages</span>
                  </label>
                </div>

                {/* 6. Raw Advertising Code Snippet */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-[#3D2FD1]" />
                      <span>Ad Provider Code Snippet (HTML / JavaScript) *</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Paste exact snippet from Adsterra or provider
                    </span>
                  </div>

                  <textarea
                    required
                    rows={6}
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="<script src='https://...'></script>"
                    className="w-full font-mono text-[11px] p-3 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800 focus:outline-none focus:border-[#3D2FD1] leading-relaxed resize-y"
                    spellCheck={false}
                  />
                </div>

                {/* 7. Active Status Switch */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enable this ad placement upon saving
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold px-5 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#3224B8] text-white shadow-sm transition-all"
                  >
                    {editingAd ? 'Save Placement Changes' : 'Create & Save Advertisement'}
                  </button>
                </div>
              </form>
            ) : (
              /* Live Preview Tab inside Edit Modal */
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-center">
                  <AdRenderer
                    ad={{
                      id: formData.id || 'preview-ad',
                      name: formData.name || 'Preview Ad',
                      network: formData.network || 'Adsterra',
                      format: (formData.format as AdFormat) || 'banner_728x90',
                      width: Number(formData.width) || 728,
                      height: Number(formData.height) || 90,
                      placement: (formData.placement as AdPlacementLocation) || 'below_hero',
                      devices: (formData.devices as AdDeviceTarget) || 'all',
                      enabled: true,
                      priority: 1,
                      spacing: 'standard',
                      targetPages: ['home'],
                      code: formData.code || '',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setFormTab('config')}
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-[#3D2FD1] text-white"
                  >
                    Back to Configuration
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. STANDALONE LIVE PREVIEW MODAL */}
      {previewModalAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#15112B] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden my-8">
            
            {/* Header with Device Switcher */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">
                  Live Simulated Preview: {previewModalAd.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Testing responsiveness and isolated execution.
                </p>
              </div>

              {/* Viewport Width Emulation */}
              <div className="flex items-center gap-1 bg-slate-200 dark:bg-white/10 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    previewDevice === 'desktop'
                      ? 'bg-white dark:bg-[#201A45] text-[#3D2FD1] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    previewDevice === 'tablet'
                      ? 'bg-white dark:bg-[#201A45] text-[#3D2FD1] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet (768px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    previewDevice === 'mobile'
                      ? 'bg-white dark:bg-[#201A45] text-[#3D2FD1] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile (375px)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalAd(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewport Frame */}
            <div className="p-8 bg-slate-100 dark:bg-[#0E0A1E] flex items-center justify-center overflow-x-auto min-h-[300px]">
              <div 
                className="transition-all duration-300 bg-white dark:bg-[#15112B] p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center max-w-full"
                style={{
                  width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px'
                }}
              >
                <div className="w-full text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-white/10 text-[10px] text-slate-400">
                  Simulated Viewport ({previewDevice === 'desktop' ? 'Full Desktop' : previewDevice === 'tablet' ? '768px Tablet' : '375px Mobile'})
                </div>
                
                <AdRenderer ad={previewModalAd} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] flex items-center justify-between text-xs">
              <div className="text-slate-500 text-[11px]">
                Format: <span className="font-bold text-slate-700 dark:text-slate-300">{previewModalAd.format}</span> ({previewModalAd.width}×{previewModalAd.height}px)
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalAd(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white font-bold"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#15112B] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 dark:bg-rose-950/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Delete Advertisement</h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this advertisement? It will be permanently removed from all targeted page placements.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteAd(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Yes, Delete Ad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. RESTORE FACTORY ADSTERRA CODES CONFIRMATION */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#15112B] rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-[#3D2FD1]">
              <div className="p-2.5 rounded-full bg-[#F2F0FF] dark:bg-[#201A45]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Restore Adsterra Presets</h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              This will reset the ad catalog to the 6 official Adsterra codes (468×60, 728×90, 160×300, 320×50, Container, and Smart Tag Script) with their recommended default placements.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await resetToDefaultAds();
                  setResetConfirmOpen(false);
                  setSaveSuccessMsg('Adsterra default placements restored successfully.');
                  setTimeout(() => setSaveSuccessMsg(null), 4000);
                }}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#3224B8] text-white shadow-sm"
              >
                Yes, Restore Presets
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
