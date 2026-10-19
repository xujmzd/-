import React, { useState } from 'react';
import { PRODUCTION_TREND_7DAYS, PRODUCTION_TREND_30DAYS } from '../../data/mockData';
import { Activity, BarChart2 } from 'lucide-react';

export const OutputTrendChart: React.FC = () => {
  const [range, setRange] = useState<'7' | '30'>('7');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = range === '7' ? PRODUCTION_TREND_7DAYS : PRODUCTION_TREND_30DAYS;
  const maxVal = 15000;
  const chartHeight = 210;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-md p-4 flex flex-col justify-between h-full tech-card-glow relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-gradient-to-b from-[#2563EB] to-[#0284C7] rounded-xs" />
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <span>日生产产量趋势对比 (MES 计划 vs 实际)</span>
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend with explicit text */}
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#94A3B8] rounded-xs" />
              <span>计划目标产量</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-gradient-to-r from-[#2563EB] to-[#0284C7] rounded-xs shadow-2xs" />
              <span>实际完工产量</span>
            </span>
          </div>

          {/* Segmented Range Switcher */}
          <div className="inline-flex rounded border border-slate-300 bg-slate-100/80 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setRange('7')}
              className={`px-3 py-1 rounded transition-colors ${
                range === '7'
                  ? 'bg-white text-[#2563EB] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              最近7天
            </button>
            <button
              onClick={() => setRange('30')}
              className={`px-3 py-1 rounded transition-colors ${
                range === '30'
                  ? 'bg-white text-[#2563EB] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              最近30天
            </button>
          </div>
        </div>
      </div>

      {/* SVG / Canvas Area */}
      <div className="relative pt-6 pb-2">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-0 pt-6 pb-8 flex flex-col justify-between pointer-events-none">
          {[15000, 10000, 5000, 0].map((val) => (
            <div key={val} className="flex items-center gap-2.5 w-full">
              <span className="text-xs font-mono font-medium text-slate-400 w-12 text-right tabular-nums">
                {val.toLocaleString()}
              </span>
              <div className="flex-1 border-b border-dashed border-slate-200" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative pl-14 pr-4 h-[210px] flex items-end justify-between gap-3 z-10">
          {data.map((item, idx) => {
            const planHeight = (item.planned / maxVal) * chartHeight;
            const actHeight = (item.actual / maxVal) * chartHeight;
            const isHovered = hoveredIdx === idx;
            const diff = item.actual - item.planned;
            const compRate = ((item.actual / item.planned) * 100).toFixed(1);

            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-[calc(100%+10px)] z-30 bg-[#0C1527] text-white text-xs rounded-md px-3 py-2.5 shadow-xl border border-slate-700 whitespace-nowrap min-w-[155px] pointer-events-none">
                    <div className="font-bold text-slate-100 border-b border-slate-700 pb-1 mb-1.5 flex justify-between items-center">
                      <span>{item.date} 班次统计</span>
                      <span className="text-[#38BDF8] font-mono font-bold">{compRate}%</span>
                    </div>
                    <div className="flex justify-between py-0.5 text-slate-300">
                      <span>计划产量:</span>
                      <span className="font-mono tabular-nums font-semibold text-white">
                        {item.planned.toLocaleString()} 件
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 text-slate-300">
                      <span>实际完工:</span>
                      <span className="font-mono tabular-nums font-bold text-[#60A5FA]">
                        {item.actual.toLocaleString()} 件
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 pt-1 text-xs border-t border-slate-700/80 mt-1">
                      <span>偏差差额:</span>
                      <span
                        className={`font-mono tabular-nums font-bold ${
                          diff >= 0 ? 'text-[#34D399]' : 'text-[#F87171]'
                        }`}
                      >
                        {diff >= 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()} 件
                      </span>
                    </div>
                  </div>
                )}

                {/* Bars column */}
                <div className="flex items-end gap-1.5 w-full max-w-[44px] justify-center">
                  {/* Planned Bar */}
                  <div
                    className="w-1/2 bg-[#94A3B8] group-hover:bg-[#64748B] transition-all rounded-t-xs"
                    style={{ height: `${planHeight}px` }}
                  />
                  {/* Actual Bar with tech gradient */}
                  <div
                    className={`w-1/2 transition-all rounded-t-xs ${
                      item.actual >= item.planned
                        ? 'bg-gradient-to-t from-[#1D4ED8] to-[#0284C7] group-hover:brightness-110 shadow-xs'
                        : 'bg-gradient-to-t from-[#1E40AF] to-[#3B82F6] group-hover:brightness-110'
                    }`}
                    style={{ height: `${actHeight}px` }}
                  />
                </div>

                {/* X-axis date label */}
                <span
                  className={`mt-2 text-xs font-mono tabular-nums transition-colors ${
                    isHovered ? 'text-[#2563EB] font-bold' : 'text-slate-600 font-medium'
                  }`}
                >
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
