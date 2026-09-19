import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaClock,
  FaMoneyBillWave,
  FaFileImage,
  FaStickyNote,
  FaCloudUploadAlt,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaStar,
  FaTrashAlt,
} from 'react-icons/fa';
import FeaturedPricingCard from '../featured/FeaturedPricingCard';
import FeaturedPaymentMethods from './FeaturedPaymentMethods';
import { useFeaturedRequest } from '../../../../hooks/useFeaturedRequest';
import type { Announcement } from '../../../../types';

// ============================================
// Constants
// ============================================
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_NOTES_LENGTH = 500;

// ============================================
// Zod Schema
// ============================================
const featuredRequestSchema = z.object({
  duration_days: z
    .number({ invalid_type_error: 'يجب اختيار مدة التمييز' })
    .positive('يجب اختيار مدة التمييز'),
  payment_method: z.enum(['palpay', 'jawwal_pay', 'bop'], {
    errorMap: () => ({ message: 'يجب اختيار طريقة الدفع' }),
  }),
  additional_notes: z
    .string()
    .max(
      MAX_NOTES_LENGTH,
      `الملاحظات يجب أن لا تتجاوز ${MAX_NOTES_LENGTH} حرف`
    )
    .optional()
    .or(z.literal('')),
});

type FeaturedRequestFormData = z.infer<typeof featuredRequestSchema>;

// ============================================
// Props
// ============================================
interface FeaturedRequestFormProps {
  announcement: Announcement;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// ============================================
// Component
// ============================================
const FeaturedRequestForm = ({
  announcement,
  onSuccess,
  onCancel,
}: FeaturedRequestFormProps) => {
  const navigate = useNavigate();
  const {
    loading,
    pricing,
    paymentMethods,
    fetchPricingAndMethods,
    requestFeatured,
  } = useFeaturedRequest();

  const [loadingMeta, setLoadingMeta] = useState(true);
  const [transferImage, setTransferImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ============================================
  // React Hook Form
  // ============================================
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeaturedRequestFormData>({
    resolver: zodResolver(featuredRequestSchema),
    defaultValues: {
      duration_days: 0,
      payment_method: 'palpay',
      additional_notes: '',
    },
  });

  const watchedDuration = watch('duration_days');
  const watchedPaymentMethod = watch('payment_method');
  const watchedNotes = watch('additional_notes') || '';

  // ============================================
  // Fetch Pricing + Methods
  // ============================================
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingMeta(true);
        await fetchPricingAndMethods();
      } finally {
        setLoadingMeta(false);
      }
    };
    load();
  }, [fetchPricingAndMethods]);

  // Auto-select first pricing
  useEffect(() => {
    if (pricing.length > 0 && watchedDuration === 0) {
      const popular =
        pricing.find((p) => p.duration_days === 14) || pricing[0];
      setValue('duration_days', popular.duration_days);
    }
  }, [pricing, watchedDuration, setValue]);

  // Auto-select first payment method
  useEffect(() => {
    if (paymentMethods.length > 0 && !watchedPaymentMethod) {
      setValue('payment_method', paymentMethods[0].method_type);
    }
  }, [paymentMethods, watchedPaymentMethod, setValue]);

  // ============================================
  // File Validation
  // ============================================
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'الصورة يجب أن تكون بصيغة JPG أو PNG';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `حجم الصورة يجب أن لا يتجاوز ${MAX_FILE_SIZE_MB} ميجابايت`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setImageError(error);
      setTransferImage(null);
      setImagePreview(null);
      return;
    }

    setImageError(null);
    setTransferImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveImage = () => {
    setTransferImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageError(null);
  };

  // ============================================
  // Submit
  // ============================================
  const onSubmit = async (data: FeaturedRequestFormData) => {
    if (!transferImage) {
      setImageError('يجب رفع صورة إشعار التحويل');
      return;
    }

    try {
      const response = await requestFeatured(announcement.id, {
        duration_days: data.duration_days,
        payment_method: data.payment_method,
        transfer_image: transferImage,
        additional_notes: data.additional_notes || undefined,
      });

      // ============================================
      // ✅ FIXED NAVIGATION
      // ============================================
      // The backend returns the newly created featured request as
      // `response.request`. Navigate directly to its detail page.
      const newRequestId = (response as any)?.request?.id;

      if (onSuccess) {
        onSuccess();
      }

      if (newRequestId) {
        navigate(`/user/featured-requests/${newRequestId}`, { replace: true });
      } else {
        // Fallback: no request id returned → go to the list
        navigate('/user/featured-requests', { replace: true });
      }
    } catch {
      // Errors handled in hook
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  // ============================================
  // Loading State
  // ============================================
  if (loadingMeta) {
    return (
      <div
        style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          fontFamily: 'Cairo, sans-serif',
          boxShadow: '0 4px 16px var(--shadow-sm)',
          boxSizing: 'border-box',
          width: '100%',
        }}
        dir="rtl"
      >
        <div
          className="spinner-border"
          style={{
            color: 'var(--primary-orange)',
            width: '2.25rem',
            height: '2.25rem',
          }}
        />
        <p
          style={{
            color: 'var(--text-muted)',
            marginTop: '0.85rem',
            fontSize: '0.82rem',
          }}
        >
          جاري تحميل بيانات التمييز...
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
      transition={{ duration: 0.35 }}
      dir="rtl"
      style={{
        fontFamily: 'Cairo, sans-serif',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .pricing-grid-container {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* ============================================
              Announcement Summary
              ============================================ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '14px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 14px var(--shadow-sm)',
              boxSizing: 'border-box',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-input)',
                flexShrink: 0,
                border: '1px solid var(--border-color)',
              }}
            >
              {announcement.images?.[0] ? (
                <img
                  src={`http://localhost:8000/storage/${announcement.images[0].image_path}`}
                  alt={announcement.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    opacity: 0.4,
                  }}
                >
                  <FaFileImage size={16} />
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.68rem',
                  marginBottom: '1px',
                  fontWeight: 600,
                }}
              >
                الإعلان المراد تمييزه
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {announcement.title}
              </div>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: '0 3px 10px rgba(232,122,32,0.3)',
              }}
            >
              <FaStar size={8} />
              مميز
            </div>
          </div>

          {/* Main Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '1rem 0.85rem',
              boxShadow: '0 4px 16px var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Section 1: Duration */}
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(232,122,32,0.1)',
                    color: 'var(--primary-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaClock size={12} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    اختر مدة التمييز
                  </h4>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      marginTop: '1px',
                    }}
                  >
                    حدد الباقة الزمنية المناسبة لظهور إعلانك بقمة النتائج
                  </div>
                </div>
              </div>

              <Controller
                name="duration_days"
                control={control}
                render={() => (
                  <div
                    className="pricing-grid-container"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: '8px',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    {pricing.map((p) => (
                      <FeaturedPricingCard
                        key={p.duration_days}
                        pricing={p}
                        isSelected={watchedDuration === p.duration_days}
                        onSelect={() =>
                          setValue('duration_days', p.duration_days, {
                            shouldValidate: true,
                          })
                        }
                        disabled={loading}
                      />
                    ))}
                  </div>
                )}
              />

              {errors.duration_days && (
                <div
                  style={{
                    color: 'var(--error)',
                    fontSize: '0.75rem',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaInfoCircle size={10} />
                  {errors.duration_days.message}
                </div>
              )}
            </div>

            {/* Section 2: Payment Methods */}
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(40,167,69,0.1)',
                    color: '#28A745',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaMoneyBillWave size={12} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    طريقة الدفع المتاحة
                  </h4>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      marginTop: '1px',
                    }}
                  >
                    اختر المحفظة وحوّل المبلغ بدقة
                  </div>
                </div>
              </div>

              <Controller
                name="payment_method"
                control={control}
                render={() => (
                  <FeaturedPaymentMethods
                    methods={paymentMethods}
                    selectedMethod={watchedPaymentMethod}
                    onSelect={(method) =>
                      setValue('payment_method', method, {
                        shouldValidate: true,
                      })
                    }
                    disabled={loading}
                  />
                )}
              />

              {errors.payment_method && (
                <div
                  style={{
                    color: 'var(--error)',
                    fontSize: '0.75rem',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <FaInfoCircle size={10} />
                  {errors.payment_method.message}
                </div>
              )}
            </div>

            {/* Section 3: Upload Receipt */}
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(23,162,184,0.1)',
                    color: '#17A2B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaCloudUploadAlt size={12} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    إشعار التحويل المالي
                  </h4>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      marginTop: '1px',
                    }}
                  >
                    قم برفع صورة واضحة لإيصال أو لقطة شاشة التحويل
                  </div>
                </div>
              </div>

              {!imagePreview ? (
                <motion.div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() =>
                    !loading &&
                    document.getElementById('transfer-image-input')?.click()
                  }
                  style={{
                    padding: '1.5rem 0.75rem',
                    textAlign: 'center',
                    borderRadius: '12px',
                    border: `2px dashed ${
                      isDragging
                        ? 'var(--primary-orange)'
                        : imageError
                          ? 'var(--error)'
                          : 'var(--border-color)'
                    }`,
                    backgroundColor: isDragging
                      ? 'rgba(232,122,32,0.06)'
                      : 'var(--bg-input)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: loading ? 0.6 : 1,
                    boxSizing: 'border-box',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      margin: '0 auto 8px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, rgba(232,122,32,0.15), rgba(232,122,32,0.06))',
                      color: 'var(--primary-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FaCloudUploadAlt size={20} />
                  </div>

                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      marginBottom: '3px',
                    }}
                  >
                    {isDragging
                      ? 'أفلت الصورة هنا'
                      : 'اضغط لاختيار صورة الإشعار'}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.68rem',
                    }}
                  >
                    JPG أو PNG • أقصى حجم {MAX_FILE_SIZE_MB} ميجابايت
                  </div>

                  <input
                    id="transfer-image-input"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ display: 'none' }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    borderRadius: '12px',
                    padding: '10px',
                    border: '1.5px solid rgba(40,167,69,0.3)',
                    backgroundColor: 'var(--bg-input)',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      maxHeight: '220px',
                      backgroundColor: 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="إشعار التحويل"
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '220px',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background:
                          'linear-gradient(135deg, #28A745, #1e7e34)',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        boxShadow: '0 3px 10px rgba(40,167,69,0.4)',
                      }}
                    >
                      <FaCheck size={8} />
                      تم إرفاق الإشعار
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '55%',
                      }}
                    >
                      {transferImage?.name}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById('transfer-image-input')
                            ?.click()
                        }
                        disabled={loading}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        تغيير
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={loading}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(220,53,69,0.3)',
                          backgroundColor: 'rgba(220,53,69,0.08)',
                          color: '#DC3545',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <FaTrashAlt size={10} />
                        حذف
                      </button>
                    </div>
                  </div>

                  <input
                    id="transfer-image-input"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ display: 'none' }}
                  />
                </motion.div>
              )}

              {imageError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    color: 'var(--error)',
                    fontSize: '0.75rem',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'center',
                  }}
                >
                  <FaInfoCircle size={10} />
                  {imageError}
                </motion.div>
              )}
            </div>

            {/* Section 4: Additional Notes */}
            <div style={{ width: '100%', boxSizing: 'border-box' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(139,90,43,0.1)',
                    color: 'var(--primary-brown)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FaStickyNote size={12} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    ملاحظات إضافية
                  </h4>
                  <div
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      marginTop: '1px',
                    }}
                  >
                    اختياري • اكتب رقم مرجعي أو اسم الحساب المحول منه
                  </div>
                </div>
              </div>

              <Controller
                name="additional_notes"
                control={control}
                render={({ field }) => (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <textarea
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={loading}
                      placeholder="مثلاً: تم التحويل برقم مرجعي أو من تطبيق بنك فلسطين..."
                      rows={3}
                      maxLength={MAX_NOTES_LENGTH}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: `1px solid ${
                          errors.additional_notes
                            ? 'var(--error)'
                            : 'var(--border-color)'
                        }`,
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.82rem',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '80px',
                        lineHeight: 1.5,
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          'var(--primary-orange)';
                        e.currentTarget.style.boxShadow =
                          '0 0 0 3px rgba(232,122,32,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          errors.additional_notes
                            ? 'var(--error)'
                            : 'var(--border-color)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '10px',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'system-ui, sans-serif',
                        direction: 'ltr',
                        opacity: 0.7,
                      }}
                    >
                      {watchedNotes.length}/{MAX_NOTES_LENGTH}
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Working Hours Info Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245,166,35,0.08)',
              border: '1px solid rgba(245,166,35,0.3)',
              boxShadow: '0 3px 10px var(--shadow-sm)',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <FaClock
              size={13}
              color="#E87A20"
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
              }}
            >
              سيتم مراجعة طلبك وتفعيل تمييز الإعلان خلال{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>
                24 ساعة
              </strong>{' '}
              كحد أقصى.
              <br />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--primary-orange)',
                }}
              >
                ساعات العمل: يومياً، 8:00 ص - 10:00 م
              </span>
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              paddingTop: '2px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <motion.button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                flex: '1 1 100px',
                padding: '11px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                opacity: loading ? 0.5 : 1,
                boxSizing: 'border-box',
              }}
            >
              <FaTimes size={11} />
              إلغاء
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading || !transferImage}
              style={{
                flex: '2 1 150px',
                padding: '11px 18px',
                borderRadius: '10px',
                border: 'none',
                background:
                  loading || !transferImage
                    ? 'var(--primary-brown-light)'
                    : 'linear-gradient(135deg, #F5A623 0%, #E87A20 100%)',
                color: '#FFFFFF',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor:
                  loading || !transferImage ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow:
                  loading || !transferImage
                    ? 'none'
                    : '0 4px 16px rgba(245,166,35,0.4)',
                opacity: loading || !transferImage ? 0.7 : 1,
                boxSizing: 'border-box',
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ width: '12px', height: '12px' }}
                  />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <FaStar size={12} />
                  إرسال طلب التمييز
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default FeaturedRequestForm;