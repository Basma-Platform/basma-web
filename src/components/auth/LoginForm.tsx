import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  remember: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const LoginForm = ({ onSubmit, isLoading = false, error = null }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      style={{ direction: 'rtl' }}
    >
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
          كلمة المرور *
        </label>
        <div style={{ position: 'relative' }}>
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="أدخل كلمة المرور"
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

      {/* ✅ التعديل الوحيد: "تذكرني" و "نسيت كلمة المرور؟" جنباً إلى جنب */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontFamily: 'Cairo, sans-serif',
            cursor: 'pointer',
          }}
        >
          <input
            {...register('remember')}
            type="checkbox"
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--primary-orange)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          تذكرني
        </label>

        <Link
          to="/forgot-password"
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: 'Cairo, sans-serif',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary-orange)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'rgba(220,53,69,0.08)',
            color: 'var(--error)',
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
            border: '1px solid rgba(220,53,69,0.15)',
          }}
        >
          {error}
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
            جاري تسجيل الدخول...
          </>
        ) : (
          'تسجيل الدخول'
        )}
      </motion.button>
    </motion.form>
  );
};

export default LoginForm;