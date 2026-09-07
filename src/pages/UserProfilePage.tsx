import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { formatPrice } from '../utils/currency';
import { EditProfileModal } from '../components/EditProfileModal';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Star, 
  CheckCircle2, 
  Edit3, 
  Share2, 
  Plus, 
  Briefcase, 
  Wallet, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Clock, 
  Check, 
  Lock, 
  Copy,
  ChevronRight,
  Camera,
  Flame,
  MessageSquare
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { 
    user, 
    currency, 
    services, 
    postedJobs, 
    setActivePage, 
    setIsCreateGigModalOpen, 
    setIsPostJobModalOpen, 
    setSelectedService, 
    setIsServiceDetailModalOpen,
    showToast 
  } = useGuide();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gigs' | 'escrow' | 'about' | 'reviews'>('gigs');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Fallback defaults
  const displayName = user?.name || 'Alexander Vance';
  const fullName = user?.fullName || user?.name || 'Alexander Vance';
  const handle = user?.handle 
    ? (user.handle.startsWith('@') ? user.handle : `@${user.handle}`) 
    : '@alexander_v';
  const title = user?.title || (user?.userType === 'freelancer' ? 'Full-Stack Software Architect & Escrow Specialist' : 'VP of Engineering & Product Lead');
  const bio = user?.bio || (user?.userType === 'freelancer' 
    ? 'Passionate full-stack developer and cloud architect specializing in React, Node.js, and secure fintech escrow solutions. 100% on-time delivery guaranteed.' 
    : 'Building high-performance teams, enterprise platforms, and digital products. Managing secure milestone escrow projects across fintech and AI.');
  const email = user?.email || 'alexander@enterprise.com';
  const phone = user?.phone || '+1 (555) 234-5678';
  const location = user?.location || 'San Francisco, USA';
  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
  const coverImage = user?.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
  const skills = user?.skills && user.skills.length > 0 
    ? user.skills 
    : ['React', 'TypeScript', 'Escrow Management', 'UI/UX', 'Cloud Architecture', 'Node.js'];

  // User's gigs / services
  const userGigs = services.filter(s => 
    s.sellerId === user?.id || 
    s.sellerName?.toLowerCase() === displayName.toLowerCase() ||
    (user?.userType === 'freelancer' && s.category === 'web-dev')
  );

  // Copy Profile Link
  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Profile link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Profile URL ready to share', 'info');
    });
  };

  // Copy Email
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(true);
      showToast('Email address copied to clipboard!', 'info');
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  // Copy Phone
  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedPhone(true);
      showToast('Phone number copied to clipboard!', 'info');
      setTimeout(() => setCopiedPhone(false), 2000);
    });
  };

  // Open Service details
  const handleViewService = (service: any) => {
    setSelectedService(service);
    setIsServiceDetailModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-24">
      
      {/* 1. SOCIAL-MEDIA-STYLE PROFILE HEADER */}
      <div className="bg-[#191432] dark:bg-[#15112B] rounded-3xl border border-white/10 shadow-xl overflow-hidden">
        
        {/* Cover Banner */}
        <div className="relative h-44 sm:h-64 md:h-72 w-full overflow-hidden bg-slate-900 group">
          <img
            src={coverImage}
            alt="Profile Cover Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
            }}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#191432] via-black/30 to-black/20" />
          
          {/* Edit Cover Action Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Update Cover Banner"
          >
            <Camera className="w-3.5 h-3.5 text-slate-200" />
            <span className="hidden sm:inline">Edit Banner</span>
          </button>
        </div>

        {/* Profile Info Bar (Avatar + Details + Actions) */}
        <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20 md:-mt-24 mb-6">
            
            {/* Avatar & Online status */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
              <div className="relative shrink-0 group">
                <img
                  src={avatar}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl object-cover ring-4 ring-[#191432] shadow-2xl bg-[#120F24]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                  }}
                />
                {/* Active status indicator */}
                <div 
                  className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-[#191432] shadow-sm flex items-center justify-center"
                  title="Online & Verified"
                >
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                {/* Quick avatar edit overlay button */}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title="Change Profile Picture"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              {/* Names, Title, Badges */}
              <div className="space-y-1.5 pt-2 sm:pt-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {displayName}
                  </h1>
                  
                  {/* Verified Shield Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>

                  {/* Role Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#3D2FD1] text-white border border-[#A38BFF]/30 shadow-sm">
                    {user?.role === 'admin' ? 'Super Admin' : user?.userType || 'Client'}
                  </span>
                </div>

                {/* Full name and handle */}
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="font-semibold text-white">{fullName}</span>
                  <span className="text-slate-400 font-mono">{handle}</span>
                </div>

                {/* Professional Title */}
                <p className="text-xs sm:text-sm text-[#A38BFF] font-medium">
                  {title}
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center justify-center sm:justify-end gap-2.5 pt-3 md:pt-0 shrink-0">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#3D2FD1]/30 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={handleShareProfile}
                className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {user?.userType === 'freelancer' ? (
                <button
                  onClick={() => setIsCreateGigModalOpen(true)}
                  className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Gig</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="px-3.5 sm:px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Post Job</span>
                </button>
              )}
            </div>

          </div>

          {/* Bio Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 mb-5">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
              {bio}
            </p>
          </div>

          {/* Contact Details & Metadata Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
            
            {/* Email Chip */}
            <div 
              onClick={handleCopyEmail}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-2 text-xs text-slate-200 transition-colors cursor-pointer group"
              title="Click to copy email address"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Mail className="w-4 h-4 text-[#A38BFF] shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
              )}
            </div>

            {/* Phone Chip */}
            <div 
              onClick={handleCopyPhone}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-2 text-xs text-slate-200 transition-colors cursor-pointer group"
              title="Click to copy phone number"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{phone}</span>
              </div>
              {copiedPhone ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
              )}
            </div>

            {/* Location Chip */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            {/* Joined Date Chip */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-200">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Member since Oct 2023</span>
            </div>

          </div>

        </div>

      </div>

      {/* 2. SOCIAL MEDIA STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-4 sm:p-5 rounded-3xl bg-[#191432] border border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#3D2FD1]/30 border border-[#A38BFF]/30 flex items-center justify-center text-[#A38BFF] shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">{userGigs.length || 3}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Services Listed</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#191432] border border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">100%</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Escrow Release</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#191432] border border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">5.0 ★</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Feedback Score</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#191432] border border-white/10 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#6E5BFF]/20 border border-[#6E5BFF]/30 flex items-center justify-center text-[#A38BFF] shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">Tier 1</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Escrow</div>
          </div>
        </div>

      </div>

      {/* 3. SOCIAL-MEDIA-STYLE TABBED CONTENT TABS */}
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#16122E] rounded-2xl p-1 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gigs'
                ? 'bg-[#3D2FD1] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Gigs & Services ({userGigs.length || 3})</span>
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'escrow'
                ? 'bg-[#3D2FD1] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Escrow & Contracts</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-[#3D2FD1] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>About & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#3D2FD1] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews & Feedback</span>
          </button>
        </div>

        {/* TAB 1: GIGS & SERVICES */}
        {activeTab === 'gigs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Published Services & Gigs</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                  {userGigs.length || 3} Active
                </span>
              </h3>

              <button
                onClick={() => setIsCreateGigModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish New Gig</span>
              </button>
            </div>

            {/* Gigs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(userGigs.length > 0 ? userGigs : services.slice(0, 3)).map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleViewService(service)}
                  className="rounded-3xl bg-[#191432] border border-white/10 hover:border-[#6E5BFF] overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={service.thumbnail}
                      alt={service.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/10">
                      {service.category}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#3D2FD1] text-white text-xs font-black shadow">
                      From {formatPrice(service.price, currency)}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <h4 className="text-sm font-extrabold text-white group-hover:text-[#A38BFF] transition-colors line-clamp-2 leading-snug">
                      {service.title}
                    </h4>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-white">{service.rating}</span>
                        <span className="text-slate-400">({service.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.deliveryDays || 3} days delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Gig Card */}
              <div
                onClick={() => setIsCreateGigModalOpen(true)}
                className="rounded-3xl border-2 border-dashed border-white/15 hover:border-[#6E5BFF] p-6 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer bg-white/5 hover:bg-white/10 min-h-[260px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#3D2FD1]/30 border border-[#A38BFF]/30 flex items-center justify-center text-[#A38BFF]">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Create Another Service Gig</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">Offer custom deliverables protected by automated milestone escrow.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ESCROW & CONTRACTS */}
        {activeTab === 'escrow' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vault Balance Card */}
            <div className="lg:col-span-1 rounded-3xl bg-[#191432] border border-white/10 p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#3D2FD1]/30 border border-[#A38BFF]/30 flex items-center justify-center text-[#A38BFF]">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Protected
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Escrow Vault Balance
                </span>
                <div className="text-3xl font-black text-white">
                  {formatPrice(user?.escrowBalance || 8450, currency)}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Locked in Milestones</span>
                  <span className="font-bold text-white">{formatPrice(3800, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available to Withdraw</span>
                  <span className="font-bold text-emerald-400">{formatPrice(4650, currency)}</span>
                </div>
              </div>

              <button
                onClick={() => setActivePage('orders')}
                className="w-full py-3 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>View Escrow Workstation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Active Milestone Workstation Overview */}
            <div className="lg:col-span-2 rounded-3xl bg-[#191432] border border-white/10 p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Active Milestone Deliverables</span>
                </h4>
                <button
                  onClick={() => setActivePage('workstation')}
                  className="text-xs font-bold text-[#A38BFF] hover:underline cursor-pointer"
                >
                  Open Workstation →
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">Milestone 1: Architecture & UI Prototype</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        Approved & Released
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Figma design system and high-fidelity clickable prototype.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-white">{formatPrice(1200, currency)}</div>
                    <span className="text-[10px] text-emerald-400">Paid out</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">Milestone 2: Frontend Implementation</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        In Escrow Review
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Production TypeScript React code connected to backend API.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-white">{formatPrice(2600, currency)}</div>
                    <span className="text-[10px] text-amber-400">Funds locked</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ABOUT & CREDENTIALS */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skills & Specialties */}
            <div className="p-6 rounded-3xl bg-[#191432] border border-white/10 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#A38BFF]" />
                  <span>Verified Skills & Specialties</span>
                </h4>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-[#A38BFF] font-bold hover:underline cursor-pointer"
                >
                  Edit Skills
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl bg-[#3D2FD1]/25 text-white font-bold text-xs border border-[#A38BFF]/30 shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Languages Spoken
                </span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-slate-200 border border-white/10">English (Native)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-slate-200 border border-white/10">Bengali (Fluent)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-slate-200 border border-white/10">Spanish (Conversational)</span>
                </div>
              </div>
            </div>

            {/* Account Security & Verification Checklist */}
            <div className="p-6 rounded-3xl bg-[#191432] border border-white/10 space-y-4 shadow-lg">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Account Trust & Security</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">Government ID & KYC Status</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Passed (Tier 1)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">Email Address Verified</span>
                  </div>
                  <span className="text-slate-300 font-mono text-[11px]">{email}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">Phone SMS Verified</span>
                  </div>
                  <span className="text-slate-300 font-mono text-[11px]">{phone}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#A38BFF]" />
                    <span className="font-semibold text-white">Authentication Protocol</span>
                  </div>
                  <span className="text-slate-300 font-mono text-[11px] uppercase">
                    {user?.authMethod || 'Enterprise OAuth'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: REVIEWS & FEEDBACK */}
        {activeTab === 'reviews' && (
          <div className="p-6 rounded-3xl bg-[#191432] border border-white/10 space-y-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h4 className="text-base font-black text-white">Verified Client Endorsements</h4>
                <p className="text-xs text-slate-400">All reviews are locked to completed escrow milestones.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
                  <span>5.0</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xs text-slate-400">
                  <span>100% Recommended</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt="Reviewer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Marcus Vance</div>
                      <div className="text-[10px] text-slate-400">CTO at HyperFintech • Oct 14, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "Outstanding delivery and deep escrow milestone expertise. Built our application architecture with zero delays and pristine code quality."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                      alt="Reviewer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">Elena Rostova</div>
                      <div className="text-[10px] text-slate-400">Managing Partner at NovaVentures • Sep 28, 2024</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "True professional. Handled our project with complete transparency, and all milestones were released ahead of schedule."
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 4. EDIT PROFILE MODAL */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />

    </div>
  );
};
