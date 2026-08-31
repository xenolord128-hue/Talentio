import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  FileText, 
  Bot, 
  User, 
  ShieldCheck, 
  HelpCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'client' | 'seller';
  senderName: string;
  text: string;
  time: string;
  isOffer?: boolean;
  offerDetails?: {
    title: string;
    price: number;
    days: number;
    revisions: string;
  };
}

export const ClientSimulatorPage: React.FC = () => {
  const { language } = useGuide();
  const isBn = language === 'bn';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'client',
      senderName: 'David Miller (USA 🇺🇸)',
      text: 'Hi there! I saw your Gig. I need a modern landing page for my real estate agency. Can you do it in React with a contact form and property search filter?',
      time: '10:15 AM'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);
  const [offerPrice, setOfferPrice] = useState(120);
  const [offerDays, setOfferDays] = useState(3);
  const [offerDesc, setOfferDesc] = useState('Custom Responsive Real Estate Landing Page with React & Tailwind + Property Filter & Contact Form');

  const [scenarioStep, setScenarioStep] = useState<'initial' | 'clarified' | 'offered' | 'ordered'>('initial');

  // Quick Response Templates
  const templates = [
    {
      label: isBn ? '১. বন্ধুত্বপূর্ণ অভ্যর্থনা ও প্রশ্ন' : '1. Friendly Greeting & Clarification',
      text: 'Hello David! Thank you for reaching out. Yes, I would love to build a high-performance React landing page for your real estate business. Do you already have the design/branding files ready, or do you need custom UI design as well?'
    },
    {
      label: isBn ? '২. কাজের পরিধি ও প্রস্তাব' : '2. Scope Confirmation',
      text: 'Great! Based on your requirements, I will build a fully responsive landing page with custom property filter cards, clean contact form validation, and fast loading speed within 3 days for $120. I will send you an official custom offer below.'
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'seller',
      senderName: 'You (Seller)',
      text: inputMessage,
      time: 'Just now'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Simulate smart client reply
    if (scenarioStep === 'initial') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'client',
            senderName: 'David Miller (USA 🇺🇸)',
            text: 'I have the logo and color palette ready, but need you to design the clean layout and build the property search UI. What would be the price and delivery timeline?',
            time: 'Just now'
          }
        ]);
        setScenarioStep('clarified');
      }, 1000);
    }
  };

  const handleSendCustomOffer = () => {
    const offerMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'seller',
      senderName: 'You (Seller)',
      text: 'I have sent you a formal Custom Offer based on our discussion:',
      time: 'Just now',
      isOffer: true,
      offerDetails: {
        title: offerDesc,
        price: offerPrice,
        days: offerDays,
        revisions: 'Unlimited Revisions'
      }
    };

    setMessages(prev => [...prev, offerMsg]);
    setShowOfferDrawer(false);
    setScenarioStep('offered');

    // Simulate client accepting offer
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'client',
          senderName: 'David Miller (USA 🇺🇸)',
          text: 'Offer accepted! The order has officially started. Let me know when you need the brand assets uploaded to the requirements tab.',
          time: 'Just now'
        }
      ]);
      setScenarioStep('ordered');
    }, 1500);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'client',
        senderName: 'David Miller (USA 🇺🇸)',
        text: 'Hi there! I saw your Gig. I need a modern landing page for my real estate agency. Can you do it in React with a contact form and property search filter?',
        time: '10:15 AM'
      }
    ]);
    setScenarioStep('initial');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isBn ? 'ইনবক্স মেসেজ ও অফার সিমুলেটর' : 'Client Communication Simulator'}</span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isBn ? 'রিসেট সিমুলেশন' : 'Reset Chat'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isBn ? 'ক্লায়েন্ট মেসেজ হ্যান্ডলিং ও কাস্টম অফার পাঠানোর প্র্যাকটিস' : 'Master Buyer Conversations & Custom Offers'}
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {isBn
            ? 'ক্লায়েন্ট ইনবক্সে মেসেজ দেওয়ার পর কীভাবে বিনম্রভাবে কথা শুরু করবেন, প্রজেক্টের চাহিদা বুঝবেন এবং সরাসরি কাস্টম অফার পাঠিয়ে অর্ডারে কনভার্ট করবেন তা লাইভ ট্রাই করুন।'
            : 'Practice handling initial client inquiries, asking scope-defining questions, and generating tailored Custom Offers to close deals quickly.'}
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Quick Templates & Guidance */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-slate-400 block">
              {isBn ? 'প্রস্তুত রেসপন্স টেমপ্লেট:' : 'Quick Response Templates:'}
            </span>
            <div className="space-y-2">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(tpl.text)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 transition-all cursor-pointer space-y-1"
                >
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                    {tpl.label}
                  </span>
                  <p className="line-clamp-2 text-slate-500 dark:text-slate-400">
                    {tpl.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>{isBn ? 'ইনবক্স পলিসি সতর্কতা:' : 'Fiverr Chat TOS Guard:'}</span>
            </span>
            <p className="leading-relaxed">
              {isBn
                ? 'ইনবক্সে কখনোই WhatsApp, Email, Telegram, বা Phone নম্বর শেয়ার করবেন না। ফাইভার অ্যালগরিদম সঙ্গে সঙ্গে সতর্কবার্তা পাঠায়।'
                : 'Never share personal contact info (WhatsApp, Skype, personal email). Keep all transaction and project files strictly on Fiverr.'}
            </p>
          </div>
        </div>

        {/* Right: Interactive Chat Window */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                DM
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  David Miller
                </h3>
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Online • United States (10:15 AM local)</span>
                </span>
              </div>
            </div>

            {/* Create Custom Offer Button */}
            <button
              onClick={() => setShowOfferDrawer(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>{isBn ? 'কাস্টম অফার পাঠান' : 'Create Custom Offer'}</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-950/30">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'seller' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 font-mono mb-1 px-1">
                  {msg.senderName} • {msg.time}
                </span>

                {msg.isOffer && msg.offerDetails ? (
                  /* Custom Offer Card in Chat */
                  <div className="max-w-md w-full p-5 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-500/40 shadow-lg space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-800/80">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                        Custom Offer Proposal
                      </span>
                      <span className="text-lg font-extrabold text-white">
                        ${msg.offerDetails.price}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-200">
                      {msg.offerDetails.title}
                    </p>

                    <div className="flex items-center justify-between text-xs text-emerald-300 pt-2 border-t border-emerald-900/60 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{msg.offerDetails.days} Days Delivery</span>
                      </span>
                      <span>{msg.offerDetails.revisions}</span>
                    </div>
                  </div>
                ) : (
                  /* Standard Text Bubble */
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'seller'
                        ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder={isBn ? "বায়ারকে প্রফেশনাল উত্তর লিখুন..." : "Type your message to the client..."}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none border border-transparent focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Modal / Drawer for Custom Offer Creator */}
      {showOfferDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <span>{isBn ? 'ইনবক্স কাস্টম অফার তৈরি করুন' : 'Create Custom Offer'}</span>
              </h3>
              <button
                onClick={() => setShowOfferDrawer(false)}
                className="text-xs font-mono text-slate-400 hover:text-slate-600"
              >
                ESC
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">{isBn ? 'কাজের বিবরণ (Offer Scope):' : 'Offer Scope:'}</label>
                <textarea
                  rows={3}
                  value={offerDesc}
                  onChange={e => setOfferDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{isBn ? 'বাজেট ($ USD):' : 'Price ($ USD):'}</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={e => setOfferPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">{isBn ? 'ডেলিভারি দিন (Days):' : 'Delivery Time (Days):'}</label>
                  <input
                    type="number"
                    value={offerDays}
                    onChange={e => setOfferDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowOfferDrawer(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleSendCustomOffer}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isBn ? 'অফার পাঠান (Send Offer)' : 'Send Custom Offer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
