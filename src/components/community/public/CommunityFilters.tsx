import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import {
  COMMUNITY_THEME,
  getCommunityTypeColor,
  getCommunityTypeLabel,
} from '../../../utils/communityHelpers';
import {
  getCommunityTypeIcon,
  CommunityIcons,
} from '../../../utils/communityIcons';
import type { CommunityPostType } from '../../../types';

interface CommunityFiltersProps {
  activeType?: CommunityPostType;
  onTypeChange: (type: CommunityPostType | undefined) => void;

  search: string;
  onSearchChange: (value: string) => void;

  governorateId?: number;
  cityId?: number;
  onGovernorateChange: (id: number | undefined) => void;
  onCityChange: (id: number | undefined) => void;

  governorates: Array<{ id: number; name: string }>;
  cities: Array<{ id: number; name: string }>;

  hasActiveFilters: boolean;
  onClearAll: () => void;
}

const TYPES: CommunityPostType[] = ['warning', 'lost', 'found', 'general'];

const CommunityFilters = ({
  activeType,
  onTypeChange,
  search,
  onSearchChange,
  governorateId,
  cityId,
  onGovernorateChange,
  onCityChange,
  governorates,
  cities,
  hasActiveFilters,
  onClearAll,
}: CommunityFiltersProps) => {
  const { isDark } = useTheme();

  return (
    <section
      style={{
        paddingBottom: '2rem',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container>
        {/* ✅ Type tabs — centered on desktop, scrollable on mobile */}
        <div
          className="community-type-tabs"
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '1.25rem',
            paddingBottom: '8px',
            paddingTop: '4px',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            className="community-type-tabs-inner"
            style={{
              display: 'flex',
              gap: '8px',
              margin: '0 auto',
            }}
          >
            <TypeTab
              label="الكل"
              icon={<CommunityIcons.images size={13} />}
              isActive={!activeType}
              onClick={() => onTypeChange(undefined)}
              color={COMMUNITY_THEME.accent}
              isDark={isDark}
            />

            {TYPES.map((type) => {
              const Icon = getCommunityTypeIcon(type);
              return (
                <TypeTab
                  key={type}
                  label={getCommunityTypeLabel(type)}
                  icon={<Icon size={13} />}
                  isActive={activeType === type}
                  onClick={() =>
                    onTypeChange(activeType === type ? undefined : type)
                  }
                  color={getCommunityTypeColor(type)}
                  isDark={isDark}
                />
              );
            })}
          </div>
        </div>

        {/* Search + Region */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="community-filters-grid"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto',
            gap: '12px',
            padding: '1rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '18px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 12px var(--shadow-sm)',
            alignItems: 'stretch',
          }}
        >
          <div style={{ position: 'relative', minWidth: 0 }}>
            <CommunityIcons.info
              size={14}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث في المنشورات..."
              style={{
                width: '100%',
                height: '44px',
                padding: '0 40px 0 14px',
                fontSize: '0.88rem',
                fontFamily: 'Cairo, sans-serif',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COMMUNITY_THEME.accent;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${COMMUNITY_THEME.accentSoft}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <CustomSelect
            value={governorateId ?? ''}
            onChange={(v) => onGovernorateChange(v ? Number(v) : undefined)}
            placeholder="كل المحافظات"
            options={governorates.map((g) => ({
              value: String(g.id),
              label: g.name,
            }))}
            icon={<CommunityIcons.region size={13} />}
          />

          <CustomSelect
            value={cityId ?? ''}
            onChange={(v) => onCityChange(v ? Number(v) : undefined)}
            placeholder={!governorateId ? 'اختر محافظة أولاً' : 'كل المناطق'}
            options={cities.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            icon={<CommunityIcons.location size={13} />}
            disabled={!governorateId}
          />

          {hasActiveFilters && (
            <motion.button
              type="button"
              onClick={onClearAll}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0 18px',
                height: '44px',
                fontSize: '0.82rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                color: '#DC3545',
                backgroundColor: 'rgba(220, 53, 69, 0.08)',
                border: '1px solid rgba(220, 53, 69, 0.25)',
                borderRadius: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <CommunityIcons.cancel size={12} />
              مسح
            </motion.button>
          )}
        </motion.div>
      </Container>

      <style>{`
        /* ✅ Type tabs — center on desktop */
        @media (min-width: 768px) {
          .community-type-tabs {
            justify-content: center;
            overflow-x: visible !important;
          }
          .community-type-tabs-inner {
            margin: 0 !important;
          }
        }

        @media (max-width: 900px) {
          .community-filters-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .community-filters-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 520px) {
          .community-filters-grid {
            grid-template-columns: 1fr !important;
          }
          .community-filters-grid > div:first-child {
            grid-column: auto;
          }
        }
      `}</style>
    </section>
  );
};

interface TypeTabProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  color: string;
  isDark: boolean;
}

const TypeTab = ({
  label,
  icon,
  isActive,
  onClick,
  color,
  isDark,
}: TypeTabProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.97 }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      padding: '9px 18px',
      fontSize: '0.85rem',
      fontFamily: 'Cairo, sans-serif',
      fontWeight: 800,
      whiteSpace: 'nowrap',
      color: isActive ? '#FFFFFF' : color,
      background: isActive
        ? `linear-gradient(135deg, ${color}, ${color}DD)`
        : isDark
          ? 'rgba(255,255,255,0.03)'
          : 'var(--bg-card)',
      border: `1.5px solid ${isActive ? color : `${color}30`}`,
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isActive ? `0 4px 14px ${color}35` : 'none',
      flexShrink: 0,
    }}
  >
    {icon}
    <span>{label}</span>
  </motion.button>
);

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  icon: React.ReactNode;
  disabled?: boolean;
}

const CustomSelect = ({
  value,
  onChange,
  placeholder,
  options,
  icon,
  disabled = false,
}: CustomSelectProps) => {
  const hasValue = value !== '' && value !== undefined && value !== null;

  return (
    <div style={{ position: 'relative', minWidth: 0 }}>
      <span
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: hasValue ? COMMUNITY_THEME.accent : 'var(--text-muted)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {icon}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          height: '44px',
          padding: '0 36px 0 34px',
          fontSize: '0.85rem',
          fontFamily: 'Cairo, sans-serif',
          color: hasValue ? 'var(--text-primary)' : 'var(--text-muted)',
          backgroundColor: 'var(--bg-input)',
          border: `1px solid ${
            hasValue ? `${COMMUNITY_THEME.accent}50` : 'var(--border-color)'
          }`,
          borderRadius: '12px',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          transition: 'border-color 0.2s ease',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <CommunityIcons.chevronLeft
        size={11}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default CommunityFilters;