import React, { useState } from 'react';
import { 
  Plus, Search, Filter, LayoutList, LayoutGrid, 
  Edit, ToggleLeft, ToggleRight, Trash2, Copy, Eye, Tag
} from 'lucide-react';

export const ProductsPage = ({
  products = [],
  categories = [],
  onAddNew,
  onEditProduct,
  onToggleActive,
  onDeleteProduct,
  onDuplicateProduct
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter & Search Logic
  const filteredProducts = products.filter(p => {
    // Search
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    if (!matchSearch) return false;

    // Category
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;

    // Status
    if (statusFilter === 'active' && !p.active) return false;
    if (statusFilter === 'inactive' && p.active) return false;

    // Stock
    const totalStock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    if (stockFilter === 'out' && totalStock > 0) return false;
    if (stockFilter === 'low' && (totalStock === 0 || totalStock > 5)) return false;

    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected products permanently?`)) {
      selectedIds.forEach(id => onDeleteProduct(id));
      setSelectedIds([]);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <h1>Products Catalog</h1>
          <div className="adm-page-subtext">Manage your entire catalog ({products.length} products available).</div>
        </div>

        <div className="adm-header-actions">
          <button type="button" className="adm-btn adm-btn-primary" onClick={onAddNew}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="adm-table-search">
              <Search size={15} color="var(--adm-text-muted)" />
              <input
                type="text"
                placeholder="Search name, SKU, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="adm-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select
              className="adm-select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock (≤ 5 units)</option>
              <option value="out">Out of Stock (0 units)</option>
            </select>

            <select
              className="adm-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active in Store</option>
              <option value="inactive">Disabled / Draft</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedIds.length > 0 && (
              <button 
                type="button" 
                className="adm-btn adm-btn-danger adm-btn-sm"
                onClick={handleBulkDelete}
              >
                <Trash2 size={13} /> Delete ({selectedIds.length})
              </button>
            )}

            <div className="adm-pill-group">
              <button
                type="button"
                className={`adm-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <LayoutList size={15} />
              </button>
              <button
                type="button"
                className={`adm-pill-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Dense List View (Default) */}
        {viewMode === 'list' && (
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: '32px' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>
                      No products match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => {
                    const totalStock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
                    const isSelected = selectedIds.includes(p.id);

                    return (
                      <tr key={p.id} className={isSelected ? 'selected' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(p.id)}
                          />
                        </td>
                        <td>
                          <div className="adm-prod-cell">
                            <img src={p.image} alt={p.name} className="adm-prod-thumb" />
                            <div className="adm-prod-info">
                              <span className="adm-prod-name">{p.name}</span>
                              <span className="adm-prod-sub">{p.brand || 'Magnet Wear'}</span>
                            </div>
                          </div>
                        </td>
                        <td><code>{p.sku}</code></td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>
                            {categories.find(c => c.id === p.category)?.name || p.category}
                          </span>
                        </td>
                        <td>
                          <strong>₹{p.discountPrice || p.price}</strong>
                          {p.discountPrice && (
                            <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--adm-text-muted)', marginLeft: '0.35rem' }}>
                              ₹{p.price}
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: totalStock === 0 ? 'var(--adm-danger)' : totalStock <= 5 ? 'var(--adm-warning)' : 'inherit' }}>
                            {totalStock} units
                          </span>
                        </td>
                        <td>
                          <span className={`adm-badge ${p.active ? 'active' : 'inactive'}`}>
                            {p.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div className="adm-actions-cell" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="adm-btn-icon"
                              onClick={() => onEditProduct(p)}
                              title="Edit product"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              className="adm-btn-icon"
                              onClick={() => onToggleActive(p.id, !p.active)}
                              title={p.active ? "Disable product" : "Activate product"}
                            >
                              {p.active ? <ToggleRight size={16} color="var(--adm-success)" /> : <ToggleLeft size={16} />}
                            </button>
                            <button
                              type="button"
                              className="adm-btn-icon danger"
                              onClick={() => {
                                if (window.confirm(`Delete "${p.name}" permanently?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View Mode 2: Grid View */}
        {viewMode === 'grid' && (
          <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {filteredProducts.map(p => {
              const totalStock = p.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
              return (
                <div key={p.id} className="adm-card" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: 'var(--adm-radius-sm)', overflow: 'hidden', backgroundColor: 'var(--adm-bg)' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className={`adm-badge ${p.active ? 'active' : 'inactive'}`} style={{ position: 'absolute', top: '8px', right: '8px' }}>
                      {p.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
                      {p.brand || 'Magnet'}
                    </span>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--adm-text-main)', marginTop: '0.15rem' }}>
                      {p.name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <strong>₹{p.discountPrice || p.price}</strong>
                      {p.discountPrice && (
                        <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--adm-text-muted)', marginLeft: '0.35rem' }}>
                          ₹{p.price}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: totalStock === 0 ? 'var(--adm-danger)' : totalStock <= 5 ? 'var(--adm-warning)' : 'inherit' }}>
                      {totalStock} in stock
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--adm-border)' }}>
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary adm-btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => onEditProduct(p)}
                    >
                      <Edit size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      className="adm-btn-icon"
                      onClick={() => onToggleActive(p.id, !p.active)}
                    >
                      {p.active ? <ToggleRight size={16} color="var(--adm-success)" /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
