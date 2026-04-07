// Performance Chart Component - Custom SVG implementation

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useTrading } from '../hooks/useTrading';

interface DataPoint {
  day: number;
  value: number;
  baseline: number;
}

export function PerformanceChart() {
  const { portfolio } = useTrading();

  // Generate sample data points for demo
  const generateData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    const baseValue = 1000;
    let currentValue = baseValue;

    for (let i = 0; i < 30; i++) {
      // Random walk
      const change = (Math.random() - 0.45) * 10;
      currentValue = Math.max(800, currentValue + change);

      data.push({
        day: i + 1,
        value: currentValue,
        baseline: baseValue,
      });
    }

    // Add current value at the end
    if (portfolio) {
      data[data.length - 1] = {
        day: 30,
        value: portfolio.totalValue,
        baseline: baseValue,
      };
    }

    return data;
  };

  const data = generateData();
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  const totalChange = endValue - startValue;
  const percentChange = (totalChange / startValue) * 100;
  const isPositive = totalChange >= 0;

  // Chart dimensions
  const width = 500;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };

  // Calculate scales
  const minValue = Math.min(...data.map(d => Math.min(d.value, d.baseline))) * 0.95;
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.baseline))) * 1.05;
  const valueRange = maxValue - minValue;

  const xScale = (day: number) => padding.left + ((day - 1) / 29) * (width - padding.left - padding.right);
  const yScale = (value: number) => height - padding.bottom - ((value - minValue) / valueRange) * (height - padding.top - padding.bottom);

  // Generate path
  const valuePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.day)} ${yScale(d.value)}`).join(' ');
  const baselinePath = `M ${xScale(1)} ${yScale(data[0].baseline)} L ${xScale(30)} ${yScale(data[0].baseline)}`;

  // Generate area path
  const areaPath = valuePath + ` L ${xScale(30)} ${yScale(data[0].baseline)} L ${xScale(1)} ${yScale(data[0].baseline)} Z`;

  // Y-axis ticks
  const yTicks = [minValue, (minValue + maxValue) / 2, maxValue].map(v => ({
    value: v,
    y: yScale(v),
  }));

  // X-axis ticks
  const xTicks = [1, 10, 20, 30].map(d => ({
    day: d,
    x: xScale(d),
  }));

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Performance
        </h2>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isPositive ? '#10b981' : '#ef4444'}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={isPositive ? '#10b981' : '#ef4444'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* Y-axis lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="#334155"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={tick.y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#64748b"
                fontSize="10"
              >
                ${Math.round(tick.value)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {xTicks.map((tick, i) => (
            <text
              key={i}
              x={tick.x}
              y={height - 8}
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              Day {tick.day}
            </text>
          ))}

          {/* Baseline */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#475569"
            strokeWidth="1"
            strokeDasharray="5 5"
          />

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* Value line */}
          <path
            d={valuePath}
            fill="none"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth="2"
          />

          {/* Current value dot */}
          <circle
            cx={xScale(30)}
            cy={yScale(endValue)}
            r="4"
            fill={isPositive ? '#10b981' : '#ef4444'}
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-400">Portfolio Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-gray-500"></div>
          <span className="text-xs text-gray-400">Starting ($500)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-700">
        <div>
          <p className="text-xs text-gray-500">Start</p>
          <p className="text-sm font-medium text-white">${startValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Current</p>
          <p className="text-sm font-medium text-white">${endValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Change</p>
          <p className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}${totalChange.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
