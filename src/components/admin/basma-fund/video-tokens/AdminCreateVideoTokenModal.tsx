import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaVideo,
  FaUser,
  FaInfoCircle,
  FaClock,
  FaStickyNote,
  FaCheckCircle,
  FaCopy,
  FaEnvelope,
  FaWhatsapp,
  FaLink,
  FaHourglassHalf,
  FaEye,
} from 'react-icons/fa';
import { adminVideoTokenService } from '../../../../services/adminVideoTokenService';
import { VIDEO_TOKEN_EXPIRES_OPTIONS } from '../../../../utils/videoTokenHelpers';
import { toast } from 'react-toastify';
import type {
  AdminCreateVideoTokenPayload,
  AdminCreateVideoTokenResponse,
} from '../../../../types';

// ============================================
// Props
// ============================================
interface AdminCreateVideoTokenModalProps {
  isOpen: boolean;
  helpRequestId: number;
  helpRequestTitle?: string;
  onClose: () => void;
  onCreated?: (response: AdminCreateVideoTokenResponse) => void;
}

const MAX_PURPOSE = 500;

// ============================================
// Component
// ============================================
const AdminCreateVideoTokenModal = ({
  isOpen,
  helpRequestId,
  helpRequestTitle,
  onClose,
  onCreated,
}: AdminCreateVideoTokenModalProps) => {
  const [purpose, setPurpose] = useState('');
  const [expiresInHours, setExpiresInHours] = useState<6 | 24 | 48>(24);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientWhatsapp, setRecipientWhatsapp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdResponse, setCreatedResponse] =
    useState<AdminCreateVideoTokenResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // ============================================
  // Reset on open
  // ============================================
  useEffect(() => {
    if (isOpen) {
      setPurpose('');
      setExpiresInHours(24);
      setRecipientName('');
      setRecipientEmail('');
      setRecipientWhatsapp('');
      setCreatedResponse(null);
      setCopied(false);
    }
  }, [isOpen]);

  // ============================================
  // Copy state reset
  // ============================================
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  // ============================================
  // Submit
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPurpose = purpose.trim();
    if (trimmedPurpose.length < 5) {
      toast.error('الغرض مطلوب (5 أحرف على الأقل)');
      return;
    }

    const payload: AdminCreateVideoTokenPayload = {
      purpose: trimmedPurpose,
      expires_in_hours: expiresInHours,
      recipient_name: recipientName.trim() || undefined,
      recipient_email: recipientEmail.trim() || undefined,
      recipient_whatsapp: recipientWhatsapp.trim() || undefined,
    };

    try {
      setSubmitting(true);
      const response = await adminVideoTokenService.create(
        helpRequestId,
        payload
      );
      setCreatedResponse(response);
      onCreated?.(response);
      toast.success('تم إنشاء الرابط بنجاح');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'حدث خطأ في إنشاء الرابط';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // Copy URL
  // ============================================
  const handleCopyUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('تم نسخ الرابط');
    } catch {
      toast.error('تعذّر النسخ');
    }
  }, []);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  // ============================================
  // Derived
  // ============================================
  const purposeValid = purpose.trim().length >= 5;
  const purposePercent = (purpose.length / MAX_PURPOSE) * 100;

  // ============================================
  // Render
  // ============================================
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
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
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              boxShadow:
                '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ============================================ */}
            {/* Decorative top accent */}
            {/* ============================================ */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background:
                  'linear-gradient(90deg, transparent, #17A2B8 30%, #20C9E0 70%, transparent)',
                transformOrigin: 'center',
                zIndex: 4,
              }}
            />

            {/* ============================================ */}
            {/* Close button */}
            {/* ============================================ */}
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              aria-label="إغلاق"
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-muted)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                opacity: submitting ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (submitting) return;
                e.currentTarget.style.backgroundColor =
                  'rgba(220,53,69,0.12)';
                e.currentTarget.style.color = '#DC3545';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-input)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              <FaTimes size={13} />
            </button>

            {/* ============================================ */}
            {/* Body — scrollable */}
            {/* ============================================ */}
            <div
              style={{
                padding: 'clamp(1.5rem, 4vw, 1.85rem) clamp(1.25rem, 3.5vw, 1.5rem) clamp(1.1rem, 3vw, 1.25rem)',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* ============================================ */}
              {/* Header */}
              {/* ============================================ */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1.35rem',
                }}
              >
                {/* Icon with pulse ring */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 240,
                    damping: 16,
                    delay: 0.1,
                  }}
                  style={{
                    position: 'relative',
                    width: '66px',
                    height: '66px',
                    margin: '0 auto 14px',
                  }}
                >
                  {/* Pulsing ring */}
                  <motion.span
                    animate={{
                      scale: [1, 1.35],
                      opacity: [0.35, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '2px solid #17A2B8',
                      pointerEvents: 'none',
                    }}
                  />

                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #17A2B8, #20C9E0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow:
                        '0 12px 28px rgba(23,162,184,0.4), inset 0 -3px 6px rgba(0,0,0,0.1)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <FaVideo size={26} />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.05rem, 3vw, 1.2rem)',
                    fontWeight: 900,
                    margin: '0 0 6px',
                    lineHeight: 1.3,
                  }}
                >
                  {createdResponse
                    ? 'تم إنشاء الرابط بنجاح'
                    : 'إنشاء رابط مشاهدة'}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.3 }}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
                    margin: 0,
                    lineHeight: 1.65,
                    maxWidth: '420px',
                    marginInline: 'auto',
                  }}
                >
                  {createdResponse ? (
                    'الرابط صالح لمشاهدة واحدة. انسخه وأرسله للمستلم.'
                  ) : helpRequestTitle ? (
                    <>
                      للطلب:{' '}
                      <strong
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {helpRequestTitle}
                      </strong>
                    </>
                  ) : (
                    'سيتم إنشاء رابط صالح لمشاهدة واحدة فقط'
                  )}
                </motion.p>
              </div>

              {/* ============================================ */}
              {/* Form state */}
              {/* ============================================ */}
              {!createdResponse ? (
                <form onSubmit={handleSubmit}>
                  {/* ============================================ */}
                  {/* Info banner */}
                  {/* ============================================ */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.3 }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '11px 13px',
                      backgroundColor: 'var(--notice-info-bg)',
                      border: '1px solid var(--notice-info-border)',
                      borderRadius: '12px',
                      marginBottom: '1.1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(23,162,184,0.15)',
                        color: '#17A2B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FaInfoCircle size={12} />
                    </div>
                    <span
                      style={{
                        color: 'var(--notice-info-text)',
                        fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
                        lineHeight: 1.65,
                        fontWeight: 600,
                      }}
                    >
                      الرابط صالح لمشاهدة واحدة فقط. تأكد من مشاركته مع
                      الشخص المناسب.
                    </span>
                  </motion.div>

                  {/* ============================================ */}
                  {/* Purpose */}
                  {/* ============================================ */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.36, duration: 0.3 }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <label style={labelStyle}>
                      <span style={labelIconStyle}>
                        <FaStickyNote size={10} />
                      </span>
                      الغرض من الرابط{' '}
                      <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <textarea
                      value={purpose}
                      onChange={(e) =>
                        setPurpose(e.target.value.slice(0, MAX_PURPOSE))
                      }
                      placeholder="مثال: مشاركة الفيديو مع متبرع محتمل"
                      rows={3}
                      maxLength={MAX_PURPOSE}
                      disabled={submitting}
                      style={{
                        ...textareaStyle,
                        borderColor: purposeValid
                          ? 'var(--border-color)'
                          : 'rgba(232,122,32,0.4)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#17A2B8';
                        e.currentTarget.style.boxShadow =
                          '0 0 0 3px rgba(23,162,184,0.12)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = purposeValid
                          ? 'var(--border-color)'
                          : 'rgba(232,122,32,0.4)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {purpose.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '6px',
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: '3px',
                            borderRadius: '3px',
                            backgroundColor: 'var(--bg-input)',
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            animate={{ width: `${purposePercent}%` }}
                            transition={{
                              duration: 0.25,
                              ease: 'easeOut',
                            }}
                            style={{
                              height: '100%',
                              borderRadius: '3px',
                              backgroundColor:
                                purposePercent > 90
                                  ? '#DC3545'
                                  : purposePercent > 70
                                  ? '#FFC107'
                                  : '#17A2B8',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'system-ui, sans-serif',
                            fontVariantNumeric: 'tabular-nums',
                            flexShrink: 0,
                          }}
                        >
                          {purpose.length}/{MAX_PURPOSE}
                        </span>
                      </div>
                    )}
                  </motion.div>

                  {/* ============================================ */}
                  {/* Expiry */}
                  {/* ============================================ */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <label style={labelStyle}>
                      <span style={labelIconStyle}>
                        <FaClock size={10} />
                      </span>
                      مدة الصلاحية{' '}
                      <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                      }}
                    >
                      {VIDEO_TOKEN_EXPIRES_OPTIONS.map((opt) => {
                        const active = expiresInHours === opt.value;
                        return (
                          <motion.button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setExpiresInHours(opt.value as 6 | 24 | 48)
                            }
                            disabled={submitting}
                            whileHover={
                              !submitting ? { y: -2, scale: 1.02 } : {}
                            }
                            whileTap={
                              !submitting ? { scale: 0.97 } : {}
                            }
                            style={{
                              position: 'relative',
                              padding: '10px 10px',
                              borderRadius: '11px',
                              border: `1.5px solid ${
                                active
                                  ? '#17A2B8'
                                  : 'var(--border-color)'
                              }`,
                              backgroundColor: active
                                ? 'rgba(23,162,184,0.1)'
                                : 'var(--bg-input)',
                              color: active
                                ? '#17A2B8'
                                : 'var(--text-secondary)',
                              fontFamily: 'Cairo, sans-serif',
                              fontSize: 'clamp(0.72rem, 2vw, 0.78rem)',
                              fontWeight: active ? 800 : 700,
                              cursor: submitting
                                ? 'not-allowed'
                                : 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: active
                                ? '0 4px 12px rgba(23,162,184,0.2)'
                                : 'none',
                              overflow: 'hidden',
                            }}
                          >
                            {active && (
                              <motion.span
                                layoutId="expiry-pill"
                                transition={{
                                  type: 'spring',
                                  stiffness: 350,
                                  damping: 30,
                                }}
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  borderRadius: '10px',
                                  border: '1.5px solid #17A2B8',
                                  pointerEvents: 'none',
                                }}
                              />
                            )}
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* ============================================ */}
                  {/* Recipient */}
                  {/* ============================================ */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.44, duration: 0.3 }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <div style={sectionTitleStyle}>
                      <span style={labelIconStyle}>
                        <FaUser size={10} />
                      </span>
                      بيانات المستلم{' '}
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        (اختياري)
                      </span>
                    </div>

                    <FieldWithIcon
                      Icon={FaUser}
                      value={recipientName}
                      onChange={setRecipientName}
                      placeholder="اسم المستلم"
                      maxLength={100}
                      disabled={submitting}
                    />

                    <FieldWithIcon
                      Icon={FaEnvelope}
                      value={recipientEmail}
                      onChange={setRecipientEmail}
                      placeholder="البريد الإلكتروني"
                      maxLength={100}
                      disabled={submitting}
                      type="email"
                      ltr
                    />

                    <FieldWithIcon
                      Icon={FaWhatsapp}
                      value={recipientWhatsapp}
                      onChange={setRecipientWhatsapp}
                      placeholder="+970599123456"
                      maxLength={20}
                      disabled={submitting}
                      type="tel"
                      ltr
                    />
                  </motion.div>

                  {/* ============================================ */}
                  {/* Submit button with shimmer */}
                  {/* ============================================ */}
                  <motion.button
                    type="submit"
                    disabled={submitting || !purposeValid}
                    whileHover={
                      !submitting && purposeValid
                        ? { scale: 1.02, y: -2 }
                        : {}
                    }
                    whileTap={
                      !submitting && purposeValid ? { scale: 0.98 } : {}
                    }
                    style={{
                      position: 'relative',
                      width: '100%',
                      padding: '14px 20px',
                      borderRadius: '13px',
                      border: 'none',
                      background:
                        submitting || !purposeValid
                          ? 'var(--btn-disabled-bg)'
                          : 'linear-gradient(135deg, #17A2B8, #20C9E0)',
                      color:
                        submitting || !purposeValid
                          ? 'var(--btn-disabled-text)'
                          : '#FFFFFF',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                      fontWeight: 800,
                      cursor:
                        submitting || !purposeValid
                          ? 'not-allowed'
                          : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow:
                        submitting || !purposeValid
                          ? 'none'
                          : '0 8px 24px rgba(23,162,184,0.35)',
                      opacity:
                        submitting || !purposeValid ? 0.75 : 1,
                      overflow: 'hidden',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {/* Shimmer effect */}
                    {!submitting && purposeValid && (
                      <motion.span
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          repeatDelay: 0.8,
                        }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          width: '60%',
                          background:
                            'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%)',
                          transform: 'skewX(-18deg)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    {submitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#FFFFFF',
                          }}
                        />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        <FaVideo size={14} />
                        إنشاء الرابط
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                /* ============================================ */
                /* Success state */
                /* ============================================ */
                <div>
                  {/* Success banner */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      type: 'spring',
                      stiffness: 220,
                      damping: 18,
                    }}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(40,167,69,0.08)',
                      border: '1px solid rgba(40,167,69,0.25)',
                      marginBottom: '1.1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 14,
                        delay: 0.15,
                      }}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '11px',
                        background:
                          'linear-gradient(135deg, #28A745, #4FCB6E)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0,
                        boxShadow: '0 6px 16px rgba(40,167,69,0.35)',
                      }}
                    >
                      <FaCheckCircle size={16} />
                    </motion.div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: '#28A745',
                          fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                          fontWeight: 800,
                          marginBottom: '4px',
                        }}
                      >
                        تم إنشاء الرابط بنجاح
                      </div>
                      <div
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: 'clamp(0.7rem, 2vw, 0.78rem)',
                          lineHeight: 1.65,
                        }}
                      >
                        الرابط أدناه صالح لمشاهدة واحدة فقط. انسخه وأرسله
                        للمستلم.
                      </div>
                    </div>
                  </motion.div>

                  {/* URL box */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    style={{ marginBottom: '1rem' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        marginBottom: '6px',
                      }}
                    >
                      <FaLink size={10} />
                      رابط المشاهدة
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        padding: '10px 12px',
                        borderRadius: '11px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px dashed var(--border-color)',
                        transition: 'border-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#17A2B8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          'var(--border-color)';
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: '0.72rem',
                          fontFamily:
                            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                          color: 'var(--text-secondary)',
                          wordBreak: 'break-all',
                          direction: 'ltr',
                          textAlign: 'left',
                          lineHeight: 1.5,
                        }}
                      >
                        {createdResponse.data.frontend_url}
                      </span>
                      <motion.button
                        type="button"
                        onClick={() =>
                          handleCopyUrl(createdResponse.data.frontend_url)
                        }
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '7px 12px',
                          borderRadius: '9px',
                          border: 'none',
                          backgroundColor: copied
                            ? 'rgba(40,167,69,0.12)'
                            : 'rgba(23,162,184,0.12)',
                          color: copied ? '#28A745' : '#17A2B8',
                          fontFamily: 'Cairo, sans-serif',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copied ? (
                          <>
                            <FaCheckCircle size={10} />
                            تم النسخ
                          </>
                        ) : (
                          <>
                            <FaCopy size={10} />
                            نسخ
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Info chips */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.3 }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                      marginBottom: '1.1rem',
                    }}
                  >
                    <InfoChip
                      Icon={FaEye}
                      label="المشاهدات"
                      value="1 مشاهدة"
                      color="#17A2B8"
                    />
                    <InfoChip
                      Icon={FaHourglassHalf}
                      label="تنتهي بعد"
                      value={`${createdResponse.data.expires_in_hours} ساعة`}
                      color="#FFC107"
                    />
                  </motion.div>

                  {/* Close button */}
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#17A2B8';
                      e.currentTarget.style.color = '#17A2B8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        'var(--border-color)';
                      e.currentTarget.style.color =
                        'var(--text-secondary)';
                    }}
                  >
                    إغلاق
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Sub-components
// ============================================

/**
 * FieldWithIcon — input with a leading icon + focus ring
 */
interface FieldWithIconProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength?: number;
  disabled?: boolean;
  type?: string;
  ltr?: boolean;
}

const FieldWithIcon = ({
  Icon,
  value,
  onChange,
  placeholder,
  maxLength,
  disabled,
  type = 'text',
  ltr = false,
}: FieldWithIconProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '8px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: focused ? '#17A2B8' : 'var(--text-muted)',
          pointerEvents: 'none',
          transition: 'color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon size={12} />
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        dir={ltr ? 'ltr' : 'rtl'}
        style={{
          width: '100%',
          padding: '10px 34px 10px 12px',
          borderRadius: '10px',
          border: `1px solid ${
            focused ? '#17A2B8' : 'var(--border-color)'
          }`,
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-primary)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.82rem',
          outline: 'none',
          boxSizing: 'border-box',
          textAlign: ltr ? 'right' : 'right',
          transition: 'all 0.2s ease',
          boxShadow: focused
            ? '0 0 0 3px rgba(23,162,184,0.12)'
            : 'none',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

/**
 * InfoChip — small card with icon + label + value
 */
interface InfoChipProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color: string;
}

const InfoChip = ({ Icon, label, value, color }: InfoChipProps) => (
  <div
    style={{
      padding: '12px 14px',
      borderRadius: '12px',
      backgroundColor: `${color}0F`,
      border: `1px solid ${color}25`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: -10,
        right: -10,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: `${color}15`,
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        color,
        fontSize: '0.65rem',
        fontWeight: 700,
        marginBottom: '6px',
        position: 'relative',
      }}
    >
      <Icon size={10} />
      {label}
    </div>
    <div
      style={{
        color: 'var(--text-secondary)',
        fontSize: '0.82rem',
        fontWeight: 800,
        position: 'relative',
      }}
    >
      {value}
    </div>
  </div>
);

// ============================================
// Styles
// ============================================
const labelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: '8px',
};

const labelIconStyle: React.CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: '7px',
  backgroundColor: 'rgba(23,162,184,0.12)',
  color: '#17A2B8',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: '10px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontFamily: 'Cairo, sans-serif',
  fontSize: '0.82rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '80px',
  lineHeight: 1.6,
  transition: 'all 0.2s ease',
};

export default AdminCreateVideoTokenModal;