import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Users, 
  Briefcase, 
  Layers, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowUpRight,
  LucideIcon
} from 'lucide-react';
import { StatMetric } from './types';

// Map icon string names to Lucide icons
const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Layers,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
};

interface StatsWidgetProps {
  metric: StatMetric;
  className?: string;
  showSparkline?: boolean;
  variant?: 'glass' | 'solid' | 'compact';
  onClick?: () => void;
}

// Generate smooth SVG path from sparkline numbers
const generateSparklineSvg = (data: number[], width = 96, height = 36, isPositive = true) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 3;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  // Construct SVG cubic bezier smoothing path
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const fillPath = `${path} L ${width - padding} ${height} L ${padding} ${height} Z`;
  const strokeColor = isPositive ? '#10B981' : '#F43F5E';
  const gradientId = `sparkline-grad-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path 
        d={path} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  metric,
  className = '',
  showSparkline = true,
  variant = 'glass',
  onClick,
}) => {
  const IconComponent = (metric.icon && ICON_MAP[metric.icon]) || Sparkles;
  const isPositive = metric.trend === 'up' || (metric.changePercent !== undefined && metric.changePercent >= 0);
  const isNeutral = metric.trend === 'neutral' || metric.changePercent === 0;

  const bgStyles = 
    variant === 'solid'
      ? 'bg-[#1A1633] text-white border border-[#A38BFF]/40 shadow-xl'
      : variant === 'compact'
      ? 'bg-white/75 backdrop-blur-md border border-[#A38BFF]/25 shadow-xs'
      : 'bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm hover:border-[#A38BFF] hover:shadow-lg transition-all';

  return (
    <div
      onClick={onClick}
      className={`relative p-5 sm:p-6 rounded-3xl ${bgStyles} flex flex-col justify-between transition-all duration-300 group overflow-hidden ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Top row: Title and Icon */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
          {metric.title}
        </span>
        <div className="w-10 h-10 rounded-2xl bg-[#F2F0FF] text-[#3D2FD1] group-hover:bg-[#3D2FD1] group-hover:text-white transition-all flex items-center justify-center shadow-xs shrink-0">
          <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>

      {/* Middle row: Big Value & Sparkline */}
      <div className="flex items-baseline justify-between gap-2 my-1">
        <div className="text-2xl sm:text-3xl font-black text-[#1A1633] tracking-tight font-display">
          {metric.value}
        </div>
        {showSparkline && metric.sparkline && metric.sparkline.length > 1 && (
          <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            {generateSparklineSvg(metric.sparkline, 80, 32, isPositive)}
          </div>
        )}
      </div>

      {/* Bottom row: Trend indicator & Supporting note */}
      <div className="mt-3 pt-3 border-t border-[#A38BFF]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        {metric.changePercent !== undefined && (
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
              isNeutral
                ? 'bg-slate-100 text-slate-600'
                : isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                : 'bg-rose-50 text-rose-700 border border-rose-200/50'
            }`}
          >
            {isNeutral ? (
              <Minus className="w-3 h-3" />
            ) : isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {metric.changePercent}%
            </span>
          </div>
        )}

        <span className="text-[11px] text-slate-500 truncate max-w-[160px] font-medium" title={metric.supportingText || metric.period}>
          {metric.supportingText || metric.period || 'Platform data'}
        </span>
      </div>
    </div>
  );
};

interface StatsGridProps {
  metrics: StatMetric[];
  columns?: 2 | 3 | 4;
  className?: string;
  onMetricClick?: (metric: StatMetric) => void;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  metrics,
  columns = 4,
  className = '',
  onMetricClick,
}) => {
  const colClass = 
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${colClass} gap-4 sm:gap-6 ${className}`}>
      {metrics.map((metric) => (
        <StatsWidget
          key={metric.id}
          metric={metric}
          onClick={onMetricClick ? () => onMetricClick(metric) : undefined}
        />
      ))}
    </div>
  );
};
