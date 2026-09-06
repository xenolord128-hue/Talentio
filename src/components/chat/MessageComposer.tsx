import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, MessageAttachment, VoiceNoteData } from '../../types';
import { soundEffects } from '../../utils/audioEffects';
import { useGuide } from '../../context/GuideContext';
import { 
  useSpeechRecognition, 
  SPEECH_LANGUAGES, 
  SpeechLanguage 
} from '../../hooks/useSpeechRecognition';
import { 
  requestAuthoritativeMicrophoneStream, 
  getSupportedAudioMimeType, 
  stopMediaStream, 
  formatAudioDuration,
  getMicrophoneErrorMessage,
  getVoiceNoteExpirationDate
} from '../../utils/audioRecorder';
import { 
  Smile, 
  Paperclip, 
  Mic, 
  MicOff,
  Send, 
  Image as ImageIcon, 
  FileText, 
  Briefcase, 
  X, 
  Trash2, 
  AlertTriangle, 
  Loader2,
  Sparkles,
  Languages,
  Check,
  RotateCcw,
  Radio,
  Volume2,
  ClipboardCheck
} from 'lucide-react';

interface MessageComposerProps {
  onSendMessage: (text: string, replyTo?: ChatMessage['replyTo']) => void;
  onSendVoiceNote: (voiceNote: VoiceNoteData) => void;
  onSendAttachment: (attachment: MessageAttachment) => void;
  onSendMilestoneOffer: (title: string, amount: number, deliveryDays: number) => void;
  onOpenConfirmOrderModal?: () => void;
  isFreelancerView?: boolean;
  replyingTo: ChatMessage | null;
  onCancelReply: () => void;
  editingMessage: ChatMessage | null;
  onSaveEdit: (newText: string) => void;
  onCancelEdit: () => void;
  onTyping?: (isTyping: boolean) => void;
}

type RecordingStatus = 'idle' | 'requesting' | 'recording' | 'stopping';

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  onSendVoiceNote,
  onSendAttachment,
  onSendMilestoneOffer,
  onOpenConfirmOrderModal,
  isFreelancerView = true,
  replyingTo,
  onCancelReply,
  editingMessage,
  onSaveEdit,
  onCancelEdit,
  onTyping
}) => {
  const { showToast } = useGuide();
  const [inputText, setInputText] = useState('');
  const typingTimerRef = useRef<any>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showUnifiedMenu, setShowUnifiedMenu] = useState(false);
  const unifiedMenuRef = useRef<HTMLDivElement>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [policyWarning, setPolicyWarning] = useState<string | null>(null);

  // Close unified menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (unifiedMenuRef.current && !unifiedMenuRef.current.contains(e.target as Node)) {
        setShowUnifiedMenu(false);
        setShowEmojiPicker(false);
      }
    };
    if (showUnifiedMenu || showEmojiPicker) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [showUnifiedMenu, showEmojiPicker]);

  // Authoritative Voice recording state
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const recordingStatusRef = useRef<RecordingStatus>('idle');
  const [recordDuration, setRecordDuration] = useState(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([30, 45, 60, 80, 50, 70, 40, 85, 60, 50]);
  
  // Pipeline Refs
  const recordIntervalRef = useRef<any>(null);
  const recordStartTimeRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<any>(null);
  const activeMimeTypeRef = useRef<string>('audio/webm');

  // Speech Recognition (Dictation) State
  const baseInputTextRef = useRef<string>('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const {
    isSupported: isSpeechSupported,
    isListening: isDictating,
    language: speechLang,
    setLanguage: setSpeechLang,
    finalTranscript,
    interimTranscript,
    combinedTranscript,
    startListening: startDictation,
    stopListening: stopDictation,
    resetTranscript: resetDictationTranscript
  } = useSpeechRecognition({
    initialLanguage: 'en-US',
    continuous: true,
    interimResults: true,
    onTranscriptChange: (finalText, interimText) => {
      const base = baseInputTextRef.current.trim();
      const spoken = finalText || interimText;
      const combined = base ? (spoken ? `${base} ${spoken}` : base) : spoken;
      setInputText(combined);
    },
    onError: (err) => {
      showToast(err, 'warning');
    }
  });

  // Toggle dictation mode
  const toggleDictation = useCallback(async () => {
    if (isDictating) {
      stopDictation();
      showToast('Speech dictation paused', 'info');
      textInputRef.current?.focus();
    } else {
      if (recordingStatusRef.current !== 'idle') {
        showToast('Please finish or cancel active voice recording first', 'warning');
        return;
      }

      baseInputTextRef.current = inputText;
      resetDictationTranscript();
      const success = await startDictation();
      if (success) {
        showToast('Speech recognition active. Speak now to dictate message...', 'info');
      }
    }
  }, [isDictating, stopDictation, startDictation, inputText, resetDictationTranscript, showToast]);

  // Cancel dictation and revert to base text
  const handleCancelDictation = () => {
    stopDictation();
    setInputText(baseInputTextRef.current);
    resetDictationTranscript();
    setShowLanguageMenu(false);
    showToast('Dictation discarded', 'info');
  };

  // Done dictating (keep text in input)
  const handleDoneDictation = () => {
    stopDictation();
    resetDictationTranscript();
    setShowLanguageMenu(false);
    textInputRef.current?.focus();
  };

  // Clear current dictation
  const handleClearDictation = () => {
    resetDictationTranscript();
    setInputText(baseInputTextRef.current);
    showToast('Dictation transcript cleared', 'info');
  };

  // Global Alt+D listener for speech dictation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'd' || e.key === 'D')) || 
        ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'd' || e.key === 'D'))
      ) {
        e.preventDefault();
        toggleDictation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDictation]);

  // Offer modal form
  const [offerTitle, setOfferTitle] = useState('Full-Stack SaaS MVP & Milestone Scope');
  const [offerAmount, setOfferAmount] = useState('850');
  const [offerDeliveryDays, setOfferDeliveryDays] = useState('5');

  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Sync state ref
  const setStatus = (status: RecordingStatus) => {
    recordingStatusRef.current = status;
    setRecordingStatus(status);
  };

  // Sync editing message
  useEffect(() => {
    if (editingMessage) {
      setInputText(editingMessage.text);
      textInputRef.current?.focus();
    }
  }, [editingMessage]);

  // Complete cleanup of streams, nodes, visualizers, and intervals
  const cleanupAudioPipeline = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[VoiceRecorder] Running pipeline cleanup...');
    }

    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // Ignored
      }
      sourceNodeRef.current = null;
    }

    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch {
        // Ignored
      }
      analyserRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      } catch {
        // Ignored
      }
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      stopMediaStream(mediaStreamRef.current);
      mediaStreamRef.current = null;
    }

    mediaRecorderRef.current = null;
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // If unmounting while recording, gracefully stop tracks and clean up
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // Ignored
        }
      }
      cleanupAudioPipeline();
    };
  }, [cleanupAudioPipeline]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    if (onTyping) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTyping(false);
      }, 2500);
    }

    // Escrow policy check (off-platform contact warning)
    const prohibitedRegex = /(whatsapp|telegram|email|@gmail|@yahoo|\+?[0-9]{10,}|pay outside|direct wire)/i;
    if (prohibitedRegex.test(text)) {
      setPolicyWarning('Escrow Notice: Sharing personal numbers, telegram handles, or off-platform payment info is monitored to prevent fraud.');
    } else {
      setPolicyWarning(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (onTyping) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping(false);
    }

    if (isDictating) {
      stopDictation();
      resetDictationTranscript();
      setShowLanguageMenu(false);
    }

    if (editingMessage) {
      onSaveEdit(inputText);
      setInputText('');
      return;
    }

    soundEffects.playMessageSent();
    onSendMessage(
      inputText,
      replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            text: replyingTo.text
          }
        : undefined
    );

    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    setPolicyWarning(null);
  };

  // Start real microphone voice recording with standard Web APIs
  const startRecording = async () => {
    // Prevent duplicate recording attempts / rapid taps
    if (recordingStatusRef.current !== 'idle') {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[VoiceRecorder] Ignored recording request: status is', recordingStatusRef.current);
      }
      return;
    }

    audioChunksRef.current = [];
    setStatus('requesting');
    setRecordDuration(0);

    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[VoiceRecorder] Requesting microphone stream...');
      }

      // 1. Authoritative microphone request (ONLY triggered on user mic press)
      const stream = await requestAuthoritativeMicrophoneStream();
      mediaStreamRef.current = stream;

      // 2. Setup Optional Web Audio visualizer
      // Note: NEVER connect analyser to ctx.destination to avoid feedback screeching
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          // Resume audio context if in suspended state
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }

          const source = ctx.createMediaStreamSource(stream);
          sourceNodeRef.current = source;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.8;

          // Only source -> analyser (NO connection to speakers/destination)
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateWaveform = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Sample 12 frequency bands for visualizer bars
            const sample: number[] = [];
            const step = Math.floor(dataArray.length / 12) || 1;
            for (let i = 0; i < 12; i++) {
              const val = dataArray[i * step] || 0;
              sample.push(Math.max(18, Math.min(100, Math.round((val / 255) * 100))));
            }
            setLiveWaveform(sample);
            animFrameRef.current = requestAnimationFrame(updateWaveform);
          };
          updateWaveform();
        }
      } catch (visErr) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[VoiceRecorder] Web Audio visualizer setup failed, proceeding with recording:', visErr);
        }
      }

      // 3. Detect best supported MIME type
      const supportedFormat = getSupportedAudioMimeType();
      activeMimeTypeRef.current = supportedFormat.mimeType || '';

      if (process.env.NODE_ENV !== 'production') {
        console.log('[VoiceRecorder] Preferred MIME format:', supportedFormat.mimeType || 'default');
      }

      let recorder: MediaRecorder;
      if (supportedFormat.mimeType) {
        try {
          recorder = new MediaRecorder(stream, { mimeType: supportedFormat.mimeType });
        } catch {
          // Fallback if explicit MIME creation fails on specific device
          recorder = new MediaRecorder(stream);
        }
      } else {
        recorder = new MediaRecorder(stream);
      }

      activeMimeTypeRef.current = recorder.mimeType || supportedFormat.mimeType || 'audio/webm';
      mediaRecorderRef.current = recorder;

      // 4. Bind MediaRecorder events
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          if (process.env.NODE_ENV !== 'production') {
            console.log('[VoiceRecorder] ondataavailable chunk received:', event.data.size, 'bytes. Total chunks:', audioChunksRef.current.length);
          }
        }
      };

      recorder.onerror = (errEvent: any) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[VoiceRecorder] MediaRecorder error:', errEvent);
        }
        showToast('Voice recording error occurred. Please try again.', 'error');
        cancelRecording();
      };

      // 5. Start MediaRecorder (use 100ms timeslice for responsive chunking on mobile)
      try {
        recorder.start(100);
      } catch {
        recorder.start();
      }

      recordStartTimeRef.current = performance.now();
      setStatus('recording');

      if (process.env.NODE_ENV !== 'production') {
        console.log('[VoiceRecorder] Recording successfully started. State:', recorder.state);
      }

      // 6. Start duration counter
      recordIntervalRef.current = setInterval(() => {
        setRecordDuration(d => d + 1);
      }, 1000);

    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[VoiceRecorder] startRecording failed:', err?.name, err?.message);
      }

      cleanupAudioPipeline();
      setStatus('idle');

      const { message, type } = getMicrophoneErrorMessage(err);
      showToast(message, type);
    }
  };

  // Cancel voice recording & discard recorded audio data
  const cancelRecording = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[VoiceRecorder] Cancelling voice recording...');
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        // Detach onstop so cancel does not trigger message sending
        recorder.onstop = null;
        recorder.stop();
      } catch {
        // Ignored
      }
    }

    cleanupAudioPipeline();
    audioChunksRef.current = [];
    setStatus('idle');
    setRecordDuration(0);
  };

  // Finish & send real voice note
  const sendVoiceRecording = () => {
    if (recordingStatusRef.current !== 'recording') return;
    setStatus('stopping');

    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const elapsedMs = performance.now() - recordStartTimeRef.current;
    const finalDuration = Math.max(1, Math.round(elapsedMs / 1000)) || Math.max(1, recordDuration);

    const finalWaveform = liveWaveform.length >= 10 
      ? [...liveWaveform] 
      : [35, 60, 45, 80, 50, 75, 40, 90, 65, 55];

    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === 'inactive') {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[VoiceRecorder] Recorder is inactive or missing during send');
      }
      cleanupAudioPipeline();
      audioChunksRef.current = [];
      setStatus('idle');
      setRecordDuration(0);
      return;
    }

    // Set onstop handler BEFORE calling stop
    recorder.onstop = () => {
      try {
        const mimeType = activeMimeTypeRef.current || recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (process.env.NODE_ENV !== 'production') {
          console.log('[VoiceRecorder] onstop completed. Final Blob size:', audioBlob.size, 'bytes. MIME:', audioBlob.type);
        }

        if (audioBlob.size === 0) {
          showToast('Recorded audio was empty. Please speak into the microphone and try again.', 'warning');
          return;
        }

        const audioUrl = URL.createObjectURL(audioBlob);

        soundEffects.playMessageSent();
        onSendVoiceNote({
          audioUrl,
          durationSeconds: finalDuration,
          waveform: finalWaveform,
          mimeType: audioBlob.type,
          fileSize: audioBlob.size,
          createdAt: new Date().toISOString(),
          expiresAt: getVoiceNoteExpirationDate(15)
        });
      } catch (procErr) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[VoiceRecorder] Error creating final audio Blob:', procErr);
        }
        showToast('Unable to process voice message. Please try again.', 'error');
      } finally {
        cleanupAudioPipeline();
        audioChunksRef.current = [];
        setStatus('idle');
        setRecordDuration(0);
      }
    };

    try {
      if (recorder.state === 'recording') {
        try {
          recorder.requestData();
        } catch {
          // Ignored
        }
      }
      recorder.stop();
    } catch (stopErr) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[VoiceRecorder] Error stopping MediaRecorder:', stopErr);
      }
      cleanupAudioPipeline();
      audioChunksRef.current = [];
      setStatus('idle');
      setRecordDuration(0);
    }
  };

  // Curated emojis
  const emojiCategories = [
    { title: 'Smileys', emojis: ['😀', '😄', '😍', '😎', '🤩', '🔥', '🚀', '✨', '🎉', '👏', '🙌', '👍', '💯', '💡'] },
    { title: 'Work & Objects', emojis: ['💼', '💻', '📱', '📈', '📊', '🛡️', '🔒', '✅', '🎨', '📝', '⚡', '🌟', '🤝', '☕'] }
  ];

  const handleEmojiClick = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const attachment: MessageAttachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type,
      previewUrl: type === 'image' ? URL.createObjectURL(file) : undefined
    };

    soundEffects.playMessageSent();
    onSendAttachment(attachment);
    setShowAttachMenu(false);
  };

  const handleCreateMilestoneOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(offerAmount) || 850;
    const daysNum = parseInt(offerDeliveryDays) || 5;

    soundEffects.playMessageSent();
    onSendMilestoneOffer(offerTitle, amountNum, daysNum);
    setShowOfferModal(false);
    setShowAttachMenu(false);
  };

  return (
    <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 select-none relative z-10">
      
      {/* Replying Banner */}
      {replyingTo && (
        <div className="mb-2 p-2.5 rounded-xl bg-[#F2F0FF] border-l-4 border-[#3D2FD1] flex items-center justify-between text-xs animate-in slide-in-from-bottom-2 duration-150">
          <div className="min-w-0 pr-2">
            <span className="font-bold text-[#3D2FD1]">Replying to {replyingTo.senderName}:</span>
            <p className="text-slate-600 truncate italic">{replyingTo.text}</p>
          </div>
          <button 
            onClick={onCancelReply}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editing Banner */}
      {editingMessage && (
        <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border-l-4 border-amber-500 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2 duration-150">
          <div className="min-w-0 pr-2">
            <span className="font-bold text-amber-900">Editing message</span>
          </div>
          <button 
            onClick={onCancelEdit}
            className="p-1 rounded-lg text-amber-700 hover:text-amber-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Policy Warning Banner */}
      {policyWarning && (
        <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900 animate-in fade-in duration-150">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{policyWarning}</span>
        </div>
      )}

      {/* Real-Time Speech Dictation Live HUD */}
      {isDictating && (
        <div className="mb-2.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-[#1A1633] via-[#241E47] to-[#1A1633] border border-[#6E5BFF]/40 shadow-xl text-white animate-in slide-in-from-bottom-2 duration-150 relative">
          
          {/* Header Bar: Status, Waveform, Language Selector & Close */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute opacity-75" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 relative" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Dictating Speech-to-Text</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#6E5BFF]/30 text-[#C4B8FF] font-medium">
                  Live
                </span>
              </span>

              {/* Animated Voice Equalizer bars */}
              <div className="hidden sm:flex items-center gap-1 h-3.5 ml-1">
                {[12, 20, 16, 24, 14].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#A38BFF] rounded-full animate-pulse"
                    style={{
                      height: `${h}px`,
                      animationDelay: `${i * 120}ms`,
                      animationDuration: '600ms'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Language Switcher Pill */}
            <div className="relative flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Change Spoken Language"
              >
                <Languages className="w-3.5 h-3.5 text-[#A38BFF]" />
                <span>
                  {SPEECH_LANGUAGES.find(l => l.code === speechLang)?.flag || '🌐'}{' '}
                  {SPEECH_LANGUAGES.find(l => l.code === speechLang)?.code || speechLang}
                </span>
              </button>

              {/* Language Selection Menu Popover */}
              {showLanguageMenu && (
                <div className="absolute top-8 right-0 w-52 p-1.5 rounded-2xl bg-[#1A1633] border border-white/20 shadow-2xl z-50 animate-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                  <div className="text-[10px] font-bold text-[#A38BFF] uppercase tracking-wider px-2 py-1">
                    Select Speech Language
                  </div>
                  {SPEECH_LANGUAGES.map((langItem) => (
                    <button
                      key={langItem.code}
                      type="button"
                      onClick={() => {
                        setSpeechLang(langItem.code);
                        setShowLanguageMenu(false);
                        showToast(`Dictation language set to ${langItem.name}`, 'info');
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                        speechLang === langItem.code
                          ? 'bg-[#3D2FD1] text-white font-bold'
                          : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{langItem.flag}</span>
                        <span>{langItem.name}</span>
                      </span>
                      {speechLang === langItem.code && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Close / Stop Button */}
              <button
                type="button"
                onClick={handleDoneDictation}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Stop Dictation (Alt+D)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Transcript Streaming Display */}
          <div className="my-2.5 p-2.5 rounded-xl bg-black/30 border border-white/5 min-h-[48px] max-h-28 overflow-y-auto text-xs leading-relaxed font-sans">
            {finalTranscript || interimTranscript ? (
              <p className="break-words">
                <span className="text-white font-medium">{finalTranscript}</span>
                {interimTranscript && (
                  <span className="text-[#C4B8FF] italic ml-1 underline decoration-dotted decoration-[#6E5BFF]">
                    {interimTranscript}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-slate-400 italic flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#A38BFF] shrink-0" />
                <span>Listening for speech... Dictate your message in real-time.</span>
              </p>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleClearDictation}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                title="Clear current transcription"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={handleCancelDictation}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                title="Cancel and discard speech"
              >
                <Trash2 className="w-3 h-3" />
                <span>Discard</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDoneDictation}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Keep transcribed text in input"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Done & Edit</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!inputText.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                title="Send Message Now"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Voice Recording Bar */}
      {recordingStatus !== 'idle' ? (
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping ml-2" />
            <span className="text-xs font-mono font-bold text-rose-700">
              {recordingStatus === 'requesting' 
                ? 'Requesting Microphone Access...'
                : recordingStatus === 'stopping' 
                  ? 'Processing Voice...' 
                  : `Recording: ${formatAudioDuration(recordDuration)}`}
            </span>
            <div className="hidden sm:flex items-center gap-1 h-6">
              {liveWaveform.map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(15, h * 0.25)}px` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={cancelRecording}
              disabled={recordingStatus === 'stopping'}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-200 disabled:opacity-50"
              title="Cancel & Discard Recording"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
            <button
              type="button"
              onClick={sendVoiceRecording}
              disabled={recordingStatus === 'requesting' || recordingStatus === 'stopping'}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Send Real Voice Note"
            >
              {recordingStatus === 'stopping' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Voice Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Standard Composer Bar */
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Unified Clean MENU Button */}
          <div className="relative" ref={unifiedMenuRef}>
            <button
              type="button"
              onClick={() => {
                setShowUnifiedMenu(!showUnifiedMenu);
                setShowEmojiPicker(false);
              }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                showUnifiedMenu || isDictating
                  ? 'bg-[#3D2FD1] text-white shadow-md shadow-[#3D2FD1]/30 ring-2 ring-[#6E5BFF]/40'
                  : 'bg-slate-100 text-slate-700 hover:bg-[#3D2FD1]/10 hover:text-[#3D2FD1]'
              }`}
              title="Menu: Voice-to-Text, Files, Emojis & Offers"
            >
              <Sparkles className="w-4 h-4 text-[#A38BFF]" />
              <span>MENU</span>
            </button>

            {/* Unified Menu Popover / Bottom Sheet */}
            {showUnifiedMenu && (
              <div className="absolute bottom-12 left-0 w-72 p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xl z-50 space-y-1 animate-in zoom-in-95 duration-100 text-xs">
                <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Chat Actions & Media</span>
                  <button 
                    type="button"
                    onClick={() => setShowUnifiedMenu(false)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 1. Voice-to-Text Dictation */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUnifiedMenu(false);
                    toggleDictation();
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer text-left ${
                    isDictating ? 'bg-[#3D2FD1] text-white' : 'hover:bg-[#F2F0FF] text-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDictating ? 'bg-white/20 text-white' : 'bg-[#3D2FD1]/10 text-[#3D2FD1]'
                  }`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>Voice to Text</span>
                      {isDictating && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />}
                    </div>
                    <div className={`text-[10px] ${isDictating ? 'text-white/80' : 'text-slate-400'}`}>
                      {isDictating ? 'Active (Click to Stop)' : 'Dictate message in real-time'}
                    </div>
                  </div>
                </button>

                {/* 2. Photos & Media File Upload */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUnifiedMenu(false);
                    imageInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Photos & Videos</div>
                    <div className="text-[10px] text-slate-400">PNG, JPG, WebP, MP4, WebM</div>
                  </div>
                </button>

                {/* 3. Document / Spec File Upload */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUnifiedMenu(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Documents & Spec</div>
                    <div className="text-[10px] text-slate-400">PDF, FIG, DOCX, ZIP, Code</div>
                  </div>
                </button>

                {/* 4. Emoji Picker */}
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(true);
                    setShowUnifiedMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Smile className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Emojis</div>
                    <div className="text-[10px] text-slate-400">Smilies, gestures, symbols</div>
                  </div>
                </button>

                {/* 5. Custom Milestone Offer */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUnifiedMenu(false);
                    setShowOfferModal(true);
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50 text-slate-700 transition-colors cursor-pointer text-left border-t border-slate-100 mt-1 pt-2"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#6E5BFF]/15 text-[#3D2FD1] flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#3D2FD1]">Create Milestone Offer</div>
                    <div className="text-[10px] text-slate-400">Escrow-backed Contract</div>
                  </div>
                </button>
              </div>
            )}

            {/* Emoji Sub-Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 w-72 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 animate-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Choose Emoji</span>
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {emojiCategories.map(cat => (
                    <div key={cat.title}>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {cat.title}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {cat.emojis.map(e => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => {
                              handleEmojiClick(e);
                              setShowEmojiPicker(false);
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-lg flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                          >
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hidden inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'image')}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.zip,.fig,.json,.ts,.tsx"
            className="hidden"
            onChange={(e) => handleFileUpload(e, 'document')}
          />

          {/* Text Input Field */}
          <input
            ref={textInputRef}
            type="text"
            value={inputText}
            onChange={handleTextChange}
            placeholder={
              isDictating 
                ? "Dictation active... speak into microphone" 
                : "Type a message or press mic/dictate (Alt+D)..."
            }
            className={`flex-1 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all focus:outline-none ${
              isDictating
                ? 'bg-purple-50/50 border-[#6E5BFF] text-[#1A1633] ring-2 ring-[#6E5BFF]/20'
                : 'bg-slate-100 text-[#1A1633] placeholder:text-slate-400 border-transparent focus:border-[#6E5BFF] focus:bg-white'
            }`}
          />

          {/* Dynamic Voice Note Recording or Send Button */}
          {inputText.trim().length > 0 || editingMessage ? (
            <button
              type="submit"
              className="p-3 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white shadow-md shadow-[#3D2FD1]/30 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              disabled={recordingStatus === 'requesting'}
              className="p-3 rounded-2xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white shadow-md shadow-[#3D2FD1]/25 transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-60"
              title="Click to Record Audio Voice Note"
            >
              {recordingStatus === 'requesting' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          )}

        </form>
      )}

      {/* Custom Milestone Contract Offer Creation Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1633]/70 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-[28px] ios-glass-dark text-white p-6 shadow-2xl border border-white/20 z-10 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#A38BFF]" />
                <h3 className="text-base font-bold text-white">Create Official Milestone Offer</h3>
              </div>
              <button 
                onClick={() => setShowOfferModal(false)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMilestoneOffer} className="space-y-4 my-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Contract / Scope Title</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={e => setOfferTitle(e.target.value)}
                  placeholder="e.g. Milestone 1: High-Converting SaaS Dashboard Architecture"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6E5BFF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Escrow Amount ($ USD)</label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={e => setOfferAmount(e.target.value)}
                    placeholder="850"
                    min="20"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#6E5BFF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Delivery Time (Days)</label>
                  <input
                    type="number"
                    value={offerDeliveryDays}
                    onChange={e => setOfferDeliveryDays(e.target.value)}
                    placeholder="5"
                    min="1"
                    className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6E5BFF]"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-[#A38BFF] block">🛡️ Talentio Escrow Guarantee</span>
                <p>When the recipient accepts this offer, the funds are held securely in Talentio's Escrow Vault and will only be released upon milestone approval.</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Send Official Milestone Offer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
