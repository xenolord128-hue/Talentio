import React, { useState, useEffect } from 'react';
import { useGuide } from '../context/GuideContext';
import { CURRENCIES_DATA } from '../data/currenciesData';
import { 
  Settings, 
  Globe, 
  Shield, 
  Bell, 
  BellRing,
  Lock, 
  CreditCard, 
  Check, 
  ShieldCheck,
  Smartphone,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Vibrate,
  Layers
} from 'lucide-react';
import { triggerDeviceNotification, updateAppBadge, subscribeUserToPush } from '../utils/serviceWorkerRegistration';

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
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Notifications are not supported in this browser.', 'error');
      return;
    }

    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        showToast('Mobile notifications enabled successfully!', 'success');
        if (user?.id) {
          await subscribeUserToPush(user.id);
        }
        // Send welcoming test notification
        await triggerDeviceNotification('🔔 Talentio Notifications Active', {
          body: 'You will now receive instant alerts for client messages, offers, and escrow payouts!',
          url: '/?page=chat'
        });
      } else if (permission === 'denied') {
        showToast('Notification permission was blocked in browser settings.', 'warning');
      }
    } catch (err) {
      showToast('Could not request notification permission.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSendTestNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Notifications not supported', 'error');
      return;
    }

    if (Notification.permission !== 'granted') {
      await handleEnableNotifications();
      return;
    }

    const success = await triggerDeviceNotification('💬 New Message from Elena Rostova', {
      body: 'Hi, I have reviewed the design tokens. Milestone 1 is ready for release!',
      url: '/?page=chat'
    });

    if (success) {
      showToast('Test notification sent to your device!', 'success');
      updateAppBadge(1);
    } else {
      showToast('Notification could not be shown. Please check browser permissions.', 'warning');
    }
  };

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

        {/* Mobile App Push Notifications & Home Screen Widgets */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3D2FD1]/10 text-[#3D2FD1] flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#1A1633] font-display">
                  Mobile Push Notifications & Home Screen Integration
                </h2>
                <p className="text-xs text-slate-500">
                  Instant mobile alerts for client messages, escrow milestones, and home screen shortcuts
                </p>
              </div>
            </div>

            {/* Permission Badge */}
            <div className="flex items-center gap-2">
              {notificationPermission === 'granted' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Notifications Active</span>
                </span>
              ) : notificationPermission === 'denied' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Blocked in Browser</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-amber-600" />
                  <span>Permission Needed</span>
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#3D2FD1]" />
                  <span>Client & Freelancer Direct Message Alerts</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  When a client or freelancer sends you a direct message or updates a project milestone, your phone will ring/vibrate and display an instant native notification just like WhatsApp or Slack.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {notificationPermission !== 'granted' ? (
                  <button
                    onClick={handleEnableNotifications}
                    disabled={isSubscribing}
                    className="px-4 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>{isSubscribing ? 'Enabling...' : 'Enable Notifications'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSendTestNotification}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Vibrate className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test Mobile Notification</span>
                  </button>
                )}
              </div>
            </div>

            {notificationPermission === 'granted' && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  Device is paired with Service Worker. Mobile vibration and badges enabled.
                </span>
                <button
                  onClick={handleSendTestNotification}
                  className="text-xs text-[#3D2FD1] font-bold hover:underline cursor-pointer"
                >
                  Send Sample Message Alert →
                </button>
              </div>
            )}
          </div>

          {/* Home Screen Widgets & Shortcuts Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#3D2FD1]" />
              <span>Mobile Home Screen Shortcuts & Widgets (PWA)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When installed on your mobile home screen (via Netlify or Chrome), Talentio provides native-like widgets and instant action shortcuts:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Shortcut 1 */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#3D2FD1] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">Long-Press Quick Shortcuts</span>
                  <p className="text-[11px] text-slate-500">
                    Press and hold the Talentio icon on your phone home screen to quickly open <strong>Direct Messages</strong>, <strong>Escrow Workstation</strong>, or <strong>Post Job</strong>.
                  </p>
                </div>
              </div>

              {/* Shortcut 2 */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">App Icon Badges (Unread Dots)</span>
                  <p className="text-[11px] text-slate-500">
                    The app icon automatically displays a numbered badge on your phone when new messages or escrow updates arrive.
                  </p>
                </div>
              </div>
            </div>

            {/* Note regarding Android Native OS Widgets */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-950">
              <Sparkles className="w-4 h-4 text-[#3D2FD1] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Android & iOS Home Screen Widgets Info:</span>
                <p className="text-[11px] text-indigo-800 mt-0.5 leading-relaxed">
                  PWA apps support <strong>App Shortcuts</strong> and <strong>Notification Badges</strong> directly. If you also want native full-size Android Home Screen Widgets (e.g. standalone clock/balance cards that sit on your desktop wallpaper), this app can easily be exported to an Android APK via <strong>Capacitor</strong> or <strong>Bubblewrap (TWA)</strong> for Google Play Store.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
