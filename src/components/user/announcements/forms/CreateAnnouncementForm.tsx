import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBullhorn,
  FaTag,
  FaHeading,
  FaAlignRight,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaLock,
  FaPlus,
  FaTimes,
  FaInfoCircle,
  FaLayerGroup,
  FaCity,
  FaImage,
  FaBox,
  FaTools,
  FaGift,
  FaExchangeAlt,
  FaGlobe,
  FaShieldAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import AnnouncementImageUploader from './AnnouncementImageUploader';
import {
  FormSection,
  FieldWrapper,
  inputBaseStyle,
  createAnnouncementBaseSchema,
  validateImages,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  type LocalAnnouncementImage,
} from './AnnouncementFormShared';
import { regionService } from '../../../../services/regionService';
import { userAnnouncementService } from '../../../../services/userAnnouncementService';
import { announcementService } from '../../../../services/announcementService';
import { toast } from 'react-toastify';
import type { Governorate, City, SubCategory, User } from '../../../../types';

// ============================================
// Schema
// ============================================
const createSchema = (isVerified: boolean) =>
  createAnnouncementBaseSchema(isVerified);

type CreateAnnouncementFormData = z.infer<ReturnType<typeof createSchema>>;

// ============================================
// Props
// ============================================
interface CreateAnnouncementFormProps {
  user: User;
  onSuccess?: (announcementId: number) => void;
  onCancel?: () => void;
}

interface SubCategoriesGrouped {
  goods: SubCategory[];
  services: SubCategory[];
}

// ============================================
// Component
// ============================================
const CreateAnnouncementForm = ({
  user,
  onSuccess,
  onCancel,
}: CreateAnnouncementFormProps) => {
  const navigate = useNavigate();
  const isVerified = user.is_verified;

  // Local state
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoriesGrouped>({
    goods: [],
    services: [],
  });
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [images, setImages] = useState<LocalAnnouncementImage[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Track if this is the initial governorate load
  const isInitialGovernorateRef = useRef(true);
  // ✅ Track previous governorate value
  const previousGovernorateRef = useRef<number | null>(null);

  // RHF + Zod
  const schema = useMemo(() => createSchema(isVerified), [isVerified]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError: setRHFError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateAnnouncementFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      type: 'offer',
      category: 'goods',
      sub_category_id: 0,
      title: '',
      description: '',
      price_type: 'free',
      price: null,
      governorate_id: user.governorate_id, // ✅ Auto-fill
      city_id: user.city_id,               // ✅ Auto-fill
      whatsapp: user.whatsapp,             // ✅ Auto-fill
      privacy_type: 'public',
    },
    // ✅ Show errors only after user submits (not on load)
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const watchedCategory = watch('category');
  const watchedPriceType = watch('price_type');
  const watchedGovernorate = watch('governorate_id');
  const watchedTitle = watch('title') || '';
  const watchedDescription = watch('description') || '';
  const watchedPrivacy = watch('privacy_type');

  // ============================================
  // ✅ Reset sub_category only when category actually CHANGES (not on mount)
  // ============================================
  const previousCategoryRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip on mount
    if (previousCategoryRef.current === null) {
      previousCategoryRef.current = watchedCategory;
      return;
    }

    // Only reset if category truly changed
    if (previousCategoryRef.current !== watchedCategory) {
      setValue('sub_category_id', 0, { shouldValidate: false });
      clearErrors('sub_category_id');
      previousCategoryRef.current = watchedCategory;
    }
  }, [watchedCategory, setValue, clearErrors]);

  // ============================================
  // Fetch metadata & subcategories
  // ============================================
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoadingMeta(true);
        const [govs, filters] = await Promise.all([
          regionService.getGovernorates(),
          announcementService.getFilters(),
        ]);
        setGovernorates(govs);
        if (filters?.data?.sub_categories) {
          setSubCategories(filters.data.sub_categories);
        }
      } catch (err) {
        console.error('Error fetching meta:', err);
        toast.error('حدث خطأ في تحميل البيانات');
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []);

  // ============================================
  // ✅ Load cities when governorate changes (with proper handling)
  // ============================================
  useEffect(() => {
    if (!watchedGovernorate) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const data = await regionService.getCities(watchedGovernorate);
        setCities(data);

        // ✅ Only reset city if governorate actually CHANGED
        //    (not on initial mount with user's own governorate)
        const isInitialLoad = isInitialGovernorateRef.current;
        const previousGov = previousGovernorateRef.current;
        const govChanged = previousGov !== null && previousGov !== watchedGovernorate;

        if (!isInitialLoad && govChanged) {
          setValue('city_id', 0, { shouldValidate: false });
          clearErrors('city_id');
        }

        // Mark as no longer initial
        if (isInitialLoad) {
          isInitialGovernorateRef.current = false;
        }
        previousGovernorateRef.current = watchedGovernorate;
      } catch (err) {
        console.error('Error loading cities:', err);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [watchedGovernorate, setValue, clearErrors]);

  const availableSubCategories = useMemo(() => {
    if (!watchedCategory) return [];
    return subCategories[watchedCategory] || [];
  }, [watchedCategory, subCategories]);

  // ============================================
  // Build FormData payload
  // ============================================
  const buildFormData = (data: CreateAnnouncementFormData): FormData => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('category', data.category);
    formData.append('sub_category_id', String(data.sub_category_id));
    formData.append('title', data.title.trim());
    formData.append('description', data.description.trim());
    formData.append('price_type', data.price_type);

    if (data.price_type === 'paid' && data.price != null) {
      formData.append('price', String(data.price));
    } else {
      formData.append('price', '0');
    }

    formData.append('governorate_id', String(data.governorate_id));
    formData.append('city_id', String(data.city_id));
    formData.append('whatsapp', data.whatsapp.trim());
    formData.append('privacy_type', data.privacy_type);

    images.forEach((img) => {
      if (img.file && img.file.size > 0) {
        formData.append('images[]', img.file);
      }
    });

    return formData;
  };

  // ============================================
  // Submit handler
  // ============================================
  const onSubmit = async (data: CreateAnnouncementFormData) => {
    const imgErr = validateImages(images);
    if (imgErr) {
      setImageError(imgErr);
      toast.error(imgErr);
      return;
    }
    setImageError(null);

    try {
      setSubmitting(true);
      const formData = buildFormData(data);
      const response: any = await userAnnouncementService.createAnnouncement(formData);
      const newId = response?.data?.id || response?.id;

      toast.success('تم إنشاء الإعلان بنجاح');

      if (onSuccess && newId) {
        onSuccess(newId);
      } else if (newId) {
        navigate(`/user/announcements/${newId}`);
      } else {
        navigate('/user/announcements');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const responseData = error.response?.data;
      const message = responseData?.message || 'حدث خطأ أثناء إنشاء الإعلان';

      if (error.response?.status === 422 && responseData?.errors) {
        const serverErrors = responseData.errors;
        Object.keys(serverErrors).forEach((field) => {
          const fieldName = field as keyof CreateAnnouncementFormData;
          const errorMessage = serverErrors[field][0];
          setRHFError(fieldName, { type: 'server', message: errorMessage });
        });
        toast.error('يرجى التحقق من الحقول المدخلة');
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  // ============================================
  // Loading indicator
  // ============================================
  if (loadingMeta) {
    return (
      <div
        style={{
          padding: '3rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
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
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          جاري تحميل البيانات...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* SECTION 1: Basic Info */}
          <FormSection title="المعلومات الأساسية" icon={<FaBullhorn size={14} />}>
            <FieldWrapper
              label="نوع الإعلان"
              required
              icon={<FaLayerGroup size={12} />}
              error={errors.type?.message}
            >
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { value: 'offer', label: 'عرض', color: '#28A745' },
                  { value: 'request', label: 'طلب', color: '#DC3545' },
                ].map((opt) => {
                  const active = watch('type') === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setValue('type', opt.value as 'offer' | 'request', {
                          shouldValidate: true,
                        })
                      }
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: '1 1 0',
                        minWidth: '120px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `2px solid ${
                          active ? opt.color : 'var(--border-color)'
                        }`,
                        backgroundColor: active
                          ? `${opt.color}12`
                          : 'var(--bg-input)',
                        color: active ? opt.color : 'var(--text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            </FieldWrapper>

            <FieldWrapper
              label="الفئة الرئيسية"
              required
              icon={<FaTag size={12} />}
              error={errors.category?.message}
            >
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { value: 'goods', label: 'سلع', Icon: FaBox },
                  { value: 'services', label: 'خدمات', Icon: FaTools },
                ].map((opt) => {
                  const active = watch('category') === opt.value;
                  const IconComp = opt.Icon;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setValue(
                          'category',
                          opt.value as 'goods' | 'services',
                          { shouldValidate: true }
                        )
                      }
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: '1 1 0',
                        minWidth: '120px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: `2px solid ${
                          active
                            ? 'var(--primary-orange)'
                            : 'var(--border-color)'
                        }`,
                        backgroundColor: active
                          ? 'rgba(232,122,32,0.08)'
                          : 'var(--bg-input)',
                        color: active
                          ? 'var(--primary-orange)'
                          : 'var(--text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <IconComp size={14} />
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            </FieldWrapper>

            <FieldWrapper
              label="الفئة الفرعية"
              required
              icon={<FaTag size={12} />}
              error={errors.sub_category_id?.message}
            >
              <Controller
                name="sub_category_id"
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={!watchedCategory}
                    style={{
                      ...inputBaseStyle(!!errors.sub_category_id),
                      cursor: watchedCategory ? 'pointer' : 'not-allowed',
                      appearance: 'none',
                    }}
                  >
                    <option value="">
                      {!watchedCategory
                        ? 'اختر الفئة الرئيسية أولاً'
                        : availableSubCategories.length === 0
                          ? 'لا توجد فئات فرعية'
                          : 'اختر الفئة الفرعية'}
                    </option>
                    {availableSubCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                        {sub.is_high_risk && ' ⚠️'}
                      </option>
                    ))}
                  </select>
                )}
              />
            </FieldWrapper>
          </FormSection>

          {/* SECTION 2: Content */}
          <FormSection title="تفاصيل الإعلان" icon={<FaHeading size={14} />}>
            <FieldWrapper
              label="العنوان"
              required
              icon={<FaHeading size={12} />}
              error={errors.title?.message}
              counter={`${watchedTitle.length}/${MAX_TITLE_LENGTH}`}
            >
              <input
                type="text"
                {...register('title')}
                maxLength={MAX_TITLE_LENGTH}
                placeholder="أدخل عنواناً واضحاً للإعلان..."
                style={inputBaseStyle(!!errors.title)}
              />
            </FieldWrapper>

            <FieldWrapper
              label="الوصف"
              required
              icon={<FaAlignRight size={12} />}
              error={errors.description?.message}
              counter={`${watchedDescription.length}/${MAX_DESCRIPTION_LENGTH}`}
            >
              <textarea
                {...register('description')}
                rows={5}
                maxLength={MAX_DESCRIPTION_LENGTH}
                placeholder="اكتب تفاصيل الإعلان بوضوح..."
                style={{
                  ...inputBaseStyle(!!errors.description),
                  resize: 'vertical',
                  minHeight: '120px',
                  lineHeight: 1.6,
                }}
              />
            </FieldWrapper>
          </FormSection>

          {/* SECTION 3: Pricing */}
          <FormSection
            title="طريقة الدفع والسعر"
            icon={<FaMoneyBillWave size={14} />}
          >
            <FieldWrapper
              label="طريقة الدفع"
              required
              icon={<FaMoneyBillWave size={12} />}
              error={errors.price_type?.message}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '8px',
                }}
              >
                {[
                  {
                    value: 'free',
                    label: 'مجاني',
                    Icon: FaGift,
                    color: '#28A745',
                  },
                  {
                    value: 'paid',
                    label: 'مدفوع',
                    Icon: FaMoneyBillWave,
                    color: '#E87A20',
                  },
                  {
                    value: 'barter',
                    label: 'مقايضة',
                    Icon: FaExchangeAlt,
                    color: '#9C27B0',
                  },
                ].map((opt) => {
                  const active = watch('price_type') === opt.value;
                  const IconComp = opt.Icon;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setValue(
                          'price_type',
                          opt.value as 'free' | 'paid' | 'barter',
                          { shouldValidate: true }
                        )
                      }
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${
                          active ? opt.color : 'var(--border-color)'
                        }`,
                        backgroundColor: active
                          ? `${opt.color}12`
                          : 'var(--bg-input)',
                        color: active ? opt.color : 'var(--text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <IconComp size={16} />
                      <span>{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </FieldWrapper>

            {watchedPriceType === 'paid' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ overflow: 'hidden' }}
              >
                <FieldWrapper
                  label="السعر (بالشيكل)"
                  required
                  icon={<FaMoneyBillWave size={12} />}
                  error={errors.price?.message}
                >
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      {...register('price', { valueAsNumber: true })}
                      style={{
                        ...inputBaseStyle(!!errors.price),
                        paddingLeft: '50px',
                        fontFamily: 'system-ui, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 700,
                        direction: 'ltr',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        pointerEvents: 'none',
                      }}
                    >
                      ₪
                    </span>
                  </div>
                </FieldWrapper>
              </motion.div>
            )}
          </FormSection>

          {/* SECTION 4: Location & Contact */}
          <FormSection
            title="الموقع والتواصل"
            icon={<FaMapMarkerAlt size={14} />}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              <FieldWrapper
                label="المحافظة"
                required
                icon={<FaMapMarkerAlt size={12} />}
                error={errors.governorate_id?.message}
              >
                <Controller
                  name="governorate_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      style={{
                        ...inputBaseStyle(!!errors.governorate_id),
                        cursor: 'pointer',
                        appearance: 'none',
                      }}
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </FieldWrapper>

              <FieldWrapper
                label="المدينة / الحي"
                required
                icon={<FaCity size={12} />}
                error={errors.city_id?.message}
              >
                <Controller
                  name="city_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={!watchedGovernorate || loadingCities}
                      style={{
                        ...inputBaseStyle(!!errors.city_id),
                        cursor: watchedGovernorate ? 'pointer' : 'not-allowed',
                        opacity: watchedGovernorate ? 1 : 0.6,
                        appearance: 'none',
                      }}
                    >
                      <option value="">
                        {loadingCities
                          ? 'جاري التحميل...'
                          : !watchedGovernorate
                            ? 'اختر المحافظة أولاً'
                            : 'اختر المدينة'}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </FieldWrapper>
            </div>

            <FieldWrapper
              label="رقم واتساب للتواصل"
              required
              icon={<FaWhatsapp size={12} />}
              error={errors.whatsapp?.message}
            >
              <input
                type="tel"
                placeholder="059xxxxxxx"
                {...register('whatsapp')}
                dir="ltr"
                style={{
                  ...inputBaseStyle(!!errors.whatsapp),
                  direction: 'ltr',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                }}
              />
            </FieldWrapper>
          </FormSection>

          {/* SECTION 5: Privacy */}
          <FormSection title="الخصوصية" icon={<FaLock size={14} />}>
            <FieldWrapper
              label="من يمكنه رؤية هذا الإعلان؟"
              required
              icon={<FaLock size={12} />}
              error={errors.privacy_type?.message}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {[
                  {
                    value: 'public',
                    label: 'عام',
                    description: 'مرئي للجميع',
                    Icon: FaGlobe,
                    available: true,
                  },
                  {
                    value: 'region_only',
                    label: 'للمنطقة فقط',
                    description: 'مرئي فقط للمستخدمين في نفس المنطقة',
                    Icon: FaMapMarkerAlt,
                    available: true,
                  },
                  {
                    value: 'verified_only',
                    label: 'للموثقين فقط',
                    description: 'مرئي فقط للمستخدمين الموثقين',
                    Icon: FaShieldAlt,
                    available: isVerified,
                  },
                  {
                    value: 'verified_region',
                    label: 'للموثقين في المنطقة',
                    description: 'مرئي فقط للموثقين في نفس المنطقة',
                    Icon: FaCheckCircle,
                    available: isVerified,
                  },
                ].map((opt) => {
                  const active = watchedPrivacy === opt.value;
                  const isDisabled = !opt.available;
                  const IconComp = opt.Icon;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setValue(
                            'privacy_type',
                            opt.value as
                              | 'public'
                              | 'region_only'
                              | 'verified_only'
                              | 'verified_region',
                            { shouldValidate: true }
                          );
                        }
                      }}
                      whileHover={!isDisabled ? { scale: 1.01 } : {}}
                      whileTap={!isDisabled ? { scale: 0.99 } : {}}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: `2px solid ${
                          active
                            ? 'var(--primary-orange)'
                            : 'var(--border-color)'
                        }`,
                        backgroundColor: active
                          ? 'rgba(232,122,32,0.08)'
                          : 'var(--bg-input)',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        textAlign: 'right',
                        opacity: isDisabled ? 0.5 : 1,
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      <IconComp
                        size={16}
                        color={
                          active ? 'var(--primary-orange)' : 'var(--text-muted)'
                        }
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: active
                              ? 'var(--primary-orange)'
                              : 'var(--text-secondary)',
                          }}
                        >
                          {opt.label}
                        </div>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {opt.description}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${
                            active
                              ? 'var(--primary-orange)'
                              : 'var(--border-color)'
                          }`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {active && (
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-orange)',
                            }}
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </FieldWrapper>
          </FormSection>

          {/* SECTION 6: Images */}
          <FormSection title="صور الإعلان" icon={<FaImage size={14} />}>
            <AnnouncementImageUploader
              images={images}
              onChange={(newImages) => {
                setImages(newImages);
                if (imageError && newImages.length > 0) {
                  setImageError(null);
                }
              }}
              error={imageError || undefined}
              disabled={submitting}
            />
          </FormSection>

          {/* Submission */}
          <div
            style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'rgba(23,162,184,0.06)',
                border: '1px solid rgba(23,162,184,0.2)',
                borderRadius: '10px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              <FaInfoCircle
                size={12}
                color="#17A2B8"
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <span>
                تأكد من إدخال كافة البيانات بشكل صحيح لضمان قبول إعلانك بسرعة.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <motion.button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.01 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                style={{
                  flex: '0 1 auto',
                  minWidth: '140px',
                  padding: '13px 22px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: submitting ? 0.5 : 1,
                }}
              >
                <FaTimes size={12} />
                إلغاء
              </motion.button>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02, y: -1 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                style={{
                  flex: '1 1 auto',
                  minWidth: '200px',
                  padding: '13px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: submitting
                    ? 'var(--primary-brown-light)'
                    : 'linear-gradient(135deg, #E87A20, #F5A623)',
                  color: '#FFFFFF',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: submitting
                    ? 'none'
                    : '0 6px 20px rgba(232,122,32,0.35)',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ width: '14px', height: '14px' }}
                    />
                    جاري النشر...
                  </>
                ) : (
                  <>
                    <FaPlus size={14} />
                    نشر الإعلان
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateAnnouncementForm;