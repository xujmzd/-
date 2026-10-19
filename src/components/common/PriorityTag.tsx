import React from 'react';

interface PriorityTagProps {
  priority: 'urgent' | 'high' | 'normal';
}

export const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] bg-red-50 border border-red-300 px-2 py-0.5 rounded-sm shadow-2xs">
          <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-xs" />
          <span>紧急排产</span>
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-sm shadow-2xs">
          <span className="w-1.5 h-1.5 bg-[#D97706] rounded-xs" />
          <span>高优先级</span>
        </span>
      );
    case 'normal':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/80 border border-slate-300 px-2 py-0.5 rounded-sm">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-xs" />
          <span>普通优先级</span>
        </span>
      );
  }
};
