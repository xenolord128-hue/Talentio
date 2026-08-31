// Professional Voice Recording & Audio Utilities for Talentio Marketplace

export interface SupportedAudioFormat {
  mimeType: string;
  extension: string;
}

/**
 * Checks if the current context is secure (HTTPS or localhost).
 */
export function isSecureAudioContext(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.isSecureContext) return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

/**
 * Checks if the browser supports mediaDevices and getUserMedia.
 */
export function isMediaDevicesSupported(): boolean {
  return typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function';
}

/**
 * Priority list of audio MIME types for MediaRecorder.
 * Prefer Opus inside WebM, then generic WebM, OGG, MP4, AAC.
 */
const PREFERRED_MIME_TYPES: SupportedAudioFormat[] = [
  { mimeType: 'audio/webm;codecs=opus', extension: 'webm' },
  { mimeType: 'audio/webm', extension: 'webm' },
  { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
  { mimeType: 'audio/ogg', extension: 'ogg' },
  { mimeType: 'audio/mp4;codecs=opus', extension: 'mp4' },
  { mimeType: 'audio/mp4', extension: 'mp4' },
  { mimeType: 'audio/aac', extension: 'aac' }
];

/**
 * Detects the best browser-supported MIME type safely using MediaRecorder.isTypeSupported.
 * Never throws.
 */
export function getSupportedAudioMimeType(): SupportedAudioFormat {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return { mimeType: '', extension: 'webm' };
  }

  for (const format of PREFERRED_MIME_TYPES) {
    try {
      if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(format.mimeType)) {
        return format;
      }
    } catch {
      // Continue search if isTypeSupported fails
    }
  }

  return { mimeType: '', extension: 'webm' };
}

/**
 * Safe browser-compatible audio constraints for natural speech without distortion.
 * Avoid forcing rigid sample rates or strict channel counts so the browser can negotiate properly.
 */
export function getStandardAudioConstraints(): MediaStreamConstraints {
  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  };
}

export type PermissionCheckResult = 'granted' | 'prompt' | 'denied' | 'unsupported';

/**
 * Inspects microphone permission status without triggering a prompt if Permissions API is available.
 */
export async function checkMicrophonePermissionState(): Promise<PermissionCheckResult> {
  if (typeof navigator === 'undefined' || !navigator.permissions || typeof navigator.permissions.query !== 'function') {
    return 'unsupported';
  }

  try {
    const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return status.state as PermissionCheckResult;
  } catch {
    return 'unsupported';
  }
}

export interface StreamAcquisitionResult {
  stream: MediaStream;
}

/**
 * Requests microphone access safely using standard Web APIs.
 * Differentiates exact errors without masking them behind generic messages.
 */
export async function requestAuthoritativeMicrophoneStream(): Promise<MediaStream> {
  // 1. Secure context check
  if (!isSecureAudioContext()) {
    const err = new Error('INSECURE_CONTEXT');
    err.name = 'InsecureContextError';
    throw err;
  }

  // 2. Browser MediaDevices support check
  if (!isMediaDevicesSupported()) {
    const err = new Error('NOT_SUPPORTED');
    err.name = 'NotSupportedError';
    throw err;
  }

  // 3. Request audio stream with natural speech constraints first
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[VoiceRecorder] Requesting getUserMedia with echoCancellation & noiseSuppression...');
    }

    const stream = await navigator.mediaDevices.getUserMedia(getStandardAudioConstraints());
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[VoiceRecorder] getUserMedia success, active tracks:', stream.getAudioTracks().length);
    }
    return stream;
  } catch (primaryErr: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[VoiceRecorder] Primary getUserMedia failed:', primaryErr?.name, primaryErr?.message);
    }

    // If constraint error, fallback to raw audio: true
    if (primaryErr?.name === 'OverconstrainedError' || primaryErr?.name === 'ConstraintNotSatisfiedError') {
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[VoiceRecorder] Retrying with generic { audio: true } constraint...');
        }
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return fallbackStream;
      } catch (fallbackErr: any) {
        throw fallbackErr;
      }
    }

    // Rethrow authoritative error
    throw primaryErr;
  }
}

/**
 * Completely stops all audio tracks in a MediaStream to immediately release the device microphone.
 */
export function stopMediaStream(stream: MediaStream | null) {
  if (!stream) return;
  try {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
        if (process.env.NODE_ENV !== 'production') {
          console.log('[VoiceRecorder] Track stopped:', track.id, track.label);
        }
      } catch {
        // Ignored
      }
    });
  } catch {
    // Ignored
  }
}

/**
 * Formats duration in seconds to standard mm:ss format.
 */
export function formatAudioDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getVoiceNoteExpirationDate(days = 15): string {
  const expiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return expiry.toISOString();
}

/**
 * Checks if a voice note has passed the 15-day automated storage retention limit.
 */
export function isVoiceNoteExpired(expiresAt?: string, createdAt?: string): boolean {
  if (expiresAt) {
    return new Date(expiresAt).getTime() <= Date.now();
  }
  if (createdAt) {
    const createdTime = new Date(createdAt).getTime();
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
    return createdTime + fifteenDaysMs <= Date.now();
  }
  return false;
}

/**
 * Human-readable message helper for microphone errors.
 */
export function getMicrophoneErrorMessage(err: any): { message: string; type: 'error' | 'warning' } {
  const name = err?.name || '';
  const message = err?.message || '';

  if (name === 'InsecureContextError' || message === 'INSECURE_CONTEXT') {
    return {
      message: 'Microphone access requires HTTPS. Please open Talentio using a secure HTTPS connection.',
      type: 'error'
    };
  }

  if (name === 'NotSupportedError' || message === 'NOT_SUPPORTED') {
    return {
      message: 'Voice recording is not supported by this browser.',
      type: 'error'
    };
  }

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || message === 'PERMISSION_DENIED') {
    return {
      message: 'Microphone permission was denied. Please allow microphone access in your browser settings and try again.',
      type: 'warning'
    };
  }

  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return {
      message: 'No microphone was found on this device. Please connect a microphone and try again.',
      type: 'error'
    };
  }

  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return {
      message: 'Microphone is currently unavailable or in use by another application. Please close other audio apps and try again.',
      type: 'warning'
    };
  }

  if (name === 'SecurityError') {
    return {
      message: 'Microphone access is blocked by browser security policy (HTTPS required).',
      type: 'error'
    };
  }

  if (name === 'AbortError') {
    return {
      message: 'Microphone request was cancelled.',
      type: 'warning'
    };
  }

  return {
    message: 'Unable to start voice recording. Please check your microphone settings.',
    type: 'warning'
  };
}

/**
 * Generates a clean, natural harmonic speech tone audio track ONLY for pre-recorded demo voice notes
 * when no remote audio URL is supplied. NEVER to be used as a fallback for real live microphone recording.
 */
export function createNaturalDemoVoiceBlob(waveform: number[], durationSec: number): Blob {
  const sampleRate = 44100;
  const totalSamples = Math.floor(sampleRate * Math.max(2, durationSec));
  const numChannels = 1;

  // WAV header + 16-bit PCM mono data
  const buffer = new ArrayBuffer(44 + totalSamples * 2);
  const view = new DataView(buffer);

  // Write WAV Header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + totalSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Format PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, totalSamples * 2, true);

  const numBars = waveform.length || 16;
  const samplesPerBar = Math.floor(totalSamples / numBars);

  for (let i = 0; i < totalSamples; i++) {
    const barIdx = Math.min(numBars - 1, Math.floor(i / samplesPerBar));
    const energy = ((waveform[barIdx] || 50) / 100);
    
    // Fundamental human speech frequency range (140Hz - 200Hz)
    const baseFreq = 145 + energy * 40;
    const t = i / sampleRate;

    // Smooth envelope per bar to mimic human speech cadence
    const barProgress = (i % samplesPerBar) / samplesPerBar;
    const cadenceEnvelope = Math.sin(barProgress * Math.PI);

    // Warm harmonics: pure sine fundamental + gentle octave harmonic
    const sample = 
      (Math.sin(2 * Math.PI * baseFreq * t) * 0.6 +
       Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.25 +
       Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.1) *
      energy * cadenceEnvelope * 0.25;

    // Overall global fade-in / fade-out
    const globalFade = Math.min(1, i / 2000) * Math.min(1, (totalSamples - i) / 2000);
    const finalSample = Math.max(-1, Math.min(1, sample * globalFade));

    // Convert to 16-bit PCM
    const pcm16 = finalSample < 0 ? finalSample * 0x8000 : finalSample * 0x7FFF;
    view.setInt16(44 + i * 2, Math.floor(pcm16), true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
