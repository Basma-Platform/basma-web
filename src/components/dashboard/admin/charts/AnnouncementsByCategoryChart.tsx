import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import { buildBaseOption, CHART_COLORS } from './echartsTheme';
import type { ChartSimple } from '../../../../types';

interface AnnouncementsByCategoryChartProps {
  data: ChartSimple;
  height?: number;
}

/**
 * Announcements by Category — Donut chart
 * - 2 slices: goods vs services
 */
const AnnouncementsByCategoryChart = ({
  data,
  height = 260,
}: AnnouncementsByCategoryChartProps) => {
  const { isDark } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, [isDark]);

  const option = useMemo(() => {
    const base = buildBaseOption(isDark);
    const cardBg = isDark ? '#4a3626' : '#FFFFFF';

    const total = data.series.reduce((a, b) => a + b, 0);

    return {
      ...base,
      tooltip: {
        ...base.tooltip,
        trigger: 'item',
        formatter: (params: any) =>
          `<div style="font-family:Cairo,sans-serif;direction:rtl;">
            <div style="font-size:12px;font-weight:700;color:var(--text-primary);">${params.name}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">
              <strong style="color:${params.color};font-size:14px;">${params.value.toLocaleString('en-US')}</strong>
              (${params.percent}%)
            </div>
          </div>`,
      },
      legend: {
        ...base.legend,
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        top: 'auto',
        data: data.labels,
      },
      series: [
        {
          name: 'توزيع الإعلانات',
          type: 'pie',
          radius: ['55%', '78%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: cardBg,
            borderWidth: 3,
          },
          label: {
            show: true,
            position: 'center',
            formatter: () =>
              `{total|${total.toLocaleString('en-US')}}\n{sub|إجمالي}`,
            rich: {
              total: {
                fontSize: 22,
                fontWeight: 900,
                color: 'var(--text-primary)',
                fontFamily: 'system-ui, sans-serif',
                lineHeight: 28,
              },
              sub: {
                fontSize: 11,
                color: 'var(--text-muted)',
                fontFamily: 'Cairo, sans-serif',
                lineHeight: 16,
              },
            },
          },
          emphasis: {
            label: { show: true, scale: true },
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(232,122,32,0.35)',
            },
          },
          labelLine: { show: false },
          color: [CHART_COLORS.orange, CHART_COLORS.cyan],
          data: data.labels.map((label, i) => ({
            name: label,
            value: data.series[i] || 0,
          })),
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

export default AnnouncementsByCategoryChart;