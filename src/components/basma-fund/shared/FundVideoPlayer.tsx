import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaRedo,
  FaExclamationTriangle,
  FaEye,
  FaClock,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useVideoAccess } from '../../../hooks/useVideoAccess';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';

export type VideoPlayerState =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'expired';

interface FundVideoPlayerProps {
  token: string;
  thumbnailUrl?: string | null;
  onError?: (code: string | undefined) => void;
  onStarted?: () => void;
  onSessionExpired?: () => void;
  onStateChange?: (state: VideoPlayerState) => void;
}

const SESSION_WINDOW_SECONDS = 5 * 60;

const FundVideoPlayer = ({
  token,
  thumbnailUrl,
  onError,
  onStarted,
  onSessionExpired,
  onStateChange,
}: FundVideoPlayerProps) => {
  const navigate = useNavigate();

  const {
    status,
    loading,
    starting,
    errorCode,
    errorLabel,
    isPlayable,
    hasError,
    streamUrl,
    startView,
  } = useVideoAccess(token);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [ended, setEnded] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);

  const [sessionRemaining, setSessionRemaining] = useState<number | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================
  // Notify parent of state
  // ============================================
  useEffect(() => {
    if (!onStateChange) return;
    let s: VideoPlayerState = 'idle';
    if (sessionExpired) s = 'expired';
    else if (!ready) s = 'idle';
    else if (!videoLoaded) s = 'loading';
    else if (ended) s = 'ended';
    else if (playing) s = 'playing';
    else s = 'paused';
    onStateChange(s);
  }, [onStateChange, sessionExpired, ready, videoLoaded, ended, playing]);

  // ============================================
  // Notify parent of errors
  // ============================================
  useEffect(() => {
    if (hasError && onError) onError(errorCode);
  }, [hasError, errorCode, onError]);

  // ============================================
  // Fullscreen listener
  // ============================================
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ============================================
  // Cleanup
  // ============================================
  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      const video = videoRef.current;
      if (video) {
        try {
          video.pause();
          video.removeAttribute('src');
          video.load();
        } catch {
          /* silent */
        }
      }
    };
  }, []);

  // ============================================
  // Session countdown
  //
  // ✅ On expiry: navigate to /basma-fund (no reload)
  // ============================================
  const startSessionCountdown = useCallback(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);

    const deadline = Date.now() + SESSION_WINDOW_SECONDS * 1000;
    setSessionRemaining(SESSION_WINDOW_SECONDS);

    sessionTimerRef.current = setInterval(() => {
      const remainingSec = Math.max(
        0,
        Math.round((deadline - Date.now()) / 1000)
      );
      setSessionRemaining(remainingSec);

      if (remainingSec <= 0) {
        if (sessionTimerRef.current) {
          clearInterval(sessionTimerRef.current);
          sessionTimerRef.current = null;
        }
        setSessionExpired(true);

        const video = videoRef.current;
        if (video) {
          try {
            video.pause();
          } catch {
            /* silent */
          }
        }

        onSessionExpired?.();

        toast.info(
          'انتهت جلسة المشاهدة (5 دقائق). سيتم تحويلك إلى صفحة الصندوق.',
          { autoClose: 4000 }
        );

        // ✅ Redirect to Basma Fund page instead of reloading
        setTimeout(() => {
          navigate('/basma-fund', { replace: true });
        }, 800);
      }
    }, 1000);
  }, [onSessionExpired, navigate]);

  // ============================================
  // Auto-hide controls
  // ============================================
  const showControls = useCallback(() => {
    if (sessionExpired) return;
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [playing, sessionExpired]);

  // ============================================
  // Handlers
  // ============================================
  const handleStartAndPlay = async () => {
    if (starting || !isPlayable) return;
    setStartError(null);

    const result = await startView();
    if (!result) {
      setStartError('تعذّر بدء المشاهدة');
      toast.error('تعذّر بدء المشاهدة، حاول مرة أخرى');
      return;
    }

    onStarted?.();
    setReady(true);
    startSessionCountdown();
  };

  const handleLoadedData = () => {
    setVideoLoaded(true);
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      console.log('Autoplay blocked');
    });
  };

  const togglePlay = () => {
    if (sessionExpired) return;
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      // ✅ When user resumes from an ended state, treat as replay
      // and hide the replay overlay
      if (ended) setEnded(false);
      video.play();
    } else {
      video.pause();
    }
    showControls();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sessionExpired) return;
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleReplay = () => {
    if (sessionExpired) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setEnded(false);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };

  // ============================================
  // Helpers
  // ============================================
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const formatCountdown = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;
  const volumePercent = muted ? 0 : volume;

  // ============================================
  // ERROR
  // ============================================
  if (hasError) {
    return (
      <div
        style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem) 1.25rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(220,53,69,0.06)',
          border: '1px solid rgba(220,53,69,0.25)',
          textAlign: 'center',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(220,53,69,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}
        >
          <FaExclamationTriangle size={26} color="#DC3545" />
        </div>
        <div
          style={{
            color: '#DC3545',
            fontSize: '0.95rem',
            fontWeight: 800,
            marginBottom: '6px',
          }}
        >
          {errorLabel || 'تعذّر تحميل الفيديو'}
        </div>
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            lineHeight: 1.6,
          }}
        >
          تواصل مع المنصة إن كنت بحاجة إلى رابط جديد.
        </div>
      </div>
    );
  }

  // ============================================
  // LOADING
  // ============================================
  if (loading && !status) {
    return (
      <div
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '16px',
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: `3px solid rgba(255,255,255,0.15)`,
            borderTopColor: FUND_THEME.accent,
          }}
        />
        <span
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '0.8rem',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          جاري التحقق من الرابط...
        </span>
      </div>
    );
  }

  // ============================================
  // PLAYER
  // ============================================
  return (
    <div
      ref={containerRef}
      onMouseMove={showControls}
      onMouseLeave={() => playing && setControlsVisible(false)}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        backgroundColor: '#000',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        cursor: controlsVisible ? 'default' : 'none',
      }}
    >
      {/* Blurred thumbnail behind video — before it loads */}
      {thumbnailUrl && !videoLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(14px) brightness(0.45)',
            transform: 'scale(1.15)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      <video
        ref={videoRef}
        src={ready ? streamUrl : undefined}
        playsInline
        muted={muted}
        crossOrigin="use-credentials"
        preload="auto"
        onLoadedData={handleLoadedData}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime || 0);
          if (e.currentTarget.buffered.length > 0) {
            setBuffered(
              e.currentTarget.buffered.end(
                e.currentTarget.buffered.length - 1
              )
            );
          }
        }}
        onPlay={() => {
          setPlaying(true);
          // ✅ If user resumes from the ended overlay via the native controls,
          // hide the replay overlay immediately
          if (ended) setEnded(false);
          showControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
        }}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
          setControlsVisible(true);
        }}
        onClick={togglePlay}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          backgroundColor: ready ? '#000' : 'transparent',
          zIndex: 1,
        }}
      />

      {/* Start overlay */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(10px, 2vw, 16px)',
              backgroundColor: thumbnailUrl
                ? 'rgba(0,0,0,0.35)'
                : 'rgba(0,0,0,0.6)',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              textAlign: 'center',
              zIndex: 2,
            }}
          >
            <motion.button
              type="button"
              onClick={handleStartAndPlay}
              disabled={starting || !isPlayable}
              whileHover={!starting && isPlayable ? { scale: 1.08 } : {}}
              whileTap={!starting && isPlayable ? { scale: 0.94 } : {}}
              className="fund-video-ctrl-btn fund-video-play-overlay"
              style={{
                width: 'clamp(64px, 14vw, 84px)',
                height: 'clamp(64px, 14vw, 84px)',
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.35)',
                backgroundColor: 'rgba(255,255,255,0.98)',
                color: FUND_THEME.accent,
                cursor: starting || !isPlayable ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 12px 36px ${FUND_THEME.shadow}, 0 0 0 clamp(6px, 1.5vw, 10px) rgba(23,162,184,0.15)`,
                position: 'relative',
                opacity: starting || !isPlayable ? 0.7 : 1,
              }}
            >
              {!starting && isPlayable && (
                <motion.span
                  animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    inset: -3,
                    borderRadius: '50%',
                    border: `2px solid ${FUND_THEME.accent}`,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {starting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    width: 'clamp(24px, 5vw, 30px)',
                    height: 'clamp(24px, 5vw, 30px)',
                    borderRadius: '50%',
                    border: '3px solid rgba(23,162,184,0.25)',
                    borderTopColor: FUND_THEME.accent,
                  }}
                />
              ) : (
                <FaPlay
                  size={28}
                  style={{
                    marginLeft: '5px',
                    fontSize: 'clamp(22px, 5vw, 30px)',
                  }}
                />
              )}
            </motion.button>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(0.82rem, 2.5vw, 0.95rem)',
                  fontWeight: 800,
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {starting
                  ? 'جاري التحضير...'
                  : !isPlayable
                  ? 'جارٍ التحقق من الرابط...'
                  : 'اضغط لتشغيل الفيديو'}
              </span>

              {status && !starting && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    border: '1px solid rgba(255,255,255,0.28)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    fontSize: 'clamp(0.65rem, 2vw, 0.72rem)',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  <FaEye size={10} />
                  مشاهدة واحدة
                </span>
              )}

              {startError && (
                <span
                  style={{
                    color: '#FFB800',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    marginTop: '4px',
                  }}
                >
                  {startError}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading after start */}
      <AnimatePresence>
        {ready && !videoLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 3,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `3px solid rgba(255,255,255,0.15)`,
                borderTopColor: FUND_THEME.accent,
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              جاري تحميل الفيديو...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session countdown chip */}
      {ready && videoLoaded && !sessionExpired && sessionRemaining !== null && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor:
              sessionRemaining <= 60
                ? 'rgba(220,53,69,0.9)'
                : 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            fontSize: 'clamp(0.62rem, 1.8vw, 0.72rem)',
            fontWeight: 700,
            fontFamily: 'system-ui, sans-serif',
            fontVariantNumeric: 'tabular-nums',
            zIndex: 5,
            border:
              sessionRemaining <= 60
                ? '1px solid rgba(255,255,255,0.3)'
                : '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <FaClock size={10} />
          {formatCountdown(sessionRemaining)}
        </div>
      )}

      {/* Replay overlay — shows only when video ended AND user hasn't resumed */}
      <AnimatePresence>
        {ended && ready && !sessionExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 4,
            }}
          >
            <motion.button
              type="button"
              onClick={handleReplay}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="fund-video-ctrl-btn fund-video-replay-overlay"
              style={{
                width: 'clamp(60px, 12vw, 72px)',
                height: 'clamp(60px, 12vw, 72px)',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.35)',
                backgroundColor: 'rgba(255,255,255,0.95)',
                color: FUND_THEME.accent,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}
            >
              <FaRedo size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom controls */}
      <AnimatePresence>
        {ready &&
          videoLoaded &&
          controlsVisible &&
          !sessionExpired && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding:
                  'clamp(12px, 3vw, 20px) clamp(10px, 2.5vw, 16px) clamp(8px, 2vw, 12px)',
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontFamily: 'Cairo, sans-serif',
                zIndex: 6,
              }}
            >
              {/* Seek bar */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '5px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${bufferedPercent}%`,
                    backgroundColor: 'rgba(255,255,255,0.35)',
                    borderRadius: '3px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: FUND_THEME.gradient,
                    borderRadius: '3px',
                  }}
                />
                <motion.div
                  animate={{ scale: playing ? 1.3 : 1 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${progressPercent}%`,
                    width: '14px',
                    height: '14px',
                    marginTop: '-7px',
                    marginLeft: '-7px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: `0 0 0 3px ${FUND_THEME.accent}`,
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  step="0.1"
                  aria-label="التقدم في الفيديو"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    margin: 0,
                    padding: 0,
                    direction: 'ltr',
                  }}
                />
              </div>

              {/* Controls row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(6px, 1.5vw, 10px)',
                  color: '#FFFFFF',
                  flexWrap: 'nowrap',
                }}
              >
                {/* Play/Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? 'إيقاف' : 'تشغيل'}
                  className="fund-video-ctrl-btn"
                  style={controlBtnStyle}
                >
                  {playing ? <FaPause size={11} /> : <FaPlay size={11} />}
                </button>

                {/* Time */}
                <span
                  style={{
                    fontSize: 'clamp(0.62rem, 1.8vw, 0.72rem)',
                    fontFamily: 'system-ui, sans-serif',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'rgba(255,255,255,0.9)',
                    whiteSpace: 'nowrap',
                    direction: 'ltr',
                  }}
                >
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div style={{ flex: 1 }} />

                {/* Volume group */}
                <div
                  className="fund-video-volume-group"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    direction: 'ltr',
                  }}
                >
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? 'إلغاء الكتم' : 'كتم الصوت'}
                    className="fund-video-ctrl-btn"
                    style={controlBtnStyle}
                  >
                    {muted ? (
                      <FaVolumeMute size={11} />
                    ) : (
                      <FaVolumeUp size={11} />
                    )}
                  </button>

                  <input
                    className="fund-video-volume-slider"
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volumePercent}
                    onChange={handleVolumeChange}
                    aria-label="مستوى الصوت"
                    style={{
                      width: '70px',
                      height: '4px',
                      appearance: 'none',
                      borderRadius: '2px',
                      outline: 'none',
                      cursor: 'pointer',
                      background: `linear-gradient(to right, ${FUND_THEME.accent} 0%, ${FUND_THEME.accent} ${volumePercent * 100}%, rgba(255,255,255,0.25) ${volumePercent * 100}%, rgba(255,255,255,0.25) 100%)`,
                      direction: 'ltr',
                    }}
                  />
                </div>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={fullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
                  className="fund-video-ctrl-btn"
                  style={controlBtnStyle}
                >
                  {fullscreen ? (
                    <FaCompress size={11} />
                  ) : (
                    <FaExpand size={11} />
                  )}
                </button>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Watermark */}
      {videoLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '4px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 'clamp(0.6rem, 1.6vw, 0.68rem)',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
            letterSpacing: '0.3px',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          بصمة · صندوق التبرعات
        </div>
      )}

      <style>{`
        /* ============================================ */
        /* Control buttons — ALWAYS WHITE, on every state */
        /* ============================================ */
        .fund-video-ctrl-btn,
        .fund-video-ctrl-btn:link,
        .fund-video-ctrl-btn:visited,
        .fund-video-ctrl-btn:hover,
        .fund-video-ctrl-btn:focus,
        .fund-video-ctrl-btn:focus-visible,
        .fund-video-ctrl-btn:active {
          color: #FFFFFF !important;
          outline: none !important;
          text-decoration: none !important;
        }
        .fund-video-ctrl-btn:hover {
          background-color: rgba(255,255,255,0.22) !important;
        }
        .fund-video-ctrl-btn svg,
        .fund-video-ctrl-btn svg path {
          color: #FFFFFF !important;
          fill: #FFFFFF !important;
        }

        /* Play overlay button keeps its own color */
        .fund-video-play-overlay,
        .fund-video-play-overlay:link,
        .fund-video-play-overlay:visited,
        .fund-video-play-overlay:hover,
        .fund-video-play-overlay:focus,
        .fund-video-play-overlay:active {
          color: ${FUND_THEME.accent} !important;
        }
        .fund-video-play-overlay svg,
        .fund-video-play-overlay svg path {
          color: ${FUND_THEME.accent} !important;
          fill: ${FUND_THEME.accent} !important;
        }

        /* Replay overlay button keeps its own color */
        .fund-video-replay-overlay,
        .fund-video-replay-overlay:link,
        .fund-video-replay-overlay:visited,
        .fund-video-replay-overlay:hover,
        .fund-video-replay-overlay:focus,
        .fund-video-replay-overlay:active {
          color: ${FUND_THEME.accent} !important;
        }
        .fund-video-replay-overlay svg,
        .fund-video-replay-overlay svg path {
          color: ${FUND_THEME.accent} !important;
          fill: ${FUND_THEME.accent} !important;
        }

        /* ============================================ */
        /* Range inputs                                */
        /* ============================================ */
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${FUND_THEME.accent};
          cursor: pointer;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }
        input[type='range']::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${FUND_THEME.accent};
          cursor: pointer;
          border: 2px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        @media (max-width: 480px) {
          .fund-video-volume-slider {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const controlBtnStyle: React.CSSProperties = {
  width: 'clamp(30px, 8vw, 34px)',
  height: 'clamp(30px, 8vw, 34px)',
  borderRadius: '9px',
  border: 'none',
  backgroundColor: 'rgba(255,255,255,0.12)',
  color: '#FFFFFF',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(6px)',
  transition: 'background-color 0.2s ease',
  flexShrink: 0,
};

export default FundVideoPlayer;