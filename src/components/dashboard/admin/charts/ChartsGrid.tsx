import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaUserPlus,
  FaBullhorn,
  FaChartPie,
  FaMapMarkedAlt,
  FaFlag,
  FaShieldAlt,
  FaCreditCard,
  FaCalendarAlt,
} from 'react-icons/fa';
import ChartCard from './ChartCard';
import UserGrowthChart from './UserGrowthChart';
import AnnouncementsCreatedChart from './AnnouncementsCreatedChart';
import ActivityOverviewChart from './ActivityOverviewChart';
import AnnouncementsByCategoryChart from './AnnouncementsByCategoryChart';
import AnnouncementsByGovernorateChart from './AnnouncementsByGovernorateChart';
import ReportsStatusChart from './ReportsStatusChart';
import VerificationStatusChart from './VerificationStatusChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import ChartsSkeleton from './ChartsSkeleton';
import type { AdminDashboardCharts, ChartDaysRange } from '../../../../types';

interface ChartsGridProps {
  charts: AdminDashboardCharts | null;
  loading?: boolean;
  days: ChartDaysRange;
  onDaysChange: (days: ChartDaysRange) => void;
}

const DAYS_OPTIONS: { value: ChartDaysRange; label: string }[] = [
  { value: 7, label: '7 أيام' },
  { value: 14, label: '14 يوم' },
  { value: 30, label: '30 يوم' },
  { value: 60, label: '60 يوم' },
  { value: 90, label: '90 يوم' },
];

/**
 * Charts Grid — All 8 charts in one responsive grid
 * - Days selector in top-right
 * - 2 columns on desktop, 1 on mobile
 * - Empty state when API returns no data
 */
const ChartsGrid = ({
  charts,
  loading = false,
  days,
  onDaysChange,
}: ChartsGridProps) => {
  const [showDaysMenu, setShowDaysMenu] = useState(false);

  if (loading || !charts) {
    return <ChartsSkeleton count={8} />;
  }

  const DaysSelector = (
    <div style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDaysMenu((v) => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-secondary)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <FaCalendarAlt size={11} />
        <span>{DAYS_OPTIONS.find((o) => o.value === days)?.label}</span>
      </motion.button>

      {showDaysMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
            }}
            onClick={() => setShowDaysMenu(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              minWidth: '120px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 12px 32px var(--shadow-md)',
              padding: '6px',
              zIndex: 100,
            }}
          >
            {DAYS_OPTIONS.map((opt) => {
              const active = opt.value === days;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onDaysChange(opt.value);
                    setShowDaysMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: active
                      ? 'rgba(232,122,32,0.08)'
                      : 'transparent',
                    color: active
                      ? 'var(--primary-orange)'
                      : 'var(--text-secondary)',
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.78rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'right',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor =
                        'rgba(232,122,32,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );

  return (
    <div
      className="charts-grid"
      dir="rtl"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '12px',
        width: '100%',
      }}
    >
      {/* 1. User Growth */}
      <ChartCard
        title="نمو المستخدمين"
        subtitle="المستخدمون الجدد والمجموع التراكمي"
        icon={<FaUserPlus size={14} />}
        action={DaysSelector}
        delay={0.05}
        minHeight="320px"
        isEmpty={charts.user_growth.labels.length === 0}
      >
        <UserGrowthChart data={charts.user_growth} height={240} />
      </ChartCard>

      {/* 2. Announcements Created */}
      <ChartCard
        title="الإعلانات المنشأة"
        subtitle="عدد الإعلانات الجديدة يومياً"
        icon={<FaBullhorn size={14} />}
        delay={0.1}
        minHeight="320px"
        isEmpty={charts.announcements_created.labels.length === 0}
      >
        <AnnouncementsCreatedChart
          data={charts.announcements_created}
          height={240}
        />
      </ChartCard>

      {/* 3. Activity Overview — Full Width */}
      <ChartCard
        title="نظرة شاملة على النشاط"
        subtitle="جميع الأنشطة الرئيسية في رسم واحد"
        icon={<FaChartLine size={14} />}
        delay={0.15}
        minHeight="380px"
        fullWidth
        isEmpty={charts.activity_overview.labels.length === 0}
      >
        <ActivityOverviewChart
          data={charts.activity_overview}
          height={300}
        />
      </ChartCard>

      {/* 4. Announcements by Category */}
      <ChartCard
        title="توزيع الإعلانات بالفئة"
        subtitle="سلع مقابل خدمات"
        icon={<FaChartPie size={14} />}
        delay={0.2}
        minHeight="300px"
        isEmpty={charts.announcements_by_category.series.length === 0}
      >
        <AnnouncementsByCategoryChart
          data={charts.announcements_by_category}
          height={240}
        />
      </ChartCard>

      {/* 5. Announcements by Governorate */}
      <ChartCard
        title="توزيع الإعلانات بالمحافظة"
        subtitle="أعلى المحافظات نشاطاً"
        icon={<FaMapMarkedAlt size={14} />}
        delay={0.25}
        minHeight="300px"
        isEmpty={charts.announcements_by_governorate.series.length === 0}
      >
        <AnnouncementsByGovernorateChart
          data={charts.announcements_by_governorate}
          height={240}
        />
      </ChartCard>

      {/* 6. Reports Status */}
      <ChartCard
        title="حالات البلاغات"
        subtitle="حسب الحالة الحالية"
        icon={<FaFlag size={14} />}
        delay={0.3}
        minHeight="300px"
        isEmpty={charts.reports_status.series.length === 0}
      >
        <ReportsStatusChart data={charts.reports_status} height={240} />
      </ChartCard>

      {/* 7. Verification Status */}
      <ChartCard
        title="حالات التوثيق"
        subtitle="طلبات التوثيق حسب الحالة"
        icon={<FaShieldAlt size={14} />}
        delay={0.35}
        minHeight="300px"
        isEmpty={charts.verification_status.series.length === 0}
      >
        <VerificationStatusChart
          data={charts.verification_status}
          height={240}
        />
      </ChartCard>

      {/* 8. Payment Methods — Full Width */}
      <ChartCard
        title="طرق الدفع للتمييز"
        subtitle="عدد الطلبات والإيرادات لكل طريقة"
        icon={<FaCreditCard size={14} />}
        delay={0.4}
        minHeight="320px"
        fullWidth
        isEmpty={charts.payment_methods.labels.length === 0}
      >
        <PaymentMethodsChart data={charts.payment_methods} height={260} />
      </ChartCard>

      <style>{`
        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartsGrid;