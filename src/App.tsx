/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppShell, ScreenId, PageTab } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkOrderListView } from './components/workorder/WorkOrderListView';
import { WorkOrderDetailView } from './components/workorder/WorkOrderDetailView';
import { EquipmentView } from './components/equipment/EquipmentView';
import { ApprovalCenterView } from './components/approval/ApprovalCenterView';
import { DesignSystemView } from './components/design-system/DesignSystemView';
import { WORK_ORDERS_DATA } from './data/mockData';
import { WorkOrder } from './types/mes';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [activeOrderCode, setActiveOrderCode] = useState<string>('MO202610190028');
  const [openDrawerInitially, setOpenDrawerInitially] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(WORK_ORDERS_DATA);

  // Tabs state
  const [openTabs, setOpenTabs] = useState<PageTab[]>([
    { id: 'dashboard', title: '生产运营工作台', closable: false },
    { id: 'workorders', title: '生产工单管理', closable: true },
  ]);

  const handleNavigate = (screen: ScreenId, orderCode?: string) => {
    setCurrentScreen(screen);
    if (orderCode) {
      setActiveOrderCode(orderCode);
    }

    // Determine tab title
    let title = '生产运营工作台';
    if (screen === 'workorders') title = '生产工单管理';
    else if (screen === 'workorder_detail') title = `工单详情 (${orderCode || activeOrderCode})`;
    else if (screen === 'equipment') title = '设备运行与维护';
    else if (screen === 'approval') title = '审批中心';
    else if (screen === 'design_system') title = '设计规范与组件库';

    // Add tab if not already present
    if (!openTabs.some((t) => t.id === screen)) {
      setOpenTabs([...openTabs, { id: screen, title, closable: screen !== 'dashboard', orderCode }]);
    }
  };

  const handleCloseTab = (tabId: ScreenId) => {
    const newTabs = openTabs.filter((t) => t.id !== tabId);
    setOpenTabs(newTabs);

    // If current tab is closed, navigate to the last available tab
    if (currentScreen === tabId) {
      const fallbackTab = newTabs[newTabs.length - 1];
      if (fallbackTab) {
        setCurrentScreen(fallbackTab.id);
        if (fallbackTab.orderCode) setActiveOrderCode(fallbackTab.orderCode);
      } else {
        setCurrentScreen('dashboard');
      }
    }
  };

  const handleSelectWorkOrder = (orderCode: string) => {
    setActiveOrderCode(orderCode);
    setOpenDrawerInitially(false);
    handleNavigate('workorder_detail', orderCode);
  };

  const handleOpenReportDrawer = (orderCode: string) => {
    setActiveOrderCode(orderCode);
    setOpenDrawerInitially(true);
    handleNavigate('workorder_detail', orderCode);
  };

  const handleCreateWorkOrder = (newOrder: WorkOrder) => {
    setWorkOrders([newOrder, ...workOrders]);
  };

  // Find active work order
  const currentOrder =
    workOrders.find((w) => w.code === activeOrderCode) || workOrders[0];

  return (
    <AppShell
      currentScreen={currentScreen}
      activeOrderCode={activeOrderCode}
      onNavigate={handleNavigate}
      openTabs={openTabs}
      onCloseTab={handleCloseTab}
    >
      {/* SCREEN 1: 生产运营工作台 */}
      {currentScreen === 'dashboard' && (
        <DashboardView
          onSelectWorkOrder={handleSelectWorkOrder}
          onNavigateToEquipment={() => handleNavigate('equipment')}
        />
      )}

      {/* SCREEN 2: 生产工单管理 */}
      {currentScreen === 'workorders' && (
        <WorkOrderListView
          workOrders={workOrders}
          onSelectWorkOrder={handleSelectWorkOrder}
          onOpenReportDrawer={handleOpenReportDrawer}
          onCreateWorkOrder={handleCreateWorkOrder}
        />
      )}

      {/* SCREEN 3: 工单详情与执行 */}
      {currentScreen === 'workorder_detail' && (
        <WorkOrderDetailView
          order={currentOrder}
          onBack={() => handleNavigate('workorders')}
          isReportDrawerOpenInitially={openDrawerInitially}
        />
      )}

      {/* SCREEN 4: 设备运行与维护 */}
      {currentScreen === 'equipment' && <EquipmentView />}

      {/* SCREEN 5: 审批中心 */}
      {currentScreen === 'approval' && <ApprovalCenterView />}

      {/* SCREEN 6: 设计规范与组件库全景 */}
      {currentScreen === 'design_system' && <DesignSystemView />}
    </AppShell>
  );
}
