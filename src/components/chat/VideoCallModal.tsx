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
  Video, 
  VideoOff, 
  Share2, 
  Lock,
  Sparkles
} from 'lucide-react';

interface VideoCallModalProps {
  callState: CallSessionState | null;
  onEndCall: () => void;
  currentUser?: { id: string; name: string; avatar: string } | null;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  callState,
  onEndCall,
  currentUser
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [blurBackground, setBlurBackground] = useState(false);
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'connected' | 'ended'>(
    callState?.isIncoming ? 'ringing' : 'calling'
  );
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize and handle video call lifecycle
  useEffect(() => {
    if (!callState || !callState.active || callState.type !== 'video') return;

    const callId = callState.callId || `call_video_${Date.now()}`;
    const participantId = callState.participant.id;
    const isIncoming = !!callState.isIncoming;

    if (isIncoming) {
      setCallStatus('ringing');
      soundEffects.startRinging();
    } else {
      setCallStatus('calling');
      soundEffects.startRinging();

      if (currentUser) {
        realtimeService.initiateCall({
          callId,
          callerId: currentUser.id,
          callerName: currentUser.name,
          callerAvatar: currentUser.avatar,
          receiverId: participantId,
          receiverName: callState.participant.name,
          receiverAvatar: callState.participant.avatar,
          type: 'video'
        });
      }
    }

    // Listener: call accepted by remote peer
    const unsubAccepted = realtimeService.on('call_accepted', async (data: any) => {
      if (data.callId === callId || !data.callId) {
        soundEffects.stopRinging();
        soundEffects.playCallConnected();
        setCallStatus('connected');

        try {
          const { localStream, remoteStream } = await realtimeService.setupPeerConnection(
            participantId,
            callId,
            true,
            true // Caller
          );

          if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
          }
          if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        } catch (err) {
          console.warn('WebRTC video setup error:', err);
        }
      }
    });

    // Listener: remote stream updated with tracks
    const unsubStream = realtimeService.on('remote_stream_updated', (stream: MediaStream) => {
      if (remoteVideoRef.current && stream) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    // Listener: call declined
    const unsubDeclined = realtimeService.on('call_declined', () => {
      soundEffects.stopRinging();
      soundEffects.playCallEnded();
      setCallStatus('ended');
      setTimeout(() => onEndCall(), 1000);
    });

    // Listener: call ended
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

  if (!callState || !callState.active || callState.type !== 'video') return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = async () => {
    soundEffects.stopRinging();
    soundEffects.playCallConnected();
    setCallStatus('connected');

    const callId = callState.callId || `call_video_${Date.now()}`;
    const callerId = callState.participant.id;
    const myId = currentUser?.id || 'me';

    realtimeService.acceptCall(callId, callerId, myId);

    try {
      const { localStream, remoteStream } = await realtimeService.setupPeerConnection(
        callerId,
        callId,
        true,
        false // Receiver answering
      );

      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    } catch (err) {
      console.warn('WebRTC video answer setup error:', err);
    }
  };

  const handleDeclineCall = () => {
    soundEffects.stopRinging();
    soundEffects.playCallEnded();
    setCallStatus('ended');

    const callId = callState.callId || `call_video_${Date.now()}`;
    const callerId = callState.participant.id;
    const myId = currentUser?.id || 'me';

    realtimeService.declineCall(callId, callerId, myId);
    setTimeout(() => onEndCall(), 600);
  };

  const handleHangup = () => {
    soundEffects.stopRinging();
    soundEffects.playCallEnded();
    setCallStatus('ended');

    const callId = callState.callId || `call_video_${Date.now()}`;
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

  const toggleCamera = () => {
    const nextCameraOff = !isCameraOff;
    setIsCameraOff(nextCameraOff);
    realtimeService.setCameraDisabled(nextCameraOff);
  };

  const handleToggleScreenShare = async () => {
    if (!isScreenSharing && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } catch {
        setIsScreenSharing(false);
      }
    } else {
      setIsScreenSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1A1633]/95 backdrop-blur-2xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[760px] rounded-[32px] overflow-hidden bg-[#1A1633] text-white shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/20 flex flex-col justify-between">
        
        {/* Remote Main Video Stage */}
        <div className="absolute inset-0 z-0">
          {callStatus === 'connected' ? (
            <div className="w-full h-full relative bg-slate-950">
              {/* Real Remote WebRTC Video Element */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${blurBackground ? 'scale-105 filter blur-sm brightness-95' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1633] via-transparent to-[#1A1633]/60 pointer-events-none" />
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
                {callStatus === 'calling' 
                  ? 'Establishing secure WebRTC connection...' 
                  : (callState.isIncoming ? 'Incoming Video Call...' : 'Ringing...')}
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
              <span className="text-[10px] text-[#A38BFF] font-semibold">WebRTC HD</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl ios-glass-dark border border-white/15 text-[11px] text-slate-200">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Escrow Encrypted</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl ios-glass-dark border border-white/20 text-xs font-mono font-bold text-white shadow-md">
              {callStatus === 'connected' ? formatTime(duration) : (callState.isIncoming ? 'Incoming Call' : 'Calling...')}
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
          {callState.isIncoming && callStatus === 'ringing' ? (
            <div className="flex items-center gap-6 p-3 rounded-2xl ios-glass-dark border border-white/25 shadow-2xl">
              <button
                onClick={handleDeclineCall}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-600/40 cursor-pointer"
              >
                <PhoneOff className="w-5 h-5" />
                <span>Decline</span>
              </button>

              <button
                onClick={handleAcceptCall}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/40 cursor-pointer"
              >
                <Phone className="w-5 h-5 animate-pulse" />
                <span>Accept Video</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl ios-glass-dark border border-white/25 shadow-2xl">
              
              {/* Mic Toggle */}
              <button
                onClick={toggleMute}
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
                onClick={toggleCamera}
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
                onClick={handleToggleScreenShare}
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
          )}
        </div>

      </div>
    </div>
  );
};
