import { motion } from 'framer-motion';
import {
  FaInfoCircle,
  FaLock,
  FaStickyNote,
  FaTimesCircle,
  FaArchive,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import type { HelpRequestUserDetail } from '../../../../types';
import {
  FUND_THEME,
  formatHelpRequestDate,
} from '../../../../utils/helpRequestHelpers';

interface MyHelpRequestDetailsInfoProps {
  request: HelpRequestUserDetail;
}

/**
 * Body for the owner's help request detail page.
 * Sections:
 *  - Description
 *  - Encrypted notice (no reveal, even for owner)
 *  - Status timeline (created / reviewed / archived)
 *  - Admin notes (if reviewed)
 *  - Rejection reason (if rejected)
 *  - Archive reason (if archived)
 */
const MyHelpRequestDetailsInfo = ({
  request,
}: MyHelpRequestDetailsInfoProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      {/* ============================================ */}
      {/* Description */}
      {/* ============================================ */}
      <Section Icon={FaInfoCircle} title="الوصف العام">
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.85,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          {request.public_description}
        </p>
      </Section>

      {/* ============================================ */}
      {/* Encrypted notice (owner cannot reveal either) */}
      {/* ============================================ */}
      <div
        style={{
          padding: '1rem 1.15rem',
          borderRadius: '14px',
          backgroundColor: 'rgba(111,66,193,0.06)',
          border: '1px solid rgba(111,66,193,0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '11px',
            background:
              'linear-gradient(135deg, #6F42C1, #9C6FD6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
            boxShadow: '0 3px 10px rgba(111,66,193,0.35)',
          }}
        >
          <FaLock size={13} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: '#6F42C1',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '4px',
            }}
          >
            بياناتك الحساسة مشفّرة
          </div>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            البيانات التي أدخلتها (الاسم الحقيقي، العمر، العنوان التفصيلي،
            رقم التواصل) محفوظة بشكل مشفّر تماماً. حتى أنت لا تستطيع رؤيتها مرة
            أخرى من هنا — إن احتجت تعديلها، تواصل مع الإدارة.
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* Status timeline */}
      {/* ============================================ */}
      <Section Icon={FaCalendarAlt} title="مسار الطلب">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <TimelineRow
            Icon={FaCheckCircle}
            label="تاريخ الإنشاء"
            value={formatHelpRequestDate(request.created_at)}
            color={FUND_THEME.accent}
            done
          />

          {request.reviewed_at && (
            <TimelineRow
              Icon={FaCheckCircle}
              label="تاريخ المراجعة"
              value={formatHelpRequestDate(request.reviewed_at)}
              color="#28A745"
              done
            />
          )}

          {request.published_at && (
            <TimelineRow
              Icon={FaCheckCircle}
              label="تاريخ النشر"
              value={formatHelpRequestDate(request.published_at)}
              color="#28A745"
              done
            />
          )}

          {request.archived_at && (
            <TimelineRow
              Icon={FaArchive}
              label="تاريخ الأرشفة"
              value={formatHelpRequestDate(request.archived_at)}
              color="#6B4226"
              done
            />
          )}
        </div>
      </Section>

      {/* ============================================ */}
      {/* Admin notes */}
      {/* ============================================ */}
      {request.admin_notes && (
        <Section
          Icon={FaStickyNote}
          title="ملاحظات الإدارة"
          accent="#17A2B8"
        >
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '11px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {request.admin_notes}
          </div>
        </Section>
      )}

      {/* ============================================ */}
      {/* Rejection reason (when rejected) */}
      {/* ============================================ */}
      {request.status === 'rejected' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            padding: '1rem 1.15rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(220,53,69,0.06)',
            border: '1px solid rgba(220,53,69,0.22)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              color: '#DC3545',
              fontSize: '0.85rem',
              fontWeight: 800,
            }}
          >
            <FaTimesCircle size={12} />
            سبب الرفض
          </div>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
          >
            {request.admin_notes || 'لم يتم توضيح السبب.'}
          </p>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              margin: '10px 0 0',
              lineHeight: 1.55,
            }}
          >
            يمكنك التواصل مع الإدارة لمعرفة ما يجب تصحيحه، ثم إنشاء طلب جديد.
          </p>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* Archive reason (when archived) */}
      {/* ============================================ */}
      {request.status === 'archived' && request.archive_reason && (
        <Section Icon={FaArchive} title="سبب الأرشفة" accent="#6B4226">
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '11px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {request.archive_reason}
          </div>
        </Section>
      )}
    </div>
  );
};

// ============================================
// Internal building blocks
// ============================================
interface SectionProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  accent?: string;
  children: React.ReactNode;
}

const Section = ({
  Icon,
  title,
  accent = FUND_THEME.accent,
  children,
}: SectionProps) => (
  <div
    style={{
      padding: '1.15rem 1.25rem',
      borderRadius: '14px',
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
          width: '30px',
          height: '30px',
          borderRadius: '9px',
          backgroundColor: `${accent}15`,
          color: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={12} />
      </div>
      <h3
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.92rem',
          fontWeight: 800,
          margin: 0,
        }}
      >
        {title}
      </h3>
    </div>
    {children}
  </div>
);

interface TimelineRowProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  color: string;
  done?: boolean;
}

const TimelineRow = ({
  Icon,
  label,
  value,
  color,
  done = false,
}: TimelineRowProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 12px',
      borderRadius: '10px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      opacity: done ? 1 : 0.5,
    }}
  >
    <div
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        backgroundColor: `${color}18`,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={11} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: 600,
          marginBottom: '2px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

export default MyHelpRequestDetailsInfo;