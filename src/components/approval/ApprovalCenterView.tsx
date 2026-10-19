import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RotateCcw,
  FileText,
  User,
  X,
  Send,
  AlertTriangle,
  Paperclip,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { APPROVAL_ITEMS_DATA } from '../../data/mockData';
import { ApprovalItem } from '../../types/mes';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityTag } from '../common/PriorityTag';

export const ApprovalCenterView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'mine' | 'handled'>('pending');
  const [approvalList, setApprovalList] = useState<ApprovalItem[]>(APPROVAL_ITEMS_DATA);

  // Selected item for drawer view
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(approvalList[0]);
  const [commentText, setCommentText] = useState('经力学分析复核，偏差在安全余量内，同意特采放行。');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [filterApplicant, setFilterApplicant] = useState('');

  // Counts
  const countPending = approvalList.filter((a) => a.status === 'pending').length;
  const countMine = 1;
  const countHandled = approvalList.filter((a) => a.status !== 'pending').length;

  const filteredList = approvalList.filter((item) => {
    if (activeTab === 'pending' && item.status !== 'pending') return false;
    if (activeTab === 'handled' && item.status === 'pending') return false;
    if (filterType !== 'all' && item.businessType !== filterType) return false;
    if (filterApplicant && !item.applicant.includes(filterApplicant)) return false;
    return true;
  });

  const handleApprove = () => {
    if (!selectedApproval) return;
    setApprovalList(
      approvalList.map((a) =>
        a.id === selectedApproval.id
          ? {
              ...a,
              status: 'approved',
              timeline: [
                ...a.timeline.map((step) =>
                  step.status === 'current'
                    ? { ...step, status: 'completed' as const, comment: commentText, time: '刚刚' }
                    : step
                ),
              ],
            }
          : a
      )
    );
    setToastMessage(`单据 [${selectedApproval.code}] 已审批通过！`);
    setTimeout(() => setToastMessage(null), 3000);
    setSelectedApproval(null);
  };

  const handleReject = () => {
    if (!selectedApproval) return;
    setApprovalList(
      approvalList.map((a) =>
        a.id === selectedApproval.id
          ? {
              ...a,
              status: 'rejected',
              timeline: [
                ...a.timeline.map((step) =>
                  step.status === 'current'
                    ? { ...step, status: 'rejected' as const, comment: commentText, time: '刚刚' }
                    : step
                ),
              ],
            }
          : a
      )
    );
    setToastMessage(`单据 [${selectedApproval.code}] 已予以驳回！`);
    setTimeout(() => setToastMessage(null), 3000);
    setSelectedApproval(null);
  };

  return (
    <div className="space-y-4 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#0C1527] text-white text-xs px-4 py-3 rounded-md shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">工作流审批中心</h1>
            <span className="text-xs bg-blue-50 text-[#2563EB] font-bold px-2 py-0.5 rounded border border-blue-200">
              Flowable 6.8.1 引擎会签
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            质量特采放行、工单超差报废核销、紧急缺料调拨及 APS 计划变更智能在线签批。
          </p>
        </div>
      </div>

      {/* Status Tabs with explicit counts and alerts */}
      <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-4 pt-2.5 rounded-md overflow-x-auto shadow-2xs">
        {[
          { key: 'pending', label: '待我审批单据', count: countPending, isAlert: countPending > 0 },
          { key: 'mine', label: '我发起的申请', count: countMine },
          { key: 'handled', label: '已办结归档流转', count: countHandled },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all relative whitespace-nowrap ${
                isActive
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono tabular-nums text-xs px-2 py-0.5 rounded ${
                  tab.isAlert
                    ? 'bg-red-100 text-[#DC2626] font-bold ring-1 ring-red-300'
                    : isActive
                    ? 'bg-blue-100 text-[#2563EB] font-bold'
                    : 'bg-slate-100 text-slate-600 font-medium'
                }`}
              >
                {tab.count} 项
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#E2E8F0] p-3 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-bold">业务类型:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-900 font-medium focus:outline-hidden"
            >
              <option value="all">全部审批业务类型</option>
              <option value="质量特采审批">质量特采审批</option>
              <option value="工单超差报废审批">工单超差报废审批</option>
              <option value="紧急调料申请">紧急调料申请</option>
              <option value="生产计划变更">生产计划变更</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 border border-slate-300 rounded px-3 py-1.5 bg-white">
            <User className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索申请人员姓名..."
              value={filterApplicant}
              onChange={(e) => setFilterApplicant(e.target.value)}
              className="focus:outline-hidden text-xs w-44 text-slate-900 font-medium"
            />
          </div>
        </div>

        <button
          onClick={() => {
            setFilterType('all');
            setFilterApplicant('');
          }}
          className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>重置筛选</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-md overflow-hidden tech-card-glow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-3 font-bold min-w-[150px]">审批单号</th>
                <th className="py-3 px-3 font-bold min-w-[130px]">业务类型</th>
                <th className="py-3 px-3 font-bold min-w-[240px]">申请事由 / 业务技术摘要</th>
                <th className="py-3 px-3 font-bold min-w-[130px]">申请人 / 归属部门</th>
                <th className="py-3 px-3 font-bold min-w-[130px]">当前流转审批节点</th>
                <th className="py-3 px-3 font-bold min-w-[135px]">提交时间</th>
                <th className="py-3 px-3 font-bold text-center min-w-[100px]">状态</th>
                <th className="py-3 px-3 font-bold text-center min-w-[110px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${
                    selectedApproval?.id === item.id ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => setSelectedApproval(item)}
                >
                  <td className="py-3 px-3 font-mono font-bold text-[#2563EB]">
                    <div className="flex items-center gap-1.5">
                      <span>{item.code}</span>
                      {item.urgency === 'urgent' && (
                        <span className="text-xs bg-red-100 text-[#DC2626] border border-red-300 px-1.5 py-0.2 rounded font-bold">
                          加急审批
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{item.businessType}</td>
                  <td className="py-3 px-3 text-slate-800 max-w-sm truncate font-medium">{item.summary}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{item.applicant}</div>
                    <div className="text-xs text-slate-500 font-medium">{item.department}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800 font-semibold">{item.currentStep}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 text-xs">
                    {item.submitTime}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApproval(item);
                      }}
                      className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold"
                    >
                      {item.status === 'pending' ? '立即签批' : '查看流程'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Detail Drawer */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-300 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {selectedApproval.businessType}
                  </h3>
                  <StatusBadge status={selectedApproval.status} />
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono font-medium">
                  审批流程单号: {selectedApproval.code}
                </p>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded transition-colors"
                title="关闭抽屉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-5 text-xs">
              {/* Document Info Card */}
              <div className="bg-slate-50 p-4 rounded border border-slate-300 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">申请主题:</span>
                  <span className="font-bold text-slate-900 text-right">
                    {selectedApproval.summary}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">关联工单 / 对象:</span>
                  <span className="font-mono font-bold text-[#2563EB] text-sm">
                    {selectedApproval.details.targetCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">涉及制造零件:</span>
                  <span className="text-slate-900 font-bold">{selectedApproval.details.productName}</span>
                </div>
                <div className="border-t border-slate-200 pt-2.5">
                  <span className="text-slate-600 font-bold block mb-1">现场实测情况及偏离原因:</span>
                  <div className="text-slate-900 bg-white p-3 rounded border border-slate-300 leading-relaxed font-medium">
                    {selectedApproval.details.reason}
                  </div>
                </div>
                <div>
                  <span className="text-slate-600 font-bold block mb-1">工艺力学影响评估:</span>
                  <div className="text-slate-800 bg-white p-3 rounded border border-slate-300 leading-relaxed font-medium">
                    {selectedApproval.details.impact}
                  </div>
                </div>

                {selectedApproval.details.attachmentName && (
                  <div className="flex items-center gap-2 pt-1 text-slate-700 font-medium">
                    <Paperclip className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-mono text-xs underline cursor-pointer text-[#2563EB] font-bold">
                      {selectedApproval.details.attachmentName}
                    </span>
                  </div>
                )}
              </div>

              {/* Flowable Approval Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <span>审批流转时序记录 (Flowable BPMN Engine)</span>
                </h4>

                <div className="space-y-4 relative pl-5 border-l-2 border-slate-300 ml-2">
                  {selectedApproval.timeline.map((step, idx) => {
                    const isDone = step.status === 'completed';
                    const isCurr = step.status === 'current';
                    const isRej = step.status === 'rejected';

                    return (
                      <div key={idx} className="relative font-medium">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                            isDone
                              ? 'border-emerald-500 text-emerald-500'
                              : isCurr
                              ? 'border-[#2563EB] bg-[#2563EB]'
                              : isRej
                              ? 'border-red-500 text-red-500'
                              : 'border-slate-300'
                          }`}
                        />
                        <div className="flex items-baseline justify-between">
                          <span
                            className={`font-bold ${
                              isCurr ? 'text-[#2563EB]' : 'text-slate-900'
                            }`}
                          >
                            {step.stepName}
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-semibold">{step.time}</span>
                        </div>
                        <div className="text-slate-700 mt-0.5 font-medium">签批人: {step.handler}</div>
                        {step.comment && (
                          <div className="bg-slate-100 p-2.5 rounded text-xs text-slate-800 mt-1 border border-slate-300 font-medium">
                            批注意见: {step.comment}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Approval Comment Area */}
              {selectedApproval.status === 'pending' && (
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <label className="block text-slate-900 font-bold">
                    填写会签评语 <span className="text-red-500">*</span>
                  </label>

                  {/* Quick comment snippets */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '经力学分析复核，偏差在安全余量内，同意特采放行。',
                      '情况属实，同意调料，注意产线平衡。',
                      '超差超出极限，存在安全隐患，予以驳回。',
                    ].map((phrase, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCommentText(phrase)}
                        className="text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors font-medium border border-slate-200"
                      >
                        {phrase.slice(0, 16)}...
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="输入审核评语或整改指导意见..."
                    className="w-full border border-slate-300 rounded p-3 text-xs text-slate-900 font-medium focus:border-[#2563EB] focus:outline-hidden"
                  />
                </div>
              )}
            </div>

            {/* Fixed Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between sticky bottom-0">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold"
              >
                关闭返回
              </button>

              {selectedApproval.status === 'pending' && (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 border border-red-300 bg-white hover:bg-red-50 text-[#DC2626] rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>驳回申请</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-[#059669] hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>同意并通过审批</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
