import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CommunityIcons } from '../../../utils/communityIcons';
import { textareaStyle } from '../user/CommunityPostFormShared';

interface AdminRejectPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminNotes: string) => void | Promise<void>;
  loading?: boolean;
}

const AdminRejectPostModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: AdminRejectPostModalProps) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmed = notes.trim();
    if (trimmed.length < 5) {
      setError('السبب مطلوب (5 أحرف على الأقل)');
      return;
    }
    if (trimmed.length > 1000) {
      setError('السبب يجب ألا يتجاوز 1000 حرف');
      return;
    }
    setError('');
    onConfirm(trimmed);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '1.75rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(220, 53, 69, 0.12)',
            color: '#DC3545',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <CommunityIcons.cancel size={24} />
        </div>

        <h3
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}
        >
          رفض المنشور؟
        </h3>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.75,
            textAlign: 'center',
            marginBottom: '1.25rem',
          }}
        >
          اكتب سبباً واضحاً — سيُرسل لصاحب المنشور.
        </p>

        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (error) setError('');
          }}
          placeholder="سبب الرفض (مطلوب — 5 أحرف على الأقل)"
          maxLength={1000}
          style={{
            ...textareaStyle,
            minHeight: '100px',
            marginBottom: '0.5rem',
            borderColor: error ? '#DC3545' : 'var(--border-color)',
          }}
        />

        {error && (
          <p
            style={{
              color: '#DC3545',
              fontSize: '0.72rem',
              fontFamily: 'Cairo, sans-serif',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CommunityIcons.ban size={10} />
            {error}
          </p>
        )}

        {!error && (
          <div style={{ marginBottom: '1rem' }}>
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontFamily: 'Cairo, sans-serif',
                display: 'block',
                textAlign: 'left',
              }}
              dir="ltr"
            >
              {notes.length} / 1000
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '11px 18px',
              fontSize: '0.85rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              padding: '11px 18px',
              fontSize: '0.85rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #DC3545, #F56575)',
              border: 'none',
              borderRadius: '24px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(220, 53, 69, 0.35)',
            }}
          >
            {loading ? 'جاري الرفض...' : 'رفض'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminRejectPostModal;