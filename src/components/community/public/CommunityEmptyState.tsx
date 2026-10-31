import { motion } from 'framer-motion';
import { COMMUNITY_THEME } from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';

interface CommunityEmptyStateProps {
  variant?: 'empty' | 'error';
  onRetry?: () => void;
  onClearFilters?: () => void;
  hasFilters?: boolean;
}

const CommunityEmptyState = ({
  variant = 'empty',
  onRetry,
  onClearFilters,
  hasFilters = false,
}: CommunityEmptyStateProps) => {
  const isError = variant === 'error';

  const title = isError
    ? 'حدث خطأ في التحميل'
    : hasFilters
      ? 'لا توجد منشورات مطابقة'
      : 'لا توجد منشورات بعد';

  const description = isError
    ? 'تعذّر تحميل المنشورات. يرجى المحاولة مرة أخرى.'
    : hasFilters
      ? 'جرّب تغيير الفلاتر أو مسحها لعرض المزيد من المنشورات.'
      : 'كن أول من يشارك منشوراً في مجتمعك.';

  const accent = isError ? '#DC3545' : COMMUNITY_THEME.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px dashed var(--border-color)',
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
      }}
    >
      {/* Icon with pulse */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: isError ? [0, -3, 3, 0] : 0,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: `${accent}12`,
          color: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px dashed ${accent}40`,
          position: 'relative',
        }}
      >
        {isError ? (
          <CommunityIcons.ban size={38} />
        ) : (
          <CommunityIcons.images size={38} />
        )}

        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${accent}`,
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* Title */}
      <h3
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.25rem',
          fontWeight: 900,
          fontFamily: 'Cairo, sans-serif',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontFamily: 'Cairo, sans-serif',
          lineHeight: 1.8,
          margin: 0,
          maxWidth: '440px',
          textAlign: 'center',
        }}
      >
        {description}
      </p>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '0.5rem',
        }}
      >
        {isError && onRetry && (
          <motion.button
            type="button"
            onClick={onRetry}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              fontSize: '0.88rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #DC3545, #F56575)',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(220, 53, 69, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <CommunityIcons.reopen size={13} />
            إعادة المحاولة
          </motion.button>
        )}

        {!isError && hasFilters && onClearFilters && (
          <motion.button
            type="button"
            onClick={onClearFilters}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              fontSize: '0.88rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              color: COMMUNITY_THEME.accent,
              backgroundColor: 'transparent',
              border: `1.5px solid ${COMMUNITY_THEME.accent}`,
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <CommunityIcons.cancel size={13} />
            مسح الفلاتر
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default CommunityEmptyState;