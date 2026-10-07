import { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronRight,
  FaAward,
  FaTimes,
  FaHandHoldingHeart,
  FaArrowLeft,
} from 'react-icons/fa';
import SEO from '../../components/SEO';
import Pagination from '../../components/shared/Pagination';

import {
  AchievementCard,
  AchievementCardSkeleton,
  AchievementDetailsModal,
  AchievementsEmptyState,
  AchievementsFilters,
} from '../../components/basma-fund/achievements';
import type { AchievementsSortOption } from '../../components/basma-fund/achievements';

import { useDonationAchievements } from '../../hooks/useDonationAchievements';
import { FUND_THEME } from '../../utils/helpRequestHelpers';
import type { DonationAchievement } from '../../types';

const ACHIEVEMENTS_PER_PAGE = 12;

const AchievementsPage = () => {
  const { achievements, meta, loading, fetchList } =
    useDonationAchievements();

  // ============================================
  // State
  // ============================================
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ACHIEVEMENTS_PER_PAGE);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<AchievementsSortOption>('newest');

  const [selectedAchievement, setSelectedAchievement] =
    useState<DonationAchievement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Track whether the very first fetch has settled (for skeleton-only view)
  const initialLoadedRef = useRef(false);

  // ============================================
  // ✅ Single fetch effect — reacts to search + sort + page + perPage
  //
  // Server-side filtering: backend receives ?search=&sort=&page=&per_page=
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        await fetchList({
          page,
          per_page: perPage,
          search: search.trim() || undefined,
          sort,
        });
      } catch {
        // toast handled in hook
      } finally {
        if (!cancelled) initialLoadedRef.current = true;
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [page, perPage, search, sort, fetchList]);

  // ============================================
  // Handlers
  // ============================================
  const handleSearchChange = useCallback((next: string) => {
    setSearch(next);
    setPage(1); // reset to first page whenever the search changes
  }, []);

  const handleSortChange = useCallback((next: AchievementsSortOption) => {
    setSort(next);
    setPage(1); // reset to first page whenever the sort changes
  }, []);

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePerPageChange = useCallback((next: number) => {
    setPerPage(next);
    setPage(1);
  }, []);

  const handleCardClick = useCallback((achievement: DonationAchievement) => {
    setSelectedAchievement(achievement);
    setDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
    setSelectedAchievement(null);
  }, []);

  const hasActiveFilters = search.trim() !== '' || sort !== 'newest';

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setSort('newest');
    setPage(1);
  }, []);

  // ============================================
  // Loading state for the filter bar's spinner
  // ============================================
  const isSearching = loading && initialLoadedRef.current;

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="إنجازات التبرعات | صندوق بصمة"
        description="اطلع على إنجازات التبرعات المحققة في صندوق بصمة — قصص نجاح حقيقية"
      />

      <div
        style={{
          backgroundColor: 'var(--bg-body)',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '3rem',
        }}
        dir="rtl"
      >
        <Container className="px-3 px-md-4" style={{ maxWidth: '1200px' }}>
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              fontFamily: 'Cairo, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/basma-fund"
              style={{
                color: FUND_THEME.accent,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              صندوق بصمة
            </Link>
            <FaChevronRight
              size={9}
              style={{ opacity: 0.4, transform: 'rotate(180deg)' }}
            />
            <span style={{ opacity: 0.75 }}>إنجازات التبرعات</span>
          </motion.nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1], rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background:
                  'linear-gradient(135deg, #FFD700 0%, #E87A20 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 8px 22px rgba(232,122,32,0.4)',
                flexShrink: 0,
              }}
            >
              <FaAward size={24} />
            </motion.div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <h1
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                  fontWeight: 900,
                  fontFamily: 'Cairo, sans-serif',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                إنجازات التبرعات
              </h1>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontFamily: 'Cairo, sans-serif',
                  margin: '4px 0 0',
                  lineHeight: 1.5,
                }}
              >
                قصص نجاح حقيقية بفضل تبرعاتكم — كل إنجاز هو أمل جديد
              </p>
            </div>
          </motion.div>

          {/* Filters */}
          <AchievementsFilters
            search={search}
            onSearchChange={handleSearchChange}
            sort={sort}
            onSortChange={handleSortChange}
            isSearching={isSearching}
          />

          {/* Results count + clear */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '1rem',
              padding: '0 4px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {!loading && meta && (
                <>
                  {hasActiveFilters
                    ? `${meta.total} نتيجة${search.trim() ? ` لـ "${search.trim()}"` : ''}`
                    : `${meta.total} إنجاز`}
                </>
              )}
            </span>

            {hasActiveFilters && (
              <Button
                variant="link"
                onClick={handleClearFilters}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaTimes size={11} />
                مسح الفلاتر
              </Button>
            )}
          </div>

          {/* Grid */}
          {loading && achievements.length === 0 ? (
            <AchievementCardSkeleton count={8} />
          ) : achievements.length === 0 ? (
            hasActiveFilters ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: 'clamp(2.25rem, 8vw, 3rem) 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '20px',
                  border: '1px dashed var(--border-color)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1rem',
                    borderRadius: '50%',
                    background: 'rgba(255,193,7,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFC107',
                  }}
                >
                  <FaAward size={34} opacity={0.6} />
                </div>
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    margin: '0 0 8px',
                  }}
                >
                  لا توجد نتائج مطابقة
                </h3>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    margin: 0,
                  }}
                >
                  حاول تغيير كلمات البحث أو الترتيب
                </p>
                <Button
                  onClick={handleClearFilters}
                  style={{
                    marginTop: '1.25rem',
                    backgroundColor: FUND_THEME.accent,
                    borderColor: FUND_THEME.accent,
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    fontFamily: 'Cairo, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  مسح الفلاتر
                </Button>
              </motion.div>
            ) : (
              <AchievementsEmptyState />
            )
          ) : (
            <div className="ach-page-grid">
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.04, 0.4),
                  }}
                  style={{ minWidth: 0 }}
                >
                  <AchievementCard
                    achievement={achievement}
                    onClick={handleCardClick}
                    variant="grid"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination — always shows when backend has >1 page */}
          {meta && meta.last_page > 1 && (
            <Pagination
              currentPage={page}
              lastPage={meta.last_page}
              total={meta.total}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              perPageOptions={[12, 24, 48, 96]}
              isLoading={loading}
              itemLabel={hasActiveFilters ? 'نتيجة' : 'إنجاز'}
            />
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="ach-bottom-cta"
            style={{
              marginTop: '2.5rem',
              padding: 'clamp(1.5rem, 4vw, 2.25rem)',
              borderRadius: '24px',
              background:
                'linear-gradient(135deg, #138496 0%, #17A2B8 55%, #20C9E0 100%)',
              color: '#FFFFFF',
              fontFamily: 'Cairo, sans-serif',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 16px 40px rgba(23,162,184,0.3)',
            }}
          >
            <motion.div
              aria-hidden="true"
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40%',
                background:
                  'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.28) 50%, transparent 80%)',
                transform: 'skewX(-18deg)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '-60px',
                left: '-60px',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-80px',
                right: '-60px',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {[
              { left: '12%', delay: 0, size: 6 },
              { left: '48%', delay: 1.2, size: 4 },
              { left: '78%', delay: 2.4, size: 5 },
            ].map((p, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                animate={{
                  y: [30, -80],
                  opacity: [0, 0.55, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: p.delay,
                }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: p.left,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            ))}

            <div className="ach-bottom-cta__content">
              <div className="ach-bottom-cta__info">
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1, 1.05, 1],
                    rotate: [0, 4, -4, 3, 0],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }}
                  className="ach-bottom-cta__icon"
                  style={{
                    background: 'rgba(255,255,255,0.22)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backdropFilter: 'blur(6px)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
                  }}
                >
                  <FaHandHoldingHeart size={22} />
                </motion.div>

                <div className="ach-bottom-cta__text" style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
                      fontWeight: 900,
                      margin: '0 0 4px',
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                    }}
                  >
                    كن جزءاً من قصة النجاح القادمة
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.9)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    تصفّح طلبات المساعدة الحالية وشارك بأي طريقة تستطيع.
                  </p>
                </div>
              </div>

              <Link
                to="/basma-fund"
                className="ach-bottom-cta__button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px 24px',
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#138496',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 22px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  zIndex: 2,
                  overflow: 'hidden',
                }}
              >
                <span
                  className="ach-bottom-cta__shine"
                  aria-hidden="true"
                />
                تصفح طلبات المساعدة
                <span className="ach-bottom-cta__arrow">
                  <FaArrowLeft size={11} />
                </span>
              </Link>
            </div>
          </motion.div>
        </Container>
      </div>

      <AchievementDetailsModal
        isOpen={detailsOpen}
        achievement={selectedAchievement}
        onClose={handleCloseDetails}
      />

      <style>{`
        .ach-page-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
          align-items: stretch;
          width: 100%;
        }
        @media (min-width: 640px) {
          .ach-page-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .ach-page-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 22px;
          }
        }
        @media (min-width: 1440px) {
          .ach-page-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        .ach-bottom-cta__content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .ach-bottom-cta__info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1 1 320px;
          min-width: 0;
        }
        .ach-bottom-cta__icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
        }
        @media (max-width: 640px) {
          .ach-bottom-cta__content {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 1.25rem;
          }
          .ach-bottom-cta__info {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            flex: 0 1 auto;
            gap: 12px;
          }
          .ach-bottom-cta__text {
            text-align: center;
          }
          .ach-bottom-cta__icon {
            width: 60px;
            height: 60px;
          }
          .ach-bottom-cta__button {
            width: 100%;
            max-width: 320px;
          }
        }
        .ach-bottom-cta__button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
        .ach-bottom-cta__button:active {
          transform: translateY(0);
        }
        .ach-bottom-cta__arrow {
          display: inline-flex;
          transition: transform 0.25s ease;
        }
        .ach-bottom-cta__button:hover .ach-bottom-cta__arrow {
          transform: translateX(-4px);
        }
        .ach-bottom-cta__shine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: -60%;
          width: 40%;
          background: linear-gradient(
            100deg,
            transparent 20%,
            rgba(23, 162, 184, 0.22) 50%,
            transparent 80%
          );
          transform: skewX(-18deg);
          transition: left 0.6s ease;
          pointer-events: none;
        }
        .ach-bottom-cta__button:hover .ach-bottom-cta__shine {
          left: 120%;
        }

        @media (prefers-reduced-motion: reduce) {
          .ach-bottom-cta__button,
          .ach-bottom-cta__arrow,
          .ach-bottom-cta__shine {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default AchievementsPage;