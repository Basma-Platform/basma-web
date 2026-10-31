import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { CommunityIcons, getCommunityTypeIcon } from '../../../utils/communityIcons';
import {
  COMMUNITY_THEME,
  getCommunityTypeColor,
  getCommunityTypeLabel,
} from '../../../utils/communityHelpers';
import type { AdminCommunityStats, CommunityPostType } from '../../../types';

interface AdminCommunityStatsCardsProps {
  stats: AdminCommunityStats | null;
  loading?: boolean;
}

const AdminCommunityStatsCards = ({
  stats,
  loading = false,
}: AdminCommunityStatsCardsProps) => {
  const TYPES: CommunityPostType[] = ['warning', 'lost', 'found', 'general'];

  const cards = [
    {
      key: 'total',
      icon: <CommunityIcons.images size={20} />,
      label: 'إجمالي المنشورات',
      value: stats?.total ?? 0,
      accent: COMMUNITY_THEME.accent,
    },
    {
      key: 'pending',
      icon: <CommunityIcons.clock size={20} />,
      label: 'قيد المراجعة',
      value: stats?.pending ?? 0,
      accent: '#FFC107',
    },
    {
      key: 'approved',
      icon: <CommunityIcons.confirm size={20} />,
      label: 'منشور',
      value: stats?.approved ?? 0,
      accent: '#28A745',
    },
    {
      key: 'rejected',
      icon: <CommunityIcons.ban size={20} />,
      label: 'مرفوض',
      value: stats?.rejected ?? 0,
      accent: '#DC3545',
    },
    {
      key: 'today_new',
      icon: <CommunityIcons.add size={20} />,
      label: 'جديد اليوم',
      value: stats?.today_new ?? 0,
      accent: '#17A2B8',
    },
  ];

  return (
    <>
      <Row className="g-3 mb-4">
        {cards.map((card, idx) => (
          <Col key={card.key} xs={6} md={4} lg={2.4}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              style={{
                padding: '1.1rem 1rem',
                borderRadius: '14px',
                backgroundColor: 'var(--bg-card)',
                border: `1.5px solid ${card.accent}25`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: `${card.accent}15`,
                  color: card.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>

              {loading ? (
                <div
                  style={{
                    width: '50px',
                    height: '20px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                  }}
                />
              ) : (
                <span
                  dir="ltr"
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    fontFamily:
                      "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    fontVariantNumeric: 'lining-nums tabular-nums',
                    color: 'var(--text-secondary)',
                    lineHeight: 1,
                  }}
                >
                  {card.value.toLocaleString('en-US')}
                </span>
              )}

              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'Cairo, sans-serif',
                  textAlign: 'center',
                }}
              >
                {card.label}
              </span>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* By-type breakdown row */}
      <Row className="g-3 mb-4">
        {TYPES.map((type) => {
          const Icon = getCommunityTypeIcon(type);
          const color = getCommunityTypeColor(type);
          const count = stats?.by_type?.[type] ?? 0;

          return (
            <Col key={type} xs={6} md={3}>
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: `1px solid ${color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: `${color}15`,
                    color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    {getCommunityTypeLabel(type)}
                  </div>
                  <div
                    dir="ltr"
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '1rem',
                      fontWeight: 900,
                      fontFamily:
                        "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                      fontVariantNumeric: 'lining-nums tabular-nums',
                    }}
                  >
                    {count.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default AdminCommunityStatsCards;