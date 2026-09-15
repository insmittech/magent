import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';

export const InventoryAdjustmentModal = ({
  item,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [adjustment, setAdjustment] = useState('');
  const [reason, setReason] = useState('New Shipment Received');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !item) return null;

  const currentStock = item.stock || 0;
  const adjNum = parseInt(adjustment) || 0;
  const calculatedTotal = Math.max(0, currentStock + adjNum);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = reason === 'Other' ? customReason : reason;
    if (!finalReason.trim()) {
      alert('Please specify an adjustment reason.');
      return;
    }

    onConfirm(item.prodId, item.varId, calculatedTotal, finalReason);
    onClose();
  };

  return (
    <div className="adm-palette-overlay" onClick={onClose}>
      <div className="adm-palette-modal" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
        <div className="adm-drawer-header">
          <div className="adm-drawer-title">
            <Sliders size={16} color="var(--adm-primary)" />
            <span>Adjust Inventory Stock</span>
          </div>
          <button type="button" className="adm-drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--adm-text-main)' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', marginTop: '0.15rem' }}>
              SKU: <code>{item.sku}</code> • {item.variantName || 'Standard'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--adm-bg)', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)', textAlign: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)', display: 'block' }}>Current</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--adm-text-main)' }}>{currentStock}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)', display: 'block' }}>Change</span>
              <strong style={{ fontSize: '1.1rem', color: adjNum >= 0 ? 'var(--adm-success)' : 'var(--adm-danger)' }}>
                {adjNum > 0 ? `+${adjNum}` : adjNum}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)', display: 'block' }}>New Total</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--adm-primary)' }}>{calculatedTotal}</strong>
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Adjustment Quantity (+ / -)</label>
            <input
              type="number"
              required
              className="adm-input"
              placeholder="e.g. +10 or -3"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              autoFocus
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Adjustment Reason *</label>
            <select
              className="adm-select"
              style={{ width: '100%' }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="New Shipment Received">New Shipment Received</option>
              <option value="Stock Count Audit">Stock Count Audit / Correction</option>
              <option value="Damaged / Defective Stock">Damaged / Defective Stock Removed</option>
              <option value="Customer Return / Restock">Customer Return / Restocked</option>
              <option value="Other">Other Reason...</option>
            </select>
          </div>

          {reason === 'Other' && (
            <div className="adm-form-group">
              <label className="adm-label">Specify Reason</label>
              <input
                type="text"
                required
                className="adm-input"
                placeholder="Enter reason details..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="adm-btn adm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn-primary">
              <Check size={14} /> Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
