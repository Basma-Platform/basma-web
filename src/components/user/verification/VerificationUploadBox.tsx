import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCloudUploadAlt,
  FaFileImage,
  FaTrashAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaIdCard,
  FaPassport,
  FaCar,
  FaGraduationCap,
  FaFile,
  FaInfoCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import VerificationImagePreviewModal from './VerificationImagePreviewModal';
import ReuploadWarningModal from './ReuploadWarningModal';
import {
  getFileTypeLabel,
  formatFileSize,
} from '../../../utils/verificationHelpers';
import type {
  DocumentType,
  DocumentTypeOption,
  UploadIdResponse,
} from '../../../types';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

// ============================================
// Fallback document types
// ============================================
const FALLBACK_DOC_TYPES: DocumentTypeOption[] = [
  { value: 'national_id', label: 'هوية وطنية' },
  { value: 'passport', label: 'جواز سفر' },
  { value: 'driver_license', label: 'رخصة قيادة' },
  { value: 'university_card', label: 'بطاقة جامعية' },
  { value: 'other', label: 'أخرى' },
];

// ============================================
// Icons per Document Type
// ============================================
const DOC_TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  national_id: <FaIdCard size={14} />,
  passport: <FaPassport size={14} />,
  driver_license: <FaCar size={14} />,
  university_card: <FaGraduationCap size={14} />,
  other: <FaFile size={14} />,
};

interface VerificationUploadBoxProps {
  onSubmit: (
    file: File,
    documentType: DocumentType
  ) => Promise<UploadIdResponse>;
  uploading: boolean;
  disabled?: boolean;
  documentTypes?: DocumentTypeOption[];
  initialDocumentType?: DocumentType;
  /** 🆕 Optional: external warning (from hook) */
  externalWarning?: UploadIdResponse['warning'] | null;
  /** 🆕 Optional: callback after warning shown */
  onWarningShown?: () => void;
}

const VerificationUploadBox = ({
  onSubmit,
  uploading,
  disabled = false,
  documentTypes,
  initialDocumentType = 'national_id',
  externalWarning,
  onWarningShown,
}: VerificationUploadBoxProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documentType, setDocumentType] =
    useState<DocumentType>(initialDocumentType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🆕 Warning state (internal + external)
  const [internalWarning, setInternalWarning] = useState<
    UploadIdResponse['warning'] | null
  >(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const availableDocTypes =
    documentTypes && documentTypes.length > 0
      ? documentTypes
      : FALLBACK_DOC_TYPES;

  // ============================================
  // Sync external warning
  // ============================================
  useEffect(() => {
    if (externalWarning) {
      setInternalWarning(externalWarning);
      setShowWarningModal(true);
      if (onWarningShown) {
        onWarningShown();
      }
    }
  }, [externalWarning, onWarningShown]);

  // ============================================
  // Cleanup preview URL
  // ============================================
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ============================================
  // File Validation
  // ============================================
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'الرجاء رفع ملف بصيغة JPG، PNG، أو PDF';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `حجم الملف يجب أن لا يتجاوز ${MAX_SIZE_MB} ميجابايت`;
    }
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!documentType) {
      setError('يرجى اختيار نوع الوثيقة');
      return;
    }
    if (!selectedFile) {
      setError('يرجى اختيار ملف الهوية أولاً');
      return;
    }
    try {
      const response = await onSubmit(selectedFile, documentType);
      handleRemove();

      // 🆕 Show warning modal if present in response
      if (response.warning) {
        setInternalWarning(response.warning);
        setShowWarningModal(true);
      }
    } catch {
      // Error handled by hook
    }
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
    setInternalWarning(null);
  };

  const canInteract = !disabled && !uploading;
  const isUniversityCard = documentType === 'university_card';

  // ============================================
  // Render Button
  // ============================================
  const renderDocTypeButton = (opt: DocumentTypeOption) => {
    const active = documentType === opt.value;
    return (
      <motion.button
        key={opt.value}
        type="button"
        onClick={() => canInteract && setDocumentType(opt.value)}
        disabled={!canInteract}
        whileTap={canInteract ? { scale: 0.97 } : {}}
        style={{
          padding: '10px 12px',
          borderRadius: '10px',
          border: `2px solid ${
            active ? 'var(--primary-orange)' : 'var(--border-color)'
          }`,
          backgroundColor: active
            ? 'rgba(232,122,32,0.08)'
            : 'var(--bg-input)',
          color: active
            ? 'var(--primary-orange)'
            : 'var(--text-secondary)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: canInteract ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          opacity: canInteract ? 1 : 0.6,
          boxSizing: 'border-box',
          minHeight: '44px',
          width: '100%',
        }}
      >
        <span style={{ display: 'inline-flex', flexShrink: 0 }}>
          {DOC_TYPE_ICONS[opt.value as DocumentType]}
        </span>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {opt.label}
        </span>
      </motion.button>
    );
  };

  return (
    <>
      {/* ============================================ */}
      {/* Grid Styles — Local to this component       */}
      {/* ============================================ */}
      <style>{`
        .verification-doc-grid {
          display: grid;
          gap: 8px;
          width: 100%;
        }

        @media (min-width: 481px) {
          .verification-doc-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          .verification-doc-grid > *:nth-child(1),
          .verification-doc-grid > *:nth-child(2) {
            grid-column: span 3;
          }
          .verification-doc-grid > *:nth-child(3),
          .verification-doc-grid > *:nth-child(4),
          .verification-doc-grid > *:nth-child(5) {
            grid-column: span 2;
          }
        }

        @media (max-width: 480px) {
          .verification-doc-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .verification-doc-grid > *:nth-child(5) {
            grid-column: span 2;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '1.25rem',
          boxShadow: '0 6px 24px var(--shadow-sm)',
          fontFamily: 'Cairo, sans-serif',
          width: '100%',
          boxSizing: 'border-box',
        }}
        dir="rtl"
      >
        {/* ============================================ */}
        {/* Header */}
        {/* ============================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'rgba(232,122,32,0.1)',
              color: 'var(--primary-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FaFileImage size={14} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              رفع وثيقة الهوية
            </h4>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                marginTop: '2px',
              }}
            >
              JPG، PNG، أو PDF • الحد الأقصى {MAX_SIZE_MB}MB
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* Document Type Selector */}
        {/* ============================================ */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            نوع الوثيقة <span style={{ color: 'var(--error)' }}>*</span>
          </label>

          <div className="verification-doc-grid">
            {availableDocTypes.map(renderDocTypeButton)}
          </div>

          {/* University Card Warning */}
          <AnimatePresence>
            {isUniversityCard && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '10px' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(245,166,35,0.12)',
                    border: '1px solid rgba(245,166,35,0.4)',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    color: '#D97706',
                    lineHeight: 1.55,
                  }}
                >
                  <FaExclamationTriangle
                    size={12}
                    style={{
                      flexShrink: 0,
                      marginTop: '2px',
                      color: '#F5A623',
                    }}
                  />
                  <span>
                    <strong>مهم:</strong> بطاقة الطالب مقبولة فقط إذا كانت
                    تحتوي على <strong>صورة شخصية واضحة</strong> و
                    <strong>الاسم الكامل</strong> مطابق لحسابك.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================ */}
        {/* Upload Zone / File Preview */}
        {/* ============================================ */}
        {!selectedFile ? (
          <motion.div
            onDragEnter={(e) => {
              e.preventDefault();
              if (canInteract) setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => canInteract && fileInputRef.current?.click()}
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              borderRadius: '14px',
              border: `2px dashed ${
                isDragging
                  ? 'var(--primary-orange)'
                  : error
                  ? 'var(--error)'
                  : 'var(--border-color)'
              }`,
              backgroundColor: isDragging
                ? 'rgba(232,122,32,0.06)'
                : 'var(--bg-input)',
              cursor: canInteract ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s ease',
              opacity: canInteract ? 1 : 0.6,
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 0.85rem',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, rgba(232,122,32,0.15), rgba(232,122,32,0.06))',
                color: 'var(--primary-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaCloudUploadAlt size={28} />
            </div>

            <h5
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                fontWeight: 800,
                margin: '0 0 4px',
              }}
            >
              {isDragging
                ? 'أفلت الملف هنا'
                : 'اسحب الملف هنا أو اضغط للاختيار'}
            </h5>

            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              تأكد من وضوح الصورة وإظهار جميع المعلومات
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleInputChange}
              disabled={!canInteract}
              style={{ display: 'none' }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '0.85rem',
              borderRadius: '14px',
              border: '1.5px solid rgba(40,167,69,0.3)',
              backgroundColor: 'var(--bg-input)',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {/* Preview Thumbnail */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="ID preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <FaFileImage
                    size={26}
                    color="var(--primary-orange)"
                    opacity={0.6}
                  />
                )}
              </div>

              {/* File Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(40,167,69,0.12)',
                    color: '#28A745',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                  }}
                >
                  <FaCheckCircle size={8} />
                  جاهز للرفع
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '3px',
                  }}
                >
                  {selectedFile.name}
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.68rem',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>{getFileTypeLabel(selectedFile.type)}</span>
                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {preview && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    disabled={!canInteract}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      cursor: canInteract ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="معاينة"
                  >
                    <FaEye size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={!canInteract}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid rgba(220,53,69,0.3)',
                    backgroundColor: 'rgba(220,53,69,0.08)',
                    color: '#DC3545',
                    cursor: canInteract ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="حذف"
                >
                  <FaTrashAlt size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                color: 'var(--error)',
                fontSize: '0.75rem',
              }}
            >
              <FaExclamationTriangle size={11} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Quality Notice */}
        <div
          style={{
            marginTop: '1rem',
            padding: '10px 12px',
            backgroundColor: 'rgba(23,162,184,0.06)',
            border: '1px solid rgba(23,162,184,0.2)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
          }}
        >
          <FaInfoCircle
            size={11}
            color="#17A2B8"
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <span>
            تأكد من ظهور <strong>صورة شخصية واضحة</strong>،{' '}
            <strong>الاسم الكامل</strong>، و<strong>رقم الوثيقة</strong> في
            الصورة.
          </span>
        </div>

        {/* Submit Button */}
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedFile || uploading || disabled}
          whileHover={selectedFile && !uploading ? { scale: 1.01 } : {}}
          whileTap={selectedFile && !uploading ? { scale: 0.98 } : {}}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '13px 20px',
            borderRadius: '12px',
            border: 'none',
            background:
              !selectedFile || uploading
                ? 'var(--primary-brown-light)'
                : 'linear-gradient(135deg, #E87A20, #F5A623)',
            color: '#FFFFFF',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow:
              !selectedFile || uploading
                ? 'none'
                : '0 4px 16px rgba(232,122,32,0.3)',
            opacity: !selectedFile || uploading ? 0.6 : 1,
            transition: 'all 0.25s ease',
          }}
        >
          {uploading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                style={{ width: '14px', height: '14px' }}
              />
              جاري الرفع...
            </>
          ) : (
            <>
              <FaCloudUploadAlt size={15} />
              رفع طلب التحقق
            </>
          )}
        </motion.button>
      </motion.div>

      {/* ============================================ */}
      {/* Image Preview Modal */}
      {/* ============================================ */}
      {preview && (
        <VerificationImagePreviewModal
          isOpen={showPreview}
          imageUrl={preview}
          title="معاينة صورة الهوية"
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* ============================================ */}
      {/* 🆕 Reupload Warning Modal */}
      {/* ============================================ */}
      <ReuploadWarningModal
        isOpen={showWarningModal}
        title={internalWarning?.title}
        message={internalWarning?.message}
        previousReason={internalWarning?.previous_rejection_reason}
        previousRejectedAt={internalWarning?.previous_rejected_at}
        onClose={handleCloseWarningModal}
      />
    </>
  );
};

export default VerificationUploadBox;