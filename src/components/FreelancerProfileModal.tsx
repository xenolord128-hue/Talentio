import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Bookmark, 
  MessageSquare, 
  Briefcase, 
  Clock, 
  Globe, 
  Award, 
  Lock,
  ArrowRight,
  ExternalLink,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

export const FreelancerProfileModal: React.FC = () => {
  const { 
    selectedFreelancer, 
    isHireModalOpen, 
    setIsHireModalOpen, 
    savedFreelancerIds, 
    toggleSaveFreelancer, 
    currency,
    setActivePage,
    sendChatMessage,
    showToast
  } = useGuide();

  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
  const [customMessage, setCustomMessage] = useState('');
  const [offerBudget, setOfferBudget] = useState('850');

  if (!isHireModalOpen || !selectedFreelancer) return null;

  const isSaved = savedFreelancerIds.includes(selectedFreelancer.id);

  const formatCurrency = (amt: number) => {
    if (currency === 'EUR') return `€${Math.round(amt * 0.92)}`;
    if (currency === 'GBP') return `£${Math.round(amt * 0.79)}`;
    return `$${amt}`;
  };

  const handleSendMessageAndHire = () => {
    if (customMessage.trim()) {
      sendChatMessage(customMessage, true, parseFloat(offerBudget) || 500);
    } else {
      sendChatMessage(`Hi ${selectedFreelancer.name}, I would like to discuss a project with an escrow budget of $${offerBudget}.`, true, parseFloat(offerBudget) || 500);
    }
    setIsHireModalOpen(false);
    setActivePage('chat');
    showToast(`Initiated contract chat with ${selectedFreelancer.name}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-150">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsHireModalOpen(false)} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl rounded-[28px] ios-glass text-[#1A1633] shadow-[0_25px_80px_rgba(26,22,51,0.35)] border border-white/80 overflow-hidden z-10 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header Profile Banner */}
        <div className="p-6 bg-[#1A1633] text-white border-b border-[#A38BFF]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={selectedFreelancer.avatar}
                alt={selectedFreelancer.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#6E5BFF]/50"
              />
              {selectedFreelancer.availableNow && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#1A1633]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{selectedFreelancer.name}</h2>
                {selectedFreelancer.verifiedBadge && (
                  <VerifiedBadge size="sm" />
                )}
                <span className="text-xs text-slate-300">{selectedFreelancer.countryFlag} {selectedFreelancer.country}</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">{selectedFreelancer.title}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#3D2FD1] text-white">
                  {selectedFreelancer.proBadge ? 'Talentio Pro' : 'Top Rated'}
                </span>
                <span className="text-[11px] text-[#A38BFF] font-mono">
                  {selectedFreelancer.jobSuccessScore}% Job Success
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => toggleSaveFreelancer(selectedFreelancer.id)}
              className={`p-3 min-w-[48px] min-h-[48px] rounded-2xl border transition-colors cursor-pointer flex items-center justify-center ${
                isSaved
                  ? 'bg-[#3D2FD1] text-white border-[#A38BFF]'
                  : 'bg-white/10 text-slate-300 hover:text-white border-[#A38BFF]/30'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={() => setIsHireModalOpen(false)}
              className="p-3 min-w-[48px] min-h-[48px] rounded-2xl bg-white/10 text-slate-300 hover:text-white border border-[#A38BFF]/30 transition-colors cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#F2F0FF]/80 backdrop-blur-md border-b border-[#A38BFF]/20 flex gap-4 text-xs sm:text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 min-h-[48px] border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center ${
              activeTab === 'overview'
                ? 'border-[#3D2FD1] text-[#3D2FD1]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview & Bio
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`py-3.5 min-h-[48px] border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center ${
              activeTab === 'portfolio'
                ? 'border-[#3D2FD1] text-[#3D2FD1]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Portfolio ({selectedFreelancer.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 min-h-[48px] border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center ${
              activeTab === 'reviews'
                ? 'border-[#3D2FD1] text-[#3D2FD1]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Verified Client Reviews ({selectedFreelancer.reviewsCount})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm flex-1">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Bio Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Talent</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedFreelancer.bio}
                </p>
              </div>

              {/* Skills Matrix */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFreelancer.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 backdrop-blur-md text-[#3D2FD1] border border-[#A38BFF]/30 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#A38BFF]/30">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Hourly Rate</span>
                  <span className="text-base font-extrabold text-[#3D2FD1]">
                    {formatCurrency(selectedFreelancer.hourlyRate)}/hr
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Response Time</span>
                  <span className="text-xs font-bold text-slate-800">{selectedFreelancer.responseTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Completed Projects</span>
                  <span className="text-xs font-bold text-slate-800">{selectedFreelancer.completedOrdersCount}+</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Rating Score</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{selectedFreelancer.rating}</span>
                  </div>
                </div>
              </div>

              {/* Direct Hire / Milestone Proposal Box */}
              <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#3D2FD1]" />
                    <h4 className="font-bold text-sm text-[#1A1633]">Hire with Escrow Protection</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#3D2FD1] border border-[#A38BFF]/30">
                    100% Guaranteed
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Send a direct message or custom milestone contract. Funds remain securely locked in Talentio Escrow until you review and approve the final work.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={customMessage}
                      onChange={e => setCustomMessage(e.target.value)}
                      placeholder={`Message to ${selectedFreelancer.name}...`}
                      className="w-full bg-white text-[#1A1633] placeholder:text-slate-400 px-3.5 py-2.5 rounded-xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={offerBudget}
                      onChange={e => setOfferBudget(e.target.value)}
                      placeholder="Budget ($)"
                      className="w-full bg-white text-[#1A1633] px-3.5 py-2.5 rounded-xl border border-[#A38BFF]/30 focus:border-[#6E5BFF] focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedFreelancer.portfolio.map(item => (
                <div key={item.id} className="rounded-2xl border border-[#A38BFF]/30 overflow-hidden shadow-sm group bg-white/80 backdrop-blur-md hover:border-[#A38BFF] transition-all">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3 bg-white/90">
                    <span className="text-[10px] font-bold text-[#3D2FD1] uppercase">{item.tag}</span>
                    <h5 className="font-bold text-xs text-[#1A1633] mt-0.5">{item.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && selectedFreelancer.featuredReview && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#1A1633]">{selectedFreelancer.featuredReview.clientName}</h5>
                    <span className="text-[10px] text-slate-400">{selectedFreelancer.featuredReview.clientCountry} • {selectedFreelancer.featuredReview.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "{selectedFreelancer.featuredReview.text}"
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50/80 backdrop-blur-md border-t border-[#A38BFF]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Starting Rate</span>
            <span className="text-sm sm:text-base font-extrabold text-[#3D2FD1]">
              From {formatCurrency(selectedFreelancer.startingPrice)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setIsHireModalOpen(false);
                setActivePage('chat');
              }}
              className="flex-1 sm:flex-none px-4 py-3 min-h-[48px] rounded-xl border border-[#A38BFF]/50 text-[#3D2FD1] hover:bg-[#F2F0FF] text-xs sm:text-sm font-bold cursor-pointer flex items-center justify-center"
            >
              Open Direct Chat
            </button>
            <button
              onClick={handleSendMessageAndHire}
              className="flex-1 sm:flex-none px-5 py-3 min-h-[48px] rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3D2FD1]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Hire with Escrow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
