import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

export const RecentOrdersTable = ({ orders = [], onViewAll, onSelectOrder }) => {
  const recent = orders.slice(0, 6);

  return (
    <div className="adm-table-container">
      <div className="adm-table-toolbar">
        <h2 className="adm-card-title" style={{ fontSize: '0.95rem' }}>Live Orders Pipeline</h2>
        <button 
          type="button" 
          className="adm-btn adm-btn-secondary adm-btn-sm" 
          onClick={onViewAll}
        >
          View All ({orders.length}) <ArrowRight size={14} />
        </button>
      </div>

      <div className="adm-table-scroll">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--adm-text-muted)' }}>
                  No orders placed yet.
                </td>
              </tr>
            ) : (
              recent.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>#{o.id}</strong>
                  </td>
                  <td>
                    <div><strong>{o.customer.name}</strong></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{o.customer.phone}</div>
                  </td>
                  <td>
                    <span>{o.items.length} {o.items.length === 1 ? 'item' : 'items'}</span>
                  </td>
                  <td>
                    <strong>₹{o.total.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', fontWeight: 600 }}>COD</span>
                  </td>
                  <td>
                    <span className={`adm-badge ${o.status.toLowerCase()}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="adm-btn-icon"
                      onClick={() => onSelectOrder(o.id)}
                      title="View Order Details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
