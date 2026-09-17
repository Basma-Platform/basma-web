import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const DashboardSkeleton = () => {
  const SkeletonBlock = ({
    height,
    borderRadius = '10px',
    className = '',
    style,
  }: any) => (
    <motion.div
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      className={`skeleton-shimmer ${className}`}
      style={{
        height,
        borderRadius,
        backgroundColor: 'var(--border-color)',
        ...style,
      }}
    />
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        paddingBottom: '3rem',
      }}
    >
      <style>{`
        /* Stats Grid - Matches DashboardStatsCards Layout */
        .dashboard-stats-grid-skeleton {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          width: 100%;
        }

        @media (max-width: 1199px) {
          .dashboard-stats-grid-skeleton {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 767px) {
          .dashboard-stats-grid-skeleton {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .dashboard-stats-grid-skeleton {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Container fluid="xl" className="py-4 px-3 px-md-4">
        {/* ============================================ */}
        {/* Header Grid Skeleton: Welcome + Clock + Monthly */}
        {/* ============================================ */}
        <Row className="g-3 mb-4">
          <Col xs={12} lg={6}>
            <Card
              className="p-4 h-100"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
              }}
            >
              <SkeletonBlock
                height="24px"
                className="mb-2"
                style={{ width: '45%' }}
              />
              <SkeletonBlock height="14px" style={{ width: '65%' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Card
              className="p-3 h-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
              }}
            >
              <SkeletonBlock
                height="14px"
                className="mb-2"
                style={{ width: '60%' }}
              />
              <SkeletonBlock
                height="32px"
                className="mb-2"
                style={{ width: '75%' }}
                borderRadius="10px"
              />
              <SkeletonBlock height="12px" style={{ width: '50%' }} />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Card
              className="p-3 h-100 d-flex flex-column justify-content-center"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
              }}
            >
              <SkeletonBlock
                height="16px"
                className="mb-3"
                style={{ width: '50%' }}
              />
              <SkeletonBlock
                height="22px"
                className="mb-2"
                style={{ width: '80%' }}
              />
              <SkeletonBlock height="6px" borderRadius="10px" />
            </Card>
          </Col>
        </Row>

        {/* ============================================ */}
        {/* Stats Cards Skeleton - 5 Cards (No Entry Animation) */}
        {/* ============================================ */}
        <div className="mb-4">
          <div className="dashboard-stats-grid-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <Card
                  className="position-relative overflow-hidden h-100"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '1.1rem 1rem',
                    boxShadow: '0 4px 12px var(--shadow-sm)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <SkeletonBlock
                        height="12px"
                        style={{ width: '60%', marginBottom: '10px' }}
                      />
                      <SkeletonBlock
                        height="22px"
                        style={{ width: '45%' }}
                        borderRadius="6px"
                      />
                    </div>

                    <SkeletonBlock
                      height="42px"
                      style={{
                        width: '42px',
                        borderRadius: '11px',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* Charts (2/3) and Quick Actions (1/3) Skeleton */}
        {/* ============================================ */}
        <Row className="g-3 mb-4">
          <Col xs={12} lg={8}>
            <Card
              className="p-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                height: '320px',
              }}
            >
              <SkeletonBlock
                height="20px"
                className="mb-4"
                style={{ width: '30%' }}
              />
              <SkeletonBlock height="220px" borderRadius="12px" />
            </Card>
          </Col>
          <Col xs={12} lg={4}>
            <Card
              className="p-4 h-100 d-flex flex-column justify-content-between"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
              }}
            >
              <div>
                <SkeletonBlock
                  height="20px"
                  className="mb-3"
                  style={{ width: '50%' }}
                />
                <SkeletonBlock
                  height="40px"
                  className="mb-2"
                  borderRadius="12px"
                />
                <SkeletonBlock
                  height="40px"
                  className="mb-2"
                  borderRadius="12px"
                />
                <SkeletonBlock height="40px" borderRadius="12px" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* ============================================ */}
        {/* Recent Announcements (lg=8) + Recent Notifications (lg=4) */}
        {/* ============================================ */}
        <Row className="g-3">
          <Col xs={12} lg={8}>
            <Card
              className="p-4 h-100"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
              }}
            >
              <SkeletonBlock
                height="20px"
                className="mb-3"
                style={{ width: '25%' }}
              />
              <SkeletonBlock
                height="60px"
                className="mb-2"
                borderRadius="12px"
              />
              <SkeletonBlock
                height="60px"
                className="mb-2"
                borderRadius="12px"
              />
              <SkeletonBlock height="60px" borderRadius="12px" />
            </Card>
          </Col>

          <Col xs={12} lg={4}>
            <Card
              className="p-4 h-100"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <SkeletonBlock height="20px" style={{ width: '50%' }} />
                <SkeletonBlock height="14px" style={{ width: '20%' }} />
              </div>
              <SkeletonBlock
                height="60px"
                className="mb-2"
                borderRadius="12px"
              />
              <SkeletonBlock
                height="60px"
                className="mb-2"
                borderRadius="12px"
              />
              <SkeletonBlock
                height="60px"
                className="mb-2"
                borderRadius="12px"
              />
              <SkeletonBlock height="60px" borderRadius="12px" />
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardSkeleton;