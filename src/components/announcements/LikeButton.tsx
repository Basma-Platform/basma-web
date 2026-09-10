import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { announcementService } from '../../services/announcementService';
import { toast } from 'react-toastify';

interface LikeButtonProps {
  announcementId: number;
  initialLiked: boolean;
  initialCount: number;
  onLikeToggle?: (liked: boolean, newCount: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showLabel?: boolean;
}

const LikeButton = ({
  announcementId,
  initialLiked,
  initialCount,
  onLikeToggle,
  size = 'md',
  showCount = true,
  showLabel = false,
}: LikeButtonProps) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLike, setIsGuestLike] = useState(false);

  useEffect(() => {
    setIsLiked(initialLiked);
    setLikesCount(initialCount);
  }, [initialLiked, initialCount]);

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return '0.7rem';
      case 'lg': return '0.95rem';
      default: return '0.85rem';
    }
  };

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      setIsGuestLike(!isGuestLike);
      setTimeout(() => {
        setIsGuestLike(false);
      }, 2000);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    const newLikedState = !isLiked;
    const newCount = newLikedState ? likesCount + 1 : likesCount - 1;
    setIsLiked(newLikedState);
    setLikesCount(newCount);

    try {
      const response = await announcementService.toggleLike(announcementId);
      setIsLiked(response.liked);
      setLikesCount(response.likes_count);
      if (onLikeToggle) {
        onLikeToggle(response.liked, response.likes_count);
      }
      toast.success(response.message);
    } catch (error: any) {
      setIsLiked(!newLikedState);
      setLikesCount(newLikedState ? likesCount : likesCount + 1);
      const errorMessage = error.response?.data?.message || 'حدث خطأ، يرجى المحاولة مرة أخرى';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const displayLiked = isGuestLike ? !isLiked : isLiked;
  const displayCount = isGuestLike 
    ? (isLiked ? likesCount - 1 : likesCount + 1)
    : likesCount;

  const getButtonColor = () => {
    if (displayLiked) return '#DC3545';
    if (isGuestLike) return '#DC3545';
    return 'var(--text-muted)';
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLikeToggle}
      disabled={isLoading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: isLoading ? 'default' : 'pointer',
        padding: showLabel ? '8px 16px' : '4px 8px',
        borderRadius: '10px',
        transition: 'all 0.2s ease',
        fontFamily: 'Cairo, sans-serif',
        color: getButtonColor(),
        opacity: isLoading ? 0.6 : 1,
        ...(showLabel && {
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
        }),
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          if (showLabel) {
            e.currentTarget.style.borderColor = '#DC3545';
            e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.05)';
          } else {
            e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.08)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (showLabel) {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        } else {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {displayLiked ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <FaHeart size={getIconSize()} color="#DC3545" />
        </motion.div>
      ) : (
        <FaRegHeart size={getIconSize()} />
      )}
      
      {showCount && (
        <span
          style={{
            fontSize: getFontSize(),
            fontWeight: 600,
            color: displayLiked ? '#DC3545' : 'var(--text-muted)',
          }}
        >
          {displayCount}
        </span>
      )}

      {showLabel && (
        <span
          style={{
            fontSize: getFontSize(),
            fontWeight: 600,
            color: displayLiked ? '#DC3545' : 'var(--text-muted)',
            marginRight: '2px',
          }}
        >
          أعجبني
        </span>
      )}

      {isLoading && (
        <span
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid var(--text-muted)',
            borderTop: '2px solid transparent',
            animation: 'spin 0.8s linear infinite',
            display: 'inline-block',
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.button>
  );
};

export default LikeButton;