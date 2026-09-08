import React, { useEffect, useState, useRef } from 'react';
import { useTalentioAI } from '../context/TalentioAIContext';
import { X, Mic } from 'lucide-react';

export const AIVoicePopup: React.FC = () => {
  const {
    isVoicePopupOpen,
    voiceState,
    voiceTranscript,
    voiceResponseText,
    endVoiceSession
  } = useTalentioAI();

  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [animClass, setAnimClass] = useState<'ai-overlay-entering' | 'ai-overlay-entered' | 'ai-overlay-exiting'>('ai-overlay-entering');
  const closeTimerRef = useRef<any>(null);

  // Handle Mount / Unmount animation lifecycle
  useEffect(() => {
    if (isVoicePopupOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsRendered(true);
      setAnimClass('ai-overlay-entering');
      // Prevent background scroll while voice overlay is active
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const frame = requestAnimationFrame(() => {
        setAnimClass('ai-overlay-entered');
      });

      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = originalOverflow;
      };
    } else if (isRendered) {
      setAnimClass('ai-overlay-exiting');
      closeTimerRef.current = setTimeout(() => {
        setIsRendered(false);
        document.body.style.overflow = '';
      }, 300);
    }
  }, [isVoicePopupOpen, isRendered]);

  // Accessibility: Close on Escape key
  useEffect(() => {
    if (!isVoicePopupOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        endVoiceSession();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVoicePopupOpen, endVoiceSession]);

  if (!isRendered) {
    return null;
  }

  // Derive dynamic status and substatus text based on active voice state
  let statusText = 'Listening...';
  let substatusText = 'Speak naturally';

  switch (voiceState) {
    case 'activated':
      statusText = 'AI Activated';
      substatusText = 'Ready to listen...';
      break;
    case 'listening':
      statusText = 'Listening...';
      substatusText = voiceTranscript ? `"${voiceTranscript}"` : 'Speak naturally in Bangla or English...';
      break;
    case 'thinking':
      statusText = 'Thinking...';
      substatusText = voiceTranscript ? `"${voiceTranscript}"` : 'Processing your request...';
      break;
    case 'speaking':
      statusText = 'Speaking...';
      substatusText = voiceResponseText || 'Answering...';
      break;
    case 'idle':
    default:
      statusText = 'Listening...';
      substatusText = 'Speak naturally';
      break;
  }

  return (
    <div
      className={`ai-overlay ${animClass}`}
      id="aiVoiceOverlay"
      onClick={(e) => {
        // Prevent background clicks from interacting with website; clicking backdrop closes popup
        if (e.target === e.currentTarget) {
          endVoiceSession();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="TALENTIO AI Voice Assistant"
    >
      <div
        className="ai-voice-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top microphone indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-purple-200 mb-2">
          <Mic className="w-3 h-3 text-[#A38BFF] animate-pulse" />
          <span>TALENTIO VOICE</span>
        </div>

        {/* EXACT PROVIDED LOADER HTML — PRESERVED AS REQUIRED */}
        <div className="ai-loader-container">
          {/* From Uiverse.io by andrew-manzyk */} 
          <div className="loader">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <defs>
                <mask id="clipping">
                  <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                  <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                  <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                </mask>
              </defs>
            </svg>
            <div className="box"></div>
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="ai-status">
          {statusText}
        </div>

        {/* Dynamic Substatus / User Speech Transcript / AI Answer */}
        <div className="ai-substatus" title={substatusText}>
          {substatusText}
        </div>

        {/* Close / Cancel Button */}
        <button
          className="ai-close"
          type="button"
          onClick={endVoiceSession}
          aria-label="Cancel Voice Assistant"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};
