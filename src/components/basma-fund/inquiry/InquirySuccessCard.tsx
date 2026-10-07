import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCopy,
  FaVideo,
  FaClock,
  FaArrowLeft,
  FaTicketAlt,
  FaWhatsapp,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaCheck,
  FaSave,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { DonationInquiryCreateResponse } from '../../../types';
import { formatTokenExpiry } from '../../../utils/videoTokenHelpers';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';

interface InquirySuccessCardProps {
  response: DonationInquiryCreateResponse['data'];
  onClose?: () => void;
}

/**
 * Success card shown after a successful inquiry.
 *
 * The backend returns `video_access.token` (plain) and `video_access.url`
 * (already pointed at the frontend page). We prefer `token` when available
 * so the FE builds the route; otherwise we fall back to the backend URL.
 */
const InquirySuccessCard = ({
  response,
  onClose,
}: InquirySuccessCardProps) => {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // ✅ Prefer the plain token; fall back to url only if the backend is old.
  const videoAccessPath = response.video_access.token
    ? `/basma-fund/video/${encodeURIComponent(response.video_access.token)}`
    : response.video_access.url;

  // ============================================
  // Copy helpers
  // ============================================
  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard.writeText(response.tracking_code);
      setCopiedTracking(true);
      toast.success('تم نسخ كود التتبع');
      setTimeout(() => setCopiedTracking(false), 2000);
    } catch {
      toast.error('تعذّر النسخ — انسخ يدوياً');
    }
  };

  const handleCopyAll = async () => {
    // Build an absolute URL for sharing (works if the path is relative
    // OR if the backend already sent an absolute URL).
    const fullVideoUrl = videoAccessPath.startsWith('http')
      ? videoAccessPath
      : `${window.location.origin}${videoAccessPath}`;

    const text = [
      `كود التتبع: ${response.tracking_code}`,
      `رابط الفيديو: ${fullVideoUrl}`,
      `(صالح حتى: ${formatTokenExpiry(response.video_access.expires_at)})`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      toast.success('تم نسخ الكود والرابط معاً');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast.error('تعذّر النسخ — انسخ يدوياً');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* ============================================ */}
      {/* Success icon + heading */}
      {/* ============================================ */}
      <div
        style={{
          textAlign: 'center',
          padding: '0.5rem 0 0.25rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            margin: '0 auto 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            animate={{
              scale: [1, 1.35],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid #28A745',
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 18,
            }}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(40,167,69,0.4)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <FaCheck size={26} />
          </motion.div>
        </div>

        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            fontWeight: 900,
            margin: '0 0 6px',
          }}
        >
          تم استلام استفسارك بنجاح
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          سيتواصل معك فريق المنصة قريباً. احتفظ بكود التتبع أدناه.
        </p>
      </div>

      {/* ============================================ */}
      {/* Tracking code */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem 1.1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          <FaTicketAlt size={11} color={FUND_THEME.accent} />
          كود التتبع
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-card)',
            border: '1px dashed var(--border-color)',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              color: FUND_THEME.accent,
              fontSize: '1.15rem',
              fontWeight: 900,
              letterSpacing: '1.5px',
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {response.tracking_code}
          </span>

          <button
            type="button"
            onClick={handleCopyTracking}
            aria-label="نسخ الكود"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: copiedTracking
                ? 'rgba(40,167,69,0.12)'
                : `${FUND_THEME.accent}15`,
              color: copiedTracking ? '#28A745' : FUND_THEME.accent,
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {copiedTracking ? <FaCheck size={10} /> : <FaCopy size={10} />}
            {copiedTracking ? 'تم النسخ' : 'نسخ'}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Video access block */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem 1.1rem',
          borderRadius: '14px',
          background:
            'linear-gradient(135deg, rgba(23,162,184,0.08), rgba(23,162,184,0.02))',
          border: '1px solid rgba(23,162,184,0.2)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              background: FUND_THEME.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
              boxShadow: `0 4px 12px ${FUND_THEME.shadow}`,
            }}
          >
            <FaVideo size={15} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                fontWeight: 800,
                marginBottom: '4px',
              }}
            >
              رابط مشاهدة الفيديو
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                lineHeight: 1.6,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FaClock size={10} />
              متاح حتى {formatTokenExpiry(response.video_access.expires_at)}
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="inquiry-warning">
          <FaExclamationTriangle
            size={13}
            className="inquiry-warning__icon"
          />
          <div className="inquiry-warning__body">
            <span className="inquiry-warning__text">
              يمكنك مشاهدة الفيديو{' '}
              <strong className="inquiry-warning__strong">
                مرة واحدة فقط ({response.video_access.max_views})
              </strong>
            </span>
            <span className="inquiry-warning__text">
              لن تتمكن من إعادة فتحه لاحقاً.
            </span>
          </div>
        </div>

        {/* Watch CTA */}
        <Link
          to={videoAccessPath}
          onClick={onClose}
          className="inquiry-watch-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px 18px',
            borderRadius: '12px',
            background: FUND_THEME.gradient,
            color: '#FFFFFF',
            textDecoration: 'none',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: `0 6px 18px ${FUND_THEME.shadow}`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <FaEye size={13} />
          مشاهدة الفيديو الآن
          <FaArrowLeft size={11} className="inquiry-watch-btn__arrow" />
        </Link>

        {/* Save-now warning */}
        <div className="inquiry-save-warning">
          <FaExclamationTriangle
            size={13}
            className="inquiry-save-warning__icon"
          />
          <div className="inquiry-save-warning__body">
            <span className="inquiry-save-warning__title">
              احفظ كود التتبع ورابط الفيديو الآن
            </span>
            <span className="inquiry-save-warning__text">
              عند إغلاق هذه النافذة لن تتمكن من الوصول إلى{' '}
              <strong className="inquiry-save-warning__strong">
                كود التتبع
              </strong>{' '}
              أو{' '}
              <strong className="inquiry-save-warning__strong">
                رابط الفيديو
              </strong>{' '}
              مرة أخرى.
            </span>
            <span className="inquiry-save-warning__text">
              احفظهما الآن لاستخدامهما خلال 24 ساعة، وللاستعلام عن حالة
              استفسارك عند التواصل معنا.
            </span>
          </div>
        </div>

        {/* Copy both */}
        <button
          type="button"
          onClick={handleCopyAll}
          className="inquiry-copy-all-btn"
          aria-label="نسخ الكود والرابط"
        >
          {copiedAll ? <FaCheck size={11} /> : <FaSave size={11} />}
          {copiedAll ? 'تم النسخ' : 'نسخ الكود والرابط'}
        </button>
      </div>

      {/* ============================================ */}
      {/* Platform contact */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem 1.1rem',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FaWhatsapp size={13} color="#25D366" />
          للتواصل مع المنصة
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {response.platform_contact.whatsapp && (
            <a
              href={`https://wa.me/${response.platform_contact.whatsapp.replace(
                /[^\d]/g,
                ''
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inquiry-contact-chip inquiry-contact-chip--wa"
            >
              <FaWhatsapp size={11} />
              واتساب المنصة
            </a>
          )}

          {response.platform_contact.email && (
            <a
              href={`mailto:${response.platform_contact.email}`}
              className="inquiry-contact-chip inquiry-contact-chip--email"
            >
              <FaEnvelope size={11} />
              بريد إلكتروني
            </a>
          )}
        </div>

        {response.platform_contact.working_hours && (
          <div
            style={{
              marginTop: '10px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FaClock size={10} />
            {response.platform_contact.working_hours}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* Scoped styles */}
      {/* ============================================ */}
      <style>{`
        .inquiry-warning {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 11px;
          background-color: rgba(255, 193, 7, 0.10);
          border: 1px solid rgba(255, 193, 7, 0.30);
          margin-bottom: 12px;
        }
        .inquiry-warning__icon {
          flex-shrink: 0;
          margin-top: 2px;
          color: #E8A100;
        }
        .inquiry-warning__body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }
        .inquiry-warning__text {
          color: #8a6100;
          font-size: 0.78rem;
          font-weight: 700;
          line-height: 1.55;
          word-break: break-word;
          display: block;
        }
        .inquiry-warning__strong {
          color: #8a6100;
          font-weight: 900;
        }
        [data-theme='dark'] .inquiry-warning {
          background-color: rgba(255, 193, 7, 0.12);
          border-color: rgba(255, 193, 7, 0.38);
        }
        [data-theme='dark'] .inquiry-warning__icon {
          color: #FFC107;
        }
        [data-theme='dark'] .inquiry-warning__text,
        [data-theme='dark'] .inquiry-warning__strong {
          color: #FFD966;
        }

        .inquiry-watch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(23, 162, 184, 0.45);
        }
        .inquiry-watch-btn:active {
          transform: translateY(0);
        }
        .inquiry-watch-btn__arrow {
          transition: transform 0.2s ease;
        }
        .inquiry-watch-btn:hover .inquiry-watch-btn__arrow {
          transform: translateX(-3px);
        }

        .inquiry-save-warning {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 11px;
          background-color: rgba(255, 193, 7, 0.10);
          border: 1px solid rgba(255, 193, 7, 0.30);
        }
        .inquiry-save-warning__icon {
          flex-shrink: 0;
          margin-top: 2px;
          color: #E8A100;
        }
        .inquiry-save-warning__body {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex: 1;
        }
        .inquiry-save-warning__title {
          color: #8a6100;
          font-size: 0.78rem;
          font-weight: 900;
          line-height: 1.5;
          display: block;
        }
        .inquiry-save-warning__text {
          color: #8a6100;
          font-size: 0.72rem;
          font-weight: 600;
          line-height: 1.65;
          word-break: break-word;
          display: block;
        }
        .inquiry-save-warning__strong {
          font-weight: 900;
          color: #8a6100;
        }
        [data-theme='dark'] .inquiry-save-warning {
          background-color: rgba(255, 193, 7, 0.12);
          border-color: rgba(255, 193, 7, 0.38);
        }
        [data-theme='dark'] .inquiry-save-warning__icon {
          color: #FFC107;
        }
        [data-theme='dark'] .inquiry-save-warning__title,
        [data-theme='dark'] .inquiry-save-warning__text,
        [data-theme='dark'] .inquiry-save-warning__strong {
          color: #FFD966;
        }

        .inquiry-copy-all-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          margin-top: 10px;
          padding: 9px 14px;
          border-radius: 10px;
          border: 1px dashed rgba(23, 162, 184, 0.5);
          background-color: rgba(23, 162, 184, 0.06);
          color: ${FUND_THEME.accent};
          font-family: 'Cairo', sans-serif;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .inquiry-copy-all-btn:hover {
          background-color: rgba(23, 162, 184, 0.14);
          border-color: ${FUND_THEME.accent};
          transform: translateY(-1px);
        }
        .inquiry-copy-all-btn:active {
          transform: translateY(0);
        }
        [data-theme='dark'] .inquiry-copy-all-btn {
          color: #20C9E0;
          border-color: rgba(32, 201, 224, 0.5);
          background-color: rgba(32, 201, 224, 0.08);
        }
        [data-theme='dark'] .inquiry-copy-all-btn:hover {
          color: #20C9E0;
          background-color: rgba(32, 201, 224, 0.18);
          border-color: #20C9E0;
        }

        .inquiry-contact-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          text-decoration: none;
          font-family: 'Cairo', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .inquiry-contact-chip--wa {
          background-color: rgba(37, 211, 102, 0.12);
          color: #25D366;
          border: 1px solid rgba(37, 211, 102, 0.25);
        }
        .inquiry-contact-chip--wa:hover {
          background-color: rgba(37, 211, 102, 0.24);
          color: #25D366;
          transform: translateY(-1px);
        }
        .inquiry-contact-chip--email {
          background-color: rgba(23, 162, 184, 0.12);
          color: #17A2B8;
          border: 1px solid rgba(23, 162, 184, 0.28);
        }
        .inquiry-contact-chip--email:hover {
          background-color: rgba(23, 162, 184, 0.24);
          color: #17A2B8;
          transform: translateY(-1px);
        }
        [data-theme='dark'] .inquiry-contact-chip--email {
          color: #20C9E0;
          background-color: rgba(32, 201, 224, 0.14);
          border-color: rgba(32, 201, 224, 0.32);
        }
        [data-theme='dark'] .inquiry-contact-chip--email:hover {
          color: #20C9E0;
          background-color: rgba(32, 201, 224, 0.26);
        }

        @media (prefers-reduced-motion: reduce) {
          .inquiry-watch-btn,
          .inquiry-watch-btn__arrow,
          .inquiry-contact-chip,
          .inquiry-copy-all-btn {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InquirySuccessCard;