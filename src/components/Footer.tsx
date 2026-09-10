import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { ThemeToggle } from './ThemeToggle';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Award,
  Layers,
  Send,
  Keyboard
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, showToast, setIsShortcutsModalOpen } = useGuide();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Subscribed to Talentio Global Talent Briefing!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1A1633] text-white border-t border-[#3D2FD1]/30">
      
      {/* Top Value Proposition Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D2FD1]/30 border border-[#6E5BFF]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#A38BFF]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Escrow Protection</h4>
                <p className="text-xs text-slate-300 mt-0.5">Funds held safely in escrow until you approve completed milestones.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D2FD1]/30 border border-[#6E5BFF]/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#A38BFF]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Vetted Global Talent</h4>
                <p className="text-xs text-slate-300 mt-0.5">Top 3% of digital engineers, AI specialists, and product designers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D2FD1]/30 border border-[#6E5BFF]/30 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#A38BFF]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Automated NDAs & IP</h4>
                <p className="text-xs text-slate-300 mt-0.5">Full intellectual property transfer on every delivered contract.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D2FD1]/30 border border-[#6E5BFF]/30 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-[#A38BFF]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Global Multi-Currency</h4>
                <p className="text-xs text-slate-300 mt-0.5">Instant international payouts via Payoneer, Wire, Stripe & Bank.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <TalentioLogo size="md" variant="gradient" />
              <span className="text-xl font-extrabold tracking-tight text-white font-display">TALENTIO</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              The premier freelance marketplace in Bangladesh. Connecting businesses, startups, and clients with skilled Bangladeshi freelancers and vetted international experts through secure milestone escrow.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-[#A38BFF] uppercase tracking-wider block">
                Stay updated with freelance talent in Bangladesh
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="bg-white text-[#1A1633] placeholder:text-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-white/20 focus:border-[#6E5BFF] focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Column 1: For Clients */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A38BFF]">For Clients</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="/freelancers" onClick={(e) => { e.preventDefault(); setActivePage('freelancers'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Hire Freelancers in Bangladesh
                </a>
              </li>
              <li>
                <a href="/services" onClick={(e) => { e.preventDefault(); setActivePage('services'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Freelance Services &amp; Gigs
                </a>
              </li>
              <li>
                <a href="/categories" onClick={(e) => { e.preventDefault(); setActivePage('categories'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Browse Categories &amp; Skills
                </a>
              </li>
              <li>
                <a href="/leaderboard" onClick={(e) => { e.preventDefault(); setActivePage('leaderboard'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Top Bangladeshi Freelancers
                </a>
              </li>
              <li>
                <a href="/playbook" onClick={(e) => { e.preventDefault(); setActivePage('playbook'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Escrow Milestones &amp; Protection
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: For Freelancers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A38BFF]">For Freelancers</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="/freelancers" onClick={(e) => { e.preventDefault(); setActivePage('freelancers'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Find Freelance Jobs &amp; Projects
                </a>
              </li>
              <li>
                <a href="/playbook" onClick={(e) => { e.preventDefault(); setActivePage('playbook'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Talentio Academy &amp; Playbook
                </a>
              </li>
              <li>
                <a href="/notices" onClick={(e) => { e.preventDefault(); setActivePage('notices'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Platform Updates &amp; Notices
                </a>
              </li>
              <li>
                <a href="/help" onClick={(e) => { e.preventDefault(); setActivePage('help'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Support &amp; Escrow Help
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A38BFF]">Trust &amp; Safety</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="/help" onClick={(e) => { e.preventDefault(); setActivePage('help'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Trust &amp; Support Center
                </a>
              </li>
              <li>
                <a href="/playbook" onClick={(e) => { e.preventDefault(); setActivePage('playbook'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Security Defense Scanner
                </a>
              </li>
              <li>
                <a href="/help" onClick={(e) => { e.preventDefault(); setActivePage('help'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Escrow FAQ &amp; Arbitration
                </a>
              </li>
              <li>
                <a href="/playbook" onClick={(e) => { e.preventDefault(); setActivePage('playbook'); }} className="hover:text-[#6E5BFF] transition-colors cursor-pointer inline-block">
                  Terms of Service &amp; IP
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Accessibility Theme Selection */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>© {new Date().getFullYear()} Talentio Global Inc. All rights reserved.</span>
            <div className="hidden sm:block text-slate-600">|</div>
            <ThemeToggle variant="segmented" />
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
              title="View Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#A38BFF]" />
              <span>Shortcuts</span>
              <kbd className="px-1 py-0.2 rounded bg-black/40 text-[9px] font-mono text-slate-300 border border-white/10">?</kbd>
            </button>
            <span className="text-slate-600">|</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 font-mono">SOC2 Type II Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
