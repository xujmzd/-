import React, { useState } from 'react';
import {
  RefreshCw,
  TrendingUp,
  Target,
  ShieldCheck,
  AlertOctagon,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Wrench,
  ChevronRight,
  Activity,
  Cpu,
  Radio,
} from 'lucide-react';
import { OutputTrendChart } from './OutputTrendChart';
import { InventoryCard } from './InventoryCard';
import { DefectDistributionChart } from './DefectDistributionChart';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityTag } from '../common/PriorityTag';
import { ProgressBar } from '../common/ProgressBar';
import {
  WORK_ORDERS_DATA,
  MAINTENANCE_TASKS_DATA,
  PRODUCTION_ACTIVITIES,
} from '../../data/mockData';

interface DashboardViewProps {
  onSelectWorkOrder: (orderCode: string) => void;
  onNavigateToEquipment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectWorkOrder,
  onNavigateToEquipment,
}) => {
  const [selectedWorkshop, setSelectedWorkshop] = useState('全部制造车间');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('2026-10-18 20:15:30');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
          now.getDate()
        ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    }, 500);
  };

  const previewOrders = WORK_ORDERS_DATA.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">生产运营工作台</h1>
            <span className="text-xs bg-blue-50 text-[#2563EB] font-bold px-2 py-0.5 rounded border border-blue-200">
              实时数字孪生看板
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            全工段生产实时进度跟踪，物料平衡感知与现场故障闭环协同。
          </p>
        </div>

        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Workshop selector */}
          <div className="flex items-center gap-1.5 border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
            <select
              value={selectedWorkshop}
              onChange={(e) => setSelectedWorkshop(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="全部制造车间">全部制造车间</option>
              <option value="机加工一车间">机加工一车间 (精密车削)</option>
              <option value="机加工二车间">机加工二车间 (卧式加工)</option>
              <option value="齿轮专机车间">齿轮专机车间 (数控滚齿)</option>
              <option value="钣金冲压车间">钣金冲压车间</option>
            </select>
          </div>

          {/* Date range picker button */}
          <div className="flex items-center gap-1.5 border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono tabular-nums font-semibold">2026-10-18 (今日班次)</span>
          </div>

          {/* Refresh button with feedback */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-[#2563EB] px-3 py-1.5 rounded transition-colors font-medium shadow-2xs"
            title="刷新数据"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#2563EB] ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? '同步中...' : '刷新看板'}</span>
          </button>

          {/* Last updated */}
          <span className="text-xs text-slate-500 font-mono tabular-nums hidden lg:inline">
            遥测更新于: {lastUpdated}
          </span>
        </div>
      </div>

      {/* Row 1: Four Compact Tech KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: 今日产量 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md flex flex-col justify-between tech-card-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#0EA5E9]" />
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-bold text-slate-800">本日累计产出</span>
            <div className="w-8 h-8 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#0F172A] font-mono tabular-nums">
                12,860
              </span>
              <span className="text-xs font-semibold text-slate-600">件</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#059669] font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8.2%
            </span>
            <span className="text-slate-500 font-medium">较昨日排产同期高产</span>
          </div>
        </div>

        {/* KPI 2: 工单完成率 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md flex flex-col justify-between tech-card-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] to-[#34D399]" />
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-bold text-slate-800">工单综合达成率</span>
            <div className="w-8 h-8 rounded bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-200">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#0F172A] font-mono tabular-nums">
                86.4
              </span>
              <span className="text-xs font-semibold text-slate-600">%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">班次基准: 90.0%</span>
            <span className="text-[#D97706] font-bold font-mono">达成差额 -3.6%</span>
          </div>
        </div>

        {/* KPI 3: 质量合格率 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md flex flex-col justify-between tech-card-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0284C7] to-[#38BDF8]" />
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-bold text-slate-800">制程终检合格率</span>
            <div className="w-8 h-8 rounded bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#0F172A] font-mono tabular-nums">
                98.6
              </span>
              <span className="text-xs font-semibold text-slate-600">%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#059669] font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +0.4%
            </span>
            <span className="text-slate-500 font-medium">CpK 1.48 稳定受控</span>
          </div>
        </div>

        {/* KPI 4: 待处理异常 */}
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md flex flex-col justify-between tech-card-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] to-[#F87171]" />
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <span className="font-bold text-slate-800">在制待处理异常</span>
            <div className="w-8 h-8 rounded bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-200">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#DC2626] font-mono tabular-nums">
                12
              </span>
              <span className="text-xs font-semibold text-slate-600">项</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#DC2626] font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
              <span>现场紧急 3 项</span>
            </span>
            <span className="text-slate-500 font-medium">机床报警/硬度特采</span>
          </div>
        </div>
      </div>

      {/* Row 2: Charts Split (2/3 + 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2/3: Output Trend Chart */}
        <div className="lg:col-span-2">
          <OutputTrendChart />
        </div>
        {/* Right 1/3: Material Inventory */}
        <div className="lg:col-span-1">
          <InventoryCard />
        </div>
      </div>

      {/* Row 3: Progress Table (2/3) + Defect Pareto (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2/3: Production Progress Table */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-md p-4 flex flex-col justify-between tech-card-glow">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-gradient-to-b from-[#2563EB] to-[#0284C7] rounded-xs" />
              <h3 className="text-sm font-bold text-[#0F172A]">关键在制工单生产进度监控</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              点击工单编号可下钻工步明细与实时报工
            </span>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 font-semibold">工单编号</th>
                  <th className="py-2.5 px-3 font-semibold">产品名称 / 规格</th>
                  <th className="py-2.5 px-3 font-semibold">生产车间 / 产线</th>
                  <th className="py-2.5 px-3 font-semibold text-right">计划数</th>
                  <th className="py-2.5 px-3 font-semibold text-right">完工数</th>
                  <th className="py-2.5 px-3 font-semibold min-w-[150px]">综合进度</th>
                  <th className="py-2.5 px-3 font-semibold text-center">工单状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewOrders.map((wo) => (
                  <tr
                    key={wo.id}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => onSelectWorkOrder(wo.code)}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#2563EB] group-hover:underline">
                      {wo.code}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{wo.productName}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">
                        {wo.spec}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      <div className="font-medium">{wo.workshop}</div>
                      <div className="text-xs text-slate-500">{wo.line}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700 font-medium">
                      {wo.plannedQty.toLocaleString()}{' '}
                      <span className="text-slate-500 font-sans">{wo.unit}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right tabular-nums font-bold text-[#0F172A]">
                      {wo.completedQty.toLocaleString()}{' '}
                      <span className="text-slate-500 font-sans">{wo.unit}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <ProgressBar progress={wo.progress} status={wo.status} />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge status={wo.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>当前展示前 5 笔重点关注在制工单</span>
            <button
              onClick={() => onSelectWorkOrder('MO202610190028')}
              className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold flex items-center gap-1"
            >
              <span>查看全部生产工单清单</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1/3: Defect Pareto Chart */}
        <div className="lg:col-span-1">
          <DefectDistributionChart />
        </div>
      </div>

      {/* Row 4: Equipment Repair List (1/2) + Production Activity Timeline (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Equipment Repair List */}
        <div className="bg-white border border-[#E2E8F0] rounded-md p-4 flex flex-col justify-between tech-card-glow">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-gradient-to-b from-[#DC2626] to-[#F59E0B] rounded-xs" />
              <h3 className="text-sm font-bold text-[#0F172A]">机床设备维修与保养待办</h3>
            </div>
            <button
              onClick={onNavigateToEquipment}
              className="text-xs text-[#2563EB] hover:underline font-bold"
            >
              进入设备物联网台账 →
            </button>
          </div>

          <div className="divide-y divide-slate-100 my-2">
            {MAINTENANCE_TASKS_DATA.map((task) => (
              <div key={task.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{task.equipmentCode}</span>
                    <span className="text-slate-700 font-semibold">{task.equipmentName}</span>
                    <PriorityTag priority={task.priority} />
                    <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                      {task.taskType}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs line-clamp-1">{task.faultDesc}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>报修提报人: {task.reporter}</span>
                    <span>·</span>
                    <span className="font-medium text-slate-700">处理责任人: {task.assignee}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{task.createTime}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span className="font-medium">故障平均响应 SLA: 18.5 分钟</span>
            <span>易损备件齐套率: 96.2%</span>
          </div>
        </div>

        {/* Right: Production Activity Timeline with explicit text labels */}
        <div className="bg-white border border-[#E2E8F0] rounded-md p-4 flex flex-col justify-between tech-card-glow">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-gradient-to-b from-[#10B981] to-[#0EA5E9] rounded-xs" />
              <h3 className="text-sm font-bold text-[#0F172A]">车间生产动态实时流水</h3>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>毫秒级网关流转</span>
            </span>
          </div>

          <div className="divide-y divide-slate-100 my-2 max-h-[230px] overflow-y-auto pr-1">
            {PRODUCTION_ACTIVITIES.map((act) => {
              // Explicit textual prefix for each activity type
              let typeLabel = '[报工完成]';
              let typeClass = 'text-[#2563EB] bg-blue-50 border-blue-200';
              if (act.type === 'inbound') {
                typeLabel = '[终检入库]';
                typeClass = 'text-[#059669] bg-emerald-50 border-emerald-200';
              } else if (act.type === 'defect') {
                typeLabel = '[硬件停机]';
                typeClass = 'text-[#DC2626] bg-red-50 border-red-200';
              } else if (act.type === 'maintenance') {
                typeLabel = '[点检完成]';
                typeClass = 'text-[#D97706] bg-amber-50 border-amber-200';
              }

              return (
                <div key={act.id} className="py-2.5 flex items-start gap-3 text-xs">
                  <span className="font-mono text-slate-500 font-bold text-xs w-12 shrink-0 pt-0.5">
                    {act.time}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-1.5 py-0.2 rounded border ${typeClass}`}>
                        {typeLabel}
                      </span>
                      <span className="font-bold text-slate-900">{act.title}</span>
                      <span className="font-mono text-xs font-semibold text-[#2563EB] bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                        {act.relatedCode}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                      {act.description}
                    </p>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">
                      操作员工: {act.operator}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>数据接入: MES终端扫码 / CNC PLC总线通讯网关</span>
            <span className="text-emerald-700 font-semibold">状态: 链路畅通</span>
          </div>
        </div>
      </div>
    </div>
  );
};
