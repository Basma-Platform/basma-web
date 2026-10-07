import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaExchangeAlt } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import {
  buildBaseOption,
  buildXAxis,
  buildYAxis,
  buildAreaGradient,
  CHART_COLORS,
} from '../admin/charts/echartsTheme';
import type { DashboardCharts as DashboardChartsType } from '../../../types';

interface DashboardChartsProps {
  charts: DashboardChartsType;
}

type TabKey = 'exchange' | 'views';

const DashboardCharts = ({ charts }: DashboardChartsProps) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('exchange');

  // ============================================
  // Tab config
  // ============================================
  const tabs: {
    key: TabKey;
    label: string;
    Icon: React.ComponentType<{ size?: number }>;
    accent: string;
    unit: string;
    totalLabel: string;
  }[] = [
    {
      key: 'exchange',
      label: 'عروض وطلبات الخدمات',
      Icon: FaExchangeAlt,
      accent: CHART_COLORS.orange,
      unit: 'خدمة',
      totalLabel: 'إجمالي الشهر',
    },
    {
      key: 'views',
      label: 'المشاهدات',
      Icon: FaEye,
      accent: CHART_COLORS.cyan,
      unit: 'مشاهدة',
      totalLabel: 'إجمالي الشهر',
    },
  ];

  const activeTabConfig = tabs.find((t) => t.key === activeTab)!;

  // ============================================
  // Monthly total
  // ============================================
  const monthlyTotal = useMemo(() => {
    const data =
      activeTab === 'exchange'
        ? charts.weekly_announcements.data
        : charts.weekly_views.data;
    return data.reduce((sum, n) => sum + n, 0);
  }, [activeTab, charts]);

  // ============================================
  // Chart option
  // ============================================
  const option = useMemo(() => {
    const base = buildBaseOption(isDark);

    const rawLabels =
      activeTab === 'exchange'
        ? charts.weekly_announcements.labels
        : charts.weekly_views.labels;

    const rawData =
      activeTab === 'exchange'
        ? charts.weekly_announcements.data
        : charts.weekly_views.data;

    const accent = activeTabConfig.accent;
    const dataLabel = activeTabConfig.label;

    // Short axis labels: "الأسبوع 2" → "أ2"
    const shortLabels = rawLabels.map((label) => {
      const weekMatch = label.match(/الأسبوع\s*(\d+)/);
      if (weekMatch) return `أ${weekMatch[1]}`;
      return label.length > 5 ? label.slice(0, 4) + '…' : label;
    });

    const xAxis = buildXAxis(shortLabels, isDark);
    const yAxis = buildYAxis(isDark);

    // ✅ Hide ECharts' own legend (we render our own below the chart)
    const baseWithHiddenLegend = {
      ...base,
      legend: { show: false },
    };

    if (activeTab === 'exchange') {
      // ---------- EXCHANGE (Bar) ----------
      return {
        ...baseWithHiddenLegend,
        grid: {
          top: 30,
          left: 12,
          right: 12,
          bottom: 12,
          containLabel: true,
        },
        tooltip: {
          ...(base.tooltip as any),
          axisPointer: {
            type: 'shadow',
            shadowStyle: { color: `${accent}12` },
          },
          formatter: (params: any) => {
            const p = params[0];
            const fullLabel = rawLabels[p.dataIndex] ?? p.axisValue;
            return `
              <div style="font-family: Cairo, sans-serif; direction: rtl; min-width: 120px;">
                <div style="font-weight:700; margin-bottom:6px; color:${accent};">
                  ${fullLabel}
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${accent};"></span>
                  <span>${dataLabel}:</span>
                  <strong style="color:${accent};">${p.value}</strong>
                </div>
              </div>
            `;
          },
        },
        xAxis: { ...xAxis, boundaryGap: true },
        yAxis,
        series: [
          {
            name: dataLabel,
            type: 'bar',
            data: rawData,
            barWidth: '50%',
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: CHART_COLORS.orangeLight },
                  { offset: 1, color: CHART_COLORS.orange },
                ],
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 12,
                shadowColor: `${accent}55`,
              },
            },
            animationDuration: 800,
            animationEasing: 'cubicOut',
          },
        ],
      };
    }

    // ---------- VIEWS (Line) ----------
    return {
      ...baseWithHiddenLegend,
      grid: {
        top: 30,
        left: 12,
        right: 12,
        bottom: 12,
        containLabel: true,
      },
      tooltip: {
        ...(base.tooltip as any),
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: accent,
            type: 'dashed',
            opacity: 0.6,
          },
        },
        formatter: (params: any) => {
          const p = params[0];
          const fullLabel = rawLabels[p.dataIndex] ?? p.axisValue;
          return `
            <div style="font-family: Cairo, sans-serif; direction: rtl; min-width: 120px;">
              <div style="font-weight:700; margin-bottom:6px; color:${accent};">
                ${fullLabel}
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${accent};"></span>
                <span>${dataLabel}:</span>
                <strong style="color:${accent};">${p.value}</strong>
              </div>
            </div>
          `;
        },
      },
      xAxis: { ...xAxis, boundaryGap: false },
      yAxis,
      series: [
        {
          name: dataLabel,
          type: 'line',
          data: rawData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 9,
          showSymbol: true,
          lineStyle: {
            width: 3,
            color: accent,
          },
          itemStyle: {
            color: accent,
            borderColor: isDark ? '#4a3626' : '#FFFFFF',
            borderWidth: 2,
          },
          areaStyle: {
            color: buildAreaGradient(accent),
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 12,
              shadowColor: `${accent}80`,
            },
          },
          animationDuration: 900,
          animationEasing: 'cubicOut',
        },
      ],
    };
  }, [activeTab, charts, isDark, activeTabConfig]);

  // ============================================
  // Render
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        boxShadow: '0 4px 16px var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* ============================================ */}
      {/* Header */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '1rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: title + monthly total */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: `${activeTabConfig.accent}15`,
              color: activeTabConfig.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.3s ease',
            }}
          >
            <activeTabConfig.Icon size={15} />
          </div>
          <div>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 1.2,
              }}
            >
              نشاط الشهر
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                fontFamily: 'Cairo, sans-serif',
                marginTop: '2px',
              }}
            >
              {activeTabConfig.totalLabel}:{' '}
              <strong
                style={{
                  color: activeTabConfig.accent,
                  fontWeight: 800,
                }}
              >
                {monthlyTotal.toLocaleString('en-US')}
              </strong>{' '}
              {activeTabConfig.unit}
            </div>
          </div>
        </div>

        {/* Right: tabs */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? tab.accent : 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive
                    ? '0 2px 8px var(--shadow-sm)'
                    : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* Chart */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{ width: '100%', minHeight: '260px' }}
        >
          <ReactECharts
            option={option}
            style={{ height: '260px', width: '100%' }}
            opts={{ renderer: 'svg' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </motion.div>
      </AnimatePresence>

      {/* ============================================ */}
      {/* Legend — BELOW the chart, clean and centered */}
      {/* ============================================ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '0.85rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: activeTabConfig.accent,
            boxShadow: `0 0 8px ${activeTabConfig.accent}80`,
            flexShrink: 0,
          }}
        />
        <span>{activeTabConfig.label}</span>
      </div>
    </motion.div>
  );
};

export default DashboardCharts;