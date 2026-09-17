import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaInfinity, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import SEO from '../../components/SEO';
import DashboardStatsCards from '../../components/dashboard/user/DashboardStatsCards';
import DashboardCharts from '../../components/dashboard/user/DashboardCharts';
import DashboardRecentAnnouncements from '../../components/dashboard/user/DashboardRecentAnnouncements';
import DashboardRecentNotifications from '../../components/dashboard/user/DashboardRecentNotifications';
import DashboardVerificationCard from '../../components/dashboard/user/DashboardVerificationCard';
import DashboardQuickActions from '../../components/dashboard/user/DashboardQuickActions';
import DashboardSkeleton from '../../components/dashboard/user/DashboardSkeleton';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardResponse } from '../../types';

const UserDashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboard();
        setData(res);
      } catch (err: any) {
        setError(err.response?.data?.message || 'حدث خطأ أثناء تحميل بيانات لوحة التحكم');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Gaza Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeFormatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Gaza',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateFormatted = now.toLocaleDateString('ar-EG', {
        timeZone: 'Asia/Gaza',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      setTimeStr(timeFormatted);
      setDateStr(dateFormatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <Container className="py-5">
        <SEO title="لوحة التحكم - منصة بصمة" description="إدارة حسابك وإعلاناتك على منصة بصمة" />
        <Alert variant="danger" className="text-center">
          {error || 'تعذر تحميل البيانات'}
        </Alert>
      </Container>
    );
  }

  const firstName = data.user.name ? data.user.name.split(' ')[0] : '';
  const isVerified = data.verification.is_verified;
  const usedCount = data.stats.monthly_used;
  const limitCount = data.stats.monthly_limit;
  const percentage = isVerified
    ? 100
    : Math.min(100, Math.round((usedCount / (limitCount || 1)) * 100));

  const locationText = (() => {
    const govName = data.user.governorate?.name;
    const cityName = data.user.city?.name;

    if (govName && cityName) return `${govName} - ${cityName}`;
    if (govName) return govName;
    if (cityName) return cityName;
    return 'غير محدد';
  })();

  return (
    <>
      <SEO
        title={`لوحة التحكم - ${data.user.name}`}
        description="صفحة لوحة التحكم الخاصة بمستخدم منصة بصمة لمتابعة الإحصائيات والإعلانات"
      />

      <style>{`
        .dashboard-container {
          background-color: var(--bg-body);
          min-height: 100vh;
          padding-bottom: 3rem;
          overflow-x: hidden;
          width: 100%;
          animation: dashboardFadeIn 0.25s ease-out;
        }

        @keyframes dashboardFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .digital-clock-box {
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 6px 14px;
          display: inline-block;
          margin: 4px auto;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .digital-clock-time {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--primary-orange);
          direction: ltr;
          display: inline-block;
          font-variant-numeric: tabular-nums;
        }

        .en-nums {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-feature-settings: "lnum" 1, "tnum" 1 !important;
          font-variant-numeric: lining-nums tabular-nums !important;
          direction: ltr !important;
          display: inline-block;
        }

        @media (max-width: 576px) {
          .dashboard-container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          .dashboard-card-pad {
            padding: 0.9rem !important;
          }
          .digital-clock-time {
            font-size: 1.1rem !important;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <Container fluid="xl" className="py-3 py-md-4 px-2 px-md-4">
          {/* ============================================ */}
          {/* Header Row: Welcome + Clock + Monthly */}
          {/* ============================================ */}
          <Row className="g-3 mb-4 align-items-stretch">
            <Col xs={12} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-100"
              >
                <Card
                  className="h-100 p-3 p-md-4 d-flex justify-content-center dashboard-card-pad"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px var(--shadow-sm)',
                  }}
                >
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h3
                      style={{
                        color: 'var(--text-secondary)',
                        fontFamily: 'Cairo, sans-serif',
                        fontWeight: 800,
                        margin: 0,
                        fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
                      }}
                    >
                      أهلاً بك، {firstName}!
                    </h3>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: isVerified
                          ? 'rgba(40, 167, 69, 0.12)'
                          : 'rgba(232, 122, 32, 0.12)',
                        color: isVerified ? 'var(--success)' : 'var(--primary-orange)',
                        border: `1px solid ${
                          isVerified
                            ? 'rgba(40, 167, 69, 0.3)'
                            : 'rgba(232, 122, 32, 0.3)'
                        }`,
                      }}
                    >
                      {isVerified ? (
                        <>
                          <FaCheckCircle size={13} /> حساب موثق
                        </>
                      ) : (
                        <>
                          <FaClock size={13} /> غير موثق
                        </>
                      )}
                    </span>
                  </div>

                  <p
                    className="mt-2 mb-0 text-truncate"
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontFamily: 'Cairo, sans-serif',
                    }}
                  >
                    {locationText} • عضو منذ{' '}
                    <span className="en-nums">
                      {new Date(data.user.created_at).getFullYear()}
                    </span>
                  </p>
                </Card>
              </motion.div>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="h-100"
              >
                <Card
                  className="h-100 p-3 d-flex flex-column justify-content-center text-center dashboard-card-pad"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px var(--shadow-sm)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                    <FaClock style={{ color: 'var(--primary-orange)' }} size={13} />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      توقيت غزة مباشر
                    </span>
                  </div>

                  <div className="digital-clock-box">
                    <span className="digital-clock-time">{timeStr || '00:00:00'}</span>
                  </div>

                  <div className="mt-1 d-flex align-items-center justify-content-center gap-1">
                    <FaCalendarAlt size={10} style={{ color: 'var(--text-muted)' }} />
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        fontFamily: 'Cairo, sans-serif',
                      }}
                    >
                      {dateStr}
                    </span>
                  </div>
                </Card>
              </motion.div>
            </Col>

            <Col xs={12} sm={6} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="h-100"
              >
                <Card
                  className="h-100 p-3 d-flex flex-column justify-content-center dashboard-card-pad"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px var(--shadow-sm)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        fontFamily: 'Cairo, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <FaBullhorn style={{ color: 'var(--primary-orange)' }} size={13} />
                      الحد الشهري
                    </span>

                    {isVerified && (
                      <Badge
                        bg="success"
                        className="d-flex align-items-center gap-1 px-2 py-1"
                      >
                        <FaInfinity size={10} /> موثق
                      </Badge>
                    )}
                  </div>

                  {isVerified ? (
                    <div className="py-1 text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <FaInfinity size={20} style={{ color: '#28a745' }} />
                        <span
                          style={{
                            color: '#28a745',
                            fontFamily: 'Cairo, sans-serif',
                            fontWeight: 800,
                            fontSize: '1.15rem',
                          }}
                        >
                          غير محدود
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'Cairo, sans-serif',
                        }}
                      >
                        حسابك متاح ونشط بالكامل
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex justify-content-between align-items-baseline mb-1">
                        <span
                          style={{
                            fontSize: '1.05rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            fontFamily: 'Cairo, sans-serif',
                          }}
                        >
                          <span className="en-nums">{usedCount}</span>{' '}
                          <small
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            من <span className="en-nums">{limitCount}</span>
                          </small>
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--primary-orange)',
                          }}
                        >
                          <span className="en-nums">{percentage}%</span>
                        </span>
                      </div>

                      <div
                        style={{
                          height: '6px',
                          backgroundColor: 'var(--bg-input)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor:
                              percentage >= 90 ? '#dc3545' : 'var(--primary-orange)',
                            borderRadius: '10px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </Col>
          </Row>

          {/* ============================================ */}
          {/* Verification Card (if not verified) */}
          {/* ============================================ */}
          {!isVerified && (
            <div className="mb-4">
              <DashboardVerificationCard verification={data.verification} />
            </div>
          )}

          {/* ============================================ */}
          {/* Stats Cards - 5 Cards */}
          {/* ============================================ */}
          <div className="mb-4">
            <DashboardStatsCards stats={data.stats} />
          </div>

          {/* ============================================ */}
          {/* Charts (lg=8) + Quick Actions (lg=4) */}
          {/* ============================================ */}
          <Row className="g-3 mb-4 align-items-stretch">
            <Col xs={12} lg={8}>
              <DashboardCharts charts={data.charts} />
            </Col>
            <Col xs={12} lg={4}>
              <DashboardQuickActions actions={data.quick_actions} />
            </Col>
          </Row>

          {/* ============================================ */}
          {/* Recent Announcements (lg=8) + Recent Notifications (lg=4) */}
          {/* ============================================ */}
          <Row className="g-3 align-items-stretch">
            <Col xs={12} lg={8}>
              <DashboardRecentAnnouncements
                announcements={data.recent_announcements}
              />
            </Col>
            <Col xs={12} lg={4}>
              <DashboardRecentNotifications
                initialNotifications={data.recent_notifications}
                initialUnreadCount={data.unread_notifications_count}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserDashboard;