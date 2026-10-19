import React from 'react';
import { DEFECT_DISTRIBUTION } from '../../data/mockData';

export const DefectDistributionChart: React.FC = () => {
  const totalDefects = DEFECT_DISTRIBUTION.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-md p-4 flex flex-col justify-between h-full tech-card-glow">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-gradient-to-b from-[#6366F1] to-[#2563EB] rounded-xs" />
          <h3 className="text-sm font-bold text-[#0F172A]">质量缺陷分布 (Pareto 归因)</h3>
        </div>
        <span className="text-xs text-slate-600 font-mono tabular-nums font-medium">
          本日缺陷累计: <strong className="text-[#DC2626] font-bold text-sm">{totalDefects}</strong> 件
        </span>
      </div>

      {/* Defect Bars List */}
      <div className="space-y-3.5 my-auto py-2">
        {DEFECT_DISTRIBUTION.map((item, index) => {
          // Tech Pareto color palette
          const barGradients = [
            'bg-gradient-to-r from-[#DC2626] to-[#EF4444]', // Top 1 defect
            'bg-gradient-to-r from-[#EA580C] to-[#FB923C]', // Top 2
            'bg-gradient-to-r from-[#D97706] to-[#FBBF24]', // Top 3
            'bg-gradient-to-r from-[#2563EB] to-[#0284C7]', // Top 4
            'bg-gradient-to-r from-[#4F46E5] to-[#818CF8]', // Top 5
          ];

          return (
            <div key={item.category} className="text-xs">
              <div className="flex items-center justify-between text-slate-800 mb-1 font-medium">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#2563EB] bg-blue-50 px-1 py-0.2 rounded border border-blue-200">
                    TOP {index + 1}
                  </span>
                  <span className="font-semibold text-slate-900">{item.category}</span>
                </span>
                <span className="font-mono tabular-nums text-slate-800">
                  <span className="font-bold text-slate-900">{item.quantity}</span> 件
                  <span className="text-slate-500 ml-1.5 font-semibold">({item.percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-xs h-2.5 overflow-hidden border border-slate-300">
                <div
                  className={`h-full rounded-xs ${barGradients[index] || 'bg-slate-500'} transition-all duration-300`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-600">重点攻关工序: OP30 数控车削公差波动</span>
        <button className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-semibold">
          质检全追溯台账 →
        </button>
      </div>
    </div>
  );
};
