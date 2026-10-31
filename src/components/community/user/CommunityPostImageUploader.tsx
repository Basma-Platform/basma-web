import { useRef, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { CommunityIcons } from '../../../utils/communityIcons';
import { COMMUNITY_THEME, COMMUNITY_MAX_IMAGES_PER_POST } from '../../../utils/communityHelpers';
import { toast } from 'react-toastify';

interface CommunityPostImageUploaderProps {
  newFiles: File[];
  onChangeNewFiles: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (path: string) => void;
}

const MAX_SIZE_MB = 2;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const CommunityPostImageUploader = ({
  newFiles,
  onChangeNewFiles,
  existingImages = [],
  onRemoveExisting,
}: CommunityPostImageUploaderProps) => {
  const { isDark } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(() =>
    newFiles.map((f) => URL.createObjectURL(f))
  );

  const totalCount = newFiles.length + existingImages.length;
  const canAddMore = totalCount < COMMUNITY_MAX_IMAGES_PER_POST;

  // ============================================
  // Handle file selection
  // ============================================
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const accepted: File[] = [];
    for (const file of Array.from(files)) {
      if (totalCount + accepted.length >= COMMUNITY_MAX_IMAGES_PER_POST) {
        toast.warning(
          `يمكنك رفع ${COMMUNITY_MAX_IMAGES_PER_POST} صور كحد أقصى`
        );
        break;
      }

      if (!ACCEPTED.includes(file.type)) {
        toast.error('الصور يجب أن تكون بصيغة JPG أو PNG أو WebP');
        continue;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`حجم الصورة يجب ألا يتجاوز ${MAX_SIZE_MB} ميجابايت`);
        continue;
      }

      accepted.push(file);
    }

    if (accepted.length === 0) return;

    const newList = [...newFiles, ...accepted];
    onChangeNewFiles(newList);
    setPreviews((prev) => [
      ...prev,
      ...accepted.map((f) => URL.createObjectURL(f)),
    ]);
  };

  // ============================================
  // Remove new file
  // ============================================
  const removeNewFile = (index: number) => {
    const newList = newFiles.filter((_, i) => i !== index);
    onChangeNewFiles(newList);

    // revoke URL
    const url = previews[index];
    if (url) URL.revokeObjectURL(url);

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================
  // Remove existing
  // ============================================
  const removeExisting = (path: string) => {
    onRemoveExisting?.(path);
  };

  return (
    <div>
      {/* Drop area / trigger */}
      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            width: '100%',
            padding: '1.5rem 1rem',
            backgroundColor: 'var(--bg-input)',
            border: '2px dashed var(--border-color)',
            borderRadius: '14px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COMMUNITY_THEME.accent;
            e.currentTarget.style.backgroundColor = COMMUNITY_THEME.accentSoft;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.backgroundColor = 'var(--bg-input)';
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: COMMUNITY_THEME.accentSoft,
              color: COMMUNITY_THEME.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CommunityIcons.add size={18} />
          </div>
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            أضف صوراً ({totalCount}/{COMMUNITY_MAX_IMAGES_PER_POST})
          </span>
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            JPG, PNG, WebP — حجم أقصى {MAX_SIZE_MB} ميجابايت لكل صورة
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Previews */}
      {totalCount > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: '10px',
            marginTop: '1rem',
          }}
        >
          {/* Existing images */}
          {existingImages.map((path, idx) => (
            <PreviewTile
              key={`existing-${idx}`}
              src={path}
              isDark={isDark}
              onRemove={() => removeExisting(path)}
              badge={idx === 0 ? 'غلاف' : undefined}
            />
          ))}

          {/* New files */}
          {previews.map((url, idx) => (
            <PreviewTile
              key={`new-${idx}`}
              src={url}
              isDark={isDark}
              onRemove={() => removeNewFile(idx)}
              badge={
                existingImages.length === 0 && idx === 0 ? 'غلاف' : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// PreviewTile
// ============================================
const PreviewTile = ({
  src,
  isDark,
  onRemove,
  badge,
}: {
  src: string;
  isDark: boolean;
  onRemove: () => void;
  badge?: string;
}) => (
  <div
    style={{
      position: 'relative',
      aspectRatio: '1 / 1',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
      border: '1px solid var(--border-color)',
    }}
  >
    <img
      src={src}
      alt="preview"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />

    {badge && (
      <span
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          padding: '2px 8px',
          fontSize: '0.62rem',
          fontWeight: 800,
          fontFamily: 'Cairo, sans-serif',
          color: '#FFFFFF',
          background: COMMUNITY_THEME.gradient,
          borderRadius: '20px',
        }}
      >
        {badge}
      </span>
    )}

    <button
      type="button"
      onClick={onRemove}
      aria-label="إزالة الصورة"
      style={{
        position: 'absolute',
        top: '6px',
        left: '6px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'rgba(220, 53, 69, 0.95)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <CommunityIcons.cancel size={10} />
    </button>
  </div>
);

export default CommunityPostImageUploader;