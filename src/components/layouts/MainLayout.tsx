import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import DashboardSidebar from './Main_Layout_Components/DashboardSidebar';
import DashboardHeader from './Main_Layout_Components/DashboardHeader';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isVerified = user?.is_verified === true;

  // ============================================
  // Responsive: sync `isMobile` on mount + resize
  // ============================================
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============================================
  // ✅ Body scroll lock when mobile sidebar is open
  //    This prevents fast scrolling from breaking the layout
  //    and stops the underlying page from moving.
  // ============================================
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobile, sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const getTitle = () => {
    if (isAdmin) return 'لوحة الإدارة';
    if (isVerified) return 'لوحة التحكم - موثق';
    return 'لوحة التحكم';
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-body)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* ✅ Sidebar handles its own overlay on mobile — no duplicate here */}

      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* ✅ Main Content */}
      <main
        style={{
          flex: 1,
          marginRight: sidebarOpen && !isMobile ? '280px' : '0',
          transition: 'margin-right 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          // ✅ Prevent content shift/layout breakage on mobile
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
        }}
      >
        <DashboardHeader
          title={getTitle()}
          onToggleSidebar={toggleSidebar}
        />

        <Container
          fluid
          style={{
            padding: '24px',
            flex: 1,
            // ✅ Prevent content overflow on fast scroll
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          {children || <Outlet />}
        </Container>
      </main>
    </div>
  );
};

export default MainLayout;