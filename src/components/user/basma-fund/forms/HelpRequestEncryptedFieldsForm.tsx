import { motion } from 'framer-motion';
import { FaLock, FaInfoCircle } from 'react-icons/fa';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import {
  FieldLabel,
  FieldError,
  inputStyle,
  textareaStyle,
  CharCounter,
  FieldGrid,
} from './HelpRequestFormShared';

// ============================================
// Public types
// ============================================
export interface EncryptedFieldsValues {
  real_name: string;
  age: string;
  family_size: string;
  health_condition: string;
  income_source: string;
}

export interface EncryptedContactValues {
  whatsapp: string;
  alt_phone: string;
}

export interface EncryptedRegionValues {
  street: string;
  building: string;
}

interface HelpRequestEncryptedFieldsFormProps {
  fields: EncryptedFieldsValues;
  contact: EncryptedContactValues;
  region: EncryptedRegionValues;
  onFieldsChange: (next: EncryptedFieldsValues) => void;
  onContactChange: (next: EncryptedContactValues) => void;
  onRegionChange: (next: EncryptedRegionValues) => void;
  errors?: Record<string, string>;
  defaultWhatsapp?: string;
  defaultFullName?: string;
}

// ============================================
// Constants
// ============================================
const MAX_HEALTH = 500;
const MAX_INCOME = 200;
const MAX_STREET = 200;
const MAX_BUILDING = 200;

/**
 * Encrypted data collection (visible to Admin only).
 * Three groups: full_details, contact_info, region_data.
 */
const HelpRequestEncryptedFieldsForm = ({
  fields,
  contact,
  region,
  onFieldsChange,
  onContactChange,
  onRegionChange,
  errors = {},
  defaultWhatsapp,
  defaultFullName,
}: HelpRequestEncryptedFieldsFormProps) => {
  // ============================================
  // Encryption notice
  // ============================================
  const EncryptionNotice = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 14px',
        borderRadius: '11px',
        backgroundColor: 'var(--notice-info-bg)',
        border: '1px solid var(--notice-info-border)',
        marginBottom: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: FUND_THEME.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          flexShrink: 0,
          boxShadow: `0 3px 10px ${FUND_THEME.shadow}`,
        }}
      >
        <FaLock size={13} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: 'var(--notice-info-title)',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '3px',
          }}
        >
          بيانات مشفّرة — لا تُعرض للمتبرعين
        </div>
        <p
          style={{
            color: 'var(--notice-info-text)',
            fontSize: '0.72rem',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          هذه البيانات محفوظة بشكل مشفّر بالكامل ولا يمكن الوصول إليها إلا
          من قِبل الإدارة المختصة عند الضرورة فقط. لن تظهر للمتبرعين في
          أي وقت.
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <EncryptionNotice />

      {/* ============================================ */}
      {/* Full details */}
      {/* ============================================ */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            fontWeight: 800,
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaInfoCircle size={11} color={FUND_THEME.accent} />
          التفاصيل الشخصية
        </h4>

        <div style={{ marginBottom: '10px' }}>
          <FieldLabel required>الاسم الكامل الحقيقي</FieldLabel>
          <input
            type="text"
            value={fields.real_name}
            onChange={(e) =>
              onFieldsChange({ ...fields, real_name: e.target.value })
            }
            placeholder={defaultFullName || 'أدخل اسمك الكامل'}
            maxLength={100}
            style={inputStyle(!!errors['full_details.real_name'])}
          />
          <FieldError>{errors['full_details.real_name']}</FieldError>
        </div>

        <FieldGrid columns={2}>
          <div>
            <FieldLabel required hint="18-100">
              العمر
            </FieldLabel>
            <input
              type="number"
              value={fields.age}
              onChange={(e) =>
                onFieldsChange({ ...fields, age: e.target.value })
              }
              placeholder="مثال: 35"
              min={18}
              max={100}
              style={inputStyle(!!errors['full_details.age'])}
            />
            <FieldError>{errors['full_details.age']}</FieldError>
          </div>

          <div>
            <FieldLabel required hint="1-20">
              عدد أفراد الأسرة
            </FieldLabel>
            <input
              type="number"
              value={fields.family_size}
              onChange={(e) =>
                onFieldsChange({ ...fields, family_size: e.target.value })
              }
              placeholder="مثال: 5"
              min={1}
              max={20}
              style={inputStyle(!!errors['full_details.family_size'])}
            />
            <FieldError>{errors['full_details.family_size']}</FieldError>
          </div>
        </FieldGrid>

        <div style={{ marginTop: '10px' }}>
          <FieldLabel hint="اختياري">الحالة الصحية</FieldLabel>
          <textarea
            value={fields.health_condition}
            onChange={(e) =>
              onFieldsChange({
                ...fields,
                health_condition: e.target.value.slice(0, MAX_HEALTH),
              })
            }
            placeholder="أي حالة صحية تستدعي ذكرها..."
            rows={2}
            maxLength={MAX_HEALTH}
            style={textareaStyle(!!errors['full_details.health_condition'])}
          />
          <CharCounter
            current={fields.health_condition.length}
            max={MAX_HEALTH}
          />
          <FieldError>{errors['full_details.health_condition']}</FieldError>
        </div>

        <div style={{ marginTop: '10px' }}>
          <FieldLabel hint="اختياري">مصدر الدخل الحالي</FieldLabel>
          <input
            type="text"
            value={fields.income_source}
            onChange={(e) =>
              onFieldsChange({
                ...fields,
                income_source: e.target.value.slice(0, MAX_INCOME),
              })
            }
            placeholder="مثال: عمل حر / بدون دخل"
            maxLength={MAX_INCOME}
            style={inputStyle(!!errors['full_details.income_source'])}
          />
          <FieldError>{errors['full_details.income_source']}</FieldError>
        </div>
      </div>

      {/* ============================================ */}
      {/* Contact info */}
      {/* ============================================ */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            fontWeight: 800,
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaInfoCircle size={11} color={FUND_THEME.accent} />
          معلومات التواصل
        </h4>

        <FieldGrid columns={2}>
          <div>
            <FieldLabel required>رقم الواتساب</FieldLabel>
            <input
              type="tel"
              value={contact.whatsapp}
              onChange={(e) =>
                onContactChange({ ...contact, whatsapp: e.target.value })
              }
              placeholder={defaultWhatsapp || '+970599123456'}
              dir="ltr"
              style={{
                ...inputStyle(!!errors['contact_info.whatsapp']),
                textAlign: 'right',
              }}
            />
            <FieldError>{errors['contact_info.whatsapp']}</FieldError>
          </div>

          <div>
            <FieldLabel hint="اختياري">رقم هاتف بديل</FieldLabel>
            <input
              type="tel"
              value={contact.alt_phone}
              onChange={(e) =>
                onContactChange({ ...contact, alt_phone: e.target.value })
              }
              placeholder="+970599000000"
              dir="ltr"
              maxLength={20}
              style={{
                ...inputStyle(!!errors['contact_info.alt_phone']),
                textAlign: 'right',
              }}
            />
            <FieldError>{errors['contact_info.alt_phone']}</FieldError>
          </div>
        </FieldGrid>
      </div>

      {/* ============================================ */}
      {/* Region data */}
      {/* ============================================ */}
      <div>
        <h4
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            fontWeight: 800,
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaInfoCircle size={11} color={FUND_THEME.accent} />
          العنوان التفصيلي
        </h4>

        <FieldGrid columns={2}>
          <div>
            <FieldLabel required>الشارع</FieldLabel>
            <input
              type="text"
              value={region.street}
              onChange={(e) =>
                onRegionChange({
                  ...region,
                  street: e.target.value.slice(0, MAX_STREET),
                })
              }
              placeholder="مثال: شارع عمر المختار"
              maxLength={MAX_STREET}
              style={inputStyle(!!errors['region_data.street'])}
            />
            <FieldError>{errors['region_data.street']}</FieldError>
          </div>

          <div>
            <FieldLabel required>المبنى / علامة مميزة</FieldLabel>
            <input
              type="text"
              value={region.building}
              onChange={(e) =>
                onRegionChange({
                  ...region,
                  building: e.target.value.slice(0, MAX_BUILDING),
                })
              }
              placeholder="مثال: عمارة الأمل - الدور الثالث"
              maxLength={MAX_BUILDING}
              style={inputStyle(!!errors['region_data.building'])}
            />
            <FieldError>{errors['region_data.building']}</FieldError>
          </div>
        </FieldGrid>
      </div>

      {/* Spacer (harmless, keeps motion demo) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ height: 0 }}
      />
    </div>
  );
};

export default HelpRequestEncryptedFieldsForm;