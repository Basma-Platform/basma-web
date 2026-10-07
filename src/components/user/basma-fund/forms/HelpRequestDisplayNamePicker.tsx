import { motion } from 'framer-motion';
import { FaUser, FaUserSecret, FaUserTag } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import type { HelpRequestDisplayNameType } from '../../../../types';
import {
  FieldLabel,
  FieldError,
  inputStyle,
  CharCounter,
} from './HelpRequestFormShared';

interface HelpRequestDisplayNamePickerProps {
  value: HelpRequestDisplayNameType;
  customValue: string;
  onChange: (type: HelpRequestDisplayNameType) => void;
  onCustomChange: (value: string) => void;
  error?: string;
  /** Prefill hint shown when 'full' is selected */
  userFullName?: string;
}

interface Option {
  value: HelpRequestDisplayNameType;
  label: string;
  Icon: IconType;
  hint: string;
}

const OPTIONS: Option[] = [
  {
    value: 'full',
    label: 'اسمي الكامل',
    Icon: FaUser,
    hint: 'اسمك سيظهر بجانب الطلب',
  },
  {
    value: 'anonymous',
    label: 'مجهول',
    Icon: FaUserSecret,
    hint: 'لن يظهر اسمك إطلاقاً',
  },
  {
    value: 'custom',
    label: 'اسم مخصص',
    Icon: FaUserTag,
    hint: 'اكتب الاسم الذي تريده',
  },
];

const MAX_CUSTOM = 40;

/**
 * Choose how the owner's name appears on the public listing.
 */
const HelpRequestDisplayNamePicker = ({
  value,
  customValue,
  onChange,
  onCustomChange,
  error,
  userFullName,
}: HelpRequestDisplayNamePickerProps) => {
  return (
    <div>
      <FieldLabel required>الاسم الظاهر على الطلب</FieldLabel>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '8px',
          marginBottom: value === 'custom' ? '12px' : 0,
        }}
      >
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          const Icon = opt.Icon;
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 12px',
                borderRadius: '11px',
                border: `1.5px solid ${
                  active ? FUND_THEME.accent : 'var(--border-color)'
                }`,
                backgroundColor: active
                  ? `${FUND_THEME.accent}10`
                  : 'var(--bg-input)',
                cursor: 'pointer',
                textAlign: 'right',
                fontFamily: 'Cairo, sans-serif',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: active
                    ? FUND_THEME.accent
                    : 'var(--border-color)',
                  color: active ? '#FFFFFF' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={13} />
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    color: active
                      ? FUND_THEME.accent
                      : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    marginBottom: '2px',
                  }}
                >
                  {opt.label}
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.65rem',
                    lineHeight: 1.4,
                    fontWeight: 500,
                  }}
                >
                  {opt.hint}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom name input */}
      {value === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          style={{ overflow: 'hidden', marginTop: '4px' }}
        >
          <input
            type="text"
            value={customValue}
            onChange={(e) =>
              onCustomChange(e.target.value.slice(0, MAX_CUSTOM))
            }
            placeholder="مثال: أحمد من غزة"
            maxLength={MAX_CUSTOM}
            style={inputStyle(!!error)}
          />
          <CharCounter current={customValue.length} max={MAX_CUSTOM} />
        </motion.div>
      )}

      {/* Full-name prefill hint */}
      {value === 'full' && userFullName && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: '9px',
            backgroundColor: `${FUND_THEME.accent}08`,
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            fontWeight: 600,
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.5,
          }}
        >
          سيظهر الاسم: <strong style={{ color: 'var(--text-secondary)' }}>{userFullName}</strong>
        </div>
      )}

      <FieldError>{error}</FieldError>
    </div>
  );
};

export default HelpRequestDisplayNamePicker;