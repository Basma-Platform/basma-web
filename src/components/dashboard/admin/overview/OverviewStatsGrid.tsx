import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBullhorn,
  FaStar,
  FaMoneyBillWave,
  FaFlag,
  FaShieldAlt,
  FaEye,
  FaHeart,
} from 'react-icons/fa';
import StatCard from './StatCard';
import type { AdminDashboardStats } from '../../../../types';

interface OverviewStatsGridProps {
  stats: AdminDashboardStats;
}

/**
 * Overview KPIs Grid
 * - 8 stat cards (users, announcements, engagement, moderation, financial)
 * - Responsive: 1 col mobile → 2 col sm → 4 col lg
 * - Each card is clickable if it has a "details" page
 */
const OverviewStatsGrid = ({ stats }: OverviewStatsGridProps) => {
  const cards = [
    // Row 1 — Users
    {
      title: 'إجمالي المستخدمين',
      value: stats.users.total,
      subtitle: `${stats.users.verified} موثق`,
      icon: <FaUsers size={16} />,
      color: '#E87A20',
      bgColor: 'rgba(232, 122, 32, 0.12)',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
      link: '/admin/users',
      trend: stats.users.new_this_week > 0
        ? { value: stats.users.new_this_week, label: 'هذا الأسبوع' }
        : undefined,
    },
    {
      title: 'الإعلانات النشطة',
      value: stats.announcements.active,
      subtitle: `${stats.announcements.total} إجمالي`,
      icon: <FaBullhorn size={16} />,
      color: '#28A745',
      bgColor: 'rgba(40, 167, 69, 0.12)',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
      link: '/admin/announcements',
    },
    {
      title: 'المشاهدات',
      value: stats.announcements.total_views,
      subtitle: 'إجمالي المشاهدات',
      icon: <FaEye size={16} />,
      color: '#17A2B8',
      bgColor: 'rgba(23, 162, 184, 0.12)',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
    },
    {
      title: 'الإعجابات',
      value: stats.engagement.total_likes,
      subtitle: `${stats.engagement.total_ratings} تقييم`,
      icon: <FaHeart size={16} />,
      color: '#E91E63',
      bgColor: 'rgba(233, 30, 99, 0.12)',
      gradient: 'linear-gradient(135deg, #E91E63, #F56575)',
    },
    // Row 2 — Moderation & Financial
    {
      title: 'بلاغات معلقة',
      value: stats.moderation.pending_reports,
      subtitle: `${stats.moderation.high_priority_reports} عالية الأولوية`,
      icon: <FaFlag size={16} />,
      color: '#DC3545',
      bgColor: 'rgba(220, 53, 69, 0.12)',
      gradient: 'linear-gradient(135deg, #DC3545, #F56575)',
      link: '/admin/reports?status=pending',
      badge: stats.moderation.pending_reports > 0 ? stats.moderation.pending_reports : undefined,
      badgeColor: '#DC3545',
    },
    {
      title: 'طلبات التوثيق',
      value: stats.moderation.pending_verifications,
      subtitle: 'في انتظار المراجعة',
      icon: <FaShieldAlt size={16} />,
      color: '#17A2B8',
      bgColor: 'rgba(23, 162, 184, 0.12)',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
      link: '/admin/verification?status=pending',
      badge:
        stats.moderation.pending_verifications > 0
          ? stats.moderation.pending_verifications
          : undefined,
      badgeColor: '#17A2B8',
    },
    {
      title: 'الإعلانات المميزة',
      value: stats.moderation.pending_featured,
      subtitle: 'طلبات قيد المراجعة',
      icon: <FaStar size={16} />,
      color: '#9C27B0',
      bgColor: 'rgba(156, 39, 176, 0.12)',
      gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
      link: '/admin/featured-requests?status=pending',
      badge:
        stats.moderation.pending_featured > 0
          ? stats.moderation.pending_featured
          : undefined,
      badgeColor: '#9C27B0',
    },
    {
      title: 'الإيرادات (₪)',
      value: stats.financial.total_revenue,
      subtitle: `${stats.financial.this_month_revenue} ₪ هذا الشهر`,
      icon: <FaMoneyBillWave size={16} />,
      color: '#FFC107',
      bgColor: 'rgba(255, 193, 7, 0.12)',
      gradient: 'linear-gradient(135deg, #FFC107, #FFD966)',
      link: '/admin/featured-requests',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06 } },
      }}
      dir="rtl"
      className="overview-stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '12px',
        width: '100%',
      }}
    >
      {cards.map((card, index) => (
        <StatCard key={index} {...card} delay={index * 0.04} />
      ))}

      <style>{`
        @media (max-width: 640px) {
          .overview-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }
        }
        @media (max-width: 380px) {
          .overview-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default OverviewStatsGrid;