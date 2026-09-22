import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShieldAlt,
  FaLock,
  FaClock,
  FaImage,
  FaChevronDown,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaIdCard,
  FaPassport,
  FaCar,
  FaGraduationCap,
  FaFile,
} from 'react-icons/fa';
import type {
  VerificationRequirements,
  DocumentType,
} from '../../../types';
import { getDocumentTypeLabel } from '../../../utils/verificationHelpers';

interface VerificationRequirementsCardProps {
  requirements: VerificationRequirements | null;
  loading?: boolean;
  onContinue?: () => void;
  onCancel?: () => void;
}

// ============================================
// Icons per Document Type
// ============================================
const DOC_TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  national_id: <FaIdCard size={16} />,
  passport: <FaPassport size={16} />,
  driver_license: <FaCar size={16} />,
  university_card: <FaGraduationCap size={16} />,
  other: <FaFile size={16} />,
};

// ============================================
// Fallback Document Requirements
// ============================================
const FALLBACK_DOC_REQUIREMENTS: Record<
  DocumentType,
  { must_show: string[]; warning?: string }
> = {
  national_id: {
    must_show: [
      'الصورة الشخصية واضحة',
      'الاسم الكامل بالعربية',
      'رقم الهوية (9 أرقام)',
      'تاريخ الميلاد',
      'تاريخ الانتهاء',
    ],
    warning: 'الهوية منتهية الصلاحية غير مقبولة',
  },
  passport: {
    must_show: [
      'الصورة الشخصية واضحة',
      'الاسم الكامل (عربي/إنجليزي)',
      'رقم جواز السفر',
      'تاريخ الميلاد',
      'تاريخ الانتهاء',
      'صفحة البيانات الأساسية كاملة',
    ],
    warning: 'يجب رفع صفحة البيانات فقط، وليس كل الصفحات',
  },
  driver_license: {
    must_show: [
      'الصورة الشخصية واضحة',
      'الاسم الكامل',
      'رقم الرخصة',
      'تاريخ الميلاد',
      'تاريخ الانتهاء',
    ],
    warning: 'الرخصة منتهية الصلاحية غير مقبولة',
  },
  university_card: {
    must_show: [
      'الصورة الشخصية واضحة',
      'الاسم الكامل',
      'الرقم الجامعي',
      'اسم الجامعة',
      'سنة الدراسة أو تاريخ الصلاحية',
    ],
    warning: 'بطاقة الطالب بدون صورة شخصية غير مقبولة',
  },
  other: {
    must_show: [
      'الصورة الشخصية واضحة',
      'الاسم الكامل',
      'رقم الوثيقة',
      'تاريخ الانتهاء (إن وُجد)',
    ],
    warning: 'الوثيقة غير الواضحة ستُرفض',
  },
};

// ============================================
// Fallback Document Types
// ============================================
const FALLBACK_DOC_TYPES = [
  { value: 'national_id' as DocumentType, label: 'هوية وطنية' },
  { value: 'passport' as DocumentType, label: 'جواز سفر' },
  { value: 'driver_license' as DocumentType, label: 'رخصة قيادة' },
  { value: 'university_card' as DocumentType, label: 'بطاقة جامعية' },
  { value: 'other' as DocumentType, label: 'أخرى' },
];

const VerificationRequirementsCard = ({
  requirements,
  loading = false,
  onContinue,
  onCancel,
}: VerificationRequirementsCardProps) => {
  const [openSection, setOpenSection] = useState<string | null>('why');
  const [openDocType, setOpenDocType] = useState<DocumentType | null>(null);

  // ============================================
  // Data with fallbacks
  // ============================================
  const fallbackWhy = [
    'للتأكد من أنك شخص حقيقي',
    'لبناء الثقة بين المستخدمين',
    'لحماية المجتمع من الاحتيال',
    'للسماح بنشر إعلانات غير محدودة',
  ];

  const fallbackProtect = [
    'تشفير كامل للبيانات',
    'تخزين آمن ومحمي',
    'لا تُشارك مع أي طرف ثالث',
    'يراها فقط فريق المراجعة',
  ];

  const fallbackDeletion = [
    'تُحذف تلقائياً بعد 90 يوماً من الموافقة',
    'نحتفظ فقط بالاسم ورقم الهوية (مشفر)',
  ];

  const fallbackImageReq = [
    'الصورة الشخصية واضحة',
    'الاسم الكامل مقروء بوضوح',
    'رقم الوثيقة مقروء',
    'تاريخ الانتهاء ظاهر (إن وُجد)',
    'الوثيقة كاملة — كل الحواف ظاهرة',
    'إضاءة جيدة — لا انعكاس، لا ظل',
  ];

  const why = requirements?.why_we_need_it ?? fallbackWhy;
  const protect = requirements?.how_we_protect_it ?? fallbackProtect;
  const deletion = requirements?.deletion_policy ?? fallbackDeletion;
  const imageReq = requirements?.image_requirements ?? fallbackImageReq;
  const docTypes = requirements?.document_types ?? FALLBACK_DOC_TYPES;

  // ============================================
  // Merge API doc_requirements with fallback
  // ============================================
  const getDocRequirements = (type: DocumentType) => {
    const apiReq = requirements?.document_requirements?.[type];
    const fallback = FALLBACK_DOC_REQUIREMENTS[type];
    return {
      must_show: apiReq?.must_show ?? fallback.must_show,
      warning: apiReq?.warning ?? fallback.warning,
    };
  };

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  // ============================================
  // Loading
  // ============================================
  if (loading && !requirements) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          className="spinner-border"
          style={{
            color: 'var(--primary-orange)',
            width: '2.5rem',
            height: '2.5rem',
          }}
        />
        <p
          style={{
            color: 'var(--text-muted)',
            marginTop: '1rem',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.85rem',
          }}
        >
          جاري تحميل المعلومات...
        </p>
      </div>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '18px',
        padding: '1.5rem 1.25rem',
        boxShadow: '0 6px 24px var(--shadow-sm)',
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,122,32,0.1), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ============================================ */}
        {/* Header */}
        {/* ============================================ */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '72px',
              height: '72px',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E87A20, #F5A623)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 10px 28px rgba(232,122,32,0.3)',
            }}
          >
            <FaShieldAlt size={30} />
          </motion.div>

          <h2
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.2rem, 4vw, 1.45rem)',
              fontWeight: 900,
              marginBottom: '6px',
              lineHeight: 1.3,
            }}
          >
            توثيق الهوية
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '420px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            خطوات بسيطة للحصول على شارة موثق وحماية مجتمعك
          </p>
        </div>

        {/* ============================================ */}
        {/* Sections (Accordion) */}
        {/* ============================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AccordionSection
            id="why"
            icon={<FaInfoCircle size={14} />}
            iconColor="#17A2B8"
            title="لماذا نحتاج هويتك؟"
            subtitle={`${why.length} أسباب واضحة`}
            isOpen={openSection === 'why'}
            onToggle={() => toggleSection('why')}
            items={why}
          />

          <AccordionSection
            id="how"
            icon={<FaLock size={14} />}
            iconColor="#28A745"
            title="كيف نحمي هويتك؟"
            subtitle={`${protect.length} إجراءات أمنية`}
            isOpen={openSection === 'how'}
            onToggle={() => toggleSection('how')}
            items={protect}
            variant="success"
          />

          <AccordionSection
            id="deletion"
            icon={<FaClock size={14} />}
            iconColor="#9C27B0"
            title="متى تُحذف صورتك؟"
            subtitle="سياسة الخصوصية"
            isOpen={openSection === 'deletion'}
            onToggle={() => toggleSection('deletion')}
            items={deletion}
            variant="purple"
          />

          <AccordionSection
            id="image-req"
            icon={<FaImage size={14} />}
            iconColor="#F5A623"
            title="متطلبات جودة الصورة"
            subtitle="مهم جداً — اقرأ قبل الرفع"
            isOpen={openSection === 'image-req'}
            onToggle={() => toggleSection('image-req')}
            items={imageReq}
            variant="warning"
          />
        </div>

        {/* ============================================ */}
        {/* Document Types (Expandable Cards) */}
        {/* ============================================ */}
        <div style={{ marginTop: '1.5rem' }}>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaCheckCircle size={14} color="var(--primary-orange)" />
            الوثائق المقبولة
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {docTypes.map((doc) => {
              const isOpen = openDocType === doc.value;
              const req = getDocRequirements(doc.value);

              return (
                <div
                  key={doc.value}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: `1px solid ${
                      isOpen ? 'var(--primary-orange)' : 'var(--border-color)'
                    }`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {/* Doc Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDocType((prev) =>
                        prev === doc.value ? null : doc.value
                      )
                    }
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'right',
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(232,122,32,0.1)',
                        color: 'var(--primary-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {DOC_TYPE_ICONS[doc.value]}
                    </div>

                    <span
                      style={{
                        flex: 1,
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    >
                      {doc.label || getDocumentTypeLabel(doc.value)}
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'inline-flex',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <FaChevronDown size={11} />
                    </motion.span>
                  </button>

                  {/* Doc Expanded Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            padding: '0 14px 14px',
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '12px',
                          }}
                        >
                          {/* Must Show List */}
                          <div
                            style={{
                              marginBottom: req.warning ? '8px' : 0,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: '#28A745',
                                marginBottom: '6px',
                              }}
                            >
                              <FaCheckCircle size={11} />
                              يجب أن يظهر في الصورة
                            </div>
                            <ul
                              style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                              }}
                            >
                              {req.must_show.map((item, i) => (
                                <li
                                  key={i}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '6px',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  <span
                                    style={{
                                      color: '#28A745',
                                      flexShrink: 0,
                                      marginTop: '3px',
                                      display: 'inline-flex',
                                    }}
                                  >
                                    <FaCheckCircle size={9} />
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Warning */}
                          {req.warning && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px',
                                padding: '8px 10px',
                                backgroundColor: 'rgba(220,53,69,0.06)',
                                border: '1px solid rgba(220,53,69,0.2)',
                                borderRadius: '8px',
                                fontSize: '0.72rem',
                                color: '#DC3545',
                                lineHeight: 1.5,
                              }}
                            >
                              <FaExclamationTriangle
                                size={11}
                                style={{
                                  flexShrink: 0,
                                  marginTop: '2px',
                                }}
                              />
                              <span>{req.warning}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================ */}
        {/* CTA Buttons */}
        {/* ============================================ */}
        {(onContinue || onCancel) && (
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {onContinue && (
              <motion.button
                type="button"
                onClick={onContinue}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                }}
              >
                <FaCheckCircle size={14} />
                موافق، أريد التوثيق
              </motion.button>
            )}

            {onCancel && (
              <motion.button
                type="button"
                onClick={onCancel}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                لاحقاً
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// Accordion Section (Internal Component)
// ============================================
interface AccordionSectionProps {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  items: string[];
  variant?: 'default' | 'success' | 'warning' | 'purple';
}

const AccordionSection = ({
  icon,
  iconColor,
  title,
  subtitle,
  isOpen,
  onToggle,
  items,
  variant = 'default',
}: AccordionSectionProps) => {
  const bgColor = {
    default: 'rgba(23,162,184,0.06)',
    success: 'rgba(40,167,69,0.06)',
    warning: 'rgba(245,166,35,0.08)',
    purple: 'rgba(156,39,176,0.06)',
  }[variant];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-input)',
        border: `1px solid ${
          isOpen ? iconColor + '50' : 'var(--border-color)'
        }`,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          border: 'none',
          backgroundColor: isOpen ? bgColor : 'transparent',
          cursor: 'pointer',
          textAlign: 'right',
          fontFamily: 'Cairo, sans-serif',
          transition: 'background-color 0.2s ease',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: `${iconColor}15`,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                marginTop: '2px',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'inline-flex',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          <FaChevronDown size={11} />
        </motion.span>
      </button>

      {/* Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '8px 14px 14px',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {items.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    <span
                      style={{
                        color: iconColor,
                        flexShrink: 0,
                        marginTop: '3px',
                        display: 'inline-flex',
                      }}
                    >
                      <FaCheckCircle size={11} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationRequirementsCard;