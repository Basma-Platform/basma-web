import { Link } from 'react-router-dom';
import { FaShareAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LikeButton from './LikeButton';
import { ReportButton } from '../reports';

interface AnnouncementDetailsActionsProps {
  announcementId: number;
  isLiked: boolean;
  likesCount: number;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  onLikeToggle?: (liked: boolean, newCount: number) => void;
}

const AnnouncementDetailsActions = ({
  announcementId,
  isLiked,
  likesCount,
  isAuthenticated,
  isEmailVerified,
  onLikeToggle,
}: AnnouncementDetailsActionsProps) => {
  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'خدمة على بصمة',
          text: 'تفضل بمشاهدة هذه الخدمة على منصة بصمة',
          url: shareUrl,
        });
      } catch {
        /* user cancelled share — silent */
      }
      return;
    }

    // Fallback — copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('تم نسخ الرابط بنجاح');
    } catch {
      toast.info(`الرابط: ${shareUrl}`, { autoClose: 8000 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '12px',
        padding: '0 4px',
      }}
    >
      {/* Left Side — Share + Like */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Share Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-orange)';
            e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
          }}
        >
          <FaShareAlt size={16} color="var(--text-muted)" />
          مشاركة
        </motion.button>

        {/* Like Button with Label */}
        <LikeButton
          announcementId={announcementId}
          initialLiked={isLiked}
          initialCount={likesCount}
          onLikeToggle={onLikeToggle}
          size="md"
          showCount={true}
          showLabel={true}
        />
      </div>

      {/* Right Side — Report */}
      <div>
        {isAuthenticated ? (
          isEmailVerified ? (
            <ReportButton
              targetType="announcement"
              announcementId={announcementId}
              variant="full"
            />
          ) : (
            <Link
              to="/verify-email"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #FFC107',
                backgroundColor: 'rgba(255,193,7,0.08)',
                color: '#856404',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255,193,7,0.15)';
                e.currentTarget.style.borderColor = '#E0A800';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(255,193,7,0.08)';
                e.currentTarget.style.borderColor = '#FFC107';
              }}
            >
              <FaEnvelope size={14} />
              فعّل بريدك للتبليغ
            </Link>
          )
        ) : (
          <Link
            to="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.color = 'var(--primary-orange)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <FaLock size={14} />
            تبليغ (تسجيل الدخول مطلوب)
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default AnnouncementDetailsActions;