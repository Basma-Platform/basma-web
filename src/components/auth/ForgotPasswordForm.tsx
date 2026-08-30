import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  successMessage?: string | null;
  errorMessage?: string | null;
}

const ForgotPasswordForm = ({
  onSubmit,
  isLoading = false,
  successMessage = null,
  errorMessage = null,
}: ForgotPasswordFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await onSubmit(data);
      setIsSubmitted(true);
    } catch (error) {
      // Error handled by parent
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ direction: 'rtl' }}
    >
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'rgba(40,167,69,0.08)',
            color: 'var(--success)',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.9rem',
            fontFamily: 'Cairo, sans-serif',
            border: '1px solid rgba(40,167,69,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <FaCheckCircle size={20} color="var(--success)" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'rgba(220,53,69,0.08)',
            color: 'var(--error)',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.9rem',
            fontFamily: 'Cairo, sans-serif',
            border: '1px solid rgba(220,53,69,0.15)',
          }}
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Email */}
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
          البريد الإلكتروني *
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          disabled={isSubmitted}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: `1px solid ${errors.email ? 'var(--error)' : 'var(--input-border)'}`,
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            outline: 'none',
            opacity: isSubmitted ? 0.6 : 1,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-orange)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.email ? 'var(--error)' : 'var(--input-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {errors.email && (
          <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting || isLoading || isSubmitted}
        whileHover={!isSubmitting && !isLoading && !isSubmitted ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting && !isLoading && !isSubmitted ? { scale: 0.98 } : {}}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          background: isSubmitting || isLoading || isSubmitted
            ? 'var(--primary-brown-light)'
            : 'var(--primary-orange)',
          color: '#FFFFFF',
          fontSize: '1rem',
          fontWeight: 700,
          fontFamily: 'Cairo, sans-serif',
          cursor: isSubmitting || isLoading || isSubmitted ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isSubmitting || isLoading || isSubmitted ? 'none' : '0 4px 16px rgba(232,122,32,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: isSubmitting || isLoading || isSubmitted ? 0.7 : 1,
        }}
      >
        {isSubmitting || isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm" style={{ width: '1.2rem', height: '1.2rem' }} />
            جاري الإرسال...
          </>
        ) : isSubmitted ? (
          <>
            <FaCheckCircle size={18} />
            تم الإرسال
          </>
        ) : (
          <>
            <FaArrowRight size={18} />
            إرسال رابط إعادة التعيين
          </>
        )}
      </motion.button>

      {/* Info Text */}
      {!isSubmitted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
            marginTop: '1rem',
            opacity: 0.6,
          }}
        >
          ستصلك رسالة بريد إلكتروني تحتوي على رابط لإعادة تعيين كلمة المرور
        </motion.p>
      )}
    </motion.form>
  );
};

export default ForgotPasswordForm;