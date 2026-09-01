import React from 'react';
import { PieChart } from 'lucide-react';

export const SalesBreakdown = ({ products = [], orders = [] }) => {
  // Aggregate real category stats from orders
  let clothingRev = 0;
  let clothingOrders = 0;
  let techRev = 0;
  let techOrders = 0;

  orders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId || p.name === item.name);
      const isTech = prod ? prod.category === 'accessories' : false;
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      
      if (isTech) {
        techRev += itemTotal;
        techOrders += 1;
      } else {
        clothingRev += itemTotal;
        clothingOrders += 1;
      }
    });
  });

  const totalRev = (clothingRev + techRev) || 1;
  const clothingPct = Math.round((clothingRev / totalRev) * 100) || 60;
  const techPct = 100 - clothingPct;

  return (
    <div className="adm-card">
      <div className="adm-card-header">
        <h2 className="adm-card-title" style={{ fontSize: '0.95rem' }}>
          <PieChart size={16} color="var(--adm-info)" />
          <span>Category Share</span>
        </h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', fontWeight: 600 }}>All Time</span>
      </div>

      <div className="adm-breakdown-list">
        <div className="adm-breakdown-item">
          <div className="adm-breakdown-row">
            <span className="adm-breakdown-label">Fashion & Streetwear</span>
            <span className="adm-breakdown-metrics">₹{clothingRev.toLocaleString()} ({clothingPct}%)</span>
          </div>
          <div className="adm-progress-track">
            <div className="adm-progress-fill fashion" style={{ width: `${clothingPct}%` }}></div>
          </div>
        </div>

        <div className="adm-breakdown-item">
          <div className="adm-breakdown-row">
            <span className="adm-breakdown-label">Mobile Tech & Gear</span>
            <span className="adm-breakdown-metrics">₹{techRev.toLocaleString()} ({techPct}%)</span>
          </div>
          <div className="adm-progress-track">
            <div className="adm-progress-fill tech" style={{ width: `${techPct}%` }}></div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--adm-bg)', borderRadius: 'var(--adm-radius-sm)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <div>
          <span style={{ color: 'var(--adm-text-muted)', display: 'block' }}>Apparel Items</span>
          <strong style={{ color: 'var(--adm-text-main)' }}>{products.filter(p => p.category === 'clothing').length} active</strong>
        </div>
        <div>
          <span style={{ color: 'var(--adm-text-muted)', display: 'block' }}>Tech Items</span>
          <strong style={{ color: 'var(--adm-text-main)' }}>{products.filter(p => p.category === 'accessories').length} active</strong>
        </div>
      </div>
    </div>
  );
};
