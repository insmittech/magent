import React from 'react';
import { Plus, ShoppingBag, AlertTriangle, ArrowRight } from 'lucide-react';
import { KPIGrid } from './KPIGrid';
import { RevenueChart } from './RevenueChart';
import { SalesBreakdown } from './SalesBreakdown';
import { RecentOrdersTable } from './RecentOrdersTable';
import { LowStockWidget } from './LowStockWidget';
import { QuickActionsBar } from './QuickActionsBar';

export const OverviewDashboard = ({ 
  kpis = {}, 
  products = [], 
  orders = [], 
  onNavigate, 
  onSelectOrder,
  onAdjustStock 
}) => {
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const lowStockCount = (kpis.lowStockCount || 0) + (kpis.outOfStockCount || 0);
  const needsAttention = pendingOrders.length > 0 || lowStockCount > 0;

  // Format today's date
  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div className="adm-page-heading-group">
          <h1>Good morning, Admin</h1>
          <div className="adm-page-subtext">
            {todayStr} • Here's what's happening with your store today.
          </div>
        </div>

        <div className="adm-header-actions">
          <button 
            type="button" 
            className="adm-btn adm-btn-secondary" 
            onClick={() => onNavigate('orders')}
          >
            <ShoppingBag size={16} /> View Orders ({orders.length})
          </button>
          <button 
            type="button" 
            className="adm-btn adm-btn-primary" 
            onClick={() => onNavigate('product-form')}
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Needs Attention Bar */}
      {needsAttention && (
        <div className="adm-attention-banner">
          <div className="adm-attention-left">
            <AlertTriangle size={18} color="var(--adm-warning)" />
            <span>
              <strong>Action Required:</strong> You have{' '}
              {pendingOrders.length > 0 && `${pendingOrders.length} pending order${pendingOrders.length > 1 ? 's' : ''}`}{' '}
              {pendingOrders.length > 0 && lowStockCount > 0 && 'and '}{' '}
              {lowStockCount > 0 && `${lowStockCount} low stock product${lowStockCount > 1 ? 's' : ''}`} needing attention.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {pendingOrders.length > 0 && (
              <button 
                type="button" 
                className="adm-attention-action"
                onClick={() => onNavigate('orders')}
              >
                Review Orders <ArrowRight size={12} style={{ display: 'inline' }} />
              </button>
            )}
            {lowStockCount > 0 && (
              <button 
                type="button" 
                className="adm-attention-action"
                onClick={() => onNavigate('inventory')}
              >
                Restock Stock <ArrowRight size={12} style={{ display: 'inline' }} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Strip */}
      <KPIGrid kpis={kpis} orders={orders} />

      {/* 2-Column Analytics & Category Breakdown */}
      <div className="adm-grid-2col">
        <RevenueChart totalSales={kpis.totalSales} totalOrders={kpis.totalOrders} />
        <SalesBreakdown products={products} orders={orders} />
      </div>

      {/* Quick Action Shortcuts */}
      <QuickActionsBar onNavigate={onNavigate} />

      {/* 2-Column Low Stock & Live Orders */}
      <div className="adm-grid-2col">
        <RecentOrdersTable 
          orders={orders} 
          onViewAll={() => onNavigate('orders')} 
          onSelectOrder={onSelectOrder}
        />
        <LowStockWidget 
          products={products} 
          onOpenInventory={() => onNavigate('inventory')}
          onAdjustStock={onAdjustStock}
        />
      </div>
    </div>
  );
};
