import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, FaEye, FaMapMarkerAlt, FaTag, FaUser, 
  FaLock, FaThumbtack, FaChevronLeft, FaEnvelope
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import type { Announcement } from '../../types';
import { motion } from 'framer-motion';

interface AnnouncementPostProps {
  announcement: Announcement;
  isLoggedIn?: boolean;
  viewMode?: 'list' | 'grid';
}

const AnnouncementPost = ({ 
  announcement, 
  isLoggedIn = false,
  viewMode = 'list'
}: AnnouncementPostProps) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  
  const isEmailVerified = user?.email_verified_at !== null && user?.email_verified_at !== undefined;

  const getPriceLabel = () => {
    switch (announcement.price_type) {
      case 'free': return 'مجاني';
      case 'paid': return `${announcement.price} شيكل`;
      case 'barter': return 'مقايضة';
      default: return '';
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

  const getTypeColor = (type: string) => {
    return type === 'offer' ? '#28A745' : '#DC3545';
  };

  const coverImage = announcement.images && announcement.images.length > 0
    ? `http://localhost:8000/storage/${announcement.images[0].image_path}`
    : '/placeholder-image.png';

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isGrid = viewMode === 'grid';

  return (
    <motion.div
      whileHover={{ y: isGrid ? -4 : -2 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px var(--shadow-sm)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          height: isGrid ? '100%' : 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 30px var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
        }}
      >
        <Card.Body style={{ 
          padding: isGrid ? '1rem' : '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}>
          {/* Header: User Info + Date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: isGrid ? '36px' : '44px',
                  height: isGrid ? '36px' : '44px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#2a3a5a' : '#e8e0d8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#C49A6C' : '#8B5A2B',
                  fontSize: isGrid ? '14px' : '18px',
                  flexShrink: 0,
                }}
              >
                <FaUser />
              </div>
              <div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: isGrid ? '0.8rem' : '0.95rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {announcement.user?.name || 'مستخدم'}
                  {announcement.user?.is_verified && (
                    <Badge
                      style={{
                        backgroundColor: '#28A745',
                        color: '#FFFFFF',
                        fontSize: '0.45rem',
                        padding: '2px 6px',
                        borderRadius: '8px',
                      }}
                    >
                      موثق
                    </Badge>
                  )}
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: isGrid ? '0.6rem' : '0.7rem',
                    fontFamily: 'Cairo, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{formatDate(announcement.created_at)}</span>
                  <span style={{ margin: '0 4px' }}>•</span>
                  <FaEye size={isGrid ? 8 : 10} />
                  {announcement.views}
                </div>
              </div>
            </div>

            {announcement.pinned_at && (
              <Badge
                style={{
                  backgroundColor: 'var(--primary-orange)',
                  color: '#FFFFFF',
                  padding: isGrid ? '2px 8px' : '4px 12px',
                  borderRadius: '10px',
                  fontSize: isGrid ? '0.55rem' : '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaThumbtack size={isGrid ? 8 : 10} />
                مميز
              </Badge>
            )}
          </div>

          {/* Content */}
          <div style={{ 
            display: 'flex', 
            gap: isGrid ? '0.75rem' : '1rem', 
            flexDirection: isGrid ? 'column' : 'row',
            flex: 1,
          }}>
            {/* Image */}
            <div
              style={{
                flexShrink: 0,
                width: isGrid ? '100%' : '180px',
                height: isGrid ? '160px' : '140px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={coverImage}
                alt={announcement.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {announcement.privacy_type !== 'public' && (
                <Badge
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '0.55rem',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <FaLock size={7} style={{ marginLeft: '3px' }} />
                  {announcement.privacy_type === 'verified_only' ? 'موثقين فقط' : 
                   announcement.privacy_type === 'region_only' ? 'نفس المنطقة' : 
                   'موثق + المنطقة'}
                </Badge>
              )}
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              {/* Title */}
              <Link
                to={`/announcements/${announcement.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                }}
              >
                <h3
                  style={{
                    fontSize: isGrid ? '0.95rem' : '1.05rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '0.4rem',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: isGrid ? 2 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary-orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {announcement.title}
                </h3>
              </Link>

              {/* Description Preview - Hide in grid */}
              {!isGrid && (
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '0.6rem',
                    lineHeight: 1.5,
                  }}
                >
                  {announcement.description}
                </p>
              )}

              {/* Badges */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '4px', 
                  marginBottom: '4px',
                }}>
                  <span
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F0EBE5',
                      color: isDark ? '#C49A6C' : '#6B4226',
                      padding: isGrid ? '2px 8px' : '4px 10px',
                      borderRadius: '8px',
                      fontSize: isGrid ? '0.6rem' : '0.65rem',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <FaTag size={isGrid ? 7 : 8} />
                    {getCategoryLabel(announcement.category)}
                  </span>

                  <span
                    style={{
                      backgroundColor: getTypeColor(announcement.type) + '15',
                      color: getTypeColor(announcement.type),
                      padding: isGrid ? '2px 8px' : '4px 10px',
                      borderRadius: '8px',
                      fontSize: isGrid ? '0.6rem' : '0.65rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {getTypeLabel(announcement.type)}
                  </span>

                  <span
                    style={{
                      backgroundColor: announcement.price_type === 'free' ? '#28A74515' :
                                     announcement.price_type === 'paid' ? 'rgba(232,122,32,0.15)' :
                                     '#9C27B015',
                      color: announcement.price_type === 'free' ? '#28A745' :
                             announcement.price_type === 'paid' ? 'var(--primary-orange)' :
                             '#9C27B0',
                      padding: isGrid ? '2px 8px' : '4px 10px',
                      borderRadius: '8px',
                      fontSize: isGrid ? '0.6rem' : '0.65rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {getPriceLabel()}
                  </span>
                </div>

                {/* Location badges */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '3px',
                  alignItems: 'center',
                  padding: '4px 6px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(139,90,43,0.04)',
                  borderRadius: '6px',
                }}>
                  <span
                    style={{
                      color: isDark ? '#A08070' : '#8B5A2B',
                      fontSize: isGrid ? '0.55rem' : '0.6rem',
                      fontWeight: 600,
                      fontFamily: 'Cairo, sans-serif',
                      marginLeft: '2px',
                    }}
                  >
                    المكان:
                  </span>
                  <span
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F5F0EB',
                      color: isDark ? '#A08070' : '#8B5A2B',
                      padding: '1px 8px',
                      borderRadius: '4px',
                      fontSize: isGrid ? '0.55rem' : '0.6rem',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <FaMapMarkerAlt size={isGrid ? 6 : 8} />
                    {announcement.governorate?.name || 'غير محدد'}
                  </span>
                  <span
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F5F0EB',
                      color: isDark ? '#A08070' : '#8B5A2B',
                      padding: '1px 8px',
                      borderRadius: '4px',
                      fontSize: isGrid ? '0.55rem' : '0.6rem',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    {announcement.city?.name || 'غير محدد'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                flexWrap: 'wrap',
                marginTop: '8px',
              }}>
                <Button
                  as={Link as any}
                  to={`/announcements/${announcement.id}`}
                  size={isGrid ? 'sm' : 'sm'}
                  style={{
                    backgroundColor: 'var(--primary-orange)',
                    borderColor: 'var(--primary-orange)',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: isGrid ? '3px 12px' : '4px 16px',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: isGrid ? '0.7rem' : '0.8rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    flex: isGrid ? '1' : 'auto',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-orange-dark)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FaChevronLeft size={isGrid ? 10 : 12} style={{ marginLeft: '4px' }} />
                  تفاصيل
                </Button>

                {isLoggedIn ? (
                  isEmailVerified ? (
                    <Button
                      href={`https://wa.me/${announcement.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size={isGrid ? 'sm' : 'sm'}
                      style={{
                        backgroundColor: '#25D366',
                        borderColor: '#25D366',
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        padding: isGrid ? '3px 10px' : '4px 12px',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: isGrid ? '0.7rem' : '0.8rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.3s ease',
                        flex: isGrid ? '1' : 'auto',
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
                      <FaWhatsapp size={isGrid ? 12 : 14} />
                      {!isGrid && 'واتساب'}
                    </Button>
                  ) : (
                    <Button
                      as={Link as any}
                      to="/verify-email"
                      size={isGrid ? 'sm' : 'sm'}
                      style={{
                        backgroundColor: '#FFC107',
                        borderColor: '#FFC107',
                        color: '#212529',
                        borderRadius: '10px',
                        padding: isGrid ? '3px 10px' : '4px 12px',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: isGrid ? '0.65rem' : '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.3s ease',
                        flex: isGrid ? '1' : 'auto',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E0A800';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFC107';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FaEnvelope size={isGrid ? 10 : 12} />
                      {!isGrid && 'فعّل بريدك للتواصل'}
                      {isGrid && 'فعّل البريد'}
                    </Button>
                  )
                ) : (
                  <Button
                    as={Link as any}
                    to="/login"
                    size={isGrid ? 'sm' : 'sm'}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-muted)',
                      borderRadius: '10px',
                      padding: isGrid ? '3px 10px' : '4px 12px',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: isGrid ? '0.65rem' : '0.8rem',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      flex: isGrid ? '1' : 'auto',
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
                    <FaLock size={isGrid ? 8 : 10} style={{ marginLeft: '4px' }} />
                    {!isGrid && 'تسجيل للتواصل'}
                    {isGrid && 'تواصل'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default AnnouncementPost;