import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChevronRight,
  FaExclamationTriangle,
  FaArrowRight,
} from 'react-icons/fa';
import SEO from '../../components/SEO';

import { useHelpRequest } from '../../hooks/useHelpRequest';
import { useDonationContact } from '../../hooks/useDonationContact';

import {
  HelpRequestDetailsHero,
  HelpRequestDetailsInfo,
  HelpRequestVideoPreview,
} from '../../components/basma-fund/help-requests';
import {
  DonationInquiryModal,
  PlatformContactCard,
} from '../../components/basma-fund/inquiry';
import { FundVideoWarningModal } from '../../components/basma-fund/shared';

import { FUND_THEME } from '../../utils/helpRequestHelpers';

const HelpRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { request, loading, fetchDetail } = useHelpRequest();
  const { contact } = useDonationContact();

  const [hasAttempted, setHasAttempted] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  // ============================================
  // Fetch
  // ============================================
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setHasAttempted(false);
      try {
        await fetchDetail(Number(id));
      } catch {
        // toast handled in hook
      } finally {
        if (!cancelled) setHasAttempted(true);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, fetchDetail]);

  // ============================================
  // Handlers
  // ============================================
  const handleInquire = () => setInquiryOpen(true);
  const handleCloseInquiry = () => setInquiryOpen(false);

  const handleConfirmVideoWarning = () => {
    setWarningOpen(false);
  };

  // ============================================
  // Loading
  // ============================================
  if (loading || !hasAttempted) {
    return (
      <>
        <SEO title="تفاصيل طلب المساعدة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            paddingTop: '2rem',
            paddingBottom: '3rem',
          }}
        >
          <Container className="px-3 px-md-4" style={{ maxWidth: '1100px' }}>
            <style>{`
              @keyframes fundPageShimmer {
                0% { opacity: 0.4; }
                50% { opacity: 0.85; }
                100% { opacity: 0.4; }
              }
              .fund-page-skel {
                animation: fundPageShimmer 1.5s ease-in-out infinite;
                background-color: var(--border-color);
              }
            `}</style>
            <div
              className="fund-page-skel"
              style={{
                height: '180px',
                borderRadius: '24px',
                marginBottom: '1.5rem',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '1.5rem',
              }}
            >
              <div
                className="fund-page-skel"
                style={{ height: '360px', borderRadius: '20px' }}
              />
              <div
                className="fund-page-skel"
                style={{ height: '200px', borderRadius: '20px' }}
              />
            </div>
          </Container>
        </div>
      </>
    );
  }

  // ============================================
  // Not found
  // ============================================
  if (!request) {
    return (
      <>
        <SEO title="تفاصيل طلب المساعدة" />
        <div
          style={{
            backgroundColor: 'var(--bg-body)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
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
            <FaExclamationTriangle
              size={42}
              color="#DC3545"
              opacity={0.6}
            />
            <h3
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 800,
                margin: '1rem 0 8px',
              }}
            >
              الطلب غير موجود
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                lineHeight: 1.6,
              }}
            >
              ربما تم أرشفته أو حذفه. جرّب العودة إلى قائمة الطلبات.
            </p>
            <Link
              to="/basma-fund"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: FUND_THEME.accent,
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <FaArrowRight size={11} />
              العودة لصندوق بصمة
            </Link>
          </div>
        </div>
      </>
    );
  }

  // ============================================
  // Success
  // ============================================
  return (
    <>
      <SEO
        title={request.public_title}
        description={request.public_description.substring(0, 150) + '...'}
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
        <Container className="px-3 px-md-4" style={{ maxWidth: '1100px' }}>
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
              to="/"
              style={{
                color: 'var(--primary-orange)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              الرئيسية
            </Link>
            <FaChevronRight
              size={9}
              style={{ opacity: 0.4, transform: 'rotate(180deg)' }}
            />
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
            <span style={{ opacity: 0.7 }}>طلب #{request.id}</span>
          </motion.nav>

          {/* Hero */}
          <HelpRequestDetailsHero request={request} />

          {/* Main grid */}
          <div className="hr-details-grid">
            {/* Left column — video preview + info (NO duplicate button) */}
            <div style={{ minWidth: 0 }}>
              <HelpRequestVideoPreview
                request={request}
                onInquire={handleInquire}
              />

              <div style={{ marginTop: '1.5rem' }}>
                <HelpRequestDetailsInfo request={request} />
              </div>
            </div>

            {/* Right column — platform contact */}
            <aside style={{ minWidth: 0 }}>
              <PlatformContactCard
                contact={contact}
                whatsappPrefill={`مرحباً، لدي استفسار حول الطلب #${request.id}`}
              />
            </aside>
          </div>
        </Container>
      </div>

      {/* Modals */}
      <DonationInquiryModal
        isOpen={inquiryOpen}
        request={request}
        onClose={handleCloseInquiry}
      />

      <FundVideoWarningModal
        isOpen={warningOpen}
        onConfirm={handleConfirmVideoWarning}
        onCancel={() => setWarningOpen(false)}
      />

      {/* Responsive grid */}
      <style>{`
        .hr-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (min-width: 992px) {
          .hr-details-grid {
            grid-template-columns: minmax(0, 1fr) 340px;
          }
        }
      `}</style>
    </>
  );
};

export default HelpRequestDetailsPage;