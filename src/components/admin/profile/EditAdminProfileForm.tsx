import { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUser, FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import type { AdminProfile } from '../../../types';

// ============================================
// Zod Schema
// ============================================
const editAdminProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
    .max(100, 'الاسم يجب أن لا يتجاوز 100 حرف'),
});

type EditAdminProfileFormData = z.infer<typeof editAdminProfileSchema>;

// ============================================
// Props
// ============================================
interface EditAdminProfileFormProps {
  admin: AdminProfile;
  onSubmit: (data: EditAdminProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

// ============================================
// Component
// ============================================
const EditAdminProfileForm = ({
  admin,
  onSubmit,
  isLoading = false,
}: EditAdminProfileFormProps) => {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  // ============================================
  // React Hook Form
  // ============================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditAdminProfileFormData>({
    resolver: zodResolver(editAdminProfileSchema),
    defaultValues: {
      name: admin.name || '',
    },
  });

  // ============================================
  // Reset Form when Admin Data Changes
  // ============================================
  useEffect(() => {
    reset({
      name: admin.name || '',
    });
  }, [admin.name, reset]);

  // ============================================
  // Submit Handler
  // ============================================
  const handleFormSubmit = async (data: EditAdminProfileFormData) => {
    try {
      await onSubmit({ name: data.name.trim() });
      setIsEditing(false);
    } catch {
      // Error handled in parent
    }
  };

  // ============================================
  // Cancel Handler
  // ============================================
  const handleCancel = () => {
    reset({ name: admin.name || '' });
    setIsEditing(false);
  };

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
      style={{ marginTop: '1.5rem' }}
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

        {/* Form */}
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Name Field */}
          <Form.Group>
            <Form.Label style={labelStyle}>
              <FaUser size={12} color="var(--primary-orange)" />
              الاسم الكامل {isEditing && <span style={{ color: 'var(--error)' }}>*</span>}
            </Form.Label>

            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Form.Control
                  {...register('name')}
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  disabled={isSubmitting || isLoading}
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

          {/* Action Buttons */}
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
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ flex: '1 1 auto', minWidth: '160px' }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || isLoading}
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
                        cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting || isLoading ? 0.7 : 1,
                        boxShadow: '0 4px 16px rgba(232,122,32,0.3)',
                        width: '100%',
                      }}
                    >
                      {isSubmitting || isLoading ? (
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

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleCancel}
                      disabled={isSubmitting || isLoading}
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

export default EditAdminProfileForm;