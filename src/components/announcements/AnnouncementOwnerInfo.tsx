import { FaUser, FaStar, FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import type { User } from '../../types';

interface AnnouncementOwnerInfoProps {
  owner: User | undefined;
  rating?: number;
  ratingCount?: number;
  whatsapp?: string;
  isLoggedIn?: boolean;
}

const AnnouncementOwnerInfo = ({
  owner,
  rating = 4.8,
  ratingCount = 12,
  whatsapp,
  isLoggedIn = false,
}: AnnouncementOwnerInfoProps) => {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(139,90,43,0.04)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '8px',
        border: '1px solid var(--border-color)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#2a3a5a' : '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#C49A6C' : '#8B5A2B',
            fontSize: '20px',
          }}
        >
          <FaUser />
        </div>
        <div>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {owner?.name || 'مستخدم'}
            {owner?.is_verified && (
              <span
                style={{
                  backgroundColor: '#28A745',
                  color: '#FFFFFF',
                  fontSize: '0.6rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 600,
                }}
              >
                موثق
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaStar size={14} color="#F5A623" />
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              {rating} ({ratingCount} تقييم)
            </span>
          </div>
        </div>
      </div>

      {isLoggedIn && whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'Cairo, sans-serif',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1DA851';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#25D366';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaWhatsapp size={14} />
          واتساب
        </a>
      )}
    </div>
  );
};

export default AnnouncementOwnerInfo;