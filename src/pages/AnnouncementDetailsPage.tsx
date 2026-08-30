import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { announcementService } from '../services/announcementService';
import { useAuth } from '../hooks/useAuth';
import { 
  FaWhatsapp, FaEye, FaMapMarkerAlt, FaTag, 
  FaLock, FaThumbtack, FaCalendarAlt, FaArrowRight, FaShareAlt,
  FaFlag, FaPrint, FaChevronRight, FaUser, FaStar,
  FaEnvelope
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import AnnouncementImageCarousel from '../components/announcements/AnnouncementImageCarousel';
import AnnouncementComments from '../components/announcements/AnnouncementComments';
import type { Announcement } from '../types';

const AnnouncementDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const isEmailVerified = user?.email_verified_at !== null && user?.email_verified_at !== undefined;

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await announcementService.getAnnouncement(Number(id));
        setAnnouncement(data);
      } catch (err) {
        setError('حدث خطأ في تحميل الإعلان. يرجى المحاولة مرة أخرى.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

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

  const getPriceLabel = () => {
    if (!announcement) return '';
    switch (announcement.price_type) {
      case 'free': return 'مجاني';
      case 'paid': return `${announcement.price} شيكل`;
      case 'barter': return 'مقايضة';
      default: return '';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: announcement?.title || 'إعلان على بصمة',
          text: announcement?.description?.slice(0, 100) || '',
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      } catch {
        alert('📋 الرابط: ' + window.location.href);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" style={{ color: 'var(--primary-orange)', width: '3rem', height: '3rem' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontFamily: 'Cairo, sans-serif' }}>جاري تحميل الإعلان...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s ease' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '3rem', maxWidth: '500px', boxShadow: '0 4px 16px var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'Cairo, sans-serif' }}>{error || 'الإعلان غير موجود'}</h3>
          <Link to="/announcements" style={{ color: 'var(--primary-orange)', textDecoration: 'none', fontFamily: 'Cairo, sans-serif', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>العودة إلى الإعلانات <FaArrowRight /></Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={announcement.title} description={announcement.description.slice(0, 160)} />
      <div style={{ paddingTop: '80px', paddingBottom: '60px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
        <Container>
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'Cairo, sans-serif', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}>الرئيسية</Link>
            <FaChevronRight size={10} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <Link to="/announcements" style={{ color: 'var(--primary-orange)', textDecoration: 'none' }}>الإعلانات</Link>
            <FaChevronRight size={10} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{announcement.title.length > 30 ? announcement.title.slice(0, 30) + '...' : announcement.title}</span>
          </motion.nav>

          <Row className="g-4">
            <Col xs={12} lg={8}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <AnnouncementImageCarousel images={announcement.images || []} title={announcement.title} />
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem', position: 'relative' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-orange)'; e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
                    >
                      <FaShareAlt size={16} color="var(--text-muted)" /> مشاركة
                      {showShareTooltip && <span style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.7rem', border: '1px solid var(--border-color)', whiteSpace: 'nowrap', boxShadow: '0 4px 12px var(--shadow-sm)' }}>✅ تم نسخ الرابط</span>}
                    </button>
                    <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-orange)'; e.currentTarget.style.backgroundColor = 'rgba(232,122,32,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
                    ><FaPrint size={16} color="var(--text-muted)" /> طباعة</button>
                  </div>

                  {isAuthenticated ? (
                    isEmailVerified ? (
                      <button onClick={() => { if (confirm('هل أنت متأكد من رغبتك في الإبلاغ عن هذا الإعلان؟')) { alert('✅ تم إرسال البلاغ. سيتم مراجعته من قبل الإدارة.'); } }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#DC3545'; e.currentTarget.style.color = '#DC3545'; e.currentTarget.style.backgroundColor = 'rgba(220,53,69,0.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      ><FaFlag size={14} /> تبليغ</button>
                    ) : (
                      <Link to="/verify-email" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #FFC107', backgroundColor: 'rgba(255,193,7,0.08)', color: '#856404', textDecoration: 'none', fontFamily: 'Cairo, sans-serif', fontSize: '0.8rem', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,193,7,0.15)'; e.currentTarget.style.borderColor = '#E0A800'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,193,7,0.08)'; e.currentTarget.style.borderColor = '#FFC107'; }}
                      ><FaEnvelope size={14} /> فعّل بريدك للتبليغ</Link>
                    )
                  ) : (
                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-orange)'; e.currentTarget.style.color = 'var(--primary-orange)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    ><FaFlag size={14} /> تبليغ (تسجيل الدخول مطلوب)</Link>
                  )}
                </div>

                <div style={{ marginTop: '1.25rem', backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                  <h1 style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 900, fontFamily: 'Cairo, sans-serif', marginBottom: '0.75rem', lineHeight: 1.3 }}>{announcement.title}</h1>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                    <span style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F0EBE5', color: isDark ? '#C49A6C' : '#6B4226', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaTag size={10} /> {getCategoryLabel(announcement.category)}</span>
                    <span style={{ backgroundColor: getTypeColor(announcement.type) + '15', color: getTypeColor(announcement.type), padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{getTypeLabel(announcement.type)}</span>
                    <span style={{ backgroundColor: announcement.price_type === 'free' ? '#28A74515' : announcement.price_type === 'paid' ? 'rgba(232,122,32,0.15)' : '#9C27B015', color: announcement.price_type === 'free' ? '#28A745' : announcement.price_type === 'paid' ? 'var(--primary-orange)' : '#9C27B0', padding: '4px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{getPriceLabel()}</span>
                    {announcement.pinned_at && <span style={{ backgroundColor: 'var(--primary-orange)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaThumbtack size={10} /> مميز</span>}
                    {announcement.privacy_type !== 'public' && <span style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)', color: isDark ? '#C49A6C' : '#6B4226', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaLock size={9} /> {announcement.privacy_type === 'verified_only' ? 'موثقين فقط' : announcement.privacy_type === 'region_only' ? 'نفس المنطقة' : 'موثق + المنطقة'}</span>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: isDark ? '#2a3a5a' : '#e8e0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#C49A6C' : '#8B5A2B', fontSize: '18px', flexShrink: 0 }}><FaUser /></div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>{announcement.user?.name || 'مستخدم'} {announcement.user?.is_verified && <Badge style={{ backgroundColor: '#28A745', color: '#FFFFFF', fontSize: '0.5rem', padding: '2px 8px', borderRadius: '8px' }}>موثق</Badge>}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}><FaCalendarAlt size={12} /> {formatDate(announcement.created_at)} <span style={{ margin: '0 4px' }}>•</span> <FaEye size={12} /> {announcement.views}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.05)', padding: '4px 12px', borderRadius: '8px' }}><FaStar size={14} color="#F5A623" /> <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>4.8</span> <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'Cairo, sans-serif' }}>(12 تقييم)</span></div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(139,90,43,0.03)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <FaMapMarkerAlt size={14} color="var(--primary-orange)" />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>{announcement.governorate?.name || 'غير محدد'}{announcement.city?.name && ` - ${announcement.city.name}`}</span>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.8, fontFamily: 'Cairo, sans-serif', whiteSpace: 'pre-wrap' }}>{announcement.description}</div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    {isAuthenticated ? (
                      isEmailVerified ? (
                        <Button href={`https://wa.me/${announcement.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: '#FFFFFF', width: '100%', borderRadius: '12px', padding: '14px', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Cairo, sans-serif', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1DA851'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,211,102,0.4)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#25D366'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.3)'; }}
                        ><FaWhatsapp size={24} /> التواصل عبر واتساب</Button>
                      ) : (
                        <Button as={Link as any} to="/verify-email" style={{ backgroundColor: '#FFC107', borderColor: '#FFC107', color: '#212529', width: '100%', borderRadius: '12px', padding: '14px', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Cairo, sans-serif', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 4px 16px rgba(255,193,7,0.3)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E0A800'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,193,7,0.4)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFC107'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,193,7,0.3)'; }}
                        ><FaEnvelope size={20} /> فعّل بريدك الإلكتروني للتواصل</Button>
                      )
                    ) : (
                      <Button as={Link as any} to="/login" style={{ backgroundColor: 'transparent', borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)', width: '100%', borderRadius: '12px', padding: '14px', fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Cairo, sans-serif', transition: 'all 0.3s ease', borderWidth: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-orange)'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,122,32,0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--primary-orange)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      ><FaLock size={16} /> سجل الدخول للتواصل</Button>
                    )}
                  </div>
                </div>
              </motion.div>

              <div style={{ marginTop: '1.5rem' }}>
                <AnnouncementComments isLoggedIn={!!isAuthenticated} />
              </div>
            </Col>

            <Col xs={12} lg={4}>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} style={{ position: 'sticky', top: '90px' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 4px 16px var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(232,122,32,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🛡️</div>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 700, fontFamily: 'Cairo, sans-serif', margin: 0 }}>إرشادات الأمان</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[{ icon: '📍', text: 'اختر مكاناً عاماً للقاء' }, { icon: '👤', text: 'أخبر أحداً عن موعد اجتماعك' }, { icon: '⭐', text: 'تحقق من التقييمات قبل التعامل' }, { icon: '🚫', text: 'ألغِ الاجتماع إذا شعرت بعدم الأمان' }, { icon: '🚨', text: 'أبلغ عن أي سلوك مشبوه' }].map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(139,90,43,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(-4px)'; e.currentTarget.style.borderColor = 'var(--primary-orange)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(232,122,32,0.05)' : 'rgba(232,122,32,0.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(139,90,43,0.03)'; }}
                      ><span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span> <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Cairo, sans-serif', lineHeight: 1.4 }}>{item.text}</span></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AnnouncementDetailsPage;