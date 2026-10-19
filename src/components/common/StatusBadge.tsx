import React from 'react';

export type StatusType =
  | 'pending'
  | 'in_production'
  | 'completed'
  | 'overdue'
  | 'running'
  | 'idle'
  | 'fault'
  | 'maintenance'
  | 'approved'
  | 'rejected';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  let displayLabel = label;
  let colorClasses = 'bg-slate-50 text-slate-700 border-slate-300';
  let dotColor = 'bg-slate-500';

  switch (status) {
    case 'in_production':
    case '生产中':
    case 'processing':
    case '处理中':
      displayLabel = displayLabel || '生产中';
      colorClasses = 'bg-blue-50/90 text-blue-700 border-blue-300 shadow-2xs';
      dotColor = 'bg-[#0284C7] ring-2 ring-blue-300/50';
      break;
    case 'completed':
    case '已完成':
    case 'approved':
    case '已通过':
      displayLabel = displayLabel || '已完成';
      colorClasses = 'bg-emerald-50/90 text-emerald-800 border-emerald-300 shadow-2xs';
      dotColor = 'bg-[#10B981] ring-2 ring-emerald-300/50';
      break;
    case 'overdue':
    case '已逾期':
    case 'rejected':
    case '已驳回':
      displayLabel = displayLabel || '已逾期';
      colorClasses = 'bg-red-50 text-red-700 border-red-300 font-semibold shadow-2xs';
      dotColor = 'bg-[#EF4444] ring-2 ring-red-300/50';
      break;
    case 'pending':
    case '待下达':
    case '待审批':
    case '待响应':
      displayLabel = displayLabel || '待下达';
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs';
      dotColor = 'bg-[#F59E0B] ring-2 ring-amber-300/50';
      break;
    case 'running':
    case '运行中':
      displayLabel = displayLabel || '运行中';
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs';
      dotColor = 'bg-[#10B981] ring-2 ring-emerald-300/50 animate-pulse';
      break;
    case 'idle':
    case '待机':
      displayLabel = displayLabel || '待机中';
      colorClasses = 'bg-slate-50 text-slate-700 border-slate-300';
      dotColor = 'bg-slate-400';
      break;
    case 'fault':
    case '故障':
      displayLabel = displayLabel || '故障停机';
      colorClasses = 'bg-red-100/80 text-red-800 border-red-400 font-bold shadow-2xs';
      dotColor = 'bg-[#DC2626] ring-2 ring-red-400 animate-pulse';
      break;
    case 'maintenance':
    case '保养中':
    case '保养到期':
      displayLabel = displayLabel || '保养到期';
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-medium shadow-2xs';
      dotColor = 'bg-[#D97706] ring-2 ring-amber-300/50';
      break;
    default:
      displayLabel = displayLabel || status;
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-sm ${sizeClasses} ${colorClasses} whitespace-nowrap select-none font-medium tracking-tight`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} aria-hidden="true" />
      <span className="leading-tight">{displayLabel}</span>
    </span>
  );
};
