import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import {
  buildBaseOption,
  CHART_COLORS,
} from './echartsTheme';
import type { ChartSimple } from '../../../../types';

interface AnnouncementsByGovernorateChartProps {
  data: ChartSimple;
  height?: number;
}

/**
 * Announcements by Governorate — Horizontal Bar chart
 * - RTL: bars start from the right
 * - Gradient bar fill
 */
const AnnouncementsByGovernorateChart = ({
  data,
  height = 260,
}: AnnouncementsByGovernorateChartProps) => {
  const { isDark } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, [isDark]);

  const option = useMemo(() => {
    const base = buildBaseOption(isDark);
    const mutedColor = isDark ? '#c4a88a' : '#8B5A2B';
    const borderColor = isDark
      ? 'rgba(196, 168, 138, 0.15)'
      : 'rgba(139, 90, 43, 0.1)';

    return {
      ...base,
      grid: {
        top: 10,
        left: 12,
        right: 12,
        bottom: 8,
        containLabel: true,
      },
      tooltip: {
        ...base.tooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: { color: 'rgba(232,122,32,0.08)' },
        },
        formatter: (params: any) => {
          const item = Array.isArray(params) ? params[0] : params;
          return `<div style="font-family:Cairo,sans-serif;direction:rtl;">
            <div style="font-size:12px;font-weight:700;color:var(--text-primary);">${item.axisValue}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">
              <strong style="color:${CHART_COLORS.orange};font-size:14px;">${item.value.toLocaleString('en-US')}</strong> إعلان
            </div>
          </div>`;
        },
      },
      xAxis: {
        type: 'value',
        position: 'bottom',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: borderColor, type: 'dashed' },
        },
        axisLabel: {
          color: mutedColor,
          fontFamily: 'system-ui, sans-serif',
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'category',
        data: data.labels,
        inverse: true, // ← RTL
        axisLine: { lineStyle: { color: borderColor } },
        axisTick: { show: false },
        axisLabel: {
          color: mutedColor,
          fontFamily: 'Cairo, sans-serif',
          fontSize: 11,
          fontWeight: 600,
        },
      },
      series: [
        {
          type: 'bar',
          data: data.series.map((value) => ({
            value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: CHART_COLORS.orangeLight },
                  { offset: 1, color: CHART_COLORS.orange },
                ],
              },
              borderRadius: [0, 8, 8, 0],
            },
          })),
          barWidth: '55%',
          label: {
            show: true,
            position: 'right',
            color: mutedColor,
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'system-ui, sans-serif',
            formatter: (params: any) =>
              params.value.toLocaleString('en-US'),
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(232,122,32,0.5)',
            },
          },
        },
      ],
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

export default AnnouncementsByGovernorateChart;