import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import {
  buildBaseOption,
  buildXAxis,
  CHART_COLORS,
} from './echartsTheme';
import type { ChartDualSeries } from '../../../../types';

interface PaymentMethodsChartProps {
  data: ChartDualSeries;
  height?: number;
}

/**
 * Payment Methods — Dual-axis bar chart
 * - Series 1: order count (left y-axis)
 * - Series 2: revenue in ILS (right y-axis)
 */
const PaymentMethodsChart = ({
  data,
  height = 280,
}: PaymentMethodsChartProps) => {
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

    // Series 0 = count, Series 1 = revenue
    const countSeries = data.series[0];
    const revenueSeries = data.series[1];

    return {
      ...base,
      color: [CHART_COLORS.cyan, CHART_COLORS.orange],
      grid: { ...base.grid, top: 45, bottom: 8, right: 45, left: 45 },
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
          const method = items[0]?.axisValue || '';
          const rows = items
            .map(
              (item: any) =>
                `<div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                  <span style="width:8px;height:8px;border-radius:50%;background:${item.color};display:inline-block;"></span>
                  <span style="color:var(--text-muted);font-size:11px;">${item.seriesName}:</span>
                  <strong style="color:var(--text-primary);font-size:12px;">${item.value.toLocaleString('en-US')}${item.seriesName.includes('الإيراد') ? ' ₪' : ''}</strong>
                </div>`
            )
            .join('');
          return `<div style="font-family:Cairo,sans-serif;direction:rtl;">
            <div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">${method}</div>
            ${rows}
          </div>`;
        },
      },
      xAxis: buildXAxis(data.labels, isDark, { rotate: false }),
      yAxis: [
        {
          type: 'value',
          position: 'right',
          name: 'الطلبات',
          nameTextStyle: {
            color: mutedColor,
            fontFamily: 'Cairo, sans-serif',
            fontSize: 10,
            padding: [0, 0, 0, 30],
          },
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
        {
          type: 'value',
          position: 'left',
          name: 'الإيراد (₪)',
          nameTextStyle: {
            color: mutedColor,
            fontFamily: 'Cairo, sans-serif',
            fontSize: 10,
            padding: [0, 30, 0, 0],
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            color: mutedColor,
            fontFamily: 'system-ui, sans-serif',
            fontSize: 10,
          },
        },
      ],
      series: [
        {
          name: countSeries?.name || 'عدد الطلبات',
          type: 'bar',
          yAxisIndex: 0,
          data: countSeries?.data || [],
          barWidth: '35%',
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: CHART_COLORS.cyanLight },
                { offset: 1, color: CHART_COLORS.cyan },
              ],
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(23,162,184,0.5)',
            },
          },
        },
        {
          name: revenueSeries?.name || 'الإيراد (ILS)',
          type: 'bar',
          yAxisIndex: 1,
          data: revenueSeries?.data || [],
          barWidth: '35%',
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
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

export default PaymentMethodsChart;