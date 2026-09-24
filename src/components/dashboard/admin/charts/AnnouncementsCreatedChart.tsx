import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import {
  buildBaseOption,
  buildXAxis,
  buildYAxis,
  buildAreaGradient,
  CHART_COLORS,
} from './echartsTheme';
import type { ChartTimeSeries } from '../../../../types';

interface AnnouncementsCreatedChartProps {
  data: ChartTimeSeries;
  height?: number;
}

/**
 * Announcements Created — Area chart (green theme)
 */
const AnnouncementsCreatedChart = ({
  data,
  height = 260,
}: AnnouncementsCreatedChartProps) => {
  const { isDark } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, [isDark]);

  const option = useMemo(() => {
    const base = buildBaseOption(isDark);

    return {
      ...base,
      color: [CHART_COLORS.green, CHART_COLORS.orange],
      grid: { ...base.grid, top: 45, bottom: 8 },
      legend: {
        ...base.legend,
        data: data.series.map((s) => s.name),
        top: 0,
        right: 0,
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
      series: data.series.map((s, idx) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        lineStyle: { width: 2.5 },
        areaStyle: idx === 0 ? { color: buildAreaGradient(CHART_COLORS.green) } : undefined,
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

export default AnnouncementsCreatedChart;