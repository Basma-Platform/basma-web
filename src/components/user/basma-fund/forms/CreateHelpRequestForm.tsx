import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaBullhorn,
  FaVideo,
  FaUserTag,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import { useHelpRequestForm } from '../../../../hooks/useHelpRequestForm';
import { useAuth } from '../../../../hooks/useAuth';
import type {
  HelpRequestCreatePayload,
  HelpRequestDisplayNameType,
  HelpRequestRequirements,
} from '../../../../types';

import {
  FormSection,
  FieldLabel,
  FieldError,
  inputStyle,
  textareaStyle,
  CharCounter,
} from './HelpRequestFormShared';
import HelpRequestVideoUploader from './HelpRequestVideoUploader';
import HelpRequestRegionPicker from './HelpRequestRegionPicker';
import HelpRequestDisplayNamePicker from './HelpRequestDisplayNamePicker';
import HelpRequestEncryptedFieldsForm, {
  type EncryptedContactValues,
  type EncryptedFieldsValues,
  type EncryptedRegionValues,
} from './HelpRequestEncryptedFieldsForm';

// ============================================
// Props
// ============================================
interface CreateHelpRequestFormProps {
  requirements?: HelpRequestRequirements | null;
  defaultWhatsapp?: string;
  defaultFullName?: string;
  onSuccess: (id: number) => void;
}

// ============================================
// Constants
// ============================================
const MAX_TITLE = 200;
const MAX_DESCRIPTION = 2000;

// ============================================
// Component
// ============================================
const CreateHelpRequestForm = ({
  requirements,
  defaultWhatsapp,
  defaultFullName,
  onSuccess,
}: CreateHelpRequestFormProps) => {
  const { loading, errors, create } = useHelpRequestForm();
  const { user } = useAuth();

  // ============================================
  // Public fields
  // ============================================
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [governorateId, setGovernorateId] = useState<number | ''>('');
  const [cityId, setCityId] = useState<number | ''>('');

  // ============================================
  // Video
  // ============================================
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // ============================================
  // Display name
  // ============================================
  const [displayType, setDisplayType] =
    useState<HelpRequestDisplayNameType>('anonymous');
  const [customName, setCustomName] = useState('');

  // ============================================
  // Encrypted fields
  // ============================================
  const [fields, setFields] = useState<EncryptedFieldsValues>({
    real_name: defaultFullName || user?.name || '',
    age: '',
    family_size: '',
    health_condition: '',
    income_source: '',
  });

  const [contact, setContact] = useState<EncryptedContactValues>({
    whatsapp: defaultWhatsapp || user?.whatsapp || '',
    alt_phone: '',
  });

  const [region, setRegion] = useState<EncryptedRegionValues>({
    street: '',
    building: '',
  });

  // ============================================
  // Local validation before submit
  // ============================================
  const validateLocal = (): string | null => {
    if (!title.trim()) return 'العنوان مطلوب';
    if (title.trim().length < 10)
      return 'العنوان يجب أن يكون 10 أحرف على الأقل';
    if (!description.trim()) return 'الوصف مطلوب';
    if (description.trim().length < 30)
      return 'الوصف يجب أن يكون 30 حرفاً على الأقل';
    if (!governorateId) return 'الرجاء اختيار المحافظة';
    if (!cityId) return 'الرجاء اختيار المدينة/الحي';
    if (!videoFile) return 'الفيديو مطلوب';
    if (displayType === 'custom' && !customName.trim())
      return 'الرجاء إدخال الاسم المخصص';
    if (!fields.real_name.trim()) return 'الاسم الحقيقي مطلوب';
    if (!fields.age || Number(fields.age) < 18 || Number(fields.age) > 100)
      return 'العمر يجب أن يكون بين 18 و 100';
    if (
      !fields.family_size ||
      Number(fields.family_size) < 1 ||
      Number(fields.family_size) > 20
    )
      return 'عدد أفراد الأسرة يجب أن يكون بين 1 و 20';
    if (!contact.whatsapp.trim()) return 'رقم الواتساب مطلوب';
    if (!region.street.trim()) return 'الشارع مطلوب';
    if (!region.building.trim()) return 'المبنى مطلوب';
    return null;
  };

  // ============================================
  // Submit
  // ============================================
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const localError = validateLocal();
      if (localError) {
        toast.error(localError);
        return;
      }

      const payload: HelpRequestCreatePayload = {
        public_title: title.trim(),
        public_description: description.trim(),
        governorate_id: Number(governorateId),
        city_id: Number(cityId),
        video: videoFile!,
        display_name_type: displayType,
        display_name_custom:
          displayType === 'custom' ? customName.trim() : undefined,
        full_details: {
          real_name: fields.real_name.trim(),
          age: Number(fields.age),
          family_size: Number(fields.family_size),
          health_condition: fields.health_condition.trim() || undefined,
          income_source: fields.income_source.trim() || undefined,
        },
        contact_info: {
          whatsapp: contact.whatsapp.trim(),
          alt_phone: contact.alt_phone.trim() || undefined,
        },
        region_data: {
          street: region.street.trim(),
          building: region.building.trim(),
        },
      };

      try {
        const response = await create(payload);
        onSuccess(response.data.id);
      } catch {
        // toast + field errors handled inside the hook
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      title,
      description,
      governorateId,
      cityId,
      videoFile,
      displayType,
      customName,
      fields,
      contact,
      region,
      create,
      onSuccess,
    ]
  );

  // ============================================
  // Field-level error helper
  // ============================================
  const err = (key: string) => errors[key]?.[0];

  // ============================================
  // Render
  // ============================================
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ============================================ */}
      {/* 1. Basic info */}
      {/* ============================================ */}
      <FormSection
        Icon={FaBullhorn}
        title="معلومات الطلب"
        description="عنوان ووصف واضحان يساعدان المتبرعين على فهم احتياجك."
      >
        <div style={{ marginBottom: '14px' }}>
          <FieldLabel required>عنوان الطلب</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
            placeholder="مثال: أحتاج أدوية ضغط القلب الشهرية"
            maxLength={MAX_TITLE}
            style={inputStyle(!!err('public_title'))}
          />
          <CharCounter current={title.length} max={MAX_TITLE} />
          <FieldError>{err('public_title')}</FieldError>
        </div>

        <div>
          <FieldLabel required>الوصف العام</FieldLabel>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, MAX_DESCRIPTION))
            }
            placeholder="اشرح حالتك بإيجاز — هذا ما سيقرأه المتبرعون."
            rows={5}
            maxLength={MAX_DESCRIPTION}
            style={textareaStyle(!!err('public_description'))}
          />
          <CharCounter current={description.length} max={MAX_DESCRIPTION} />
          <FieldError>{err('public_description')}</FieldError>
        </div>
      </FormSection>

      {/* ============================================ */}
      {/* 2. Region */}
      {/* ============================================ */}
      <FormSection
        Icon={FaMapMarkerAlt}
        title="المنطقة"
        description="تظهر المحافظة والمدينة فقط في القائمة العامة."
      >
        <HelpRequestRegionPicker
          governorateId={governorateId}
          cityId={cityId}
          onChange={({ governorateId: g, cityId: c }) => {
            setGovernorateId(g);
            setCityId(c);
          }}
          errors={{
            governorate_id: err('governorate_id'),
            city_id: err('city_id'),
          }}
        />
      </FormSection>

      {/* ============================================ */}
      {/* 3. Video */}
      {/* ============================================ */}
      <FormSection
        Icon={FaVideo}
        title="الفيديو التوضيحي"
        description="فيديو قصير يوضح حالتك — إلزامي لضمان مصداقية الطلب."
      >
        <HelpRequestVideoUploader
          file={videoFile}
          onChange={setVideoFile}
          requirements={requirements}
          error={err('video')}
        />
      </FormSection>

      {/* ============================================ */}
      {/* 4. Display name */}
      {/* ============================================ */}
      <FormSection
        Icon={FaUserTag}
        title="اسمك على الطلب"
        description="اختر ما إذا كان اسمك سيظهر أم لا."
      >
        <HelpRequestDisplayNamePicker
          value={displayType}
          customValue={customName}
          onChange={setDisplayType}
          onCustomChange={setCustomName}
          error={err('display_name_type') || err('display_name_custom')}
          userFullName={defaultFullName || user?.name}
        />
      </FormSection>

      {/* ============================================ */}
      {/* 5. Encrypted data */}
      {/* ============================================ */}
      <FormSection
        Icon={FaLock}
        title="البيانات الحساسة"
        description="تُحفظ بشكل مشفّر ولا يمكن الوصول إليها إلا من الإدارة عند الضرورة."
        accent="#6F42C1"
      >
        <HelpRequestEncryptedFieldsForm
          fields={fields}
          contact={contact}
          region={region}
          onFieldsChange={setFields}
          onContactChange={setContact}
          onRegionChange={setRegion}
          errors={Object.fromEntries(
            Object.entries(errors).map(([k, v]) => [k, v?.[0] ?? ''])
          )}
          defaultWhatsapp={defaultWhatsapp || user?.whatsapp}
          defaultFullName={defaultFullName || user?.name}
        />
      </FormSection>

      {/* ============================================ */}
      {/* Pre-submit notice */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          padding: '1rem 1.15rem',
          borderRadius: '14px',
          backgroundColor: 'var(--notice-warning-bg)',
          border: '1px solid var(--notice-warning-border)',
          marginBottom: '1rem',
          fontFamily: 'Cairo, sans-serif',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <FaExclamationTriangle
          size={13}
          color="var(--notice-warning-text)"
          style={{ flexShrink: 0, marginTop: '2px' }}
        />
        <div
          style={{
            color: 'var(--notice-warning-text)',
            fontSize: '0.78rem',
            lineHeight: 1.65,
            fontWeight: 600,
          }}
        >
          <strong>قبل الإرسال:</strong> يمكنك حذف الطلب خلال 30 دقيقة من
          إنشائه. بعد ذلك يصبح الطلب ملكاً للمنصة ولا يمكن حذفه مباشرة.
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* Submit */}
      {/* ============================================ */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.01, y: -2 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        style={{
          width: '100%',
          padding: '15px 22px',
          borderRadius: '14px',
          border: 'none',
          background: loading
            ? 'var(--btn-disabled-bg)'
            : FUND_THEME.gradient,
          color: loading ? 'var(--btn-disabled-text)' : '#FFFFFF',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 800,
          fontSize: '0.95rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: loading ? 'none' : `0 8px 22px ${FUND_THEME.shadow}`,
          opacity: loading ? 0.85 : 1,
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              style={{ width: '14px', height: '14px' }}
            />
            جاري الإرسال...
          </>
        ) : (
          <>
            <FaCheckCircle size={15} />
            إرسال الطلب
          </>
        )}
      </motion.button>
    </form>
  );
};

export default CreateHelpRequestForm;