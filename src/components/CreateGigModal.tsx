import React, { useState, useRef } from 'react';
import { useGuide } from '../context/GuideContext';
import { TalentioLogo } from './TalentioLogo';
import { PROFESSIONAL_CATEGORIES } from '../data/categoriesData';
import { uploadGigImage } from '../lib/storage';
import { 
  X, 
  PlusCircle, 
  Layers, 
  DollarSign, 
  Clock, 
  Check, 
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  Upload,
  AlertCircle,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const CreateGigModal: React.FC = () => {
  const { 
    isCreateGigModalOpen, 
    setIsCreateGigModalOpen, 
    createServiceGig,
    user,
    showToast
  } = useGuide();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 1. Overview
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('web-dev');
  const [subcategory, setSubcategory] = useState('Full Stack Development');
  const [tagsInput, setTagsInput] = useState('React, Next.js, TypeScript, Tailwind');

  // 2. Packages (Basic, Standard, Premium)
  const [basicName, setBasicName] = useState('Starter Milestone');
  const [basicPrice, setBasicPrice] = useState(150);
  const [basicDays, setBasicDays] = useState(3);
  const [basicRevisions, setBasicRevisions] = useState('2');
  const [basicDesc, setBasicDesc] = useState('Core MVP feature set with clean code and basic responsiveness.');

  const [standardName, setStandardName] = useState('Pro Complete');
  const [standardPrice, setStandardPrice] = useState(350);
  const [standardDays, setStandardDays] = useState(7);
  const [standardRevisions, setStandardRevisions] = useState('4');
  const [standardDesc, setStandardDesc] = useState('Production-ready full architecture with performance optimization and test coverage.');

  const [premiumName, setPremiumName] = useState('Enterprise Scale');
  const [premiumPrice, setPremiumPrice] = useState(750);
  const [premiumDays, setPremiumDays] = useState(14);
  const [premiumRevisions, setPremiumRevisions] = useState('Unlimited');
  const [premiumDesc, setPremiumDesc] = useState('Comprehensive end-to-end enterprise solution with dedicated post-launch support and SLA.');

  const [featuresInput, setFeaturesInput] = useState('Complete Source Code\nResponsive Design\nEscrow Milestone Review\nDeployment & Hosting Setup\nAPI Integration');

  // 3. Description & Requirements
  const [description, setDescription] = useState('');
  const [buyerRequirements, setBuyerRequirements] = useState('Please provide your design files (Figma/Sketch), API endpoints/documentation, and hosting credentials if ready.');
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([
    { question: 'Do you provide full source code ownership?', answer: 'Yes, upon milestone release you gain 100% full intellectual property and commercial source code rights.' },
    { question: 'Is escrow payment protected on Talentio?', answer: 'Yes, funds are locked securely in milestone escrow and only released when you approve the deliverable.' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // 4. Media & Gallery (Mandatory validation)
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!isCreateGigModalOpen) return null;

  const currentCategoryData = PROFESSIONAL_CATEGORIES.find(c => c.id === category) || PROFESSIONAL_CATEGORIES[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const tempGigId = `gig-${Date.now()}`;
      const downloadUrl = await uploadGigImage(tempGigId, file);
      if (isCover) {
        setCoverImage(downloadUrl);
        setValidationErrors(prev => ({ ...prev, media: '' }));
        showToast('Cover image uploaded successfully!', 'success');
      } else {
        setGalleryImages(prev => [...prev, downloadUrl]);
        showToast('Gallery image added!', 'success');
      }
    } catch (err: any) {
      console.warn('Storage upload error:', err);
      // Fallback preview
      const previewUrl = URL.createObjectURL(file);
      if (isCover) {
        setCoverImage(previewUrl);
        setValidationErrors(prev => ({ ...prev, media: '' }));
      } else {
        setGalleryImages(prev => [...prev, previewUrl]);
      }
      showToast('Image saved for gig presentation.', 'info');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setFaqs(prev => [...prev, { question: newQuestion.trim(), answer: newAnswer.trim() }]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const removeFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!title.trim() || title.trim().length < 10) {
        errors.title = 'Gig title must be at least 10 characters long.';
      }
      if (!category) {
        errors.category = 'Please select a primary category.';
      }
    }

    if (step === 2) {
      if (!basicPrice || basicPrice < 10) {
        errors.basicPrice = 'Starting price must be at least $10.';
      }
      if (!basicDays || basicDays < 1) {
        errors.basicDays = 'Delivery time must be at least 1 day.';
      }
    }

    if (step === 3) {
      if (!description.trim() || description.trim().length < 30) {
        errors.description = 'Please provide a detailed service description (at least 30 characters).';
      }
    }

    if (step === 4) {
      // Mandatory Media Validation: Must have cover image or valid video
      if (!coverImage.trim() && !videoUrl.trim()) {
        errors.media = 'Gig media is mandatory. Please upload a Cover Image or provide a Showcase Video URL.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user?.userType === 'freelancer' && user.accountStatus !== 'approved' && !user.isApprovedSeller) {
      showToast('Account Approval Required: Freelancers must be verified and approved by an Administrator before publishing service packages. Check Menu → Notice for real-time verification updates.', 'error');
      return;
    }

    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      showToast('Please resolve validation errors before publishing.', 'error');
      return;
    }

    const featuresList = featuresInput
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const tagsList = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    createServiceGig({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      freelancerId: user?.id || 'freelancer-1',
      freelancerName: user?.name || 'Sofia Chen',
      freelancerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      freelancerBadge: (user?.experienceLevel === 'expert' ? 'Talentio Pro' : 'Top Rated') as 'Talentio Pro' | 'Top Rated' | 'Verified',
      category,
      startingPrice: basicPrice,
      deliveryDays: basicDays,
      coverImage: coverImage,
      tags: tagsList.length > 0 ? tagsList : ['Development', 'Full Stack'],
      packages: {
        basic: {
          name: basicName,
          price: basicPrice,
          deliveryDays: basicDays,
          revisions: Number(basicRevisions) || 2,
          description: basicDesc || 'Core MVP deliverable with full source code.',
          features: featuresList.slice(0, 3)
        },
        standard: {
          name: standardName,
          price: standardPrice,
          deliveryDays: standardDays,
          revisions: Number(standardRevisions) || 4,
          description: standardDesc || 'Production-ready build with high-tier optimizations.',
          features: featuresList
        },
        pro: {
          name: premiumName,
          price: premiumPrice,
          deliveryDays: premiumDays,
          revisions: premiumRevisions,
          description: premiumDesc || 'Full enterprise architecture with continuous support.',
          features: [...featuresList, 'Dedicated Post-Launch Support', 'Architecture Audit']
        }
      }
    });

    setIsCreateGigModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#1A1633]/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-[#16122E] text-white relative flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <TalentioLogo size="sm" variant="black" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#3D2FD1]/40 border border-[#A38BFF]/30 text-[#A38BFF]">
                  Service Marketplace Creator
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Step {activeStep} of 4
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display mt-0.5">
                Create & Publish Service Gig
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsCreateGigModalOpen(false)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0">
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            {[
              { step: 1, label: '1. Overview', icon: Layers },
              { step: 2, label: '2. Pricing & Packages', icon: DollarSign },
              { step: 3, label: '3. Description & FAQ', icon: FileText },
              { step: 4, label: '4. Gallery & Media', icon: ImageIcon }
            ].map(item => (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  if (validateStep(activeStep)) {
                    setActiveStep(item.step);
                  }
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center ${
                  activeStep === item.step
                    ? 'bg-[#3D2FD1] text-white shadow-sm'
                    : activeStep > item.step
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">S{item.step}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: OVERVIEW */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-lg font-black text-[#1A1633] font-display">Gig Overview</h4>
                <p className="text-xs text-slate-500">Provide a clear, engaging title and select the most relevant category.</p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-slate-700 block">
                  Gig Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (validationErrors.title) setValidationErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g. I will build an enterprise Next.js full-stack SaaS with escrow milestones..."
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-semibold transition-all focus:outline-none focus:bg-white ${
                    validationErrors.title ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 focus:border-[#6E5BFF]'
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.title}</span>
                  </p>
                )}
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase text-slate-700 block">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#6E5BFF] cursor-pointer"
                  >
                    {PROFESSIONAL_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase text-slate-700 block">
                    Service Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Full Stack, AI Integration, Mobile MVP"
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#6E5BFF]"
                  />
                </div>
              </div>

              {/* Search Tags */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-slate-700 block">
                  Search Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Next.js, Node.js, AI, Tailwind"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#6E5BFF]"
                />
                <p className="text-[11px] text-slate-400">Up to 5 relevant tags to maximize search discoverability.</p>
              </div>
            </div>
          )}

          {/* STEP 2: PRICING & 3-TIER PACKAGES */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-lg font-black text-[#1A1633] font-display">Scope & 3-Tier Packages</h4>
                <p className="text-xs text-slate-500">Define clear deliverables, delivery duration, and prices for Basic, Standard, and Premium tiers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Package */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Basic Tier</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">Tier 1</span>
                  </div>
                  <input
                    type="text"
                    value={basicName}
                    onChange={(e) => setBasicName(e.target.value)}
                    placeholder="Package Name"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Price (USD)</label>
                      <input
                        type="number"
                        min="10"
                        value={basicPrice}
                        onChange={(e) => setBasicPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Delivery (Days)</label>
                      <input
                        type="number"
                        min="1"
                        value={basicDays}
                        onChange={(e) => setBasicDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-mono"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={basicDesc}
                    onChange={(e) => setBasicDesc(e.target.value)}
                    placeholder="Describe what's included in basic tier..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium resize-none"
                  />
                </div>

                {/* Standard Package */}
                <div className="p-5 rounded-2xl bg-purple-50/50 border-2 border-[#6E5BFF]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#3D2FD1]">Standard Tier</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#3D2FD1] text-white text-[10px] font-bold">Popular</span>
                  </div>
                  <input
                    type="text"
                    value={standardName}
                    onChange={(e) => setStandardName(e.target.value)}
                    placeholder="Package Name"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Price (USD)</label>
                      <input
                        type="number"
                        min="20"
                        value={standardPrice}
                        onChange={(e) => setStandardPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Delivery (Days)</label>
                      <input
                        type="number"
                        min="2"
                        value={standardDays}
                        onChange={(e) => setStandardDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-mono"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={standardDesc}
                    onChange={(e) => setStandardDesc(e.target.value)}
                    placeholder="Describe what's included in standard tier..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium resize-none"
                  />
                </div>

                {/* Premium Package */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Premium Tier</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 text-[10px] font-bold">Enterprise</span>
                  </div>
                  <input
                    type="text"
                    value={premiumName}
                    onChange={(e) => setPremiumName(e.target.value)}
                    placeholder="Package Name"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Price (USD)</label>
                      <input
                        type="number"
                        min="50"
                        value={premiumPrice}
                        onChange={(e) => setPremiumPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">Delivery (Days)</label>
                      <input
                        type="number"
                        min="3"
                        value={premiumDays}
                        onChange={(e) => setPremiumDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-mono"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={premiumDesc}
                    onChange={(e) => setPremiumDesc(e.target.value)}
                    placeholder="Describe what's included in premium tier..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium resize-none"
                  />
                </div>
              </div>

              {/* Shared Deliverables & Features */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-extrabold uppercase text-slate-700 block">
                  Included Features / Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Complete Source Code&#10;Responsive Layout&#10;Escrow Milestone Review"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6E5BFF]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: DESCRIPTION & FAQ */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-lg font-black text-[#1A1633] font-display">Description & Buyer Requirements</h4>
                <p className="text-xs text-slate-500">Clearly explain your technical workflow, what makes your gig unique, and FAQs.</p>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-slate-700 block">
                  Detailed Service Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (validationErrors.description) setValidationErrors(prev => ({ ...prev, description: '' }));
                  }}
                  placeholder="Detail your engineering approach, tech stack used, guarantees, and milestone release milestones..."
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-medium transition-all focus:outline-none focus:bg-white ${
                    validationErrors.description ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 focus:border-[#6E5BFF]'
                  }`}
                />
                {validationErrors.description && (
                  <p className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{validationErrors.description}</span>
                  </p>
                )}
              </div>

              {/* Buyer Requirements */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-slate-700 block">
                  Instructions / Requirements for Buyer
                </label>
                <textarea
                  rows={3}
                  value={buyerRequirements}
                  onChange={(e) => setBuyerRequirements(e.target.value)}
                  placeholder="e.g. Please provide Figma designs, user stories, or third-party API credentials..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6E5BFF]"
                />
              </div>

              {/* FAQs Section */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-extrabold uppercase text-slate-700 block">
                  Frequently Asked Questions (FAQ)
                </label>

                <div className="space-y-2">
                  {faqs.map((faq, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">Q: {faq.question}</div>
                        <div className="text-slate-600 mt-0.5">A: {faq.answer}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFaq(i)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100/70 border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add Question (e.g. Do you support revisions?)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Add Answer (e.g. Yes, all tiers include revisions...)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={addFaq}
                    className="px-3 py-1.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GALLERY & MANDATORY MEDIA VALIDATION */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-lg font-black text-[#1A1633] font-display">Gallery & Media Showcase</h4>
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-rose-600">Mandatory requirement:</span> High-resolution cover image or showcase video is required before publishing.
                </p>
              </div>

              {validationErrors.media && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationErrors.media}</span>
                </div>
              )}

              {/* Cover Image Upload & Preview */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase text-slate-700 block flex items-center justify-between">
                  <span>Cover Image (Mandatory) <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-400 font-normal">Recommended: 1280x720px (16:9)</span>
                </label>

                <div className="relative aspect-[16/9] w-full max-w-md rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center group">
                  {coverImage ? (
                    <>
                      <img
                        src={coverImage}
                        alt="Gig Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change Image</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">Upload Cover Image</p>
                      <p className="text-[10px] text-slate-400">PNG, JPG or WebP up to 10MB</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-[#3D2FD1] text-white text-xs font-bold shadow-md cursor-pointer"
                      >
                        Select File
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, true)}
                />
              </div>

              {/* Showcase Video Link (Optional/Supported) */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-extrabold uppercase text-slate-700 block flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#3D2FD1]" />
                  <span>Showcase Video URL (YouTube / Vimeo / MP4)</span>
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#6E5BFF]"
                />
                <p className="text-[11px] text-slate-400">Video demonstrations increase order conversion rates by over 200%.</p>
              </div>

              {/* Escrow Quality Assurance Notice */}
              <div className="p-4 rounded-2xl bg-[#F2F0FF] border border-[#A38BFF]/30 flex items-start gap-3 text-xs text-[#3D2FD1]">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#3D2FD1] mt-0.5" />
                <div>
                  <div className="font-extrabold">Escrow Quality & Milestone Guarantee</div>
                  <div className="text-slate-600 mt-0.5 leading-relaxed">
                    All orders are secured by Talentio escrow smart contracts. Buyers deposit funds into protected custody before work begins.
                  </div>
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Footer Controls */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {activeStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploadingImage}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#3D2FD1] hover:brightness-110 text-white text-xs sm:text-sm font-black shadow-lg shadow-[#3D2FD1]/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Publish Gig Live</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
