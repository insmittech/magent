import React from 'react';
import { X, Phone, MessageCircle, MapPin, CreditCard, PackageCheck, Truck } from 'lucide-react';
import { OrderTimeline } from './OrderTimeline';

export const OrderDetailDrawer = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  if (!isOpen || !order) return null;

  const phoneSanitized = (order.customer.phone || '').replace(/[^0-9]/g, '');

  return (
    <div className="adm-drawer-overlay" onClick={onClose}>
      <div className="adm-drawer" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="adm-drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 className="adm-drawer-title" style={{ fontSize: '1.1rem' }}>Order #{order.id}</h2>
              <span className={`adm-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: '0.2rem' }}>
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Today'}
            </div>
          </div>

          <button type="button" className="adm-drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="adm-drawer-body">
          {/* Status Update Quick Bar */}
          <div className="adm-card" style={{ padding: '0.85rem' }}>
            <label className="adm-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
              Update Order Status
            </label>
            <select
              className="adm-select"
              style={{ width: '100%', padding: '0.5rem' }}
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            >
              <option value="Pending">Pending Confirmation</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped (In Transit)</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Customer Profile & Direct Contact */}
          <div className="adm-card" style={{ padding: '0.85rem' }}>
            <h2 className="adm-card-title" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Customer Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>
                <strong>{order.customer.name}</strong>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a
                  href={`tel:${order.customer.phone}`}
                  className="adm-btn adm-btn-secondary adm-btn-sm"
                  style={{ flex: 1 }}
                >
                  <Phone size={13} /> {order.customer.phone}
                </a>

                {phoneSanitized && (
                  <a
                    href={`https://wa.me/${phoneSanitized}?text=${encodeURIComponent(`Hello ${order.customer.name}, this is Magnet Vapi regarding your order #${order.id}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-btn adm-btn-sm"
                    style={{ backgroundColor: '#25D366', color: '#fff' }}
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--adm-text-sub)', marginTop: '0.35rem' }}>
                <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--adm-text-muted)' }} />
                <span>
                  {order.customer.address}, {order.customer.city}
                  {order.customer.state ? `, ${order.customer.state}` : ''} ({order.customer.pincode})
                </span>
              </div>
            </div>
          </div>

          {/* Items Summary Table */}
          <div className="adm-card" style={{ padding: '0.85rem' }}>
            <h2 className="adm-card-title" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Items Ordered ({order.items.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--adm-border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                      Qty: {item.quantity} • {Object.entries(item.variant || {})
                        .filter(([k]) => k !== 'id' && k !== 'stock')
                        .map(([k, v]) => `${k}: ${v}`).join(', ') || 'Standard'}
                    </div>
                  </div>
                  <strong style={{ color: 'var(--adm-text-main)' }}>
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--adm-border)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--adm-text-sub)' }}>
                <span>Subtotal</span>
                <span>₹{order.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--adm-text-sub)' }}>
                <span>Shipping</span>
                <span>Free Delivery</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--adm-text-sub)' }}>
                <span>Payment Method</span>
                <span>Cash on Delivery (COD)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.95rem', color: 'var(--adm-text-main)', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed var(--adm-border)' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--adm-primary)' }}>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="adm-card" style={{ padding: '0.85rem' }}>
            <h2 className="adm-card-title" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Fulfillment Timeline
            </h2>
            <OrderTimeline status={order.status} createdAt={order.createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
};
