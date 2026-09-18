/**
 * Talentio Global Microphone & Media Hardware Resource Manager
 * 
 * Guarantees that active microphone tracks, MediaRecorders, SpeechRecognizers,
 * and AudioContexts are 100% released and never leak across route transitions,
 * mobile app backgrounding, page reloads, or browser back/forward events.
 */

class MicrophoneResourceManager {
  private activeStreams = new Set<MediaStream>();
  private activeRecorders = new Set<MediaRecorder>();
  private activeRecognitions = new Set<any>();
  private activeAudioContexts = new Set<AudioContext>();
  private listenersAttached = false;

  constructor() {
    this.initGlobalListeners();
  }

  private initGlobalListeners() {
    if (typeof window === 'undefined' || this.listenersAttached) return;

    const handleRelease = () => {
      this.releaseAll();
    };

    // When browser tab/window is hidden, backgrounded on mobile, or user navigates back
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleRelease();
      }
    });

    window.addEventListener('pagehide', handleRelease);
    window.addEventListener('beforeunload', handleRelease);
    window.addEventListener('popstate', handleRelease);

    this.listenersAttached = true;
  }

  /**
   * Register an active MediaStream. Returns an unregister cleanup function.
   */
  public registerStream(stream: MediaStream): () => void {
    if (!stream) return () => {};
    this.activeStreams.add(stream);

    // Also listen to track ended events
    stream.getTracks().forEach((track) => {
      track.addEventListener('ended', () => {
        const hasLiveTracks = stream.getTracks().some(t => t.readyState === 'live');
        if (!hasLiveTracks) {
          this.activeStreams.delete(stream);
        }
      }, { once: true });
    });

    return () => {
      this.stopStream(stream);
      this.activeStreams.delete(stream);
    };
  }

  /**
   * Register an active MediaRecorder. Returns an unregister cleanup function.
   */
  public registerRecorder(recorder: MediaRecorder): () => void {
    if (!recorder) return () => {};
    this.activeRecorders.add(recorder);

    return () => {
      this.stopRecorder(recorder);
      this.activeRecorders.delete(recorder);
    };
  }

  /**
   * Register an active SpeechRecognition instance. Returns an unregister cleanup function.
   */
  public registerRecognition(rec: any): () => void {
    if (!rec) return () => {};
    this.activeRecognitions.add(rec);

    return () => {
      this.abortRecognition(rec);
      this.activeRecognitions.delete(rec);
    };
  }

  /**
   * Register an active AudioContext. Returns an unregister cleanup function.
   */
  public registerAudioContext(ctx: AudioContext): () => void {
    if (!ctx) return () => {};
    this.activeAudioContexts.add(ctx);

    return () => {
      this.closeAudioContext(ctx);
      this.activeAudioContexts.delete(ctx);
    };
  }

  /**
   * Completely stops all tracks of a specific MediaStream and detaches them.
   */
  public stopStream(stream: MediaStream | null) {
    if (!stream) return;
    try {
      stream.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch {
          // Ignored
        }
        try {
          stream.removeTrack(track);
        } catch {
          // Ignored
        }
      });
    } catch {
      // Ignored
    } finally {
      this.activeStreams.delete(stream);
    }
  }

  /**
   * Gracefully stops a MediaRecorder.
   */
  public stopRecorder(recorder: MediaRecorder | null) {
    if (!recorder) return;
    try {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    } catch {
      // Ignored
    } finally {
      this.activeRecorders.delete(recorder);
    }
  }

  /**
   * Aborts a SpeechRecognition instance to immediately free audio hardware.
   */
  public abortRecognition(rec: any) {
    if (!rec) return;
    try {
      rec.onstart = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.abort();
    } catch {
      // Ignored
    } finally {
      this.activeRecognitions.delete(rec);
    }
  }

  /**
   * Closes an AudioContext.
   */
  public closeAudioContext(ctx: AudioContext | null) {
    if (!ctx) return;
    try {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    } catch {
      // Ignored
    } finally {
      this.activeAudioContexts.delete(ctx);
    }
  }

  /**
   * Releases ALL media resources across the entire application immediately.
   * Call this prior to starting a new audio capture session or upon route/page departure.
   */
  public releaseAll() {
    // 1. Recorders first so they don't throw on stream stop
    this.activeRecorders.forEach((rec) => {
      this.stopRecorder(rec);
    });
    this.activeRecorders.clear();

    // 2. Speech Recognizers
    this.activeRecognitions.forEach((rec) => {
      this.abortRecognition(rec);
    });
    this.activeRecognitions.clear();

    // 3. Audio Contexts
    this.activeAudioContexts.forEach((ctx) => {
      this.closeAudioContext(ctx);
    });
    this.activeAudioContexts.clear();

    // 4. MediaStreams
    this.activeStreams.forEach((stream) => {
      this.stopStream(stream);
    });
    this.activeStreams.clear();

    // 5. Notify any listening UI components
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('talentio-microphone-released'));
      } catch {
        // Ignored
      }
    }
  }

  public isBusy(): boolean {
    return this.activeStreams.size > 0 || this.activeRecorders.size > 0 || this.activeRecognitions.size > 0;
  }
}

// Global Singleton Instance
export const microphoneManager = new MicrophoneResourceManager();
