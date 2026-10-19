import React, { useState } from 'react';
import {
  Wrench,
  Search,
  LayoutGrid,
  List,
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  Cpu,
  Power,
  SlidersHorizontal,
  X,
  FileText,
  Calendar,
  Zap,
} from 'lucide-react';
import { EQUIPMENT_LIST, MAINTENANCE_TASKS_DATA } from '../../data/mockData';
import { EquipmentItem, MaintenanceTask } from '../../types/mes';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityTag } from '../common/PriorityTag';

export const EquipmentView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [workshopFilter, setWorkshopFilter] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');

  // Selected task / fault dialog state
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);

  // Filtered equipment list
  const filteredEquipment = EQUIPMENT_LIST.filter((eq) => {
    if (statusFilter !== 'all' && eq.status !== statusFilter) return false;
    if (workshopFilter !== 'all' && eq.workshop !== workshopFilter) return false;
    if (
      keyword &&
      !eq.name.toLowerCase().includes(keyword.toLowerCase()) &&
      !eq.code.toLowerCase().includes(keyword.toLowerCase()) &&
      !eq.type.toLowerCase().includes(keyword.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">设备运行与维护</h1>
            <span className="text-xs bg-indigo-50 text-[#4F46E5] font-bold px-2 py-0.5 rounded border border-indigo-200">
              工业物联网 IoT 边缘监控
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            全厂数控加工中心、精密磨床及特种设备的毫秒级遥测、OEE 稼动率与智能点检报修。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-slate-300 rounded p-0.5 bg-slate-100 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#2563EB] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="卡片网格视图"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>卡片视图</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#2563EB] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="表格清单视图"
            >
              <List className="w-3.5 h-3.5" />
              <span>表格视图</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards (5 status counters with tech styling) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => setStatusFilter('all')}
          className={`bg-white border rounded-md p-4 cursor-pointer transition-all tech-card-glow relative overflow-hidden ${
            statusFilter === 'all'
              ? 'border-[#2563EB] shadow-xs ring-2 ring-blue-500/20'
              : 'border-[#E2E8F0]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563EB]" />
          <span className="text-xs font-bold text-slate-600 block">在账设备总数</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-extrabold text-[#0F172A] font-mono tabular-nums">42</span>
            <span className="text-xs text-slate-500 font-semibold">台</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block font-medium">华东一厂在账机台</span>
        </div>

        <div
          onClick={() => setStatusFilter('running')}
          className={`bg-white border rounded-md p-4 cursor-pointer transition-all tech-card-glow relative overflow-hidden ${
            statusFilter === 'running'
              ? 'border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
              : 'border-[#E2E8F0]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />
          <span className="text-xs text-[#059669] font-bold block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>正常开机运行中</span>
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-extrabold text-[#059669] font-mono tabular-nums">31</span>
            <span className="text-xs text-slate-500 font-semibold">台</span>
          </div>
          <span className="text-xs text-emerald-800 mt-1 block font-bold">综合稼动率 73.8%</span>
        </div>

        <div
          onClick={() => setStatusFilter('idle')}
          className={`bg-white border rounded-md p-4 cursor-pointer transition-all tech-card-glow relative overflow-hidden ${
            statusFilter === 'idle'
              ? 'border-slate-500 shadow-xs ring-2 ring-slate-500/20'
              : 'border-[#E2E8F0]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400" />
          <span className="text-xs text-slate-700 font-bold block">待机 (空闲待上料)</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-extrabold text-slate-800 font-mono tabular-nums">7</span>
            <span className="text-xs text-slate-500 font-semibold">台</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block font-medium">等待排产就绪</span>
        </div>

        <div
          onClick={() => setStatusFilter('fault')}
          className={`bg-white border rounded-md p-4 cursor-pointer transition-all tech-card-glow relative overflow-hidden ${
            statusFilter === 'fault'
              ? 'border-red-500 shadow-xs ring-2 ring-red-500/30'
              : 'border-[#E2E8F0]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#DC2626]" />
          <span className="text-xs text-[#DC2626] font-bold block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            <span>故障停机告警</span>
          </span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-extrabold text-[#DC2626] font-mono tabular-nums">2</span>
            <span className="text-xs text-slate-500 font-semibold">台</span>
          </div>
          <span className="text-xs text-[#DC2626] mt-1 block font-bold">含 CNC-07 紧急停机</span>
        </div>

        <div
          onClick={() => setStatusFilter('maintenance')}
          className={`bg-white border rounded-md p-4 cursor-pointer transition-all tech-card-glow relative overflow-hidden ${
            statusFilter === 'maintenance'
              ? 'border-amber-500 shadow-xs ring-2 ring-amber-500/20'
              : 'border-[#E2E8F0]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]" />
          <span className="text-xs text-[#D97706] font-bold block">二级保养已到期</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-3xl font-extrabold text-[#D97706] font-mono tabular-nums">2</span>
            <span className="text-xs text-slate-500 font-semibold">台</span>
          </div>
          <span className="text-xs text-amber-800 mt-1 block font-bold">激光镜组光路校准</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 border border-slate-300 rounded px-3 py-1.5 bg-white">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索机床名称 / 代码 / 型号..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="focus:outline-hidden text-xs w-56 text-slate-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-bold">车间:</span>
            <select
              value={workshopFilter}
              onChange={(e) => setWorkshopFilter(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-900 font-medium focus:outline-hidden"
            >
              <option value="all">全部制造车间</option>
              <option value="机加工一车间">机加工一车间</option>
              <option value="机加工二车间">机加工二车间</option>
              <option value="模具与特种车间">模具与特种车间</option>
              <option value="精密理化计量室">精密理化计量室</option>
            </select>
          </div>
        </div>

        <div className="text-slate-600 text-xs font-medium">
          展示 <strong className="text-slate-900 font-mono font-bold">{filteredEquipment.length}</strong> 台智能机台
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredEquipment.map((eq) => {
            const isFault = eq.status === 'fault';
            const isMaintenance = eq.status === 'maintenance';

            return (
              <div
                key={eq.id}
                className={`bg-white border rounded-md p-4 flex flex-col justify-between transition-all tech-card-glow ${
                  isFault
                    ? 'border-red-300 ring-2 ring-red-400/30 bg-red-50/20'
                    : isMaintenance
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-[#E2E8F0] hover:border-blue-400'
                }`}
              >
                <div>
                  {/* Card top */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base text-slate-900">
                          {eq.code}
                        </span>
                        <StatusBadge status={eq.status} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">{eq.name}</h4>
                    </div>
                  </div>

                  {/* Specs & info */}
                  <div className="space-y-1.5 text-xs text-slate-700 mt-2 border-t border-slate-100 pt-2 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">机床型号:</span>
                      <span className="font-mono text-slate-900 truncate max-w-[150px] font-semibold">
                        {eq.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">所在车间:</span>
                      <span className="text-slate-900">{eq.workshop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">绑定在制工单:</span>
                      <span
                        className={`font-mono text-xs truncate max-w-[140px] font-bold ${
                          isFault ? 'text-red-600' : 'text-[#2563EB]'
                        }`}
                      >
                        {eq.currentOrder || '— 无在制加工 —'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">设备综合效率 OEE:</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums text-xs">
                        {eq.oee}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">上次维保校准:</span>
                      <span className="font-mono text-xs text-slate-600 font-semibold">
                        {eq.lastMaintenance}
                      </span>
                    </div>
                  </div>

                  {/* Fault Alert Box */}
                  {isFault && (
                    <div className="mt-3 p-3 bg-red-100/70 border border-red-300 rounded text-xs text-slate-900">
                      <div className="flex items-center gap-1.5 text-[#DC2626] font-bold mb-1">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>硬件急停报警 (紧急故障)</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-snug line-clamp-2 font-medium">
                        {eq.faultDesc}
                      </p>
                      <button
                        onClick={() =>
                          setSelectedTask({
                            id: 'tsk-01',
                            taskCode: 'REP-20261018-001',
                            equipmentCode: eq.code,
                            equipmentName: eq.name,
                            taskType: '故障报修',
                            priority: 'urgent',
                            reporter: '王雪梅',
                            assignee: '张建军 (维修班长)',
                            createTime: eq.faultTime || '2026-10-18 14:25',
                            status: '处理中',
                            faultDesc: eq.faultDesc || '',
                          })
                        }
                        className="mt-2.5 w-full py-1.5 bg-[#DC2626] hover:bg-red-700 text-white rounded text-xs font-bold transition-colors shadow-2xs"
                      >
                        查看报修派工单 & 开工排修
                      </button>
                    </div>
                  )}

                  {/* Maintenance Due Alert Box */}
                  {isMaintenance && eq.faultDesc && (
                    <div className="mt-3 p-2.5 bg-amber-50 border border-amber-300 rounded text-xs text-slate-900">
                      <div className="flex items-center gap-1.5 text-[#D97706] font-bold mb-1">
                        <Wrench className="w-4 h-4" />
                        <span>定期维保到期任务</span>
                      </div>
                      <p className="text-xs text-slate-700 line-clamp-2 font-medium">{eq.faultDesc}</p>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                {!isFault && (
                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                    <span className="text-xs text-slate-500 font-mono font-medium">
                      累计开机: {eq.operatingHours}h
                    </span>
                    <button className="text-[#2563EB] hover:underline font-bold">
                      设备全生命档案 →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-[#E2E8F0] rounded-md overflow-hidden tech-card-glow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="py-3 px-3 font-bold">设备代码</th>
                  <th className="py-3 px-3 font-bold">设备名称</th>
                  <th className="py-3 px-3 font-bold">机床型号</th>
                  <th className="py-3 px-3 font-bold">所属制造车间</th>
                  <th className="py-3 px-3 font-bold text-center">遥测状态</th>
                  <th className="py-3 px-3 font-bold">加工工单</th>
                  <th className="py-3 px-3 font-bold text-right">OEE 稼动率</th>
                  <th className="py-3 px-3 font-bold">上次维保</th>
                  <th className="py-3 px-3 font-bold text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEquipment.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{eq.code}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{eq.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-700 font-medium">{eq.type}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{eq.workshop}</td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={eq.status} />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800 text-xs font-semibold">
                      {eq.currentOrder || '—'}
                    </td>
                    <td className="py-3 px-3 font-mono text-right tabular-nums font-bold text-slate-900">
                      {eq.oee}%
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                      {eq.lastMaintenance}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button className="text-[#2563EB] hover:underline font-bold">
                        点检台账
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment Maintenance & Repair Tasks Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-md p-4 space-y-3 tech-card-glow">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-[#0F172A]">设备维保与报修实时任务清单</h3>
          </div>
          <span className="text-xs text-slate-600 font-semibold">
            维修响应 SLA 考核闭环中
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-2.5 px-3 font-bold">任务编号</th>
                <th className="py-2.5 px-3 font-bold">设备代码 / 名称</th>
                <th className="py-2.5 px-3 font-bold">任务类型</th>
                <th className="py-2.5 px-3 font-bold">优先级</th>
                <th className="py-2.5 px-3 font-bold">故障现象 / 保养内容</th>
                <th className="py-2.5 px-3 font-bold">现场提报人</th>
                <th className="py-2.5 px-3 font-bold">维修责任人</th>
                <th className="py-2.5 px-3 font-bold">提报时间</th>
                <th className="py-2.5 px-3 font-bold text-center">状态</th>
                <th className="py-2.5 px-3 font-bold text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MAINTENANCE_TASKS_DATA.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#2563EB]">
                    {task.taskCode}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-slate-900">{task.equipmentCode}</span>{' '}
                    <span className="text-slate-600">({task.equipmentName})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 font-semibold">{task.taskType}</td>
                  <td className="py-2.5 px-3">
                    <PriorityTag priority={task.priority} />
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate font-medium">{task.faultDesc}</td>
                  <td className="py-2.5 px-3 text-slate-800 font-medium">{task.reporter}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-bold">{task.assignee}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-xs">
                    {task.createTime}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold"
                    >
                      查看处理单
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Task Dialog */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-full max-w-lg p-6 space-y-4 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#DC2626] rounded-xs" />
                <h3 className="text-base font-bold text-[#0F172A]">设备故障报修处理单</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">报修单号:</span>
                <span className="font-mono font-bold text-slate-900">{selectedTask.taskCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">报修设备:</span>
                <span className="font-mono text-slate-900 font-bold">
                  {selectedTask.equipmentCode} ({selectedTask.equipmentName})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">优先级:</span>
                <PriorityTag priority={selectedTask.priority} />
              </div>
              <div>
                <span className="text-slate-600 font-bold block mb-1">现场故障现象及报警代码:</span>
                <div className="bg-white p-3 rounded border border-slate-300 text-slate-900 font-mono text-xs leading-relaxed font-semibold">
                  {selectedTask.faultDesc}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">指派维修班组:</span>
                <span className="text-slate-900 font-bold">{selectedTask.assignee}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold"
              >
                返回
              </button>
              <button
                onClick={() => {
                  alert('已签到开工检修，维修备件申领单已自动发送至立体备件库！');
                  setSelectedTask(null);
                }}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded font-bold shadow-2xs"
              >
                确认接单并领料检修
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
