import { Card, Badge } from 'react-bootstrap';
import { 
  FaEnvelope, FaWhatsapp, FaMapMarkerAlt, 
  FaUserCheck, FaCalendarAlt, FaShieldAlt 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import ProfileImageUploader from './ProfileImageUploader';
import { formatProfileDate } from '../../../utils/profileHelpers';
import type { User } from '../../../types';

interface ProfileHeaderProps {
  user: User;
  onImageUpdate?: (newImagePath: string) => void;
}

const ProfileHeader = ({ user, onImageUpdate }: ProfileHeaderProps) => {
  const { isDark } = useTheme();
  const isVerified = user.is_verified;

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
          borderRadius: '20px',
          padding: '2rem 1.5rem',
          boxShadow: '0 8px 32px var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'right',
        }}
      >
        {/* Decorative Gradient Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: isVerified
              ? 'linear-gradient(135deg, rgba(40,167,69,0.15) 0%, rgba(40,167,69,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(232,122,32,0.15) 0%, rgba(232,122,32,0.05) 100%)',
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Profile Image Uploader */}
          <ProfileImageUploader
            currentImage={user.profile_image || null}
            userName={user.name}
            onImageUpdate={onImageUpdate}
          />

          {/* User Name + Verification Badge */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '6px',
              }}
            >
              <h2
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.3rem, 2vw, 1.6rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                }}
              >
                {user.name}
              </h2>

              {isVerified && (
                <Badge
                  style={{
                    backgroundColor: '#28A745',
                    color: '#FFFFFF',
                    fontSize: '0.6rem',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(40,167,69,0.3)',
                  }}
                >
                  <FaUserCheck size={10} /> موثق
                </Badge>
              )}
            </div>

            {/* Role Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(139,90,43,0.06)',
                color: 'var(--text-muted)',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
              }}
            >
              <FaShieldAlt size={11} color="var(--primary-orange)" />
              {user.role === 'admin' ? 'مدير النظام' : 'عضو في المجتمع'}
            </div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              width: '60px',
              height: '3px',
              backgroundColor: 'var(--primary-orange)',
              borderRadius: '2px',
              opacity: 0.5,
            }}
          />

          {/* User Info Grid - Shown in 1 line on larger screens */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              width: '100%',
              marginTop: '4px',
            }}
          >
            {/* Email */}
            <InfoItem
              icon={<FaEnvelope size={14} />}
              label="البريد الإلكتروني"
              value={user.email}
              isDark={isDark}
              dir="ltr"
              index={0}
            />

            {/* WhatsApp */}
            {user.whatsapp && (
              <InfoItem
                icon={<FaWhatsapp size={14} />}
                label="واتساب"
                value={user.whatsapp}
                isDark={isDark}
                dir="ltr"
                iconColor="#25D366"
                index={1}
              />
            )}

            {/* Region */}
            {user.governorate && (
              <InfoItem
                icon={<FaMapMarkerAlt size={14} />}
                label="المنطقة"
                value={
                  user.city
                    ? `${user.governorate.name} - ${user.city.name}`
                    : user.governorate.name
                }
                isDark={isDark}
                iconColor="var(--primary-orange)"
                index={2}
              />
            )}

            {/* Member Since */}
            <InfoItem
              icon={<FaCalendarAlt size={14} />}
              label="عضو منذ"
              value={formatProfileDate(user.created_at)}
              isDark={isDark}
              iconColor="#17A2B8"
              index={3}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// ✅ Info Item Component with entry animation
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDark: boolean;
  dir?: 'ltr' | 'rtl';
  iconColor?: string;
  index: number;
}

const InfoItem = ({ icon, label, value, isDark, dir = 'rtl', iconColor, index }: InfoItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(139,90,43,0.03)',
      padding: '10px 14px',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      transition: 'all 0.2s ease',
      textAlign: 'right',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--primary-orange)';
      e.currentTarget.style.backgroundColor = isDark
        ? 'rgba(232,122,32,0.05)'
        : 'rgba(232,122,32,0.04)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--border-color)';
      e.currentTarget.style.backgroundColor = isDark
        ? 'rgba(255,255,255,0.03)'
        : 'rgba(139,90,43,0.03)';
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,122,32,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor || 'var(--primary-orange)',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          fontFamily: 'Cairo, sans-serif',
          marginBottom: '2px',
          textAlign: 'right',
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          fontFamily: dir === 'ltr' ? 'system-ui, sans-serif' : 'Cairo, sans-serif',
          fontWeight: 600,
          direction: dir,
          textAlign: dir === 'ltr' ? 'right' : 'right',
          unicodeBidi: dir === 'ltr' ? 'plaintext' : 'normal',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </div>
    </div>
  </motion.div>
);

export default ProfileHeader;