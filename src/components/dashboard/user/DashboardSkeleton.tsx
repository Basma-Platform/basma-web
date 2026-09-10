import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const DashboardSkeleton = () => {
  const SkeletonBlock = ({ height, borderRadius = '10px', className = '', style }: any) => (
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
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh', paddingBottom: '3rem' }}>
      <Container fluid="xl" className="py-4 px-3 px-md-4">
        {/* Header Grid Skeleton: 1/2 - 1/4 - 1/4 Split */}
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
              <SkeletonBlock height="24px" className="mb-2" style={{ width: '45%' }} />
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
              <SkeletonBlock height="14px" className="mb-2" style={{ width: '60%' }} />
              <SkeletonBlock height="32px" className="mb-2" style={{ width: '75%' }} borderRadius="10px" />
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
              <SkeletonBlock height="16px" className="mb-3" style={{ width: '50%' }} />
              <SkeletonBlock height="22px" className="mb-2" style={{ width: '80%' }} />
              <SkeletonBlock height="6px" borderRadius="10px" />
            </Card>
          </Col>
        </Row>

        {/* Stats Cards Skeleton */}
        <Row className="g-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Col key={i} xs={12} sm={6} lg={3}>
              <Card
                className="p-3"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                }}
              >
                <SkeletonBlock height="16px" className="mb-3" style={{ width: '50%' }} />
                <SkeletonBlock height="28px" style={{ width: '70%' }} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts (2/3) and Quick Actions (1/3) Skeleton */}
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
              <SkeletonBlock height="20px" className="mb-4" style={{ width: '30%' }} />
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
                <SkeletonBlock height="20px" className="mb-3" style={{ width: '50%' }} />
                <SkeletonBlock height="40px" className="mb-2" borderRadius="12px" />
                <SkeletonBlock height="40px" className="mb-2" borderRadius="12px" />
                <SkeletonBlock height="40px" borderRadius="12px" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Recent Announcements Skeleton */}
        <Card
          className="p-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
          }}
        >
          <SkeletonBlock height="20px" className="mb-3" style={{ width: '25%' }} />
          <SkeletonBlock height="60px" className="mb-2" borderRadius="12px" />
          <SkeletonBlock height="60px" borderRadius="12px" />
        </Card>
      </Container>
    </div>
  );
};

export default DashboardSkeleton;