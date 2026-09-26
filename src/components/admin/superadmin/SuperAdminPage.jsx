import React, { useState } from 'react';
import { 
  ShieldAlert, Sliders, Users, KeyRound, Lock, AlertTriangle, 
  Check, Save, Plus, Trash2, Edit3, ShieldCheck, UserCheck, 
  RotateCcw, History, RefreshCw, Zap, Tag, ShoppingCart, 
  CheckCircle2, XCircle, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';

export const SuperAdminPage = ({
  products = [],
  settings = {},
  adminUsers = [],
  auditLogs = [],
  onUpdateControls,
  onAddAdminUser,
  onUpdateAdminUser,
  onDeleteAdminUser,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState('quotas'); // 'quotas' | 'storewide' | 'staff' | 'audit'

  // Super Admin Controls state from settings
  const defaultControls = {
    maxProductLimit: 25,
    allowAdminDeleteProduct: true,
    allowAdminPriceEdit: true,
    allowAdminDiscountAboveLimit: false,
    maxDiscountLimit: 50,
    maintenanceMode: false,
    maintenanceMessage: 'Magnet Vapi Official is currently undergoing brief scheduled maintenance. We will be back shortly!',
    enableCod: true,
    enableDirectBuy: true,
    maxOrderQtyPerItem: 5,
    allowAdminManageCategories: true,
    requireAdminApprovalForReviews: false
  };

  const [controls, setControls] = useState({
    ...defaultControls,
    ...(settings?.superAdminControls || {})
  });

  const [isSaving, setIsSaving] = useState(false);

  // New Admin Staff Modal
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    username: '',
    role: 'admin',
    department: 'Store Operations'
  });

  // Calculate Quota metrics
  const productCount = products.length;
  const maxLimit = controls.maxProductLimit || 25;
  const usagePercent = Math.min(100, Math.round((productCount / maxLimit) * 100));

  const handleControlChange = (key, value) => {
    setControls(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveAllControls = () => {
    setIsSaving(true);
    if (onUpdateControls) {
      onUpdateControls(controls);
    }
    setTimeout(() => {
      setIsSaving(false);
      if (showToast) {
        showToast('Super Admin controls & product limits updated successfully!', 'success');
      }
    }, 600);
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.username) {
      alert('Please fill in all required fields.');
      return;
    }

    const newAdmin = {
      id: `adm-usr-${Date.now()}`,
      ...newAdminForm,
      status: 'Active',
      avatarColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 5)],
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    if (onAddAdminUser) {
      onAddAdminUser(newAdmin);
    }
    setShowAddAdminModal(false);
    setNewAdminForm({
      name: '',
      email: '',
      username: '',
      role: 'admin',
      department: 'Store Operations'
    });
    if (showToast) {
      showToast(`Admin account for "${newAdmin.name}" created!`, 'success');
    }
  };

  const handleToggleAdminStatus = (user) => {
    if (user.role === 'super_admin') {
      alert('Cannot deactivate the Master Super Admin.');
      return;
    }
    const newStatus = user.status === 'Active' ? 'Deactivated' : 'Active';
    if (onUpdateAdminUser) {
      onUpdateAdminUser(user.id, { status: newStatus });
    }
    if (showToast) {
      showToast(`Account "${user.name}" is now ${newStatus}.`, 'info');
    }
  };

  const handleDeleteAdmin = (user) => {
    if (user.role === 'super_admin') {
      alert('Cannot delete the Master Super Admin account.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete admin account "${user.name}"?`)) {
      if (onDeleteAdminUser) {
        onDeleteAdminUser(user.id);
      }
      if (showToast) {
        showToast(`Admin "${user.name}" deleted.`, 'info');
      }
    }
  };

  return (
    <div className="superadmin-page-container">
      {/* Super Admin Top Governance Banner */}
      <div className="superadmin-hero-banner">
        <div className="superadmin-hero-content">
          <div className="superadmin-crown-badge">
            <ShieldAlert size={18} />
            <span>MASTER GOVERNANCE & CONTROL TERMINAL</span>
          </div>
          <h1 className="superadmin-title">Super Admin Master Controls</h1>
          <p className="superadmin-desc">
            Enforce catalog quotas, adjust product creation limits, set storewide override kill-switches, and manage administrator access roles.
          </p>
        </div>

        <div className="superadmin-hero-actions">
          <button 
            type="button" 
            className="adm-btn adm-btn-primary superadmin-save-btn"
            onClick={handleSaveAllControls}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw size={16} className="spin-anim" /> : <Save size={16} />}
            {isSaving ? 'Applying Master Settings...' : 'Save & Enforce Controls'}
          </button>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="superadmin-tabs-nav">
        <button 
          className={`superadmin-tab-btn ${activeSubTab === 'quotas' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('quotas')}
        >
          <SlidersHorizontal size={16} /> Product Quotas & Limits
        </button>
        <button 
          className={`superadmin-tab-btn ${activeSubTab === 'storewide' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('storewide')}
        >
          <Zap size={16} /> Storewide Overrides & Safety
        </button>
        <button 
          className={`superadmin-tab-btn ${activeSubTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('staff')}
        >
          <Users size={16} /> Admin Staff & RBAC ({adminUsers.length})
        </button>
        <button 
          className={`superadmin-tab-btn ${activeSubTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('audit')}
        >
          <History size={16} /> Security Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: PRODUCT QUOTAS & LIMITS */}
      {activeSubTab === 'quotas' && (
        <div className="superadmin-grid-section">
          {/* Main Product Limit Card */}
          <div className="adm-card superadmin-feature-card highlight-card">
            <div className="adm-card-header">
              <div>
                <h3 className="adm-card-title">📦 Product Creation Limit (Catalog Quota)</h3>
                <p className="adm-card-subtitle">
                  Define the maximum number of products that standard admins can create in the catalog.
                </p>
              </div>
              <span className={`quota-pill-badge ${usagePercent >= 90 ? 'critical' : usagePercent >= 75 ? 'warning' : 'healthy'}`}>
                {usagePercent}% Quota Allocated
              </span>
            </div>

            {/* Quota Progress Meter */}
            <div className="quota-meter-container">
              <div className="quota-meter-numbers">
                <div>
                  <span className="quota-big-count">{productCount}</span>
                  <span className="quota-max-label"> / {maxLimit} Products Added</span>
                </div>
                <span className="quota-remaining-label">
                  {Math.max(0, maxLimit - productCount)} slots remaining for standard admins
                </span>
              </div>
              <div className="quota-track">
                <div 
                  className={`quota-fill ${usagePercent >= 90 ? 'fill-red' : usagePercent >= 75 ? 'fill-amber' : 'fill-green'}`} 
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>

            {/* Limit Configurator & Quick Presets */}
            <div className="quota-controls-row">
              <div className="quota-input-group">
                <label className="adm-form-label">Set Maximum Allowed Products:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    className="adm-input"
                    style={{ width: '130px', fontWeight: 800, fontSize: '1.1rem' }}
                    value={controls.maxProductLimit}
                    onChange={(e) => handleControlChange('maxProductLimit', Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--adm-text-sub)' }}>items max</span>
                </div>
              </div>

              <div className="quota-presets-group">
                <span className="adm-form-label">Quick Quota Presets:</span>
                <div className="presets-button-row">
                  {[15, 25, 50, 100, 250].map(val => (
                    <button
                      key={val}
                      type="button"
                      className={`quota-preset-btn ${controls.maxProductLimit === val ? 'selected' : ''}`}
                      onClick={() => handleControlChange('maxProductLimit', val)}
                    >
                      {val} Items
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Granular Admin Permissions for Product Management */}
          <div className="adm-card superadmin-feature-card">
            <h3 className="adm-card-title">🔒 Granular Product Permissions for Standard Admins</h3>
            <p className="adm-card-subtitle" style={{ marginBottom: '1.25rem' }}>
              Control what standard administrators are permitted to modify in the product catalog.
            </p>

            <div className="control-switches-list">
              {/* Allow Delete Product */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Allow Standard Admins to Delete Products</div>
                  <div className="control-switch-desc">
                    When disabled, only the Super Admin can permanently remove products from the database.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={controls.allowAdminDeleteProduct}
                    onChange={(e) => handleControlChange('allowAdminDeleteProduct', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Allow Price Edit */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Allow Standard Admins to Edit Base Pricing</div>
                  <div className="control-switch-desc">
                    When disabled, standard staff cannot change base retail prices without Super Admin authorization.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={controls.allowAdminPriceEdit}
                    onChange={(e) => handleControlChange('allowAdminPriceEdit', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Max Discount Cap */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Maximum Discount Percentage Cap</div>
                  <div className="control-switch-desc">
                    Standard admins cannot set product discounts higher than this ceiling ({controls.maxDiscountLimit}%).
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={controls.maxDiscountLimit}
                    onChange={(e) => handleControlChange('maxDiscountLimit', parseInt(e.target.value))}
                    style={{ width: '120px' }}
                  />
                  <span style={{ fontWeight: 800, minWidth: '45px', color: 'var(--adm-primary)' }}>
                    {controls.maxDiscountLimit}%
                  </span>
                </div>
              </div>

              {/* Allow Manage Categories */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Allow Standard Admins to Create & Delete Categories</div>
                  <div className="control-switch-desc">
                    Restricts catalog taxonomy management to master level if disabled.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={controls.allowAdminManageCategories}
                    onChange={(e) => handleControlChange('allowAdminManageCategories', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOREWIDE OVERRIDES & SAFETY */}
      {activeSubTab === 'storewide' && (
        <div className="superadmin-grid-section">
          {/* Emergency Maintenance Mode */}
          <div className={`adm-card superadmin-feature-card ${controls.maintenanceMode ? 'danger-border' : ''}`}>
            <div className="adm-card-header">
              <div>
                <h3 className="adm-card-title" style={{ color: controls.maintenanceMode ? '#ef4444' : 'inherit' }}>
                  🚨 Emergency Store Maintenance Mode
                </h3>
                <p className="adm-card-subtitle">
                  Locks the storefront in read-only mode with a maintenance warning for all customer sessions.
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={controls.maintenanceMode}
                  onChange={(e) => handleControlChange('maintenanceMode', e.target.checked)}
                />
                <span className="toggle-slider danger"></span>
              </label>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label className="adm-form-label">Maintenance Banner Notice Message:</label>
              <textarea
                className="adm-input"
                rows={2}
                value={controls.maintenanceMessage}
                onChange={(e) => handleControlChange('maintenanceMessage', e.target.value)}
                placeholder="Message displayed to shoppers while store is under maintenance..."
              />
            </div>
          </div>

          {/* Payment & Operational Kill-Switches */}
          <div className="adm-card superadmin-feature-card">
            <h3 className="adm-card-title">💳 Checkout & Operational Master Switches</h3>
            <p className="adm-card-subtitle" style={{ marginBottom: '1.25rem' }}>
              Global operational toggles directly affecting customer orders and transaction flow.
            </p>

            <div className="control-switches-list">
              {/* COD Master Switch */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Cash on Delivery (COD) Master Switch</div>
                  <div className="control-switch-desc">
                    Toggle site-wide availability of Cash on Delivery payment for all orders.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={controls.enableCod}
                    onChange={(e) => handleControlChange('enableCod', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Direct Buy Now */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Enable Instant 'Buy Now' One-Click Checkout</div>
                  <div className="control-switch-desc">
                    Displays instant purchase buttons on product cards and details view.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={controls.enableDirectBuy}
                    onChange={(e) => handleControlChange('enableDirectBuy', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Max Quantity Per Item */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Max Order Quantity Per Item Limit</div>
                  <div className="control-switch-desc">
                    Prevents bulk scalping by limiting maximum units a customer can purchase per product item.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="adm-input"
                    style={{ width: '80px', fontWeight: 800 }}
                    value={controls.maxOrderQtyPerItem}
                    onChange={(e) => handleControlChange('maxOrderQtyPerItem', Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>units</span>
                </div>
              </div>

              {/* Review Moderation */}
              <div className="control-switch-item">
                <div>
                  <div className="control-switch-label">Mandatory Review Moderation Before Publishing</div>
                  <div className="control-switch-desc">
                    When enabled, new customer reviews require administrative approval before appearing publicly.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={controls.requireAdminApprovalForReviews}
                    onChange={(e) => handleControlChange('requireAdminApprovalForReviews', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN STAFF & RBAC PERMISSIONS */}
      {activeSubTab === 'staff' && (
        <div>
          <div className="adm-page-header">
            <div>
              <h2 className="adm-card-title">Staff Administrators & Access Roles</h2>
              <div className="adm-page-subtext">Manage accounts with access to the Magnet Control Portal.</div>
            </div>
            <button 
              type="button" 
              className="adm-btn adm-btn-primary"
              onClick={() => setShowAddAdminModal(true)}
            >
              <Plus size={16} /> Add New Admin Account
            </button>
          </div>

          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Username / Email</th>
                  <th>Department</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => {
                  const isSuper = user.role === 'super_admin';
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div 
                            className="admin-avatar-pill"
                            style={{ backgroundColor: user.avatarColor || '#3b82f6' }}
                          >
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>{user.name}</div>
                            {isSuper && <span className="superadmin-inline-tag">Master Super Admin</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>{user.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{user.email}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--adm-text-sub)' }}>
                        {user.department || 'Operations'}
                      </td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'super_admin' ? '👑 Super Admin' : user.role === 'inventory_manager' ? '📦 Inventory Lead' : '🛡️ Store Admin'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge-custom ${user.status === 'Active' ? 'active' : 'inactive'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)' }}>
                        {user.lastLogin || 'Recently'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {!isSuper && (
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="adm-btn adm-btn-secondary adm-btn-sm"
                              onClick={() => handleToggleAdminStatus(user)}
                              title={user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              type="button"
                              className="adm-btn adm-btn-danger adm-btn-sm"
                              onClick={() => handleDeleteAdmin(user)}
                              title="Delete Account"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY AUDIT TRAIL */}
      {activeSubTab === 'audit' && (
        <div>
          <div className="adm-page-header">
            <div>
              <h2 className="adm-card-title">Live Security & Operational Audit Log</h2>
              <div className="adm-page-subtext">Real-time immutable history of all administrative actions.</div>
            </div>
          </div>

          <div className="adm-table-container">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action Type</th>
                  <th>Event Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{log.adminName}</div>
                      <span className={`role-badge ${log.role}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                        {log.role}
                      </span>
                    </td>
                    <td>
                      <span className="audit-action-tag">{log.action}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--adm-text-sub)' }}>
                      {log.details}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', fontFamily: 'monospace' }}>
                      {log.ip || '103.241.11.45'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {showAddAdminModal && (
        <div className="adm-modal-overlay">
          <div className="adm-modal-box">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Add New Administrator Account</h3>
              <button 
                type="button" 
                className="adm-modal-close"
                onClick={() => setShowAddAdminModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="adm-modal-body">
              <div className="adm-form-group">
                <label className="adm-form-label">Full Name *</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="e.g. Priya Sharma"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Email Address *</label>
                <input
                  type="email"
                  className="adm-input"
                  placeholder="priya@magnet.com"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Login Username *</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="priya_admin"
                  value={newAdminForm.username}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, username: e.target.value.toLowerCase().trim() }))}
                  required
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Assigned Role *</label>
                <select
                  className="adm-select"
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="admin">🛡️ Standard Store Admin</option>
                  <option value="inventory_manager">📦 Inventory Lead</option>
                  <option value="super_admin">👑 Super Admin</option>
                </select>
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Department / Unit</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="e.g. Catalog Operations"
                  value={newAdminForm.department}
                  onChange={(e) => setNewAdminForm(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>

              <div className="adm-modal-footer">
                <button 
                  type="button" 
                  className="adm-btn adm-btn-secondary"
                  onClick={() => setShowAddAdminModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
