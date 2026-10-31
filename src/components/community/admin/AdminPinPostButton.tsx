import { CommunityIcons } from '../../../utils/communityIcons';

interface AdminPinPostButtonProps {
  isPinned: boolean;
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  /** When disabled, show a tooltip (text) as title */
  disabledReason?: string;
}

const AdminPinPostButton = ({
  isPinned,
  onClick,
  loading = false,
  disabled = false,
  disabledReason,
}: AdminPinPostButtonProps) => {
  const label = isPinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      title={disabled && disabledReason ? disabledReason : label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: '0.85rem',
        fontFamily: 'Cairo, sans-serif',
        fontWeight: 800,
        color: isPinned ? '#7A5A10' : '#FFFFFF',
        background: isPinned
          ? 'linear-gradient(135deg, #FFE082, #FFC107)'
          : 'linear-gradient(135deg, #D4AF37, #FFC107)',
        border: '1px solid #E0A800',
        borderRadius: '30px',
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.55 : 1,
        boxShadow: '0 4px 14px rgba(255, 193, 7, 0.35)',
        transition: 'all 0.2s ease',
      }}
    >
      <CommunityIcons.pinned size={13} />
      {loading ? 'جاري المعالجة...' : label}
    </button>
  );
};

export default AdminPinPostButton;