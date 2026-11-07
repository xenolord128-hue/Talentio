import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  Users 
} from 'lucide-react';
import { AnalyticsDataPoint, TimeRangeOption } from './types';
import { 
  DEFAULT_ANALYTICS_7D, 
  DEFAULT_ANALYTICS_30D, 
  DEFAULT_ANALYTICS_90D, 
  DEFAULT_ANALYTICS_1Y 
} from './mockWidgetData';

interface AnalyticsWidgetProps {
  title?: string;
  subtitle?: string;
  initialTimeRange?: TimeRangeOption;
  className?: string;
  onExport?: (data: AnalyticsDataPoint[], range: TimeRangeOption) => void;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({
  title = 'Revenue & Performance Analytics',
  subtitle = 'Real-time financial velocity and project volume',
  initialTimeRange = '30D',
  className = '',
  onExport,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>(initialTimeRange);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'growth'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Select dataset based on timeRange
  const data: AnalyticsDataPoint[] = useMemo(() => {
    switch (timeRange) {
      case '7D':
        return DEFAULT_ANALYTICS_7D;
      case '30D':
        return DEFAULT_ANALYTICS_30D;
      case '90D':
        return DEFAULT_ANALYTICS_90D;
      case '1Y':
        return DEFAULT_ANALYTICS_1Y;
      default:
        return DEFAULT_ANALYTICS_30D;
    }
  }, [timeRange]);

  // Compute summary stats
  const values = data.map((d) => d[selectedMetric]);
  const total = values.reduce((acc, curr) => acc + curr, 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const average = Math.round(total / (values.length || 1));

  // Chart coordinates
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingX * 2;

  const points = useMemo(() => {
    const range = max - min || 1;
    return data.map((d, idx) => {
      const x = paddingX + (idx / Math.max(data.length - 1, 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((d[selectedMetric] - min) / range) * chartHeight;
      return { x, y, data: d };
    });
  }, [data, selectedMetric, max, min, chartWidth, chartHeight]);

  // Construct smooth bezier curve path
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  }, [points]);

  const fillAreaD = useMemo(() => {
    if (!pathD || points.length === 0) return '';
    const last = points[points.length - 1];
    const first = points[0];
    const bottomY = paddingTop + chartHeight;
    return `${pathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [pathD, points, paddingTop, chartHeight]);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  const formatMetricValue = (val: number) => {
    if (selectedMetric === 'revenue') return `$${val.toLocaleString()}`;
    if (selectedMetric === 'growth') return `${val}%`;
    return val.toLocaleString();
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm relative overflow-hidden ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#1A1633] font-display">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F2F0FF] text-[#3D2FD1]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Synced</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        {/* Range Selector & Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Pills */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-xs font-semibold">
            <button
              onClick={() => setSelectedMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'revenue'
                  ? 'bg-white text-[#3D2FD1] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setSelectedMetric('orders')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'orders'
                  ? 'bg-white text-[#3D2FD1] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setSelectedMetric('growth')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'growth'
                  ? 'bg-white text-[#3D2FD1] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Growth %
            </button>
          </div>

          {/* Time Range Pills */}
          <div className="inline-flex p-1 rounded-xl bg-[#F2F0FF] border border-[#A38BFF]/30 text-xs font-bold">
            {(['7D', '30D', '90D', '1Y'] as TimeRangeOption[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-[#3D2FD1] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#3D2FD1]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export Action */}
          {onExport && (
            <button
              onClick={() => onExport(data, timeRange)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Export Analytics Data"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] border border-[#A38BFF]/20 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {selectedMetric === 'revenue' ? 'Total Period Volume' : 'Total Count'}
          </span>
          <span className="text-base sm:text-lg font-black text-[#1A1633] font-display">
            {formatMetricValue(total)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Peak Day / Interval
          </span>
          <span className="text-base sm:text-lg font-black text-[#3D2FD1] font-display">
            {formatMetricValue(max)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Average per Interval
          </span>
          <span className="text-base sm:text-lg font-black text-slate-700 font-display">
            {formatMetricValue(average)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active Hover Value
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600 font-display">
            {activePoint ? formatMetricValue(activePoint.data[selectedMetric]) : '—'}
          </span>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full h-64 sm:h-72">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D2FD1" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#6E5BFF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#A38BFF" stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3D2FD1" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * pct;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray={pct === 1 ? '0' : '4 4'}
                />
              </g>
            );
          })}

          {/* Area fill */}
          {fillAreaD && <path d={fillAreaD} fill="url(#analyticsGradient)" />}

          {/* Main line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#3D2FD1"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadowFilter)"
            />
          )}

          {/* Data points & Interactive hover targets */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                {/* Vertical guideline on hover */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + chartHeight}
                    stroke="#6E5BFF"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? '#FFFFFF' : '#3D2FD1'}
                  stroke="#3D2FD1"
                  strokeWidth={isHovered ? 3.5 : 2}
                  className="transition-all duration-200"
                />

                {/* Invisible large click/hover hit area */}
                <rect
                  x={pt.x - chartWidth / (points.length * 2)}
                  y={0}
                  width={chartWidth / points.length}
                  height={svgHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* X-axis labels */}
                <text
                  x={pt.x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold ${
                    isHovered ? 'fill-[#3D2FD1] font-bold' : 'fill-slate-400'
                  }`}
                >
                  {pt.data.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Float Tooltip */}
        {activePoint && (
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 z-20 hidden sm:block transition-all duration-150"
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${(activePoint.y / svgHeight) * 100}%`,
            }}
          >
            <div className="bg-[#1A1633] text-white px-3 py-1.5 rounded-xl shadow-xl border border-[#A38BFF]/40 text-xs whitespace-nowrap space-y-0.5">
              <div className="font-extrabold text-[#A38BFF] font-mono">
                {formatMetricValue(activePoint.data[selectedMetric])}
              </div>
              <div className="text-[10px] text-slate-300">
                {activePoint.data.date} • {activePoint.data.orders} orders
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Note */}
      <div className="mt-4 pt-4 border-t border-[#A38BFF]/20 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#3D2FD1]" />
          <span>Timeline aggregated via Talentio Escrow Ledger</span>
        </span>
        <span className="text-[#3D2FD1] font-bold">100% Real-time Verified</span>
      </div>
    </div>
  );
};
