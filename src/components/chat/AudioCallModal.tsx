import React, { useState, useEffect } from 'react';
import { ConversationParticipant, CallSessionState } from '../../types';
import { soundEffects } from '../../utils/audioEffects';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Grid, 
  Sparkles,
  Lock
} from 'lucide-react';

interface AudioCallModalProps {
  callState: CallSessionState | null;
  onEndCall: () => void;
}

export const AudioCallModal: React.FC<AudioCallModalProps> = ({
  callState,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'connected' | 'ended'>('calling');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!callState || !callState.active || callState.type !== 'audio') return;

    setCallStatus('calling');
    setDuration(0);

    // Flow: 1.5s Calling -> 2s Ringing (with audio synthesis) -> Connected
    const ringTimer = setTimeout(() => {
      setCallStatus('ringing');
      soundEffects.startRinging();
    }, 1200);

    const connectTimer = setTimeout(() => {
      soundEffects.playCallConnected();
      setCallStatus('connected');
    }, 4500);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
      soundEffects.stopRinging();
    };
  }, [callState?.active, callState?.type]);

  // Duration timer when connected
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!callState || !callState.active || callState.type !== 'audio') return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleHangup = () => {
    soundEffects.playCallEnded();
    setCallStatus('ended');
    setTimeout(() => {
      onEndCall();
    }, 600);
  };

  const handleKeypadPress = (digit: string) => {
    setKeypadInput(prev => prev + digit);
  };

  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1633]/90 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Dynamic Animated Ambient Background Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#3D2FD1]/30 via-[#6E5BFF]/25 to-[#A38BFF]/20 blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-sm rounded-[32px] ios-glass-dark text-white p-7 shadow-[0_25px_80px_rgba(0,0,0,0.7)] border border-white/20 z-10 flex flex-col items-center justify-between min-h-[520px]">
        
        {/* Top Escrow Encryption Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-[#A38BFF] font-medium shadow-sm">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Talentio End-to-End Encrypted</span>
        </div>

        {/* Participant Avatar & Pulsing Rings */}
        <div className="flex flex-col items-center text-center my-auto space-y-4">
          <div className="relative">
            {/* Animated Pulsing Soundwave Rings */}
            {callStatus === 'connected' && (
              <>
                <div className="absolute inset-0 rounded-full bg-[#6E5BFF]/30 animate-ping opacity-40 scale-125" />
                <div className="absolute -inset-3 rounded-full border border-[#A38BFF]/40 animate-spin opacity-50 duration-1000" />
              </>
            )}

            {callStatus === 'ringing' && (
              <div className="absolute -inset-2 rounded-full bg-[#3D2FD1]/40 animate-pulse scale-110" />
            )}

            <img
              src={callState.participant.avatar}
              alt={callState.participant.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-[#6E5BFF]/60 shadow-2xl relative z-10"
            />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              {callState.participant.name}
            </h3>
            <p className="text-xs text-[#A38BFF] font-medium mt-0.5">
              {callState.participant.title || callState.participant.handle}
            </p>
          </div>

          {/* Status Label */}
          <div className="text-sm font-semibold">
            {callStatus === 'calling' && (
              <span className="text-slate-300 animate-pulse">Connecting securely...</span>
            )}
            {callStatus === 'ringing' && (
              <span className="text-[#A38BFF] animate-pulse">Ringing...</span>
            )}
            {callStatus === 'connected' && (
              <span className="text-emerald-400 font-mono tracking-widest font-bold">
                {formatTime(duration)}
              </span>
            )}
            {callStatus === 'ended' && (
              <span className="text-rose-400 font-bold">Call Ended</span>
            )}
          </div>
        </div>

        {/* Interactive Keypad Overlay if opened */}
        {showKeypad && (
          <div className="w-full bg-[#1A1633]/95 border border-white/20 rounded-2xl p-4 my-2 animate-in zoom-in-95 duration-150">
            <div className="text-center font-mono text-base font-bold text-white mb-3 tracking-widest min-h-[24px]">
              {keypadInput || '—'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {keypadDigits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeypadPress(digit)}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/25 text-white font-bold text-sm transition-colors active:scale-95"
                >
                  {digit}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowKeypad(false); setKeypadInput(''); }}
              className="w-full mt-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
            >
              Hide Keypad
            </button>
          </div>
        )}

        {/* Call Action Controls */}
        <div className="w-full pt-4 flex items-center justify-around">
          
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isMuted 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Keypad */}
          <button
            onClick={() => setShowKeypad(!showKeypad)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              showKeypad 
                ? 'bg-[#3D2FD1] text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            title="Dial Keypad"
          >
            <Grid className="w-5 h-5" />
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              !isSpeaker 
                ? 'bg-white/5 text-slate-400 border border-white/10' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
            title={isSpeaker ? 'Speaker On' : 'Speaker Off'}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call (Hang up) */}
          <button
            onClick={handleHangup}
            className="w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

        </div>

      </div>
    </div>
  );
};
