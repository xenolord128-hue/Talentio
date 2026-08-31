import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { PROFESSIONAL_CATEGORIES } from '../data/categoriesData';
import { UserRole, ProviderType, UserProfile } from '../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Briefcase, 
  Building2, 
  Users, 
  Compass, 
  DollarSign, 
  Layers, 
  Globe, 
  Code2, 
  Palette, 
  Smartphone, 
  Video, 
  Layout, 
  TrendingUp, 
  FileText, 
  Database, 
  Camera, 
  Mic, 
  Box, 
  BrainCircuit, 
  Terminal, 
  Shield, 
  Search,
  Plus,
  X,
  Star,
  Check
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  Code2,
  Smartphone,
  Palette,
  Layout,
  Video,
  Film: Video,
  Megaphone: TrendingUp,
  TrendingUp,
  FileText,
  Globe,
  Database,
  Camera,
  Mic,
  Box,
  BrainCircuit,
  Terminal,
  Shield,
  Briefcase,
  Sparkles
};

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingModalOpen, 
    setIsOnboardingModalOpen, 
    user, 
    completeOnboarding 
  } = useGuide();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Account Info
  const [name, setName] = useState(user?.name || 'Alexander Vance');
  const [handle, setHandle] = useState(user?.handle || '@alexander_v');
  const [location, setLocation] = useState(user?.location || 'Dhaka, Bangladesh');
  const [countryFlag, setCountryFlag] = useState(user?.countryFlag || '🇧🇩');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');

  // Step 2: Role Selection
  const [userType, setUserType] = useState<UserRole>('freelancer');
  const [providerType, setProviderType] = useState<ProviderType>('individual');

  // Step 3 (Freelancer): Professional Category
  const [selectedCategory, setSelectedCategory] = useState<string>('web-dev');
  const [categorySearch, setCategorySearch] = useState<string>('');

  // Step 4 (Freelancer): Subcategories & Skills
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(['Full Stack Development', 'Next.js & React']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Step 5 (Freelancer): Profile & Rates
  const [title, setTitle] = useState('Full Stack Engineer & Web Systems Architect');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'expert' | 'lead'>('expert');
  const [hourlyRate, setHourlyRate] = useState<number>(65);
  const [startingPrice, setStartingPrice] = useState<number>(250);
  const [bio, setBio] = useState('Experienced developer dedicated to high-performance web applications, seamless APIs, and robust escrow-backed deliveries.');
  const [availability, setAvailability] = useState<'available' | 'part_time' | 'busy'>('available');

  // Client specific steps (Step 3, 4, 5 for Client)
  const [companyName, setCompanyName] = useState('Apex Technologies');
  const [industry, setIndustry] = useState('Fintech & SaaS');
  const [companySize, setCompanySize] = useState('11-50 employees');
  const [preferredCategories, setPreferredCategories] = useState<string[]>(['web-dev', 'ui-ux', 'ai-services']);
  const [typicalBudgetRange, setTypicalBudgetRange] = useState('$1,000 - $5,000');

  if (!isOnboardingModalOpen) return null;

  const currentCategoryData = PROFESSIONAL_CATEGORIES.find(c => c.id === selectedCategory) || PROFESSIONAL_CATEGORIES[0];

  const filteredCategories = PROFESSIONAL_CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) || 
    c.nameBn.includes(categorySearch)
  );

  const calculateCompletionScore = () => {
    return Math.min(100, Math.round((step / totalSteps) * 100));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      const profileData: Partial<UserProfile> = {
        name,
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        location,
        countryFlag,
        avatar,
        userType,
        providerType: userType === 'freelancer' || userType === 'agency' ? providerType : undefined,
        category: selectedCategory,
        subcategory: selectedSubcategories.join(', '),
        skills: selectedSkills,
        title: userType === 'client' ? `${companyName} (Hiring Manager)` : title,
        experienceLevel,
        hourlyRate,
        startingPrice,
        bio,
        availability,
        companyName: userType === 'client' ? companyName : undefined,
        industry: userType === 'client' ? industry : undefined,
        companySize: userType === 'client' ? companySize : undefined,
        preferredCategories: userType === 'client' ? preferredCategories : undefined,
        typicalBudgetRange: userType === 'client' ? typicalBudgetRange : undefined,
        onboardingCompleted: true,
        onboardingStep: 6,
        profileCompletionScore: 100
      };
      completeOnboarding(profileData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const toggleSubcategory = (sub: string) => {
    if (selectedSubcategories.includes(sub)) {
      setSelectedSubcategories(selectedSubcategories.filter(s => s !== sub));
    } else {
      setSelectedSubcategories([...selectedSubcategories, sub]);
    }
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl ios-glass-dark text-white rounded-[28px] border border-[#A38BFF]/40 shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Gradient Ambient Light */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#3D2FD1]/35 via-[#6E5BFF]/20 to-transparent blur-xl pointer-events-none" />

        {/* Header & Step Tracker */}
        <div className="p-6 sm:p-7 border-b border-white/10 relative shrink-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <TalentioLogo size="sm" variant="black" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#A38BFF]">
                  Talentio Onboarding Wizard
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  {step === 1 && 'Personal & Account Info'}
                  {step === 2 && 'Choose Your Talentio Role'}
                  {step === 3 && (userType === 'client' ? 'Business & Organization' : 'Primary Category & Domain')}
                  {step === 4 && (userType === 'client' ? 'Project Requirements' : 'Subcategories & Top Skills')}
                  {step === 5 && (userType === 'client' ? 'Billing & Company Overview' : 'Rates, Bio & Experience')}
                  {step === 6 && 'Review & Launch Your Profile'}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-300">
                Step <strong className="text-white">{step}</strong> of {totalSteps}
              </span>
              <div className="text-[11px] font-mono text-[#A38BFF] font-semibold">
                {calculateCompletionScore()}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] transition-all duration-300 rounded-full shadow-sm"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* ========================================================================= */}
          {/* STEP 1: Personal & Account Info */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-sm text-slate-300 font-medium">
                Set up your public identity on the global Talentio marketplace.
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {avatarOptions.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`relative w-14 h-14 rounded-2xl p-0.5 shrink-0 transition-transform cursor-pointer ${
                        avatar === av 
                          ? 'ring-4 ring-[#6E5BFF] scale-105 shadow-lg' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={av} 
                        alt="avatar" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-[14px]" 
                      />
                      {avatar === av && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#6E5BFF] flex items-center justify-center text-white text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Username / Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@tanvir_dev"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Location & City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, USA"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Country Flag Icon
                  </label>
                  <select
                    value={countryFlag}
                    onChange={(e) => setCountryFlag(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-[#6E5BFF]"
                  >
                    <option value="🇺🇸" className="bg-[#1A1633] text-white">🇺🇸 United States</option>
                    <option value="🇬🇧" className="bg-[#1A1633] text-white">🇬🇧 United Kingdom</option>
                    <option value="🇨🇦" className="bg-[#1A1633] text-white">🇨🇦 Canada</option>
                    <option value="🇩🇪" className="bg-[#1A1633] text-white">🇩🇪 Germany</option>
                    <option value="🇦🇪" className="bg-[#1A1633] text-white">🇦🇪 UAE</option>
                    <option value="🇮🇳" className="bg-[#1A1633] text-white">🇮🇳 India</option>
                    <option value="🇸🇬" className="bg-[#1A1633] text-white">🇸🇬 Singapore</option>
                    <option value="🇧🇩" className="bg-[#1A1633] text-white">🇧🇩 Bangladesh</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: Role Selection */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-sm text-slate-300 font-medium">
                How do you plan to use Talentio?
              </div>

              {/* Main Role Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option A: Buyer / Client */}
                <button
                  type="button"
                  onClick={() => setUserType('client')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden backdrop-blur-md ${
                    userType === 'client'
                      ? 'bg-gradient-to-br from-[#3D2FD1]/40 via-[#6E5BFF]/20 to-transparent border-[#A38BFF] ring-2 ring-[#6E5BFF]/50 shadow-xl shadow-[#3D2FD1]/30'
                      : 'bg-white/10 border-[#A38BFF]/30 hover:border-[#A38BFF] hover:bg-white/15'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3D2FD1] to-[#6E5BFF] p-0.5 mb-3 flex items-center justify-center shadow-md">
                    <div className="w-full h-full bg-[#1A1633] rounded-[14px] flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-[#A38BFF]" />
                    </div>
                  </div>
                  <h4 className="text-base font-extrabold text-white mb-1">
                    Hire Talent (Client / Buyer)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Post projects, hire verified talent, and manage deliverables securely under Talentio Escrow protection.
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A38BFF]">
                    <span>Includes: Job Postings, Milestone Escrow, Team Invoicing</span>
                  </div>
                  {userType === 'client' && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#6E5BFF] flex items-center justify-center text-white text-xs font-bold shadow-md">
                      ✓
                    </div>
                  )}
                </button>

                {/* Option B: Seller / Freelancer */}
                <button
                  type="button"
                  onClick={() => setUserType('freelancer')}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden backdrop-blur-md ${
                    userType === 'freelancer' || userType === 'agency'
                      ? 'bg-gradient-to-br from-[#3D2FD1]/40 via-[#6E5BFF]/20 to-transparent border-[#A38BFF] ring-2 ring-[#6E5BFF]/50 shadow-xl shadow-[#3D2FD1]/30'
                      : 'bg-white/10 border-[#A38BFF]/30 hover:border-[#A38BFF] hover:bg-white/15'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6E5BFF] to-[#A38BFF] p-0.5 mb-3 flex items-center justify-center shadow-md">
                    <div className="w-full h-full bg-[#1A1633] rounded-[14px] flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="text-base font-extrabold text-white mb-1">
                    Offer Services (Freelancer / Provider)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Offer services, apply to high-paying client contracts, and receive guaranteed on-time milestone payouts.
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A38BFF]">
                    <span>Includes: Service Catalog, Bid Engine, Payout Rails</span>
                  </div>
                  {(userType === 'freelancer' || userType === 'agency') && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#6E5BFF] flex items-center justify-center text-white text-xs font-bold shadow-md">
                      ✓
                    </div>
                  )}
                </button>
              </div>

              {/* Provider Classification (If Freelancer/Provider) */}
              {(userType === 'freelancer' || userType === 'agency') && (
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Provider Classification
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'individual', label: 'Individual', icon: User },
                      { id: 'agency', label: 'Agency', icon: Building2 },
                      { id: 'team', label: 'Team', icon: Users },
                      { id: 'company', label: 'Company', icon: Layers },
                      { id: 'studio', label: 'Studio', icon: Sparkles }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = providerType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setProviderType(item.id as ProviderType);
                            if (item.id === 'agency' || item.id === 'company') {
                              setUserType('agency');
                            } else {
                              setUserType('freelancer');
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 backdrop-blur-md ${
                            isSelected
                              ? 'bg-[#3D2FD1] text-white border-[#A38BFF] shadow-md ring-1 ring-[#A38BFF]'
                              : 'bg-white/10 border-[#A38BFF]/25 text-slate-300 hover:text-white hover:border-[#A38BFF]/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3 (Freelancer): Professional Category */}
          {/* ========================================================================= */}
          {step === 3 && userType !== 'client' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-extrabold text-white">Select Your Primary Category</h4>
                  <p className="text-xs text-slate-300">Choose from 19 specialized global service categories</p>
                </div>

                {/* Category Search Input */}
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search category..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>
              </div>

              {/* 19 Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredCategories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.iconName] || Briefcase;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategories(cat.subcategories.slice(0, 2));
                        setSelectedSkills(cat.skills.slice(0, 5));
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#3D2FD1] to-[#6E5BFF] text-white border-[#A38BFF] shadow-lg shadow-[#3D2FD1]/30 ring-2 ring-[#A38BFF]/40'
                          : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </div>

                      <div>
                        <div className="text-xs font-extrabold leading-tight text-white">{cat.name}</div>
                        <div className="text-[11px] opacity-75 leading-tight">{cat.nameBn}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3 (Client): Business & Organization Info */}
          {/* ========================================================================= */}
          {step === 3 && userType === 'client' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-sm text-slate-300 font-medium">
                Provide details about your business or hiring entity.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Software Ltd"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Fintech, eCommerce, AI"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-[#6E5BFF]"
                  >
                    <option value="1-10 employees" className="bg-[#1A1633] text-white">1-10 employees (Startup)</option>
                    <option value="11-50 employees" className="bg-[#1A1633] text-white">11-50 employees (Growing)</option>
                    <option value="51-200 employees" className="bg-[#1A1633] text-white">51-200 employees (Mid-market)</option>
                    <option value="200+ employees" className="bg-[#1A1633] text-white">200+ employees (Enterprise)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4 (Freelancer): Subcategories & Top Skills */}
          {/* ========================================================================= */}
          {step === 4 && userType !== 'client' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Subcategories */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A38BFF] mb-2">
                  Subcategories in {currentCategoryData.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentCategoryData.subcategories.map((sub) => {
                    const isSelected = selectedSubcategories.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubcategory(sub)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#3D2FD1] text-white shadow-sm ring-1 ring-[#A38BFF]'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 opacity-60" />}
                        <span>{sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A38BFF] mb-2">
                  Selected Skills & Core Competencies
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentCategoryData.skills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#6E5BFF] to-[#A38BFF] text-white shadow-md'
                            : 'bg-white/10 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    placeholder="Add custom skill or tool..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold cursor-pointer"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4 (Client): Project Requirements */}
          {/* ========================================================================= */}
          {step === 4 && userType === 'client' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  What types of talent will you be hiring?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROFESSIONAL_CATEGORIES.slice(0, 8).map(cat => {
                    const isSelected = preferredCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setPreferredCategories(
                            isSelected ? preferredCategories.filter(c => c !== cat.id) : [...preferredCategories, cat.id]
                          );
                        }}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-[#3D2FD1] text-white border-[#A38BFF]' 
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Typical Project Budget Range
                </label>
                <select
                  value={typicalBudgetRange}
                  onChange={(e) => setTypicalBudgetRange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:border-[#6E5BFF]"
                >
                  <option value="$250 - $1,000" className="bg-[#1A1633] text-white">$250 - $1,000 (Small Projects)</option>
                  <option value="$1,000 - $5,000" className="bg-[#1A1633] text-white">$1,000 - $5,000 (Mid-tier Milestones)</option>
                  <option value="$5,000 - $20,000" className="bg-[#1A1633] text-white">$5,000 - $20,000 (Complex Deliverables)</option>
                  <option value="$20,000+" className="bg-[#1A1633] text-white">$20,000+ (Enterprise Scope)</option>
                </select>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5 (Freelancer): Rates, Bio & Experience */}
          {/* ========================================================================= */}
          {step === 5 && userType !== 'client' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Full Stack Architect & Next.js Specialist"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-[#6E5BFF]"
                  >
                    <option value="beginner" className="bg-[#1A1633]">Entry Level (1-2 yrs)</option>
                    <option value="intermediate" className="bg-[#1A1633]">Intermediate (3-5 yrs)</option>
                    <option value="expert" className="bg-[#1A1633]">Expert / Senior (5+ yrs)</option>
                    <option value="lead" className="bg-[#1A1633]">Lead / Principal Architect</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Hourly Rate ($ USD)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-mono font-bold focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Min Gig Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min={50}
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-mono font-bold focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Professional Bio & Capabilities
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your capabilities, notable clients, and technical strengths..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Current Availability
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'available', label: '🟢 Available Now' },
                    { id: 'part_time', label: '🟡 Part-time (<20h)' },
                    { id: 'busy', label: '🔴 Booked for 2 wks' }
                  ].map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvailability(av.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        availability === av.id
                          ? 'bg-[#3D2FD1] text-white border-[#A38BFF]'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      {av.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5 (Client): Billing & Overview */}
          {/* ========================================================================= */}
          {step === 5 && userType === 'client' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-1">Escrow Buyer Protection Active</h4>
                <p className="text-xs text-slate-300">All payments to freelancers are held securely in Talentio Escrow until you review and approve deliverables.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Client Bio / About Your Organization
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell talent about your company mission and project expectations..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#6E5BFF] resize-none"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: Review & Launch Profile */}
          {/* ========================================================================= */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#3D2FD1]/30 via-white/5 to-transparent border border-[#6E5BFF]/40 shadow-xl">
                <div className="flex items-start gap-4">
                  <img
                    src={avatar}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#6E5BFF] shadow-lg shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-white">{name}</h4>
                      <span className="text-xs">{countryFlag}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#6E5BFF]/30 border border-[#A38BFF]/40 text-[#A38BFF] text-[10px] font-bold uppercase">
                        {userType === 'client' ? 'Verified Buyer' : providerType}
                      </span>
                    </div>
                    <p className="text-xs text-[#A38BFF] font-medium mt-0.5">
                      {userType === 'client' ? companyName : title}
                    </p>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {bio}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Role</span>
                    <strong className="text-white capitalize">{userType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                    <strong className="text-white">{location}</strong>
                  </div>
                  {userType !== 'client' ? (
                    <>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Rate</span>
                        <strong className="text-white font-mono">${hourlyRate}/hr</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Starting Price</span>
                        <strong className="text-white font-mono">${startingPrice}</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Industry</span>
                        <strong className="text-white">{industry}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Budget Tier</span>
                        <strong className="text-white">{typicalBudgetRange}</strong>
                      </div>
                    </>
                  )}
                </div>

                {userType !== 'client' && selectedSkills.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                    {selectedSkills.slice(0, 6).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/10 text-[11px] text-slate-200 font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Escrow Guarantee Checklist */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#A38BFF]" />
                  <span>Talentio Platform Protection Status</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF]" />
                    <span>Escrow Tier 1 Activated</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6E5BFF]" />
                    <span>Real-time Chat & Invoicing Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-[#1A1633]/90 backdrop-blur-md flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#3D2FD1]/40 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>{step === totalSteps ? 'Complete & Enter Talentio' : 'Continue to Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
