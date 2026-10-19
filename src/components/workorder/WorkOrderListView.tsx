import React, { useState } from 'react';
import {
  Plus,
  Search,
  RotateCcw,
  Download,
  PlayCircle,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  FileEdit,
  ClipboardCheck,
  MoreHorizontal,
  CheckSquare,
  Square,
  AlertTriangle,
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus } from '../../types/mes';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityTag } from '../common/PriorityTag';
import { ProgressBar } from '../common/ProgressBar';
import { CreateWorkOrderModal } from './CreateWorkOrderModal';

interface WorkOrderListViewProps {
  workOrders: WorkOrder[];
  onSelectWorkOrder: (orderCode: string) => void;
  onOpenReportDrawer: (orderCode: string) => void;
  onCreateWorkOrder: (newOrder: WorkOrder) => void;
}

export const WorkOrderListView: React.FC<WorkOrderListViewProps> = ({
  workOrders,
  onSelectWorkOrder,
  onOpenReportDrawer,
  onCreateWorkOrder,
}) => {
  const [activeTab, setActiveTab] = useState<WorkOrderStatus>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExpandFilter, setIsExpandFilter] = useState(false);
  const [tableDensity, setTableDensity] = useState<'default' | 'compact' | 'relaxed'>('default');

  // Search & filter fields
  const [filterCode, setFilterCode] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterWorkshop, setFilterWorkshop] = useState('all');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Row selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Calculate tab counts
  const countAll = workOrders.length;
  const countPending = workOrders.filter((w) => w.status === 'pending').length;
  const countInProduction = workOrders.filter((w) => w.status === 'in_production').length;
  const countCompleted = workOrders.filter((w) => w.status === 'completed').length;
  const countOverdue = workOrders.filter((w) => w.status === 'overdue').length;

  // Filtered orders
  const filteredOrders = workOrders.filter((wo) => {
    if (activeTab !== 'all' && wo.status !== activeTab) return false;
    if (filterCode && !wo.code.toLowerCase().includes(filterCode.toLowerCase())) return false;
    if (
      filterProduct &&
      !wo.productName.toLowerCase().includes(filterProduct.toLowerCase()) &&
      !wo.productCode.toLowerCase().includes(filterProduct.toLowerCase())
    )
      return false;
    if (filterWorkshop !== 'all' && wo.workshop !== filterWorkshop) return false;
    if (filterBatch && !wo.batchNo.toLowerCase().includes(filterBatch.toLowerCase())) return false;
    if (filterPriority !== 'all' && wo.priority !== filterPriority) return false;
    return true;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleResetFilters = () => {
    setFilterCode('');
    setFilterProduct('');
    setFilterWorkshop('all');
    setFilterBatch('');
    setFilterPriority('all');
    setActiveTab('all');
  };

  const rowPaddingClass =
    tableDensity === 'compact' ? 'py-2' : tableDensity === 'relaxed' ? 'py-4' : 'py-3';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">生产工单管理</h1>
            <span className="text-xs bg-sky-50 text-[#0284C7] font-bold px-2 py-0.5 rounded border border-sky-200">
              MES 工单调度中心
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            全流程工单排产下达、工序级在制进度跟踪与现场加工报工闭环。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white px-4 py-2 rounded text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>新建生产工单</span>
          </button>
        </div>
      </div>

      {/* Status Tabs with counts */}
      <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-4 pt-2.5 rounded-md overflow-x-auto shadow-2xs">
        {[
          { key: 'all', label: '全部工单', count: countAll },
          { key: 'pending', label: '待下达', count: countPending },
          { key: 'in_production', label: '生产中', count: countInProduction },
          { key: 'completed', label: '已完成', count: countCompleted },
          { key: 'overdue', label: '已逾期', count: countOverdue, isDanger: true },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as WorkOrderStatus)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all relative whitespace-nowrap ${
                isActive
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono tabular-nums text-xs px-2 py-0.5 rounded ${
                  tab.isDanger && tab.count > 0
                    ? 'bg-red-100 text-[#DC2626] font-bold ring-1 ring-red-300'
                    : isActive
                    ? 'bg-blue-100 text-[#2563EB] font-bold'
                    : 'bg-slate-100 text-slate-600 font-medium'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-md space-y-3 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          {/* Work order number */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">工单编号</label>
            <input
              type="text"
              placeholder="输入工单编号如 MO..."
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:border-[#2563EB] focus:outline-hidden font-medium"
            />
          </div>

          {/* Product name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">产品名称 / 编码</label>
            <input
              type="text"
              placeholder="搜索产品或编码..."
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:border-[#2563EB] focus:outline-hidden font-medium"
            />
          </div>

          {/* Workshop */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">生产车间</label>
            <select
              value={filterWorkshop}
              onChange={(e) => setFilterWorkshop(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:border-[#2563EB] focus:outline-hidden bg-white font-medium"
            >
              <option value="all">全部车间</option>
              <option value="机加工一车间">机加工一车间</option>
              <option value="机加工二车间">机加工二车间</option>
              <option value="齿轮专机车间">齿轮专机车间</option>
              <option value="精密阀门车间">精密阀门车间</option>
            </select>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">计划开工日期</label>
            <input
              type="date"
              className="w-full border border-slate-300 rounded px-3 py-2 focus:border-[#2563EB] focus:outline-hidden font-medium text-slate-800"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => {}}
              className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 px-3 rounded flex items-center justify-center gap-1.5 font-bold transition-colors shadow-2xs"
            >
              <Search className="w-4 h-4" />
              <span>查询</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 px-3 rounded flex items-center justify-center gap-1 font-semibold transition-colors"
              title="重置筛选"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
            <button
              onClick={() => setIsExpandFilter(!isExpandFilter)}
              className="text-[#2563EB] hover:bg-blue-50 py-2 px-2.5 rounded flex items-center gap-1 font-semibold"
            >
              <span>{isExpandFilter ? '收起' : '高级'}</span>
              {isExpandFilter ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible advanced filters */}
        {isExpandFilter && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-slate-700 font-bold mb-1">生产批次号</label>
              <input
                type="text"
                placeholder="例如: B261016-01"
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 focus:border-[#2563EB] focus:outline-hidden font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">生产优先级</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 focus:border-[#2563EB] focus:outline-hidden bg-white font-medium"
              >
                <option value="all">全部优先级</option>
                <option value="urgent">紧急排产工单</option>
                <option value="high">高优先级工单</option>
                <option value="normal">普通工单</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">工段责任人</label>
              <input
                type="text"
                placeholder="输入责任人姓名"
                className="w-full border border-slate-300 rounded px-3 py-2 focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        {/* Left operations */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-1.5 rounded font-bold transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增工单</span>
          </button>

          <button
            disabled={selectedIds.length === 0}
            className={`flex items-center gap-1.5 border px-3 py-1.5 rounded font-bold transition-colors ${
              selectedIds.length > 0
                ? 'border-blue-300 bg-blue-50 text-[#2563EB] hover:bg-blue-100 shadow-2xs'
                : 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>批量下达排产</span>
          </button>

          <button className="flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded font-semibold transition-colors">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>导出工单报表</span>
          </button>

          {/* Selected count badge with explicit text */}
          {selectedIds.length > 0 && (
            <div className="ml-2 flex items-center gap-2 bg-blue-50 text-[#2563EB] border border-blue-200 px-3 py-1 rounded font-medium">
              <span>
                已勾选 <strong>{selectedIds.length}</strong> 条记录
              </span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-slate-600 hover:text-slate-900 underline font-bold ml-1"
              >
                清空选择
              </button>
            </div>
          )}
        </div>

        {/* Right side display controls */}
        <div className="flex items-center gap-3">
          {/* Table density switch */}
          <div className="flex items-center gap-1 border border-slate-300 rounded p-0.5 bg-slate-100">
            <span className="text-xs text-slate-600 px-1.5 font-semibold">密度:</span>
            <button
              onClick={() => setTableDensity('compact')}
              className={`px-2 py-0.5 rounded text-xs ${
                tableDensity === 'compact'
                  ? 'bg-white shadow-2xs font-bold text-[#2563EB]'
                  : 'text-slate-600 font-medium'
              }`}
            >
              紧凑
            </button>
            <button
              onClick={() => setTableDensity('default')}
              className={`px-2 py-0.5 rounded text-xs ${
                tableDensity === 'default'
                  ? 'bg-white shadow-2xs font-bold text-[#2563EB]'
                  : 'text-slate-600 font-medium'
              }`}
            >
              默认
            </button>
            <button
              onClick={() => setTableDensity('relaxed')}
              className={`px-2 py-0.5 rounded text-xs ${
                tableDensity === 'relaxed'
                  ? 'bg-white shadow-2xs font-bold text-[#2563EB]'
                  : 'text-slate-600 font-medium'
              }`}
            >
              宽松
            </button>
          </div>

          <button
            className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50"
            title="列设置"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-50"
            title="刷新表格"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-md overflow-hidden tech-card-glow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="text-slate-500 hover:text-slate-700 align-middle"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredOrders.length ? (
                      <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 font-bold min-w-[150px]">工单编号</th>
                <th className="py-3 px-3 font-bold min-w-[190px]">产品名称 / 编号</th>
                <th className="py-3 px-3 font-bold min-w-[150px]">规格型号</th>
                <th className="py-3 px-3 font-bold text-right min-w-[90px]">计划数</th>
                <th className="py-3 px-3 font-bold text-right min-w-[90px]">完工数</th>
                <th className="py-3 px-3 font-bold min-w-[160px]">生产进度</th>
                <th className="py-3 px-3 font-bold min-w-[130px]">车间 / 产线</th>
                <th className="py-3 px-3 font-bold min-w-[105px]">计划开工</th>
                <th className="py-3 px-3 font-bold min-w-[105px]">计划完工</th>
                <th className="py-3 px-3 font-bold text-center min-w-[100px]">工单状态</th>
                <th className="py-3 px-3 font-bold text-center sticky right-0 bg-slate-50 shadow-xs min-w-[150px]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-14 text-center text-slate-400">
                    <p className="text-sm font-bold text-slate-600">未检索到符合条件的生产工单</p>
                    <p className="text-xs mt-1">请核对筛选参数或重置重试</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((wo) => {
                  const isSelected = selectedIds.includes(wo.id);
                  const isOverdue = wo.status === 'overdue';

                  return (
                    <tr
                      key={wo.id}
                      className={`hover:bg-blue-50/30 transition-colors group cursor-pointer ${
                        isSelected ? 'bg-blue-50/50' : ''
                      } ${isOverdue ? 'bg-red-50/30' : ''}`}
                      onClick={() => onSelectWorkOrder(wo.code)}
                    >
                      {/* Checkbox */}
                      <td
                        className={`${rowPaddingClass} px-3 text-center`}
                        onClick={(e) => toggleSelectRow(wo.id, e)}
                      >
                        <button className="align-middle text-slate-400 hover:text-slate-600">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Work Order code */}
                      <td className={`${rowPaddingClass} px-3`}>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#2563EB] group-hover:underline text-xs">
                            {wo.code}
                          </span>
                          <PriorityTag priority={wo.priority} />
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          批次: {wo.batchNo}
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className={`${rowPaddingClass} px-3`}>
                        <div className="font-bold text-slate-900 text-xs">{wo.productName}</div>
                        <div className="font-mono text-xs text-slate-500 mt-0.5">
                          {wo.productCode}
                        </div>
                      </td>

                      {/* Spec */}
                      <td className={`${rowPaddingClass} px-3 text-slate-700 text-xs`}>
                        {wo.spec}
                      </td>

                      {/* Planned Qty */}
                      <td
                        className={`${rowPaddingClass} px-3 font-mono text-right tabular-nums text-slate-700 font-medium`}
                      >
                        {wo.plannedQty.toLocaleString()}{' '}
                        <span className="text-slate-500 font-sans">{wo.unit}</span>
                      </td>

                      {/* Completed Qty */}
                      <td
                        className={`${rowPaddingClass} px-3 font-mono text-right tabular-nums font-bold text-slate-900 text-sm`}
                      >
                        {wo.completedQty.toLocaleString()}{' '}
                        <span className="text-slate-500 font-sans text-xs">{wo.unit}</span>
                      </td>

                      {/* Progress Bar */}
                      <td className={`${rowPaddingClass} px-3`}>
                        <ProgressBar progress={wo.progress} status={wo.status} />
                      </td>

                      {/* Workshop & Line */}
                      <td className={`${rowPaddingClass} px-3`}>
                        <div className="text-slate-900 font-medium">{wo.workshop}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[140px]">
                          {wo.line}
                        </div>
                      </td>

                      {/* Planned start & end dates */}
                      <td
                        className={`${rowPaddingClass} px-3 font-mono text-slate-600 tabular-nums text-xs`}
                      >
                        {wo.planStartDate}
                      </td>
                      <td
                        className={`${rowPaddingClass} px-3 font-mono tabular-nums text-xs ${
                          isOverdue ? 'text-[#DC2626] font-bold' : 'text-slate-600'
                        }`}
                      >
                        {wo.planEndDate}
                        {isOverdue && (
                          <div className="text-xs text-[#DC2626] font-bold font-sans flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>超期延误2天</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className={`${rowPaddingClass} px-3 text-center`}>
                        <StatusBadge status={wo.status} />
                      </td>

                      {/* Fixed Actions column */}
                      <td
                        className={`${rowPaddingClass} px-3 text-center sticky right-0 bg-white group-hover:bg-slate-50 shadow-xs border-l border-slate-200`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onSelectWorkOrder(wo.code)}
                            className="text-[#2563EB] hover:text-[#1D4ED8] font-bold text-xs"
                            title="查看工单详情"
                          >
                            查看详情
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => onOpenReportDrawer(wo.code)}
                            className="text-[#059669] hover:text-emerald-800 font-bold text-xs"
                            title="现场工序报工"
                          >
                            现场报工
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            className="text-slate-600 hover:text-slate-900 font-medium text-xs"
                            title="更多选项"
                          >
                            更多
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination with explicit record descriptions */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5 font-medium">
            <span>
              总计检索到 <strong className="text-slate-900 font-mono font-bold">{filteredOrders.length}</strong> 条制造工单
            </span>
            <span>·</span>
            <select className="border border-slate-300 rounded px-2.5 py-1 bg-white text-xs font-medium">
              <option>每页 10 条记录</option>
              <option>每页 20 条记录</option>
              <option>每页 50 条记录</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <button
              disabled
              className="px-3 py-1 border border-slate-300 rounded text-slate-400 bg-slate-100 cursor-not-allowed font-medium"
            >
              上一页
            </button>
            <button className="px-3 py-1 border border-[#2563EB] bg-[#2563EB] text-white rounded font-bold shadow-2xs">
              1
            </button>
            <button className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium">
              2
            </button>
            <button className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium">
              3
            </button>
            <button className="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium">
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <CreateWorkOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreateWorkOrder}
      />
    </div>
  );
};
