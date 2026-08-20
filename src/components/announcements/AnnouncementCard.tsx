import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaEye, FaMapMarkerAlt, FaTag, FaUser, FaStar, FaLock, FaThumbtack } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import type { Announcement } from '../../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  isLoggedIn?: boolean;
}

const AnnouncementCard = ({ announcement, isLoggedIn = false }: AnnouncementCardProps) => {
  const { isDark } = useTheme();

  const getPriceLabel = () => {
    switch (announcement.price_type) {
      case 'free':
        return 'مجاني';
      case 'paid':
        return `${announcement.price} شيكل`;
      case 'barter':
        return 'مقايضة';
      default:
        return '';
    }
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      goods: 'بضائع',
      service: 'خدمة',
      barter: 'مقايضة',
    };
    return map[category] || category;
  };

  const getTypeLabel = (type: string) => {
    return type === 'offer' ? 'عرض' : 'طلب';
  };

  const getPrivacyLabel = (privacy: string) => {
    const map: Record<string, string> = {
      public: 'عام',
      verified_only: 'موثقين فقط',
      region_only: 'نفس المنطقة',
      verified_region: 'موثق + نفس المنطقة',
    };
    return map[privacy] || privacy;
  };

  const coverImage =
    announcement.images && announcement.images.length > 0
      ? `https://basma-backend.onrender.com/storage/${announcement.images[0].image_path}`
      : '/placeholder-image.png';

  return (
    <Card
      style={{
        backgroundColor: isDark ? '#1e2a4a' : '#FFFFFF',
        border: 'none',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.2)'
          : '0 4px 16px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        height: '100%',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 12px 40px rgba(0,0,0,0.3)'
          : '0 12px 40px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 4px 16px rgba(0,0,0,0.2)'
          : '0 4px 16px rgba(0,0,0,0.04)';
      }}
    >
      <Link to={`/announcements/${announcement.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={coverImage}
            alt={announcement.title}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />

          {/* ✅ Pinned Badge with Icon */}
          {announcement.pinned_at && (
            <Badge
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: '#E87A20',
                color: '#FFFFFF',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(232,122,32,0.3)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaThumbtack size={10} />
              مميز
            </Badge>
          )}

          {/* Privacy Badge */}
          {announcement.privacy_type !== 'public' && (
            <Badge
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.6)',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 500,
                backdropFilter: 'blur(4px)',
                border: 'none',
              }}
            >
              <FaLock size={10} style={{ marginLeft: '4px' }} />
              {getPrivacyLabel(announcement.privacy_type)}
            </Badge>
          )}
        </div>

        <Card.Body>
          {/* Title */}
          <Card.Title
            style={{
              color: isDark ? '#FDF5E6' : '#6B4226',
              fontSize: '1.1rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '8px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              minHeight: '3rem',
            }}
          >
            {announcement.title}
          </Card.Title>

          {/* Description Preview */}
          <p
            style={{
              color: isDark ? '#C49A6C' : '#8B5A2B',
              fontSize: '0.9rem',
              fontFamily: 'Cairo, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '12px',
              minHeight: '2.8rem',
              lineHeight: 1.5,
            }}
          >
            {announcement.description.slice(0, 100)}...
          </p>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            
            {/* Category Badge */}
            <span
              style={{
                backgroundColor: isDark ? '#2a3a5a' : '#FDF5E6',
                color: isDark ? '#C49A6C' : '#6B4226',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 500,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.08)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaTag size={10} />
              {getCategoryLabel(announcement.category)}
            </span>

            {/* Type Badge */}
            <span
              style={{
                backgroundColor: announcement.type === 'offer' 
                  ? (isDark ? '#1a3a2a' : '#e8f5e9')
                  : (isDark ? '#3a1a1a' : '#fde8e8'),
                color: announcement.type === 'offer'
                  ? '#28A745'
                  : '#DC3545',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1px solid ${announcement.type === 'offer'
                  ? (isDark ? 'rgba(40,167,69,0.2)' : 'rgba(40,167,69,0.15)')
                  : (isDark ? 'rgba(220,53,69,0.2)' : 'rgba(220,53,69,0.15)')
                }`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {getTypeLabel(announcement.type)}
            </span>

            {/* Price Badge */}
            <span
              style={{
                backgroundColor: announcement.price_type === 'free'
                  ? (isDark ? '#1a3a2a' : '#e8f5e9')
                  : announcement.price_type === 'paid'
                  ? (isDark ? '#3a2a1a' : '#fff3e0')
                  : (isDark ? '#2a1a3a' : '#f3e5f5'),
                color: announcement.price_type === 'free'
                  ? '#28A745'
                  : announcement.price_type === 'paid'
                  ? '#E87A20'
                  : '#9C27B0',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1px solid ${announcement.price_type === 'free'
                  ? (isDark ? 'rgba(40,167,69,0.2)' : 'rgba(40,167,69,0.15)')
                  : announcement.price_type === 'paid'
                  ? (isDark ? 'rgba(232,122,32,0.2)' : 'rgba(232,122,32,0.15)')
                  : (isDark ? 'rgba(156,39,176,0.2)' : 'rgba(156,39,176,0.15)')
                }`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {getPriceLabel()}
            </span>

            {/* Region Badge */}
            <span
              style={{
                backgroundColor: isDark ? '#2a3a5a' : '#FDF5E6',
                color: isDark ? '#C49A6C' : '#6B4226',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 500,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.08)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaMapMarkerAlt size={10} />
              {announcement.city?.name || 'غير محدد'}
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.06)'}`,
              paddingTop: '12px',
            }}
          >
            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#2a3a5a' : '#FDF5E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '14px',
                }}
              >
                <FaUser />
              </div>
              <div>
                <span
                  style={{
                    color: isDark ? '#FDF5E6' : '#6B4226',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {announcement.user?.name || 'مستخدم'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaStar size={12} color="#F5A623" />
                  <span
                    style={{
                      color: isDark ? '#C49A6C' : '#8B5A2B',
                      fontSize: '0.75rem',
                    }}
                  >
                    4.8
                  </span>
                </div>
              </div>
            </div>

            {/* Views */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaEye size={14} color={isDark ? '#C49A6C' : '#8B5A2B'} />
              <span
                style={{
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: '0.8rem',
                }}
              >
                {announcement.views}
              </span>
            </div>
          </div>
        </Card.Body>
      </Link>

      {/* WhatsApp Button */}
      <div style={{ padding: '0 16px 16px' }}>
        {isLoggedIn ? (
          <Button
            href={`https://wa.me/${announcement.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#25D366',
              borderColor: '#25D366',
              color: '#FFFFFF',
              width: '100%',
              borderRadius: '12px',
              padding: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              fontFamily: 'Cairo, sans-serif',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1DA851';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#25D366';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaWhatsapp size={18} />
            تواصل عبر واتساب
          </Button>
        ) : (
          <Button
            as={Link as any}
            to="/login"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#E87A20',
              color: '#E87A20',
              width: '100%',
              borderRadius: '12px',
              padding: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              fontFamily: 'Cairo, sans-serif',
              transition: 'all 0.3s ease',
              borderWidth: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E87A20';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#E87A20';
            }}
          >
            <FaLock size={14} />
            تسجيل الدخول للتواصل
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AnnouncementCard;
