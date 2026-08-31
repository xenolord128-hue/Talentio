import { useState, useEffect, useRef, useCallback } from 'react';
import { soundEffects } from '../utils/audioEffects';

export interface SpeechLanguage {
  code: string;
  name: string;
  flag: string;
}

export const SPEECH_LANGUAGES: SpeechLanguage[] = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'bn-BD', name: 'Bengali (বাংলা)', flag: '🇧🇩' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'ar-SA', name: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'pt-BR', name: 'Portuguese (Brasil)', flag: '🇧🇷' },
  { code: 'ja-JP', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Mandarin (中文)', flag: '🇨🇳' }
];

export interface UseSpeechRecognitionOptions {
  initialLanguage?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscriptChange?: (finalText: string, interimText: string) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  finalTranscript: string;
  interimTranscript: string;
  combinedTranscript: string;
  error: string | null;
  startListening: (langOverride?: string) => Promise<boolean>;
  stopListening: () => void;
  toggleListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    initialLanguage = 'en-US',
    continuous = true,
    interimResults = true,
    onTranscriptChange,
    onError
  } = options;

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [language, setLanguageState] = useState<string>(initialLanguage);
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);
  const languageRef = useRef<string>(initialLanguage);
  
  // Track all finalized chunks by their unique index in the speech session to eliminate duplicates
  const finalChunksRef = useRef<Map<number, string>>(new Map());
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  onTranscriptChangeRef.current = onTranscriptChange;

  // Check Web Speech API availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setFinalTranscript('');
    setInterimTranscript('');
    finalChunksRef.current.clear();
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    languageRef.current = lang;
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.lang = lang;
      } catch {
        // Safe fallback
      }
    }
  }, [isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignored
      }
    }
    setIsListening(false);
    setInterimTranscript('');
    soundEffects.playDictationStop();
  }, []);

  // Helper to deduplicate repeated consecutive words/phrases
  const cleanTranscript = (text: string): string => {
    return text.replace(/\s+/g, ' ').trim();
  };

  // Start listening
  const startListening = useCallback(
    async (langOverride?: string): Promise<boolean> => {
      if (typeof window === 'undefined') return false;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        const errMsg = 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.';
        setError(errMsg);
        if (onError) onError(errMsg);
        return false;
      }

      const activeLang = langOverride || languageRef.current || 'en-US';
      setError(null);
      isManuallyStoppedRef.current = false;

      // Reset chunks for a clean session
      finalChunksRef.current.clear();

      // Clean up previous instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.stop();
        } catch {
          // Ignored
        }
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = activeLang;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          soundEffects.playDictationStart();
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';

          // Iterate all results provided in this session
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0]?.transcript || '';

            if (result.isFinal) {
              // Store directly by unique result index to prevent any duplication
              finalChunksRef.current.set(i, transcript.trim());
            } else {
              currentInterim += transcript;
            }
          }

          // Build full final transcript in index order
          const sortedIndices = Array.from(finalChunksRef.current.keys()).sort((a: number, b: number) => a - b);
          const fullFinal = cleanTranscript(sortedIndices.map(k => finalChunksRef.current.get(k) || '').filter(Boolean).join(' '));

          setFinalTranscript(fullFinal);
          setInterimTranscript(currentInterim.trim());

          if (onTranscriptChangeRef.current) {
            onTranscriptChangeRef.current(fullFinal, currentInterim.trim());
          }
        };

        recognition.onerror = (event: any) => {
          const errType = event?.error;
          let userMessage = 'Speech recognition error occurred.';

          if (errType === 'not-allowed' || errType === 'service-not-allowed') {
            userMessage = 'Microphone permission denied. Please allow microphone access in your browser settings to use dictation.';
            setIsListening(false);
          } else if (errType === 'no-speech') {
            // Natural silence pause - keep listening in continuous mode
            return;
          } else if (errType === 'network') {
            userMessage = 'Network error during speech recognition. Please check your internet connection.';
          } else if (errType === 'audio-capture') {
            userMessage = 'No microphone was detected. Please ensure your audio input device is connected.';
            setIsListening(false);
          } else if (errType === 'aborted') {
            return;
          }

          setError(userMessage);
          if (onError) onError(userMessage);
        };

        recognition.onend = () => {
          // If not manually stopped and continuous is true, restart cleanly
          if (!isManuallyStoppedRef.current && continuous) {
            try {
              recognition.start();
              return;
            } catch {
              // Mark stopped
            }
          }
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.start();
        return true;
      } catch (err: any) {
        console.error('[SpeechRecognition] Failed to start:', err);
        const errMsg = err?.message || 'Failed to start speech recognition.';
        setError(errMsg);
        setIsListening(false);
        if (onError) onError(errMsg);
        return false;
      }
    },
    [continuous, interimResults, onError]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.stop();
        } catch {
          // Ignored
        }
      }
    };
  }, []);

  const combinedTranscript = interimTranscript
    ? finalTranscript
      ? `${finalTranscript} ${interimTranscript}`
      : interimTranscript
    : finalTranscript;

  return {
    isSupported,
    isListening,
    language,
    setLanguage,
    finalTranscript,
    interimTranscript,
    combinedTranscript,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript
  };
};
