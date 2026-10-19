export type WorkOrderStatus = 'all' | 'pending' | 'in_production' | 'completed' | 'overdue';

export type EquipmentStatus = 'all' | 'running' | 'idle' | 'fault' | 'maintenance';

export interface WorkOrder {
  id: string;
  code: string;
  productCode: string;
  productName: string;
  spec: string;
  plannedQty: number;
  completedQty: number;
  scrappedQty: number;
  progress: number;
  workshop: string;
  line: string;
  planStartDate: string;
  planEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'pending' | 'in_production' | 'completed' | 'overdue';
  priority: 'urgent' | 'high' | 'normal';
  owner: string;
  unit: string;
  batchNo: string;
  customerOrder?: string;
  remarks?: string;
}

export interface ProcessStep {
  operationNo: string;
  operationName: string;
  workCenter: string;
  equipmentCode: string;
  equipmentName: string;
  plannedQty: number;
  completedQty: number;
  defectiveQty: number;
  operator: string;
  status: 'completed' | 'in_progress' | 'pending' | 'unstarted';
  standardTime: string;
}

export interface MaterialRequirement {
  materialCode: string;
  materialName: string;
  spec: string;
  requiredQty: number;
  issuedQty: number;
  unit: string;
  warehouseLocation: string;
  status: 'sufficient' | 'shortage';
}

export interface ReportingRecord {
  id: string;
  reportTime: string;
  operationName: string;
  equipmentCode: string;
  qualifiedQty: number;
  defectiveQty: number;
  defectReason?: string;
  operator: string;
  durationHours: number;
}

export interface MaterialInventoryItem {
  id: string;
  code: string;
  name: string;
  spec: string;
  stock: number;
  safetyStock: number;
  unit: string;
  location: string;
  status: 'sufficient' | 'low';
}

export interface DefectDistributionItem {
  category: string;
  quantity: number;
  percentage: number;
}

export interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  type: string;
  workshop: string;
  status: 'running' | 'idle' | 'fault' | 'maintenance';
  currentOrder?: string;
  oee: number;
  operatingHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  faultDesc?: string;
  faultTime?: string;
  faultPriority?: 'urgent' | 'high' | 'normal';
}

export interface MaintenanceTask {
  id: string;
  taskCode: string;
  equipmentCode: string;
  equipmentName: string;
  taskType: '故障报修' | '定期保养' | '日常巡检';
  priority: 'urgent' | 'high' | 'normal';
  reporter: string;
  assignee: string;
  createTime: string;
  status: '待响应' | '处理中' | '已完成';
  faultDesc: string;
}

export interface ApprovalItem {
  id: string;
  code: string;
  businessType: string;
  summary: string;
  applicant: string;
  department: string;
  currentStep: string;
  submitTime: string;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'urgent' | 'normal';
  details: {
    targetCode: string;
    productName: string;
    reason: string;
    impact: string;
    specStandard?: string;
    actualDeviation?: string;
    attachmentName?: string;
    applicantNotes?: string;
  };
  timeline: {
    stepName: string;
    handler: string;
    time?: string;
    status: 'completed' | 'current' | 'pending' | 'rejected';
    comment?: string;
  }[];
}

export interface ProductionActivity {
  id: string;
  time: string;
  type: 'report' | 'inbound' | 'defect' | 'maintenance';
  title: string;
  description: string;
  operator: string;
  relatedCode: string;
}
