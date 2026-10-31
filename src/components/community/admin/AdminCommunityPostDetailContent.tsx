import { useTheme } from '../../../context/ThemeContext';
import {
  COMMUNITY_THEME,
  formatCommunityDate,
  formatCommunityTimeAgo,
  getCommunityTypeColor,
} from '../../../utils/communityHelpers';
import { CommunityIcons } from '../../../utils/communityIcons';
import {
  CommunityTypeBadge,
  CommunityStatusBadge,
  CommunityPinnedBadge,
  CommunityImageCarousel,
} from '../shared';
import type { AdminCommunityPostDetail } from '../../../types';

interface AdminCommunityPostDetailContentProps {
  post: AdminCommunityPostDetail;
}

const AdminCommunityPostDetailContent = ({
  post,
}: AdminCommunityPostDetailContentProps) => {
  const { isDark } = useTheme();
  const typeColor = getCommunityTypeColor(post.type);

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {/* Header card */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: `1.5px solid ${
            post.is_pinned ? '#FFC107' : 'var(--border-color)'
          }`,
          borderRadius: '18px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '4px',
            background: post.is_pinned
              ? 'linear-gradient(90deg, #FFC107, #FFD966)'
              : `linear-gradient(90deg, ${typeColor}, ${typeColor}70)`,
          }}
        />

        <div style={{ padding: '1.5rem' }}>
          {/* Badges */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            <CommunityTypeBadge type={post.type} size="md" />
            <CommunityStatusBadge
              status={post.status}
              labelOverride={post.status_label}
              size="md"
            />
            {post.is_pinned && <CommunityPinnedBadge size="md" />}
          </div>

          {/* Title */}
          <h2
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
              fontWeight: 900,
              fontFamily: 'Cairo, sans-serif',
              lineHeight: 1.4,
              marginBottom: '0.75rem',
            }}
          >
            {post.title}
          </h2>

          {/* Time + views + clicks */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <CommunityIcons.time size={11} />
              {formatCommunityTimeAgo(post.created_at)}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <CommunityIcons.views size={11} />
              <span dir="ltr">{post.views}</span> مشاهدة
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <CommunityIcons.clicks size={11} />
              <span dir="ltr">{post.whatsapp_clicks}</span> نقرة واتساب
            </span>
          </div>
        </div>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '1.25rem',
          }}
        >
          <SectionTitle
            icon={<CommunityIcons.images size={14} />}
            title="الصور"
          />
          <CommunityImageCarousel
            images={post.images}
            alt={post.title}
            variant="modal"
          />
        </div>
      )}

      {/* Description */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '1.25rem',
        }}
      >
        <SectionTitle
          icon={<CommunityIcons.info size={14} />}
          title="الوصف"
        />
        <p
          style={{
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontFamily: 'Cairo, sans-serif',
            lineHeight: 1.9,
            margin: 0,
            whiteSpace: 'pre-wrap',
            textAlign: 'justify',
            textJustify: 'inter-word',
          }}
        >
          {post.description}
        </p>
      </div>

      {/* User card */}
      {post.user && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '1.25rem',
          }}
        >
          <SectionTitle
            icon={<CommunityIcons.info size={14} />}
            title="صاحب المنشور"
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
            }}
          >
            <InfoRow label="الاسم" value={post.user.name} />
            {post.user.email && (
              <InfoRow label="البريد الإلكتروني" value={post.user.email} />
            )}
            {post.user.whatsapp && (
              <InfoRow label="واتساب" value={post.user.whatsapp} />
            )}
            <InfoRow
              label="موثّق"
              value={post.user.is_verified ? 'نعم' : 'لا'}
            />
          </div>
        </div>
      )}

      {/* Display + contact */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '1.25rem',
        }}
      >
        <SectionTitle
          icon={<CommunityIcons.info size={14} />}
          title="العرض والتواصل"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
          }}
        >
          <InfoRow label="طريقة عرض الاسم" value={post.display_name} />
          <InfoRow
            label="رقم واتساب المنشور"
            value={post.whatsapp_number || '—'}
          />
        </div>
      </div>

      {/* Location + category */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '1.25rem',
        }}
      >
        <SectionTitle
          icon={<CommunityIcons.location size={14} />}
          title="الموقع والتصنيف"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
          }}
        >
          <InfoRow
            label="المحافظة"
            value={post.governorate?.name || '—'}
          />
          <InfoRow label="المنطقة" value={post.city?.name || '—'} />
          <InfoRow label="التصنيف" value={post.category?.name || '—'} />
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '1.25rem',
        }}
      >
        <SectionTitle
          icon={<CommunityIcons.clock size={14} />}
          title="الجدول الزمني"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
          }}
        >
          <InfoRow
            label="تاريخ الإنشاء"
            value={formatCommunityDate(post.created_at)}
          />
          {post.published_at && (
            <InfoRow
              label="تاريخ النشر"
              value={formatCommunityDate(post.published_at)}
            />
          )}
          {post.expires_at && (
            <InfoRow
              label="ينتهي في"
              value={formatCommunityDate(post.expires_at)}
            />
          )}
          {post.resolved_at && (
            <InfoRow
              label="تاريخ الحل"
              value={formatCommunityDate(post.resolved_at)}
            />
          )}
        </div>

        {/* Admin notes */}
        {post.admin_notes && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.9rem 1rem',
              backgroundColor: isDark
                ? 'rgba(255, 193, 7, 0.08)'
                : 'rgba(255, 193, 7, 0.06)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                color: '#856404',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CommunityIcons.info size={11} />
              ملاحظات الأدمن
            </div>
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {post.admin_notes}
            </p>
          </div>
        )}

        {/* Actions log */}
        <div
          style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
          }}
        >
          {post.reviewed_by && (
            <InfoRow
              label="راجعه"
              value={`${post.reviewed_by.name} — ${formatCommunityDate(
                post.reviewed_at
              )}`}
            />
          )}
          {post.resolved_by && (
            <InfoRow label="حلّه" value={post.resolved_by.name} />
          )}
          {post.pinned_by && (
            <InfoRow label="ثبّته" value={post.pinned_by.name} />
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Helpers
// ============================================
const SectionTitle = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: COMMUNITY_THEME.accent,
      fontSize: '0.82rem',
      fontWeight: 900,
      fontFamily: 'Cairo, sans-serif',
      marginBottom: '1rem',
      paddingBottom: '0.6rem',
      borderBottom: '1px solid var(--border-color)',
    }}
  >
    {icon}
    {title}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      padding: '0.7rem 0.9rem',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
    }}
  >
    <div
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.7rem',
        fontWeight: 700,
        fontFamily: 'Cairo, sans-serif',
        marginBottom: '4px',
      }}
    >
      {label}
    </div>
    <div
      style={{
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        wordBreak: 'break-word',
      }}
    >
      {value}
    </div>
  </div>
);

export default AdminCommunityPostDetailContent;