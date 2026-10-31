import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CommunityIcons } from '../../../utils/communityIcons';
import { textareaStyle } from '../user/CommunityPostFormShared';

interface AdminApprovePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void | Promise<void>;
  loading?: boolean;
}

const AdminApprovePostModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: AdminApprovePostModalProps) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) setNotes('');
  }, [isOpen]);

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
            backgroundColor: 'rgba(40, 167, 69, 0.12)',
            color: '#28A745',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <CommunityIcons.confirm size={24} />
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
          الموافقة على المنشور؟
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
          سيتم نشر المنشور فوراً وإشعار صاحبه.
        </p>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ملاحظات اختيارية (لن تظهر للمستخدم) — الحد الأقصى 1000 حرف"
          maxLength={1000}
          style={{ ...textareaStyle, minHeight: '80px', marginBottom: '1rem' }}
        />

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
            onClick={() => onConfirm(notes.trim() || undefined)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '11px 18px',
              fontSize: '0.85rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #28A745, #4FCB6E)',
              border: 'none',
              borderRadius: '24px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(40, 167, 69, 0.35)',
            }}
          >
            {loading ? 'جاري المعالجة...' : 'موافقة'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AdminApprovePostModal;