import React, { useState } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

export const VariantSpreadsheet = ({ category = 'clothing', variants = [], onChange }) => {
  const [newVar, setNewVar] = useState({
    size: 'M',
    color: 'Black',
    compatibleModel: 'iPhone 15',
    specification: '1.2m',
    stock: 10
  });

  const handleAddRow = () => {
    const item = {
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      stock: parseInt(newVar.stock) || 0
    };

    if (category === 'clothing') {
      item.size = newVar.size;
      item.color = newVar.color;
    } else {
      item.compatibleModel = newVar.compatibleModel;
      item.specification = newVar.specification;
      item.color = newVar.color;
    }

    onChange([...variants, item]);
  };

  const handleUpdateStock = (id, stock) => {
    const num = Math.max(0, parseInt(stock) || 0);
    onChange(variants.map(v => v.id === id ? { ...v, stock: num } : v));
  };

  const handleRemove = (id) => {
    onChange(variants.filter(v => v.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="adm-variant-sheet">
        <table>
          <thead>
            <tr>
              {category === 'clothing' ? (
                <>
                  <th>Size</th>
                  <th>Color</th>
                </>
              ) : (
                <>
                  <th>Model</th>
                  <th>Specification</th>
                  <th>Color</th>
                </>
              )}
              <th style={{ width: '100px' }}>Stock Qty</th>
              <th>Status</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 ? (
              <tr>
                <td colSpan={category === 'clothing' ? 4 : 5} style={{ textAlign: 'center', color: 'var(--adm-text-muted)', padding: '1rem' }}>
                  No variants defined yet. Use the row builder below.
                </td>
              </tr>
            ) : (
              variants.map(v => (
                <tr key={v.id}>
                  {category === 'clothing' ? (
                    <>
                      <td><strong>{v.size || 'N/A'}</strong></td>
                      <td>{v.color || 'Standard'}</td>
                    </>
                  ) : (
                    <>
                      <td><strong>{v.compatibleModel || 'Universal'}</strong></td>
                      <td>{v.specification || '-'}</td>
                      <td>{v.color || 'Standard'}</td>
                    </>
                  )}
                  <td>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleUpdateStock(v.id, e.target.value)}
                      style={{ width: '70px', textAlign: 'center', fontWeight: 700 }}
                    />
                  </td>
                  <td>
                    <span className={`adm-badge ${v.stock === 0 ? 'out' : v.stock <= 3 ? 'low' : 'active'}`}>
                      {v.stock === 0 ? 'Out of Stock' : v.stock <= 3 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="adm-btn-icon danger"
                      onClick={() => handleRemove(v.id)}
                      title="Remove variant"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Row Builder Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', alignItems: 'end', padding: '0.75rem', backgroundColor: 'var(--adm-bg)', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)' }}>
        {category === 'clothing' ? (
          <>
            <div className="adm-form-group">
              <label className="adm-label" style={{ fontSize: '0.7rem' }}>Size</label>
              <input
                type="text"
                className="adm-input"
                style={{ padding: '0.35rem 0.5rem' }}
                value={newVar.size}
                onChange={(e) => setNewVar({ ...newVar, size: e.target.value })}
                placeholder="e.g. M, L, XL"
              />
            </div>
            <div className="adm-form-group">
              <label className="adm-label" style={{ fontSize: '0.7rem' }}>Color</label>
              <input
                type="text"
                className="adm-input"
                style={{ padding: '0.35rem 0.5rem' }}
                value={newVar.color}
                onChange={(e) => setNewVar({ ...newVar, color: e.target.value })}
                placeholder="e.g. Black"
              />
            </div>
          </>
        ) : (
          <>
            <div className="adm-form-group">
              <label className="adm-label" style={{ fontSize: '0.7rem' }}>Model</label>
              <input
                type="text"
                className="adm-input"
                style={{ padding: '0.35rem 0.5rem' }}
                value={newVar.compatibleModel}
                onChange={(e) => setNewVar({ ...newVar, compatibleModel: e.target.value })}
                placeholder="iPhone 15"
              />
            </div>
            <div className="adm-form-group">
              <label className="adm-label" style={{ fontSize: '0.7rem' }}>Spec</label>
              <input
                type="text"
                className="adm-input"
                style={{ padding: '0.35rem 0.5rem' }}
                value={newVar.specification}
                onChange={(e) => setNewVar({ ...newVar, specification: e.target.value })}
                placeholder="1.2m / 65W"
              />
            </div>
            <div className="adm-form-group">
              <label className="adm-label" style={{ fontSize: '0.7rem' }}>Color</label>
              <input
                type="text"
                className="adm-input"
                style={{ padding: '0.35rem 0.5rem' }}
                value={newVar.color}
                onChange={(e) => setNewVar({ ...newVar, color: e.target.value })}
                placeholder="Space Grey"
              />
            </div>
          </>
        )}

        <div className="adm-form-group">
          <label className="adm-label" style={{ fontSize: '0.7rem' }}>Stock *</label>
          <input
            type="number"
            className="adm-input"
            style={{ padding: '0.35rem 0.5rem' }}
            value={newVar.stock}
            onChange={(e) => setNewVar({ ...newVar, stock: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="adm-btn adm-btn-secondary"
          style={{ height: '32px', fontSize: '0.75rem' }}
          onClick={handleAddRow}
        >
          <Plus size={14} /> Add Row
        </button>
      </div>
    </div>
  );
};
