import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaBullhorn,
  FaTag,
  FaMapMarkedAlt,
  FaTrophy,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import TopUsersList from './TopUsersList';
import TopAnnouncementsList from './TopAnnouncementsList';
import TopCategoriesList from './TopCategoriesList';
import TopGovernoratesList from './TopGovernoratesList';
import TopPerformersSkeleton from './TopPerformersSkeleton';
import type { AdminDashboardTop } from '../../../../types';

interface TopPerformersTabsProps {
  top: AdminDashboardTop | null;
  loading?: boolean;
}

type TabKey = 'users' | 'announcements' | 'categories' | 'governorates';

interface TabConfig {
  key: TabKey;
  label: string;
  shortLabel: string;
  Icon: IconType;
  count: number;
  color: string;
  gradient: string;
}

/**
 * Top Performers — Full width with 4 tabs
 * Enhanced design for the full-width layout.
 */
const TopPerformersTabs = ({
  top,
  loading = false,
}: TopPerformersTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('users');

  if (loading || !top) {
    return <TopPerformersSkeleton />;
  }

  const tabs: TabConfig[] = [
    {
      key: 'users',
      label: 'أفضل المستخدمين',
      shortLabel: 'المستخدمون',
      Icon: FaUsers,
      count: top.top_users.length,
      color: '#E87A20',
      gradient: 'linear-gradient(135deg, #E87A20, #F5A623)',
    },
    {
      key: 'announcements',
      label: 'أفضل الإعلانات',
      shortLabel: 'الإعلانات',
      Icon: FaBullhorn,
      count: top.top_announcements.length,
      color: '#28A745',
      gradient: 'linear-gradient(135deg, #28A745, #4FCB6E)',
    },
    {
      key: 'categories',
      label: 'الفئات الأكثر نشاطاً',
      shortLabel: 'الفئات',
      Icon: FaTag,
      count: top.top_categories.length,
      color: '#17A2B8',
      gradient: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
    },
    {
      key: 'governorates',
      label: 'المحافظات الأكثر نشاطاً',
      shortLabel: 'المحافظات',
      Icon: FaMapMarkedAlt,
      count: top.top_governorates.length,
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
    },
  ];

  const activeTabConfig = tabs.find((t) => t.key === activeTab)!;

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <TopUsersList users={top.top_users} />;
      case 'announcements':
        return <TopAnnouncementsList announcements={top.top_announcements} />;
      case 'categories':
        return <TopCategoriesList categories={top.top_categories} />;
      case 'governorates':
        return <TopGovernoratesList governorates={top.top_governorates} />;
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Top Gradient Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #FFD700, #E87A20)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FFD700, #E87A20)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(255,215,0,0.35)',
          }}
        >
          <FaTrophy size={18} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            الأفضل أداءً
          </h3>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              margin: '2px 0 0',
            }}
          >
            {activeTabConfig.label} ({activeTabConfig.count})
          </p>
        </div>
      </div>

      {/* Tabs — enhanced for full-width */}
      <div
        className="top-tabs-scroll"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px',
          marginBottom: '1.25rem',
          padding: '4px',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
        }}
      >
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          const Icon = tab.Icon;

          return (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'relative',
                padding: '12px 14px',
                borderRadius: '11px',
                border: 'none',
                background: active
                  ? tab.gradient
                  : 'transparent',
                color: active ? '#FFFFFF' : 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.82rem',
                fontWeight: active ? 800 : 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: active
                  ? `0 6px 18px ${tab.color}45`
                  : 'none',
              }}
            >
              <Icon size={13} />
              <span className="tab-label-full">{tab.label}</span>
              <span className="tab-label-short">{tab.shortLabel}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '22px',
                  height: '20px',
                  padding: '0 6px',
                  borderRadius: '10px',
                  backgroundColor: active
                    ? 'rgba(255,255,255,0.25)'
                    : 'var(--bg-card)',
                  color: active ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  fontFamily: 'system-ui, sans-serif',
                  direction: 'ltr',
                }}
              >
                {tab.count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <style>{`
        .tab-label-short {
          display: none;
        }
        @media (max-width: 640px) {
          .tab-label-full {
            display: none;
          }
          .tab-label-short {
            display: inline;
          }
        }
        .top-tabs-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TopPerformersTabs;