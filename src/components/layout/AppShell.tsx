import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Truck,
  Factory,
  CalendarCheck,
  ShieldCheck,
  Package,
  Wrench,
  CheckSquare2,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Maximize2,
  Minimize2,
  X,
  Palette,
  Activity,
  Radio,
  Zap,
} from 'lucide-react';

export type ScreenId =
  | 'dashboard'
  | 'workorders'
  | 'workorder_detail'
  | 'equipment'
  | 'approval'
  | 'design_system';

export interface PageTab {
  id: ScreenId;
  title: string;
  closable: boolean;
  orderCode?: string;
}

interface AppShellProps {
  currentScreen: ScreenId;
  activeOrderCode?: string;
  onNavigate: (screen: ScreenId, orderCode?: string) => void;
  openTabs: PageTab[];
  onCloseTab: (tabId: ScreenId) => void;
  children: React.ReactNode;
}

interface NavItem {
  id: ScreenId | string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeAlert?: string;
  isHighlight?: boolean;
  isSub?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const AppShell: React.FC<AppShellProps> = ({
  currentScreen,
  activeOrderCode,
  onNavigate,
  openTabs,
  onCloseTab,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState('华东第一制造基地 / 机加工一车间');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const navGroups: NavGroup[] = [
    {
      groupTitle: '核心生产协同',
      items: [
        { id: 'dashboard', label: '生产运营工作台', icon: LayoutDashboard },
        { id: 'workorders', label: '生产工单管理', icon: Factory, badge: '48单' },
        { id: 'equipment', label: '设备物联网监控', icon: Wrench, badgeAlert: '2台报警' },
        { id: 'approval', label: '工作流审批中心', icon: CheckSquare2, badgeAlert: '4项待审' },
      ],
    },
    {
      groupTitle: '工业系统规范',
      items: [
        { id: 'design_system', label: '设计规范与组件库', icon: Palette, isHighlight: true },
        { id: 'base_data', label: '基础物料与BOM', icon: Layers, isSub: true },
        { id: 'orders', label: '销售制造订单', icon: ShoppingBag, isSub: true },
        { id: 'purchasing', label: '采购协同追溯', icon: Truck, isSub: true },
        { id: 'scheduling', label: 'APS 高级排产', icon: CalendarCheck, isSub: true },
        { id: 'quality', label: 'SPC 质量监控', icon: ShieldCheck, isSub: true },
        { id: 'warehouse', label: 'WMS 智能仓储', icon: Package, isSub: true },
        { id: 'reports', label: '生产报表分析', icon: BarChart3, isSub: true },
        { id: 'system', label: '系统管理设置', icon: Settings, isSub: true },
      ],
    },
  ];

  // Breadcrumbs text
  let breadcrumbPrimary = '生产运营';
  let breadcrumbSecondary = '生产运营工作台';

  if (currentScreen === 'workorders') {
    breadcrumbPrimary = '生产管理';
    breadcrumbSecondary = '生产工单管理清单';
  } else if (currentScreen === 'workorder_detail') {
    breadcrumbPrimary = '生产管理';
    breadcrumbSecondary = `工单执行与工序报工 (${activeOrderCode || 'MO202610190028'})`;
  } else if (currentScreen === 'equipment') {
    breadcrumbPrimary = '设备管理';
    breadcrumbSecondary = '设备运行与维护监控';
  } else if (currentScreen === 'approval') {
    breadcrumbPrimary = '审批中心';
    breadcrumbSecondary = '待我审批单据';
  } else if (currentScreen === 'design_system') {
    breadcrumbPrimary = '设计体系';
    breadcrumbSecondary = '设计规范与组件库全景';
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6F9] text-[#0F172A]">
      {/* 1. Industrial Tech Sidebar (#0C1527) */}
      <aside
        className={`bg-[#0C1527] text-slate-200 transition-all duration-200 ease-in-out flex flex-col shrink-0 z-30 select-none border-r border-[#1C3256] ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Brand / Logo lockup */}
        <div className="h-14 border-b border-[#1C3256] flex items-center px-4 gap-3 bg-[#080E1C] relative overflow-hidden">
          {/* Subtle tech top cyan glow accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#6366F1]" />

          {/* Geometric Tech Logo Icon */}
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#2563EB] to-[#0284C7] flex items-center justify-center text-white shrink-0 shadow-md font-bold tracking-wider relative group">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <path d="M7 14v4a2 2 0 0 0 2 2h5" />
            </svg>
          </div>

          {!sidebarCollapsed && (
            <div className="min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-wide text-sm truncate">
                  观择 MES
                </span>
                <span className="text-xs text-[#38BDF8] bg-[#0284C7]/20 font-mono font-semibold px-1.5 py-0.2 rounded border border-[#0284C7]/40">
                  DIGITAL
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium tracking-wider truncate">
                数字工厂 · 精密智造
              </div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                  <span>{group.groupTitle}</span>
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentScreen === item.id ||
                  (item.id === 'workorders' && currentScreen === 'workorder_detail');

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!item.isSub) {
                        onNavigate(item.id as ScreenId);
                      } else {
                        alert(`已载入 [${item.label}] 权限，当前展示核心聚焦视图。`);
                      }
                    }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs transition-all relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-semibold shadow-xs ring-1 ring-blue-400/30'
                        : item.isHighlight
                        ? 'bg-[#13223E] text-[#38BDF8] border border-[#1E3A8A] hover:bg-[#1E345D]'
                        : 'text-slate-300 hover:bg-[#13223E] hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : item.isHighlight
                          ? 'text-[#38BDF8]'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 text-left text-xs font-medium">
                        {item.label}
                      </span>
                    )}

                    {!sidebarCollapsed && item.badge && (
                      <span className="font-mono text-xs text-slate-300 bg-[#1E293B] border border-slate-700 px-1.5 py-0.2 rounded">
                        {item.badge}
                      </span>
                    )}

                    {!sidebarCollapsed && item.badgeAlert && (
                      <span className="text-xs text-white bg-[#DC2626] font-bold px-1.5 py-0.2 rounded shadow-2xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        <span>{item.badgeAlert}</span>
                      </span>
                    )}

                    {/* Active vertical bar in collapsed mode */}
                    {sidebarCollapsed && isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#38BDF8] rounded-r" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 border-t border-[#1C3256] bg-[#080E1C] flex items-center justify-between text-xs text-slate-400">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="font-mono text-xs text-slate-300">工业边缘网关 v2.8</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded hover:bg-[#1C3256] text-slate-300 hover:text-white transition-colors ml-auto"
            title={sidebarCollapsed ? '展开导航栏' : '收起导航栏'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* 2. Top Navigation Bar (56px) */}
        <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between shrink-0 z-20 shadow-2xs">
          {/* Left: toggle & breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              title="切换导航栏"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Contextual Breadcrumbs with legible typography */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="hover:text-slate-800 transition-colors font-semibold text-[#2563EB]">
                观择 MES
              </span>
              <span>/</span>
              <span className="hover:text-slate-800 transition-colors">{breadcrumbPrimary}</span>
              <span>/</span>
              <span className="font-bold text-slate-900">{breadcrumbSecondary}</span>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3.5 text-xs">
            {/* Real-time system online indicator with both text and pulse effect */}
            <div className="hidden md:flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-300 shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
              </span>
              <span className="font-semibold text-xs">系统在线 · SCADA 网关同步中</span>
            </div>

            {/* Workshop selector */}
            <div className="hidden sm:flex items-center gap-1.5 border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 font-medium">
              <Factory className="w-4 h-4 text-[#2563EB]" />
              <select
                value={selectedWorkshop}
                onChange={(e) => setSelectedWorkshop(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="华东第一制造基地 / 机加工一车间">
                  华东第一制造基地 · 机加工一车间
                </option>
                <option value="华东第一制造基地 / 机加工二车间">
                  华东第一制造基地 · 机加工二车间
                </option>
                <option value="齿轮专机加工制造中心">齿轮专机加工制造中心</option>
              </select>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 text-slate-700 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors relative border border-slate-200"
                title="通知中心"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                  5
                </span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-84 bg-white rounded-md shadow-xl border border-slate-200 z-50 p-3.5 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="font-bold text-slate-900 text-sm">
                      车间现场告警与任务 (5条)
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2.5 divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                    <div className="pt-1.5">
                      <div className="flex items-center justify-between text-[#DC2626] font-bold text-xs">
                        <span>[故障报警] CNC-07 卧加主轴报警</span>
                        <span className="font-mono text-slate-400">14:22</span>
                      </div>
                      <p className="text-slate-700 mt-1 text-xs">
                        主轴驱动器过流 E-301，系统已自动触发紧急报修工单。
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[#2563EB] font-bold text-xs">
                        <span>[待我审批] 特采放行申请 APP-009</span>
                        <span className="font-mono text-slate-400">15:40</span>
                      </div>
                      <p className="text-slate-700 mt-1 text-xs">
                        高精度主轴传动轴热处理硬度微偏，待技术总监会签。
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[#D97706] font-bold text-xs">
                        <span>[物料预警] 40Cr 合金圆钢低于安全库存</span>
                        <span className="font-mono text-slate-400">08:30</span>
                      </div>
                      <p className="text-slate-700 mt-1 text-xs">
                        当前在库 18.4 吨，基准 25.0 吨，已自动生成缺料调拨单。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-700 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors hidden sm:block border border-slate-200"
              title={isFullscreen ? '退出全屏' : '全屏显示'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white flex items-center justify-center font-bold text-xs shadow-2xs border border-slate-300">
                陈
              </div>
              <div className="hidden lg:block">
                <div className="font-bold text-slate-900 leading-tight text-xs">陈建国</div>
                <div className="text-xs text-slate-500 font-medium">机加工一车间主任</div>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Page Tabs Strip */}
        <div className="h-10 bg-white border-b border-[#E2E8F0] px-4 flex items-center gap-1.5 shrink-0 overflow-x-auto select-none">
          {openTabs.map((tab) => {
            const isActive = currentScreen === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => onNavigate(tab.id, tab.orderCode)}
                className={`h-8 px-3.5 rounded-t border-t border-x text-xs flex items-center gap-2 cursor-pointer transition-all relative whitespace-nowrap font-medium ${
                  isActive
                    ? 'border-[#E2E8F0] border-b-2 border-b-[#2563EB] bg-[#F4F6F9] text-[#2563EB] font-bold shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.title}</span>

                {/* Closable icon */}
                {tab.closable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                    title="关闭页签"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. Main Workspace (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
};
