import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { communityService } from '../../../services/communityService';
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
import CommunityPostImageUploader from '../../../components/community/user/CommunityPostImageUploader';
import CommunityPostDisplayNamePicker from '../../../components/community/user/CommunityPostDisplayNamePicker';
import CommunityPostExpiryPicker from '../../../components/community/user/CommunityPostExpiryPicker';
import CommunityPostRegionPicker from '../../../components/community/user/CommunityPostRegionPicker';
import CommunityPostCategoryPicker from '../../../components/community/user/CommunityPostCategoryPicker';
import type {
  CommunityPostFormPayload,
  CommunityExpiryChoice,
  CommunityDisplayNameType,
  UserCommunityPost,
} from '../../../types';

const EditCommunityPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, errors, updatePost } = useCommunityPostForm();

  const postId = Number(id);

  const [original, setOriginal] = useState<UserCommunityPost | null>(null);
  const [fetching, setFetching] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
  // Fetch post on mount
  // ============================================
  useEffect(() => {
    if (!postId) return;

    let mounted = true;
    setFetching(true);

    communityService
      .getMyPost(postId)
      .then((data) => {
        if (!mounted) return;

        // Block editing non-pending posts
        if (data.status !== 'pending') {
          navigate(`/user/community-posts/${postId}`, { replace: true });
          return;
        }

        setOriginal(data);
        setTitle(data.title);
        setDescription(data.description);
        setExistingImages(data.images || []);
        setCategoryId(data.category?.id ?? null);
        setGovernorateId(data.governorate?.id ?? null);
        setCityId(data.city?.id ?? null);
        setDisplayNameType(data.display_name_type);
        setDisplayNameCustom('');
        setWhatsappNumber(data.whatsapp_number || '');
        setExpiryChoice('1_month');
      })
      .catch(() => {
        navigate('/user/community-posts', { replace: true });
      })
      .finally(() => {
        if (mounted) setFetching(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId, navigate]);

  const requiresExpiry = useMemo(
    () => (original ? isAutoExpiringType(original.type) : false),
    [original]
  );

  // ============================================
  // Submit
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!original) return;

    const payload: CommunityPostFormPayload = {
      type: original.type,
      title: title.trim(),
      description: description.trim(),
      images: newImages.length > 0 ? newImages : undefined,
      keep_images: existingImages,
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
      await updatePost(original.id, payload);
      navigate(`/user/community-posts/${original.id}`);
    } catch {
      /* toast handled in hook */
    }
  };

  // ============================================
  // Loading
  // ============================================
  if (fetching || !original) {
    return (
      <section
        style={{
          paddingTop: '110px',
          paddingBottom: '4rem',
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
        }}
      >
        <Container>
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <CommunityIcons.clock
              size={32}
              style={{ marginBottom: '1rem', opacity: 0.6 }}
            />
            <p>جاري التحميل...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <SEO title={`تعديل: ${original.title}`} description={original.description} />

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
          <Link
            to={`/user/community-posts/${original.id}`}
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
            العودة للتفاصيل
          </Link>

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
              تعديل المنشور
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
              يمكنك تعديل المنشور قبل المراجعة فقط
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: '820px', margin: '0 auto' }}
          >
            <FormErrorBanner errors={errors} />

            <FormSection
              title="المحتوى"
              icon={<CommunityIcons.edit size={14} />}
              required
            >
              <FormField label="العنوان" required error={errors.title}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
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
                  style={textareaStyle}
                />
              </FormField>
            </FormSection>

            <FormSection
              title="الصور"
              subtitle="احتفظ بالصور الحالية أو أضف صوراً جديدة"
              icon={<CommunityIcons.image size={14} />}
            >
              <CommunityPostImageUploader
                newFiles={newImages}
                onChangeNewFiles={setNewImages}
                existingImages={existingImages}
                onRemoveExisting={(path) =>
                  setExistingImages((prev) => prev.filter((p) => p !== path))
                }
              />
            </FormSection>

            <FormSection
              title="الموقع والتصنيف"
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

            <FormSection
              title="طريقة عرض اسمك"
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

            <FormSection
              title="التواصل والصلاحية"
              icon={<CommunityIcons.clicks size={14} />}
            >
              <FormField
                label="رقم واتساب"
                error={errors.whatsapp_number}
                hint="اتركه فارغاً إن لم ترغب بإظهاره"
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
                  error={errors.expiry_choice}
                >
                  <CommunityPostExpiryPicker
                    value={expiryChoice}
                    onChange={setExpiryChoice}
                    error={errors.expiry_choice}
                  />
                </FormField>
              )}
            </FormSection>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <Link
                to={`/user/community-posts/${original.id}`}
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
                }}
              >
                إلغاء
              </Link>

              <button
                type="submit"
                disabled={loading}
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
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: `0 6px 20px ${COMMUNITY_THEME.shadow}`,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <CommunityIcons.confirm size={13} />
                {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        </Container>
      </section>
    </>
  );
};

export default EditCommunityPostPage;