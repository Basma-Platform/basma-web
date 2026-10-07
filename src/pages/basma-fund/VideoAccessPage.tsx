import { useEffect, useState, useCallback, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowRight,
  FaVideo,
  FaExclamationTriangle,
  FaShieldAlt,
  FaWhatsapp,
  FaEye,
  FaPlayCircle,
  FaPauseCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import SEO from '../../components/SEO';

import {
  FundVideoUnavailableState,
  FundVideoPlayer,
} from '../../components/basma-fund/shared';
import type { VideoPlayerState } from '../../components/basma-fund/shared/FundVideoPlayer';
import { useDonationContact } from '../../hooks/useDonationContact';
import { useVideoAccess } from '../../hooks/useVideoAccess';

import { FUND_THEME } from '../../utils/helpRequestHelpers';

const VideoAccessPage = () => {
  const { token } = useParams<{ token: string }>();
  const { contact } = useDonationContact();

  // Fetch status in the page so we can pass thumbnail to the player
  const { status: pageStatus } = useVideoAccess(token);

  const [externalError, setExternalError] = useState<string | undefined>(
    undefined
  );
  const [playerState, setPlayerState] = useState<VideoPlayerState>('idle');
  const stateResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================
  // Handlers
  // ============================================
  const handlePlayerError = useCallback((code: string | undefined) => {
    setExternalError(code);
  }, []);

  const handleStateChange = useCallback((state: VideoPlayerState) => {
    setPlayerState(state);
  }, []);

  const handleSessionExpired = useCallback(() => {
    // Only update local state.
    // The FundVideoPlayer itself navigates to /basma-fund on expiry.
    setPlayerState('expired');
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      if (stateResetRef.current) clearTimeout(stateResetRef.current);
    };
  }, []);

  // ============================================
  // Video status label — dynamic
  // ============================================
  const getVideoStatusLabel = (): {
    label: string;
    color: string;
    Icon: typeof FaEye;
  } => {
    switch (playerState) {
      case 'playing':
        return {
          label: 'جاري المشاهدة',
          color: '#28A745',
          Icon: FaPlayCircle,
        };
      case 'paused':
        return {
          label: 'متوقف مؤقتاً',
          color: '#FFC107',
          Icon: FaPauseCircle,
        };
      case 'ended':
        return {
          label: 'انتهت المشاهدة',
          color: '#17A2B8',
          Icon: FaCheckCircle,
        };
      case 'expired':
        return {
          label: 'انتهت الجلسة',
          color: '#DC3545',
          Icon: FaExclamationTriangle,
        };
      case 'loading':
        return {
          label: 'جاري التحميل',
          color: '#17A2B8',
          Icon: FaEye,
        };
      default:
        return {
          label: 'جاهز للبدء',
          color: 'var(--text-muted)',
          Icon: FaEye,
        };
    }
  };

  const videoStatus = getVideoStatusLabel();
  const StatusIcon = videoStatus.Icon;

  // ============================================
  // Error state
  // ============================================
  if (externalError) {
    return (
      <>
        <SEO title="مشاهدة الفيديو | صندوق بصمة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '2rem',
            paddingBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          dir="rtl"
        >
          <Container className="px-3 px-md-4" style={{ maxWidth: '600px' }}>
            <FundVideoUnavailableState
              errorCode={externalError}
              contact={contact}
            />
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="مشاهدة الفيديو | صندوق بصمة"
        description="مشاهدة الفيديو التوضيحي لطلب المساعدة"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: 'clamp(1.5rem, 4vw, 2rem)',
          paddingBottom: 'clamp(2rem, 5vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        dir="rtl"
      >
        <Container className="px-3 px-md-4" style={{ maxWidth: '900px' }}>
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              fontFamily: 'Cairo, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/basma-fund"
              style={{
                color: FUND_THEME.accent,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              صندوق بصمة
            </Link>
            <span style={{ opacity: 0.5 }}>/</span>
            <span style={{ opacity: 0.75 }}>مشاهدة الفيديو</span>
          </motion.nav>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'clamp(16px, 3vw, 22px)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 12px 40px var(--shadow-md)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding:
                  'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.5rem) clamp(0.85rem, 2.5vw, 1rem)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: 'clamp(40px, 10vw, 44px)',
                    height: 'clamp(40px, 10vw, 44px)',
                    borderRadius: '13px',
                    background: FUND_THEME.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                    boxShadow: `0 6px 18px ${FUND_THEME.shadow}`,
                  }}
                >
                  <FaVideo size={17} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h2
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                      fontWeight: 900,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    مشاهدة الفيديو
                  </h2>
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: 'clamp(0.68rem, 2vw, 0.75rem)',
                      margin: '3px 0 0',
                      fontWeight: 600,
                    }}
                  >
                    يرجى المشاهدة بعناية — الفيديو محمي ولا يمكن مشاركته
                  </p>
                </div>
              </div>

              {/* Warning banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding:
                    'clamp(9px, 2.5vw, 11px) clamp(11px, 3vw, 14px)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--notice-warning-bg)',
                  border: '1px solid var(--notice-warning-border)',
                }}
              >
                <FaExclamationTriangle
                  size={12}
                  color="var(--notice-warning-text)"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    color: 'var(--notice-warning-text)',
                    fontSize: 'clamp(0.7rem, 2vw, 0.78rem)',
                    lineHeight: 1.65,
                    fontWeight: 700,
                  }}
                >
                  <strong>تنبيه:</strong> الفيديو مخصص لك ولمشاهدة واحدة
                  فقط. الرابط مرتبط بجهازك.
                </span>
              </div>
            </div>

            {/* Player */}
            <div
              style={{
                padding: 'clamp(0.5rem, 2vw, 1.25rem)',
                backgroundColor: '#0a0a0a',
              }}
            >
              <FundVideoPlayer
                token={token || ''}
                thumbnailUrl={pageStatus?.thumbnail_blurred_url ?? null}
                onError={handlePlayerError}
                onStarted={() => setPlayerState('loading')}
                onSessionExpired={handleSessionExpired}
                onStateChange={handleStateChange}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                padding:
                  'clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.5rem)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Status row — dynamic */}
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  fontSize: 'clamp(0.68rem, 2vw, 0.72rem)',
                  color: videoStatus.color,
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <StatusIcon size={11} />
                  {videoStatus.label}
                </span>
              </div>

              {/* Security notice */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding:
                    'clamp(9px, 2.5vw, 10px) clamp(11px, 3vw, 12px)',
                  borderRadius: '11px',
                  backgroundColor: 'var(--notice-info-bg)',
                  border: '1px solid var(--notice-info-border)',
                }}
              >
                <FaShieldAlt
                  size={12}
                  color={FUND_THEME.accent}
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    color: 'var(--notice-info-text)',
                    fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
                    lineHeight: 1.6,
                    fontWeight: 600,
                  }}
                >
                  الفيديو مخصص لك فقط. تحاول المنصة ضمان عدم مشاركة
                  الرابط بين أكثر من مستخدم.
                </span>
              </div>

              {/* Actions — always side-by-side, responsive */}
              <div className="video-page-actions">
                <Link to="/basma-fund" className="video-page-action-back">
                  <FaArrowRight size={11} />
                  العودة لصندوق بصمة
                </Link>

                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(
                      /[^\d]/g,
                      ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-page-action-whatsapp"
                  >
                    <FaWhatsapp size={12} />
                    تواصل مع المنصة
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Scoped styles for the action buttons */}
      <style>{`
        .video-page-actions {
          display: flex;
          gap: 8px;
          flex-wrap: nowrap;
          align-items: center;
          width: 100%;
        }

        .video-page-action-back,
        .video-page-action-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          border-radius: 10px;
          font-family: 'Cairo', sans-serif;
          font-weight: 800;
          text-decoration: none;
          flex: 1 1 0;
          min-width: 0;
          white-space: nowrap;
          font-size: clamp(0.68rem, 2vw, 0.82rem);
        }

        .video-page-action-back,
        .video-page-action-back:hover,
        .video-page-action-back:focus,
        .video-page-action-back:active,
        .video-page-action-back:visited {
          color: ${FUND_THEME.accent} !important;
          background-color: transparent;
        }

        .video-page-action-whatsapp,
        .video-page-action-whatsapp:hover,
        .video-page-action-whatsapp:focus,
        .video-page-action-whatsapp:active,
        .video-page-action-whatsapp:visited {
          color: #25D366 !important;
          background-color: rgba(37, 211, 102, 0.1);
          border: 1px solid rgba(37, 211, 102, 0.22);
        }

        /* Very narrow screens — shrink further */
        @media (max-width: 375px) {
          .video-page-action-back,
          .video-page-action-whatsapp {
            padding: 8px 8px;
            font-size: 0.65rem;
            gap: 4px;
          }
        }

        @media (max-width: 320px) {
          .video-page-action-back,
          .video-page-action-whatsapp {
            padding: 7px 6px;
            font-size: 0.6rem;
            gap: 3px;
          }
        }
      `}</style>
    </>
  );
};

export default VideoAccessPage;