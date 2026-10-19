import React from 'react';
import { RAW_MATERIALS_INVENTORY } from '../../data/mockData';
import { AlertTriangle, CheckCircle2, PackageCheck } from 'lucide-react';

export const InventoryCard: React.FC = () => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-md p-4 flex flex-col justify-between h-full tech-card-glow">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-gradient-to-b from-[#0EA5E9] to-[#2563EB] rounded-xs" />
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <span>原材料库存实时监控</span>
          </h3>
        </div>
        <span className="text-xs font-bold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
          <span>3 项低于安全基准</span>
        </span>
      </div>

      {/* Material List */}
      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[230px] pr-1 mt-1">
        {RAW_MATERIALS_INVENTORY.map((mat) => {
          const isLow = mat.status === 'low';
          const ratio = Math.min(100, Math.round((mat.stock / mat.safetyStock) * 100));

          return (
            <div key={mat.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {isLow ? (
                    <span className="inline-flex items-center gap-1 text-[#DC2626] font-bold shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>[预警]</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#059669] font-medium shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>[充足]</span>
                    </span>
                  )}
                  <span className="font-semibold text-slate-900 truncate text-xs">{mat.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-mono text-slate-600 font-medium">{mat.code}</span>
                  <span>·</span>
                  <span className="truncate">{mat.spec}</span>
                </div>
              </div>

              {/* Quantities & Safety comparison */}
              <div className="text-right shrink-0">
                <div className="flex items-baseline justify-end gap-1 font-mono">
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      isLow ? 'text-[#DC2626]' : 'text-slate-900'
                    }`}
                  >
                    {mat.stock.toLocaleString()}
                  </span>
                  <span className="text-slate-700 font-sans text-xs font-semibold">{mat.unit}</span>
                  <span className="text-slate-400 text-xs">/ 安全线 {mat.safetyStock}</span>
                </div>

                <div className="w-24 mt-1 bg-slate-200/80 rounded-xs h-2 overflow-hidden border border-slate-300 ml-auto">
                  <div
                    className={`h-full rounded-xs transition-all ${
                      isLow
                        ? 'bg-gradient-to-r from-[#DC2626] to-[#F87171]'
                        : 'bg-gradient-to-r from-[#059669] to-[#10B981]'
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>库位同步: 原材1号库 / 铸件料仓</span>
        <button className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-semibold flex items-center gap-1">
          <span>进入物料平衡看板 →</span>
        </button>
      </div>
    </div>
  );
};
