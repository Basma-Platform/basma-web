import { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import { useAuth } from '../../hooks/useAuth';
import { useAdminProfile } from '../../hooks/useAdminProfile';
import AdminProfileHeader from '../../components/admin/profile/AdminProfileHeader';
import AdminStatsCards from '../../components/admin/profile/AdminStatsCards';
import AdminActivityCards from '../../components/admin/profile/AdminActivityCards';
import EditAdminProfileForm from '../../components/admin/profile/EditAdminProfileForm';
import AdminChangePasswordForm from '../../components/admin/profile/AdminChangePasswordForm';
import AdminProfileSkeleton from '../../components/admin/profile/AdminProfileSkeleton';
import type { AdminProfile } from '../../types';

const AdminProfilePage = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const {
    loading,
    statsLoading,
    adminStats,
    fetchAdminStats,
    updateAdminProfile,
    changeAdminPassword,
  } = useAdminProfile();

  // ============================================
  // Local State
  // ============================================
  const [localAdmin, setLocalAdmin] = useState<AdminProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // Sync localAdmin with authUser
  // ============================================
  useEffect(() => {
    if (authUser) {
      setLocalAdmin({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
        is_verified: authUser.is_verified,
        is_active: authUser.is_active,
        profile_image: authUser.profile_image,
        email_verified_at: authUser.email_verified_at,
        last_login_at: authUser.last_login_at,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at,
      });
    }
  }, [authUser]);

  // ============================================
  // Fetch Stats
  // ============================================
  useEffect(() => {
    const loadStats = async () => {
      try {
        setError(null);
        await fetchAdminStats();
      } catch (err) {
        setError('حدث خطأ في تحميل الإحصائيات. يرجى المحاولة مرة أخرى.');
      }
    };

    loadStats();
  }, [fetchAdminStats]);

  // ============================================
  // Handle Profile Update Success
  // ============================================
  const handleProfileUpdate = useCallback((updatedData: { name: string }) => {
    setLocalAdmin((prev) =>
      prev
        ? {
            ...prev,
            name: updatedData.name,
          }
        : prev
    );
  }, []);

  // ============================================
  // Handle Image Update
  // ============================================
  const handleImageUpdate = useCallback((newImagePath: string) => {
    setLocalAdmin((prev) =>
      prev
        ? {
            ...prev,
            profile_image: newImagePath,
          }
        : prev
    );
  }, []);

  // ============================================
  // Loading State
  // ============================================
  if (statsLoading && !adminStats) {
    return (
      <>
        <SEO
          title="الملف الشخصي - لوحة الإدارة"
          description="إدارة الملف الشخصي في لوحة تحكم بصمة"
        />
        <AdminProfileSkeleton />
      </>
    );
  }

  // ============================================
  // Not Authenticated / Not Admin
  // ============================================
  if (!isAuthenticated || !localAdmin || localAdmin.role !== 'admin') {
    return (
      <>
        <SEO title="الملف الشخصي - لوحة الإدارة" />
        <Container className="py-5">
          <div className="text-center py-5">
            <p
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              يجب تسجيل الدخول كمدير للوصول إلى هذه الصفحة
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
        title="الملف الشخصي - لوحة الإدارة"
        description={`الملف الشخصي لـ ${localAdmin.name} - إدارة معلوماتك الشخصية كمدير على منصة بصمة`}
        keywords="الملف الشخصي, لوحة الإدارة, بصمة, حسابي, تعديل الملف, تغيير كلمة المرور"
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
                to="/admin/dashboard"
                style={{
                  color: 'var(--primary-orange)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة الإدارة
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
                <FaShieldAlt size={26} color="#FFFFFF" />
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
                  إدارة معلومات حسابك كمشرف على النظام
                </p>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* Error Alert */}
          {/* ============================================ */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(220,53,69,0.08)',
                color: 'var(--error)',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '1rem',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                border: '1px solid rgba(220,53,69,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--error)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '2px 8px',
                }}
              >
                ✕
              </button>
            </motion.div>
          )}

          {/* ============================================ */}
          {/* Profile Header */}
          {/* ============================================ */}
          <AdminProfileHeader
            admin={localAdmin}
            onImageUpdate={handleImageUpdate}
          />

          {/* ============================================ */}
          {/* Stats Cards */}
          {/* ============================================ */}
          {adminStats && (
            <div style={{ marginTop: '1.5rem' }}>
              <AdminStatsCards stats={adminStats.stats} />
            </div>
          )}

          {/* ============================================ */}
          {/* Activity Cards */}
          {/* ============================================ */}
          {adminStats && (
            <AdminActivityCards activity={adminStats.activity} />
          )}

          {/* ============================================ */}
          {/* Edit Profile Form */}
          {/* ============================================ */}
          <EditAdminProfileForm
            admin={localAdmin}
            onSubmit={async (data) => {
              await updateAdminProfile(data);
              handleProfileUpdate(data);
            }}
            isLoading={loading}
          />

          {/* ============================================ */}
          {/* Change Password Form */}
          {/* ============================================ */}
          <AdminChangePasswordForm
            onSubmit={async (data) => {
              await changeAdminPassword(data);
            }}
            isLoading={loading}
          />
        </Container>
      </div>
    </>
  );
};

export default AdminProfilePage;