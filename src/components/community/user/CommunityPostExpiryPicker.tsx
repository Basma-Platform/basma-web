import { COMMUNITY_THEME, COMMUNITY_EXPIRY_LABELS } from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import type { CommunityExpiryChoice } from '../../../types';

interface CommunityPostExpiryPickerProps {
  value: CommunityExpiryChoice;
  onChange: (value: CommunityExpiryChoice) => void;
  error?: string | string[];
}

const OPTIONS: CommunityExpiryChoice[] = ['1_month', '2_months'];

const CommunityPostExpiryPicker = ({
  value,
  onChange,
  error,
}: CommunityPostExpiryPickerProps) => {
  const errorText = Array.isArray(error) ? error[0] : error;

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}
      >
        {OPTIONS.map((option) => {
          const isActive = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              style={{
                padding: '14px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
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
              <CommunityIcons.clock
                size={14}
                color={
                  isActive ? COMMUNITY_THEME.accent : 'var(--text-muted)'
                }
              />
              <span
                style={{
                  color: isActive
                    ? COMMUNITY_THEME.accent
                    : 'var(--text-secondary)',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {COMMUNITY_EXPIRY_LABELS[option]}
              </span>
            </button>
          );
        })}
      </div>

      {errorText && (
        <p
          style={{
            color: '#DC3545',
            fontSize: '0.72rem',
            fontFamily: 'Cairo, sans-serif',
            marginTop: '6px',
            marginBottom: 0,
          }}
        >
          {errorText}
        </p>
      )}
    </div>
  );
};

export default CommunityPostExpiryPicker;