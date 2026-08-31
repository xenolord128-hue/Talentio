import React, { useState, useEffect, useRef } from 'react';
import { VoiceNoteData } from '../../types';
import { createNaturalDemoVoiceBlob, formatAudioDuration, isVoiceNoteExpired } from '../../utils/audioRecorder';
import { Play, Pause, Volume2, Clock, Trash2, ShieldAlert } from 'lucide-react';

interface VoiceNotePlayerProps {
  voiceNote: VoiceNoteData;
  isMe: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  voiceNote,
  isMe
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(voiceNote.durationSeconds || 5);
  
  const isExpired = voiceNote.isExpired || isVoiceNoteExpired(voiceNote.expiresAt, voiceNote.createdAt);
  
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fallbackUrlRef = useRef<string | null>(null);

  const defaultWaveform = voiceNote.waveform && voiceNote.waveform.length > 0
    ? voiceNote.waveform
    : [30, 45, 70, 85, 40, 60, 90, 50, 30, 80, 95, 70, 50, 35, 65, 80, 40];

  // Initialize and bind HTMLAudioElement (only if not expired)
  useEffect(() => {
    if (isExpired) return;

    let activeUrl = voiceNote.audioUrl;

    // If pre-loaded demo message without remote URL, generate clean natural audio
    if (!activeUrl) {
      try {
        const demoBlob = createNaturalDemoVoiceBlob(defaultWaveform, duration);
        const generatedUrl = URL.createObjectURL(demoBlob);
        fallbackUrlRef.current = generatedUrl;
        activeUrl = generatedUrl;
      } catch {
        activeUrl = undefined;
      }
    }

    if (!activeUrl) return;

    const audio = new Audio();
    audio.src = activeUrl;
    audio.preload = 'metadata';
    audioElementRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(Math.round(audio.duration));
      }
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime !== undefined) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);

      try {
        audio.pause();
        audio.src = '';
      } catch {
        // Ignored
      }
      audioElementRef.current = null;

      if (fallbackUrlRef.current) {
        try {
          URL.revokeObjectURL(fallbackUrlRef.current);
        } catch {
          // Ignored
        }
        fallbackUrlRef.current = null;
      }
    };
  }, [voiceNote.audioUrl]);

  const handlePlayAudio = (startFrac = 0) => {
    const audio = audioElementRef.current;
    if (!audio) return;

    try {
      const targetTime = startFrac * (duration || 1);
      if (isFinite(targetTime) && targetTime >= 0) {
        audio.currentTime = targetTime;
      }
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } catch {
      setIsPlaying(false);
    }
  };

  const handlePauseAudio = () => {
    const audio = audioElementRef.current;
    if (audio) {
      try {
        audio.pause();
      } catch {
        // Ignored
      }
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePauseAudio();
    } else {
      const frac = currentTime > 0 && currentTime < duration ? (currentTime / duration) : 0;
      handlePlayAudio(frac);
    }
  };

  const handleBarClick = (index: number) => {
    const fraction = index / defaultWaveform.length;
    const targetTime = fraction * duration;
    setCurrentTime(targetTime);

    const audio = audioElementRef.current;
    if (audio) {
      try {
        audio.currentTime = targetTime;
      } catch {
        // Ignored
      }
    }

    if (!isPlaying) {
      handlePlayAudio(fraction);
    }
  };

  const progressFraction = Math.min(1, Math.max(0, currentTime / (duration || 1)));

  if (isExpired) {
    return (
      <div className={`flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-xs select-none ${
        isMe ? 'bg-white/10 text-white/90 border border-white/15' : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}>
        <div className={`p-1.5 rounded-lg ${isMe ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
          <Clock className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold flex items-center gap-1.5">
            <span>Voice Note Expired</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
              isMe ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              15-Day Auto Clean
            </span>
          </div>
          <p className="text-[10px] opacity-75 truncate">
            Purged automatically per storage retention policy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-1 px-1 select-none min-w-[220px] sm:min-w-[260px]">
      
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md ${
          isMe
            ? 'bg-white text-[#3D2FD1] hover:bg-slate-100'
            : 'bg-[#3D2FD1] text-white hover:bg-[#6E5BFF]'
        }`}
        title={isPlaying ? 'Pause Voice Note' : 'Play Voice Note'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform Visualization */}
      <div className="flex-1 flex flex-col justify-center gap-1.5">
        <div className="flex items-center gap-[3px] h-7">
          {defaultWaveform.map((height, i) => {
            const barFraction = i / defaultWaveform.length;
            const isPassed = barFraction <= progressFraction;

            return (
              <div
                key={i}
                onClick={() => handleBarClick(i)}
                className={`flex-1 rounded-full cursor-pointer transition-all ${
                  isPassed
                    ? isMe 
                      ? 'bg-white' 
                      : 'bg-[#3D2FD1]'
                    : isMe 
                      ? 'bg-white/35 hover:bg-white/60' 
                      : 'bg-slate-300 hover:bg-slate-400'
                }`}
                style={{
                  height: `${Math.max(18, Math.min(100, height))}%`,
                  minHeight: '4px'
                }}
              />
            );
          })}
        </div>

        {/* Time duration */}
        <div className={`flex items-center justify-between text-[10px] font-mono ${
          isMe ? 'text-white/80' : 'text-slate-500'
        }`}>
          <span>{formatAudioDuration(currentTime)}</span>
          <span className="flex items-center gap-1">
            <Volume2 className="w-2.5 h-2.5 opacity-70" />
            <span>{formatAudioDuration(duration)}</span>
          </span>
        </div>
      </div>

    </div>
  );
};

