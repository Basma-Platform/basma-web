import { Container, Row, Col, Card } from 'react-bootstrap';

const AdminProfileSkeleton = () => {
  return (
    <div className="admin-profile-skeleton">
      <Container fluid="xl" className="px-3 px-md-4 py-3">
        {/* ============================================ */}
        {/* 1. Breadcrumb & Title Section Skeleton */}
        {/* ============================================ */}
        <div className="admin-header-meta-skeleton mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div
              className="admin-bone shimmer"
              style={{ width: '90px', height: '14px', borderRadius: '4px' }}
            />
            <span style={{ opacity: 0.4, color: 'var(--text-muted)' }}>/</span>
            <div
              className="admin-bone shimmer"
              style={{ width: '70px', height: '14px', borderRadius: '4px' }}
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            <div
              className="admin-bone shimmer"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                flexShrink: 0,
              }}
            />
            <div className="w-100">
              <div
                className="admin-bone shimmer mb-2"
                style={{ width: '160px', height: '22px', borderRadius: '6px' }}
              />
              <div
                className="admin-bone shimmer"
                style={{ width: '240px', height: '12px', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 2. Profile Header Card Skeleton */}
        {/* ============================================ */}
        <Card className="admin-main-card-skeleton p-3 p-md-4 mb-4">
          <div className="d-flex flex-column align-items-center text-center w-100">
            {/* Avatar Circle */}
            <div
              className="admin-bone shimmer mb-3"
              style={{ width: '130px', height: '130px', borderRadius: '50%' }}
            />

            {/* Welcome Message */}
            <div
              className="admin-bone shimmer mb-2"
              style={{ width: '120px', height: '14px', borderRadius: '6px' }}
            />

            {/* Name */}
            <div
              className="admin-bone shimmer mb-2"
              style={{ width: '180px', height: '24px', borderRadius: '6px' }}
            />

            {/* Role Badge */}
            <div
              className="admin-bone shimmer mb-4"
              style={{ width: '120px', height: '24px', borderRadius: '20px' }}
            />

            {/* Divider */}
            <div
              className="admin-bone shimmer mb-4"
              style={{ width: '60px', height: '3px', borderRadius: '2px' }}
            />

            {/* Info Grid */}
            <Row
              className="g-3 w-100 m-0 justify-content-center"
              style={{ maxWidth: '900px' }}
            >
              {[1, 2, 3].map((i) => (
                <Col key={i} xs={12} sm={6} lg={4} className="px-2">
                  <div className="admin-info-box-skeleton p-2 p-md-3 d-flex align-items-center gap-3 w-100">
                    <div
                      className="admin-bone shimmer"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        flexShrink: 0,
                      }}
                    />
                    <div className="w-100 text-start">
                      <div
                        className="admin-bone shimmer mb-2"
                        style={{
                          width: '50%',
                          height: '10px',
                          borderRadius: '3px',
                        }}
                      />
                      <div
                        className="admin-bone shimmer"
                        style={{
                          width: '80%',
                          height: '12px',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>

        {/* ============================================ */}
        {/* 3. Stats Cards Row Skeleton (7 cards) */}
        {/* ============================================ */}
        <Row className="g-3 mb-4 m-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Col key={i} xs={12} sm={6} lg={3} className="px-2">
              <Card className="admin-stat-card-skeleton p-3 h-100 w-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    className="admin-bone shimmer"
                    style={{
                      width: '60%',
                      height: '12px',
                      borderRadius: '4px',
                    }}
                  />
                  <div
                    className="admin-bone shimmer"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                    }}
                  />
                </div>
                <div
                  className="admin-bone shimmer mb-2"
                  style={{ width: '50%', height: '22px', borderRadius: '6px' }}
                />
                <div
                  className="admin-bone shimmer"
                  style={{ width: '80px', height: '10px', borderRadius: '3px' }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* ============================================ */}
        {/* 4. Activity Cards Skeleton */}
        {/* ============================================ */}
        <Card className="admin-activity-card-skeleton p-3 p-md-4 mb-4">
          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <div
              className="admin-bone shimmer"
              style={{ width: '44px', height: '44px', borderRadius: '12px' }}
            />
            <div className="w-100">
              <div
                className="admin-bone shimmer mb-2"
                style={{ width: '120px', height: '16px', borderRadius: '6px' }}
              />
              <div
                className="admin-bone shimmer"
                style={{ width: '200px', height: '10px', borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* Activity Items */}
          <Row className="g-3 m-0">
            {[1, 2, 3, 4].map((i) => (
              <Col key={i} xs={12} sm={6} lg={3} className="px-2">
                <div className="admin-info-box-skeleton p-3 d-flex align-items-center gap-3">
                  <div
                    className="admin-bone shimmer"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      flexShrink: 0,
                    }}
                  />
                  <div className="w-100 text-start">
                    <div
                      className="admin-bone shimmer mb-2"
                      style={{
                        width: '50%',
                        height: '20px',
                        borderRadius: '6px',
                      }}
                    />
                    <div
                      className="admin-bone shimmer"
                      style={{
                        width: '80%',
                        height: '10px',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* ============================================ */}
        {/* 5. Edit Profile Form Skeleton */}
        {/* ============================================ */}
        <Card className="admin-form-card-skeleton p-3 p-md-4 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <div
                className="admin-bone shimmer"
                style={{ width: '44px', height: '44px', borderRadius: '12px' }}
              />
              <div>
                <div
                  className="admin-bone shimmer mb-2"
                  style={{ width: '140px', height: '16px', borderRadius: '6px' }}
                />
                <div
                  className="admin-bone shimmer"
                  style={{
                    width: '200px',
                    height: '10px',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
            <div
              className="admin-bone shimmer"
              style={{ width: '120px', height: '36px', borderRadius: '10px' }}
            />
          </div>

          <div className="mb-3">
            <div
              className="admin-bone shimmer mb-2"
              style={{ width: '30%', height: '12px', borderRadius: '4px' }}
            />
            <div
              className="admin-bone shimmer"
              style={{ width: '100%', height: '42px', borderRadius: '12px' }}
            />
          </div>

          <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--bg-input)' }}>
            <div
              className="admin-bone shimmer"
              style={{ width: '70%', height: '12px', borderRadius: '4px' }}
            />
          </div>
        </Card>

        {/* ============================================ */}
        {/* 6. Change Password Form Skeleton */}
        {/* ============================================ */}
        <Card className="admin-form-card-skeleton p-3 p-md-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div
                className="admin-bone shimmer"
                style={{ width: '44px', height: '44px', borderRadius: '12px' }}
              />
              <div>
                <div
                  className="admin-bone shimmer mb-2"
                  style={{ width: '140px', height: '16px', borderRadius: '6px' }}
                />
                <div
                  className="admin-bone shimmer"
                  style={{
                    width: '220px',
                    height: '10px',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
            <div
              className="admin-bone shimmer"
              style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            />
          </div>
        </Card>
      </Container>

      {/* ============================================ */}
      {/* Skeleton Styles */}
      {/* ============================================ */}
      <style>{`
        .admin-profile-skeleton {
          background-color: var(--bg-body);
          min-height: 100vh;
          direction: rtl;
          width: 100%;
          overflow-x: hidden;
        }

        .admin-main-card-skeleton,
        .admin-stat-card-skeleton,
        .admin-activity-card-skeleton,
        .admin-form-card-skeleton {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
        }

        .admin-info-box-skeleton {
          background-color: var(--bg-input);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        /* Light Theme Default Skeleton Bone Color */
        .admin-bone {
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

        /* Dark Theme Support */
        [data-theme="dark"] .admin-bone {
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

export default AdminProfileSkeleton;