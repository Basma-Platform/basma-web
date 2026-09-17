import { Container, Row, Col, Card } from 'react-bootstrap';

const ProfileSkeleton = () => {
  return (
    <div className="profile-page-skeleton">
      <Container fluid="xl" className="px-3 px-md-4 py-3">
        
        {/* ============================================ */}
        {/* 1. Breadcrumb & Title Section Skeleton */}
        {/* ============================================ */}
        <div className="profile-header-meta-skeleton mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="profile-bone shimmer" style={{ width: '70px', height: '14px', borderRadius: '4px' }} />
            <span style={{ opacity: 0.4, color: 'var(--text-muted)' }}>/</span>
            <div className="profile-bone shimmer" style={{ width: '60px', height: '14px', borderRadius: '4px' }} />
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="profile-bone shimmer" style={{ width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0 }} />
            <div className="w-100">
              <div className="profile-bone shimmer mb-2" style={{ width: '160px', height: '22px', borderRadius: '6px' }} />
              <div className="profile-bone shimmer" style={{ width: '220px', height: '12px', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 2. Profile Overview Banner Card Skeleton */}
        {/* ============================================ */}
        <Card className="profile-main-card-skeleton p-3 p-md-4 mb-4">
          <div className="d-flex flex-column align-items-center text-center w-100">
            {/* Avatar Circle */}
            <div className="profile-bone shimmer mb-3" style={{ width: '110px', height: '110px', borderRadius: '50%' }} />
            {/* Name */}
            <div className="profile-bone shimmer mb-2" style={{ width: '180px', height: '20px', borderRadius: '6px' }} />
            {/* Badge */}
            <div className="profile-bone shimmer mb-4" style={{ width: '100px', height: '18px', borderRadius: '10px' }} />

            {/* Quick Info Grid inside Header */}
            <Row className="g-3 w-100 m-0 justify-content-center" style={{ maxWidth: '900px' }}>
              {[1, 2, 3, 4].map((i) => (
                <Col key={i} xs={12} sm={6} lg={3} className="px-2">
                  <div className="profile-info-box-skeleton p-2 p-md-3 d-flex align-items-center gap-3 w-100">
                    <div className="profile-bone shimmer" style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0 }} />
                    <div className="w-100 text-start">
                      <div className="profile-bone shimmer mb-2" style={{ width: '50%', height: '10px', borderRadius: '3px' }} />
                      <div className="profile-bone shimmer" style={{ width: '80%', height: '12px', borderRadius: '4px' }} />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>

        {/* ============================================ */}
        {/* 3. Stats Cards Row Skeleton */}
        {/* ============================================ */}
        <Row className="g-3 mb-4 m-0">
          {[1, 2, 3, 4].map((i) => (
            <Col key={i} xs={12} sm={6} lg={3} className="px-2">
              <Card className="profile-stat-card-skeleton p-3 h-100 w-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="profile-bone shimmer" style={{ width: '50%', height: '12px', borderRadius: '4px' }} />
                  <div className="profile-bone shimmer" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
                </div>
                <div className="profile-bone shimmer mb-2" style={{ width: '40px', height: '22px', borderRadius: '6px' }} />
                <div className="profile-bone shimmer" style={{ width: '80px', height: '10px', borderRadius: '3px' }} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* ============================================ */}
        {/* 4. Main Columns Grid (Forms & Sidebar) */}
        {/* ============================================ */}
        <Row className="g-4 m-0">
          {/* Left Column: Edit Profile & Password Forms */}
          <Col xs={12} lg={8} className="px-2">
            <Card className="profile-form-card-skeleton p-3 p-md-4 mb-4">
              <div className="profile-bone shimmer mb-4" style={{ width: '160px', height: '18px', borderRadius: '6px' }} />
              <Row className="g-3 m-0 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <Col key={i} xs={12} md={6} className="px-2">
                    <div className="profile-bone shimmer mb-2" style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
                    <div className="profile-bone shimmer" style={{ width: '100%', height: '42px', borderRadius: '10px' }} />
                  </Col>
                ))}
              </Row>
              <div className="px-2">
                <div className="profile-bone shimmer" style={{ width: '140px', height: '40px', borderRadius: '10px' }} />
              </div>
            </Card>

            <Card className="profile-form-card-skeleton p-3 p-md-4">
              <div className="profile-bone shimmer mb-4" style={{ width: '150px', height: '18px', borderRadius: '6px' }} />
              <div className="d-flex flex-column gap-3 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="profile-bone shimmer mb-2" style={{ width: '30%', height: '12px', borderRadius: '4px' }} />
                    <div className="profile-bone shimmer" style={{ width: '100%', height: '42px', borderRadius: '10px' }} />
                  </div>
                ))}
              </div>
              <div>
                <div className="profile-bone shimmer" style={{ width: '160px', height: '40px', borderRadius: '10px' }} />
              </div>
            </Card>
          </Col>

          {/* Right Column: Verification & Monthly Limits */}
          <Col xs={12} lg={4} className="px-2">
            <Card className="profile-sidebar-card-skeleton p-3 p-md-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="profile-bone shimmer" style={{ width: '44px', height: '44px', borderRadius: '10px' }} />
                <div className="profile-bone shimmer" style={{ width: '90px', height: '20px', borderRadius: '6px' }} />
              </div>
              <div className="profile-bone shimmer mb-2" style={{ width: '70%', height: '16px', borderRadius: '6px' }} />
              <div className="profile-bone shimmer mb-3" style={{ width: '100%', height: '32px', borderRadius: '6px' }} />
              <div className="profile-bone shimmer" style={{ width: '100%', height: '38px', borderRadius: '10px' }} />
            </Card>

            <Card className="profile-sidebar-card-skeleton p-3 p-md-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="profile-bone shimmer" style={{ width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0 }} />
                <div className="w-100">
                  <div className="profile-bone shimmer mb-2" style={{ width: '60%', height: '12px', borderRadius: '4px' }} />
                  <div className="profile-bone shimmer" style={{ width: '40%', height: '10px', borderRadius: '3px' }} />
                </div>
              </div>
              <div className="profile-bone shimmer mb-3" style={{ width: '100%', height: '80px', borderRadius: '10px' }} />
              <div className="profile-bone shimmer mb-3" style={{ width: '100%', height: '6px', borderRadius: '4px' }} />
              <div className="profile-bone shimmer" style={{ width: '100%', height: '38px', borderRadius: '10px' }} />
            </Card>
          </Col>
        </Row>

        {/* ============================================ */}
        {/* 5. Footer Support Note Skeleton */}
        {/* ============================================ */}
        <div className="profile-footer-skeleton mt-4 p-3 d-flex align-items-center justify-content-center">
          <div className="profile-bone shimmer" style={{ width: '220px', height: '14px', borderRadius: '4px' }} />
        </div>

      </Container>

      {/* ============================================ */}
      {/* Component Styles & Theme Architecture      */}
      {/* ============================================ */}
      <style>{`
        .profile-page-skeleton {
          background-color: var(--bg-body);
          min-height: 100vh;
          direction: rtl;
          width: 100%;
          overflow-x: hidden;
        }

        .profile-main-card-skeleton,
        .profile-stat-card-skeleton,
        .profile-form-card-skeleton,
        .profile-sidebar-card-skeleton {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .profile-info-box-skeleton {
          background-color: var(--bg-input);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .profile-footer-skeleton {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        /* Light Theme Default Skeleton Bone Color */
        .profile-bone {
          position: relative;
          overflow: hidden;
          background-color: #e8e0d8;
        }

        /* Shimmer Animation Sweep */
        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%
          );
          animation: shimmerSweep 1.8s infinite;
        }

        /* Dark Theme Support via data-theme attribute */
        [data-theme="dark"] .profile-bone {
          background-color: #5a4432 !important;
        }

        [data-theme="dark"] .shimmer::after {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 50%,
            transparent 100%
          );
        }

        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ProfileSkeleton;