import { Container, Row, Col, Card } from 'react-bootstrap';

const VerificationSkeleton = () => {
  const SkeletonBlock = ({
    height,
    width,
    borderRadius = '10px',
    style,
  }: {
    height: string;
    width?: string;
    borderRadius?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      className="verification-skeleton-shimmer"
      style={{
        height,
        width: width || '100%',
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
        paddingTop: '1rem',
        paddingBottom: '3rem',
      }}
      dir="rtl"
    >
      <style>{`
        @keyframes verificationShimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.85; }
          100% { opacity: 0.4; }
        }
        .verification-skeleton-shimmer {
          animation: verificationShimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      <Container fluid="xl" className="px-3 px-md-4">
        {/* Breadcrumb + Header Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <SkeletonBlock height="14px" width="160px" style={{ marginBottom: '12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SkeletonBlock height="44px" width="44px" borderRadius="14px" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <SkeletonBlock height="20px" width="70%" style={{ marginBottom: '8px' }} />
              <SkeletonBlock height="12px" width="90%" />
            </div>
          </div>
        </div>

        {/* Main Fluid Card */}
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <Card
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: 'clamp(1.25rem, 3vw, 2rem)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                {/* Icon Circle */}
                <SkeletonBlock
                  height="76px"
                  width="76px"
                  borderRadius="50%"
                  style={{ margin: '0 auto 1.25rem' }}
                />

                {/* Badge Placeholder */}
                <SkeletonBlock
                  height="26px"
                  width="110px"
                  borderRadius="20px"
                  style={{ margin: '0 auto 12px' }}
                />

                {/* Title and Descriptions */}
                <SkeletonBlock height="24px" width="55%" style={{ margin: '0 auto 10px' }} />
                <SkeletonBlock height="14px" width="85%" style={{ margin: '0 auto 6px' }} />
                <SkeletonBlock height="14px" width="65%" style={{ margin: '0 auto 1.75rem' }} />

                {/* Main Content Box (Image/Upload area preview) */}
                <SkeletonBlock
                  height="220px"
                  width="100%"
                  borderRadius="16px"
                  style={{ marginBottom: '1.25rem' }}
                />

                {/* Action Button */}
                <SkeletonBlock height="48px" width="100%" borderRadius="14px" />
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerificationSkeleton;