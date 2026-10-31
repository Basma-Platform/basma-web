import { CommunityIcons, getCommunityTypeIcon } from '../../../utils/communityIcons';
import { COMMUNITY_THEME, getCommunityTypeColor } from '../../../utils/communityHelpers';
import { selectStyle, inputStyle } from '../user/CommunityPostFormShared';
import type {
  CommunityPostStatus,
  CommunityPostType,
  CommunityAdminFilters as Filters,
} from '../../../types';

interface AdminCommunityFiltersProps {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS: Array<{
  value: CommunityPostStatus | 'all';
  label: string;
}> = [
  { value: 'all', label: 'الكل' },
  { value: 'pending', label: 'قيد المراجعة' },
  { value: 'approved', label: 'منشور' },
  { value: 'rejected', label: 'مرفوض' },
  { value: 'resolved', label: 'تم الحل' },
  { value: 'expired', label: 'منتهي' },
];

const TYPE_OPTIONS: Array<{
  value: CommunityPostType | 'all';
  label: string;
}> = [
  { value: 'all', label: 'الكل' },
  { value: 'warning', label: 'تحذير' },
  { value: 'lost', label: 'مفقود' },
  { value: 'found', label: 'موجود' },
  { value: 'general', label: 'عام' },
];

const AdminCommunityFilters = ({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
}: AdminCommunityFiltersProps) => {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        marginBottom: '1.5rem',
      }}
    >
      {/* Status tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '1rem',
          overflowX: 'auto',
          paddingBottom: '6px',
          scrollbarWidth: 'thin',
        }}
      >
        {STATUS_OPTIONS.map((tab) => {
          const isActive = (filters.status ?? 'all') === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange({ status: tab.value, page: 1 })}
              style={{
                padding: '7px 16px',
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                background: isActive
                  ? COMMUNITY_THEME.gradient
                  : 'var(--bg-input)',
                border: `1.5px solid ${
                  isActive ? COMMUNITY_THEME.accent : 'var(--border-color)'
                }`,
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Type chips */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '1rem',
          overflowX: 'auto',
          paddingBottom: '6px',
        }}
      >
        {TYPE_OPTIONS.map((tab) => {
          const isActive = (filters.type ?? 'all') === tab.value;
          const color =
            tab.value === 'all'
              ? COMMUNITY_THEME.accent
              : getCommunityTypeColor(tab.value as CommunityPostType);
          const Icon =
            tab.value === 'all'
              ? CommunityIcons.images
              : getCommunityTypeIcon(tab.value as CommunityPostType);

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange({ type: tab.value, page: 1 })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                color: isActive ? '#FFFFFF' : color,
                background: isActive
                  ? `linear-gradient(135deg, ${color}, ${color}DD)`
                  : 'var(--bg-input)',
                border: `1.5px solid ${isActive ? color : `${color}30`}`,
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={11} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search + Sort + Clear */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <CommunityIcons.info
            size={13}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={filters.search ?? ''}
            onChange={(e) =>
              onChange({ search: e.target.value || undefined, page: 1 })
            }
            placeholder="ابحث بالعنوان أو اسم المستخدم..."
            style={{ ...inputStyle, paddingRight: '34px' }}
          />
        </div>

        <select
          value={filters.sort ?? 'newest'}
          onChange={(e) =>
            onChange({ sort: e.target.value as Filters['sort'], page: 1 })
          }
          style={selectStyle}
        >
          <option value="newest">الأحدث أولاً</option>
          <option value="oldest">الأقدم أولاً</option>
          <option value="most_viewed">الأكثر مشاهدة</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              fontSize: '0.8rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              color: '#DC3545',
              backgroundColor: 'rgba(220, 53, 69, 0.08)',
              border: '1px solid rgba(220, 53, 69, 0.25)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <CommunityIcons.cancel size={11} />
            مسح الفلاتر
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminCommunityFilters;