import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useCommunityLimits } from '../../../hooks/useCommunityLimits';
import { useCommunityPostForm } from '../../../hooks/useCommunityPostForm';
import {
  COMMUNITY_THEME,
  isAutoExpiringType,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import {
  FormSection,
  FormField,
  FormErrorBanner,
  inputStyle,
  textareaStyle,
} from '../../../components/community/user/CommunityPostFormShared';
import CommunityPostTypePicker from '../../../components/community/user/CommunityPostTypePicker';
import CommunityPostImageUploader from '../../../components/community/user/CommunityPostImageUploader';
import CommunityPostDisplayNamePicker from '../../../components/community/user/CommunityPostDisplayNamePicker';
import CommunityPostExpiryPicker from '../../../components/community/user/CommunityPostExpiryPicker';
import CommunityPostRegionPicker from '../../../components/community/user/CommunityPostRegionPicker';
import CommunityPostCategoryPicker from '../../../components/community/user/CommunityPostCategoryPicker';
import CommunityLimitsIndicator from '../../../components/community/user/CommunityLimitsIndicator';
import type {
  CommunityPostType,
  CommunityPostFormPayload,
  CommunityExpiryChoice,
  CommunityDisplayNameType,
} from '../../../types';

const CreateCommunityPostPage = () => {
  const navigate = useNavigate();

  const { data: limitsData, loading: limitsLoading } = useCommunityLimits();
  const { loading, errors, createPost } = useCommunityPostForm();

  // ============================================
  // Form state
  // ============================================
  const [type, setType] = useState<CommunityPostType>('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [governorateId, setGovernorateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [displayNameType, setDisplayNameType] =
    useState<CommunityDisplayNameType>('full');
  const [displayNameCustom, setDisplayNameCustom] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [expiryChoice, setExpiryChoice] =
    useState<CommunityExpiryChoice>('1_month');

  // ============================================
  // Auto-expiring types require expiry_choice
  // ============================================
  const requiresExpiry = useMemo(() => isAutoExpiringType(type), [type]);

  // ============================================
  // Submit
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CommunityPostFormPayload = {
      type,
      title: title.trim(),
      description: description.trim(),
      images: images.length > 0 ? images : undefined,
      category_id: categoryId,
      governorate_id: governorateId,
      city_id: cityId,
      display_name_type: displayNameType,
      display_name_custom:
        displayNameType === 'custom' ? displayNameCustom.trim() : undefined,
      whatsapp_number: whatsappNumber.trim() || undefined,
      expiry_choice: requiresExpiry ? expiryChoice : undefined,
    };

    try {
      const response = await createPost(payload);
      navigate(`/user/community-posts/${response.data.id}`, {
        state: { justCreated: true },
      });
    } catch {
      /* toast handled in hook */
    }
  };

  // ============================================
  // Redirect if cannot post (limits full)
  // ============================================
  useEffect(() => {
    if (!limitsLoading && limitsData && !limitsData.limits.can_post) {
      // Parent page will show the warning; user can still view the page
    }
  }, [limitsData, limitsLoading]);

  return (
    <>
      <SEO
        title="منشور جديد"
        description="أنشئ منشوراً جديداً في منشورات المجتمع - بصمة"
      />

      <section
        style={{
          paddingTop: '90px',
          paddingBottom: '4rem',
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Container>
          {/* Back */}
          <Link
            to="/user/community-posts"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '1.5rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COMMUNITY_THEME.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <CommunityIcons.arrowRight size={12} />
            العودة إلى منشوراتي
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '0.5rem',
              }}
            >
              منشور جديد
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              شارك ما يهم مجتمعك — سيُراجع منشورك قبل النشر.
            </p>
          </div>

          {/* Limits */}
          {limitsData?.limits && (
            <CommunityLimitsIndicator limits={limitsData.limits} />
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: '820px', margin: '0 auto' }}
          >
            <FormErrorBanner errors={errors} />

            {/* Type */}
            <FormSection
              title="نوع المنشور"
              subtitle="اختر النوع المناسب لمحتوى منشورك"
              icon={<CommunityIcons.info size={14} />}
              required
            >
              <CommunityPostTypePicker value={type} onChange={setType} />
            </FormSection>

            {/* Content */}
            <FormSection
              title="المحتوى"
              subtitle="عنوان واضح ووصف مفصّل يساعد الآخرين على فهم منشورك"
              icon={<CommunityIcons.edit size={14} />}
              required
            >
              <FormField label="العنوان" required error={errors.title}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  placeholder="عنوان مختصر وواضح"
                  style={inputStyle}
                />
              </FormField>

              <FormField
                label="الوصف"
                required
                error={errors.description}
                hint={`${description.length} / 2000 حرف`}
              >
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  placeholder="اكتب تفاصيل المنشور..."
                  style={textareaStyle}
                />
              </FormField>
            </FormSection>

            {/* Images */}
            <FormSection
              title="الصور (اختياري)"
              subtitle="حتى 4 صور — الأولى ستكون الصورة الرئيسية"
              icon={<CommunityIcons.image size={14} />}
            >
              <CommunityPostImageUploader
                newFiles={images}
                onChangeNewFiles={setImages}
              />
              {errors.images && (
                <p
                  style={{
                    color: '#DC3545',
                    fontSize: '0.72rem',
                    fontFamily: 'Cairo, sans-serif',
                    marginTop: '6px',
                    marginBottom: 0,
                  }}
                >
                  {Array.isArray(errors.images)
                    ? errors.images[0]
                    : errors.images}
                </p>
              )}
            </FormSection>

            {/* Region + Category */}
            <FormSection
              title="الموقع والتصنيف (اختياري)"
              subtitle="ساعد الآخرين في العثور على منشورك"
              icon={<CommunityIcons.location size={14} />}
            >
              <div style={{ marginBottom: '1rem' }}>
                <CommunityPostRegionPicker
                  governorateId={governorateId}
                  cityId={cityId}
                  onChangeGovernorate={setGovernorateId}
                  onChangeCity={setCityId}
                  governorateError={errors.governorate_id}
                  cityError={errors.city_id}
                />
              </div>

              <FormField label="التصنيف" error={errors.category_id}>
                <CommunityPostCategoryPicker
                  value={categoryId}
                  onChange={setCategoryId}
                />
              </FormField>
            </FormSection>

            {/* Display name */}
            <FormSection
              title="طريقة عرض اسمك"
              subtitle="اختر كيف سيظهر اسمك للآخرين"
              icon={<CommunityIcons.info size={14} />}
              required
            >
              <CommunityPostDisplayNamePicker
                value={displayNameType}
                onChange={setDisplayNameType}
                customValue={displayNameCustom}
                onCustomValueChange={setDisplayNameCustom}
                error={errors.display_name_type}
                customError={errors.display_name_custom}
              />
            </FormSection>

            {/* WhatsApp + Expiry */}
            <FormSection
              title="التواصل والصلاحية"
              icon={<CommunityIcons.clicks size={14} />}
            >
              <FormField
                label="رقم واتساب (اختياري)"
                error={errors.whatsapp_number}
                hint="يجب أن يبدأ بـ +970 أو +972"
              >
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+970599123456"
                  style={inputStyle}
                  dir="ltr"
                />
              </FormField>

              {requiresExpiry && (
                <FormField
                  label="مدة الصلاحية"
                  required
                  error={errors.expiry_choice}
                  hint="بعد انتهاء المدة سيتم إخفاء المنشور تلقائياً"
                >
                  <CommunityPostExpiryPicker
                    value={expiryChoice}
                    onChange={setExpiryChoice}
                    error={errors.expiry_choice}
                  />
                </FormField>
              )}
            </FormSection>

            {/* Submit */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <Link
                to="/user/community-posts"
                style={{
                  padding: '12px 26px',
                  fontSize: '0.88rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                إلغاء
              </Link>

              <button
                type="submit"
                disabled={loading || !limitsData?.limits.can_post}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 30px',
                  fontSize: '0.9rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: COMMUNITY_THEME.gradient,
                  border: 'none',
                  borderRadius: '30px',
                  cursor:
                    loading || !limitsData?.limits.can_post
                      ? 'not-allowed'
                      : 'pointer',
                  boxShadow: `0 6px 20px ${COMMUNITY_THEME.shadow}`,
                  transition: 'all 0.25s ease',
                  opacity:
                    loading || !limitsData?.limits.can_post ? 0.6 : 1,
                }}
              >
                <CommunityIcons.confirm size={13} />
                {loading ? 'جاري النشر...' : 'نشر'}
              </button>
            </div>
          </form>
        </Container>
      </section>
    </>
  );
};

export default CreateCommunityPostPage;