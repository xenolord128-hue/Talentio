import React, { useState, useEffect, useRef } from 'react';
import { ConversationParticipant, CallSessionState } from '../../types';
import { soundEffects } from '../../utils/audioEffects';
import { realtimeService } from '../../lib/realtimeService';
import { updateCallDocument } from '../../lib/firestore';
import { 
  PhoneOff, 
  Phone,
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid, 
  Lock
} from 'lucide-react';

interface AudioCallModalProps {
  callState: CallSessionState | null;
  onEndCall: () => void;
  currentUser?: { id: string; name: string; avatar: string } | null;
}

export const AudioCallModal: React.FC<AudioCallModalProps> = ({
  callState,
  onEndCall,
  currentUser
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'connected' | 'ended'>(
    callState?.isIncoming ? 'ringing' : 'calling'
  );
  const [duration, setDuration] = useState(0);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and handle call lifecycle
  useEffect(() => {
    if (!callState || !callState.active || callState.type !== 'audio') return;

    const callId = callState.callId || `call_audio_${Date.now()}`;
    const participantId = callState.participant.id;
    const isIncoming = !!callState.isIncoming;

    if (isIncoming) {
      setCallStatus('ringing');
      soundEffects.startRinging();
    } else {
      setCallStatus('calling');
      soundEffects.startRinging();

      // Initiate call to remote peer via real-time signaling
      if (currentUser) {
        realtimeService.initiateCall({
          callId,
          callerId: currentUser.id,
          callerName: currentUser.name,
          callerAvatar: currentUser.avatar,
          receiverId: participantId,
          receiverName: callState.participant.name,
          receiverAvatar: callState.participant.avatar,
          type: 'audio'
        });
      }
    }

    // Real-time listener: call accepted
    const unsubAccepted = realtimeService.on('call_accepted', async (data: any) => {
      if (data.callId === callId || !data.callId) {
        soundEffects.stopRinging();
        soundEffects.playCallConnected();
        setCallStatus('connected');

        // Start WebRTC Peer Connection for audio
        try {
          const { remoteStream } = await realtimeService.setupPeerConnection(
            participantId,
            callId,
            false,
            true // Caller initiated
          );
          if (remoteAudioRef.current && remoteStream) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play().catch(() => {});
          }
        } catch (err) {
          console.warn('WebRTC audio setup error:', err);
        }
      }
    });

    // Real-time listener: remote stream updated
    const unsubStream = realtimeService.on('remote_stream_updated', (stream: MediaStream) => {
      if (remoteAudioRef.current && stream) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch(() => {});
      }
    });

    // Real-time listener: call declined
    const unsubDeclined = realtimeService.on('call_declined', () => {
      soundEffects.stopRinging();
      soundEffects.playCallEnded();
      setCallStatus('ended');
      setTimeout(() => onEndCall(), 1000);
    });

    // Real-time listener: call ended
    const unsubEnded = realtimeService.on('call_ended', () => {
      soundEffects.stopRinging();
      soundEffects.playCallEnded();
      setCallStatus('ended');
      setTimeout(() => onEndCall(), 1000);
    });

    return () => {
      soundEffects.stopRinging();
      unsubAccepted();
      unsubStream();
      unsubDeclined();
      unsubEnded();
      realtimeService.cleanUpCall();
    };
  }, [callState?.active, callState?.type, callState?.callId]);

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

  const handleAcceptCall = async () => {
    soundEffects.stopRinging();
    soundEffects.playCallConnected();
    setCallStatus('connected');

    const callId = callState.callId || `call_audio_${Date.now()}`;
    const callerId = callState.participant.id;
    const myId = currentUser?.id || 'me';

    realtimeService.acceptCall(callId, callerId, myId);

    try {
      const { remoteStream } = await realtimeService.setupPeerConnection(
        callerId,
        callId,
        false,
        false // Receiver answering
      );
      if (remoteAudioRef.current && remoteStream) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('WebRTC audio answer setup error:', err);
    }
  };

  const handleDeclineCall = () => {
    soundEffects.stopRinging();
    soundEffects.playCallEnded();
    setCallStatus('ended');

    const callId = callState.callId || `call_audio_${Date.now()}`;
    const callerId = callState.participant.id;
    const myId = currentUser?.id || 'me';

    realtimeService.declineCall(callId, callerId, myId);
    setTimeout(() => onEndCall(), 600);
  };

  const handleHangup = () => {
    soundEffects.stopRinging();
    soundEffects.playCallEnded();
    setCallStatus('ended');

    const callId = callState.callId || `call_audio_${Date.now()}`;
    const otherUserId = callState.participant.id;

    realtimeService.endCall(callId, otherUserId, duration);
    if (callState.callId) {
      updateCallDocument(callState.callId, {
        status: 'ended',
        durationSeconds: duration
      }).catch(() => {});
    }

    setTimeout(() => {
      onEndCall();
    }, 600);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    realtimeService.setMicrophoneMuted(nextMuted);
  };

  const handleKeypadPress = (digit: string) => {
    setKeypadInput(prev => prev + digit);
  };

  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1633]/90 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Hidden audio element for real remote WebRTC voice output */}
      <audio ref={remoteAudioRef} autoPlay />

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
              <span className="text-slate-300 animate-pulse">Calling {callState.participant.name}...</span>
            )}
            {callStatus === 'ringing' && (
              <span className="text-[#A38BFF] animate-pulse">
                {callState.isIncoming ? 'Incoming Voice Call...' : 'Ringing...'}
              </span>
            )}
            {callStatus === 'connected' && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-emerald-400 font-mono tracking-widest font-bold">
                  {formatTime(duration)}
                </span>
                <span className="text-[10px] text-emerald-300/80 uppercase tracking-wider font-semibold">
                  Live WebRTC Connected
                </span>
              </div>
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
        <div className="w-full pt-4">
          {callState.isIncoming && callStatus === 'ringing' ? (
            <div className="flex items-center justify-around">
              {/* Decline Button */}
              <button
                onClick={handleDeclineCall}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all group-hover:scale-105 active:scale-95">
                  <PhoneOff className="w-6 h-6" />
                </div>
                <span className="text-xs text-rose-300 font-semibold">Decline</span>
              </button>

              {/* Accept Button */}
              <button
                onClick={handleAcceptCall}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transition-all group-hover:scale-105 active:scale-95">
                  <Phone className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-xs text-emerald-300 font-semibold">Accept</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-around">
              {/* Mute Mic */}
              <button
                onClick={toggleMute}
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
          )}
        </div>

      </div>
    </div>
  );
};

