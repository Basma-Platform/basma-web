import { useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  FaCloudUploadAlt,
  FaImage,
  FaTrash,
  FaStar,
  FaExclamationTriangle,
  FaGripVertical,
  FaChevronRight,
  FaChevronLeft,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export interface AnnouncementImage {
  id: string;
  file?: File;
  preview: string;
  existingPath?: string;
  existingId?: number;
}

interface AnnouncementImageUploaderProps {
  images: AnnouncementImage[];
  onChange: (images: AnnouncementImage[]) => void;
  error?: string;
  disabled?: boolean;
}

const AnnouncementImageUploader = ({
  images,
  onChange,
  error,
  disabled = false,
}: AnnouncementImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memory Leak Cleanup
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'الصورة يجب أن تكون بصيغة JPG أو PNG' };
    }
    if (file.size > MAX_SIZE_BYTES) {
      return { valid: false, error: `حجم الصورة يجب أن لا يتجاوز ${MAX_SIZE_MB} ميجابايت` };
    }
    return { valid: true };
  };

  const handleAddFiles = useCallback(
    (files: FileList | File[]) => {
      const filesArray = Array.from(files);
      const remainingSlots = MAX_IMAGES - images.length;

      if (remainingSlots <= 0) {
        toast.error(`يمكنك رفع ${MAX_IMAGES} صور كحد أقصى`);
        return;
      }

      if (filesArray.length > remainingSlots) {
        toast.warning(`سيتم إضافة أول ${remainingSlots} صور فقط`);
      }

      const filesToAdd = filesArray.slice(0, remainingSlots);
      const newImages: AnnouncementImage[] = [];

      for (const file of filesToAdd) {
        const validation = validateFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }

        newImages.push({
          id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          preview: URL.createObjectURL(file),
        });
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    },
    [images, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemove = (id: string) => {
    const removed = images.find((img) => img.id === id);
    if (removed && removed.preview && removed.preview.startsWith('blob:')) {
      URL.revokeObjectURL(removed.preview);
    }
    onChange(images.filter((img) => img.id !== id));
  };

  const handleShift = (index: number, direction: 'forward' | 'backward') => {
    const targetIndex = direction === 'forward' ? index + 1 : index - 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    onChange(updated);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [item] = updated.splice(index, 1);
    updated.unshift(item);
    onChange(updated);
    toast.success('تم تعيينها كصورة رئيسية للإعلان');
  };

  const canAddMore = images.length < MAX_IMAGES && !disabled;

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif' }} dir="rtl">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <FaImage size={13} color="var(--primary-orange)" />
          صور الإعلان
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 500 }}>
            (1-{MAX_IMAGES} صور)
          </span>
        </label>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '8px',
            backgroundColor: images.length === MAX_IMAGES ? 'rgba(255,193,7,0.12)' : 'var(--bg-input)',
            border: `1px solid ${images.length === MAX_IMAGES ? 'rgba(255,193,7,0.3)' : 'var(--border-color)'}`,
            fontSize: '0.7rem',
            fontWeight: 700,
            color: images.length === MAX_IMAGES ? '#856404' : 'var(--text-muted)',
          }}
        >
          <span style={{ fontFamily: 'system-ui, sans-serif', direction: 'ltr', fontWeight: 800 }}>
            {images.length}/{MAX_IMAGES}
          </span>
          {images.length === MAX_IMAGES && <FaExclamationTriangle size={9} />}
        </div>
      </div>

      {/* Drop Zone / Grid */}
      {images.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{
            position: 'relative',
            padding: '2.5rem 1.5rem',
            borderRadius: '16px',
            border: `2px dashed ${error ? 'var(--error)' : 'var(--border-color)'}`,
            backgroundColor: 'var(--bg-input)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            textAlign: 'center',
            opacity: disabled ? 0.6 : 1,
          }}
          whileHover={!disabled ? { scale: 1.005 } : {}}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(232,122,32,0.15), rgba(232,122,32,0.06))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-orange)',
            }}
          >
            <FaCloudUploadAlt size={28} />
          </div>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 800, margin: '0 0 6px' }}>
            اسحب الصور هنا أو اضغط للاختيار
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
            JPG أو PNG • الحد الأقصى {MAX_SIZE_MB} ميجابايت • حتى {MAX_IMAGES} صور
          </p>
        </motion.div>
      ) : (
        <div ref={containerRef} style={{ position: 'relative', padding: '4px' }}>
          <style>{`
            .announcement-images-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              list-style: none;
              padding: 0;
              margin: 0;
              direction: ltr;
            }
            @media (min-width: 640px) {
              .announcement-images-grid {
                grid-template-columns: repeat(${Math.min(images.length + (canAddMore ? 1 : 0), 4)}, 1fr);
              }
            }
          `}</style>

          {/* إزالة تحديد المحور الثابت (axis) لتمكين الانتقال السلس بين الصفوف والأعمدة دون تداخل */}
          <Reorder.Group
            values={images}
            onReorder={onChange}
            className="announcement-images-grid"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <Reorder.Item
                  key={image.id}
                  value={image}
                  layout
                  layoutId={image.id}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  dragConstraints={containerRef}
                  dragElastic={0.1}
                  style={{
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-input)',
                    border: `2px solid ${index === 0 ? 'var(--primary-orange)' : 'var(--border-color)'}`,
                    boxShadow: index === 0 ? '0 6px 20px rgba(232,122,32,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                    touchAction: 'none',
                    userSelect: 'none',
                    listStyle: 'none',
                    direction: 'rtl',
                  }}
                  whileDrag={{
                    scale: 1.05,
                    zIndex: 100,
                    boxShadow: '0 20px 40px rgba(232,122,32,0.45)',
                  }}
                >
                  {/* Image Preview */}
                  <img
                    src={image.preview}
                    alt={`صورة ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Gradient Background */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 45%, rgba(0,0,0,0.7) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Cover Badge / Button */}
                  {index === 0 ? (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        zIndex: 2,
                        boxShadow: '0 2px 6px rgba(232,122,32,0.4)',
                      }}
                    >
                      <FaStar size={9} />
                      رئيسية
                    </div>
                  ) : (
                    !disabled && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCover(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(0,0,0,0.65)',
                          color: '#fff',
                          border: 'none',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          zIndex: 2,
                          backdropFilter: 'blur(4px)',
                        }}
                        title="اجعلها الصورة الرئيسية"
                      >
                        تعيين رئيسية
                      </button>
                    )
                  )}

                  {/* Drag Grip Icon */}
                  {!disabled && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        zIndex: 2,
                        cursor: 'grab',
                      }}
                    >
                      <FaGripVertical size={11} />
                    </div>
                  )}

                  {/* Quick Shift Arrows */}
                  {!disabled && images.length > 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: '6px',
                        right: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        pointerEvents: 'none',
                        zIndex: 3,
                      }}
                    >
                      {/* زر الخلف (<) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShift(index, 'backward');
                        }}
                        disabled={index === 0}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.75)',
                          color: '#FFF',
                          border: 'none',
                          display: index === 0 ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                        }}
                        title="تحريك للخلف"
                      >
                        <FaChevronLeft size={12} />
                      </button>

                      {/* زر الأمام (>) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShift(index, 'forward');
                        }}
                        disabled={index === images.length - 1}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.75)',
                          color: '#FFF',
                          border: 'none',
                          display: index === images.length - 1 ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                        }}
                        title="تحريك للأمام"
                      >
                        <FaChevronRight size={12} />
                      </button>
                    </div>
                  )}

                  {/* Delete Button & Index Footer */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      zIndex: 2,
                    }}
                  >
                    {!disabled ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(image.id);
                        }}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: 'none',
                          background: 'rgba(220,53,69,0.95)',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(220,53,69,0.4)',
                        }}
                        aria-label="حذف الصورة"
                      >
                        <FaTrash size={12} />
                      </button>
                    ) : <div />}

                    <div
                      style={{
                        minWidth: '24px',
                        height: '24px',
                        padding: '0 6px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        direction: 'ltr',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>

            {/* Add More Tile */}
            {canAddMore && (
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: '14px',
                  border: '2px dashed var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  listStyle: 'none',
                }}
              >
                <span
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(232,122,32,0.1)',
                    color: 'var(--primary-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaCloudUploadAlt size={18} />
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>إضافة صورة</span>
              </motion.button>
            )}
          </Reorder.Group>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple
        onChange={handleInputChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />

      {/* Error Message */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: 'var(--error)', fontSize: '0.75rem' }}>
          <FaExclamationTriangle size={11} />
          {error}
        </div>
      )}
    </div>
  );
};

export default AnnouncementImageUploader;