import React, { useState } from 'react';
import { Search, Eye, Filter, Download } from 'lucide-react';
import { OrderDetailDrawer } from './OrderDetailDrawer';

export const OrdersPage = ({ orders = [], onUpdateStatus, initialSelectedId = null }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(initialSelectedId);

  const tabs = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    // Status tab filter
    if (activeTab !== 'All' && o.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }

    // Search
    const query = search.toLowerCase();
    const matchId = o.id.toLowerCase().includes(query);
    const matchName = o.customer.name.toLowerCase().includes(query);
    const matchPhone = o.customer.phone.includes(query);
    const matchCity = (o.customer.city || '').toLowerCase().includes(query);

    return matchId || matchName || matchPhone || matchCity;
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Customer Orders</h1>
          <div className="adm-page-subtext">
            Track, process, and fulfill orders ({orders.length} total orders recorded).
          </div>
        </div>
      </div>

      {/* Orders Table Shell */}
      <div className="adm-table-container">
        {/* Status Filter Tabs */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--adm-border)', display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
          {tabs.map(tab => {
            const count = tab === 'All' 
              ? orders.length 
              : orders.filter(o => o.status.toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                type="button"
                className={`adm-pill-btn ${activeTab === tab ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem' }}
                onClick={() => setActiveTab(tab)}
              >
                <span>{tab}</span>
                <span className="adm-nav-badge" style={{ fontSize: '0.65rem' }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="adm-table-toolbar">
          <div className="adm-table-search" style={{ width: '300px' }}>
            <Search size={15} color="var(--adm-text-muted)" />
            <input
              type="text"
              placeholder="Search by Order ID, customer, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Order Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>
                    No orders matching "{search || activeTab}".
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr 
                    key={o.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedOrderId(o.id)}
                  >
                    <td>
                      <strong>#{o.id}</strong>
                    </td>
                    <td>
                      <div><strong>{o.customer.name}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                        📞 {o.customer.phone} • {o.customer.city}
                      </div>
                    </td>
                    <td>
                      <span>{o.items.length} item{o.items.length > 1 ? 's' : ''}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--adm-text-main)' }}>₹{o.total.toLocaleString()}</strong>
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
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderId(o.id);
                        }}
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Order Detail Drawer */}
      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};
