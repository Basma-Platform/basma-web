import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaBullhorn, FaUserEdit, FaShieldAlt, FaBolt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export interface QuickActionsData {
  can_create: boolean;
  can_verify: boolean;
  profile_path: string;
  create_path: string;
  my_announcements_path: string;
  verify_path: string;
}

interface DashboardQuickActionsProps {
  actions?: QuickActionsData;
}

const DashboardQuickActions = ({ actions }: DashboardQuickActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="h-100"
    >
      <style>{`
        .quick-action-btn {
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: 'Cairo', sans-serif;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          width: 100%;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
          color: var(--text-primary);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .quick-action-btn:hover {
          transform: translateX(-4px);
          border-color: var(--primary-orange);
          color: var(--primary-orange);
          box-shadow: 0 4px 12px rgba(232, 122, 32, 0.15);
        }

        .quick-action-btn:active {
          transform: scale(0.98);
        }

        .quick-action-btn.btn-primary-action {
          background-color: var(--primary-orange);
          color: #ffffff;
          border-color: var(--primary-orange);
          box-shadow: 0 4px 14px rgba(232, 122, 32, 0.25);
        }

        .quick-action-btn.btn-primary-action:hover {
          background-color: #d66c19;
          border-color: #d66c19;
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(232, 122, 32, 0.35);
        }

        .quick-action-icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          background-color: rgba(232, 122, 32, 0.12);
          color: var(--primary-orange);
        }

        .quick-action-btn:hover .quick-action-icon-wrapper {
          background-color: var(--primary-orange);
          color: #ffffff;
        }

        .quick-action-btn.btn-primary-action .quick-action-icon-wrapper {
          background-color: rgba(255, 255, 255, 0.22);
          color: #ffffff;
        }

        .quick-action-btn.btn-primary-action:hover .quick-action-icon-wrapper {
          background-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
        }
      `}</style>

      <Card
        className="h-100 d-flex flex-column justify-content-between"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 4px 16px var(--shadow-sm)',
        }}
      >
        <div>
          <h5
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 800,
              marginBottom: '1.2rem',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaBolt style={{ color: 'var(--primary-orange)' }} /> الإجراءات السريعة
          </h5>

          <div className="d-flex flex-column gap-25 gap-2">
            {/* Create Announcement Action */}
            {actions?.can_create !== false && (
              <Link
                to={actions?.create_path || '/dashboard/create-announcement'}
                className="quick-action-btn btn-primary-action"
              >
                <span>إضافة إعلان جديد</span>
                <span className="quick-action-icon-wrapper">
                  <FaPlus size={14} />
                </span>
              </Link>
            )}

            {/* Manage My Announcements */}
            <Link
              to={actions?.my_announcements_path || '/dashboard/my-announcements'}
              className="quick-action-btn"
            >
              <span>إدارة إعلاناتي</span>
              <span className="quick-action-icon-wrapper">
                <FaBullhorn size={14} />
              </span>
            </Link>

            {/* Edit Profile */}
            <Link
              to={actions?.profile_path || '/dashboard/profile'}
              className="quick-action-btn"
            >
              <span>تعديل الملف الشخصي</span>
              <span className="quick-action-icon-wrapper">
                <FaUserEdit size={14} />
              </span>
            </Link>

            {/* Verify Identity (shown if can_verify is true) */}
            {actions?.can_verify && (
              <Link
                to={actions?.verify_path || '/dashboard/verify-identity'}
                className="quick-action-btn"
              >
                <span>توثيق الهوية</span>
                <span className="quick-action-icon-wrapper">
                  <FaShieldAlt size={14} />
                </span>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DashboardQuickActions;