import React from 'react';

interface RadialArcGaugeProps {
  percentage: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

/**
 * Mathematically clean semicircular radial percentage gauge
 * Sourced directly from the primary visual reference dashboard.
 * 
 * Geometry:
 * - Center: (100, 100)
 * - Radius: 80
 * - Semicircle from (20, 100) [180 deg / PI] to (180, 100) [0 deg / 0]
 * - Smooth continuous arc with no gaps, consistent stroke width (20), rounded ends.
 */
export const RadialArcGauge: React.FC<RadialArcGaugeProps> = ({
  percentage,
  label = "Orders Fulfilled",
  sublabel = "Active SLA delivery metrics",
  className = ""
}) => {
  // Clamp percentage between 0 and 100
  const clampedPct = Math.min(100, Math.max(0, Math.round(percentage)));

  // Completed arc angle: theta goes from PI (left) down to PI - PI * (clampedPct / 100)
  // At 0%: theta = PI -> (20, 100)
  // At 100%: theta = 0 -> (180, 100)
  const thetaCompleted = Math.PI * (1 - clampedPct / 100);
  const compX = 100 + 80 * Math.cos(thetaCompleted);
  const compY = 100 - 80 * Math.sin(thetaCompleted);

  // In-progress segment: next 8% or up to 95%
  const inProgressPct = Math.min(100, clampedPct + 8);
  const thetaInProgress = Math.PI * (1 - inProgressPct / 100);
  const inProgX = 100 + 80 * Math.cos(thetaInProgress);
  const inProgY = 100 - 80 * Math.sin(thetaInProgress);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg 
        className="w-full max-w-[240px] h-32 overflow-visible select-none" 
        viewBox="0 0 200 110"
      >
        <defs>
          <pattern 
            id="gauge-striped" 
            width="6" 
            height="6" 
            patternTransform="rotate(45 0 0)" 
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke="#3A5A86" strokeOpacity="0.4" strokeWidth="2" />
          </pattern>
          <linearGradient id="gauge-primary-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#23324A" />
            <stop offset="50%" stopColor="#3A5A86" />
            <stop offset="100%" stopColor="#E3EDF9" />
          </linearGradient>
        </defs>

        {/* 1. Base track (subtle translucent arc) */}
        <path 
          d="M 20,100 A 80,80 0 0,1 180,100" 
          fill="none" 
          stroke="rgba(227,237,249,0.15)" 
          strokeLinecap="round" 
          strokeWidth="20" 
        />

        {/* 2. Pending hatched / striped segment continuing to the end */}
        {inProgressPct < 99 && (
          <path 
            d={`M ${inProgX.toFixed(3)},${inProgY.toFixed(3)} A 80,80 0 0,1 180,100`} 
            fill="none" 
            stroke="url(#gauge-striped)" 
            strokeLinecap="round" 
            strokeWidth="20" 
          />
        )}

        {/* 3. In-progress intermediate segment */}
        {clampedPct < 100 && inProgressPct > clampedPct && (
          <path 
            d={`M ${compX.toFixed(3)},${compY.toFixed(3)} A 80,80 0 0,1 ${inProgX.toFixed(3)},${inProgY.toFixed(3)}`} 
            fill="none" 
            stroke="#3A5A86" 
            strokeLinecap="round" 
            strokeWidth="20" 
          />
        )}

        {/* 4. Completed primary gradient segment starting from (20, 100) */}
        {clampedPct > 0 && (
          <path 
            d={`M 20,100 A 80,80 0 0,1 ${compX.toFixed(3)},${compY.toFixed(3)}`} 
            fill="none" 
            stroke="url(#gauge-primary-grad)" 
            strokeLinecap="round" 
            strokeWidth="20" 
          />
        )}
      </svg>

      {/* Metric centered inside arc */}
      <div className="flex flex-col items-center -mt-9 z-10 select-none">
        <span className="text-4xl font-extrabold text-white leading-none tracking-tight font-sans">
          {clampedPct}%
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E3EDF9]/70 mt-1">
          {label}
        </span>
      </div>

      {/* Legend Pills */}
      <div className="flex items-center justify-center gap-3 pt-3 text-[#E3EDF9]/80 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E3EDF9]" /> Completed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3A5A86]" /> In Progress
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#23324A] border border-[#3A5A86]/40" /> Pending
        </span>
      </div>
    </div>
  );
};
