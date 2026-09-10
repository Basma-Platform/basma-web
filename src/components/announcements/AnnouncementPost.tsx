import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, FaEye, FaMapMarkerAlt, FaTag, 
  FaLock, FaThumbtack, FaChevronLeft, FaEnvelope,
  FaUserCheck, FaShieldAlt, FaExclamationTriangle,
  FaClock, FaStar
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import type { Announcement } from '../../types';
import { motion } from 'framer-motion';
import LikeButton from './LikeButton';

interface AnnouncementPostProps {
  announcement: Announcement;
  isLoggedIn?: boolean;
  viewMode?: 'list' | 'grid';
}

// ✅ استخدام VITE_STORAGE_URL مع fallback للتطوير
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

const AnnouncementPost = ({ 
  announcement, 
  isLoggedIn = false,
  viewMode = 'list'
}: AnnouncementPostProps) => {
  const { user } = useAuth();
  
  const isEmailVerified = user?.email_verified_at !== null && user?.email_verified_at !== undefined;
  const isVerifiedUser = user?.is_verified === true;
  const isGrid = viewMode === 'grid';

  const canViewWhatsApp = (): boolean => {
    if (!isLoggedIn) return false;
    if (!isEmailVerified) return false;
    
    switch (announcement.privacy_type) {
      case 'public': return true;
      case 'region_only': return user?.city_id === announcement.city_id;
      case 'verified_only': return isVerifiedUser && announcement.user?.is_verified === true;
      case 'verified_region': return isVerifiedUser && 
             user?.city_id === announcement.city_id && 
             announcement.user?.is_verified === true;
      default: return false;
    }
  };

  const getContactButtonConfig = () => {
    const canView = canViewWhatsApp();

    if (!isLoggedIn) {
      return {
        label: 'سجل للتواصل',
        icon: <FaLock size={12} />,
        variant: 'outline',
        to: '/login',
        disabled: false,
      };
    }

    if (!isEmailVerified) {
      return {
        label: 'فعّل بريدك',
        icon: <FaEnvelope size={12} />,
        variant: 'warning',
        to: '/verify-email',
        disabled: false,
      };
    }

    if (!canView) {
      return {
        label: 'غير متاح',
        icon: <FaShieldAlt size={12} />,
        variant: 'disabled',
        to: '#',
        disabled: true,
      };
    }

    return {
      label: 'واتساب',
      icon: <FaWhatsapp size={15} />,
      variant: 'whatsapp',
      to: `https://wa.me/${announcement.whatsapp}`,
      disabled: false,
      href: true,
    };
  };

  const getPriceLabel = () => {
    switch (announcement.price_type) {
      case 'free': return 'مجاني';
      case 'paid': return `${announcement.price} شيكل`;
      case 'barter': return 'مقايضة';
      default: return '';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category === 'goods' ? 'سلع' : 'خدمات';
  };

  const getTypeLabel = (type: string) => {
    return type === 'offer' ? 'عرض' : 'طلب';
  };

  const getTypeColor = (type: string) => {
    return type === 'offer' ? 'var(--success)' : 'var(--error)';
  };

  // ✅ Keep from develop - Privacy Labels
  const getPrivacyLabel = (privacyType: string) => {
    const map: Record<string, string> = {
      'public': 'عام - للجميع',
      'region_only': 'نفس المنطقة فقط',
      'verified_only': 'للموثقين الهوية فقط',
      'verified_region': 'موثق الهوية + نفس المنطقة',
    };
    return map[privacyType] || privacyType;
  };

  // ✅ Keep from develop - Privacy Colors
  const getPrivacyColor = (privacyType: string) => {
    const map: Record<string, string> = {
      'public': 'var(--success)',
      'region_only': 'var(--info)',
      'verified_only': 'var(--primary-orange)',
      'verified_region': 'var(--warning)',
    };
    return map[privacyType] || 'var(--text-muted)';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ✅ Use STORAGE_URL from env
  const coverImage = announcement.images && announcement.images.length > 0
    ? `${STORAGE_URL}/${announcement.images[0].image_path}`
    : '/placeholder-image.png';

  // ✅ Use STORAGE_URL in getUserAvatar
  const getUserAvatar = (): string | null => {
    const profileImage = announcement.user?.profile_image;
    if (!profileImage) return null;
    if (profileImage.startsWith('http://') || profileImage.startsWith('https://')) {
      return profileImage;
    }
    if (profileImage.startsWith('storage/')) {
      return `${STORAGE_URL}/${profileImage.replace('storage/', '')}`;
    }
    if (profileImage.startsWith('profile/')) {
      return `${STORAGE_URL}/${profileImage}`;
    }
    return `${STORAGE_URL}/${profileImage}`;
  };

  const userAvatar = getUserAvatar();
  const userInitials = (announcement.user?.name || 'مستخدم').charAt(0).toUpperCase();

  const contactConfig = getContactButtonConfig();

  // ============================================
  // LIST VIEW
  // ============================================
  if (!isGrid) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        style={{ height: '100%' }}
      >
        <Card
          className="announcement-card-list"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px var(--shadow-sm)',
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            display: 'flex',
            flexDirection: 'row',
            minHeight: '220px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 24px var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px var(--shadow-sm)';
          }}
        >
          {/* IMAGE - Left Side */}
          <div
            style={{
              position: 'relative',
              width: '260px',
              minHeight: '220px',
              flexShrink: 0,
              overflow: 'hidden',
              backgroundColor: 'var(--bg-input)',
            }}
          >
            <img
              src={coverImage}
              alt={announcement.title}
              style={{
                width: '100%',
                height: '100%',
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

            {/* BADGES */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 5,
              }}
            >
              <span
                style={{
                  backgroundColor: getPrivacyColor(announcement.privacy_type),
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '7px',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaLock size={8} />
                {getPrivacyLabel(announcement.privacy_type)}
              </span>
            </div>

            {announcement.pinned_at && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  zIndex: 5,
                }}
              >
                <span
                  style={{
                    backgroundColor: 'var(--primary-orange)',
                    color: '#FFFFFF',
                    padding: '3px 10px',
                    borderRadius: '7px',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaThumbtack size={8} />
                  مميز
                </span>
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                display: 'flex',
                gap: '5px',
                flexWrap: 'wrap',
                zIndex: 5,
                maxWidth: 'calc(100% - 16px)',
              }}
            >
              <span
                style={{
                  backgroundColor: getTypeColor(announcement.type),
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {getTypeLabel(announcement.type)}
              </span>

              <span
                style={{
                  backgroundColor: announcement.price_type === 'free' ? 'var(--success)' :
                                 announcement.price_type === 'paid' ? 'var(--primary-orange)' :
                                 '#9C27B0',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {getPriceLabel()}
              </span>

              {announcement.sub_category?.is_high_risk && (
                <span
                  style={{
                    backgroundColor: 'var(--warning)',
                    color: '#856404',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaExclamationTriangle size={8} />
                  تحقق
                </span>
              )}
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.6rem',
                fontWeight: 500,
                fontFamily: 'Cairo, sans-serif',
                backdropFilter: 'blur(4px)',
                zIndex: 5,
              }}
            >
              <FaEye size={10} />
              {announcement.views}
            </div>
          </div>

          {/* CONTENT - Right Side */}
          <Card.Body style={{ 
            padding: '1rem 1.2rem',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
          }}>
            {/* User Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '10px',
                padding: '6px 12px',
                marginBottom: '0.5rem',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-card)',
                    border: '2px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={announcement.user?.name || 'مستخدم'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement('span');
                          fallback.style.cssText = `
                            color: var(--text-muted);
                            font-size: 13px;
                            font-weight: 700;
                            font-family: 'Cairo', sans-serif;
                          `;
                          fallback.textContent = userInitials;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '13px',
                        fontWeight: 700,
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      {userInitials}
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      fontFamily: 'Cairo, sans-serif',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {announcement.user?.name || 'مستخدم'}
                    {announcement.user?.is_verified && (
                      <Badge
                        style={{
                          backgroundColor: 'var(--success)',
                          color: '#FFFFFF',
                          fontSize: '0.45rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <FaUserCheck size={8} /> موثق
                      </Badge>
                    )}
                  </span>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.6rem',
                      fontFamily: 'Cairo, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: 0.6,
                    }}
                  >
                    <FaClock size={9} />
                    {formatDate(announcement.created_at)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                <FaStar size={12} color="#F5A623" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>4.8</span>
              </div>
            </div>

            {/* Title */}
            <Link
              to={`/announcements/${announcement.id}`}
              style={{
                textDecoration: 'none',
                color: 'var(--text-secondary)',
                marginBottom: '0.2rem',
              }}
            >
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  transition: 'color 0.2s ease',
                  margin: 0,
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

            {/* Description */}
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '0.3rem',
                lineHeight: 1.4,
                opacity: 0.7,
              }}
            >
              {announcement.description}
            </p>

            {/* Tags & Location */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span
                style={{
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  fontFamily: 'Cairo, sans-serif',
                  border: '1px solid var(--border-color)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaTag size={8} />
                {getCategoryLabel(announcement.category)}
              </span>

              {announcement.sub_category && (
                <span
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-muted)',
                    padding: '2px 10px',
                    borderRadius: '4px',
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    fontFamily: 'Cairo, sans-serif',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {announcement.sub_category.name}
                </span>
              )}

              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.6rem',
                  fontFamily: 'Cairo, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: 0.7,
                }}
              >
                <FaMapMarkerAlt size={10} color="var(--primary-orange)" />
                {announcement.governorate?.name || ''}
                {announcement.city?.name && ` - ${announcement.city.name}`}
              </span>
            </div>

            {/* ACTIONS */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginTop: 'auto',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-color)',
              width: '100%',
              flexWrap: 'wrap',
            }}>
              <LikeButton
                announcementId={announcement.id}
                initialLiked={announcement.is_liked_by_user || false}
                initialCount={announcement.likes_count || 0}
                size="md"
                showCount={true}
              />

              <Button
                as={Link as any}
                to={`/announcements/${announcement.id}`}
                size="sm"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: '8px',
                  padding: '5px 16px',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  borderWidth: '1.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flex: 1,
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                  e.currentTarget.style.borderColor = 'var(--primary-orange)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <FaChevronLeft size={10} />
                تفاصيل
              </Button>

              {contactConfig.disabled ? (
                <Button
                  size="sm"
                  disabled
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-muted)',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    borderWidth: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  title={contactConfig.label}
                >
                  {contactConfig.icon}
                  {contactConfig.label}
                </Button>
              ) : contactConfig.variant === 'whatsapp' ? (
                <a
                  href={contactConfig.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '5px 14px',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    border: 'none',
                    minHeight: '32px',
                    flex: 1,
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
                  {contactConfig.icon}
                  {contactConfig.label}
                </a>
              ) : (
                <Button
                  as={Link as any}
                  to={contactConfig.to}
                  size="sm"
                  style={{
                    backgroundColor: contactConfig.variant === 'warning' ? 'var(--warning)' : 'transparent',
                    borderColor: contactConfig.variant === 'warning' ? 'var(--warning)' : 'var(--border-color)',
                    color: contactConfig.variant === 'warning' ? '#856404' : 'var(--text-secondary)',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    borderWidth: contactConfig.variant === 'warning' ? '0px' : '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (contactConfig.variant === 'warning') {
                      e.currentTarget.style.backgroundColor = '#E0A800';
                    } else {
                      e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                      e.currentTarget.style.borderColor = 'var(--primary-orange)';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (contactConfig.variant === 'warning') {
                      e.currentTarget.style.backgroundColor = 'var(--warning)';
                    } else {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {contactConfig.icon}
                  {contactConfig.label}
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    );
  }

  // ============================================
  // GRID VIEW
  // ============================================
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card
        className="announcement-card-grid"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px var(--shadow-sm)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          height: '100%',
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
        {/* IMAGE - Top */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '190px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-input)',
            flexShrink: 0,
          }}
        >
          <img
            src={coverImage}
            alt={announcement.title}
            style={{
              width: '100%',
              height: '100%',
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

          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 5,
            }}
          >
            <span
              style={{
                backgroundColor: getPrivacyColor(announcement.privacy_type),
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '7px',
                fontSize: '0.55rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FaLock size={8} />
              {getPrivacyLabel(announcement.privacy_type)}
            </span>
          </div>

          {announcement.pinned_at && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                zIndex: 5,
              }}
            >
              <span
                style={{
                  backgroundColor: 'var(--primary-orange)',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '7px',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaThumbtack size={8} />
                مميز
              </span>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              display: 'flex',
              gap: '5px',
              flexWrap: 'wrap',
              zIndex: 5,
              maxWidth: 'calc(100% - 16px)',
            }}
          >
            <span
              style={{
                backgroundColor: getTypeColor(announcement.type),
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.6rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              {getTypeLabel(announcement.type)}
            </span>

            <span
              style={{
                backgroundColor: announcement.price_type === 'free' ? 'var(--success)' :
                               announcement.price_type === 'paid' ? 'var(--primary-orange)' :
                               '#9C27B0',
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '0.6rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              {getPriceLabel()}
            </span>

            {announcement.sub_category?.is_high_risk && (
              <span
                style={{
                  backgroundColor: 'var(--warning)',
                  color: '#856404',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaExclamationTriangle size={8} />
                تحقق
              </span>
            )}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#FFFFFF',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.6rem',
              fontWeight: 500,
              fontFamily: 'Cairo, sans-serif',
              backdropFilter: 'blur(4px)',
              zIndex: 5,
            }}
          >
            <FaEye size={10} />
            {announcement.views}
          </div>
        </div>

        {/* CONTENT - Bottom */}
        <Card.Body style={{ 
          padding: '0.8rem 0.9rem 0.9rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}>
          {/* User Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '8px',
              padding: '4px 10px',
              marginBottom: '0.4rem',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-card)',
                border: '2px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={announcement.user?.name || 'مستخدم'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.style.cssText = `
                        color: var(--text-muted);
                        font-size: 11px;
                        font-weight: 700;
                        font-family: 'Cairo', sans-serif;
                      `;
                      fallback.textContent = userInitials;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {userInitials}
                </span>
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {announcement.user?.name || 'مستخدم'}
                {announcement.user?.is_verified && (
                  <Badge
                    style={{
                      backgroundColor: 'var(--success)',
                      color: '#FFFFFF',
                      fontSize: '0.4rem',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <FaUserCheck size={7} /> موثق
                  </Badge>
                )}
              </span>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.5rem',
                  fontFamily: 'Cairo, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  opacity: 0.6,
                }}
              >
                <FaClock size={7} />
                {formatDate(announcement.created_at)}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
              <FaStar size={10} color="#F5A623" />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 700 }}>4.8</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/announcements/${announcement.id}`}
            style={{
              textDecoration: 'none',
              color: 'var(--text-secondary)',
              marginBottom: '0.2rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 0.2s ease',
                margin: 0,
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

          {/* Tags & Location */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center', marginBottom: '0.3rem', marginTop: 'auto' }}>
            <span
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-muted)',
                padding: '1px 8px',
                borderRadius: '4px',
                fontSize: '0.55rem',
                fontWeight: 500,
                fontFamily: 'Cairo, sans-serif',
                border: '1px solid var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <FaTag size={7} />
              {getCategoryLabel(announcement.category)}
            </span>

            {announcement.sub_category && (
              <span
                style={{
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  padding: '1px 8px',
                  borderRadius: '4px',
                  fontSize: '0.55rem',
                  fontWeight: 500,
                  fontFamily: 'Cairo, sans-serif',
                  border: '1px solid var(--border-color)',
                }}
              >
                {announcement.sub_category.name}
              </span>
            )}

            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.55rem',
                fontFamily: 'Cairo, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                opacity: 0.7,
              }}
            >
              <FaMapMarkerAlt size={8} color="var(--primary-orange)" />
              {announcement.governorate?.name || ''}
              {announcement.city?.name && ` - ${announcement.city.name}`}
            </span>
          </div>

          {/* ACTIONS */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            paddingTop: '0.4rem',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap',
          }}>
            <LikeButton
              announcementId={announcement.id}
              initialLiked={announcement.is_liked_by_user || false}
              initialCount={announcement.likes_count || 0}
              size="sm"
              showCount={true}
            />

            <Button
              as={Link as any}
              to={`/announcements/${announcement.id}`}
              size="sm"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                flex: 1,
                borderWidth: '1.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <FaChevronLeft size={8} />
              تفاصيل
            </Button>

            {contactConfig.disabled ? (
              <Button
                size="sm"
                disabled
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  borderWidth: '1.5px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                }}
                title={contactConfig.label}
              >
                {contactConfig.icon}
                {contactConfig.label}
              </Button>
            ) : contactConfig.variant === 'whatsapp' ? (
              <a
                href={contactConfig.to}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  border: 'none',
                  flex: 1,
                  minHeight: '28px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1DA851';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#25D366';
                }}
              >
                {contactConfig.icon}
                {contactConfig.label}
              </a>
            ) : (
              <Button
                as={Link as any}
                to={contactConfig.to}
                size="sm"
                style={{
                  backgroundColor: contactConfig.variant === 'warning' ? 'var(--warning)' : 'transparent',
                  borderColor: contactConfig.variant === 'warning' ? 'var(--warning)' : 'var(--border-color)',
                  color: contactConfig.variant === 'warning' ? '#856404' : 'var(--text-secondary)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  borderWidth: contactConfig.variant === 'warning' ? '0px' : '1.5px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                }}
                onMouseEnter={(e) => {
                  if (contactConfig.variant === 'warning') {
                    e.currentTarget.style.backgroundColor = '#E0A800';
                  } else {
                    e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                    e.currentTarget.style.borderColor = 'var(--primary-orange)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (contactConfig.variant === 'warning') {
                    e.currentTarget.style.backgroundColor = 'var(--warning)';
                  } else {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {contactConfig.icon}
                {contactConfig.label}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default AnnouncementPost;