import React, { useState } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  Info,
  Clock,
  Search,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Database,
  Zap,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityTag } from '../common/PriorityTag';
import { ProgressBar } from '../common/ProgressBar';

export const DesignSystemView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'tokens' | 'buttons' | 'forms' | 'feedback' | 'states'>('tokens');
  const [demoSwitch, setDemoSwitch] = useState(true);
  const [demoCheckbox, setDemoCheckbox] = useState(true);
  const [demoRadio, setDemoRadio] = useState('option1');
  const [demoToast, setDemoToast] = useState(false);
  const [demoConfirmModal, setDemoConfirmModal] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#E2E8F0] p-4 rounded-md shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              观择 MES · 设计规范与组件全景 (Design System)
            </h1>
            <span className="text-xs bg-blue-50 text-[#2563EB] px-2.5 py-0.5 rounded border border-blue-200 font-mono font-bold">
              Element UI 2.15.6 工业对应规范
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            高端智能制造科技感界面设计规范，涵盖数字工厂色彩令牌、等宽排版阶梯、表单控件高度(32-36px)、状态语义及异常态处理。
          </p>
        </div>

        {/* Section navigator */}
        <div className="flex items-center gap-1 border border-slate-300 rounded p-0.5 bg-slate-100 text-xs font-semibold">
          {[
            { key: 'tokens', label: '科技色彩与令牌 (Tokens)' },
            { key: 'buttons', label: '按钮与操作 (Buttons)' },
            { key: 'forms', label: '表单控件 (Form Controls)' },
            { key: 'feedback', label: '反馈与徽标 (Feedback)' },
            { key: 'states', label: '缺省与异常态 (States)' },
          ].map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key as any)}
              className={`px-3 py-1.5 rounded transition-all ${
                activeSection === sec.key
                  ? 'bg-white text-[#2563EB] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog Demo */}
      {demoConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-md shadow-2xl border border-slate-300 max-w-sm w-full p-5 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认废弃此工单任务？</h4>
                <p className="text-slate-600 mt-1 font-medium leading-relaxed">
                  此操作将撤销当前工段派工排产，物料将原路退回立体库房。该破坏性操作不可逆！
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDemoConfirmModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold"
              >
                取消返回
              </button>
              <button
                onClick={() => {
                  setDemoConfirmModal(false);
                  setDemoToast(true);
                  setTimeout(() => setDemoToast(false), 2500);
                }}
                className="px-3.5 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white rounded font-bold shadow-2xs"
              >
                确认废弃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: DESIGN TOKENS */}
      {activeSection === 'tokens' && (
        <div className="space-y-4">
          {/* Colors */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-md space-y-3 tech-card-glow">
            <h3 className="text-sm font-bold text-[#0F172A]">1. 观择 MES 工业科技色彩体系规范 (Tech Industrial Palette)</h3>
            <p className="text-xs text-slate-500 font-medium">
              结合黑曜工业深蓝基底与电光蓝、青翠数码绿及警戒红，所有特殊效果均附带明确的文本描述与高对比轮廓。
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 pt-2 text-xs">
              <div className="border border-slate-300 rounded p-3 space-y-1.5 bg-slate-50/50">
                <div className="h-10 rounded bg-[#0C1527] border border-slate-800" />
                <div className="font-bold text-slate-900">黑曜工业暗蓝</div>
                <div className="font-mono text-xs text-slate-500 font-semibold">#0C1527</div>
                <div className="text-xs text-slate-500">侧边主导航基底</div>
              </div>

              <div className="border border-slate-300 rounded p-3 space-y-1.5 bg-slate-50/50">
                <div className="h-10 rounded bg-[#2563EB]" />
                <div className="font-bold text-slate-900">工程电光蓝</div>
                <div className="font-mono text-xs text-slate-500 font-semibold">#2563EB</div>
                <div className="text-xs text-slate-500">核心主操作 / 选中项</div>
              </div>

              <div className="border border-slate-300 rounded p-3 space-y-1.5 bg-slate-50/50">
                <div className="h-10 rounded bg-[#0EA5E9]" />
                <div className="font-bold text-slate-900">数智亮青蓝</div>
                <div className="font-mono text-xs text-slate-500 font-semibold">#0EA5E9</div>
                <div className="text-xs text-slate-500">科技感微高亮 / 遥测</div>
              </div>

              <div className="border border-slate-300 rounded p-3 space-y-1.5 bg-slate-50/50">
                <div className="h-10 rounded bg-[#10B981]" />
                <div className="font-bold text-[#059669]">翠绿 / 完工通过</div>
                <div className="font-mono text-xs text-slate-500 font-semibold">#10B981</div>
                <div className="text-xs text-slate-500">合格品 / 正常开机</div>
              </div>

              <div className="border border-slate-300 rounded p-3 space-y-1.5 bg-slate-50/50">
                <div className="h-10 rounded bg-[#F59E0B]" />
                <div className="font-bold text-[#D97706]">琥珀橙 / 预警维保</div>
                <div className="font-mono text-xs text-slate-500 font-semibold">#F59E0B</div>
                <div className="text-xs text-slate-500">低于安全库存 / 保养</div>
              </div>

              <div className="border border-slate-300 rounded p-3 space-y-1.5 bg-slate-50/50">
                <div className="h-10 rounded bg-[#EF4444]" />
                <div className="font-bold text-[#DC2626]">警示红 / 故障超标</div>
                <div className="font-mono text-xs text-slate-500 font-semibold">#EF4444</div>
                <div className="text-xs text-slate-500">机床停机 / 逾期延误</div>
              </div>
            </div>
          </div>

          {/* Typography Scale */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-md space-y-3 tech-card-glow">
            <h3 className="text-sm font-bold text-[#0F172A]">2. 中文与等宽数字排版阶梯 (Typography)</h3>

            <div className="border border-slate-300 rounded divide-y divide-slate-200 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 font-bold w-32">主指标数值 (30px)</span>
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                  12,860 <span className="text-xs font-sans text-slate-600 font-semibold">件</span>
                </span>
                <span className="text-slate-500 text-xs font-medium">四大核心 KPI 展现</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 font-bold w-32">页面顶级标题 (20px)</span>
                <span className="text-xl font-bold text-slate-900">生产运营工作台</span>
                <span className="text-slate-500 text-xs font-medium">各页面顶部一级标题</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 font-bold w-32">模块栏目标题 (14px)</span>
                <span className="text-sm font-bold text-slate-900">日生产产量趋势对比 (MES 计划 vs 实际)</span>
                <span className="text-slate-500 text-xs font-medium">业务卡片与数据表头</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 font-bold w-32">正文与表格 (13-14px)</span>
                <span className="text-xs text-slate-800 font-semibold">高精度主轴传动轴 Φ45×620mm</span>
                <span className="text-slate-500 text-xs font-medium">常规数据与工单参数呈现</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500 font-bold w-32">工单编号等宽 (Tabular)</span>
                <span className="font-mono text-xs text-[#2563EB] font-bold">MO202610190028</span>
                <span className="text-slate-500 text-xs font-medium">强制 tabular-nums 等宽对其</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: BUTTONS */}
      {activeSection === 'buttons' && (
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md space-y-4 tech-card-glow">
          <h3 className="text-sm font-bold text-[#0F172A]">3. 按钮操作规范 (Element UI 映射)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="border border-slate-300 rounded p-4 space-y-3">
              <h4 className="font-bold text-slate-800">主副操作按钮</h4>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded font-bold shadow-2xs">
                  主要按钮 (Primary)
                </button>
                <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded font-semibold">
                  次要按钮 (Default)
                </button>
                <button className="px-3 py-2 text-[#2563EB] hover:underline font-bold">
                  文字按钮 (Text)
                </button>
              </div>
            </div>

            <div className="border border-slate-300 rounded p-4 space-y-3">
              <h4 className="font-bold text-slate-800">功能与破坏性按钮</h4>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-3.5 py-2 bg-[#059669] hover:bg-emerald-700 text-white rounded font-bold flex items-center gap-1.5 shadow-2xs">
                  <Check className="w-4 h-4" />
                  <span>通过审批 (Success)</span>
                </button>
                <button
                  onClick={() => setDemoConfirmModal(true)}
                  className="px-3.5 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>破坏性操作 (Danger)</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-300 rounded p-4 space-y-3">
              <h4 className="font-bold text-slate-800">交互状态 (Loading / Disabled)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  disabled
                  className="px-4 py-2 bg-[#2563EB]/70 text-white rounded font-bold flex items-center gap-2 cursor-wait"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>网络同步中...</span>
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-slate-100 border border-slate-300 text-slate-400 rounded font-bold cursor-not-allowed"
                >
                  无权操作 (Disabled)
                </button>
              </div>
            </div>

            <div className="border border-slate-300 rounded p-4 space-y-3">
              <h4 className="font-bold text-slate-800">尺寸规格对比 (Sizes)</h4>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-[#2563EB] text-white rounded text-xs font-bold shadow-2xs">
                  Default (36px)
                </button>
                <button className="px-3 py-1.5 bg-[#2563EB] text-white rounded text-xs font-bold shadow-2xs">
                  Small (32px)
                </button>
                <button className="px-2.5 py-1 bg-[#2563EB] text-white rounded text-xs font-bold shadow-2xs">
                  Mini (28px)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: FORM CONTROLS */}
      {activeSection === 'forms' && (
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md space-y-4 tech-card-glow">
          <h3 className="text-sm font-bold text-[#0F172A]">4. 表单与录入控件 (Form Controls)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="block text-slate-800 font-bold mb-1">
                带前缀检索框 (el-input)
              </label>
              <div className="flex items-center gap-2 border border-slate-300 rounded px-3 py-2 bg-white focus-within:border-[#2563EB]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索物料或工单..."
                  className="focus:outline-hidden text-xs w-full text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">带单位数值录入框</label>
              <div className="flex">
                <input
                  type="number"
                  defaultValue={500}
                  className="flex-1 border border-slate-300 rounded-l px-3 py-2 text-slate-900 font-mono tabular-nums font-bold focus:outline-hidden focus:border-[#2563EB]"
                />
                <span className="bg-slate-100 border border-l-0 border-slate-300 rounded-r px-3.5 py-2 text-slate-700 font-bold">
                  件
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">下拉选择器 (el-select)</label>
              <select className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900 font-medium focus:outline-hidden focus:border-[#2563EB]">
                <option>机加工一车间 (精密车削线)</option>
                <option>机加工二车间 (卧式加工线)</option>
                <option>模具与特种车间</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-800 font-bold">单选框与复选框</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={demoCheckbox}
                    onChange={(e) => setDemoCheckbox(e.target.checked)}
                    className="accent-[#2563EB] w-4 h-4 rounded cursor-pointer"
                  />
                  <span>合格品自动入库</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="radio-demo"
                    checked={demoRadio === 'option1'}
                    onChange={() => setDemoRadio('option1')}
                    className="accent-[#2563EB] w-4 h-4 cursor-pointer"
                  />
                  <span>标准定额工时</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-800 font-bold">开关组件 (el-switch)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDemoSwitch(!demoSwitch)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    demoSwitch ? 'bg-[#2563EB]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                      demoSwitch ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-slate-800 font-semibold">{demoSwitch ? '自动报检已启用' : '人工报检'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-800 font-bold">上传理化报告 (el-upload)</label>
              <div className="border border-dashed border-slate-300 rounded p-2.5 text-center hover:border-[#2563EB] cursor-pointer bg-slate-50">
                <div className="flex items-center justify-center gap-2 text-slate-700 font-medium">
                  <Upload className="w-4 h-4 text-[#2563EB]" />
                  <span>点击上传首检三坐标检测报告</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FEEDBACK */}
      {activeSection === 'feedback' && (
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md space-y-4 tech-card-glow">
          <h3 className="text-sm font-bold text-[#0F172A]">5. 状态徽章与效果文字包含规范 (Non-Pill Badges)</h3>
          <p className="text-xs text-slate-500 font-medium">
            每个微效果（如闪烁光圈、呼吸指示灯、高亮条）必须包含且紧邻明确的中文文字描述，防止仅靠颜色传递状态。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="border border-slate-300 rounded p-4 space-y-3">
              <h4 className="font-bold text-slate-800">状态标签徽章 (含显式文本)</h4>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <StatusBadge status="in_production" label="生产中 [进行中]" />
                <StatusBadge status="completed" label="已完成 [全闭环]" />
                <StatusBadge status="overdue" label="已逾期 [延误2天]" />
                <StatusBadge status="pending" label="待下达 [就绪]" />
                <StatusBadge status="fault" label="故障停机 [急停报警]" />
              </div>
            </div>

            <div className="border border-slate-300 rounded p-4 space-y-3">
              <h4 className="font-bold text-slate-800">优先级与进度展示</h4>
              <div className="flex items-center gap-2">
                <PriorityTag priority="urgent" />
                <PriorityTag priority="high" />
                <PriorityTag priority="normal" />
              </div>
              <div className="space-y-2.5 pt-1">
                <ProgressBar progress={75} status="in_production" />
                <ProgressBar progress={100} status="completed" />
                <ProgressBar progress={45} status="overdue" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: STATES */}
      {activeSection === 'states' && (
        <div className="bg-white border border-[#E2E8F0] p-4 rounded-md space-y-4 tech-card-glow">
          <h3 className="text-sm font-bold text-[#0F172A]">6. 缺省态、骨架屏加载与 SCADA 网络重连态</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            {/* Empty State */}
            <div className="border border-slate-300 rounded p-6 text-center space-y-2.5 bg-slate-50/50">
              <div className="w-10 h-10 rounded-full bg-slate-200 mx-auto flex items-center justify-center text-slate-500">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">暂无待处理报修工单</h4>
              <p className="text-xs text-slate-500 font-medium">
                华东一厂全部机台处于健康受控状态，未产生待响应故障。
              </p>
              <button className="px-3.5 py-1.5 bg-[#2563EB] text-white rounded text-xs font-bold shadow-2xs">
                发起预防性点检
              </button>
            </div>

            {/* Skeleton Loading State */}
            <div className="border border-slate-300 rounded p-4 space-y-3 bg-white">
              <div className="text-xs font-bold text-slate-600">骨架屏加载态 (Skeleton)</div>
              <div className="animate-pulse space-y-2.5">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-9 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            </div>

            {/* Error / Retry State */}
            <div className="border border-red-300 rounded p-6 text-center space-y-2.5 bg-red-50/40">
              <div className="w-10 h-10 rounded-full bg-red-100 mx-auto flex items-center justify-center text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">车间 SCADA 总线通讯中断</h4>
              <p className="text-xs text-slate-600 font-medium">
                无法从现场 PLC 采集网关获取实时数据，请检查现场工控局域网。
              </p>
              <button className="px-3.5 py-1.5 border border-red-300 bg-white text-red-600 hover:bg-red-50 rounded text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>立即重新握手连接</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
