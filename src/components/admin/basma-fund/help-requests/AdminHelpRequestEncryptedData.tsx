import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaLock,
  FaUnlock,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import AdminUnlockDataModal from '../modals/AdminUnlockDataModal';
import type { AdminHelpRequestEncryptedFields } from '../../../../types';

type UnlockField = 'details' | 'contact' | 'region' | 'all';

interface AdminHelpRequestEncryptedDataProps {
  helpRequestId: number;
  unlocked: boolean;
  encryptedFields: AdminHelpRequestEncryptedFields;
  /**
   * ✅ Called with (id, field, reason).
   * Managed by the parent page so the SAME hook instance is
   * used for both fetching AND updating `detail`.
   */
  onUnlock: (
    id: number,
    field: UnlockField,
    reason: string
  ) => Promise<void>;
  isUnlocking?: boolean;
}

const AdminHelpRequestEncryptedData = ({
  helpRequestId,
  unlocked,
  encryptedFields,
  onUnlock,
  isUnlocking = false,
}: AdminHelpRequestEncryptedDataProps) => {
  const [reasonModal, setReasonModal] = useState<{
    open: boolean;
    field: UnlockField;
  }>({ open: false, field: 'all' });

  const openReason = (field: UnlockField) => {
    setReasonModal({ open: true, field });
  };

  const closeReason = () => {
    if (isUnlocking) return;
    setReasonModal({ open: false, field: 'all' });
  };

  const handleConfirmUnlock = async (reason: string) => {
    try {
      await onUnlock(helpRequestId, reasonModal.field, reason);
      setReasonModal({ open: false, field: 'all' });
    } catch {
      // toast handled in the parent
    }
  };

  // ============================================
  // Locked — no data revealed
  // ============================================
  if (!unlocked) {
    return (
      <>
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(111,66,193,0.06)',
            border: '1px solid rgba(111,66,193,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6F42C1, #9C6FD6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(111,66,193,0.4)',
            }}
          >
            <FaLock size={26} />
          </motion.div>
          <div>
            <h4
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.98rem',
                fontWeight: 900,
                margin: '0 0 6px',
              }}
            >
              البيانات الحساسة مشفّرة
            </h4>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: '380px',
              }}
            >
              اضغط الزر أدناه لفتح البيانات الحساسة (الاسم الكامل، رقم
              التواصل، العنوان التفصيلي). سيُطلب منك كتابة سبب، وسيتم
              تسجيل هذا الوصول في سجل النشاط.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openReason('all')}
            disabled={isUnlocking}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: '11px',
              border: 'none',
              background: 'linear-gradient(135deg, #6F42C1, #9C6FD6)',
              color: '#FFFFFF',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: isUnlocking ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 18px rgba(111,66,193,0.35)',
              opacity: isUnlocking ? 0.6 : 1,
            }}
          >
            <FaUnlock size={12} />
            فتح البيانات
          </button>
        </div>

        <AdminUnlockDataModal
          isOpen={reasonModal.open}
          field={reasonModal.field}
          onConfirm={handleConfirmUnlock}
          onCancel={closeReason}
          isLoading={isUnlocking}
        />
      </>
    );
  }

  // ============================================
  // Unlocked — show data
  // ============================================
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(40,167,69,0.06)',
          border: '1px solid rgba(40,167,69,0.25)',
          color: '#28A745',
          fontSize: '0.78rem',
          fontWeight: 700,
        }}
      >
        <FaUnlock size={12} />
        تم فك التشفير — هذا الوصول مُسجّل في سجل النشاط
      </div>

      {/* Full details */}
      {encryptedFields.full_details && (
        <DataSection Icon={FaUser} title="التفاصيل الشخصية" accent="#17A2B8">
          <DataRow
            label="الاسم الكامل"
            value={encryptedFields.full_details.real_name}
          />
          <DataRow
            label="العمر"
            value={String(encryptedFields.full_details.age)}
          />
          <DataRow
            label="عدد أفراد الأسرة"
            value={String(encryptedFields.full_details.family_size)}
          />
          {encryptedFields.full_details.health_condition && (
            <DataRow
              label="الحالة الصحية"
              value={encryptedFields.full_details.health_condition}
            />
          )}
          {encryptedFields.full_details.income_source && (
            <DataRow
              label="مصدر الدخل"
              value={encryptedFields.full_details.income_source}
            />
          )}
        </DataSection>
      )}

      {/* Contact info */}
      {encryptedFields.contact_info && (
        <DataSection Icon={FaPhone} title="معلومات التواصل" accent="#28A745">
          <DataRow
            label="واتساب"
            value={encryptedFields.contact_info.whatsapp}
            ltr
          />
          {encryptedFields.contact_info.alt_phone && (
            <DataRow
              label="هاتف بديل"
              value={encryptedFields.contact_info.alt_phone}
              ltr
            />
          )}
        </DataSection>
      )}

      {/* Region data */}
      {encryptedFields.region_data && (
        <DataSection
          Icon={FaMapMarkerAlt}
          title="العنوان التفصيلي"
          accent="#E87A20"
        >
          <DataRow
            label="الشارع"
            value={encryptedFields.region_data.street}
          />
          <DataRow
            label="المبنى"
            value={encryptedFields.region_data.building}
          />
        </DataSection>
      )}

      {/* Info reminder */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '10px 12px',
          borderRadius: '10px',
          backgroundColor: 'var(--notice-info-bg)',
          border: '1px solid var(--notice-info-border)',
          color: 'var(--notice-info-text)',
          fontSize: '0.72rem',
          lineHeight: 1.6,
        }}
      >
        <FaInfoCircle
          size={11}
          style={{ flexShrink: 0, marginTop: '2px' }}
        />
        <span>
          هذه البيانات سرية ولا يجوز مشاركتها خارج المنصة. أي سوء استخدام
          سيُسجَّل في سجل النشاط.
        </span>
      </div>
    </div>
  );
};

// ============================================
// Internal building blocks
// ============================================
interface DataSectionProps {
  Icon: IconType;
  title: string;
  accent: string;
  children: React.ReactNode;
}

const DataSection = ({ Icon, title, accent, children }: DataSectionProps) => (
  <div
    style={{
      padding: '1rem',
      borderRadius: '12px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          backgroundColor: `${accent}15`,
          color: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={11} />
      </div>
      <h4
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          fontWeight: 800,
          margin: 0,
        }}
      >
        {title}
      </h4>
    </div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
      }}
    >
      {children}
    </div>
  </div>
);

interface DataRowProps {
  label: string;
  value: string;
  ltr?: boolean;
}

const DataRow = ({ label, value, ltr }: DataRowProps) => (
  <div
    style={{
      padding: '10px 12px',
      borderRadius: '9px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
    }}
  >
    <div
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.68rem',
        fontWeight: 600,
        marginBottom: '4px',
      }}
    >
      {label}
    </div>
    <div
      style={{
        color: 'var(--text-secondary)',
        fontSize: '0.82rem',
        fontWeight: 800,
        direction: ltr ? 'ltr' : 'rtl',
        textAlign: 'right',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {value}
    </div>
  </div>
);

export default AdminHelpRequestEncryptedData;