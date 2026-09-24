import { motion } from 'framer-motion';
import { FaUsers, FaBullhorn, FaMapMarkerAlt } from 'react-icons/fa';
import type { TopGovernorate } from '../../../../types';

interface TopGovernoratesListProps {
  governorates: TopGovernorate[];
}

/**
 * Top Governorates — Ranked with users + announcements counts
 * - Horizontal bars for announcements count
 * - Small stats for users count
 */
const TopGovernoratesList = ({
  governorates,
}: TopGovernoratesListProps) => {
  if (!governorates || governorates.length === 0) {
    return (
      <div
        style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.82rem',
          opacity: 0.7,
        }}
      >
        لا توجد محافظات بعد
      </div>
    );
  }

  const maxAnnouncements = Math.max(
    ...governorates.map((g) => g.announcements_count)
  );

  return (
    <div
      dir="rtl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '420px',
        overflowY: 'auto',
        margin: '0 -4px',
        padding: '0 4px',
      }}
    >
      {governorates.map((gov, index) => {
        const barWidth =
          maxAnnouncements > 0
            ? (gov.announcements_count / maxAnnouncements) * 100
            : 0;

        return (
          <motion.div
            key={gov.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '9px',
                    backgroundColor: 'rgba(232,122,32,0.12)',
                    color: 'var(--primary-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaMapMarkerAlt size={13} />
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {gov.name}
                </div>
              </div>

              {/* Stats Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexShrink: 0,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#17A2B8',
                  }}
                >
                  <FaUsers size={10} />
                  <span
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontVariantNumeric: 'tabular-nums',
                      direction: 'ltr',
                    }}
                  >
                    {gov.users_count}
                  </span>
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--primary-orange)',
                  }}
                >
                  <FaBullhorn size={10} />
                  <span
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontVariantNumeric: 'tabular-nums',
                      direction: 'ltr',
                    }}
                  >
                    {gov.announcements_count}
                  </span>
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                style={{
                  height: '100%',
                  background:
                    'linear-gradient(90deg, var(--primary-orange), var(--primary-orange-light))',
                  borderRadius: '4px',
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopGovernoratesList;