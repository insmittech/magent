import React, { useState } from 'react';
import { Save, Store, Phone, Mail, MapPin, Bell, Shield, Truck } from 'lucide-react';

export const SettingsPage = ({ settings = {}, onSaveSettings, onNotify }) => {
  const [form, setForm] = useState({
    storeName: settings.storeName || 'Magnet Vapi Official',
    whatsappNumber: settings.whatsappNumber || '+919999988888',
    email: settings.email || 'support@magnetvapi.com',
    announcement: settings.announcement || '🔥 Deals of the Day: Flat 20% off on premium Graphic Tees! Free Delivery on orders above ₹1499',
    address: settings.address || 'Shop 12, Prime Complex, Vapi, Gujarat - 396191',
    codEnabled: true,
    freeDeliveryThreshold: '1499',
    minOrderValue: '299'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(form);
    if (onNotify) onNotify('Store configurations updated successfully!');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Store Settings & Configurations</h1>
          <div className="adm-page-subtext">
            Configure contact details, announcement bars, shipping thresholds, and admin access.
          </div>
        </div>

        <div className="adm-header-actions">
          <button type="button" className="adm-btn adm-btn-primary" onClick={handleSubmit}>
            <Save size={16} /> Save All Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '840px' }}>
        {/* 1. Brand & Store Profile */}
        <div className="adm-card">
          <h2 className="adm-card-title" style={{ marginBottom: '1.25rem' }}>
            <Store size={16} color="var(--adm-primary)" />
            <span>Store Profile & Identity</span>
          </h2>

          <div className="adm-form-grid">
            <div className="adm-form-group full">
              <label className="adm-label">Store Brand Name</label>
              <input
                type="text"
                required
                className="adm-input"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Customer Support WhatsApp</label>
              <input
                type="text"
                required
                className="adm-input"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Notification Email</label>
              <input
                type="email"
                required
                className="adm-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="adm-form-group full">
              <label className="adm-label">Physical Store Location / Address</label>
              <textarea
                className="adm-textarea"
                style={{ minHeight: '70px' }}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* 2. Announcements & Banners */}
        <div className="adm-card">
          <h2 className="adm-card-title" style={{ marginBottom: '1.25rem' }}>
            <Bell size={16} color="var(--adm-warning)" />
            <span>Storefront Top Announcement Bar</span>
          </h2>

          <div className="adm-form-group">
            <label className="adm-label">Announcement Text</label>
            <input
              type="text"
              className="adm-input"
              value={form.announcement}
              onChange={(e) => setForm({ ...form, announcement: e.target.value })}
            />
          </div>
        </div>

        {/* 3. Shipping & Payment Policies */}
        <div className="adm-card">
          <h2 className="adm-card-title" style={{ marginBottom: '1.25rem' }}>
            <Truck size={16} color="var(--adm-info)" />
            <span>Order Policies & Delivery Rules</span>
          </h2>

          <div className="adm-form-grid">
            <div className="adm-form-group">
              <label className="adm-label">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                className="adm-input"
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: e.target.value })}
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-label">Minimum Order Value (₹)</label>
              <input
                type="number"
                className="adm-input"
                value={form.minOrderValue}
                onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
              />
            </div>

            <div className="adm-form-group full">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={form.codEnabled}
                  onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })}
                />
                <strong>Enable Cash on Delivery (COD) across all Pincodes</strong>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Security & Admin Credentials */}
        <div className="adm-card">
          <h2 className="adm-card-title" style={{ marginBottom: '1.25rem' }}>
            <Shield size={16} color="var(--adm-success)" />
            <span>Admin Portal Security</span>
          </h2>

          <div style={{ fontSize: '0.85rem', color: 'var(--adm-text-sub)' }}>
            Admin portal is protected via encrypted passkey authentication. Session tokens are refreshed automatically on activity.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="adm-btn adm-btn-primary">
            <Save size={16} /> Save All Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
