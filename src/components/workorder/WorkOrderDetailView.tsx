import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Check,
  X,
  FileText,
  Boxes,
  History,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { WorkOrder } from '../../types/mes';
import {
  WORK_ORDER_STEPS_DATA,
  MATERIAL_REQUIREMENTS_DATA,
  REPORTING_RECORDS_DATA,
} from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityTag } from '../common/PriorityTag';
import { ProgressBar } from '../common/ProgressBar';

interface WorkOrderDetailViewProps {
  order: WorkOrder;
  onBack: () => void;
  isReportDrawerOpenInitially?: boolean;
}

export const WorkOrderDetailView: React.FC<WorkOrderDetailViewProps> = ({
  order,
  onBack,
  isReportDrawerOpenInitially = false,
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'materials' | 'reports' | 'quality' | 'logs'>('steps');
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(isReportDrawerOpenInitially);
  const [showPrintToast, setShowPrintToast] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  // Drawer Form State
  const [reportOperation, setReportOperation] = useState('OP30 数控精车外圆与倒角');
  const [reportEquipment, setReportEquipment] = useState('CNC-04 (精密数控卧式车床)');
  const [qualifiedQty, setQualifiedQty] = useState<number>(30);
  const [defectiveQty, setDefectiveQty] = useState<number>(0);
  const [defectReason, setDefectReason] = useState('无缺陷');
  const [startTime, setStartTime] = useState('2026-10-19 14:00');
  const [endTime, setEndTime] = useState('2026-10-19 17:30');
  const [reportNotes, setReportNotes] = useState('完成今日第二批次精车外圆及R1.5倒角，尺寸复检合格');

  // Steps data state
  const [steps, setSteps] = useState(WORK_ORDER_STEPS_DATA);
  const [reportList, setReportList] = useState(REPORTING_RECORDS_DATA);

  const handlePrint = () => {
    setShowPrintToast(true);
    setTimeout(() => setShowPrintToast(false), 2500);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (qualifiedQty <= 0) {
      alert('合格数量必须大于0');
      return;
    }

    const newReport = {
      id: `rep-${Date.now()}`,
      reportTime: '刚刚 (2026-10-19 20:18)',
      operationName: reportOperation,
      equipmentCode: 'CNC-04',
      qualifiedQty: Number(qualifiedQty),
      defectiveQty: Number(defectiveQty),
      defectReason: defectiveQty > 0 ? defectReason : undefined,
      operator: '李振华',
      durationHours: 3.5,
    };

    setReportList([newReport, ...reportList]);

    // Update current step completed qty
    setSteps(
      steps.map((st) => {
        if (st.operationNo === 'OP30') {
          return {
            ...st,
            completedQty: st.completedQty + Number(qualifiedQty),
            defectiveQty: st.defectiveQty + Number(defectiveQty),
          };
        }
        return st;
      })
    );

    setIsReportDrawerOpen(false);
    setShowSubmitSuccess(true);
    setTimeout(() => setShowSubmitSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 relative">
      {/* Print Feedback Toast */}
      {showPrintToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#0C1527] text-white text-xs px-4 py-3 rounded-md shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span className="font-medium">已向车间条码打印机发送《观择 MES 生产流转卡与派工工单》！</span>
        </div>
      )}

      {/* Report Submit Success Toast */}
      {showSubmitSuccess && (
        <div className="fixed top-20 right-8 z-50 bg-[#065F46] text-white text-xs px-4 py-3 rounded-md shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span className="font-semibold">报工提交成功！已计入工段绩效并实时更新工单在制产出。</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回工单列表</span>
          </button>
          <div className="h-5 w-px bg-slate-300" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold font-mono text-[#0F172A] tracking-tight">
                {order.code}
              </h1>
              <StatusBadge status={order.status} />
              <PriorityTag priority={order.priority} />
            </div>
            <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2 font-medium">
              <span className="font-bold text-slate-900">{order.productName}</span>
              <span>·</span>
              <span className="font-mono text-slate-600">{order.productCode}</span>
              <span>·</span>
              <span>生产批号: {order.batchNo}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-800 px-3.5 py-2 rounded text-xs font-bold transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#2563EB]" />
            <span>打印派工流转卡</span>
          </button>
          <button
            onClick={() => setIsReportDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white px-4 py-2 rounded text-xs font-bold shadow-xs transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            <span>现场工序报工</span>
          </button>
        </div>
      </div>

      {/* Summary Card with high-contrast text */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs tech-card-glow">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">产品规格型号</span>
            <span className="font-bold text-slate-900">{order.spec}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">计划生产配额</span>
            <span className="font-mono text-slate-900 font-bold text-base">
              {order.plannedQty.toLocaleString()}{' '}
              <span className="text-xs font-medium font-sans text-slate-600">{order.unit}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">当前在制完工数</span>
            <span className="font-mono text-[#059669] font-bold text-base">
              {order.completedQty.toLocaleString()}{' '}
              <span className="text-xs font-medium font-sans text-slate-600">{order.unit}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">不合格 / 报废核销</span>
            <span className="font-mono text-[#DC2626] font-bold text-base">
              {order.scrappedQty}{' '}
              <span className="text-xs font-medium font-sans text-slate-600">{order.unit}</span>
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">责任车间 / 工段长</span>
            <span className="text-slate-900 font-bold">
              {order.workshop} ({order.owner})
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block mb-0.5">排产工期计划</span>
            <span className="font-mono text-slate-800 font-semibold">
              {order.planStartDate} ~ {order.planEndDate}
            </span>
          </div>
        </div>

        {/* Overall progress line */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <span className="text-slate-700 font-bold shrink-0">整体制造进度:</span>
            <ProgressBar progress={order.progress} status={order.status} />
          </div>
          <div className="text-slate-600 font-medium">
            销售订单: <span className="font-mono font-bold">{order.customerOrder}</span> · 特殊技术要求: {order.remarks}
          </div>
        </div>
      </div>

      {/* Visual Process Stepper (5-stage manufacturing pipeline with explicit text labels) */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs tech-card-glow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-4 bg-gradient-to-b from-[#2563EB] to-[#0284C7] rounded-xs" />
            <h3 className="text-xs font-bold text-slate-900">
              工艺路线流程线 (Routing Execution Pipeline)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            已完成 2 工序 · 当前执行 OP30 精车 · 待执行 4 工序
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
          {[
            { step: '01', title: '备料下料', state: 'completed', stateLabel: '已完工 100%', sub: 'SAW-01 (已出料 500件)' },
            { step: '02', title: '粗车打孔', state: 'completed', stateLabel: '已完工 100%', sub: 'CNC-02 (500件全交接)' },
            { step: '03', title: '精密车削', state: 'in_progress', stateLabel: '进行中 加工中', sub: 'CNC-04 (报工 342件)' },
            { step: '04', title: '高频淬火与磨削', state: 'pending', stateLabel: '待执行 排产就绪', sub: 'HEAT-01 / GRD-03' },
            { step: '05', title: '全尺寸终检入库', state: 'unstarted', stateLabel: '未开始 待前道', sub: 'CMM-01 蔡司三坐标' },
          ].map((item) => {
            const isDone = item.state === 'completed';
            const isCurr = item.state === 'in_progress';

            return (
              <div
                key={item.step}
                className={`p-3 rounded border transition-all relative ${
                  isCurr
                    ? 'border-[#2563EB] bg-blue-50/60 shadow-sm ring-1 ring-blue-400/30'
                    : isDone
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-300 bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    工序 {item.step}
                  </span>
                  {isDone ? (
                    <span className="text-xs font-bold text-[#059669] flex items-center gap-1 bg-emerald-100/70 px-1.5 py-0.2 rounded border border-emerald-300">
                      <Check className="w-3 h-3" />
                      <span>{item.stateLabel}</span>
                    </span>
                  ) : isCurr ? (
                    <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1 bg-blue-100/80 px-1.5 py-0.2 rounded border border-blue-300 shadow-2xs">
                      <Play className="w-3 h-3 fill-current" />
                      <span>{item.stateLabel}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium bg-slate-200/60 px-1.5 py-0.2 rounded">
                      {item.stateLabel}
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                <div className="text-xs text-slate-600 mt-1 truncate font-medium">{item.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs strip & sub views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2/3: Tab Content */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-md overflow-hidden tech-card-glow">
          {/* Tabs bar */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold">
            {[
              { key: 'steps', label: '工步工序执行明细', icon: FileText, count: steps.length },
              { key: 'materials', label: 'BOM物料领用核准', icon: Boxes, count: 4 },
              { key: 'reports', label: '工位历史报工单', icon: History, count: reportList.length },
              { key: 'quality', label: '首检质检全复验', icon: ShieldCheck, count: 2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-1.5 py-3 px-4 border-b-2 transition-all -mb-px ${
                    isActive
                      ? 'border-[#2563EB] text-[#2563EB] font-bold bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Operations Process Table */}
          {activeTab === 'steps' && (
            <div className="p-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-2.5 px-3 font-bold">工序号</th>
                      <th className="py-2.5 px-3 font-bold">工序名称</th>
                      <th className="py-2.5 px-3 font-bold">工作中心 / 设备机台</th>
                      <th className="py-2.5 px-3 font-bold text-right">计划数</th>
                      <th className="py-2.5 px-3 font-bold text-right">完工数</th>
                      <th className="py-2.5 px-3 font-bold text-right">缺陷数</th>
                      <th className="py-2.5 px-3 font-bold">责任操作工</th>
                      <th className="py-2.5 px-3 font-bold text-center">状态</th>
                      <th className="py-2.5 px-3 font-bold text-center">工步操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {steps.map((st) => (
                      <tr key={st.operationNo} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {st.operationNo}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {st.operationName}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="text-slate-900 font-medium">{st.workCenter}</div>
                          <div className="text-xs text-slate-500 font-mono">
                            {st.equipmentCode} ({st.equipmentName})
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-700 font-medium">
                          {st.plannedQty}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums font-bold text-slate-900">
                          {st.completedQty}
                        </td>
                        <td
                          className={`py-2.5 px-3 font-mono text-right tabular-nums font-bold ${
                            st.defectiveQty > 0 ? 'text-[#DC2626]' : 'text-slate-400'
                          }`}
                        >
                          {st.defectiveQty}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{st.operator}</td>
                        <td className="py-2.5 px-3 text-center">
                          <StatusBadge
                            status={st.status}
                            label={
                              st.status === 'completed'
                                ? '已完成'
                                : st.status === 'in_progress'
                                ? '加工中'
                                : st.status === 'pending'
                                ? '待派工'
                                : '未开始'
                            }
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {st.status === 'in_progress' ? (
                            <button
                              onClick={() => {
                                setReportOperation(`${st.operationNo} ${st.operationName}`);
                                setIsReportDrawerOpen(true);
                              }}
                              className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold"
                            >
                              立即报工
                            </button>
                          ) : st.status === 'completed' ? (
                            <span className="text-slate-400 font-medium">工步已闭环</span>
                          ) : (
                            <button className="text-slate-600 hover:text-slate-900 font-medium">
                              指派排产
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Materials */}
          {activeTab === 'materials' && (
            <div className="p-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-2.5 px-3 font-bold">物料编码</th>
                      <th className="py-2.5 px-3 font-bold">物料名称 / 规格</th>
                      <th className="py-2.5 px-3 font-bold text-right">需求配额</th>
                      <th className="py-2.5 px-3 font-bold text-right">已发料数</th>
                      <th className="py-2.5 px-3 font-bold">立体库储位</th>
                      <th className="py-2.5 px-3 font-bold text-center">齐套状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MATERIAL_REQUIREMENTS_DATA.map((mat) => (
                      <tr key={mat.materialCode} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{mat.materialCode}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{mat.materialName}</div>
                          <div className="text-xs text-slate-500">{mat.spec}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-800 font-medium">
                          {mat.requiredQty} {mat.unit}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums font-bold text-slate-900">
                          {mat.issuedQty} {mat.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{mat.warehouseLocation}</td>
                        <td className="py-2.5 px-3 text-center">
                          {mat.status === 'sufficient' ? (
                            <span className="text-[#059669] font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                              齐套已发
                            </span>
                          ) : (
                            <span className="text-[#DC2626] font-bold bg-red-50 px-2.5 py-0.5 rounded border border-red-300">
                              缺料预警
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Reports */}
          {activeTab === 'reports' && (
            <div className="p-4 space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-2.5 px-3 font-bold">报工时间</th>
                      <th className="py-2.5 px-3 font-bold">工序</th>
                      <th className="py-2.5 px-3 font-bold">机台设备</th>
                      <th className="py-2.5 px-3 font-bold text-right">合格数</th>
                      <th className="py-2.5 px-3 font-bold text-right">不合格数</th>
                      <th className="py-2.5 px-3 font-bold">缺陷说明</th>
                      <th className="py-2.5 px-3 font-bold">报工工员</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportList.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-700 font-medium">{rep.reportTime}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {rep.operationName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 font-semibold">{rep.equipmentCode}</td>
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums text-[#059669] font-bold text-sm">
                          +{rep.qualifiedQty}
                        </td>
                        <td
                          className={`py-2.5 px-3 font-mono text-right tabular-nums ${
                            rep.defectiveQty > 0 ? 'text-[#DC2626] font-bold' : 'text-slate-400 font-medium'
                          }`}
                        >
                          {rep.defectiveQty}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-xs">
                          {rep.defectReason || '无'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800 font-medium">{rep.operator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Quality */}
          {activeTab === 'quality' && (
            <div className="p-4 text-xs space-y-3">
              <div className="border border-slate-300 rounded p-3.5 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">首件质量检验报告 (FAI-20261016)</span>
                  <span className="text-[#059669] font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                    首检合格准批加工
                  </span>
                </div>
                <p className="text-slate-700 text-xs mt-1.5 leading-relaxed">
                  经三坐标首件扫描检测，主轴定位档外径尺寸 Φ45+0.005mm，同轴度 0.004mm，符合设计图样精密级公差标准。
                </p>
                <div className="text-xs text-slate-500 mt-2 font-medium">检验人: 钱丽萍 · 2026-10-16 11:20</div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1/3: Supporting Sidebar */}
        <div className="space-y-4">
          {/* Active exception banner with explicit warning label */}
          <div className="bg-red-50 border border-red-300 rounded-md p-4 text-xs tech-card-glow">
            <div className="flex items-center gap-2 text-[#DC2626] font-bold mb-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>现场质量异常提报 (APP-20261018-009)</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-medium">
              热处理后抽检8件轴头外圆硬度测得 HRC 26.5（技术图样下限为28）。
            </p>
            <div className="mt-3 pt-2 border-t border-red-200 flex items-center justify-between text-xs">
              <span className="text-[#DC2626] font-bold">状态: 技术总监审核中</span>
              <span className="text-slate-500 font-mono font-semibold">15:40 提报</span>
            </div>
          </div>

          {/* Key Milestones */}
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 text-xs tech-card-glow">
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2563EB]" />
              <span>工单节点里程碑 (Milestones)</span>
            </h4>
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-300 ml-1 font-medium">
              <div>
                <span className="font-bold text-slate-900 block">开工下料出库</span>
                <span className="text-xs text-slate-500 font-mono">2026-10-16 08:30 (已达成)</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">粗车尺寸初验</span>
                <span className="text-xs text-slate-500 font-mono">2026-10-17 16:00 (已达成)</span>
              </div>
              <div>
                <span className="font-bold text-[#2563EB] block">精车完工考核</span>
                <span className="text-xs text-slate-600 font-mono">2026-10-20 18:00 (进行中)</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block">终检与出厂包装</span>
                <span className="text-xs text-slate-400 font-mono">2026-10-22 17:00 (预估)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Reporting Right-side Drawer (生产报工抽屉) */}
      {isReportDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-300 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0F172A]">工序生产报工单录入</h3>
                  <span className="text-xs bg-blue-100 text-[#2563EB] font-bold px-2 py-0.5 rounded">
                    观择 MES 终端
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">工单单号: {order.code}</p>
              </div>
              <button
                onClick={() => setIsReportDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors"
                title="关闭抽屉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Form */}
            <form onSubmit={handleSubmitReport} className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded text-slate-800">
                <div className="font-bold text-sm text-[#0F172A]">产品: {order.productName}</div>
                <div className="text-xs text-slate-600 mt-1 font-mono font-medium">
                  规格: {order.spec} · 当前剩余在制待加工: 158 件
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  报工工序 <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportOperation}
                  onChange={(e) => setReportOperation(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900 font-medium focus:border-[#2563EB] focus:outline-hidden"
                  required
                >
                  <option value="OP30 数控精车外圆与倒角">OP30 数控精车外圆与倒角</option>
                  <option value="OP40 高频感应表面淬火">OP40 高频感应表面淬火</option>
                  <option value="OP50 精磨主轴配合档位">OP50 精磨主轴配合档位</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  加工机台设备 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reportEquipment}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-700 font-mono font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    合格完工数量 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      value={qualifiedQty}
                      onChange={(e) => setQualifiedQty(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded px-3 py-2 font-mono tabular-nums text-slate-900 font-bold focus:border-[#2563EB] focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">不合格报废数量</label>
                  <input
                    type="number"
                    min="0"
                    value={defectiveQty}
                    onChange={(e) => setDefectiveQty(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-3 py-2 font-mono tabular-nums text-slate-900 font-bold focus:border-[#2563EB] focus:outline-hidden"
                  />
                </div>
              </div>

              {defectiveQty > 0 && (
                <div className="animate-in fade-in duration-150">
                  <label className="block text-[#DC2626] font-bold mb-1">
                    不合格原因归类 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={defectReason}
                    onChange={(e) => setDefectReason(e.target.value)}
                    className="w-full border border-red-300 rounded px-3 py-2 bg-white text-slate-900 font-medium focus:border-red-500 focus:outline-hidden"
                  >
                    <option value="尺寸公差超标 (+0.015mm)">尺寸公差超标 (+0.015mm)</option>
                    <option value="加工表面划痕/振纹">加工表面划痕/振纹</option>
                    <option value="螺纹牙形与光洁度缺陷">螺纹牙形与光洁度缺陷</option>
                    <option value="毛坯铸造砂眼气孔">毛坯铸造砂眼气孔</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    开始加工时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 font-mono text-slate-900 font-semibold focus:border-[#2563EB] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    完工结束时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 font-mono text-slate-900 font-semibold focus:border-[#2563EB] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">责任操作员工</label>
                <input
                  type="text"
                  value="李振华 (工号: 1042 · 车削一组)"
                  readOnly
                  className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">自检结果及工艺说明</label>
                <textarea
                  rows={3}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:border-[#2563EB] focus:outline-hidden placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Fixed Drawer Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsReportDrawerOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
                >
                  取消返回
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Send className="w-4 h-4" />
                  <span>提交生产报工</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
