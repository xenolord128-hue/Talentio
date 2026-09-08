import React, { useState, useRef, useEffect } from 'react';
import { useTalentioAI } from '../context/TalentioAIContext';
import { useGuide } from '../context/GuideContext';
import { AIVoicePopup } from './AIVoicePopup';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Radio, 
  Square,
  Bot,
  User as UserIcon,
  Compass,
  CheckCircle2,
  Lock,
  Copy,
  Check
} from 'lucide-react';

export const TalentioAIAssistant: React.FC = () => {
  const {
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
    startVoiceSession
  } = useTalentioAI();

  const { activePage, user } = useGuide();
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const userRole = user?.userType || 'client';

  // Floating Activation Pill (When closed or minimized)
  if (!isOpen || isMinimized) {
    return (
      <>
        <AIVoicePopup />
        <aside aria-label="Talentio AI Assistant" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2">
          {/* Wake-Word Listening Pulse Indicator */}
          {isVoiceActive && (
            <button 
              type="button"
              onClick={() => startVoiceSession()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1339]/90 border border-[#6E5BFF]/30 backdrop-blur-md shadow-lg text-slate-300 text-xs select-none hover:bg-[#251a52] transition-colors cursor-pointer"
              title="Voice wake-word active: Say 'Hey Talentio' or click to speak"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                Say <strong className="text-white font-semibold">"Hey Talentio"</strong>
              </span>
            </button>
          )}

          {/* Voice Activation Button (Opens Centered Glassmorphic Voice Animation Popup) */}
          <button
            type="button"
            onClick={() => startVoiceSession()}
            className="relative group p-3.5 sm:px-4 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#3D2FD1] via-[#5643FA] to-[#6E5BFF] hover:from-[#4738E0] hover:to-[#7E6DFF] text-white shadow-[0_8px_25px_rgba(61,47,209,0.45)] hover:shadow-[0_12px_32px_rgba(110,91,255,0.6)] transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 border border-white/20"
            title="Voice Assistant: Say 'Hey Talentio' or click to speak"
          >
            <div className="relative">
              <Mic className="w-5 h-5 text-white" />
              <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-black tracking-wide text-white flex items-center gap-1">
                TALENTIO AI
                <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-white/20 text-white">Voice</span>
              </span>
              <span className="text-[10px] text-purple-200">Say "Hey Talentio"</span>
            </div>
          </button>

          {/* Text Chatbot Panel Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="p-3.5 rounded-2xl bg-[#1A1339]/90 border border-[#6E5BFF]/30 hover:border-[#6E5BFF] text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Open Text Chat Window"
          >
            <Bot className="w-5 h-5" />
          </button>
        </aside>
      </>
    );
  }

  // Expanded Assistant Window
  return (
    <>
      <AIVoicePopup />
      <aside aria-label="Talentio AI Assistant Dialog" className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[440px] sm:h-[650px] z-50 flex flex-col bg-[#120D26]/98 backdrop-blur-2xl sm:rounded-3xl border border-[#6E5BFF]/30 shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* 1. Header Bar */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-[#1B143D] to-[#251A52] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#3D2FD1] to-[#8C7BFF] flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#120D26]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white tracking-wide">TALENTIO AI</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-[#3D2FD1]/60 text-purple-200 border border-[#6E5BFF]/30">
                {userRole}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Compass className="w-3 h-3 text-[#A38BFF]" />
              <span className="capitalize">On: {activePage}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Language Toggle */}
          <button
            onClick={() => {
              if (language === 'auto') setLanguage('bn');
              else if (language === 'bn') setLanguage('en');
              else setLanguage('auto');
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
            title={`Language: ${language.toUpperCase()}`}
          >
            <Globe className="w-3.5 h-3.5 text-[#A38BFF]" />
            <span className="text-[11px] uppercase">{language}</span>
          </button>

          {/* Sound Mute / Unmute */}
          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              setIsMuted(!isMuted);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isMuted ? 'text-slate-500 hover:text-slate-300' : 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10'
            }`}
            title={isMuted ? 'Unmute voice answers' : 'Mute voice answers'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Wake Word Toggle */}
          <button
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isVoiceActive ? 'text-purple-300 bg-[#3D2FD1]/30 hover:bg-[#3D2FD1]/50' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isVoiceActive ? "Wake phrase detection ON ('Hey Talentio')" : "Wake phrase detection OFF"}
          >
            <Radio className="w-4 h-4" />
          </button>

          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={() => {
              stopSpeaking();
              stopListening();
              setIsOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Proactive Contextual Prompt Suggestions */}
      <div className="px-3 py-2 bg-[#181135]/60 border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
        {currentPromptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(language === 'bn' ? prompt.textBn : prompt.textEn)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95"
          >
            {language === 'bn' ? prompt.textBn : prompt.textEn}
          </button>
        ))}
      </div>

      {/* 3. Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[88%]">
                {!isUser && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3D2FD1] to-[#8C7BFF] flex items-center justify-center text-white shrink-0 mb-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl ${
                    isUser
                      ? 'bg-[#3D2FD1] text-white rounded-br-xs shadow-md'
                      : msg.isSecurityTrigger
                      ? 'bg-amber-950/40 border border-amber-500/30 text-amber-100 rounded-bl-xs'
                      : 'bg-[#1E1742] border border-white/10 text-slate-200 rounded-bl-xs shadow-sm'
                  }`}
                >
                  {/* Security Notice Tag */}
                  {msg.isSecurityTrigger && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                      <Lock className="w-3 h-3" />
                      <span>Security & Confidentiality Policy</span>
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="leading-relaxed whitespace-pre-line select-text">
                    {msg.content}
                  </div>

                  {/* Interactive Action Button if Present */}
                  {msg.action && (
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <button
                        onClick={() => executeAction(msg.action!)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#3D2FD1] to-[#6E5BFF] hover:from-[#4839E6] hover:to-[#8170FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
                      >
                        <span>{msg.action.label || 'Take me there'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Footer actions for AI messages */}
                  {!isUser && (
                    <div className="mt-2 pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5">
                      <span>{msg.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                        {!isMuted && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                            title="Read aloud"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3D2FD1] to-[#8C7BFF] flex items-center justify-center text-white shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 rounded-2xl rounded-bl-xs bg-[#1E1742] border border-white/10 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A38BFF] animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#A38BFF] animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#A38BFF] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] text-slate-400 ml-1">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Live Voice Status & Waveform Bar */}
      {(isListening || isSpeaking) && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-[#20184A] to-[#2B1E63] border-t border-white/10 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {isListening ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Listening...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#A38BFF] font-bold shrink-0">
                <Volume2 className="w-4 h-4 animate-pulse text-[#A38BFF]" />
                <span>Speaking...</span>
              </div>
            )}
            <span className="text-[11px] text-slate-300 truncate italic">
              {transcript || (isSpeaking ? 'Reading response aloud...' : 'Speak now...')}
            </span>
          </div>

          <button
            onClick={() => {
              if (isListening) stopListening();
              if (isSpeaking) stopSpeaking();
            }}
            className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      )}

      {/* 5. Input Bar & Controls */}
      <div className="p-3 bg-[#171036] border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          {/* Clear History Button */}
          <button
            onClick={clearConversation}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask Talentio AI anything...'}
              className="w-full py-2.5 pl-3.5 pr-9 rounded-xl bg-[#1E1644] border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#6E5BFF] transition-all"
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Voice Mic Button */}
          <button
            onClick={() => {
              startVoiceSession();
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-[#3D2FD1] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer shrink-0"
            title="Switch to Full-Screen AI Voice Assistant"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
              inputText.trim() && !isLoading
                ? 'bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white shadow-md'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Wake-Word Micro Caption */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1 select-none">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Escrow & Privacy Protected</span>
          </span>
          <span>Say <strong>"Talentio"</strong> to speak</span>
        </div>
      </div>
    </aside>
    </>
  );
};
