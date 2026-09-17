import { useState } from 'react';
import { Card, Button, Form, ProgressBar } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import type { UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaEye, FaEyeSlash, FaShieldAlt, 
  FaKey, FaCheckCircle, FaChevronDown, FaLock 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../../../hooks/useProfile';
import { useTheme } from '../../../context/ThemeContext';

// ============================================
// Zod Schema
// ============================================
const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, 'كلمة المرور الحالية مطلوبة'),
    password: z
      .string()
      .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
      .max(255, 'كلمة المرور طويلة جداً'),
    password_confirmation: z
      .string()
      .min(8, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'كلمة المرور غير متطابقة',
    path: ['password_confirmation'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ============================================
// Password Input Component (Extracted Outside)
// ============================================
interface PasswordInputProps {
  name: keyof ChangePasswordFormData;
  register: UseFormRegister<ChangePasswordFormData>;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
  error?: string;
}

const PasswordInput = ({
  name,
  register,
  show,
  onToggleShow,
  placeholder,
  error,
}: PasswordInputProps) => (
  <div style={{ position: 'relative' }}>
    <input
      {...register(name)}
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '12px 16px',
        paddingLeft: '44px',
        borderRadius: '12px',
        border: `1px solid ${error ? 'var(--error)' : 'var(--input-border)'}`,
        backgroundColor: 'var(--bg-input)',
        color: 'var(--text-primary)',
        fontFamily: 'Cairo, sans-serif',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        outline: 'none',
        direction: 'rtl',
        textAlign: 'right',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-orange)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error
          ? 'var(--error)'
          : 'var(--input-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
    <button
      type="button"
      onClick={onToggleShow}
      style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
      }}
      aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
    >
      {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
    </button>
  </div>
);

// ============================================
// Main Component
// ============================================
const ChangePasswordForm = () => {
  const { isDark } = useTheme();
  const { changePassword } = useProfile();

  // Collapsible toggle state
  const [isOpen, setIsOpen] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ============================================
  // React Hook Form
  // ============================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const passwordValue = watch('password') || '';

  // ============================================
  // Password Strength
  // ============================================
  const calculateStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const strength = calculateStrength(passwordValue);

  const getStrengthInfo = () => {
    if (strength < 25) return { label: 'ضعيفة', color: '#DC3545' };
    if (strength < 50) return { label: 'متوسطة', color: '#FFC107' };
    if (strength < 75) return { label: 'جيدة', color: '#17A2B8' };
    return { label: 'قوية', color: '#28A745' };
  };

  const strengthInfo = getStrengthInfo();

  // ============================================
  // Submit Handler
  // ============================================
  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  // ============================================
  // Styles
  // ============================================
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
      transition={{ duration: 0.4, delay: 0.1 }}
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
        {/* Collapsible Header Button */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none',
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
              <FaShieldAlt size={18} />
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
                تغيير كلمة المرور
              </h5>
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                حافظ على أمان حسابك بتغيير كلمة المرور دورياً
              </span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <FaChevronDown size={12} />
          </motion.div>
        </div>

        {/* Collapsible Body */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                }}
              >
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <div className="d-flex flex-column gap-3">
                    {/* Current Password */}
                    <Form.Group>
                      <Form.Label style={labelStyle}>
                        <FaKey size={12} color="var(--primary-orange)" />
                        كلمة المرور الحالية <span style={{ color: 'var(--error)' }}>*</span>
                      </Form.Label>
                      <PasswordInput
                        name="current_password"
                        register={register}
                        show={showCurrentPassword}
                        onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
                        placeholder="أدخل كلمة المرور الحالية"
                        error={errors.current_password?.message}
                      />
                      {errors.current_password && (
                        <div style={errorStyle}>{errors.current_password.message}</div>
                      )}
                    </Form.Group>

                    {/* New Password */}
                    <Form.Group>
                      <Form.Label style={labelStyle}>
                        <FaLock size={12} color="var(--primary-orange)" />
                        كلمة المرور الجديدة <span style={{ color: 'var(--error)' }}>*</span>
                      </Form.Label>
                      <PasswordInput
                        name="password"
                        register={register}
                        show={showNewPassword}
                        onToggleShow={() => setShowNewPassword(!showNewPassword)}
                        placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
                        error={errors.password?.message}
                      />
                      {errors.password && (
                        <div style={errorStyle}>{errors.password.message}</div>
                      )}

                      {/* Password Strength */}
                      {passwordValue.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{ marginTop: '8px' }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '4px',
                            }}
                          >
                            <span
                              style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.7rem',
                                fontFamily: 'Cairo, sans-serif',
                              }}
                            >
                              قوة كلمة المرور
                            </span>
                            <span
                              style={{
                                color: strengthInfo.color,
                                fontSize: '0.7rem',
                                fontFamily: 'Cairo, sans-serif',
                                fontWeight: 700,
                              }}
                            >
                              {strengthInfo.label}
                            </span>
                          </div>
                          <ProgressBar
                            now={strength}
                            style={{
                              height: '6px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-input)',
                            }}
                          >
                            <div
                              style={{
                                width: `${strength}%`,
                                height: '100%',
                                borderRadius: '6px',
                                backgroundColor: strengthInfo.color,
                                transition: 'all 0.3s ease',
                              }}
                            />
                          </ProgressBar>

                          {/* Requirements */}
                          <div
                            style={{
                              display: 'flex',
                              gap: '12px',
                              marginTop: '8px',
                              flexWrap: 'wrap',
                              fontSize: '0.65rem',
                              color: 'var(--text-muted)',
                              fontFamily: 'Cairo, sans-serif',
                            }}
                          >
                            <span>✓ 8 أحرف على الأقل</span>
                            <span>✓ حروف كبيرة وصغيرة</span>
                            <span>✓ أرقام</span>
                            <span>✓ رموز خاصة</span>
                          </div>
                        </motion.div>
                      )}
                    </Form.Group>

                    {/* Confirm New Password */}
                    <Form.Group>
                      <Form.Label style={labelStyle}>
                        <FaCheckCircle size={12} color="var(--primary-orange)" />
                        تأكيد كلمة المرور الجديدة <span style={{ color: 'var(--error)' }}>*</span>
                      </Form.Label>
                      <PasswordInput
                        name="password_confirmation"
                        register={register}
                        show={showConfirmPassword}
                        onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        error={errors.password_confirmation?.message}
                      />
                      {errors.password_confirmation && (
                        <div style={errorStyle}>
                          {errors.password_confirmation.message}
                        </div>
                      )}
                    </Form.Group>
                  </div>

                  {/* Security Note */}
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '12px 16px',
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(255,193,7,0.06)',
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
                      تأكد من استخدام كلمة مرور قوية لا تستخدمها في مواقع أخرى.
                    </span>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      marginTop: '1.5rem',
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} style={{ flex: '1 1 auto', minWidth: '160px' }}>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        style={{
                          backgroundColor: isDirty ? 'var(--primary-orange)' : 'var(--primary-brown-light)',
                          borderColor: isDirty ? 'var(--primary-orange)' : 'var(--primary-brown-light)',
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
                          cursor: isSubmitting || !isDirty ? 'not-allowed' : 'pointer',
                          opacity: isSubmitting || !isDirty ? 0.7 : 1,
                          boxShadow: isDirty && !isSubmitting
                            ? '0 4px 16px rgba(232,122,32,0.3)'
                            : 'none',
                          width: '100%',
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              style={{ width: '1rem', height: '1rem' }}
                            />
                            جاري التحديث...
                          </>
                        ) : (
                          <>
                            <FaShieldAlt size={14} />
                            تحديث كلمة المرور
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => {
                          reset();
                          setIsOpen(false);
                        }}
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
                        إلغاء
                      </Button>
                    </motion.div>
                  </div>
                </Form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default ChangePasswordForm;