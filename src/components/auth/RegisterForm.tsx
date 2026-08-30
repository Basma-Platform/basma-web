import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaWhatsapp, 
  FaMapMarkerAlt, FaCity, FaCheckCircle, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { regionService } from '../../services/regionService';
import type { Governorate, City } from '../../types';

const registerSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(100, 'الاسم طويل جداً'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  password_confirmation: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
  countryCode: z.string().min(1, 'الرجاء اختيار رمز الدولة'),
  whatsappNumber: z.string()
    .min(9, 'رقم واتساب يجب أن يكون 9 أرقام')
    .max(9, 'رقم واتساب يجب أن يكون 9 أرقام')
    .regex(/^[0-9]{9}$/, 'رقم واتساب يجب أن يكون 9 أرقام فقط'),
  governorate_id: z.string().min(1, 'الرجاء اختيار المحافظة'),
  city_id: z.string().min(1, 'الرجاء اختيار المدينة'),
  terms_accepted: z.boolean().refine(val => val === true, 'يجب الموافقة على الشروط'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'كلمة المرور غير متطابقة',
  path: ['password_confirmation'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
}

const RegisterForm = ({ onSubmit, isLoading = false }: RegisterFormProps) => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      countryCode: '+970',
      whatsappNumber: '',
      governorate_id: '',
      city_id: '',
      terms_accepted: false,
    },
  });

  const governorateId = watch('governorate_id');
  const passwordValue = watch('password') || '';

  // Password strength
  useEffect(() => {
    let strength = 0;
    if (passwordValue.length >= 8) strength += 25;
    if (/[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue)) strength += 25;
    if (/\d/.test(passwordValue)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(passwordValue)) strength += 25;
    setPasswordStrength(strength);
  }, [passwordValue]);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const data = await regionService.getGovernorates();
        setGovernorates(data);
      } catch (error) {
        console.error('Error fetching governorates:', error);
      }
    };
    fetchGovernorates();
  }, []);

  useEffect(() => {
    if (governorateId) {
      const fetchCities = async () => {
        try {
          const data = await regionService.getCities(Number(governorateId));
          setCities(data);
          setValue('city_id', '');
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [governorateId, setValue]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      style={{ direction: 'rtl' }}
    >
      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
        
        {/* Name - Full Width */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
            <FaUser size={14} color="var(--primary-orange)" /> الاسم الكامل <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="أدخل اسمك الكامل"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid ${errors.name ? 'var(--error)' : 'var(--input-border)'}`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-orange)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.name ? 'var(--error)' : 'var(--input-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.name && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>{errors.name.message}</p>}
        </div>

        {/* Email - Full Width */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
            <FaEnvelope size={14} color="var(--primary-orange)" /> البريد الإلكتروني <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid ${errors.email ? 'var(--error)' : 'var(--input-border)'}`,
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.9rem',
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
          {errors.email && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
            <FaLock size={14} color="var(--primary-orange)" /> كلمة المرور <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              style={{
                width: '100%',
                padding: '10px 14px',
                paddingLeft: '40px',
                borderRadius: '10px',
                border: `1px solid ${errors.password ? 'var(--error)' : 'var(--input-border)'}`,
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
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
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.password && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
            <FaLock size={14} color="var(--primary-orange)" /> تأكيد كلمة المرور <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password_confirmation')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="********"
              style={{
                width: '100%',
                padding: '10px 14px',
                paddingLeft: '40px',
                borderRadius: '10px',
                border: `1px solid ${errors.password_confirmation ? 'var(--error)' : 'var(--input-border)'}`,
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
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
              {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.password_confirmation && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>{errors.password_confirmation.message}</p>}
        </div>

        {/* Password Strength */}
        {passwordValue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'Cairo, sans-serif' }}>قوة كلمة المرور</div>
              <div style={{ color: passwordStrength < 25 ? 'var(--error)' : passwordStrength < 50 ? 'var(--warning)' : passwordStrength < 75 ? 'var(--info)' : 'var(--success)', fontSize: '0.7rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif' }}>
                {passwordStrength < 25 ? 'ضعيفة' : passwordStrength < 50 ? 'متوسطة' : passwordStrength < 75 ? 'جيدة' : 'قوية'}
              </div>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(139,90,43,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${passwordStrength}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  height: '100%',
                  backgroundColor: passwordStrength < 25 ? 'var(--error)' : passwordStrength < 50 ? 'var(--warning)' : passwordStrength < 75 ? 'var(--info)' : 'var(--success)',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif' }}>
              <span>✓ 8 أحرف على الأقل</span>
              <span>✓ حروف كبيرة وصغيرة</span>
              <span>✓ أرقام</span>
              <span>✓ رموز خاصة</span>
            </div>
          </motion.div>
        )}

        {/* WhatsApp - Full Width */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
            <FaWhatsapp size={14} color="#25D366" /> رقم واتساب <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'row-reverse' }}>
            <div style={{ position: 'relative', minWidth: '90px' }}>
              <select
                {...register('countryCode')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  borderRadius: '10px',
                  border: `1px solid ${errors.countryCode ? 'var(--error)' : 'var(--input-border)'}`,
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  direction: 'ltr',
                  textAlign: 'center',
                  textAlignLast: 'center',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-orange)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.countryCode ? 'var(--error)' : 'var(--input-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* ✅ استخدام unicode-bidi لحل مشكلة + */}
                <option value="+970" style={{ unicodeBidi: 'plaintext', direction: 'ltr' }}>+970</option>
                <option value="+972" style={{ unicodeBidi: 'plaintext', direction: 'ltr' }}>+972</option>
              </select>
            </div>
            <input
              {...register('whatsappNumber')}
              type="tel"
              placeholder="5XXXXXXXX"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: `1px solid ${errors.whatsappNumber ? 'var(--error)' : 'var(--input-border)'}`,
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                direction: 'ltr',
                textAlign: 'left',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.whatsappNumber ? 'var(--error)' : 'var(--input-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {(errors.countryCode || errors.whatsappNumber) && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>{errors.countryCode?.message || errors.whatsappNumber?.message}</p>}
        </div>

        {/* Governorate */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
            <FaMapMarkerAlt size={14} color="var(--primary-orange)" /> المحافظة <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              {...register('governorate_id')}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: `1px solid ${errors.governorate_id ? 'var(--error)' : 'var(--input-border)'}`,
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-orange)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.governorate_id ? 'var(--error)' : 'var(--input-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">اختر المحافظة</option>
              {governorates.map((gov) => <option key={gov.id} value={gov.id}>{gov.name}</option>)}
            </select>
          </div>
          {errors.governorate_id && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>{errors.governorate_id.message}</p>}
        </div>

        {/* City */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
            <FaCity size={14} color="var(--primary-orange)" /> المدينة / الحي <span style={{ color: 'var(--error)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              {...register('city_id')}
              disabled={!governorateId}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: `1px solid ${errors.city_id ? 'var(--error)' : 'var(--input-border)'}`,
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontFamily: 'Cairo, sans-serif',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: governorateId ? 'pointer' : 'not-allowed',
                opacity: governorateId ? 1 : 0.6,
                transition: 'all 0.3s ease',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
              onFocus={(e) => {
                if (governorateId) {
                  e.currentTarget.style.borderColor = 'var(--primary-orange)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(232,122,32,0.1)';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.city_id ? 'var(--error)' : 'var(--input-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <option value="">
                {!governorateId ? 'اختر المحافظة أولاً' : 'اختر المدينة'}
              </option>
              {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
            </select>
          </div>
          {errors.city_id && <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '3px', fontFamily: 'Cairo, sans-serif' }}>{errors.city_id.message}</p>}
        </div>

        {/* Terms - Full Width */}
        <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
          <div
            style={{
              padding: '1rem 1.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              background: 'rgba(232, 122, 32, 0.04)',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(232, 122, 32, 0.07)';
              e.currentTarget.style.borderColor = 'rgba(232, 122, 32, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(232, 122, 32, 0.04)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontFamily: 'Cairo, sans-serif',
                cursor: 'pointer',
              }}
            >
              <input
                {...register('terms_accepted')}
                type="checkbox"
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--primary-orange)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span>
                أوافق على{' '}
                <a
                  href="/terms"
                  style={{
                    color: 'var(--primary-orange)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  شروط الخدمة
                </a>
                {' و '}
                <a
                  href="/privacy-policy"
                  style={{
                    color: 'var(--primary-orange)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  سياسة الخصوصية
                </a>
              </span>
            </label>
            {errors.terms_accepted && (
              <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '6px', fontFamily: 'Cairo, sans-serif' }}>
                {errors.terms_accepted.message}
              </p>
            )}
          </div>
        </div>
      </div>

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
          background: isSubmitting || isLoading ? 'var(--primary-brown-light)' : 'var(--primary-orange)',
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
          <><span className="spinner-border spinner-border-sm" style={{ width: '1.2rem', height: '1.2rem' }} /> جاري التسجيل...</>
        ) : (
          <><FaCheckCircle size={18} /> إنشاء حساب</>
        )}
      </motion.button>
    </motion.form>
  );
};

export default RegisterForm;