import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../hooks/useAuth';
import { useCommunityPostDetails } from '../../../hooks/useCommunityPostDetails';
import {
  COMMUNITY_THEME,
  formatCommunityDate,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import {
  CommunityTypeBadge,
  CommunityStatusBadge,
  CommunityPinnedBadge,
  CommunityImageCarousel,
} from '../shared';
import { toast } from 'react-toastify';
import type { CommunityPost } from '../../../types';

interface CommunityPostModalProps {
  isOpen: boolean;
  post: CommunityPost | null;
  onClose: () => void;
}

const CommunityPostModal = ({
  isOpen,
  post: initialPost,
  onClose,
}: CommunityPostModalProps) => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const { post, tracking, fetchPost, trackWhatsappClick, reset } =
    useCommunityPostDetails();

  useEffect(() => {
    if (isOpen && initialPost) {
      fetchPost(initialPost.id).catch(() => {
        /* toast handled inside hook */
      });
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPost?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleWhatsapp = async () => {
    if (!post?.whatsapp_number) return;
    const url = await trackWhatsappClick(post.id, post.whatsapp_number);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('رقم واتساب غير متوفر');
    }
  };

  if (!isOpen) return null;

  const displayPost = post || initialPost;
  if (!displayPost) return null;

  // ============================================
  // Build meta cards
  // ============================================
  const metaCards: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
  }> = [];

  if (displayPost.governorate) {
    metaCards.push({
      icon: <CommunityIcons.region size={13} />,
      label: 'المحافظة',
      value: displayPost.governorate.name,
    });
  }
  if (displayPost.city) {
    metaCards.push({
      icon: <CommunityIcons.location size={13} />,
      label: 'المنطقة',
      value: displayPost.city.name,
    });
  }
  if (displayPost.category) {
    metaCards.push({
      icon: <CommunityIcons.category size={13} />,
      label: 'التصنيف',
      value: displayPost.category.name,
    });
  }
  metaCards.push({
    icon: <CommunityIcons.calendar size={13} />,
    label: 'تاريخ النشر',
    value: formatCommunityDate(displayPost.published_at),
  });
  metaCards.push({
    icon: <CommunityIcons.views size={13} />,
    label: 'المشاهدات',
    value: displayPost.views.toLocaleString('en-US'),
  });

  // ============================================
  // Compute optimal columns for balanced rows
  //
  // Rules:
  //   5 items → 3 + 2 (3 cols)
  //   4 items → 2 + 2 (2 cols)
  //   3 items → 3      (3 cols)
  //   2 items → 2      (2 cols)
  //   1 item  → 1      (1 col)
  // ============================================
  const total = metaCards.length;
  let columns = 3;
  if (total <= 2) columns = total;
  else if (total === 4) columns = 2;
  else columns = 3;

  // ============================================
  // Build the grid template
  // ============================================
  const metaGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '10px',
    marginBottom: '1.25rem',
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'communityModalFadeIn 0.25s ease',
      }}
    >
      <style>{`
        @keyframes communityModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Meta grid responsive */
        @media (max-width: 640px) {
          .community-modal-meta-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 400px) {
          .community-modal-meta-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: 'calc(100vh - 40px)',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.6)'
              : 'rgba(255,255,255,0.92)',
            color: isDark ? '#FFFFFF' : '#333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <CommunityIcons.cancel size={16} />
        </button>

        <div
          style={{
            overflowY: 'auto',
            padding: '1.5rem',
          }}
        >
          <div style={{ height: '12px' }} />

          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            <CommunityTypeBadge type={displayPost.type} size="md" />
            <CommunityStatusBadge
              status={displayPost.status}
              labelOverride={displayPost.status_label}
              size="md"
            />
            {displayPost.is_pinned && <CommunityPinnedBadge size="md" />}
          </div>

          <h2
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.35,
              marginBottom: '1rem',
            }}
          >
            {displayPost.title}
          </h2>

          {displayPost.images.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <CommunityImageCarousel
                images={displayPost.images}
                alt={displayPost.title}
                variant="modal"
              />
            </div>
          )}

          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '0.75rem',
                color: COMMUNITY_THEME.accent,
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <CommunityIcons.info size={12} />
              الوصف
            </div>
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.9,
                margin: 0,
                whiteSpace: 'pre-wrap',
                textAlign: 'justify',
                textJustify: 'inter-word',
              }}
            >
              {displayPost.description}
            </p>
          </div>

          {/* ✅ Meta grid with computed columns */}
          <div
            className="community-modal-meta-grid"
            style={metaGridStyle}
          >
            {metaCards.map((card, idx) => (
              <MetaBox
                key={idx}
                icon={card.icon}
                label={card.label}
                value={card.value}
                index={idx}
              />
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: COMMUNITY_THEME.accentSoft,
                color: COMMUNITY_THEME.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CommunityIcons.info size={16} />
            </div>
            <div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                الناشر
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {displayPost.display_name}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ WhatsApp CTA — only for logged-in users */}
        {displayPost.whatsapp_number && isAuthenticated && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <motion.button
              type="button"
              onClick={handleWhatsapp}
              disabled={tracking}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px 24px',
                fontSize: '0.95rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, #25D366, #1EBE5D)',
                border: 'none',
                borderRadius: '30px',
                cursor: tracking ? 'wait' : 'pointer',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                opacity: tracking ? 0.7 : 1,
              }}
            >
              <CommunityIcons.clicks size={16} />
              تواصل عبر واتساب
            </motion.button>
          </div>
        )}

        {/* Guest CTA — login prompt */}
        {displayPost.whatsapp_number && !isAuthenticated && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="/login"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  fontSize: '0.95rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: COMMUNITY_THEME.gradient,
                  border: 'none',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  boxShadow: `0 6px 20px ${COMMUNITY_THEME.shadow}`,
                }}
              >
                <CommunityIcons.info size={16} />
                سجّل الدخول للتواصل عبر واتساب
              </a>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

interface MetaBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  index: number;
}

const MetaBox = ({ icon, label, value, index }: MetaBoxProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    style={{
      padding: '0.85rem 0.75rem',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minHeight: '76px',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: COMMUNITY_THEME.accent,
        fontSize: '0.7rem',
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {icon}
      {label}
    </div>
    <div
      style={{
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        wordBreak: 'break-word',
        lineHeight: 1.4,
      }}
    >
      {value}
    </div>
  </motion.div>
);

export default CommunityPostModal;