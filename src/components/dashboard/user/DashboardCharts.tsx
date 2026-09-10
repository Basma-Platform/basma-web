import { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { FaChartLine, FaEye, FaBullhorn } from 'react-icons/fa';
import type { DashboardCharts as DashboardChartsType } from '../../../types';

interface DashboardChartsProps {
  charts: DashboardChartsType;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '8px 12px',
          boxShadow: '0 4px 16px var(--shadow-md)',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontWeight: 700, margin: 0, fontSize: '0.85rem' }}>
          {label}
        </p>
        <p style={{ color: 'var(--primary-orange)', fontWeight: 600, margin: 0, fontSize: '0.8rem' }}>
          العدد: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ charts }: DashboardChartsProps) => {
  const [activeTab, setActiveTab] = useState<'views' | 'announcements'>('views');

  const viewsData = charts.weekly_views.labels.map((label, i) => ({
    day: label,
    views: charts.weekly_views.data[i] || 0,
  }));

  const announcementsData = charts.weekly_announcements.labels.map((label, i) => ({
    day: label,
    count: charts.weekly_announcements.data[i] || 0,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="h-100">
      <Card
        className="h-100"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 4px 16px var(--shadow-sm)',
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
          <h5
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              margin: 0,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaChartLine style={{ color: 'var(--primary-orange)' }} /> نشاط الحساب الأسبوعي
          </h5>

          <Nav variant="pills" activeKey={activeTab} onSelect={(k) => setActiveTab(k as any)}>
            <Nav.Item>
              <Nav.Link
                eventKey="views"
                style={{
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  fontFamily: 'Cairo, sans-serif',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'views' ? 'var(--primary-orange)' : 'transparent',
                  color: activeTab === 'views' ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaEye size={12} /> المشاهدات
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="announcements"
                style={{
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  fontFamily: 'Cairo, sans-serif',
                  borderRadius: '8px',
                  backgroundColor: activeTab === 'announcements' ? 'var(--primary-orange)' : 'transparent',
                  color: activeTab === 'announcements' ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FaBullhorn size={12} /> الإعلانات
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <div style={{ width: '100%', height: 250, minHeight: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'views' ? (
              <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-orange)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary-orange)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--primary-orange)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            ) : (
              <BarChart data={announcementsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="var(--primary-brown)" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default DashboardCharts;