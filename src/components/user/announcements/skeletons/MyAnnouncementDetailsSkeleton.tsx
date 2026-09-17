import { Container, Row, Col } from 'react-bootstrap';
import { FaChevronLeft } from 'react-icons/fa';

const MyAnnouncementDetailsSkeleton = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        paddingTop: '1rem',
        paddingBottom: '3rem',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <style>{`
        @keyframes shimmerPulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.9; }
          100% { opacity: 0.5; }
        }
        .skeleton-shimmer {
          animation: shimmerPulse 1.5s ease-in-out infinite;
          background-color: var(--border-color);
          border-radius: 8px;
        }
      `}</style>

      <Container fluid="xl" className="px-3 px-md-4">
        {/* Breadcrumb Skeleton */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1rem',
          }}
        >
          <div className="skeleton-shimmer" style={{ width: '80px', height: '14px' }} />
          <FaChevronLeft size={10} style={{ opacity: 0.3 }} />
          <div className="skeleton-shimmer" style={{ width: '60px', height: '14px' }} />
          <FaChevronLeft size={10} style={{ opacity: 0.3 }} />
          <div className="skeleton-shimmer" style={{ width: '120px', height: '14px' }} />
        </div>

        <Row className="g-4">
          {/* Main Content Column */}
          <Col xs={12} lg={8}>
            {/* Image Carousel Placeholder */}
            <div
              className="skeleton-shimmer"
              style={{
                width: '100%',
                height: '340px',
                borderRadius: '18px',
                marginBottom: '12px',
              }}
            />

            {/* Main Card Placeholder */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '18px',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 16px var(--shadow-sm)',
              }}
            >
              {/* Title & Badge Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '1rem',
                }}
              >
                <div className="skeleton-shimmer" style={{ width: '70%', height: '28px' }} />
                <div className="skeleton-shimmer" style={{ width: '80px', height: '26px', borderRadius: '20px' }} />
              </div>

              {/* Tags Row */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div className="skeleton-shimmer" style={{ width: '70px', height: '22px', borderRadius: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', borderRadius: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '60px', height: '22px', borderRadius: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '110px', height: '22px', borderRadius: '8px' }} />
              </div>

              {/* Stats Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  padding: '12px 0',
                  borderTop: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1.25rem',
                }}
              >
                <div className="skeleton-shimmer" style={{ width: '70px', height: '16px' }} />
                <div className="skeleton-shimmer" style={{ width: '70px', height: '16px' }} />
                <div className="skeleton-shimmer" style={{ width: '90px', height: '16px' }} />
              </div>

              {/* Region Box Placeholder */}
              <div
                className="skeleton-shimmer"
                style={{ width: '100%', height: '40px', borderRadius: '10px', marginBottom: '1.25rem' }}
              />

              {/* Description Blocks */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="skeleton-shimmer" style={{ width: '80px', height: '16px', marginBottom: '10px' }} />
                <div className="skeleton-shimmer" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '95%:', height: '14px', marginBottom: '8px' }} />
                <div className="skeleton-shimmer" style={{ width: '60%', height: '14px' }} />
              </div>

              {/* WhatsApp Box Placeholder */}
              <div
                className="skeleton-shimmer"
                style={{ width: '100%', height: '48px', borderRadius: '12px' }}
              />
            </div>
          </Col>

          {/* Sidebar Actions Column */}
          <Col xs={12} lg={4}>
            <div style={{ position: 'sticky', top: '90px' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '18px',
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 16px var(--shadow-sm)',
                  marginBottom: '1rem',
                }}
              >
                <div className="skeleton-shimmer" style={{ width: '100px', height: '18px', marginBottom: '16px' }} />

                {/* Action Button Placeholders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '48px', borderRadius: '11px' }} />
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '48px', borderRadius: '11px' }} />
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '48px', borderRadius: '11px' }} />
                  <div className="skeleton-shimmer" style={{ width: '100%', height: '48px', borderRadius: '11px' }} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyAnnouncementDetailsSkeleton;