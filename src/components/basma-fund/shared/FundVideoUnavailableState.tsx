import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaExclamationTriangle,
  FaArrowRight,
  FaWhatsapp,
  FaEnvelope,
  FaTimesCircle,
  FaClock,
  FaBan,
  FaDesktop,
  FaQuestionCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';
import {
  getVideoTokenErrorLabel,
  getVideoTokenErrorHint,
} from '../../../utils/videoTokenHelpers';
import { FUND_CONTACT_FALLBACK } from '../../../utils/fundContactHelpers';
import { buildWhatsAppLink } from '../../../utils/donationHelpers';
import type { PlatformContactInfo } from '../../../types';

interface FundVideoUnavailableStateProps {
  errorCode?: string;
  contact?: PlatformContactInfo;
}

interface ErrorConfig {
  Icon: IconType;
  color: string;
  gradient: string;
}

const FundVideoUnavailableState = ({
  errorCode,
  contact,
}: FundVideoUnavailableStateProps) => {
  const config: ErrorConfig = (() => {
    switch (errorCode) {
      case 'TOKEN_EXHAUSTED':
        return {
          Icon: FaTimesCircle,
          color: '#DC3545',
          gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
        };
      case 'TOKEN_EXPIRED':
        return {
          Icon: FaClock,
          color: '#FFC107',
          gradient: 'linear-gradient(135deg, #FFC107, #F5A623)',
        };
      case 'TOKEN_REVOKED':
        return {
          Icon: FaBan,
          color: '#6C757D',
          gradient: 'linear-gradient(135deg, #6C757D, #9CA3AF)',
        };
      case 'TOKEN_IP_MISMATCH':
        return {
          Icon: FaDesktop,
          color: '#E87A20',
          gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
        };
      case 'video_not_available':
      case 'video_file_not_found':
        return {
          Icon: FaExclamationTriangle,
          color: '#DC3545',
          gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
        };
      case 'TOKEN_NOT_FOUND':
      default:
        return {
          Icon: FaQuestionCircle,
          color: '#6B4226',
          gradient: 'linear-gradient(135deg, #6B4226, #8B5A2B)',
        };
    }
  })();

  const Icon = config.Icon;
  const label = getVideoTokenErrorLabel(errorCode);
  const hint = getVideoTokenErrorHint(errorCode);

  const contactInfo = contact ?? FUND_CONTACT_FALLBACK;

  const whatsappHref = contactInfo.whatsapp
    ? buildWhatsAppLink(
        contactInfo.whatsapp,
        `مرحباً، أواجه مشكلة في الوصول إلى الفيديو (${errorCode ?? 'unknown'})`
      )
    : null;

  const emailHref = contactInfo.email
    ? `mailto:${contactInfo.email}?subject=${encodeURIComponent(
        'مشكلة في الوصول إلى الفيديو'
      )}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        maxWidth: '520px',
        margin: '0 auto',
        padding: 'clamp(2rem, 6vw, 2.75rem) clamp(1.25rem, 4vw, 2rem)',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 12px 40px var(--shadow-md)',
        textAlign: 'center',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 16,
          delay: 0.1,
        }}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: config.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          margin: '0 auto 1.25rem',
          boxShadow: `0 12px 32px ${config.color}55`,
        }}
      >
        <Icon size={34} />
      </motion.div>

      <h2
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)',
          fontWeight: 900,
          margin: '0 0 10px',
          lineHeight: 1.3,
        }}
      >
        {label}
      </h2>

      {hint && (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            lineHeight: 1.75,
            margin: '0 0 1.75rem',
            maxWidth: '380px',
            marginInline: 'auto',
          }}
        >
          {hint}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '0 0 1.5rem',
        }}
      >
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'var(--border-color)',
          }}
        />
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 700,
            opacity: 0.75,
          }}
        >
          تحتاج مساعدة؟
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: 'var(--border-color)',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="video-error-chip video-error-chip--wa"
          >
            <FaWhatsapp size={14} />
            واتساب المنصة
          </a>
        )}

        {emailHref && (
          <a
            href={emailHref}
            className="video-error-chip video-error-chip--email"
          >
            <FaEnvelope size={13} />
            بريد المنصة
          </a>
        )}
      </div>

      {contactInfo.working_hours && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <FaClock size={11} />
          {contactInfo.working_hours}
        </div>
      )}

      <div>
        <Link
          to="/basma-fund"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: FUND_THEME.accent,
            textDecoration: 'none',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '10px',
          }}
        >
          <FaArrowRight size={11} />
          العودة لصندوق بصمة
        </Link>
      </div>

      <style>{`
        .video-error-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 18px;
          border-radius: 12px;
          text-decoration: none;
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .video-error-chip--wa {
          background-color: rgba(37, 211, 102, 0.12);
          color: #25D366;
          border: 1px solid rgba(37, 211, 102, 0.25);
        }
        .video-error-chip--wa:hover {
          background-color: rgba(37, 211, 102, 0.24);
          color: #25D366;
          transform: translateY(-1px);
        }
        .video-error-chip--email {
          background-color: rgba(23, 162, 184, 0.12);
          color: #17A2B8;
          border: 1px solid rgba(23, 162, 184, 0.25);
        }
        .video-error-chip--email:hover {
          background-color: rgba(23, 162, 184, 0.24);
          color: #17A2B8;
          transform: translateY(-1px);
        }
        [data-theme='dark'] .video-error-chip--email {
          color: #20C9E0;
          background-color: rgba(32, 201, 224, 0.14);
          border-color: rgba(32, 201, 224, 0.32);
        }
        [data-theme='dark'] .video-error-chip--email:hover {
          color: #20C9E0;
          background-color: rgba(32, 201, 224, 0.26);
        }
        @media (prefers-reduced-motion: reduce) {
          .video-error-chip {
            transition: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default FundVideoUnavailableState;