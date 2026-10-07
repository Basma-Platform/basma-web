import { motion } from 'framer-motion';
import {
  FaInfoCircle,
  FaShieldAlt,
  FaLock,
  FaHandHoldingHeart,
} from 'react-icons/fa';
import type { HelpRequestPublic } from '../../../types';
import { FUND_THEME } from '../../../utils/helpRequestHelpers';

interface HelpRequestDetailsInfoProps {
  request: HelpRequestPublic;
}

const HelpRequestDetailsInfo = ({ request }: HelpRequestDetailsInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: 'clamp(1.25rem, 3vw, 1.75rem)',
        marginBottom: '1.5rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Section title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: `${FUND_THEME.accent}15`,
            color: FUND_THEME.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FaInfoCircle size={13} />
        </div>
        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.05rem',
            fontWeight: 800,
            margin: 0,
          }}
        >
          تفاصيل الطلب
        </h3>
      </div>

      {/* Description */}
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          lineHeight: 1.85,
          margin: '0 0 1.5rem',
          whiteSpace: 'pre-wrap',
        }}
      >
        {request.public_description}
      </p>

      {/* ✅ Simplified privacy block */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(23,162,184,0.06)',
          border: '1px solid rgba(23,162,184,0.18)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
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
          <FaShieldAlt size={15} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 800,
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FaLock size={11} color={FUND_THEME.accent} />
            هوية صاحب الطلب محفوظة تماماً
          </div>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            بيانات التواصل والمنطقة مشفّرة — لا يمكن الوصول إليها إلا من قِبل
            الإدارة.
          </p>
        </div>
      </div>

      {/* Inquiries count */}
      {request.stats.inquiries_count > 0 && (
        <div
          style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(40,167,69,0.08)',
            color: '#28A745',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}
        >
          <FaHandHoldingHeart size={11} />
          {request.stats.inquiries_count} متبرع أبدى اهتمامه
        </div>
      )}
    </motion.div>
  );
};

export default HelpRequestDetailsInfo;