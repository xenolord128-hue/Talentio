import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { SECURITY_SCENARIOS, SecurityScenario } from '../data/simulatorsData';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileWarning, 
  QrCode, 
  ArrowRight, 
  Check, 
  X, 
  Info,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const SecurityScannerPage: React.FC = () => {
  const { setActiveGuideId, language } = useGuide();
  const isBn = language === 'bn';

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);

  const scenario = SECURITY_SCENARIOS[selectedScenarioIndex];
  const isAnswered = userGuess !== null;
  const isCorrect = userGuess === scenario.isScam;

  const handleGuess = (guessIsScam: boolean) => {
    setUserGuess(guessIsScam);
  };

  const handleNext = () => {
    setUserGuess(null);
    setSelectedScenarioIndex((prev) => (prev + 1) % SECURITY_SCENARIOS.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 p-6 sm:p-10 text-white shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-md border border-rose-500/30">
          <ShieldAlert size={14} className="text-rose-400" />
          {isBn ? 'ইন্টারেক্টিভ থ্রেট স্ক্যানার' : 'Interactive Threat Scanner'}
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight">
          {isBn ? 'ফাইভার স্ক্যাম ও ফিশিং ডিফেন্স সিমুলেটর' : 'Fiverr Scam & Phishing Defense Simulator'}
        </h1>
        <p className="text-sm sm:text-base text-rose-200 max-w-2xl leading-relaxed">
          {isBn 
            ? 'নতুন ফ্রিল্যান্সারদের টার্গেট করে কিউআর কোড ফাঁদ, ভুয়া টেলিগ্রাম মেসেজ ও ম্যালওয়্যার জিপ ফাইল পাঠানো হয়। আসল ক্লায়েন্ট রিকোয়েস্ট ও বিপজ্জনক স্ক্যামের পার্থক্য চিহ্নিত করতে নিজেকে যাচাই করুন।'
            : 'Phishing attacks targeting new freelancers are on the rise. Test your ability to distinguish authentic client inquiries from dangerous QR code traps and malware archives.'}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {SECURITY_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setUserGuess(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedScenarioIndex === idx
                  ? 'bg-white text-rose-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isBn ? `টেস্ট কেস ${idx + 1}` : `Test Case ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Test Case Inspection Box */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Inbox Threat Inspection #{selectedScenarioIndex + 1}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {scenario.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Sender Profile:</span>
            <span className="font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {scenario.senderName} ({scenario.senderBadge})
            </span>
          </div>
        </div>

        {/* Message Content Simulation */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            "{scenario.messageBody}"
          </div>

          {scenario.attachedFileOrQr && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {scenario.attachedFileOrQr.endsWith('.png') ? (
                <QrCode size={18} className="text-rose-500" />
              ) : (
                <FileWarning size={18} className="text-amber-500" />
              )}
              <span>Attachment: <code>{scenario.attachedFileOrQr}</code></span>
            </div>
          )}
        </div>

        {/* Action Decision Buttons */}
        {!isAnswered ? (
          <div className="space-y-3 pt-2">
            <h3 className="text-center font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'এই ইনবক্স মেসেজটি সম্পর্কে আপনার সিদ্ধান্ত কী?' : 'What is your verdict on this message?'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleGuess(true)}
                className="py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert size={18} />
                <span>{isBn ? 'এটি একটি স্ক্যাম / ফিশিং আক্রমণ (SCAM)' : 'Verdict: This is a SCAM / Phishing'}</span>
              </button>

              <button
                onClick={() => handleGuess(false)}
                className="py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={18} />
                <span>{isBn ? 'এটি বৈধ ক্লায়েন্ট মেসেজ (LEGITIMATE)' : 'Verdict: Legitimate Client Requirement'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-2 animate-in fade-in duration-200">
            {/* Feedback Banner */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              {isCorrect ? (
                <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={24} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-base">
                  {isCorrect 
                    ? (isBn ? '🎯 সঠিক উত্তর! আপনি হুমকি সঠিকভাবে চিহ্নিত করেছেন।' : 'Correct Analysis!') 
                    : (isBn ? '⚠️ সাবধান! আপনি এই ফিশিং মেসেজে প্রতারিত হয়েছেন।' : 'Warning: You were tricked by this message')}
                </div>
                <p className="leading-relaxed font-semibold">
                  Threat Classification: {scenario.threatType}
                </p>
                <p className="leading-relaxed">
                  {scenario.officialExplanation}
                </p>
              </div>
            </div>

            {/* Warning Signs List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isBn ? 'যে বিষয়গুলো দেখে সতর্ক হবেন:' : 'Key Warning Indicators to Look For:'}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {scenario.warningSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Action */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                {isBn ? 'সঠিক ফ্রিল্যান্সার অ্যাকশন:' : 'Correct Freelancer Action:'}
              </span>
              <p>{scenario.correctAction}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setUserGuess(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isBn ? 'পুনরায় চেষ্টা করুন' : 'Retry This Test Case'}
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isBn ? 'পরবর্তী টেস্ট কেস' : 'Next Test Case'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Link to Full Security Guide */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <span className="font-bold text-slate-900 dark:text-white block text-sm">
            {isBn ? 'সম্পূর্ণ সিকিউরিটি ও TOS গাইড পড়ুন' : 'Read the Complete Security Documentation'}
          </span>
          <p className="text-slate-500">
            {isBn ? '2FA বাইপাস, ফেইক সাপোর্ট বট ও পেমেন্ট ফ্রড থেকে অ্যাকাউন্ট নিরাপদে রাখুন।' : 'Learn full defense tactics against 2FA bypasses, fake support accounts, and payment fraud.'}
          </p>
        </div>
        <button
          onClick={() => setActiveGuideId('fiverr-basics')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
        >
          {isBn ? 'সিকিউরিটি গাইড দেখুন' : 'Open Security Guide'}
        </button>
      </div>
    </div>
  );
};
