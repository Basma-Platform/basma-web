import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaVideo,
  FaTimes,
  FaUpload,
  FaPlay,
  FaExclamationTriangle,
  FaFileVideo,
} from 'react-icons/fa';
import {
  validateHelpRequestVideo,
  validateVideoDuration,
  formatVideoDuration,
  formatFileSize,
  FUND_THEME,
} from '../../../../utils/helpRequestHelpers';
import type { HelpRequestRequirements } from '../../../../types';
import { FieldError, FieldLabel } from './HelpRequestFormShared';

interface HelpRequestVideoUploaderProps {
  file: File | null;
  onChange: (file: File | null) => void;
  requirements?: HelpRequestRequirements | null;
  error?: string;
}

/**
 * Video uploader for help request creation.
 * Fully responsive — stacks and reflows cleanly on mobile.
 *
 * The min-duration rule is backend-driven (`video_rules.min_duration_sec`).
 * When the backend sets it to ≤ 5s, we hide the lower bound from the UI
 * and only show the upper limit.
 */
const HelpRequestVideoUploader = ({
  file,
  onChange,
  requirements,
  error,
}: HelpRequestVideoUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const rules = requirements?.video_rules;
  const maxMB = rules?.max_size_mb ?? 100;
  const rawMin = rules?.min_duration_sec ?? 1;
  const maxDur = rules?.max_duration_sec ?? 90;

  const hasMeaningfulMin = rawMin > 5;
  const durationHint = hasMeaningfulMin
    ? `${rawMin}–${maxDur} ثانية`
    : `حتى ${maxDur} ثانية`;

  // ============================================
  // Handle file selection
  // ============================================
  const handleFile = useCallback(
    (selected: File) => {
      setLocalError(null);
      setDuration(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const result = validateHelpRequestVideo(selected, rules);
      if (!result.valid) {
        setLocalError(result.error ?? 'ملف غير صالح');
        setPreviewUrl(null);
        return;
      }

      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      onChange(selected);
    },
    [onChange, previewUrl, rules]
  );

  // ============================================
  // Duration check after metadata loads
  // ============================================
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    const sec = Math.floor(v.duration);
    setDuration(sec);

    const durCheck = validateVideoDuration(sec, rules);
    if (!durCheck.valid) {
      setLocalError(durCheck.error ?? 'مدة الفيديو غير صالحة');
    } else {
      setLocalError(null);
    }
  };

  // ============================================
  // Remove file
  // ============================================
  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setDuration(null);
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  // ============================================
  // Drag & drop
  // ============================================
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const shownError = localError ?? error;

  // ============================================
  // Render — empty state
  // ============================================
  if (!file) {
    return (
      <div>
        <FieldLabel required>فيديو توضيحي</FieldLabel>

        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.005 }}
          className="hr-video-drop"
          style={{
            padding: 'clamp(1.5rem, 5vw, 2.25rem) clamp(1rem, 3vw, 1.25rem)',
            borderRadius: '14px',
            border: `2px dashed ${
              isDragging
                ? FUND_THEME.accent
                : shownError
                ? 'var(--error)'
                : 'var(--border-color)'
            }`,
            backgroundColor: isDragging
              ? `${FUND_THEME.accent}08`
              : 'var(--bg-input)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.25s ease',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: 'clamp(52px, 12vw, 60px)',
              height: 'clamp(52px, 12vw, 60px)',
              borderRadius: '16px',
              background: FUND_THEME.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              margin: '0 auto 14px',
              boxShadow: `0 6px 18px ${FUND_THEME.shadow}`,
            }}
          >
            <FaVideo size={22} />
          </motion.div>

          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(0.88rem, 3vw, 0.95rem)',
              fontWeight: 800,
              marginBottom: '6px',
              lineHeight: 1.4,
            }}
          >
            اختر فيديو أو اسحبه هنا
          </div>

          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
              lineHeight: 1.7,
            }}
          >
            MP4 · {durationHint} · حتى {maxMB} ميجابايت
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '16px',
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: `${FUND_THEME.accent}12`,
              color: FUND_THEME.accent,
              fontSize: '0.78rem',
              fontWeight: 800,
            }}
          >
            <FaUpload size={11} />
            تصفح الملفات
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="video/mp4"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </motion.div>

        <FieldError>{shownError}</FieldError>
      </div>
    );
  }

  // ============================================
  // Render — file selected
  // ============================================
  return (
    <div>
      <FieldLabel required>فيديو توضيحي</FieldLabel>

      <AnimatePresence mode="wait">
        <motion.div
          key="selected"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{
            borderRadius: '14px',
            overflow: 'hidden',
            border: `1px solid ${
              shownError ? 'var(--error)' : 'var(--border-color)'
            }`,
            backgroundColor: 'var(--bg-input)',
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          {/* ============================================ */}
          {/* Preview */}
          {/* ============================================ */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              backgroundColor: '#000',
              overflow: 'hidden',
            }}
          >
            {previewUrl && (
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                playsInline
                preload="metadata"
                onLoadedMetadata={handleLoadedMetadata}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            )}

            {/* Remove button — top-left */}
            <button
              type="button"
              onClick={handleRemove}
              aria-label="إزالة الفيديو"
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                zIndex: 3,
              }}
            >
              <FaTimes size={13} />
            </button>

            {/* Preview chip — top-right */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(23,162,184,0.9)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                fontSize: '0.68rem',
                fontWeight: 700,
              }}
            >
              <FaPlay size={9} />
              معاينة
            </div>
          </div>

          {/* ============================================ */}
          {/* File meta + actions — responsive */}
          {/* ============================================ */}
          <div className="hr-video-meta">
            {/* Chips row */}
            <div className="hr-video-meta__chips">
              <span className="hr-video-meta__chip">
                <FaFileVideo size={11} />
                <span className="hr-video-meta__chip-text">
                  {file.name.length > 22
                    ? file.name.slice(0, 19) + '...'
                    : file.name}
                </span>
              </span>
              <span className="hr-video-meta__chip">
                💾 {formatFileSize(file.size)}
              </span>
              {duration != null && (
                <span className="hr-video-meta__chip">
                  ⏱ {formatVideoDuration(duration)}
                </span>
              )}
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="hr-video-meta__remove"
            >
              <FaTimes size={10} />
              إزالة
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <FieldError>{shownError}</FieldError>

      {/* Warning tip — dark-mode safe */}
      {!shownError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            marginTop: '10px',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--notice-warning-bg)',
            border: '1px solid var(--notice-warning-border)',
            color: 'var(--notice-warning-text)',
            fontSize: '0.72rem',
            fontWeight: 700,
            lineHeight: 1.55,
            fontFamily: 'Cairo, sans-serif',
          }}
        >
          <FaExclamationTriangle
            size={11}
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <span>
            فيديو واحد فقط — تأكد من وضوح الصوت والصورة. الفيديو لا يمكن
            استبداله بعد الإرسال.
          </span>
        </div>
      )}

      {/* Scoped responsive styles */}
      <style>{`
        /* ---------- File meta row ---------- */
        .hr-video-meta {
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          border-top: 1px solid var(--border-color);
        }

        .hr-video-meta__chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          min-width: 0;
          flex: 1 1 200px;
        }

        .hr-video-meta__chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          font-family: 'Cairo', sans-serif;
        }

        .hr-video-meta__chip-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }

        .hr-video-meta__remove {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid rgba(220,53,69,0.3);
          background-color: rgba(220,53,69,0.06);
          color: #DC3545;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Cairo', sans-serif;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .hr-video-meta__remove:hover {
          background-color: rgba(220,53,69,0.12);
        }

        /* ---------- Mobile stacking ---------- */
        @media (max-width: 480px) {
          .hr-video-meta {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .hr-video-meta__chips {
            flex: 1 1 auto;
          }

          .hr-video-meta__chip-text {
            max-width: 140px;
          }

          .hr-video-meta__remove {
            justify-content: center;
            width: 100%;
            padding: 10px 14px;
          }
        }

        /* ---------- Drop zone tweaks on tiny screens ---------- */
        @media (max-width: 360px) {
          .hr-video-drop {
            padding: 1.25rem 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HelpRequestVideoUploader;