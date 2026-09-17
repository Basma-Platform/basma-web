import { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaUser, FaWhatsapp, FaMapMarkerAlt, FaCity, 
  FaSave, FaTimes, FaEdit 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useProfile } from '../../../hooks/useProfile';
import type { User, Governorate, City } from '../../../types';

// ============================================
// Zod Schema
// ============================================
const editProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'الاسم يجب أن لا يتجاوز 100 حرف'),
  whatsapp: z
    .string()
    .regex(
      /^(\+970|\+972)[0-9]{9}$/,
      'رقم واتساب يجب أن يبدأ بـ +970 أو +972 ويحتوي على 9 أرقام'
    ),
  governorate_id: z
    .string()
    .min(1, 'المحافظة مطلوبة'),
  city_id: z
    .string()
    .min(1, 'المدينة مطلوبة'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

// ============================================
// Props
// ============================================
interface EditProfileFormProps {
  user: User;
  governorates: Governorate[];
  cities: City[];
  onCitiesLoad: (governorateId: number) => void;
  onSuccess?: (updatedUser: User) => void;
  onCancel?: () => void;
}

// ============================================
// Component
// ============================================
const EditProfileForm = ({
  user,
  governorates,
  cities,
  onCitiesLoad,
  onSuccess,
  onCancel,
}: EditProfileFormProps) => {
  const { isDark } = useTheme();
  const { updateProfile } = useProfile();
  
  // Toggle state to control view vs edit mode
  const [isEditing, setIsEditing] = useState(false);

  // ============================================
  // React Hook Form
  // ============================================
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name || '',
      whatsapp: user.whatsapp || '',
      governorate_id: user.governorate_id?.toString() || '',
      city_id: user.city_id?.toString() || '',
    },
  });

  const selectedGovernorate = watch('governorate_id');

  // ============================================
  // Reset Form when User Data Changes
  // ============================================
  useEffect(() => {
    if (cities.length === 0 && user.governorate_id) {
      return;
    }

    reset({
      name: user.name || '',
      whatsapp: user.whatsapp || '',
      governorate_id: user.governorate_id?.toString() || '',
      city_id: user.city_id?.toString() || '',
    });
  }, [user.id, user.governorate_id, user.city_id, cities.length, reset]);

  // ============================================
  // Load Cities when Governorate changes
  // ============================================
  useEffect(() => {
    if (selectedGovernorate && Number(selectedGovernorate) !== user.governorate_id) {
      onCitiesLoad(Number(selectedGovernorate));
      setValue('city_id', '');
    }
  }, [selectedGovernorate, user.governorate_id, onCitiesLoad, setValue]);

  // ============================================
  // Submit Handler
  // ============================================
  const onSubmit = async (data: EditProfileFormData) => {
    try {
      const updatedUser = await updateProfile({
        name: data.name,
        whatsapp: data.whatsapp,
        governorate_id: Number(data.governorate_id),
        city_id: Number(data.city_id),
      });

      if (onSuccess) {
        onSuccess(updatedUser);
      }

      reset({
        name: updatedUser.name,
        whatsapp: updatedUser.whatsapp,
        governorate_id: updatedUser.governorate_id?.toString() || '',
        city_id: updatedUser.city_id?.toString() || '',
      });

      setIsEditing(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  // ============================================
  // Cancel Handler
  // ============================================
  const handleCancel = () => {
    reset();
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  // Helper lookups for text display in view mode
  const currentGovernorateName = governorates.find(
    (g) => g.id.toString() === watch('governorate_id')
  )?.name || 'غير محدد';

  const currentCityName = cities.find(
    (c) => c.id.toString() === watch('city_id')
  )?.name || 'غير محدد';

  // ============================================
  // Shared Styles
  // ============================================
  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `1px solid ${hasError ? 'var(--error)' : 'var(--input-border)'}`,
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontFamily: 'Cairo, sans-serif',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    outline: 'none',
  });

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: 600 as const,
    fontFamily: 'Cairo, sans-serif',
    marginBottom: '6px',
  };

  const errorStyle = {
    color: 'var(--error)',
    fontSize: '0.75rem',
    marginTop: '4px',
    fontFamily: 'Cairo, sans-serif',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
    >
      <Card
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          textAlign: 'right',
          overflow: 'hidden',
        }}
      >
        {/* Header with Edit Toggle Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'rgba(232,122,32,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-orange)',
              }}
            >
              <FaEdit size={18} />
            </motion.div>
            <div>
              <h5
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                المعلومات الشخصية
              </h5>
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                {isEditing ? 'قم بتحديث بياناتك ثم اضغط حفظ' : 'عرض المعلومات الشخصية الخاصة بحسابك'}
              </span>
            </div>
          </div>

          {!isEditing && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--primary-orange)',
                  color: 'var(--primary-orange)',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-orange)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(232,122,32,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--primary-orange)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <FaEdit size={13} />
                تعديل البيانات
              </Button>
            </motion.div>
          )}
        </div>

        {/* Form / Content View */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3">
            {/* Name */}
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <FaUser size={12} color="var(--primary-orange)" />
                  الاسم الكامل {isEditing && <span style={{ color: 'var(--error)' }}>*</span>}
                </Form.Label>
                {isEditing ? (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      {...register('name')}
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      style={inputStyle(!!errors.name)}
                    />
                    {errors.name && <div style={errorStyle}>{errors.name.message}</div>}
                  </motion.div>
                ) : (
                  <div
                    style={{
                      ...inputStyle(false),
                      backgroundColor: 'var(--bg-input)',
                      opacity: 0.9,
                      cursor: 'default',
                    }}
                  >
                    {watch('name') || 'غير محدد'}
                  </div>
                )}
              </Form.Group>
            </Col>

            {/* WhatsApp */}
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <FaWhatsapp size={12} color="#25D366" />
                  رقم واتساب {isEditing && <span style={{ color: 'var(--error)' }}>*</span>}
                </Form.Label>
                {isEditing ? (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <Form.Control
                      {...register('whatsapp')}
                      type="tel"
                      placeholder="+970xxxxxxxxx"
                      dir="rtl"
                      style={{
                        ...inputStyle(!!errors.whatsapp),
                        textAlign: 'right',
                        direction: 'rtl',
                      }}
                    />
                    {errors.whatsapp && <div style={errorStyle}>{errors.whatsapp.message}</div>}
                  </motion.div>
                ) : (
                  <div
                    dir="rtl"
                    style={{
                      ...inputStyle(false),
                      backgroundColor: 'var(--bg-input)',
                      opacity: 0.9,
                      textAlign: 'right',
                      direction: 'rtl',
                      cursor: 'default',
                    }}
                  >
                    {watch('whatsapp') || 'غير محدد'}
                  </div>
                )}
              </Form.Group>
            </Col>

            {/* Governorate */}
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <FaMapMarkerAlt size={12} color="var(--primary-orange)" />
                  المحافظة {isEditing && <span style={{ color: 'var(--error)' }}>*</span>}
                </Form.Label>
                {isEditing ? (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <Form.Select
                      {...register('governorate_id')}
                      style={{ ...inputStyle(!!errors.governorate_id), cursor: 'pointer' }}
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map((gov) => (
                        <option key={gov.id} value={gov.id.toString()}>
                          {gov.name}
                        </option>
                      ))}
                    </Form.Select>
                    {errors.governorate_id && <div style={errorStyle}>{errors.governorate_id.message}</div>}
                  </motion.div>
                ) : (
                  <div
                    style={{
                      ...inputStyle(false),
                      backgroundColor: 'var(--bg-input)',
                      opacity: 0.9,
                      cursor: 'default',
                    }}
                  >
                    {currentGovernorateName}
                  </div>
                )}
              </Form.Group>
            </Col>

            {/* City */}
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={labelStyle}>
                  <FaCity size={12} color="var(--primary-orange)" />
                  المدينة / الحي {isEditing && <span style={{ color: 'var(--error)' }}>*</span>}
                </Form.Label>
                {isEditing ? (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    <Form.Select
                      {...register('city_id')}
                      disabled={!selectedGovernorate}
                      style={{
                        ...inputStyle(!!errors.city_id),
                        cursor: selectedGovernorate ? 'pointer' : 'not-allowed',
                        opacity: selectedGovernorate ? 1 : 0.6,
                      }}
                    >
                      <option value="">
                        {!selectedGovernorate ? 'اختر المحافظة أولاً' : 'اختر المدينة / الحي'}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id.toString()}>
                          {city.name}
                        </option>
                      ))}
                    </Form.Select>
                    {errors.city_id && <div style={errorStyle}>{errors.city_id.message}</div>}
                  </motion.div>
                ) : (
                  <div
                    style={{
                      ...inputStyle(false),
                      backgroundColor: 'var(--bg-input)',
                      opacity: 0.9,
                      cursor: 'default',
                    }}
                  >
                    {currentCityName}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Info Note */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '12px 16px',
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(23,162,184,0.05)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
            }}
          >
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.6,
              }}
            >
              لا يمكن تغيير البريد الإلكتروني لأسباب أمنية. إذا كنت بحاجة لتغييره، يرجى التواصل مع الدعم.
            </span>
          </div>

          {/* Action Buttons (Animated entry/exit when editing) */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} style={{ flex: '1 1 auto', minWidth: '160px' }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: 'var(--primary-orange)',
                        borderColor: 'var(--primary-orange)',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        padding: '12px 28px',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                        width: '100%',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            style={{ width: '1rem', height: '1rem' }}
                          />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <FaSave size={14} />
                          حفظ التعديلات
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-muted)',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <FaTimes size={12} />
                      إلغاء
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Form>
      </Card>
    </motion.div>
  );
};

export default EditProfileForm;