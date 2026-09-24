import type { EChartsOption } from 'echarts';

/**
 * Shared ECharts theme configuration for Admin Dashboard
 * - Full RTL support (reversed axes)
 * - Cairo font
 * - Brand color palette
 * - Consistent tooltips + legends
 */

// Brand palette from the platform
export const CHART_COLORS = {
  orange: '#E87A20',
  orangeLight: '#F5A623',
  brown: '#8B5A2B',
  green: '#28A745',
  greenLight: '#4FCB6E',
  red: '#DC3545',
  redLight: '#F56575',
  cyan: '#17A2B8',
  cyanLight: '#20C9E0',
  yellow: '#FFC107',
  yellowLight: '#FFD966',
  purple: '#9C27B0',
  purpleLight: '#BA68C8',
  pink: '#E91E63',
  pinkLight: '#F56575',
  gray: '#6C757D',
} as const;

// Default multi-series palette
export const CHART_PALETTE = [
  CHART_COLORS.orange,
  CHART_COLORS.cyan,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.yellow,
  CHART_COLORS.red,
  CHART_COLORS.pink,
  CHART_COLORS.brown,
];

/**
 * Get CSS variable value from the document
 * (so ECharts can use the same theme as the app)
 */
export const getCssVar = (name: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
};

/**
 * Build a base ECharts option with RTL + theming
 */
export const buildBaseOption = (isDark: boolean): EChartsOption => {
  const textColor = isDark ? '#f0e6d8' : '#333333';
  const mutedColor = isDark ? '#c4a88a' : '#8B5A2B';
  const borderColor = isDark
    ? 'rgba(196, 168, 138, 0.15)'
    : 'rgba(139, 90, 43, 0.1)';
  const cardBg = isDark ? '#4a3626' : '#FFFFFF';

  return {
    textStyle: {
      fontFamily: 'Cairo, sans-serif',
      color: textColor,
    },
    grid: {
      top: 40,
      left: 12,
      right: 12,
      bottom: 12,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: cardBg,
      borderColor: borderColor,
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        fontFamily: 'Cairo, sans-serif',
        color: textColor,
        fontSize: 12,
      },
      extraCssText: `border-radius: 10px; box-shadow: 0 8px 24px ${
        isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)'
      };`,
    },
    legend: {
      textStyle: {
        fontFamily: 'Cairo, sans-serif',
        color: mutedColor,
        fontSize: 11,
      },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 12,
    },
  };
};

/**
 * Build RTL X axis config
 */
export const buildXAxis = (
  labels: string[],
  isDark: boolean,
  options: { rotate?: boolean } = {}
): any => {
  const mutedColor = isDark ? '#c4a88a' : '#8B5A2B';
  const borderColor = isDark
    ? 'rgba(196, 168, 138, 0.15)'
    : 'rgba(139, 90, 43, 0.1)';

  return {
    type: 'category',
    data: labels,
    inverse: true, // ← RTL
    boundaryGap: false,
    axisLine: {
      lineStyle: { color: borderColor },
    },
    axisTick: { show: false },
    axisLabel: {
      color: mutedColor,
      fontFamily: 'Cairo, sans-serif',
      fontSize: 10,
      rotate: options.rotate ? 45 : 0,
      hideOverlap: true,
      interval: 'auto',
    },
  };
};

/**
 * Build RTL Y axis config
 */
export const buildYAxis = (isDark: boolean): any => {
  const mutedColor = isDark ? '#c4a88a' : '#8B5A2B';
  const borderColor = isDark
    ? 'rgba(196, 168, 138, 0.15)'
    : 'rgba(139, 90, 43, 0.1)';

  return {
    type: 'value',
    position: 'right', // ← RTL: numbers on the right
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: {
        color: borderColor,
        type: 'dashed',
      },
    },
    axisLabel: {
      color: mutedColor,
      fontFamily: 'system-ui, sans-serif',
      fontSize: 10,
      formatter: (value: number) => {
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
        return value.toString();
      },
    },
  };
};

/**
 * Build area gradient (top → bottom fade)
 */
export const buildAreaGradient = (color: string) => ({
  type: 'linear' as const,
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: color + '60' },
    { offset: 1, color: color + '00' },
  ],
});