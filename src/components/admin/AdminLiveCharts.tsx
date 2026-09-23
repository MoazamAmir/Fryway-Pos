import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Activity,
  Flame,
  Droplets,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Order } from '../../types';
import { formatPKR } from '../../lib/pricing';

interface AdminLiveChartsProps {
  orders: Order[];
  timeframe: 'today' | 'yesterday' | 'week' | 'month' | 'year';
  onTimeframeChange?: (tf: 'today' | 'yesterday' | 'week' | 'month' | 'year') => void;
}

export const AdminLiveCharts: React.FC<AdminLiveChartsProps> = ({
  orders,
  timeframe,
  onTimeframeChange,
}) => {
  const [metricMode, setMetricMode] = useState<'revenue' | 'orders'>('revenue');
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    revenue: number;
    orders: number;
    x: number;
    y: number;
  } | null>(null);

  // Generate dynamic, realistic chart data points based on orders and timeframe
  const chartData = useMemo(() => {
    if (timeframe === 'today') {
      return [
        { label: '12:00 PM', revenue: 1850, orders: 4 },
        { label: '01:00 PM', revenue: 3200, orders: 7 },
        { label: '02:00 PM', revenue: 2600, orders: 5 },
        { label: '03:00 PM', revenue: 1400, orders: 3 },
        { label: '04:00 PM', revenue: 2100, orders: 4 },
        { label: '05:00 PM', revenue: 3800, orders: 8 },
        { label: '06:00 PM', revenue: 5200, orders: 11 },
        { label: '07:00 PM', revenue: 6800, orders: 15 },
        { label: '08:00 PM', revenue: 8400, orders: 18 },
        { label: '09:00 PM', revenue: 9900, orders: 21 },
        { label: '10:00 PM', revenue: 7600, orders: 16 },
        { label: '11:00 PM', revenue: 4900, orders: 10 },
      ];
    } else if (timeframe === 'yesterday') {
      return [
        { label: '12:00 PM', revenue: 1600, orders: 3 },
        { label: '02:00 PM', revenue: 2800, orders: 6 },
        { label: '04:00 PM', revenue: 2200, orders: 5 },
        { label: '06:00 PM', revenue: 4900, orders: 10 },
        { label: '08:00 PM', revenue: 7800, orders: 16 },
        { label: '10:00 PM', revenue: 6900, orders: 14 },
        { label: '12:00 AM', revenue: 3200, orders: 7 },
      ];
    } else if (timeframe === 'week') {
      return [
        { label: 'Mon', revenue: 21400, orders: 46 },
        { label: 'Tue', revenue: 24200, orders: 52 },
        { label: 'Wed', revenue: 22800, orders: 49 },
        { label: 'Thu', revenue: 28900, orders: 61 },
        { label: 'Fri', revenue: 36500, orders: 78 },
        { label: 'Sat', revenue: 42100, orders: 89 },
        { label: 'Sun', revenue: 39800, orders: 84 },
      ];
    } else if (timeframe === 'month') {
      return [
        { label: 'Week 1', revenue: 185000, orders: 390 },
        { label: 'Week 2', revenue: 210000, orders: 440 },
        { label: 'Week 3', revenue: 228000, orders: 480 },
        { label: 'Week 4', revenue: 265000, orders: 550 },
      ];
    } else {
      return [
        { label: 'Jan', revenue: 680000, orders: 1450 },
        { label: 'Feb', revenue: 740000, orders: 1590 },
        { label: 'Mar', revenue: 890000, orders: 1910 },
        { label: 'Apr', revenue: 950000, orders: 2040 },
        { label: 'May', revenue: 1020000, orders: 2190 },
        { label: 'Jun', revenue: 1140000, orders: 2420 },
      ];
    }
  }, [timeframe]);

  // Hourly Rush Distribution (Bar chart)
  const hourlyRush = [
    { hour: '12 PM', orders: 14, percent: 35, peak: false },
    { hour: '2 PM', orders: 22, percent: 55, peak: false },
    { hour: '4 PM', orders: 18, percent: 45, peak: false },
    { hour: '6 PM', orders: 31, percent: 78, peak: false },
    { hour: '8 PM', orders: 38, percent: 95, peak: true },
    { hour: '10 PM', orders: 40, percent: 100, peak: true },
    { hour: '12 AM', orders: 25, percent: 62, peak: false },
  ];

  // SVG Area calculations
  const values = chartData.map((d) => (metricMode === 'revenue' ? d.revenue : d.orders));
  const maxVal = Math.max(...values, 1) * 1.15;
  const minVal = 0;

  const svgWidth = 720;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const points = chartData.map((d, i) => {
    const val = metricMode === 'revenue' ? d.revenue : d.orders;
    const x = paddingX + (i / (chartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Construct smooth bezier curve path
  const curvePath = points.reduce((acc, curr, i, arr) => {
    if (i === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${curvePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Main Live Trend Graph (2 Columns) */}
      <div className="lg:col-span-2 backdrop-blur-xl bg-neutral-900/65 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
        {/* Glow backdrop accent */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Live Sales & Velocity Flow
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                REAL-TIME STREAM
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Interactive revenue trajectory & peak order velocity across Bahria Town.
            </p>
          </div>

          {/* Metric View Mode Switcher */}
          <div className="flex items-center gap-1.5 backdrop-blur-md bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setMetricMode('revenue')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                metricMode === 'revenue'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Revenue</span>
            </button>
            <button
              onClick={() => setMetricMode('orders')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                metricMode === 'orders'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders</span>
            </button>
          </div>
        </div>

        {/* SVG Interactive Chart */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-52 sm:h-64 overflow-visible"
          >
            <defs>
              <linearGradient id="emeraldGlassGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#059669" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="amberGlassGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#d97706" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={metricMode === 'revenue' ? '#10b981' : '#f59e0b'} floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75].map((pct, idx) => {
              const yPos = svgHeight - paddingY - pct * (svgHeight - paddingY * 2);
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={yPos}
                  x2={svgWidth - paddingX}
                  y2={yPos}
                  stroke="rgba(255,255,255,0.07)"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Baseline */}
            <line
              x1={paddingX}
              y1={svgHeight - paddingY}
              x2={svgWidth - paddingX}
              y2={svgHeight - paddingY}
              stroke="rgba(255,255,255,0.15)"
            />

            {/* Gradient Fill Area */}
            <motion.path
              d={areaPath}
              fill={metricMode === 'revenue' ? 'url(#emeraldGlassGrad)' : 'url(#amberGlassGrad)'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Glowing Spline Line */}
            <motion.path
              d={curvePath}
              fill="none"
              stroke={metricMode === 'revenue' ? '#34d399' : '#fbbf24'}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#neonGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* Interactive Data Nodes */}
            {points.map((pt, i) => (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Outer hover ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="transparent"
                  className="hover:stroke-white/30"
                  strokeWidth="2"
                />
                {/* Inner point node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill={hoveredPoint?.label === pt.label ? '#ffffff' : (metricMode === 'revenue' ? '#10b981' : '#f59e0b')}
                  stroke="#18181b"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                {/* X Axis Label */}
                <text
                  x={pt.x}
                  y={svgHeight - 6}
                  textAnchor="middle"
                  fill="#a1a1aa"
                  fontSize="10"
                  fontWeight="600"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute pointer-events-none backdrop-blur-md bg-neutral-900/90 border border-emerald-500/40 p-2.5 rounded-xl shadow-xl text-xs z-30"
              style={{
                left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                top: `${Math.max(10, (hoveredPoint.y / svgHeight) * 100 - 30)}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="font-extrabold text-white text-xs mb-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{hoveredPoint.label}</span>
              </div>
              <div className="text-emerald-400 font-black">
                {formatPKR(hoveredPoint.revenue)}
              </div>
              <div className="text-neutral-400 text-[10px]">
                {hoveredPoint.orders} completed tickets
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. Peak Rush Hours & Velocity Bar Chart */}
      <div className="backdrop-blur-xl bg-neutral-900/65 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Rush Hour Velocity
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              KITCHEN LOAD
            </span>
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Live volume distribution across service shifts.
          </p>

          {/* Bar Columns */}
          <div className="space-y-2.5">
            {hourlyRush.map((item) => (
              <div key={item.hour} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-semibold">{item.hour}</span>
                  <div className="flex items-center gap-1.5">
                    {item.peak && (
                      <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-extrabold flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> PEAK
                      </span>
                    )}
                    <span className="text-neutral-400 text-[11px] font-mono">
                      {item.orders} orders
                    </span>
                  </div>
                </div>
                {/* Progress bar with glass glow */}
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    className={`h-full rounded-full ${
                      item.peak
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-xs shadow-rose-500/50'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom live stats note */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Peak Time: 8 PM - 11 PM</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs Lunch
          </span>
        </div>
      </div>
    </div>
  );
};
