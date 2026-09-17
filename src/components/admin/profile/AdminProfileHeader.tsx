import { Card } from 'react-bootstrap';
import { 
  FaEnvelope, FaCalendarAlt, FaShieldAlt, FaClock 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import AdminProfileImageUploader from './AdminProfileImageUploader';
import { formatProfileDate } from '../../../utils/profileHelpers';
import type { AdminProfile } from '../../../types';

interface AdminProfileHeaderProps {
  admin: AdminProfile;
  onImageUpdate?: (newImagePath: string) => void;
}

const AdminProfileHeader = ({
  admin,
  onImageUpdate,
}: AdminProfileHeaderProps) => {
  const { isDark } = useTheme();

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
            background: 'linear-gradient(135deg, rgba(232,122,32,0.15) 0%, rgba(232,122,32,0.05) 100%)',
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
          <AdminProfileImageUploader
            currentImage={admin.profile_image || null}
            userName={admin.name}
            onImageUpdate={onImageUpdate}
          />

          {/* User Name + Role Badge */}
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
                {admin.name}
              </h2>
            </div>

            {/* Role Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                color: '#FFFFFF',
                padding: '5px 16px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(232,122,32,0.3)',
              }}
            >
              <FaShieldAlt size={11} />
              مدير النظام
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

          {/* Admin Info Grid */}
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
              value={admin.email}
              isDark={isDark}
              dir="ltr"
              index={0}
            />

            {/* Joined Date */}
            <InfoItem
              icon={<FaCalendarAlt size={14} />}
              label="عضو منذ"
              value={formatProfileDate(admin.created_at)}
              isDark={isDark}
              iconColor="#17A2B8"
              index={1}
            />

            {/* Last Login */}
            {admin.last_login_at && (
              <InfoItem
                icon={<FaClock size={14} />}
                label="آخر دخول"
                value={formatProfileDate(admin.last_login_at)}
                isDark={isDark}
                iconColor="#28A745"
                index={2}
              />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// ✅ Info Item Component
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

export default AdminProfileHeader;