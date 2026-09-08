import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useGuide } from './GuideContext';
import { queryLocalKnowledgeBase, PAGE_PROMPT_SUGGESTIONS } from '../data/talentioKnowledgeBase';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  action?: {
    type: 'navigate' | 'modal';
    target: string;
    label?: string;
  };
  isSecurityTrigger?: boolean;
}

export type VoiceInteractionState = 'idle' | 'activated' | 'listening' | 'thinking' | 'speaking';

interface TalentioAIContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean) => void;
  isListening: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  language: 'auto' | 'bn' | 'en';
  setLanguage: (lang: 'auto' | 'bn' | 'en') => void;
  messages: AIMessage[];
  transcript: string;
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  stopSpeaking: () => void;
  speakText: (text: string) => void;
  clearConversation: () => void;
  executeAction: (action: { type: 'navigate' | 'modal'; target: string }) => void;
  currentPromptSuggestions: Array<{ textEn: string; textBn: string }>;
  // AI Voice Animation Popup & Fullscreen Glassmorphic Overlay
  isVoicePopupOpen: boolean;
  setIsVoicePopupOpen: (open: boolean) => void;
  voiceState: VoiceInteractionState;
  voiceTranscript: string;
  voiceResponseText: string;
  startVoiceSession: (initialPrompt?: string) => void;
  endVoiceSession: () => void;
}

const TalentioAIContext = createContext<TalentioAIContextType | undefined>(undefined);

// Web Audio API Synthesizer for Sleek Chimes
function playActivationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    // Pleasant high chime 587.33Hz (D5) -> 880Hz (A5)
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {
    // AudioContext permission may need user gesture
  }
}

export const TalentioAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    activePage, 
    setActivePage, 
    setIsPostJobModalOpen, 
    setIsCreateGigModalOpen, 
    setIsWidgetManagerOpen,
    setIsSearchModalOpen,
    user 
  } = useGuide();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true); // Wake-name detection
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [language, setLanguage] = useState<'auto' | 'bn' | 'en'>('auto');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');

  // AI Voice Animation Popup States
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState<boolean>(false);
  const [voiceState, setVoiceState] = useState<VoiceInteractionState>('idle');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceResponseText, setVoiceResponseText] = useState<string>('');

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Hello! I am **TALENTIO AI**, your intelligent website guide and support assistant. How can I help you discover top talent, post a project, create gigs, or navigate the marketplace today?\n\n*You can also say "Hey Talentio" or tap the microphone to talk with me.*',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const wakeRecognitionRef = useRef<any>(null);
  const voiceRecognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<any>(null);

  const isListeningRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const isVoiceActiveRef = useRef<boolean>(isVoiceActive);
  const isOpenRef = useRef<boolean>(isOpen);
  const isVoicePopupOpenRef = useRef<boolean>(false);
  const voiceStateRef = useRef<VoiceInteractionState>('idle');

  useEffect(() => {
    isVoiceActiveRef.current = isVoiceActive;
  }, [isVoiceActive]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    isVoicePopupOpenRef.current = isVoicePopupOpen;
  }, [isVoicePopupOpen]);

  useEffect(() => {
    voiceStateRef.current = voiceState;
  }, [voiceState]);

  // Stop TTS
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Text-to-Speech (TTS)
  const speakText = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      // Clean markdown tags for natural speech
      const cleanText = text
        .replace(/[*_~`#>]/g, '')
        .replace(/\[ACTION:[^\]]+\]/g, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const isBanglaText = /[\u0980-\u09FF]/.test(cleanText);
      const voices = window.speechSynthesis.getVoices();
      
      if (isBanglaText) {
        const bnVoice = voices.find(v => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
        utterance.lang = 'bn-BD';
      } else {
        const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  }, [isMuted]);

  // Execute Navigation or Modal Action
  const executeAction = useCallback((action: { type: 'navigate' | 'modal'; target: string }) => {
    if (!action || !action.target) return;

    if (action.type === 'navigate') {
      setActivePage(action.target as any);
    } else if (action.type === 'modal') {
      switch (action.target) {
        case 'post-job-modal':
          setIsPostJobModalOpen(true);
          break;
        case 'create-gig-modal':
          setIsCreateGigModalOpen(true);
          break;
        case 'widgets-modal':
          setIsWidgetManagerOpen(true);
          break;
        case 'search-modal':
          setIsSearchModalOpen(true);
          break;
        default:
          break;
      }
    }
  }, [setActivePage, setIsPostJobModalOpen, setIsCreateGigModalOpen, setIsWidgetManagerOpen, setIsSearchModalOpen]);

  // Send message to AI engine
  const sendMessage = useCallback(async (userText: string) => {
    const query = userText.trim();
    if (!query) return;

    // Interrupt any ongoing speaking
    stopSpeaking();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const userRole = user?.userType || 'client';

    try {
      // 1. Call Backend Gemini Proxy
      const response = await fetch('/api/talentio-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          messages: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          userRole,
          currentPage: activePage,
          language
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.reply || '';
      const action = data.action;

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
        isSecurityTrigger: data.isSecurityTrigger
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);

      // Auto-speak if voice conversation enabled and not muted
      if (!isMuted) {
        speakText(aiReply);
      }

      // Auto-trigger navigation if explicitly directed
      if (action && (query.toLowerCase().includes('take me') || query.toLowerCase().includes('নিয়ে চলো') || query.toLowerCase().includes('open'))) {
        setTimeout(() => {
          executeAction(action);
        }, 1200);
      }

    } catch (err) {
      // 2. Resilient Instant Fallback: Query Centralized Knowledge Base
      console.warn('Talentio AI network fallback active:', err);
      const fallback = queryLocalKnowledgeBase(query, userRole, activePage, language);

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: fallback.action ? {
          type: fallback.action.type,
          target: fallback.action.target,
          label: fallback.action.label
        } : undefined,
        isSecurityTrigger: fallback.isSecurityTrigger
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);

      if (!isMuted) {
        speakText(fallback.reply);
      }

      if (fallback.action && (query.toLowerCase().includes('take me') || query.toLowerCase().includes('নিয়ে চলো') || query.toLowerCase().includes('open'))) {
        setTimeout(() => {
          executeAction(fallback.action!);
        }, 1200);
      }
    }
  }, [messages, user, activePage, language, isMuted, speakText, stopSpeaking, executeAction]);

  // Start Active Listening
  const startListening = useCallback(() => {
    stopSpeaking();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // Auto-send if finalized
        if (event.results[0].isFinal && currentTranscript.trim().length > 1) {
          const captured = currentTranscript.trim();
          setTimeout(() => {
            sendMessage(captured);
            setTranscript('');
            setIsListening(false);
          }, 300);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  }, [language, stopSpeaking, sendMessage]);

  // Active voice speech loop refs to prevent stale closure loops
  const listenForVoiceInputRef = useRef<() => void>(() => {});
  const processVoiceQueryRef = useRef<(q: string) => Promise<void>>(async () => {});

  // End Active Voice Session
  const endVoiceSession = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (voiceRecognitionRef.current) {
      try { voiceRecognitionRef.current.abort(); } catch (_) {}
      voiceRecognitionRef.current = null;
    }
    stopSpeaking();
    setVoiceState('idle');
    setIsVoicePopupOpen(false);
  }, [stopSpeaking]);

  // Voice-dedicated Speech Synthesis (TTS)
  const speakVoiceText = useCallback((text: string, onEndCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEndCallback?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleanText = text
        .replace(/[*_~`#>]/g, '')
        .replace(/\[ACTION:[^\]]+\]/g, '')
        .trim();

      if (!cleanText) {
        onEndCallback?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const isBanglaText = /[\u0980-\u09FF]/.test(cleanText);
      const voices = window.speechSynthesis.getVoices();

      if (isBanglaText) {
        const bnVoice = voices.find(v => v.lang.startsWith('bn'));
        if (bnVoice) utterance.voice = bnVoice;
        utterance.lang = 'bn-BD';
      } else {
        const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setVoiceState('speaking');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onEndCallback?.();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        onEndCallback?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
      onEndCallback?.();
    }
  }, []);

  // Process a spoken question via Talentio AI
  const processVoiceQuery = useCallback(async (queryText: string) => {
    const query = queryText.trim();
    if (!query) return;

    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    // Check for exit / cancellation phrases
    const lower = query.toLowerCase();
    const exitPhrases = ['goodbye', 'bye', 'cancel', 'stop', 'exit', 'close', 'ধন্যবাদ', 'বাই', 'বিদায়', 'বন্ধ করো'];
    if (exitPhrases.some(p => lower.includes(p))) {
      const isBn = language === 'bn' || /[\u0980-\u09FF]/.test(query);
      const farewell = isBn ? 'ধন্যবাদ! আপনার দিনটি শুভ হোক।' : 'Goodbye! Feel free to call me anytime.';
      setVoiceResponseText(farewell);
      setVoiceState('speaking');
      speakVoiceText(farewell, () => {
        setTimeout(() => {
          endVoiceSession();
        }, 400);
      });
      return;
    }

    setVoiceState('thinking');
    setVoiceTranscript(query);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: AIMessage = {
      id: `voice-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp
    };
    setMessages(prev => [...prev, userMsg]);

    const userRole = user?.userType || 'client';

    try {
      const response = await fetch('/api/talentio-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          messages: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          userRole,
          currentPage: activePage,
          language
        })
      });

      let aiReply = '';
      let action: any = undefined;

      if (response.ok) {
        const data = await response.json();
        aiReply = data.reply || '';
        action = data.action;
      } else {
        const fallback = queryLocalKnowledgeBase(query, userRole, activePage, language);
        aiReply = fallback.reply;
        action = fallback.action;
      }

      const aiMsg: AIMessage = {
        id: `voice-ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action
      };
      setMessages(prev => [...prev, aiMsg]);

      setVoiceResponseText(aiReply);
      setVoiceState('speaking');

      if (action && (query.toLowerCase().includes('take me') || query.toLowerCase().includes('নিয়ে চলো') || query.toLowerCase().includes('open') || query.toLowerCase().includes('খুল'))) {
        executeAction(action);
      }

      speakVoiceText(aiReply, () => {
        // REQUIREMENT 11: POPUP MUST REMAIN OPEN DURING ENTIRE CONVERSATION
        // Loop back to Listening... seamlessly
        if (isVoicePopupOpenRef.current) {
          setVoiceState('listening');
          setVoiceTranscript('');
          listenForVoiceInputRef.current();
        }
      });

    } catch (_err) {
      const fallback = queryLocalKnowledgeBase(query, userRole, activePage, language);
      setVoiceResponseText(fallback.reply);
      setVoiceState('speaking');
      speakVoiceText(fallback.reply, () => {
        if (isVoicePopupOpenRef.current) {
          setVoiceState('listening');
          setVoiceTranscript('');
          listenForVoiceInputRef.current();
        }
      });
    }
  }, [user, activePage, language, messages, executeAction, speakVoiceText, endVoiceSession]);

  // Listen for user speech in voice popup mode
  const listenForVoiceInput = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (voiceRecognitionRef.current) {
      try { voiceRecognitionRef.current.abort(); } catch (_) {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

      // Auto-inactivity silence timer (12s)
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        if (isVoicePopupOpenRef.current && voiceStateRef.current === 'listening') {
          endVoiceSession();
        }
      }, 12000);

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event: any) => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setVoiceTranscript(currentTranscript);

        if (event.results[0].isFinal && currentTranscript.trim().length > 1) {
          const captured = currentTranscript.trim();
          setTimeout(() => {
            processVoiceQueryRef.current(captured);
          }, 300);
        }
      };

      recognition.onerror = () => {
        // Keep listening or allow inactivity timer
      };

      recognition.onend = () => {
        // If still in listening state and no speech processed yet, wait for silence timeout
      };

      voiceRecognitionRef.current = recognition;
      recognition.start();
    } catch (_e) {
      //
    }
  }, [language, endVoiceSession]);

  // Keep circular loop refs updated
  useEffect(() => {
    listenForVoiceInputRef.current = listenForVoiceInput;
  }, [listenForVoiceInput]);

  useEffect(() => {
    processVoiceQueryRef.current = processVoiceQuery;
  }, [processVoiceQuery]);

  // Start Voice Session (Centered Voice Animation Popup with Glassmorphism Overlay)
  const startVoiceSession = useCallback((initialPrompt?: string) => {
    playActivationChime();
    stopSpeaking();
    // STRICT REQUIREMENT 1 & 12: Chatbot MUST NOT open when voice is activated!
    setIsOpen(false);
    setIsVoicePopupOpen(true);

    if (initialPrompt && initialPrompt.trim().length > 2) {
      setVoiceState('activated');
      setVoiceTranscript(initialPrompt);
      setTimeout(() => {
        processVoiceQueryRef.current(initialPrompt);
      }, 500);
    } else {
      setVoiceState('activated');
      setVoiceTranscript('');
      setVoiceResponseText('');
      setTimeout(() => {
        if (isVoicePopupOpenRef.current) {
          setVoiceState('listening');
          listenForVoiceInputRef.current();
        }
      }, 600);
    }
  }, [stopSpeaking]);

  // Stop Active Listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Background Wake-Word Detection ("Talentio" / "Hey Talentio" / "ট্যালেন্টিও")
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !isVoiceActive) {
      if (wakeRecognitionRef.current) {
        try { wakeRecognitionRef.current.abort(); } catch (_) {}
      }
      return;
    }

    let isDestroyed = false;

    function initWakeListener() {
      if (isDestroyed || !isVoiceActiveRef.current) return;
      if (isListeningRef.current || isSpeakingRef.current || isVoicePopupOpenRef.current) {
        // Don't listen for wake word while user is already in active conversation
        setTimeout(initWakeListener, 1000);
        return;
      }

      try {
        const wakeRecognizer = new SpeechRecognition();
        wakeRecognizer.continuous = true;
        wakeRecognizer.interimResults = true;
        wakeRecognizer.lang = 'en-US';

        wakeRecognizer.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const raw = event.results[i][0].transcript.toLowerCase();
            const wakeWords = ['talentio', 'hey talentio', 'ট্যালেন্টিও', 'হেই ট্যালেন্টিও', 'help me find'];
            const match = wakeWords.some(w => raw.includes(w));

            if (match) {
              // Extract any following prompt
              let prompt = raw;
              wakeWords.forEach(w => {
                prompt = prompt.replace(w, '');
              });
              prompt = prompt.replace(/^[,.\s]+/, '').trim();

              try { wakeRecognizer.abort(); } catch (_) {}

              // STRICT REQUIREMENT 1 & 12: Calling AI name opens ONLY the Voice Animation Popup!
              startVoiceSession(prompt.length > 2 ? prompt : undefined);
              return;
            }
          }
        };

        wakeRecognizer.onerror = () => {
          if (!isDestroyed && isVoiceActiveRef.current) {
            setTimeout(initWakeListener, 2000);
          }
        };

        wakeRecognizer.onend = () => {
          if (!isDestroyed && isVoiceActiveRef.current) {
            setTimeout(initWakeListener, 1000);
          }
        };

        wakeRecognitionRef.current = wakeRecognizer;
        wakeRecognizer.start();
      } catch (err) {
        setTimeout(initWakeListener, 3000);
      }
    }

    initWakeListener();

    return () => {
      isDestroyed = true;
      if (wakeRecognitionRef.current) {
        try { wakeRecognitionRef.current.abort(); } catch (_) {}
      }
    };
  }, [isVoiceActive, startVoiceSession]);

  const clearConversation = useCallback(() => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation history cleared. How else can I assist you on Talentio?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [stopSpeaking]);

  const currentPromptSuggestions = PAGE_PROMPT_SUGGESTIONS[activePage] || PAGE_PROMPT_SUGGESTIONS['explore'];

  return (
    <TalentioAIContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isMinimized,
        setIsMinimized,
        isVoiceActive,
        setIsVoiceActive,
        isListening,
        isSpeaking,
        isMuted,
        setIsMuted,
        language,
        setLanguage,
        messages,
        transcript,
        isLoading,
        sendMessage,
        startListening,
        stopListening,
        stopSpeaking,
        speakText,
        clearConversation,
        executeAction,
        currentPromptSuggestions,
        isVoicePopupOpen,
        setIsVoicePopupOpen,
        voiceState,
        voiceTranscript,
        voiceResponseText,
        startVoiceSession,
        endVoiceSession
      }}
    >
      {children}
    </TalentioAIContext.Provider>
  );
};

export const useTalentioAI = (): TalentioAIContextType => {
  const context = useContext(TalentioAIContext);
  if (!context) {
    throw new Error('useTalentioAI must be used within a TalentioAIProvider');
  }
  return context;
};
