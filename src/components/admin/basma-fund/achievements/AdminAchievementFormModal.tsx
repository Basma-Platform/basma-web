import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaAward,
  FaImage,
  FaTrash,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import type {
  AdminDonationAchievementPayload,
  DonationAchievement,
} from '../../../../types';
import { getStorageUrl } from '../../../../utils/storageHelpers';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';

interface AdminAchievementFormModalProps {
  isOpen: boolean;
  achievement: DonationAchievement | null; // null = create mode
  onSubmit: (payload: AdminDonationAchievementPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MAX_COVER_MB = 2;

const AdminAchievementFormModal = ({
  isOpen,
  achievement,
  onSubmit,
  onCancel,
  isLoading = false,
}: AdminAchievementFormModalProps) => {
  const isEdit = !!achievement;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [donors, setDonors] = useState('');
  const [amount, setAmount] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [achievementDate, setAchievementDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset / hydrate on open
  useEffect(() => {
    if (!isOpen) return;

    if (achievement) {
      setTitle(achievement.title);
      setDescription(achievement.description);
      setVideoUrl(achievement.video_url || '');
      setBeneficiaries(String(achievement.metadata?.beneficiaries ?? ''));
      setDonors(String(achievement.metadata?.donors ?? ''));
      setAmount(String(achievement.metadata?.amount ?? ''));
      setDisplayOrder(String(achievement.display_order ?? 0));
      setIsActive(achievement.is_active);
      setIsFeatured(achievement.is_featured);
      setAchievementDate(achievement.achievement_date || '');
      setCoverPreview(getStorageUrl(achievement.cover_image_url));
    } else {
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setBeneficiaries('');
      setDonors('');
      setAmount('');
      setDisplayOrder('0');
      setIsActive(true);
      setIsFeatured(false);
      setAchievementDate('');
      setCoverPreview(null);
    }
    setCoverFile(null);
    setError(null);
  }, [isOpen, achievement]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleClose = () => {
    if (isLoading) return;
    onCancel();
  };

  const handlePickCover = () => {
    fileInputRef.current?.click();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;

    if (!f.type.startsWith('image/')) {
      toast.error('يجب اختيار صورة بصيغة JPG أو PNG');
      return;
    }
    if (f.size > MAX_COVER_MB * 1024 * 1024) {
      toast.error(`حجم الصورة يجب ألا يتجاوز ${MAX_COVER_MB} ميجابايت`);
      return;
    }

    if (coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const handleRemoveCover = () => {
    if (coverPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview);
    }
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    // Client-side validation
    if (!title.trim()) {
      setError('العنوان مطلوب');
      return;
    }
    if (title.trim().length > 200) {
      setError('العنوان يجب ألا يتجاوز 200 حرف');
      return;
    }
    if (!description.trim()) {
      setError('الوصف مطلوب');
      return;
    }
    if (description.trim().length > 3000) {
      setError('الوصف يجب ألا يتجاوز 3000 حرف');
      return;
    }

    const payload: AdminDonationAchievementPayload = {
      title: title.trim(),
      description: description.trim(),
      cover_image: coverFile,
      video_url: videoUrl.trim() || null,
      display_order: Number(displayOrder) || 0,
      is_active: isActive,
      is_featured: isFeatured,
      achievement_date: achievementDate || null,
      metadata: (() => {
        const m: Record<string, number> = {};
        if (beneficiaries.trim()) m.beneficiaries = Number(beneficiaries);
        if (donors.trim()) m.donors = Number(donors);
        if (amount.trim()) m.amount = Number(amount);
        return Object.keys(m).length > 0 ? m : null;
      })(),
    };

    try {
      await onSubmit(payload);
    } catch {
      // toast handled in hook
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1090,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            direction: 'rtl',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              fontFamily: 'Cairo, sans-serif',
              position: 'relative',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="إغلاق"
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-muted)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              <FaTimes size={12} />
            </button>

            <div
              style={{
                padding: '1.75rem 1.5rem 1.25rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 16,
                  delay: 0.1,
                }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #FFC107, #E87A20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  margin: '0 auto 1rem',
                  boxShadow: '0 8px 24px rgba(232,122,32,0.4)',
                }}
              >
                <FaAward size={24} />
              </motion.div>

              <h3
                style={{
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  margin: '0 0 1.25rem',
                }}
              >
                {isEdit ? 'تعديل إنجاز' : 'إنجاز جديد'}
              </h3>

              {/* Title */}
              <FieldLabel required>العنوان</FieldLabel>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 200))}
                disabled={isLoading}
                maxLength={200}
                placeholder="مثال: مساعدة 5 مرضى بالسكري"
                style={inputStyle}
              />
              <CharCount current={title.length} max={200} />

              {/* Description */}
              <FieldLabel required>الوصف</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 3000))}
                disabled={isLoading}
                rows={4}
                maxLength={3000}
                placeholder="اشرح الإنجاز بإيجاز..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
              />
              <CharCount current={description.length} max={3000} />

              {/* Cover image */}
              <FieldLabel>صورة الغلاف</FieldLabel>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: '11px',
                  border: '1px dashed var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--text-muted)',
                  }}
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <FaImage size={20} opacity={0.5} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <button
                    type="button"
                    onClick={handlePickCover}
                    disabled={isLoading}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '9px',
                      border: `1px solid ${FUND_THEME.accent}40`,
                      backgroundColor: `${FUND_THEME.accent}10`,
                      color: FUND_THEME.accent,
                      fontFamily: 'Cairo, sans-serif',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      marginBottom: '4px',
                    }}
                  >
                    اختر صورة
                  </button>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.68rem',
                    }}
                  >
                    JPG أو PNG • حتى {MAX_COVER_MB} ميجابايت
                  </div>
                </div>
                {coverPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    disabled={isLoading}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      border: '1px solid rgba(220,53,69,0.3)',
                      backgroundColor: 'rgba(220,53,69,0.08)',
                      color: '#DC3545',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    title="إزالة"
                  >
                    <FaTrash size={11} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleCoverChange}
                  hidden
                />
              </div>

              {/* Video URL */}
              <FieldLabel>رابط الفيديو (اختياري)</FieldLabel>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value.slice(0, 500))}
                disabled={isLoading}
                placeholder="https://youtube.com/..."
                style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }}
              />

              {/* Metadata — three inputs */}
              <FieldLabel>الأرقام التوضيحية (اختياري)</FieldLabel>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <input
                  type="number"
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.value)}
                  disabled={isLoading}
                  min={0}
                  placeholder="المستفيدون"
                  style={inputStyle}
                />
                <input
                  type="number"
                  value={donors}
                  onChange={(e) => setDonors(e.target.value)}
                  disabled={isLoading}
                  min={0}
                  placeholder="المتبرعون"
                  style={inputStyle}
                />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                  min={0}
                  placeholder="المبلغ (₪)"
                  style={inputStyle}
                />
              </div>

              {/* Date + order */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <FieldLabel>تاريخ الإنجاز</FieldLabel>
                  <input
                    type="date"
                    value={achievementDate}
                    onChange={(e) => setAchievementDate(e.target.value)}
                    disabled={isLoading}
                    max={new Date().toISOString().split('T')[0]}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>الترتيب</FieldLabel>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    disabled={isLoading}
                    min={0}
                    max={9999}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginBottom: '12px',
                }}
              >
                <Toggle
                  label="نشط"
                  value={isActive}
                  onChange={setIsActive}
                  disabled={isLoading}
                  color="#28A745"
                />
                <Toggle
                  label="مميز"
                  value={isFeatured}
                  onChange={setIsFeatured}
                  disabled={isLoading}
                  color="#FFC107"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(220,53,69,0.08)',
                    border: '1px solid rgba(220,53,69,0.25)',
                    color: '#DC3545',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  <FaExclamationTriangle size={11} />
                  {error}
                </div>
              )}

              {/* Info notice */}
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
                  lineHeight: 1.55,
                }}
              >
                <FaInfoCircle
                  size={11}
                  style={{ flexShrink: 0, marginTop: '2px' }}
                />
                <span>
                  الإنجاز سيظهر للجمهور مباشرة بعد الحفظ إذا كان نشطاً.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem 1.25rem',
                display: 'flex',
                gap: '10px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                style={{
                  flex: '1 1 0',
                  minWidth: '100px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                إلغاء
              </button>
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  flex: '1 1 0',
                  minWidth: '160px',
                  padding: '11px 16px',
                  borderRadius: '11px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFC107, #E87A20)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 16px rgba(232,122,32,0.4)',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '13px', height: '13px' }}
                    />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <FaAward size={13} />
                    {isEdit ? 'حفظ التعديلات' : 'إنشاء الإنجاز'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Internal small components + style helpers
// ============================================
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontFamily: 'Cairo, sans-serif',
  fontSize: '0.85rem',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: '6px',
};

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label
    style={{
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 700,
      color: 'var(--text-secondary)',
      marginBottom: '6px',
      marginTop: '8px',
    }}
  >
    {children}
    {required && <span style={{ color: 'var(--error)', marginRight: '4px' }}>*</span>}
  </label>
);

const CharCount = ({ current, max }: { current: number; max: number }) => (
  <div
    style={{
      textAlign: 'left',
      fontSize: '0.65rem',
      color: 'var(--text-muted)',
      marginBottom: '8px',
      opacity: 0.7,
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    {current}/{max}
  </div>
);

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  color: string;
}

const Toggle = ({ label, value, onChange, disabled, color }: ToggleProps) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!value)}
    disabled={disabled}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 14px',
      borderRadius: '11px',
      border: `1.5px solid ${value ? color : 'var(--border-color)'}`,
      backgroundColor: value ? `${color}12` : 'var(--bg-input)',
      color: value ? color : 'var(--text-secondary)',
      fontFamily: 'Cairo, sans-serif',
      fontSize: '0.82rem',
      fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      flex: '1 1 100px',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    }}
  >
    <span
      style={{
        width: '34px',
        height: '20px',
        borderRadius: '10px',
        backgroundColor: value ? color : 'var(--border-color)',
        position: 'relative',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: value ? '16px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </span>
    {label}
  </button>
);

export default AdminAchievementFormModal;