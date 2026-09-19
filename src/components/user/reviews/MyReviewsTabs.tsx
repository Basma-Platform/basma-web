import { motion } from 'framer-motion';
import { FaInbox, FaPaperPlane, FaChartBar } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export type MyReviewsTab = 'received' | 'given' | 'stats';

interface MyReviewsTabsProps {
  activeTab: MyReviewsTab;
  onTabChange: (tab: MyReviewsTab) => void;
  counts: {
    received: number;
    given: number;
  };
}

const MyReviewsTabs = ({
  activeTab,
  onTabChange,
  counts,
}: MyReviewsTabsProps) => {
  const tabs: {
    key: MyReviewsTab;
    label: string;
    Icon: IconType;
    count?: number;
    color: string;
  }[] = [
    {
      key: 'received',
      label: 'المستلمة',
      Icon: FaInbox,
      count: counts.received,
      color: '#28A745',
    },
    {
      key: 'given',
      label: 'المعطاة',
      Icon: FaPaperPlane,
      count: counts.given,
      color: '#E87A20',
    },
    {
      key: 'stats',
      label: 'الإحصائيات',
      Icon: FaChartBar,
      color: '#17A2B8',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        backgroundColor: 'var(--bg-input)',
        padding: '6px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem',
        overflowX: 'auto',
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
        boxSizing: 'border-box',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
      dir="rtl"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        const Icon = tab.Icon;

        return (
          <motion.button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            whileTap={{ scale: 0.97 }}
            style={{
              position: 'relative',
              flex: '1 1 auto',
              minWidth: '0px',
              padding: '9px 10px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: active ? 'var(--bg-card)' : 'transparent',
              color: active ? tab.color : 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.78rem',
              fontWeight: active ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: active ? '0 4px 12px var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <Icon size={12} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span
                style={{
                  padding: '1px 5px',
                  borderRadius: '6px',
                  backgroundColor: active
                    ? `${tab.color}15`
                    : 'rgba(0,0,0,0.06)',
                  color: active ? tab.color : 'var(--text-muted)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  fontFamily: 'system-ui, sans-serif',
                  minWidth: '16px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {tab.count > 99 ? '99+' : tab.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default MyReviewsTabs;