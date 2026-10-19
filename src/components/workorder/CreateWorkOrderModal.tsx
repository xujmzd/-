import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { WorkOrder } from '../../types/mes';

interface CreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newOrder: WorkOrder) => void;
}

export const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState({
    code: `MO2026101900${Math.floor(Math.random() * 90 + 10)}`,
    productName: '高精度主轴传动轴',
    productCode: 'PRD-8201',
    spec: 'Φ45×620mm / 40Cr调质',
    plannedQty: 600,
    unit: '件',
    workshop: '机加工一车间',
    line: '数控精密车削线-A',
    priority: 'normal' as 'urgent' | 'high' | 'normal',
    planStartDate: '2026-10-20',
    planEndDate: '2026-10-27',
    owner: '李振华',
    batchNo: `B261020-${Math.floor(Math.random() * 9 + 1).toString().padStart(2, '0')}`,
    remarks: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      code: formData.code,
      productCode: formData.productCode,
      productName: formData.productName,
      spec: formData.spec,
      plannedQty: Number(formData.plannedQty),
      completedQty: 0,
      scrappedQty: 0,
      progress: 0,
      workshop: formData.workshop,
      line: formData.line,
      planStartDate: formData.planStartDate,
      planEndDate: formData.planEndDate,
      status: 'pending',
      priority: formData.priority,
      owner: formData.owner,
      unit: formData.unit,
      batchNo: formData.batchNo,
      remarks: formData.remarks,
    };
    onCreate(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-md shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 rounded-t-md">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#2563EB] rounded-xs" />
            <h3 className="text-base font-bold text-[#1F2937]">新建生产工单</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                工单编号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                生产批次号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.batchNo}
                onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono focus:border-[#2563EB] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                产品名称 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productName}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '高精度主轴传动轴') {
                    setFormData({
                      ...formData,
                      productName: val,
                      productCode: 'PRD-8201',
                      spec: 'Φ45×620mm / 40Cr调质',
                    });
                  } else if (val === '重型液压精密法兰盘') {
                    setFormData({
                      ...formData,
                      productName: val,
                      productCode: 'PRD-7105',
                      spec: 'Φ120×45mm / 316L',
                    });
                  } else if (val === '精密双列滚珠轴承座') {
                    setFormData({
                      ...formData,
                      productName: val,
                      productCode: 'PRD-5320',
                      spec: 'H-205 / QT500-7球铁',
                    });
                  } else {
                    setFormData({
                      ...formData,
                      productName: val,
                      productCode: 'PRD-6542',
                      spec: 'MK-80 / AlSi10Mg压铸',
                    });
                  }
                }}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:border-[#2563EB] focus:outline-hidden"
              >
                <option value="高精度主轴传动轴">PRD-8201 - 高精度主轴传动轴</option>
                <option value="重型液压精密法兰盘">PRD-7105 - 重型液压精密法兰盘</option>
                <option value="精密双列滚珠轴承座">PRD-5320 - 精密双列滚珠轴承座</option>
                <option value="减速箱一体化铸铝壳体">PRD-6542 - 减速箱一体化铸铝壳体</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">规格型号</label>
              <input
                type="text"
                value={formData.spec}
                readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                计划生产数量 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={formData.plannedQty}
                  onChange={(e) => setFormData({ ...formData, plannedQty: Number(e.target.value) })}
                  className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 font-mono tabular-nums focus:border-[#2563EB] focus:outline-hidden"
                  required
                />
                <span className="inline-flex items-center px-3 bg-slate-100 border border-slate-300 rounded text-slate-600">
                  {formData.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">生产优先级</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as 'urgent' | 'high' | 'normal',
                  })
                }
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:border-[#2563EB] focus:outline-hidden"
              >
                <option value="normal">普通</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                计划生产车间 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.workshop}
                onChange={(e) => setFormData({ ...formData, workshop: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:border-[#2563EB] focus:outline-hidden"
              >
                <option value="机加工一车间">机加工一车间</option>
                <option value="机加工二车间">机加工二车间</option>
                <option value="齿轮专机车间">齿轮专机车间</option>
                <option value="钣金冲压车间">钣金冲压车间</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">指派产线 / 工作站</label>
              <input
                type="text"
                value={formData.line}
                onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:border-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                计划开工日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.planStartDate}
                onChange={(e) => setFormData({ ...formData, planStartDate: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:border-[#2563EB] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                计划完工日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.planEndDate}
                onChange={(e) => setFormData({ ...formData, planEndDate: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:border-[#2563EB] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">工艺路线说明及备注</label>
            <textarea
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="填写工艺要求、客户合同订单号或特殊交货标准..."
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:border-[#2563EB] focus:outline-hidden placeholder:text-slate-400"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded font-medium flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>保存并生成工单</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
