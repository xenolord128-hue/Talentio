import React, { useState, useEffect, useRef } from 'react';
import { ConversationParticipant, CallSessionState } from '../../types';
import { soundEffects } from '../../utils/audioEffects';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  SwitchCamera, 
  Share2, 
  Maximize2, 
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';

interface VideoCallModalProps {
  callState: CallSessionState | null;
  onEndCall: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  callState,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [blurBackground, setBlurBackground] = useState(true);
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'connected' | 'ended'>('calling');
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!callState || !callState.active || callState.type !== 'video') return;

    setCallStatus('calling');
    setDuration(0);

    const ringTimer = setTimeout(() => {
      setCallStatus('ringing');
      soundEffects.startRinging();
    }, 1000);

    const connectTimer = setTimeout(() => {
      soundEffects.playCallConnected();
      setCallStatus('connected');
    }, 3800);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
      soundEffects.stopRinging();
    };
  }, [callState?.active, callState?.type]);

  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  // Optional local camera feed via navigator.mediaDevices if available
  useEffect(() => {
    if (!isCameraOff && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera permission denied or not available, fallback to mock video visual
        });
    }

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraOff, callState?.active]);

  if (!callState || !callState.active || callState.type !== 'video') return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1A1633]/95 backdrop-blur-2xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[760px] rounded-[32px] overflow-hidden bg-[#1A1633] text-white shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/20 flex flex-col justify-between">
        
        {/* Remote Main Video Stage */}
        <div className="absolute inset-0 z-0">
          {callStatus === 'connected' ? (
            <div className="w-full h-full relative">
              <img
                src={callState.participant.avatar}
                alt={callState.participant.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${blurBackground ? 'scale-105 filter brightness-95' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1633] via-transparent to-[#1A1633]/60" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1633] via-[#3D2FD1]/20 to-[#1A1633]">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-[#6E5BFF] shadow-2xl animate-pulse">
                  <img
                    src={callState.participant.avatar}
                    alt={callState.participant.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">{callState.participant.name}</h3>
              <p className="text-xs text-[#A38BFF] mt-1">
                {callStatus === 'calling' ? 'Establishing secure video link...' : 'Ringing...'}
              </p>
            </div>
          )}
        </div>

        {/* Top Video HUD Bar */}
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl ios-glass-dark border border-white/20 flex items-center gap-2 px-3 py-1.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">
                {callState.participant.name}
              </span>
              <span className="text-[10px] text-[#A38BFF] font-semibold">1080p HD</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl ios-glass-dark border border-white/15 text-[11px] text-slate-200">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Escrow Encrypted</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl ios-glass-dark border border-white/20 text-xs font-mono font-bold text-white shadow-md">
              {callStatus === 'connected' ? formatTime(duration) : 'Connecting...'}
            </div>
          </div>
        </div>

        {/* Floating Local PiP Camera Window */}
        <div className="relative z-10 self-end mr-4 sm:mr-6 mb-2">
          <div className="w-28 h-36 sm:w-40 sm:h-52 rounded-2xl overflow-hidden ios-glass border-2 border-white/40 shadow-2xl relative bg-black/40">
            {!isCameraOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <VideoOff className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-[10px] font-semibold">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white backdrop-blur-sm">
              You
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl ios-glass-dark border border-white/25 shadow-2xl">
            
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isCameraOff 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Background Blur */}
            <button
              onClick={() => setBlurBackground(!blurBackground)}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                blurBackground 
                  ? 'bg-[#3D2FD1] text-white' 
                  : 'bg-white/15 hover:bg-white/25 text-slate-300'
              }`}
              title="Studio Blur Effect"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`hidden sm:flex w-11 h-11 sm:w-12 sm:h-12 rounded-xl items-center justify-center transition-all cursor-pointer ${
                isScreenSharing 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              title="Share Screen"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* End Video Call */}
            <button
              onClick={handleHangup}
              className="w-12 h-12 sm:w-14 sm:h-12 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="End Video Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
