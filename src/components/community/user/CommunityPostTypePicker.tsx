import {
  COMMUNITY_TYPE_LABELS,
  getCommunityTypeColor,
  getCommunityTypeBg,
} from '../../../utils/communityHelpers';
import { getCommunityTypeIcon } from '../../../utils/communityIcons';
import type { CommunityPostType } from '../../../types';

interface CommunityPostTypePickerProps {
  value: CommunityPostType;
  onChange: (type: CommunityPostType) => void;
  disabled?: boolean;
}

const TYPES: CommunityPostType[] = ['warning', 'lost', 'found', 'general'];

const CommunityPostTypePicker = ({
  value,
  onChange,
  disabled = false,
}: CommunityPostTypePickerProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
      }}
    >
      {TYPES.map((type) => {
        const Icon = getCommunityTypeIcon(type);
        const color = getCommunityTypeColor(type);
        const bg = getCommunityTypeBg(type);
        const isActive = value === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => !disabled && onChange(type)}
            disabled={disabled}
            style={{
              position: 'relative',
              padding: '1rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: isActive ? bg : 'var(--bg-input)',
              border: `1.5px solid ${isActive ? color : 'var(--border-color)'}`,
              borderRadius: '14px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: disabled && !isActive ? 0.5 : 1,
              boxShadow: isActive ? `0 4px 14px ${color}25` : 'none',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: `${color}15`,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={16} />
            </div>

            <span
              style={{
                color: isActive ? color : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {COMMUNITY_TYPE_LABELS[type]}
            </span>

            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CommunityPostTypePicker;