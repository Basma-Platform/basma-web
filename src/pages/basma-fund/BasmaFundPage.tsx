import { useEffect, useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { FaHandHoldingHeart } from 'react-icons/fa';
import SEO from '../../components/SEO';
import Pagination from '../../components/shared/Pagination';

import {
  FundHero,
  FundPrivacyNotice,
  FundStatsStrip,
  FundCTASection,
  FundSectionHeader,
} from '../../components/basma-fund/shared';
import { HelpRequestGrid } from '../../components/basma-fund/help-requests';
import {
  AchievementsCarousel,
  AchievementDetailsModal,
} from '../../components/basma-fund/achievements';

import { useHelpRequests } from '../../hooks/useHelpRequests';
import { useDonationAchievements } from '../../hooks/useDonationAchievements';
import { basmaFundPublicService } from '../../services/basmaFundPublicService';

import type {
  BasmaFundPublicStats,
  DonationAchievement,
} from '../../types';

const HELP_REQUESTS_PER_PAGE = 12;
const HELP_REQUESTS_PREVIEW = 6;

const BasmaFundPage = () => {
  // ============================================
  // Data — Help Requests
  // ============================================
  const {
    requests,
    meta,
    loading: hrLoading,
    fetchList: fetchHelpRequests,
  } = useHelpRequests();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(HELP_REQUESTS_PER_PAGE);

  // ============================================
  // Data — Achievements (featured for carousel)
  // ============================================
  const {
    featured: featuredAchievements,
    featuredLoading,
    fetchFeatured,
  } = useDonationAchievements();

  const [selectedAchievement, setSelectedAchievement] =
    useState<DonationAchievement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // ============================================
  // Data — Stats
  // ============================================
  const [stats, setStats] = useState<BasmaFundPublicStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ============================================
  // Refs for scroll targets
  // ============================================
  const helpRequestsRef = { current: null as HTMLDivElement | null };

  // ============================================
  // Initial fetches
  // ============================================
  useEffect(() => {
    fetchHelpRequests({ page: 1, per_page: perPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perPage]);

  useEffect(() => {
    fetchFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let mounted = true;
    setStatsLoading(true);
    basmaFundPublicService
      .getStats()
      .then((res) => {
        if (mounted) setStats(res.data);
      })
      .catch(() => {
        /* silent — stats strip keeps showing 0s as fallback */
      })
      .finally(() => {
        if (mounted) setStatsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // ============================================
  // Page change
  // ============================================
  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
      fetchHelpRequests({ page: nextPage, per_page: perPage });
      if (helpRequestsRef.current) {
        helpRequestsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
    [fetchHelpRequests, perPage]
  );

  const handlePerPageChange = useCallback((next: number) => {
    setPerPage(next);
    setPage(1);
  }, []);

  // ============================================
  // Achievement click
  // ============================================
  const handleAchievementClick = (achievement: DonationAchievement) => {
    setSelectedAchievement(achievement);
    setDetailsOpen(true);
  };

  // ============================================
  // Hero CTAs (scroll targets)
  // ============================================
  const scrollToHelpRequests = () => {
    const el = document.getElementById('help-requests-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToAchievements = () => {
    const el = document.getElementById('achievements-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ============================================
  // Render
  // ============================================
  return (
    <>
      <SEO
        title="صندوق بصمة"
        description="منصة آمنة وموثوقة لمساعدة المحتاجين في غزة — تبرعات مباشرة عبر المنصة"
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
          {/* ============================================ */}
          {/* HERO */}
          {/* ============================================ */}
          <FundHero
            onPrimaryCTA={scrollToHelpRequests}
            onSecondaryCTA={scrollToAchievements}
          />

          {/* ============================================ */}
          {/* STATS */}
          {/* ============================================ */}
          <div style={{ marginBottom: '2rem' }}>
            <FundStatsStrip stats={stats} loading={statsLoading} />
          </div>

          {/* ============================================ */}
          {/* ACHIEVEMENTS CAROUSEL */}
          {/* ============================================ */}
          <div id="achievements-section" style={{ marginBottom: '2.5rem' }}>
            <AchievementsCarousel
              achievements={featuredAchievements}
              loading={featuredLoading}
              onCardClick={handleAchievementClick}
            />
          </div>

          {/* ============================================ */}
          {/* PRIVACY NOTICE */}
          {/* ============================================ */}
          <div style={{ marginBottom: '2.5rem' }}>
            <FundPrivacyNotice />
          </div>

          {/* ============================================ */}
          {/* HELP REQUESTS */}
          {/* ============================================ */}
          <div
            id="help-requests-section"
            ref={helpRequestsRef}
            style={{ marginBottom: '2rem' }}
          >
            <FundSectionHeader
              Icon={FaHandHoldingHeart}
              title="طلبات المساعدة"
              subtitle="تصفّح الطلبات المنشورة، وقدّم استفسارك للتبرع بشكل آمن"
            />

            <HelpRequestGrid
              requests={requests}
              loading={hrLoading && requests.length === 0}
              skeletonCount={HELP_REQUESTS_PREVIEW}
            />

            {meta && meta.last_page > 1 && (
              <Pagination
                currentPage={page}
                lastPage={meta.last_page}
                total={meta.total}
                perPage={perPage}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                perPageOptions={[8, 12, 24, 48]}
                isLoading={hrLoading}
                itemLabel="طلب"
              />
            )}
          </div>

          {/* ============================================ */}
          {/* CTA */}
          {/* ============================================ */}
          <FundCTASection />
        </Container>
      </div>

      {/* ============================================ */}
      {/* MODAL */}
      {/* ============================================ */}
      <AchievementDetailsModal
        isOpen={detailsOpen}
        achievement={selectedAchievement}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedAchievement(null);
        }}
      />
    </>
  );
};

export default BasmaFundPage;