import { useEffect, useCallback, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  FaTachometerAlt,
  FaBullhorn,
  FaTrophy,
  FaHistory,
  FaChartBar,
} from 'react-icons/fa';
import SEO from '../../components/SEO';
import {
  DashboardSection,
  RefreshIndicator,
} from '../../components/dashboard/admin/shared';
import {
  OverviewStatsGrid,
  OverviewStatsSkeleton,
} from '../../components/dashboard/admin/overview';
import { PendingItemsPanel } from '../../components/dashboard/admin/pending';
import { ChartsGrid } from '../../components/dashboard/admin/charts';
import { TopPerformersTabs } from '../../components/dashboard/admin/top';
import { ActivityFeed } from '../../components/dashboard/admin/activity';
import { AdvancedStatsPanel } from '../../components/dashboard/admin/advanced';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAdminDashboardCharts } from '../../hooks/useAdminDashboardCharts';
import { useAdminDashboardStats } from '../../hooks/useAdminDashboardStats';
import type { ChartDaysRange } from '../../types';

/**
 * Admin Dashboard — Main page
 *
 * Layout:
 * 1. Header
 * 2. Overview Stats Grid (8 KPIs)
 * 3. Pending Items Panel
 * 4. Charts Grid (8 charts)
 * 5. Advanced Stats (full-width, 2×2)
 * 6. Activity Feed (full-width, 2/row items)
 * 7. Top Performers (full-width)
 * 8. View All Activity link
 */
const AdminDashboard = () => {
  // Main dashboard hook
  const {
    overview,
    pending,
    top,
    loading,
    refreshing,
    error,
    refresh,
    fetchDashboard,
  } = useAdminDashboard();

  // Charts hook
  const {
    charts,
    loading: chartsLoading,
    days,
    fetchAllCharts,
    setDays,
  } = useAdminDashboardCharts();

  // Advanced stats hook
  const {
    advanced,
    loadingAdvanced,
    fetchAdvanced,
  } = useAdminDashboardStats();

  const hasFetchedRef = useRef(false);

  // ============================================
  // Initial load — fires exactly once
  // ============================================
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchDashboard();
    fetchAllCharts(30);
    fetchAdvanced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Handle days change
  // ============================================
  const handleDaysChange = useCallback(
    async (newDays: ChartDaysRange) => {
      setDays(newDays);
      await fetchAllCharts(newDays);
    },
    [setDays, fetchAllCharts]
  );

  // ============================================
  // Error state
  // ============================================
  if (error && !overview) {
    return (
      <>
        <SEO
          title="لوحة الإدارة"
          description="لوحة تحكم المدير العام لمنصة بصمة"
        />
        <Container fluid="xl" className="px-3 px-md-4 py-5">
          <div
            dir="rtl"
            style={{
              maxWidth: '500px',
              margin: '2rem auto',
              padding: '2.5rem 1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid rgba(220,53,69,0.3)',
              borderRadius: '16px',
              textAlign: 'center',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(220,53,69,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DC3545',
                fontSize: '1.5rem',
              }}
            >
              ⚠️
            </div>
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                fontWeight: 800,
                marginBottom: '8px',
              }}
            >
              تعذر تحميل لوحة التحكم
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <SEO
        title="لوحة الإدارة"
        description="نظرة شاملة على منصة بصمة - الإحصائيات، الإشراف، والنشاطات"
        keywords="لوحة الإدارة, بصمة, إحصائيات, إشراف, تحليلات"
      />

      <div
        dir="rtl"
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '1rem',
          paddingBottom: '3rem',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* ============================================
              Page Header
              ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: 0,
                flex: '1 1 auto',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 6px 20px rgba(232,122,32,0.35)',
                }}
              >
                <FaTachometerAlt size={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
                    fontWeight: 900,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  لوحة الإدارة
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 'clamp(0.72rem, 1vw, 0.85rem)',
                    margin: '2px 0 0',
                    lineHeight: 1.3,
                  }}
                >
                  نظرة شاملة على المنصة - الإحصائيات، الإشراف، والنشاطات
                </p>
              </div>
            </div>

            <RefreshIndicator
              refreshing={refreshing}
              lastUpdated={
                overview
                  ? new Date().toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : null
              }
              onRefresh={refresh}
            />
          </motion.div>

          {/* ============================================
              1. Overview Stats
              ============================================ */}
          <DashboardSection
            title="نظرة عامة"
            subtitle="المؤشرات الرئيسية للمنصة"
            icon={<FaBullhorn size={14} />}
            delay={0.05}
          >
            {loading && !overview ? (
              <OverviewStatsSkeleton count={8} />
            ) : overview ? (
              <OverviewStatsGrid stats={overview} />
            ) : null}
          </DashboardSection>

          {/* ============================================
              2. Pending Items
              ============================================ */}
          <DashboardSection
            title="بحاجة إلى انتباهك"
            subtitle="العناصر المعلقة التي تحتاج مراجعة فورية"
            delay={0.1}
          >
            <PendingItemsPanel
              pending={pending}
              loading={loading && !pending}
            />
          </DashboardSection>

          {/* ============================================
              3. Charts Grid
              ============================================ */}
          <DashboardSection
            title="الرسوم البيانية التحليلية"
            subtitle="نظرة عميقة على البيانات والاتجاهات"
            delay={0.15}
          >
            <ChartsGrid
              charts={charts}
              loading={chartsLoading && !charts}
              days={days}
              onDaysChange={handleDaysChange}
            />
          </DashboardSection>

          {/* ============================================
              4. Advanced Stats — full width, 2×2
              ============================================ */}
          <DashboardSection
            title="إحصائيات متقدمة"
            subtitle="الاحتفاظ، الجودة، الكفاءة، وصحة النظام"
            icon={<FaChartBar size={14} />}
            delay={0.2}
          >
            <AdvancedStatsPanel
              advanced={advanced}
              loading={loadingAdvanced && !advanced}
            />
          </DashboardSection>

          {/* ============================================
              5. Activity Feed — full width, 2/row items
              ============================================ */}
          <DashboardSection
            title="النشاطات الأخيرة"
            subtitle="تحديث مباشر"
            icon={<FaHistory size={14} />}
            delay={0.25}
          >
            <ActivityFeed live={true} maxItems={20} />
          </DashboardSection>

          {/* ============================================
              6. Top Performers — full width
              ============================================ */}
          <DashboardSection
            title="الأفضل أداءً"
            subtitle="أعلى المستخدمين والإعلانات والفئات والمحافظات"
            icon={<FaTrophy size={14} />}
            delay={0.3}
          >
            <TopPerformersTabs top={top} loading={loading && !top} />
          </DashboardSection>

          {/* ============================================
              7. View All Activity CTA
              ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
            style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px dashed var(--border-color)',
              borderRadius: '16px',
            }}
          >
            <a
              href="/admin/activity-log"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--primary-orange)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <FaHistory size={13} />
              عرض سجل النشاطات الكامل
              <span style={{ fontSize: '1rem' }}>←</span>
            </a>
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default AdminDashboard;