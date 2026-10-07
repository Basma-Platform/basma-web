import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import {
  buildBaseOption,
  buildXAxis,
  buildYAxis,
  CHART_PALETTE,
  CHART_COLORS,
} from './echartsTheme';
import type { ChartTimeSeries } from '../../../../types';

interface ActivityOverviewChartProps {
  data: ChartTimeSeries;
  height?: number;
}

/**
 * Activity Overview — Multi-line chart
 * - 6 series: users, announcements, ratings, reports, verifications, featured
 * - Each series has its own color from palette
 */
const ActivityOverviewChart = ({
  data,
  height = 320,
}: ActivityOverviewChartProps) => {
  const { isDark } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, [isDark]);

  // Assign semantic colors to each series
  const seriesColors: Record<string, string> = {
    'مستخدمون': CHART_COLORS.orange,
    'إعلانات': CHART_COLORS.green,
    'تقييمات': CHART_COLORS.yellow,
    'بلاغات': CHART_COLORS.red,
    'طلبات توثيق': CHART_COLORS.cyan,
    'طلبات تمييز': CHART_COLORS.purple,
  };

  const option = useMemo(() => {
    const base = buildBaseOption(isDark);
    const colors = data.series.map(
      (s, i) => seriesColors[s.name] || CHART_PALETTE[i % CHART_PALETTE.length]
    );

    return {
      ...base,
      color: colors,
      grid: { ...base.grid, top: 55, bottom: 8 },
      legend: {
        ...base.legend,
        data: data.series.map((s) => s.name),
        top: 0,
        right: 0,
        itemGap: 10,
      },
      tooltip: {
        ...base.tooltip,
        formatter: (params: any) => {
          const items = Array.isArray(params) ? params : [params];
          const date = items[0]?.axisValue || '';
          const rows = items
            .map(
              (item: any) =>
                `<div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                  <span style="width:8px;height:8px;border-radius:50%;background:${item.color};display:inline-block;"></span>
                  <span style="color:var(--text-muted);font-size:11px;">${item.seriesName}:</span>
                  <strong style="color:var(--text-primary);font-size:12px;">${item.value.toLocaleString('en-US')}</strong>
                </div>`
            )
            .join('');
          return `<div style="font-family:Cairo,sans-serif;direction:rtl;">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">${date}</div>
            ${rows}
          </div>`;
        },
      },
      xAxis: buildXAxis(data.labels, isDark),
      yAxis: buildYAxis(isDark),
      series: data.series.map((s) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { width: 2 },
        data: s.data,
        emphasis: { focus: 'series' },
      })),
    } as any;
  }, [data, isDark]);

  if (!ready) {
    return (
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'var(--bg-input)',
          borderRadius: '12px',
          opacity: 0.4,
        }}
      />
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ width: '100%', height: `${height}px` }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default ActivityOverviewChart;