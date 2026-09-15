import React, { useState } from 'react';
import { Users, Search, Phone, ShoppingBag, MapPin, Eye, X, MessageCircle } from 'lucide-react';

export const CustomersPage = ({ orders = [] }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Group orders by customer phone number
  const customerMap = {};
  orders.forEach(o => {
    const phone = o.customer.phone || 'Unknown';
    if (!customerMap[phone]) {
      customerMap[phone] = {
        name: o.customer.name,
        phone: o.customer.phone,
        email: o.customer.email || 'customer@gmail.com',
        city: o.customer.city,
        state: o.customer.state,
        address: o.customer.address,
        pincode: o.customer.pincode,
        orders: [],
        totalSpent: 0,
        lastOrderDate: o.createdAt
      };
    }

    customerMap[phone].orders.push(o);
    if (o.status !== 'Cancelled') {
      customerMap[phone].totalSpent += o.total;
    }
  });

  const customerList = Object.values(customerMap);

  // Summary Metrics
  const totalCustomers = customerList.length || 1;
  const repeatCustomers = customerList.filter(c => c.orders.length > 1).length;
  const repeatRate = Math.round((repeatCustomers / totalCustomers) * 100);
  const totalSpend = customerList.reduce((sum, c) => sum + c.totalSpent, 0);

  const filtered = customerList.filter(c => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.city && c.city.toLowerCase().includes(q));
  });

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Customers Directory</h1>
          <div className="adm-page-subtext">
            View shopper profiles, purchasing histories, and lifetime store value.
          </div>
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="adm-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Total Shoppers</span>
            <Users size={16} className="adm-kpi-icon" />
          </div>
          <div className="adm-kpi-value">{totalCustomers}</div>
          <div className="adm-kpi-footer"><span>unique phone contacts</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Repeat Customers</span>
            <ShoppingBag size={16} className="adm-kpi-icon" />
          </div>
          <div className="adm-kpi-value">{repeatCustomers}</div>
          <div className="adm-kpi-footer"><span>{repeatRate}% retention rate</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Total Revenue</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>₹</span>
          </div>
          <div className="adm-kpi-value" style={{ color: 'var(--adm-primary)' }}>
            ₹{totalSpend.toLocaleString()}
          </div>
          <div className="adm-kpi-footer"><span>all completed transactions</span></div>
        </div>
      </div>

      {/* Customers Table Shell */}
      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <div className="adm-table-search" style={{ width: '280px' }}>
            <Search size={15} color="var(--adm-text-muted)" />
            <input
              type="text"
              placeholder="Search by name, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone / WhatsApp</th>
                <th>Location</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>
                    No customers found matching "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>
                    <td>
                      <strong>{c.name}</strong>
                    </td>
                    <td>
                      <span>📞 {c.phone}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>
                        {c.city ? `${c.city} (${c.pincode || ''})` : 'Vapi, Gujarat'}
                      </span>
                    </td>
                    <td>
                      <span className="adm-badge active">
                        {c.orders.length} order{c.orders.length > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--adm-text-main)' }}>₹{c.totalSpent.toLocaleString()}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                        {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(c);
                        }}
                      >
                        <Eye size={13} /> History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="adm-drawer-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="adm-drawer" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="adm-drawer-header">
              <div>
                <h2 className="adm-drawer-title" style={{ fontSize: '1rem' }}>{selectedCustomer.name}</h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>Customer Profile</div>
              </div>
              <button type="button" className="adm-drawer-close-btn" onClick={() => setSelectedCustomer(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-drawer-body">
              {/* Contact card */}
              <div className="adm-card" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="adm-btn adm-btn-secondary adm-btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Phone size={13} /> Call Customer
                  </a>
                  <a
                    href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-btn adm-btn-sm"
                    style={{ backgroundColor: '#25D366', color: '#fff' }}
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>
                  <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--adm-text-muted)' }} />
                  <span>
                    {selectedCustomer.address}, {selectedCustomer.city}
                    {selectedCustomer.state ? `, ${selectedCustomer.state}` : ''} ({selectedCustomer.pincode})
                  </span>
                </div>
              </div>

              {/* Order History */}
              <div className="adm-card" style={{ padding: '0.85rem' }}>
                <h2 className="adm-card-title" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Order History ({selectedCustomer.orders.length})
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {selectedCustomer.orders.map(o => (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--adm-border-subtle)' }}>
                      <div>
                        <strong>#{o.id}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                          {o.items.length} items • {new Date(o.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`adm-badge ${o.status.toLowerCase()}`} style={{ fontSize: '0.65rem', marginBottom: '2px' }}>
                          {o.status}
                        </span>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>₹{o.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
