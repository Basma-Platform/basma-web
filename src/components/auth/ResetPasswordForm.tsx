import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const resetPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  password_confirmation: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'كلمة المرور غير متطابقة',
  path: ['password_confirmation'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  email?: string;
}

const ResetPasswordForm = ({
  onSubmit,
  isLoading = false,
  email = '',
}: ResetPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      password: '',
      password_confirmation: '',
    },
  });

  const passwordValue = watch('password') || '';

  // Password strength
  const getPasswordStrength = () => {
    let strength = 0;
    if (passwordValue.length >= 8) strength += 25;
    if (/[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue)) strength += 25;
    if (/\d/.test(passwordValue)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(passwordValue)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength();

  const getStrengthLabel = () => {
    if (strength < 25) return { label: 'ضعيفة', color: 'var(--error)' };
    if (strength < 50) return { label: 'متوسطة', color: 'var(--warning)' };
    if (strength < 75) return { label: 'جيدة', color: 'var(--info)' };
    return { label: 'قوية', color: 'var(--success)' };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      style={{ direction: 'rtl' }}
    >
      {/* Email Field - Disabled */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '4px',
          }}
        >
          <FaEnvelope size={14} color="var(--primary-orange)" />
          البريد الإلكتروني
        </label>
        <input
          {...register('email')}
          type="email"
          disabled
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid var(--input-border)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.95rem',
            outline: 'none',
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '4px',
          }}
        >
          <FaLock size={14} color="var(--primary-orange)" />
          كلمة المرور الجديدة *
        </label>
        <div style={{ position: 'relative' }}>
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingLeft: '40px',
              borderRadius: '10px',
              border: `1px solid ${errors.password ? 'var(--error)' : 'var(--input-border)'}`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.password ? 'var(--error)' : 'var(--input-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'Cairo, sans-serif',
            marginBottom: '4px',
          }}
        >
          <FaLock size={14} color="var(--primary-orange)" />
          تأكيد كلمة المرور *
        </label>
        <div style={{ position: 'relative' }}>
          <input
            {...register('password_confirmation')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="********"
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingLeft: '40px',
              borderRadius: '10px',
              border: `1px solid ${errors.password_confirmation ? 'var(--error)' : 'var(--input-border)'}`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.password_confirmation ? 'var(--error)' : 'var(--input-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        {errors.password_confirmation && (
          <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      {/* Password Strength */}
      {passwordValue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginBottom: '1.25rem' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3px',
            }}
          >
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              قوة كلمة المرور
            </div>
            <div
              style={{
                color: strengthInfo.color,
                fontSize: '0.7rem',
                fontWeight: 600,
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {strengthInfo.label}
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(139,90,43,0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${strength}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                backgroundColor: strengthInfo.color,
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting || isLoading}
        whileHover={!isSubmitting && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting && !isLoading ? { scale: 0.98 } : {}}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          background: isSubmitting || isLoading
            ? 'var(--primary-brown-light)'
            : 'var(--primary-orange)',
          color: 'var(--text-light)',
          fontSize: '1rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
          cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isSubmitting || isLoading ? 'none' : '0 4px 16px rgba(232,122,32,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: isSubmitting || isLoading ? 0.7 : 1,
        }}
      >
        {isSubmitting || isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm" style={{ width: '1.2rem', height: '1.2rem' }} />
            جاري التحديث...
          </>
        ) : (
          <>
            <FaCheckCircle size={18} />
            تحديث كلمة المرور
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default ResetPasswordForm;