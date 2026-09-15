import React, { useState } from 'react';
import { Search, AlertTriangle, AlertCircle, PackageCheck, Sliders, CheckCircle2 } from 'lucide-react';
import { InventoryAdjustmentModal } from './InventoryAdjustmentModal';

export const InventoryPage = ({ products = [], onUpdateVariantStock }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'in' | 'low' | 'out'
  const [selectedAdjustItem, setSelectedAdjustItem] = useState(null);

  // Flatten all variants from all products
  const allVariants = products.flatMap(p => 
    p.variants.map(v => ({
      prodId: p.id,
      varId: v.id,
      name: p.name,
      image: p.image,
      category: p.category,
      sku: `${p.sku}-${v.size || v.compatibleModel || 'VAR'}`,
      variantName: p.category === 'clothing' 
        ? `Size: ${v.size || 'N/A'}, Color: ${v.color || 'Standard'}` 
        : `${v.compatibleModel || 'Universal'} ${v.specification || ''} ${v.color || ''}`,
      stock: v.stock,
      price: p.discountPrice || p.price,
      status: v.stock === 0 ? 'Out of Stock' : v.stock <= 3 ? 'Low Stock' : 'In Stock'
    }))
  );

  // Calculate KPIs
  const totalSkus = allVariants.length;
  const totalUnits = allVariants.reduce((sum, v) => sum + v.stock, 0);
  const lowStockCount = allVariants.filter(v => v.stock > 0 && v.stock <= 3).length;
  const outOfStockCount = allVariants.filter(v => v.stock === 0).length;
  const totalInventoryValue = allVariants.reduce((sum, v) => sum + (v.stock * v.price), 0);

  // Filtered List
  const filtered = allVariants.filter(v => {
    // Tab filter
    if (filter === 'in' && v.stock <= 3) return false;
    if (filter === 'low' && (v.stock === 0 || v.stock > 3)) return false;
    if (filter === 'out' && v.stock > 0) return false;

    // Search query
    const q = search.toLowerCase();
    return v.name.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q) || v.variantName.toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Inventory Stock Command Center</h1>
          <div className="adm-page-subtext">
            Monitor SKU levels, low-stock alerts, and record inventory adjustments.
          </div>
        </div>
      </div>

      {/* Inventory KPI Summary */}
      <div className="adm-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '1.5rem' }}>
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Tracked SKUs</span>
            <PackageCheck size={16} className="adm-kpi-icon" />
          </div>
          <div className="adm-kpi-value">{totalSkus}</div>
          <div className="adm-kpi-footer"><span>active catalog variants</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Total Units</span>
            <CheckCircle2 size={16} className="adm-kpi-icon" />
          </div>
          <div className="adm-kpi-value">{totalUnits}</div>
          <div className="adm-kpi-footer"><span>on-hand inventory</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Low Stock</span>
            <AlertTriangle size={16} color="var(--adm-warning)" />
          </div>
          <div className="adm-kpi-value" style={{ color: lowStockCount > 0 ? 'var(--adm-warning)' : 'inherit' }}>
            {lowStockCount}
          </div>
          <div className="adm-kpi-footer"><span>critical stock (≤ 3 units)</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Out of Stock</span>
            <AlertCircle size={16} color="var(--adm-danger)" />
          </div>
          <div className="adm-kpi-value" style={{ color: outOfStockCount > 0 ? 'var(--adm-danger)' : 'inherit' }}>
            {outOfStockCount}
          </div>
          <div className="adm-kpi-footer"><span>needs restocking</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Total Stock Value</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>₹</span>
          </div>
          <div className="adm-kpi-value" style={{ color: 'var(--adm-primary)' }}>
            ₹{Math.round(totalInventoryValue).toLocaleString()}
          </div>
          <div className="adm-kpi-footer"><span>estimated catalog valuation</span></div>
        </div>
      </div>

      {/* Main Table Shell */}
      <div className="adm-table-container">
        {/* Filter Pills Header */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--adm-border)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`adm-pill-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All SKUs ({allVariants.length})
          </button>
          <button
            type="button"
            className={`adm-pill-btn ${filter === 'in' ? 'active' : ''}`}
            onClick={() => setFilter('in')}
          >
            In Stock ({allVariants.filter(v => v.stock > 3).length})
          </button>
          <button
            type="button"
            className={`adm-pill-btn ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            type="button"
            className={`adm-pill-btn ${filter === 'out' ? 'active' : ''}`}
            onClick={() => setFilter('out')}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>

        {/* Toolbar */}
        <div className="adm-table-toolbar">
          <div className="adm-table-search" style={{ width: '280px' }}>
            <Search size={15} color="var(--adm-text-muted)" />
            <input
              type="text"
              placeholder="Search by SKU or product name..."
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
                <th>Product Item</th>
                <th>SKU Code</th>
                <th>Variant Specs</th>
                <th>Available Units</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Stock Adjustment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>
                    No inventory items match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="adm-prod-cell">
                        <img src={item.image} alt={item.name} className="adm-prod-thumb" />
                        <div>
                          <strong>{item.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>{item.sku}</code></td>
                    <td>{item.variantName}</td>
                    <td>
                      <strong style={{ color: item.stock === 0 ? 'var(--adm-danger)' : item.stock <= 3 ? 'var(--adm-warning)' : 'inherit' }}>
                        {item.stock} on hand
                      </strong>
                    </td>
                    <td>
                      <span className={`adm-badge ${item.stock === 0 ? 'out' : item.stock <= 3 ? 'low' : 'active'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-btn-sm"
                        onClick={() => setSelectedAdjustItem(item)}
                      >
                        <Sliders size={13} /> Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      <InventoryAdjustmentModal
        item={selectedAdjustItem}
        isOpen={!!selectedAdjustItem}
        onClose={() => setSelectedAdjustItem(null)}
        onConfirm={onUpdateVariantStock}
      />
    </div>
  );
};
