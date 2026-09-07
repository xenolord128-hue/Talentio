import React, { useState, useEffect, useRef } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  Sparkles, 
  Camera, 
  Check, 
  AlertCircle, 
  Upload, 
  Image as ImageIcon,
  Briefcase,
  Plus,
  Trash2
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80', // Deep Violet Fluid
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80', // Gradient Sunset
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80', // Neon Cyber
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80', // Starry Mountains
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', // Earth Tech Network
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'  // Digital Matrix
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, allUsers, updateUserProfile, showToast } = useGuide();
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Active Tab inside Edit Modal for clean organization
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'skills'>('general');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setFullName(user.fullName || user.name || '');
      setHandle(user.handle ? (user.handle.startsWith('@') ? user.handle : `@${user.handle}`) : '@user');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setTitle(user.title || '');
      setBio(user.bio || '');
      setLocation(user.location || '');
      setAvatar(user.avatar || PRESET_AVATARS[0]);
      setCoverImage(user.coverImage || PRESET_COVERS[0]);
      setSkills(user.skills || []);
      setErrors({});
      setActiveTab('general');
    }
  }, [isOpen, user]);

  // Handle ESC key & Outside Click
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Profile display name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Username / Handle validation
    const rawHandle = handle.trim().replace(/^@+/, '');
    if (!rawHandle) {
      newErrors.handle = 'Username is required.';
    } else if (rawHandle.length < 3) {
      newErrors.handle = 'Username must be at least 3 characters.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(rawHandle)) {
      newErrors.handle = 'Username can only contain letters, numbers, and underscores.';
    } else {
      // Check uniqueness against other users
      const formattedHandle = `@${rawHandle.toLowerCase()}`;
      const conflict = allUsers?.some(
        u => u.id !== user.id && (u.handle || '').toLowerCase() === formattedHandle
      );
      if (conflict) {
        newErrors.handle = 'This username is already taken. Please choose another.';
      }
    }

    // Email validation
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    // Phone validation
    if (phone.trim()) {
      const phoneDigits = phone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 6) {
        newErrors.phone = 'Please enter a valid contact phone number.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the errors before saving.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const cleanHandle = handle.trim().startsWith('@') 
        ? handle.trim().toLowerCase() 
        : `@${handle.trim().toLowerCase()}`;

      await updateUserProfile({
        name: name.trim(),
        fullName: fullName.trim() || name.trim(),
        handle: cleanHandle,
        email: email.trim(),
        phone: phone.trim(),
        title: title.trim(),
        bio: bio.trim(),
        location: location.trim(),
        avatar: avatar.trim(),
        coverImage: coverImage.trim(),
        skills: skills
      });

      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('Failed to save profile changes. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar file upload handler
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('Avatar image loaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Cover image file upload handler
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file for the banner.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
        showToast('Cover banner loaded successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Skills handlers
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-[#130F26] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#191432] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3D2FD1]/30 border border-[#A38BFF]/30 flex items-center justify-center text-[#A38BFF]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">Edit Your Profile</h2>
              <p className="text-xs text-slate-400">Update your identity, credentials, and social appearance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#16122E] px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-[#6E5BFF] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Basic Info</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'media'
                ? 'border-[#6E5BFF] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Avatar & Banner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'border-[#6E5BFF] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Skills & Bio</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              
              {/* Profile Name & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Display Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      placeholder="e.g. Alexander Vance"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all ${
                        errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alexander Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all"
                  />
                  <span className="text-[10px] text-slate-400">Used for verified contracts and payouts</span>
                </div>
              </div>

              {/* Username & Professional Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Username / Handle <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 select-none">@</span>
                    <input
                      type="text"
                      value={handle.replace(/^@+/, '')}
                      onChange={(e) => {
                        const sanitized = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                        setHandle(`@${sanitized}`);
                        if (errors.handle) setErrors(prev => ({ ...prev, handle: '' }));
                      }}
                      placeholder="alexander_v"
                      className={`w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all font-mono ${
                        errors.handle ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.handle ? (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.handle}</span>
                    </p>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Your unique profile URL identifier</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Professional Title / Tagline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Architect & Escrow Lead"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all"
                  />
                  <span className="text-[10px] text-slate-400">Displayed prominently on your profile header</span>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="alexander@enterprise.com"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all ${
                        errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      placeholder="+1 (555) 234-5678"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all ${
                        errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Location / City, Country
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, California, USA"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MEDIA (AVATAR & BANNER) */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              
              {/* Profile Avatar Section */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#A38BFF]" />
                    Profile Picture / Avatar
                  </span>
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#6E5BFF] shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_AVATARS[0];
                      }}
                    />
                    <div 
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                      Direct Avatar URL
                    </label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#6E5BFF]"
                    />
                  </div>
                </div>

                {/* Preset Avatar Selection */}
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                    Or select from preset avatar library:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-transform hover:scale-105 cursor-pointer ${
                          avatar === preset ? 'border-[#6E5BFF] ring-2 ring-[#6E5BFF]' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={preset} 
                          alt={`Preset avatar ${idx + 1}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        {avatar === preset && (
                          <div className="absolute inset-0 bg-[#3D2FD1]/50 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Banner Section */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    Cover Banner Background
                  </span>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Banner</span>
                  </button>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Banner Live Preview */}
                <div className="relative h-28 rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src={coverImage}
                    alt="Cover Banner Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_COVERS[0];
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                    <span className="text-[10px] text-white/80 font-semibold">Live Banner Preview</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                    Custom Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                {/* Preset Banner Selection */}
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                    Preset atmospheric themes:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_COVERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(preset)}
                        className={`relative rounded-xl overflow-hidden h-14 border-2 transition-transform hover:scale-105 cursor-pointer ${
                          coverImage === preset ? 'border-emerald-400 ring-2 ring-emerald-400' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={preset} 
                          alt={`Preset cover ${idx + 1}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        {coverImage === preset && (
                          <div className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SKILLS & BIO */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              
              {/* Bio / About */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#A38BFF]" />
                    <span>Bio / About You</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {bio.length}/500 chars
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 500))}
                  rows={4}
                  placeholder="Introduce yourself, your professional background, milestones achieved, and what projects you specialize in..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#6E5BFF] transition-all resize-none"
                />
                <span className="text-[10px] text-slate-400">This bio will be shown at the top of your social profile page.</span>
              </div>

              {/* Skills & Expertise */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Skills & Expertise Tags
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. Escrow Management, Next.js, Smart Contracts..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-white/5 border border-white/10">
                  {skills.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No skills added yet. Type a skill above and click Add.</span>
                  ) : (
                    skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#3D2FD1]/30 text-white border border-[#A38BFF]/40 shadow-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
