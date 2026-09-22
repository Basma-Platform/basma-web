import { useState, useEffect, useCallback, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaUser,
  FaExclamationTriangle,
  FaArrowRight,
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { ratingService } from '../services/ratingService';
import {
  PublicUserHeader,
  PublicUserStats,
  PublicUserReviewsList,
} from '../components/publicProfile';
import type { ReviewSortOption } from '../components/publicProfile';
import RatingSkeleton from '../components/ratings/RatingSkeleton';
import { ReportButton } from '../components/reports';
import { useAuth } from '../hooks/useAuth';
import type {
  Rating,
  UserRatingSummary,
  PublicUserProfile,
} from '../types';

const PER_PAGE = 12;

const PublicUserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? Number(id) : null;

  // ✅ Current authenticated user — used to hide report button on own profile
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id ?? null;

  // Data
  const [user, setUser] = useState<PublicUserProfile | null>(null);
  const [summary, setSummary] = useState<UserRatingSummary | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  } | null>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Sort + pagination
  const [sort, setSort] = useState<ReviewSortOption>('newest');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE);

  // ✅ NEW: Request ID to discard stale responses (race-condition guard)
  const latestFetchId = useRef(0);

  // ============================================
  // Initial Load — user + ratings in parallel
  // ============================================
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setError(null);
      setHasAttempted(false);

      try {
        const [userRes, ratingsRes] = await Promise.all([
          ratingService.getPublicUser(userId),
          ratingService.getUserRatings(userId, {
            sort: 'newest',
            page: 1,
            per_page: PER_PAGE,
          }),
        ]);

        if (cancelled) return;

        setUser(userRes);
        setSummary(ratingsRes.summary);
        setRatings(ratingsRes.data);
        setMeta(ratingsRes.meta);
      } catch (err: any) {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 404) {
          setError('المستخدم غير موجود');
        } else {
          setError('تعذر تحميل بيانات المستخدم');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setHasAttempted(true);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // ============================================
  // Refetch ratings only (sort / page / perPage)
  // ============================================
  const fetchRatings = useCallback(
    async (opts: {
      page: number;
      per_page: number;
      sort: ReviewSortOption;
    }) => {
      if (!userId) return;

      // ✅ Increment request id — later requests invalidate earlier ones
      const thisFetchId = ++latestFetchId.current;

      try {
        setRatingsLoading(true);
        const res = await ratingService.getUserRatings(userId, {
          sort: opts.sort,
          page: opts.page,
          per_page: opts.per_page,
        });

        // ✅ Ignore stale responses (e.g., rapid sort changes)
        if (thisFetchId !== latestFetchId.current) return;

        setSummary(res.summary);
        setRatings(res.data);
        setMeta(res.meta);
      } catch {
        // Silent — main error already shown if the user was unreachable
      } finally {
        if (thisFetchId === latestFetchId.current) {
          setRatingsLoading(false);
        }
      }
    },
    [userId]
  );

  useEffect(() => {
    if (!userId || loading) return;
    fetchRatings({ page, per_page: perPage, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page, perPage]);

  // ============================================
  // Handlers
  // ============================================
  const handleSortChange = (newSort: ReviewSortOption) => {
    setSort(newSort);
    setPage(1);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  // ============================================
  // Loading state
  // ============================================
  if ((loading || !hasAttempted) && !user) {
    return (
      <>
        <SEO title="الملف الشخصي" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '90px',
            paddingBottom: '3rem',
          }}
        >
          <Container fluid="xl" className="px-3 px-md-4">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <RatingSkeleton variant="summary" />
              <div style={{ marginTop: '1.5rem' }}>
                <RatingSkeleton variant="card" count={3} />
              </div>
            </div>
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // Error state
  // ============================================
  if (error || !user) {
    return (
      <>
        <SEO title="الملف الشخصي" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '90px 1rem 3rem',
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            <FaExclamationTriangle size={42} color="#DC3545" opacity={0.6} />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '1rem 0 8px',
              }}
            >
              {error || 'المستخدم غير موجود'}
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}
            >
              لا يمكن عرض ملف هذا المستخدم حالياً.
            </p>
            <Link
              to="/announcements"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-orange)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <FaArrowRight size={11} />
              العودة للإعلانات
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Render
  // ============================================
  const showReportButton =
    currentUserId !== null && currentUserId !== user.id;

  return (
    <>
      <SEO
        title={`${user.name} - الملف الشخصي`}
        description={`الملف الشخصي والتقييمات لـ ${user.name}`}
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '90px',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container fluid="xl" className="px-3 px-md-4">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '1.25rem',
              fontFamily: 'Cairo, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/"
              style={{
                color: 'var(--primary-orange)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              الرئيسية
            </Link>
            <FaChevronLeft size={9} style={{ opacity: 0.4 }} />
            <Link
              to="/announcements"
              style={{
                color: 'var(--primary-orange)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              الإعلانات
            </Link>
            <FaChevronLeft size={9} style={{ opacity: 0.4 }} />
            <span style={{ opacity: 0.7 }}>{user.name}</span>
          </motion.nav>

          {/* Content */}
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Header */}
            <PublicUserHeader
              user={user}
              averageRating={summary?.average_rating || 0}
              totalRatings={summary?.total_ratings || 0}
            />

            {/* ✅ Report button — only for other users */}
            {showReportButton && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '-0.75rem',
                }}
              >
                <ReportButton
                  targetType="user"
                  reportedUserId={user.id}
                  targetName={user.name}
                  variant="full"
                />
              </div>
            )}

            {/* Stats + WhatsApp */}
            <PublicUserStats
              averageRating={summary?.average_rating || 0}
              totalRatings={summary?.total_ratings || 0}
              totalWithComments={ratings.filter((r) => r.comment).length}
              whatsapp={user.whatsapp}
              whatsappVisible={user.whatsapp_visible}
            />

            {/* Reviews */}
            <div>
              <h2
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FaUser size={14} color="var(--primary-orange)" />
                تقييمات المستخدم
              </h2>

              <PublicUserReviewsList
                ratings={ratings}
                loading={ratingsLoading}
                meta={meta}
                sort={sort}
                onSortChange={handleSortChange}
                onPageChange={setPage}
                onPerPageChange={handlePerPageChange}
                perPage={perPage}
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default PublicUserProfilePage;