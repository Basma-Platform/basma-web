import { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaInbox, FaWhatsapp } from 'react-icons/fa';
import SEO from '../../../../components/SEO';
import Pagination from '../../../../components/shared/Pagination';

import { useAdminDonationInquiries } from '../../../../hooks/useAdminDonationInquiries';
import {
  AdminInquiryStatsCards,
  AdminInquiryFilters,
  AdminInquiryCard,
} from '../../../../components/admin/basma-fund/inquiries';
import type { AdminInquiryStatusFilter } from '../../../../components/admin/basma-fund/inquiries';
import { FUND_THEME } from '../../../../utils/helpRequestHelpers';
import type { AdminDonationInquiryListItem } from '../../../../types';

const PER_PAGE = 12;

// URL sync helpers
const readParam = (key: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const p = new URLSearchParams(window.location.search);
  return p.get(key) ?? fallback;
};
const readNumber = (key: string, fallback: number): number => {
  if (typeof window === 'undefined') return fallback;
  const p = new URLSearchParams(window.location.search);
  const raw = p.get(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return isNaN(n) ? fallback : n;
};
const writeParams = (params: Record<string, string | number | null>) => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === '' || v === 'all') url.searchParams.delete(k);
    else url.searchParams.set(k, String(v));
  }
  window.history.replaceState({}, '', url.toString());
};

const AdminInquiriesListPage = () => {
  const navigate = useNavigate();
  const {
    inquiries,
    meta,
    stats,
    loading,
    fetchList,
  } = useAdminDonationInquiries();

  const [status, setStatus] = useState<AdminInquiryStatusFilter>(
    () => readParam('status', 'all') as AdminInquiryStatusFilter  );
  const [search, setSearch] = useState(() => readParam('search', ''));
  const [page, setPage] = useState(() => readNumber('page', 1));
  const [perPage, setPerPage] = useState(() => readNumber('per_page', PER_PAGE));

  const [localSearch, setLocalSearch] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const isFirstFetch = useRef(true);

  // Sync URL
  useEffect(() => {
    writeParams({
      status: status === 'all' ? null : status,
      search: search || null,
      page: page > 1 ? page : null,
      per_page: perPage !== PER_PAGE ? perPage : null,
    });
  }, [status, search, page, perPage]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // Fetch
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsSearching(true);
        await fetchList({
          status,
          search: search || undefined,
          page,
          per_page: perPage,
        });
      } catch {
        // handled in hook
      } finally {
        if (!cancelled) {
          setIsSearching(false);
          if (isFirstFetch.current) {
            setInitialLoading(false);
            isFirstFetch.current = false;
          }
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search, page, perPage]);

  const handleClearFilters = useCallback(() => {
    setStatus('all');
    setSearch('');
    setLocalSearch('');
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePerPageChange = useCallback((pp: number) => {
    setPerPage(pp);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((s: AdminInquiryStatusFilter) => {
    setStatus(s);
    setPage(1);
  }, []);

  const handleCardClick = useCallback(
    (i: AdminDonationInquiryListItem) => {
      navigate(`/admin/donation-inquiries/${i.id}`);
    },
    [navigate]
  );

  const hasActiveFilters = status !== 'all' || search.trim() !== '';

  if (initialLoading && !stats) {
    return (
      <>
        <SEO title="طلبات التبرعات | لوحة الإدارة" />
        <div className="admin-inq-page" dir="rtl">
          <Container fluid="xl" className="px-2 px-md-4 py-3">
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              <span
                className="spinner-border"
                style={{ color: FUND_THEME.accent, width: '32px', height: '32px' }}
              />
              <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                جاري تحميل الاستفسارات...
              </div>
            </div>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="طلبات التبرعات | لوحة الإدارة"
        description="إدارة استفسارات التبرع — صندوق بصمة"
      />

      <div className="admin-inq-page" dir="rtl">
        <Container
          fluid="xl"
          className="px-2 px-md-4 py-3"
          style={{ maxWidth: '100%', boxSizing: 'border-box' }}
        >
          {/* Breadcrumb + Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '0.7rem',
                fontFamily: 'Cairo, sans-serif',
                flexWrap: 'wrap',
              }}
            >
              <Link
                to="/admin/dashboard"
                style={{
                  color: FUND_THEME.accent,
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                لوحة الإدارة
              </Link>
              <FaChevronLeft size={9} style={{ opacity: 0.4 }} />
              <span style={{ opacity: 0.7 }}>طلبات التبرعات</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: FUND_THEME.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 16px ${FUND_THEME.shadow}`,
                  flexShrink: 0,
                }}
              >
                <FaWhatsapp size={19} color="#FFFFFF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  طلبات التبرعات
                </h1>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontFamily: 'Cairo, sans-serif',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  متابعة وإدارة استفسارات المتبرعين
                </p>
              </div>
            </div>
          </motion.div>

          {stats && (
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminInquiryStatsCards
                stats={stats}
                activeFilter={status}
                onFilterClick={handleStatusChange}
              />
            </div>
          )}

          <AdminInquiryFilters
            search={localSearch}
            onSearchChange={setLocalSearch}
            status={status}
            onStatusChange={handleStatusChange}
            isSearching={isSearching}
          />

          {/* Results count */}
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
                <>عرض {inquiries.length} من {meta.total} استفسار</>
              )}
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  cursor: 'pointer',
                }}
              >
                مسح الفلاتر
              </button>
            )}
          </div>

          {loading && inquiries.length === 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '260px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--border-color)',
                    opacity: 0.4,
                    animation: 'adminInqPulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
              <style>{`
                @keyframes adminInqPulse {
                  0%, 100% { opacity: 0.4; }
                  50% { opacity: 0.85; }
                }
              `}</style>
            </div>
          ) : inquiries.length === 0 ? (
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
                  background: `${FUND_THEME.accent}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: FUND_THEME.accent,
                }}
              >
                <FaInbox size={34} opacity={0.6} />
              </div>
              <h3
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  margin: '0 0 8px',
                }}
              >
                {hasActiveFilters
                  ? 'لا توجد نتائج مطابقة'
                  : 'لا توجد استفسارات'}
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  margin: 0,
                }}
              >
                {hasActiveFilters
                  ? 'حاول تغيير الفلاتر أو كلمات البحث'
                  : 'لم يقدّم أي متبرع استفساراً بعد'}
              </p>
            </motion.div>
          ) : (
            <div className="admin-inq-grid">
              {inquiries.map((inquiry, idx) => (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.04, 0.4),
                  }}
                  style={{ minWidth: 0 }}
                >
                  <AdminInquiryCard
                    inquiry={inquiry}
                    onClick={handleCardClick}
                  />
                </motion.div>
              ))}
            </div>
          )}

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
              itemLabel="استفسار"
            />
          )}
        </Container>
      </div>

      <style>{`
        .admin-inq-page {
          background-color: var(--bg-body);
          min-height: 100vh;
          padding-top: 1rem;
          padding-bottom: 3rem;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .admin-inq-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 1600px) {
          .admin-inq-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 380px));
          }
        }
        @media (max-width: 380px) {
          .admin-inq-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default AdminInquiriesListPage;