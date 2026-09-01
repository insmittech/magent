import React from 'react';
import { X, AlertTriangle, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const NotificationDrawer = ({ 
  isOpen, 
  onClose, 
  products = [], 
  orders = [], 
  onNavigate 
}) => {
  if (!isOpen) return null;

  // Gather real alerts
  const lowStockItems = [];
  const outOfStockItems = [];

  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock === 0) {
        outOfStockItems.push({
          prodId: p.id,
          name: p.name,
          sku: `${p.sku}-${v.size || v.compatibleModel || 'VAR'}`,
          stock: 0
        });
      } else if (v.stock <= 3) {
        lowStockItems.push({
          prodId: p.id,
          name: p.name,
          sku: `${p.sku}-${v.size || v.compatibleModel || 'VAR'}`,
          stock: v.stock
        });
      }
    });
  });

  const pendingOrders = orders.filter(o => o.status === 'Pending');

  const totalAlerts = outOfStockItems.length + lowStockItems.length + pendingOrders.length;

  return (
    <div className="adm-drawer-overlay" onClick={onClose}>
      <div className="adm-drawer" onClick={e => e.stopPropagation()}>
        <div className="adm-drawer-header">
          <div className="adm-drawer-title">
            <span>Store Alerts</span>
            {totalAlerts > 0 && <span className="adm-tag">{totalAlerts}</span>}
          </div>
          <button type="button" className="adm-drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="adm-drawer-body">
          {totalAlerts === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--adm-text-muted)' }}>
              <p style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>All Systems Operational</p>
              <span style={{ fontSize: '0.8rem' }}>No pending actions or inventory alerts at this time.</span>
            </div>
          ) : (
            <>
              {outOfStockItems.slice(0, 5).map((item, idx) => (
                <div key={`out-${idx}`} className="adm-alert-card danger">
                  <div className="adm-alert-top">
                    <span className="adm-alert-label">Out of Stock</span>
                    <AlertCircle size={14} color="var(--adm-danger)" />
                  </div>
                  <div className="adm-alert-title">{item.name}</div>
                  <div className="adm-alert-desc">SKU: {item.sku} is completely sold out.</div>
                  <button 
                    type="button" 
                    className="adm-alert-action-btn"
                    onClick={() => {
                      onNavigate('inventory');
                      onClose();
                    }}
                  >
                    Restock Inventory <ArrowRight size={12} style={{ display: 'inline' }} />
                  </button>
                </div>
              ))}

              {lowStockItems.slice(0, 5).map((item, idx) => (
                <div key={`low-${idx}`} className="adm-alert-card warning">
                  <div className="adm-alert-top">
                    <span className="adm-alert-label">Low Stock</span>
                    <AlertTriangle size={14} color="var(--adm-warning)" />
                  </div>
                  <div className="adm-alert-title">{item.name}</div>
                  <div className="adm-alert-desc">Only {item.stock} units left for SKU {item.sku}.</div>
                  <button 
                    type="button" 
                    className="adm-alert-action-btn"
                    onClick={() => {
                      onNavigate('inventory');
                      onClose();
                    }}
                  >
                    Adjust Stock <ArrowRight size={12} style={{ display: 'inline' }} />
                  </button>
                </div>
              ))}

              {pendingOrders.slice(0, 5).map(o => (
                <div key={o.id} className="adm-alert-card info">
                  <div className="adm-alert-top">
                    <span className="adm-alert-label">Pending Order</span>
                    <ShoppingBag size={14} color="var(--adm-info)" />
                  </div>
                  <div className="adm-alert-title">Order {o.id} ({o.customer.name})</div>
                  <div className="adm-alert-desc">₹{o.total} • {o.items.length} items awaiting confirmation.</div>
                  <button 
                    type="button" 
                    className="adm-alert-action-btn"
                    onClick={() => {
                      onNavigate('orders', { selectedOrder: o.id });
                      onClose();
                    }}
                  >
                    Process Order <ArrowRight size={12} style={{ display: 'inline' }} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
