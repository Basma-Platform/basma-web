import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import { buildBaseOption } from './echartsTheme';
import type { ChartSimple } from '../../../../types';

interface VerificationStatusChartProps {
  data: ChartSimple;
  height?: number;
}

/**
 * Verification Status — Donut chart with custom colors from API
 */
const VerificationStatusChart = ({
  data,
  height = 260,
}: VerificationStatusChartProps) => {
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
    const colors = data.colors || ['#FFC107', '#28A745', '#DC3545'];

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
          name: 'حالات التوثيق',
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
              `{total|${total.toLocaleString('en-US')}}\n{sub|طلب}`,
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
              shadowColor: 'rgba(23,162,184,0.35)',
            },
          },
          labelLine: { show: false },
          color: colors,
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

export default VerificationStatusChart;