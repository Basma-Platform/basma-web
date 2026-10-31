import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useCommunityStats } from '../../../hooks/useCommunityStats';
import {
  COMMUNITY_THEME,
  getCommunityTypeColor,
  getCommunityTypeLabel,
} from '../../../utils/communityHelpers';
import {
  getCommunityTypeIcon,
  CommunityIcons,
} from '../../../utils/communityIcons';
import { useCardBorderAnimation } from '../../../hooks/useCardBorderAnimation';
import AnimatedCardBorder from '../../ui/AnimatedCardBorder';
import type { CommunityPostType } from '../../../types';

const CommunityStatsStrip = () => {
  const { isDark } = useTheme();
  const { stats, loading } = useCommunityStats();

  const types: CommunityPostType[] = ['warning', 'lost', 'found', 'general'];

  const totalPublished = stats?.community_posts.total_published ?? 0;
  const byType = stats?.community_posts.by_type;
  const totalViews = stats?.community_posts.total_views ?? 0;

  const cards = [
    {
      key: 'total',
      icon: <CommunityIcons.images size={20} />,
      label: 'إجمالي المنشورات',
      value: totalPublished,
      accent: COMMUNITY_THEME.accent,
    },
    {
      key: 'views',
      icon: <CommunityIcons.views size={20} />,
      label: 'إجمالي المشاهدات',
      value: totalViews,
      accent: '#17A2B8',
    },
    {
      key: types[0],
      icon: renderTypeIcon(types[0]),
      label: getCommunityTypeLabel(types[0]),
      value: byType?.[types[0]] ?? 0,
      accent: getCommunityTypeColor(types[0]),
    },
    {
      key: types[1],
      icon: renderTypeIcon(types[1]),
      label: getCommunityTypeLabel(types[1]),
      value: byType?.[types[1]] ?? 0,
      accent: getCommunityTypeColor(types[1]),
    },
    {
      key: types[2],
      icon: renderTypeIcon(types[2]),
      label: getCommunityTypeLabel(types[2]),
      value: byType?.[types[2]] ?? 0,
      accent: getCommunityTypeColor(types[2]),
    },
    {
      key: types[3],
      icon: renderTypeIcon(types[3]),
      label: getCommunityTypeLabel(types[3]),
      value: byType?.[types[3]] ?? 0,
      accent: getCommunityTypeColor(types[3]),
    },
  ];

  return (
    <section
      style={{
        paddingTop: '1rem',
        paddingBottom: '3rem',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        <Row className="g-3 g-md-4">
          {cards.map((card, idx) => (
            <Col key={card.key} xs={12} sm={6} md={4}>
              <StatCard
                icon={card.icon}
                label={card.label}
                value={card.value}
                accent={card.accent}
                isDark={isDark}
                loading={loading}
                index={idx}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

// ============================================
// StatCard
// ============================================
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
  isDark: boolean;
  loading: boolean;
  index: number;
}

const StatCard = ({
  icon,
  label,
  value,
  accent,
  isDark,
  loading,
  index,
}: StatCardProps) => {
  const { attachRef, isDrawn, hoverHandlers } = useCardBorderAnimation({
    threshold: 0.3,
    rootMargin: '-40px 0px',
    triggerOnce: true,
  });

  return (
    <div ref={attachRef} {...hoverHandlers} style={{ height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        style={{
          position: 'relative',
          padding: '1.5rem 1.25rem 1.25rem',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-card)',
          border: `1.5px solid ${
            isDrawn ? accent : 'var(--border-color)'
          }`,
          textAlign: 'center',
          transition:
            'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          overflow: 'hidden',
          boxShadow: isDrawn
            ? `0 12px 32px ${accent}25`
            : '0 2px 10px var(--shadow-sm)',
          transform: isDrawn ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* ✅ Animated top border */}
        <AnimatedCardBorder
          isDrawn={isDrawn}
          side="top"
          background={`linear-gradient(90deg, ${accent}, ${accent}DD)`}
          drawFrom="start"
          height={4}
          duration={0.6}
          idleOpacity={0}
          rounded
          cardRadius={16}
        />

        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: `${accent}15`,
            color: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.35s ease',
            transform: isDrawn ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {icon}
        </div>

        {loading ? (
          <div
            style={{
              width: '70px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.06)',
            }}
          />
        ) : (
          <span
            dir="ltr"
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              fontFamily:
                "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              fontVariantNumeric: 'lining-nums tabular-nums',
              color: 'var(--text-secondary)',
              lineHeight: 1,
            }}
          >
            {value.toLocaleString('en-US')}
          </span>
        )}

        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          {label}
        </span>
      </motion.div>
    </div>
  );
};

// ============================================
// Helper
// ============================================
const renderTypeIcon = (type: CommunityPostType) => {
  const Icon = getCommunityTypeIcon(type);
  return <Icon size={20} />;
};

export default CommunityStatsStrip;