import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import DashboardSidebar from './Main_Layout_Components/DashboardSidebar';
import DashboardHeader from './Main_Layout_Components/DashboardHeader';
import DashboardStats from './Main_Layout_Components/DashboardStats';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Check if mobile
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
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
      {/* ✅ Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
        />
      )}

      {/* ✅ Sidebar */}
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
        }}
      >
        {/* ✅ Header */}
        <DashboardHeader
          title={isAdmin ? 'لوحة الإدارة' : 'لوحة التحكم'}
          onToggleSidebar={toggleSidebar}
        />

        {/* ✅ Page Content */}
        <Container fluid style={{ padding: '24px', flex: 1 }}>
          {/* Stats */}
          <DashboardStats isAdmin={isAdmin} />

          {/* Page Content */}
          {children || <Outlet />}
        </Container>
      </main>
    </div>
  );
};

export default MainLayout;