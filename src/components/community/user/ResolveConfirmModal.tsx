import { createPortal } from 'react-dom';
import { CommunityIcons } from '../../../utils/communityIcons';

interface ResolveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

const ResolveConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: ResolveConfirmModalProps) => {
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
        animation: 'rcmFadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes rcmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rcmSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '1.75rem',
          animation: 'rcmSlideUp 0.3s ease',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(23, 162, 184, 0.12)',
            color: '#17A2B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <CommunityIcons.resolve size={24} />
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
          وسم المنشور كمحلول؟
        </h3>

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.75,
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
        >
          سيتم وسم المنشور كـ "تم الحل"، وسيظهر للجميع أنك وجدت ما تبحث عنه.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
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
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: '11px 18px',
              fontSize: '0.85rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #17A2B8, #20C9E0)',
              border: 'none',
              borderRadius: '24px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(23, 162, 184, 0.35)',
            }}
          >
            {loading ? 'جاري المعالجة...' : 'تأكيد'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ResolveConfirmModal;