import { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaUserCircle, FaUserCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import ProfileHeader from '../../components/user/profile/ProfileHeader';
import ProfileStatsCards from '../../components/user/profile/ProfileStatsCards';
import ProfileVerificationCard from '../../components/user/profile/ProfileVerificationCard';
import ProfileMonthlyLimit from '../../components/user/profile/ProfileMonthlyLimit';
import EditProfileForm from '../../components/user/profile/EditProfileForm';
import ChangePasswordForm from '../../components/user/profile/ChangePasswordForm';
import ProfileSkeleton from '../../components/user/profile/ProfileSkeleton';
import WarningCard from '../../components/user/profile/WarningCard';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { regionService } from '../../services/regionService';
import type { Governorate, City, User } from '../../types';

const UserProfilePage = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const { profileStats, statsLoading, fetchProfileStats } = useProfile();

  // ============================================
  // Local State
  // ============================================
  const [localUser, setLocalUser] = useState<User | null>(authUser);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Flags لمنع التكرار
  const statsFetched = useRef(false);
  const governoratesFetched = useRef(false);
  const initialCitiesLoaded = useRef(false);

  // ============================================
  // Sync local user with auth user
  // ============================================
  useEffect(() => {
    if (authUser) {
      setLocalUser(authUser);
    }
  }, [authUser]);

  // ============================================
  // Fetch Stats
  // ============================================
  useEffect(() => {
    if (statsFetched.current) return;
    statsFetched.current = true;

    const loadStats = async () => {
      try {
        setError(null);
        await fetchProfileStats();
      } catch (err) {
        setError('حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.');
      }
    };

    loadStats();
  }, [fetchProfileStats]);

  // ============================================
  // Fetch Governorates
  // ============================================
  useEffect(() => {
    if (governoratesFetched.current) return;
    governoratesFetched.current = true;

    const loadGovernorates = async () => {
      try {
        const data = await regionService.getGovernorates();
        setGovernorates(data);
      } catch (err) {
        console.error('Error loading governorates:', err);
      }
    };

    loadGovernorates();
  }, []);

  // ============================================
  // Load Cities for Selected Governorate
  // ============================================
  const handleCitiesLoad = useCallback(async (governorateId: number) => {
    try {
      setLoadingCities(true);
      const data = await regionService.getCities(governorateId);
      setCities(data);
    } catch (err) {
      console.error('Error loading cities:', err);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // ============================================
  // Load initial cities for user's governorate
  // ============================================
  useEffect(() => {
    if (initialCitiesLoaded.current) return;
    if (!localUser?.governorate_id) return;

    initialCitiesLoaded.current = true;
    handleCitiesLoad(localUser.governorate_id);
  }, [localUser?.governorate_id, handleCitiesLoad]);

  // ============================================
  // Handle Profile Update Success
  // ============================================
  const handleProfileUpdate = (updatedUser: User) => {
    setLocalUser(updatedUser);
  };

  // ============================================
  // Handle Image Update
  // ============================================
  const handleImageUpdate = (newImagePath: string) => {
    if (localUser) {
      setLocalUser({ ...localUser, profile_image: newImagePath });
    }
  };

  // ============================================
  // Determine if form is ready to render
  // ============================================
  const isFormReady =
    localUser !== null &&
    governorates.length > 0 &&
    (localUser.governorate_id ? cities.length > 0 : true);

  // ============================================
  // Loading State
  // ============================================
  if (statsLoading && !profileStats) {
    return (
      <>
        <SEO
          title="الملف الشخصي"
          description="إدارة ملفك الشخصي في منصة بصمة - تحديث بياناتك، صورة حسابك، وكلمة المرور"
        />
        <ProfileSkeleton />
      </>
    );
  }

  // ============================================
  // Not Authenticated
  // ============================================
  if (!isAuthenticated || !localUser) {
    return (
      <>
        <SEO title="الملف الشخصي" />
        <Container className="py-5">
          <div className="text-center py-5">
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif' }}>
              يجب تسجيل الدخول للوصول إلى الملف الشخصي
            </p>
          </div>
        </Container>
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="الملف الشخصي"
        description={`الملف الشخصي لـ ${localUser.name} - إدارة معلوماتك الشخصية، إحصائياتك، وكلمة المرور على منصة بصمة`}
        keywords="الملف الشخصي, بصمة, حسابي, تعديل الملف, تغيير كلمة المرور"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
        }}
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* ============================================ */}
          {/* Breadcrumb + Page Title */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.5rem' }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/user/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة التحكم
              </Link>
              <FaChevronLeft size={10} style={{ opacity: 0.4 }} />
              <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                الملف الشخصي
              </span>
            </div>

            {/* Page Title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                }}
              >
                <FaUserCircle size={26} color="#FFFFFF" />
              </div>
              <div>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.4rem, 2vw, 1.7rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  الملف الشخصي
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                  }}
                >
                  إدارة معلوماتك الشخصية وإعدادات حسابك
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Error Alert */}
          {/* ============================================ */}
          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
              style={{
                borderRadius: '12px',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
              }}
            >
              {error}
            </Alert>
          )}

          {/* ============================================ */}
          {/* Warning Card — only renders when user has warnings */}
          {/* ============================================ */}
          {localUser.warnings && localUser.warnings.count > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <WarningCard warnings={localUser.warnings} />
            </div>
          )}

          {/* ============================================ */}
          {/* Profile Header */}
          {/* ============================================ */}
          <ProfileHeader
            user={localUser}
            onImageUpdate={handleImageUpdate}
          />

          {/* ============================================ */}
          {/* Stats Cards */}
          {/* ============================================ */}
          {profileStats && (
            <div style={{ marginTop: '1.5rem' }}>
              <ProfileStatsCards stats={profileStats.stats} />
            </div>
          )}

          {/* ============================================ */}
          {/* Main Content: Two Columns */}
          {/* ============================================ */}
          <Row className="g-4 mt-2">
            {/* Left Column: Forms */}
            <Col xs={12} lg={8}>
              {isFormReady ? (
                <EditProfileForm
                  key={`edit-profile-${localUser.id}-${localUser.governorate_id}-${cities.length}`}
                  user={localUser}
                  governorates={governorates}
                  cities={cities}
                  onCitiesLoad={handleCitiesLoad}
                  onSuccess={handleProfileUpdate}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px var(--shadow-sm)',
                  }}
                >
                  <div
                    className="spinner-border"
                    style={{
                      color: 'var(--primary-orange)',
                      width: '2.5rem',
                      height: '2.5rem',
                    }}
                  />
                  <p
                    style={{
                      color: 'var(--text-muted)',
                      marginTop: '1rem',
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.9rem',
                    }}
                  >
                    جاري تحميل بيانات الملف الشخصي...
                  </p>
                </div>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <ChangePasswordForm />
              </div>
            </Col>

            {/* Right Column: Sidebar */}
            <Col xs={12} lg={4}>
              {profileStats && (
                <>
                  {/* Verification Card */}
                  <ProfileVerificationCard
                    verification={profileStats.verification_status}
                  />

                  {/* Monthly Limit */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <ProfileMonthlyLimit
                      stats={profileStats.stats}
                      isVerified={localUser.is_verified}
                    />
                  </div>
                </>
              )}

              {/* Loading cities indicator (optional) */}
              {loadingCities && (
                <div
                  style={{
                    marginTop: '1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  جاري تحميل المدن...
                </div>
              )}
            </Col>
          </Row>

          {/* ============================================ */}
          {/* Footer Note */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '2rem',
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <FaUserCog size={16} color="var(--primary-orange)" />
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              هل تواجه مشكلة في حسابك؟{' '}
              <Link
                to="/contact"
                style={{
                  color: 'var(--primary-orange)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                تواصل مع الدعم
              </Link>
            </span>
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default UserProfilePage;