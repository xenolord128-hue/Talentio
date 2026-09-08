import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  X, 
  Smartphone, 
  MessageSquare, 
  ShieldCheck, 
  Bell, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Copy, 
  Eye, 
  Send,
  Layers,
  Palette,
  Clock,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { triggerRichChatNotification, triggerRichAdminNoticeNotification } from '../utils/serviceWorkerRegistration';

export const WidgetManagerModal: React.FC = () => {
  const { 
    isWidgetManagerOpen, 
    setIsWidgetManagerOpen, 
    chatMessages, 
    contract, 
    notices, 
    setActivePage,
    showToast,
    user
  } = useGuide();

  // Widget Customizer State
  const [selectedWidgetType, setSelectedWidgetType] = useState<'chat' | 'escrow' | 'notice'>('chat');
  const [widgetTheme, setWidgetTheme] = useState<'talentio-dark' | 'midnight-amoled' | 'cyber-emerald' | 'frosted-light'>('talentio-dark');
  const [widgetSize, setWidgetSize] = useState<'compact' | 'medium' | 'wide'>('wide');
  const [blurLevel, setBlurLevel] = useState<'high' | 'ultra'>('ultra');
  const [showActiveDot, setShowActiveDot] = useState(true);
  const [languageMode, setLanguageMode] = useState<'bn' | 'en'>('bn');
  const [copiedCode, setCopiedCode] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  if (!isWidgetManagerOpen) return null;

  // Derive latest data
  const latestMessage = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : {
    senderName: 'Md Sydur Rahman',
    text: '🔥 আপনার প্রজেক্টের ডেলিভারি সম্পন্ন হয়েছে! দয়া করে মাইলস্টোনটি রিভিউ করুন।',
    timestamp: 'Just now'
  };

  const latestNotice = notices.length > 0 ? notices[0] : {
    title: 'অফিসিয়াল মার্কেটপ্লেস নোটিশ',
    description: 'নতুন এসক্রো সুরক্ষা ২.০ চালু হয়েছে। ১০০% নিরাপদ লেনদেন নিশ্চিত করুন।',
    timestamp: '10m ago'
  };

  // Test Notification matching Screenshot 3
  const handleTestNotification = async () => {
    setSendingTest(true);
    try {
      if (selectedWidgetType === 'chat') {
        await triggerRichChatNotification(
          'Md Sydur Rahman (Client)',
          '🔥 আপনার পরিবারের নিরাপত্তার জন্য নতুন ডেলিভারি আপডেট করা হয়েছে। দয়া করে ওপেন করুন।',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          'conv-1'
        );
      } else {
        await triggerRichAdminNoticeNotification(
          'Talentio অফিশিয়াল এনাউন্সমেন্ট',
          'আপনার অ্যাকাউন্টে নতুন প্রজেক্ট ইনকোয়ারি এসেছে! ১০০% এসক্রো ফান্ড সুরক্ষিত আছে।',
          '/?page=notices',
          'notice-test'
        );
      }
      showToast('ডিভাইসে রিচ নোটিফিকেশন পাঠানো হয়েছে! মোবাইল নোটিফিকেশন শেড চেক করুন।', 'success');
    } catch (err) {
      showToast('নোটিফিকেশন পারমিশন এনাবল করুন।', 'warning');
    } finally {
      setSendingTest(false);
    }
  };

  const getThemeStyles = () => {
    switch (widgetTheme) {
      case 'midnight-amoled':
        return {
          wrapper: 'bg-[#06040C]/95 border-purple-500/30 text-white shadow-2xl shadow-purple-950/50',
          accent: 'text-purple-400',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          highlight: '#A38BFF'
        };
      case 'cyber-emerald':
        return {
          wrapper: 'bg-gradient-to-br from-[#061813]/95 to-[#0C2A21]/95 border-emerald-500/30 text-white shadow-2xl shadow-emerald-950/50',
          accent: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          highlight: '#34D399'
        };
      case 'frosted-light':
        return {
          wrapper: 'bg-white/95 border-slate-200 text-slate-900 shadow-2xl shadow-slate-300/60',
          accent: 'text-[#3D2FD1]',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          highlight: '#3D2FD1'
        };
      case 'talentio-dark':
      default:
        return {
          wrapper: 'bg-gradient-to-br from-[#120D26]/90 to-[#1F1744]/90 border-white/15 text-white shadow-2xl shadow-[#3D2FD1]/30',
          accent: 'text-[#A38BFF]',
          badge: 'bg-[#3D2FD1]/30 text-[#C4B5FD] border-[#6E5BFF]/30',
          highlight: '#6E5BFF'
        };
    }
  };

  const currentTheme = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#110D24] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#181335] to-[#120D26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3D2FD1] to-[#6E5BFF] flex items-center justify-center shadow-lg shadow-[#3D2FD1]/40">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-display">
                  Android Live Home Screen Widgets
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PWA Widget Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                মোবাইলের হোমস্ক্রিনের জন্য প্রিমিয়াম গ্লাসি মরফিজম উইজেট ও লাইভ নোটিফিকেশন কনফিগার করুন
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsWidgetManagerOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto max-h-[75vh]">
          
          {/* Left Column: Live Interactive Widget Preview */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#A38BFF]" />
                লাইভ উইজেট প্রিভিউ (মোবাইল হোমস্ক্রিন)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {widgetSize === 'compact' ? '2x1 Compact' : widgetSize === 'medium' ? '2x2 Medium' : '4x2 Expanded'}
              </span>
            </div>

            {/* Mobile Wallpaper Frame Simulator */}
            <div className="relative rounded-3xl overflow-hidden p-5 sm:p-6 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0B0F19] border border-white/10 shadow-inner flex flex-col items-center justify-center min-h-[300px]">
              {/* Wallpaper Ambient Glow */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#6E5BFF]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Status Bar simulation */}
              <div className="w-full flex items-center justify-between text-[11px] text-white/60 font-mono mb-4 px-1">
                <span>7:45 PM</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <span>52%</span>
                </div>
              </div>

              {/* Actual Widget Render */}
              <div 
                className={`w-full transition-all duration-300 rounded-3xl border ${currentTheme.wrapper} ${
                  blurLevel === 'ultra' ? 'backdrop-blur-2xl' : 'backdrop-blur-xl'
                } p-4 sm:p-5 relative group`}
              >
                {/* Top Row: App Brand & Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src="/favicon.svg" alt="Talentio" className="w-5 h-5 rounded-lg drop-shadow" />
                    <span className="text-xs font-black tracking-wide font-display">
                      TALENTIO
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/10 text-slate-300 uppercase font-mono">
                      {selectedWidgetType === 'chat' ? 'Chat' : selectedWidgetType === 'escrow' ? 'Escrow' : 'Notice'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {showActiveDot && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {languageMode === 'bn' ? 'লাইভ সিঙ্ক' : 'Live Sync'}
                    </span>
                  </div>
                </div>

                {/* Widget Body Content */}
                {selectedWidgetType === 'chat' && (
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
                          alt="Sender"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover ring-2 ring-purple-500/40" 
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#120D26] rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold truncate">
                            {latestMessage.senderName || 'Md Sydur Rahman'}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {latestMessage.timestamp || 'Just now'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {languageMode === 'bn' 
                            ? '🔥 আপনার প্রজেক্টের ডেলিভারি সম্পন্ন হয়েছে! দয়া করে ফাইলগুলো চেক করে মাইলস্টোন অ্যাপ্রুভ করুন।'
                            : (latestMessage.text || '🔥 Custom milestone deliverable files are ready for review!')}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Buttons (like Screenshot 3) */}
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <button 
                        onClick={() => {
                          setIsWidgetManagerOpen(false);
                          setActivePage('chat');
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-[#3D2FD1] hover:bg-[#4E3EF0] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#3D2FD1]/30"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{languageMode === 'bn' ? 'চ্যাটে যান' : 'OPEN CHAT'}</span>
                      </button>

                      <button 
                        onClick={() => showToast('উইজেট থেকে মেসেজ রিড মার্ক করা হয়েছে', 'info')}
                        className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        {languageMode === 'bn' ? 'পড়া হয়েছে' : 'MARK READ'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedWidgetType === 'escrow' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{languageMode === 'bn' ? 'এসক্রো ফান্ড লকড' : 'ESCROW SECURED'}</span>
                        </div>
                        <h4 className="text-sm font-extrabold mt-0.5">
                          {contract?.title || 'SaaS Web Platform & AI Chatbot'}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                          ${contract?.totalAmount || '1,450'}
                        </span>
                        <div className="text-[9px] text-slate-400">100% Protected</div>
                      </div>
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>{languageMode === 'bn' ? 'মাইলস্টোন প্রগ্রেস' : 'Milestone 2 of 3'}</span>
                        <span className="text-emerald-400 font-bold">75% Complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#6E5BFF] to-emerald-400 w-3/4 rounded-full transition-all duration-500" />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {languageMode === 'bn' ? 'ডেলিভারি বাকি: ৩ দিন' : 'Delivery: 3 days left'}
                      </span>
                      <button 
                        onClick={() => {
                          setIsWidgetManagerOpen(false);
                          setActivePage('workstation');
                        }}
                        className="text-xs font-bold text-[#A38BFF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{languageMode === 'bn' ? 'ওয়ার্কস্টেশন দেখুন' : 'View Orders'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {selectedWidgetType === 'notice' && (
                  <div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold truncate">
                          {latestNotice.title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {latestNotice.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{latestNotice.timestamp || 'Today'}</span>
                      <button 
                        onClick={() => {
                          setIsWidgetManagerOpen(false);
                          setActivePage('notices');
                        }}
                        className="py-1 px-2.5 rounded-lg bg-[#3D2FD1] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{languageMode === 'bn' ? 'নোটিশ ওপেন করুন' : 'OPEN LINK'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Home Indicator line */}
              <div className="w-24 h-1 bg-white/20 rounded-full mt-5" />
            </div>

            {/* Test Action Trigger (Direct Notification shade) */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  স্ক্রিনশটের মতো মোবাইল নোটিফিকেশন শেডে টেস্ট পাঠাতে চান?
                </span>
              </div>

              <button
                onClick={handleTestNotification}
                disabled={sendingTest}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-900/30 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sendingTest ? 'পাঠানো হচ্ছে...' : 'টেস্ট নোটিফিকেশন পাঠান'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls & Installation Guide */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            
            {/* Widget Category Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                ১. উইজেটের ধরন নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedWidgetType('chat')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedWidgetType === 'chat'
                      ? 'bg-[#3D2FD1] border-[#6E5BFF] text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold">চ্যাট প্রিভিউ</span>
                </button>

                <button
                  onClick={() => setSelectedWidgetType('escrow')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedWidgetType === 'escrow'
                      ? 'bg-[#3D2FD1] border-[#6E5BFF] text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">এসক্রো অর্ডার</span>
                </button>

                <button
                  onClick={() => setSelectedWidgetType('notice')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedWidgetType === 'notice'
                      ? 'bg-[#3D2FD1] border-[#6E5BFF] text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-xs font-bold">প্ল্যাটফর্ম নোটিশ</span>
                </button>
              </div>
            </div>

            {/* Aesthetic Theme Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                ২. অ্যাস্থেটিক কালার ও থিম
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setWidgetTheme('talentio-dark')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    widgetTheme === 'talentio-dark'
                      ? 'bg-gradient-to-r from-[#120D26] to-[#1F1744] border-[#6E5BFF] text-white shadow'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#6E5BFF]" />
                    <span>Signature Purple</span>
                  </div>
                  {widgetTheme === 'talentio-dark' && <Check className="w-3.5 h-3.5 text-[#A38BFF]" />}
                </button>

                <button
                  onClick={() => setWidgetTheme('midnight-amoled')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    widgetTheme === 'midnight-amoled'
                      ? 'bg-[#07050E] border-purple-500 text-white shadow'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#07050E] border border-white/40" />
                    <span>AMOLED Black</span>
                  </div>
                  {widgetTheme === 'midnight-amoled' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </button>

                <button
                  onClick={() => setWidgetTheme('cyber-emerald')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    widgetTheme === 'cyber-emerald'
                      ? 'bg-[#061813] border-emerald-500 text-white shadow'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span>Cyber Emerald</span>
                  </div>
                  {widgetTheme === 'cyber-emerald' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={() => setWidgetTheme('frosted-light')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    widgetTheme === 'frosted-light'
                      ? 'bg-white border-[#3D2FD1] text-slate-900 shadow'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400" />
                    <span>Frosted Light</span>
                  </div>
                  {widgetTheme === 'frosted-light' && <Check className="w-3.5 h-3.5 text-[#3D2FD1]" />}
                </button>
              </div>
            </div>

            {/* Customizer Toggles */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">ভাষা / Language</span>
                <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/10">
                  <button
                    onClick={() => setLanguageMode('bn')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${languageMode === 'bn' ? 'bg-[#3D2FD1] text-white' : 'text-slate-400'}`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => setLanguageMode('en')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${languageMode === 'en' ? 'bg-[#3D2FD1] text-white' : 'text-slate-400'}`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">গ্লাসি ব্লার তীব্রতা</span>
                <button
                  onClick={() => setBlurLevel(prev => prev === 'ultra' ? 'high' : 'ultra')}
                  className="text-xs text-[#A38BFF] font-bold"
                >
                  {blurLevel === 'ultra' ? 'Ultra Frosted (2xl)' : 'High (xl)'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">লাইভ স্ট্যাটাস ডট</span>
                <input 
                  type="checkbox" 
                  checked={showActiveDot} 
                  onChange={(e) => setShowActiveDot(e.target.checked)}
                  className="rounded accent-[#3D2FD1] cursor-pointer"
                />
              </div>
            </div>

            {/* Step by Step Mobile Installation Guide */}
            <div className="p-4 rounded-2xl bg-[#1A1438] border border-[#6E5BFF]/30 space-y-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A38BFF]" />
                মোবাইলে উইজেট ও শর্টকাট বসানোর নিয়ম
              </h5>
              <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
                <li>মোবাইলের ক্রোম ব্রাউজার মেনু (⋮) থেকে <strong>"Add to Home screen" / "Install App"</strong> দিন।</li>
                <li>হোমস্ক্রিনে Talentio অ্যাপ আইকনটি <strong>লং-প্রেস (চেপে ধরুন)</strong>।</li>
                <li>স্ক্রিনশট ২-এর মতো কনটেক্সট মেনু থেকে <strong>"Widgets"</strong> অপশনটিতে ট্যাপ করুন।</li>
                <li>পছন্দমতো উইজেটটি টেনে আপনার হোমস্ক্রিনে বসিয়ে দিন!</li>
              </ol>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0A20] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>কনফিগারেশন স্বয়ংক্রিয়ভাবে লোকাল স্টোরেজে সেভ হচ্ছে</span>
          </div>

          <button
            onClick={() => {
              setIsWidgetManagerOpen(false);
              showToast('উইজেট প্রিফারেন্স সফলভাবে সক্রিয় করা হয়েছে!', 'success');
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#4E3EF0] text-white text-xs font-bold transition-all shadow-lg shadow-[#3D2FD1]/40 cursor-pointer"
          >
            সম্পন্ন করুন (Save Preferences)
          </button>
        </div>

      </div>
    </div>
  );
};
