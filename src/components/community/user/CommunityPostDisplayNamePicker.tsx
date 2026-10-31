import { COMMUNITY_DISPLAY_LABELS } from '../../../utils/communityHelpers';
import { COMMUNITY_DISPLAY_ICONS } from '../../../utils/communityIcons';
import { COMMUNITY_THEME } from '../../../utils/communityHelpers';
import { inputStyle } from './CommunityPostFormShared';
import type { CommunityDisplayNameType } from '../../../types';

interface CommunityPostDisplayNamePickerProps {
  value: CommunityDisplayNameType;
  onChange: (value: CommunityDisplayNameType) => void;
  customValue: string;
  onCustomValueChange: (value: string) => void;
  error?: string | string[];
  customError?: string | string[];
}

const DISPLAY_TYPES: CommunityDisplayNameType[] = [
  'full',
  'anonymous',
  'custom',
];

const CommunityPostDisplayNamePicker = ({
  value,
  onChange,
  customValue,
  onCustomValueChange,
  error,
  customError,
}: CommunityPostDisplayNamePickerProps) => {
  const errorText = Array.isArray(error) ? error[0] : error;
  const customErrorText = Array.isArray(customError)
    ? customError[0]
    : customError;

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '0.75rem',
        }}
      >
        {DISPLAY_TYPES.map((type) => {
          const Icon = COMMUNITY_DISPLAY_ICONS[type];
          const isActive = value === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              style={{
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isActive
                  ? COMMUNITY_THEME.accentSoft
                  : 'var(--bg-input)',
                border: `1.5px solid ${
                  isActive ? COMMUNITY_THEME.accent : 'var(--border-color)'
                }`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon
                size={16}
                color={
                  isActive ? COMMUNITY_THEME.accent : 'var(--text-muted)'
                }
              />
              <span
                style={{
                  color: isActive
                    ? COMMUNITY_THEME.accent
                    : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {COMMUNITY_DISPLAY_LABELS[type]}
              </span>
            </button>
          );
        })}
      </div>

      {value === 'custom' && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomValueChange(e.target.value)}
          placeholder="أدخل الاسم الذي تريد إظهاره"
          maxLength={100}
          style={inputStyle}
        />
      )}

      {errorText && (
        <p
          style={{
            color: '#DC3545',
            fontSize: '0.72rem',
            fontFamily: 'Cairo, sans-serif',
            marginTop: '5px',
            marginBottom: 0,
          }}
        >
          {errorText}
        </p>
      )}

      {value === 'custom' && customErrorText && (
        <p
          style={{
            color: '#DC3545',
            fontSize: '0.72rem',
            fontFamily: 'Cairo, sans-serif',
            marginTop: '5px',
            marginBottom: 0,
          }}
        >
          {customErrorText}
        </p>
      )}
    </div>
  );
};

export default CommunityPostDisplayNamePicker;