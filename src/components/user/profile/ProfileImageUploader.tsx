import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaSpinner, FaUser } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { useProfile } from '../../../hooks/useProfile';
import { getProfileImageUrl, getUserInitials, validateImageFile } from '../../../utils/profileHelpers';
import { toast } from 'react-toastify';

interface ProfileImageUploaderProps {
  currentImage: string | null;
  userName: string;
  onImageUpdate?: (newImagePath: string) => void;
}

const ProfileImageUploader = ({
  currentImage,
  userName,
  onImageUpdate,
}: ProfileImageUploaderProps) => {
  const { isDark } = useTheme();
  const { uploadImage } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ Get current image URL (local preview or server image)
  const displayImage = imagePreview || getProfileImageUrl(currentImage);
  const userInitials = getUserInitials(userName);

  // ✅ Handle image click - open file browser
  const handleImageClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  // ✅ Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      e.target.value = '';
      return;
    }

    // ✅ Show local preview immediately (better UX)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // ✅ Upload to server
    try {
      setIsUploading(true);
      const response = await uploadImage(file);
      
      // ✅ Notify parent component
      if (onImageUpdate && response?.profile_image) {
        onImageUpdate(response.profile_image);
      }

      // ✅ Clear preview after success (server image will be shown)
      setTimeout(() => {
        setImagePreview(null);
      }, 500);
    } catch (error) {
      // ✅ On error, remove preview
      setImagePreview(null);
    } finally {
      setIsUploading(false);
      // ✅ Reset file input
      e.target.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }} dir="rtl">
      {/* Image Container */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleImageClick}
        style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          border: '4px solid var(--bg-card)',
          boxShadow: '0 8px 32px var(--shadow-md)',
          backgroundColor: isDark ? '#2a3a5a' : '#e0d8d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Image or Fallback */}
        {displayImage ? (
          <img
            src={displayImage}
            alt={userName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'filter 0.3s ease',
              filter: isHovering && !isUploading ? 'brightness(0.5)' : 'brightness(1)',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span
            style={{
              color: isDark ? '#C49A6C' : '#6B4226',
              fontSize: '2.5rem',
              fontWeight: 700,
              fontFamily: 'Cairo, sans-serif',
              transition: 'opacity 0.3s ease',
              opacity: isHovering && !isUploading ? 0.3 : 1,
            }}
          >
            {userInitials}
          </span>
        )}

        {/* Hover Overlay - Camera Icon */}
        <AnimatePresence>
          {isHovering && !isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backdropFilter: 'blur(3px)',
              }}
            >
              <FaCamera size={26} color="#FFFFFF" />
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                تغيير الصورة
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FaSpinner size={26} color="#FFFFFF" />
              </motion.div>
              <span
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 600,
                }}
              >
                جاري الرفع...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Helper Text */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          fontFamily: 'Cairo, sans-serif',
          textAlign: 'center',
        }}
      >
        <FaUser size={10} />
        JPG أو PNG • الحد الأقصى 2 ميجابايت
      </div>
    </div>
  );
};

export default ProfileImageUploader;