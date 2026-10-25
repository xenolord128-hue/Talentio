import React, { useState, useRef, useEffect } from 'react';
import { useGuide } from '../context/GuideContext';
import { KycDocumentType } from '../types';
import { 
  ShieldCheck, 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  X, 
  Sparkles,
  HelpCircle,
  Eye,
  Info,
  Lock,
  ChevronRight,
  User,
  Calendar,
  Globe,
  PenTool,
  Check,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const KycVerificationPage: React.FC = () => {
  const { user, submitKycVerification, setActivePage, showToast } = useGuide();

  // Active step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Personal Information
  const [legalFullName, setLegalFullName] = useState(user?.kycLegalFullName || user?.fullName || user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.kycDob || '1998-05-15');
  const [countryOfResidence, setCountryOfResidence] = useState(user?.kycCountryOfResidence || user?.country || 'Bangladesh');
  const [documentIssuingCountry, setDocumentIssuingCountry] = useState(user?.kycDocumentCountry || 'Bangladesh');
  const [docType, setDocType] = useState<KycDocumentType>(user?.kycDocumentType || 'national_id');
  const [docNumber, setDocNumber] = useState(user?.kycDocumentNumber || '');

  // Step 2: Document Scans
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  // Step 3: Signature
  const [signatureMode, setSignatureMode] = useState<'upload' | 'draw'>('draw');
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // Step 4: Face Scan & Liveness
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);

  // Step 5: Review & Consent
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);

  // Submission & AI Analysis State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    autoApproved?: boolean;
    status: string;
    error?: string;
  } | null>(null);

  // Camera modal / stream state
  const [cameraTarget, setCameraTarget] = useState<'front' | 'back' | 'selfie' | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Setup canvas for drawing signature
  useEffect(() => {
    if (currentStep === 3 && signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1A1633';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [currentStep, signatureMode]);

  // Handle signature drawing
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    setHasDrawnSignature(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setSignatureImage(dataUrl);
    }
  };

  const clearCanvasSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureImage(null);
      setHasDrawnSignature(false);
    }
  };

  // Supported documents config
  const isPassport = docType === 'passport';

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'front' | 'back' | 'selfie' | 'signature') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'warning');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('File size must be under 8MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (target === 'front') setFrontImage(result);
      else if (target === 'back') setBackImage(result);
      else if (target === 'selfie') setSelfieImage(result);
      else if (target === 'signature') setSignatureImage(result);
      showToast(`${target.toUpperCase()} image attached successfully.`, 'info');
    };
    reader.readAsDataURL(file);
  };

  // Camera start
  const startCamera = async (target: 'front' | 'back' | 'selfie') => {
    try {
      setCameraTarget(target);
      const constraints: MediaStreamConstraints = {
        video: target === 'selfie' 
          ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      showToast('Camera access unavailable. You can upload an image file instead.', 'info');
      setCameraTarget(null);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !cameraTarget) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      if (cameraTarget === 'front') setFrontImage(dataUrl);
      else if (cameraTarget === 'back') setBackImage(dataUrl);
      else if (cameraTarget === 'selfie') setSelfieImage(dataUrl);
      showToast(`${cameraTarget.toUpperCase()} image captured!`, 'success');
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setCameraTarget(null);
  };

  // Step navigation validations
  const validateStep1 = () => {
    if (!legalFullName.trim()) {
      showToast('Please enter your full legal name as shown on your ID.', 'warning');
      return false;
    }
    if (!dateOfBirth) {
      showToast('Please specify your date of birth.', 'warning');
      return false;
    }
    if (!countryOfResidence) {
      showToast('Please specify your country of residence.', 'warning');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!frontImage) {
      showToast('Please capture or upload the front image of your document.', 'warning');
      return false;
    }
    if (!isPassport && !backImage) {
      showToast('Please capture or upload the back image of your document.', 'warning');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!signatureImage) {
      showToast('Please provide your handwritten signature.', 'warning');
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!selfieImage) {
      showToast('Please capture or upload your live facial portrait.', 'warning');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit complete 5-step packet
  const handleSubmitKyc = async () => {
    if (!consentAcknowledged) {
      showToast('Please review and agree to the identity declaration and consent policy.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const result = await submitKycVerification({
      documentType: docType,
      documentNumber: docNumber.trim() || undefined,
      documentCountry: documentIssuingCountry,
      documentFrontImage: frontImage!,
      documentBackImage: isPassport ? undefined : (backImage || undefined),
      selfieImage: selfieImage || undefined,
      legalFullName: legalFullName.trim(),
      dateOfBirth,
      countryOfResidence,
      documentIssuingCountry,
      signatureImage: signatureImage || undefined,
      consentAcknowledged: true
    });

    setIsSubmitting(false);
    setSubmissionResult(result);
  };

  // Current status check
  const userStatus = user?.kycStatus || 'not_started';
  const isVerified = userStatus === 'verified' || user?.verifiedBadge;
  const isPendingReview = (userStatus === 'pending' || userStatus === 'submitted' || userStatus === 'under_review') && !submissionResult;
  const isResubmitRequired = (userStatus === 'resubmission_required' || userStatus === 'action_required') && !submissionResult;
  const isDeclined = userStatus === 'rejected' && !submissionResult;

  const steps = [
    { number: 1, title: 'Personal Info', desc: 'Legal details' },
    { number: 2, title: 'Document Scan', desc: isPassport ? 'Passport info' : 'Front & Back' },
    { number: 3, title: 'Signature', desc: 'Handwritten sign' },
    { number: 4, title: 'Face & Liveness', desc: 'Live selfie' },
    { number: 5, title: 'Review & Consent', desc: 'Confirm & submit' }
  ];

  return (
    <div className="min-h-screen bg-[#1A1633] text-white py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#6E5BFF] selection:text-white pb-28">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D2FD1]/30 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#A38BFF] mb-1">
              <span className="cursor-pointer hover:underline" onClick={() => setActivePage('explore')}>Talentio</span>
              <span>/</span>
              <span className="cursor-pointer hover:underline" onClick={() => setActivePage('profile')}>Account</span>
              <span>/</span>
              <span className="text-[#F2F0FF]">KYC Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#6E5BFF]" />
              <span>Identity & KYC Verification</span>
            </h1>
            <p className="text-sm text-[#A38BFF] mt-1">
              Mandatory verification for talent & freelancers in Bangladesh. Unlocks gig publishing, project bidding, and instant escrow settlements.
            </p>
          </div>

          {/* Current Status Pill */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Status:</span>
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            ) : isPendingReview ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Under Review</span>
              </span>
            ) : isResubmitRequired ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Action Required</span>
              </span>
            ) : isDeclined ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Declined</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#3D2FD1]/30 text-[#A38BFF] border border-[#6E5BFF]/40 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Not Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* IF ALREADY VERIFIED */}
        {/* ========================================================================= */}
        {isVerified && !submissionResult && (
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">Your Identity is Officially Verified</h2>
                <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-2xl">
                  You have fulfilled all KYC regulatory requirements under Talentio Bangladesh Trust & Safety policies. Your verified seller badge is active on your profile and marketplace listings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/30 border border-emerald-500/20 text-xs">
              <div>
                <div className="text-emerald-300/70 text-[10px] uppercase font-bold">Legal Name</div>
                <div className="font-bold text-white mt-0.5">{user?.kycLegalFullName || user?.fullName || user?.name}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-[10px] uppercase font-bold">Document Type</div>
                <div className="font-bold text-white uppercase mt-0.5">{user?.kycDocumentType || 'National ID'}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-[10px] uppercase font-bold">Country</div>
                <div className="font-bold text-white mt-0.5">{user?.kycDocumentCountry || user?.country || 'Bangladesh'}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-[10px] uppercase font-bold">Trust Badge</div>
                <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Level 1 Verified</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('profile')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Return to Profile
              </button>
              <button
                onClick={() => setActivePage('services')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Browse & Manage Gigs
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* IF PENDING / UNDER REVIEW */}
        {/* ========================================================================= */}
        {isPendingReview && !submissionResult && (
          <div className="p-6 sm:p-8 rounded-3xl bg-blue-950/30 border border-blue-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Clock className="w-10 h-10 animate-spin" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">KYC Verification Under Review</h2>
                <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed max-w-2xl">
                  We have received your identity documents, handwritten signature, and live facial portrait. Our compliance desk and automated AI verification engine are actively reviewing your submission.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-blue-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Estimated Verification Duration:</span>
                <span className="font-bold text-white">5 - 20 minutes</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Notification Method:</span>
                <span className="font-bold text-white">In-App Notification & Email</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Freelancer Privilege Status:</span>
                <span className="font-bold text-amber-300">Unlocks automatically upon approval</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActivePage('profile')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Go to Profile
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* IF RESUBMISSION REQUIRED OR REJECTED */}
        {/* ========================================================================= */}
        {(isResubmitRequired || isDeclined) && !submissionResult && (
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-4 ${
            isResubmitRequired ? 'bg-amber-950/30 border-amber-500/40' : 'bg-rose-950/30 border-rose-500/40'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                isResubmitRequired ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isResubmitRequired ? <AlertTriangle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">
                  {isResubmitRequired ? 'Document Resubmission Requested' : 'Identity Verification Declined'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {user?.kycRejectionReason 
                    ? `Reason from Compliance Desk: "${user.kycRejectionReason}"` 
                    : 'Please capture clearer, high-resolution photographs of your identification document and signature.'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Please follow the 5 steps below to provide an updated submission.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* POST-SUBMISSION RESULT SCREEN */}
        {/* ========================================================================= */}
        {submissionResult && (
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 ${
            submissionResult.autoApproved 
              ? 'bg-emerald-950/40 border-emerald-500/40' 
              : 'bg-blue-950/40 border-blue-500/40'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                submissionResult.autoApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}>
                {submissionResult.autoApproved ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8 animate-spin" />}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {submissionResult.autoApproved 
                    ? '🎉 Identity Officially Verified!' 
                    : 'KYC Documents Submitted for Review'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {submissionResult.autoApproved 
                    ? 'Automated biometric inspection passed with high confidence. You can now publish gigs and submit project proposals.' 
                    : 'Your encrypted submission has been received by our compliance team. Verification takes approximately 5-20 minutes.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActivePage('profile')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white font-black text-xs sm:text-sm transition-opacity cursor-pointer shadow-md"
              >
                Go to Profile
              </button>
              {submissionResult.autoApproved && (
                <button
                  onClick={() => setActivePage('services')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm transition-colors cursor-pointer shadow-md"
                >
                  Publish First Gig
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5-STEP WORKFLOW FORM (Visible if not verified or during re-submission) */}
        {/* ========================================================================= */}
        {(!isVerified || submissionResult === null) && !isPendingReview && (
          <div className="space-y-6">
            
            {/* 5-Step Stepper Progress Bar */}
            <div className="bg-[#191432] rounded-3xl border border-white/10 p-4 sm:p-5 shadow-xl">
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {steps.map((s) => {
                  const isCurrent = currentStep === s.number;
                  const isPast = currentStep > s.number;
                  return (
                    <button
                      key={s.number}
                      type="button"
                      onClick={() => {
                        if (isPast) setCurrentStep(s.number);
                      }}
                      className={`flex flex-col items-center text-center p-2 rounded-2xl transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#3D2FD1] text-white shadow-lg shadow-[#3D2FD1]/30 ring-1 ring-[#6E5BFF]' 
                          : isPast 
                          ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' 
                          : 'bg-white/5 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                        isCurrent 
                          ? 'bg-white text-[#3D2FD1]' 
                          : isPast 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white/10 text-slate-400'
                      }`}>
                        {isPast ? <Check className="w-4 h-4" /> : s.number}
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold truncate max-w-full">{s.title}</span>
                      <span className="hidden sm:inline text-[9px] text-slate-300/70 truncate max-w-full">{s.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Card Body */}
            <div className="bg-[#191432] rounded-3xl border border-white/10 p-5 sm:p-8 shadow-xl space-y-6">
              
              {/* STEP 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-[#6E5BFF]" />
                      <span>Step 1: Legal Personal Information</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Enter your legal personal data exactly as recorded on your government-issued identity document.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Legal Full Name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300">
                        Legal Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={legalFullName}
                        onChange={(e) => setLegalFullName(e.target.value)}
                        placeholder="e.g. Mohammad Tanvir Rahman"
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]"
                      />
                      <p className="text-[11px] text-slate-400">Must match the full name on your National ID or Passport.</p>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Date of Birth <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]"
                      />
                    </div>

                    {/* Country of Residence */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Country of Residence <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={countryOfResidence}
                        onChange={(e) => setCountryOfResidence(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#191432] border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]"
                      >
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="India">India</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Other">Other Global</option>
                      </select>
                    </div>

                    {/* Document Issuing Country */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Document Issuing Country <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={documentIssuingCountry}
                        onChange={(e) => setDocumentIssuingCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#191432] border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]"
                      >
                        <option value="Bangladesh">Bangladesh (NID / Smart Card / Passport)</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="India">India</option>
                        <option value="Other">Other Country</option>
                      </select>
                    </div>

                    {/* Document Type Selection */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Identity Document Type <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as KycDocumentType)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#191432] border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]"
                      >
                        <option value="national_id">National ID (NID / Smart Card)</option>
                        <option value="passport">International Passport</option>
                        <option value="driving_license">Driver's License</option>
                        <option value="other">Other Official Government ID</option>
                      </select>
                    </div>

                    {/* Document Number */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300">
                        Document Number (Optional for Auto-OCR)
                      </label>
                      <input
                        type="text"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        placeholder="e.g. 19981234567890 or Passport Number"
                        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#6E5BFF]"
                      />
                      <p className="text-[11px] text-slate-400">If left blank, our AI OCR engine will automatically extract it from your document scan.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Identity Document Capture */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#6E5BFF]" />
                      <span>Step 2: Document Capture ({docType === 'passport' ? 'Passport Info Page' : 'Front & Back'})</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {isPassport 
                        ? 'Capture a clear photo of the identity page of your passport containing your photo, details, and MRZ code.' 
                        : 'Capture high-resolution photos of the front and back of your government identification card.'}
                    </p>
                  </div>

                  {/* Best Practices Banner */}
                  <div className="p-4 rounded-2xl bg-[#3D2FD1]/15 border border-[#6E5BFF]/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Even lighting without glare or flashlight reflections</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>All 4 document corners must be completely visible</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Sharp text focus, no finger coverage or blurring</span>
                    </div>
                  </div>

                  {/* Capture Areas Grid */}
                  <div className={`grid gap-6 ${isPassport ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                    
                    {/* Front Photo */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                          {isPassport ? 'Passport Identity Page' : 'Front Side Image'} <span className="text-rose-400">*</span>
                        </span>
                        {frontImage && (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Uploaded</span>
                          </span>
                        )}
                      </div>

                      {frontImage ? (
                        <div className="space-y-3">
                          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black/60 border border-white/20">
                            <img src={frontImage} alt="Document Front" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-center cursor-pointer transition-colors">
                              Replace File
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'front')} />
                            </label>
                            <button
                              type="button"
                              onClick={() => startCamera('front')}
                              className="px-3 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Retake</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="rounded-xl border-2 border-dashed border-white/20 aspect-[16/10] flex flex-col items-center justify-center p-4 text-center bg-black/20">
                            <Camera className="w-8 h-8 text-[#A38BFF] mb-2 opacity-70" />
                            <span className="text-xs font-bold text-slate-300">No photo selected</span>
                            <span className="text-[11px] text-slate-500 mt-1">Take photo with camera or upload file</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => startCamera('front')}
                              className="py-2.5 px-3 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Open Camera</span>
                            </button>
                            <label className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload File</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'front')} />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Back Photo (Only for non-passport) */}
                    {!isPassport && (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                            Back Side Image <span className="text-rose-400">*</span>
                          </span>
                          {backImage && (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Uploaded</span>
                            </span>
                          )}
                        </div>

                        {backImage ? (
                          <div className="space-y-3">
                            <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black/60 border border-white/20">
                              <img src={backImage} alt="Document Back" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-center cursor-pointer transition-colors">
                                Replace File
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'back')} />
                              </label>
                              <button
                                type="button"
                                onClick={() => startCamera('back')}
                                className="px-3 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Retake</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="rounded-xl border-2 border-dashed border-white/20 aspect-[16/10] flex flex-col items-center justify-center p-4 text-center bg-black/20">
                              <Camera className="w-8 h-8 text-[#A38BFF] mb-2 opacity-70" />
                              <span className="text-xs font-bold text-slate-300">No back photo selected</span>
                              <span className="text-[11px] text-slate-500 mt-1">Take photo with camera or upload file</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => startCamera('back')}
                                className="py-2.5 px-3 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Open Camera</span>
                              </button>
                              <label className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload File</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'back')} />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* STEP 3: Handwritten Signature */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-[#6E5BFF]" />
                      <span>Step 3: Handwritten Signature Verification</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Provide your handwritten signature. It will be verified against the signature on your identification document.
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex border border-white/10 rounded-2xl p-1 bg-white/5 max-w-sm">
                    <button
                      type="button"
                      onClick={() => setSignatureMode('draw')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        signatureMode === 'draw' ? 'bg-[#3D2FD1] text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Draw on Screen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('upload')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        signatureMode === 'upload' ? 'bg-[#3D2FD1] text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Paper Photo</span>
                    </button>
                  </div>

                  {signatureMode === 'draw' ? (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-white text-slate-900 shadow-inner">
                        <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center justify-between">
                          <span>Sign inside this white pad using your finger or mouse:</span>
                          <button
                            type="button"
                            onClick={clearCanvasSignature}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold underline cursor-pointer"
                          >
                            Clear Pad
                          </button>
                        </div>
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={200}
                          onPointerDown={startDrawing}
                          onPointerMove={draw}
                          onPointerUp={stopDrawing}
                          onPointerLeave={stopDrawing}
                          className="w-full h-44 bg-white border border-slate-200 rounded-xl touch-none cursor-crosshair"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {hasDrawnSignature ? 'Signature recorded. You can clear and re-sign anytime.' : 'Draw your signature steadily.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                        Sign your signature on a plain, unlined white paper with dark blue or black ink. Take a clear, well-lit photo of the paper.
                      </div>
                      {signatureImage ? (
                        <div className="space-y-3">
                          <div className="rounded-xl overflow-hidden max-w-md aspect-[3/1] bg-white border border-white/20">
                            <img src={signatureImage} alt="Uploaded Signature" className="w-full h-full object-contain p-2" />
                          </div>
                          <label className="inline-block py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer transition-colors">
                            Change Signature Photo
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'signature')} />
                          </label>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center max-w-md">
                          <Upload className="w-8 h-8 text-[#A38BFF] mb-2" />
                          <span className="text-xs font-bold text-white">Upload Photograph of Signature</span>
                          <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, WebP under 8MB</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'signature')} />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Face Scan & Liveness */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#6E5BFF]" />
                      <span>Step 4: Live Face Scan & Liveness Check</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Our biometric engine compares your live facial snapshot directly against the portrait on your identity document.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Live Oval Guide / Photo View */}
                    <div className="flex flex-col items-center justify-center">
                      {selfieImage ? (
                        <div className="space-y-3 text-center">
                          <div className="w-56 h-72 rounded-full overflow-hidden border-4 border-emerald-400 shadow-2xl bg-black/60 relative">
                            <img src={selfieImage} alt="Selfie Portrait" className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 inset-x-0 flex justify-center">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Portrait Captured</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => startCamera('selfie')}
                              className="px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Retake Face Scan</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-56 h-72 rounded-full border-2 border-dashed border-[#6E5BFF] bg-black/40 flex flex-col items-center justify-center p-4 text-center relative group">
                          <div className="w-16 h-16 rounded-full bg-[#3D2FD1]/30 flex items-center justify-center mb-3">
                            <User className="w-8 h-8 text-[#A38BFF]" />
                          </div>
                          <span className="text-xs font-bold text-white">Center your face in this oval</span>
                          <span className="text-[10px] text-slate-400 mt-1">Look straight into the camera</span>

                          <button
                            type="button"
                            onClick={() => startCamera('selfie')}
                            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Start Camera</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Guidelines List */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Liveness Instructions:</div>
                        <ul className="space-y-2 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Position your face inside the oval frame in good lighting.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Remove sunglasses, face masks, or hats.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Keep a neutral facial expression and look directly at the lens.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>Avoid strong backlighting or shadows on the face.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Fallback File Upload */}
                      <div className="text-center pt-2">
                        <span className="text-xs text-slate-400">Can't access camera? </span>
                        <label className="text-xs text-[#A38BFF] font-bold hover:underline cursor-pointer">
                          Upload portrait selfie photo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'selfie')} />
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 5: Review & Consent */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#6E5BFF]" />
                      <span>Step 5: Review Submission & Identity Declaration</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Carefully inspect your information and documents before final submission to the Talentio verification engine.
                    </p>
                  </div>

                  {/* Summary Review Grid */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Personal Details Summary:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Legal Full Name</div>
                        <div className="font-bold text-white mt-0.5">{legalFullName}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Date of Birth</div>
                        <div className="font-bold text-white mt-0.5">{dateOfBirth}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Document Type</div>
                        <div className="font-bold text-white uppercase mt-0.5">{docType.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold">Country</div>
                        <div className="font-bold text-white mt-0.5">{documentIssuingCountry}</div>
                      </div>
                    </div>

                    {/* Thumbnail gallery */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Captured Evidence Packet:</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400">Front Scan</span>
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/50 border border-white/15">
                            {frontImage && <img src={frontImage} alt="Front" className="w-full h-full object-contain" />}
                          </div>
                        </div>

                        {!isPassport && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400">Back Scan</span>
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/50 border border-white/15">
                              {backImage && <img src={backImage} alt="Back" className="w-full h-full object-contain" />}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400">Signature</span>
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-white/15 flex items-center justify-center p-2">
                            {signatureImage && <img src={signatureImage} alt="Signature" className="w-full h-full object-contain" />}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400">Face Portrait</span>
                          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/50 border border-white/15">
                            {selfieImage && <img src={selfieImage} alt="Face" className="w-full h-full object-contain" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Legal Consent Box */}
                  <div className="p-5 rounded-2xl bg-[#3D2FD1]/15 border border-[#6E5BFF]/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#A38BFF]">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Privacy & Data Protection Notice</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Talentio encrypts all identity documents and biometrics with AES-256 standard encryption. Your documents are strictly used to comply with Bangladesh regulatory policies and prevent escrow fraud. Documents are never made public or shared with clients.
                    </p>

                    <label className="flex items-start gap-3 pt-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={consentAcknowledged}
                        onChange={(e) => setConsentAcknowledged(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-[#3D2FD1] focus:ring-[#6E5BFF] border-white/20 bg-black/40"
                      />
                      <span className="text-xs text-white leading-relaxed group-hover:text-emerald-300 transition-colors">
                        I declare that the information provided is accurate and authentic. I consent to Talentio securely processing my identity document, signature, and facial biometrics solely for identity verification and anti-fraud compliance.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons (Prev / Next / Submit) */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#3D2FD1]/30"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting || !consentAcknowledged}
                    onClick={handleSubmitKyc}
                    className={`px-7 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xl ${
                      consentAcknowledged && !isSubmitting
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white shadow-emerald-500/20'
                        : 'bg-white/10 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Documents with AI...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit for Verification</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* CAMERA CAPTURE MODAL */}
      {/* ========================================================================= */}
      {cameraTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#191432] rounded-3xl border border-white/20 overflow-hidden shadow-2xl p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#A38BFF]" />
                <span>
                  {cameraTarget === 'selfie' 
                    ? 'Center Your Face in the Guide' 
                    : `Capture ${cameraTarget.toUpperCase()} Side of Document`}
                </span>
              </h4>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Viewfinder with Guidance Overlay */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Overlay guides */}
              {cameraTarget === 'selfie' ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-60 rounded-full border-2 border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-5/6 h-3/4 rounded-2xl border-2 border-emerald-400/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Snapshot</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
