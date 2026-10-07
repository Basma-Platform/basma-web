import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaVideo,
  FaLock,
  FaPlayCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaBolt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAdminHelpRequestDetail } from '../../../../hooks/useAdminHelpRequestDetail';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

interface AdminHelpRequestVideoPlayerProps {
  helpRequestId: number;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  hasVideo: boolean;
}

// ============================================
// Quick reasons — one tap to fill the field
// ============================================
const QUICK_REASONS: { label: string; text: string }[] = [
  {
    label: 'مراجعة الطلب',
    text: 'مراجعة الفيديو للتحقق من صحة الطلب.',
  },
  {
    label: 'التحقق من المحتوى',
    text: 'التحقق من محتوى الفيديو ومطابقته للوصف.',
  },
  {
    label: 'شكوى من مستخدم',
    text: 'مراجعة الفيديو بناءً على شكوى أو إبلاغ من مستخدم.',
  },
  {
    label: 'قرار الموافقة/الرفض',
    text: 'مراجعة الفيديو قبل اتخاذ قرار الموافقة أو الرفض.',
  },
];

const MIN_REASON = 5;
const MAX_REASON = 500;

/**
 * Secure video player.
 * - Clicking "Play" opens a small reason prompt
 * - Then fetches the video as a Blob (backend logs each access)
 * - Renders a native <video> with download/PiP disabled
 */
const AdminHelpRequestVideoPlayer = ({
  helpRequestId,
  thumbnailUrl,
  durationSeconds,
  hasVideo,
}: AdminHelpRequestVideoPlayerProps) => {
  const { viewVideo, videoLoading } = useAdminHelpRequestDetail();

  const [askingReason, setAskingReason] = useState(false);
  const [reason, setReason] = useState('');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const blobUrlRef = useRef<string | null>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleOpenReason = () => {
    if (!hasVideo) {
      toast.error('لا يوجد فيديو متاح لهذا الطلب');
      return;
    }
    setReason('');
    setAskingReason(true);
  };

  const handleCloseReason = () => {
    if (videoLoading) return;
    setAskingReason(false);
    setReason('');
  };

  const handlePickQuickReason = (text: string) => {
    setReason(text.slice(0, MAX_REASON));
  };

  const handleFetchVideo = async () => {
    const trimmed = reason.trim();
    if (trimmed.length < MIN_REASON) {
      toast.error(
        `يرجى كتابة سبب صحيح (${MIN_REASON} أحرف على الأقل)`
      );
      return;
    }

    try {
      setLoadError(null);
      const blob = await viewVideo(helpRequestId, trimmed);

      const url = URL.createObjectURL(blob);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = url;
      setVideoBlobUrl(url);
      setAskingReason(false);
      setReason('');
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) {
        setLoadError('ملف الفيديو غير موجود');
      } else if (status === 410) {
        setLoadError('تم حذف الفيديو تلقائياً بعد انتهاء صلاحيته');
      } else {
        setLoadError('تعذّر تحميل الفيديو');
      }
    }
  };

  const isValid = reason.trim().length >= MIN_REASON;

  // ============================================
  // No video available
  // ============================================
  if (!hasVideo) {
    return (
      <div
        style={{
          padding: '1.5rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px dashed var(--border-color)',
          textAlign: 'center',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <FaVideo size={28} opacity={0.4} color="var(--text-muted)" />
        <div
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginTop: '10px',
          }}
        >
          لا يوجد فيديو لهذا الطلب
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: '#000',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}
      >
        {videoBlobUrl ? (
          <video
            src={videoBlobUrl}
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            playsInline
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        ) : (
          <>
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="video thumbnail"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(4px)',
                  transform: 'scale(1.06)',
                }}
              />
            )}

            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.55)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <motion.button
                type="button"
                onClick={handleOpenReason}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                disabled={videoLoading}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: FUND_THEME.accent,
                  cursor: videoLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                {videoLoading ? (
                  <FaSpinner
                    size={24}
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                ) : (
                  <FaPlayCircle size={28} />
                )}
              </motion.button>
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  maxWidth: '300px',
                  lineHeight: 1.5,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                اضغط لتشغيل الفيديو — سيتم تسجيل هذا الوصول
              </span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <FaLock size={9} />
                الوصول يتطلب إدخال سبب
              </span>
            </div>
          </>
        )}
      </div>

      {/* Duration badge */}
      {durationSeconds != null && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '10px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaVideo size={10} />
          مدة الفيديو: {durationSeconds} ثانية
        </div>
      )}

      {/* Error */}
      {loadError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginTop: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(220,53,69,0.06)',
            border: '1px solid rgba(220,53,69,0.25)',
            color: '#DC3545',
            fontSize: '0.78rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaExclamationTriangle
            size={12}
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <span>{loadError}</span>
        </div>
      )}

      {/* ============================================ */}
      {/* Reason modal */}
      {/* ============================================ */}
      <AnimatePresence>
        {askingReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseReason}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 1090,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              direction: 'rtl',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                overflow: 'hidden',
                fontFamily: 'Cairo, sans-serif',
                position: 'relative',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '1.75rem 1.5rem 1.25rem',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 1rem',
                    borderRadius: '50%',
                    background: FUND_THEME.gradient,
                    color: '#FFFFFF',
                    boxShadow: `0 8px 20px ${FUND_THEME.shadow}`,
                  }}
                >
                  <FaVideo size={22} />
                </div>

                <h3
                  style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    margin: '0 0 8px',
                  }}
                >
                  سبب مشاهدة الفيديو
                </h3>

                <p
                  style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    lineHeight: 1.7,
                    margin: '0 0 1.25rem',
                  }}
                >
                  كل مشاهدة يتم تسجيلها في سجل النشاط. اكتب سبباً
                  واضحاً للمراجعة.
                </p>

                {/* ============================================ */}
                {/* Quick reasons */}
                {/* ============================================ */}
                <div style={{ marginBottom: '14px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    <FaBolt size={11} color="#FFC107" />
                    أسباب جاهزة (اضغط للاختيار):
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {QUICK_REASONS.map((q) => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => handlePickQuickReason(q.text)}
                        disabled={videoLoading}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: `1px solid ${
                            reason === q.text
                              ? FUND_THEME.accent
                              : 'var(--border-color)'
                          }`,
                          backgroundColor:
                            reason === q.text
                              ? `${FUND_THEME.accent}15`
                              : 'var(--bg-input)',
                          color:
                            reason === q.text
                              ? FUND_THEME.accent
                              : 'var(--text-secondary)',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: videoLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                          opacity: videoLoading ? 0.5 : 1,
                        }}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value.slice(0, MAX_REASON))
                  }
                  placeholder="أو اكتب سبباً مخصصاً..."
                  rows={3}
                  maxLength={MAX_REASON}
                  disabled={videoLoading}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${
                      reason.trim().length > 0 &&
                      reason.trim().length < MIN_REASON
                        ? 'var(--error)'
                        : 'var(--border-color)'
                    }`,
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    lineHeight: 1.6,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '6px',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color:
                        reason.trim().length > 0 &&
                        reason.trim().length < MIN_REASON
                          ? 'var(--error)'
                          : 'var(--text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    الحد الأدنى: {MIN_REASON} أحرف
                  </div>
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      opacity: 0.7,
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {reason.length}/{MAX_REASON}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '1rem 1.5rem 1.25rem',
                  display: 'flex',
                  gap: '10px',
                  borderTop: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseReason}
                  disabled={videoLoading}
                  style={{
                    flex: '1 1 0',
                    minWidth: '100px',
                    padding: '11px 16px',
                    borderRadius: '11px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: videoLoading ? 'not-allowed' : 'pointer',
                    opacity: videoLoading ? 0.5 : 1,
                  }}
                >
                  إلغاء
                </button>
                <motion.button
                  type="button"
                  onClick={handleFetchVideo}
                  disabled={videoLoading || !isValid}
                  whileHover={
                    !videoLoading && isValid ? { scale: 1.02, y: -1 } : {}
                  }
                  whileTap={
                    !videoLoading && isValid ? { scale: 0.97 } : {}
                  }
                  style={{
                    flex: '1 1 0',
                    minWidth: '140px',
                    padding: '11px 16px',
                    borderRadius: '11px',
                    border: 'none',
                    background:
                      videoLoading || !isValid
                        ? 'var(--btn-disabled-bg)'
                        : FUND_THEME.gradient,
                    color:
                      videoLoading || !isValid
                        ? 'var(--btn-disabled-text)'
                        : '#FFFFFF',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor:
                      videoLoading || !isValid ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    boxShadow:
                      videoLoading || !isValid
                        ? 'none'
                        : `0 4px 16px ${FUND_THEME.shadow}`,
                    opacity: videoLoading || !isValid ? 0.7 : 1,
                  }}
                >
                  {videoLoading ? (
                    <>
                      <FaSpinner
                        size={12}
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      جاري التحميل...
                    </>
                  ) : (
                    <>
                      <FaPlayCircle size={12} />
                      تشغيل الفيديو
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminHelpRequestVideoPlayer;