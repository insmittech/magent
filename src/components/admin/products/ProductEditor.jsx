import React, { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2, Eye, Sparkles, Tag, Check } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { VariantSpreadsheet } from './VariantSpreadsheet';

export const ProductEditor = ({
  initialProduct = null,
  categories = [],
  onSave,
  onCancel
}) => {
  const [form, setForm] = useState({
    name: initialProduct?.name || '',
    brand: initialProduct?.brand || 'Magnet Wear',
    sku: initialProduct?.sku || '',
    category: initialProduct?.category || 'clothing',
    description: initialProduct?.description || '',
    price: initialProduct?.price ? String(initialProduct.price) : '',
    discountPrice: initialProduct?.discountPrice ? String(initialProduct.discountPrice) : '',
    image: initialProduct?.image || '/images/clothing.jpg',
    active: initialProduct?.active !== undefined ? initialProduct.active : true,
    featured: !!initialProduct?.featured,
    trending: !!initialProduct?.trending,
    bestseller: !!initialProduct?.bestseller,
    newArrival: !!initialProduct?.newArrival,
    variants: initialProduct?.variants ? [...initialProduct.variants] : [
      { id: `v-${Date.now()}`, size: 'M', color: 'Black', stock: 10 }
    ],
    specifications: initialProduct?.specifications ? [...initialProduct.specifications] : []
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '' });

  const handleAddSpec = () => {
    if (!newSpec.key.trim() || !newSpec.value.trim()) return;
    setForm(prev => ({
      ...prev,
      specifications: [...prev.specifications, { ...newSpec }]
    }));
    setNewSpec({ key: '', value: '' });
  };

  const handleRemoveSpec = (index) => {
    setForm(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.sku.trim() || !form.price) {
      alert('Please complete the product name, SKU, and selling price.');
      return;
    }

    const payload = {
      ...form,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      variants: form.variants.length > 0 ? form.variants : [{ id: `v-${Date.now()}`, stock: 10 }]
    };

    onSave(payload);
  };

  // Calculate discount percentage
  const priceNum = parseFloat(form.price) || 0;
  const discountNum = parseFloat(form.discountPrice) || 0;
  const discountPercent = (priceNum > 0 && discountNum > 0 && discountNum < priceNum)
    ? Math.round(((priceNum - discountNum) / priceNum) * 100)
    : 0;

  return (
    <div>
      {/* Header Bar */}
      <div className="adm-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={onCancel}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1>{initialProduct ? 'Update Product' : 'Create New Product'}</h1>
            <div className="adm-page-subtext">
              {initialProduct ? `SKU: ${form.sku}` : 'Fill in the information below to add a new product to your catalog.'}
            </div>
          </div>
        </div>

        <div className="adm-header-actions">
          <button type="button" className="adm-btn adm-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="adm-btn adm-btn-primary" onClick={handleSubmit}>
            <Save size={16} /> Save Product
          </button>
        </div>
      </div>

      {/* Split Layout: Form on Left (60%), Live Preview on Right (40%) */}
      <form onSubmit={handleSubmit} className="adm-editor-split">
        <div className="adm-editor-left">
          {/* 1. Basic Information */}
          <div className="adm-card">
            <h2 className="adm-card-title" style={{ marginBottom: '1rem' }}>Basic Information</h2>
            <div className="adm-form-grid">
              <div className="adm-form-group full">
                <label className="adm-label">Product Name *</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Magnet Signature Hoodie"
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Brand Name</label>
                <input
                  type="text"
                  className="adm-input"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. Magnet Wear"
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Stock Keeping Unit (SKU) *</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="e.g. CL-HD-001"
                />
              </div>

              <div className="adm-form-group full">
                <label className="adm-label">Category</label>
                <select
                  className="adm-select"
                  style={{ width: '100%' }}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, variants: [] })}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="adm-form-group full">
                <label className="adm-label">Product Description</label>
                <textarea
                  className="adm-textarea"
                  style={{ minHeight: '90px' }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the fabric, features, materials, and benefits..."
                />
              </div>
            </div>
          </div>

          {/* 2. Pricing Section */}
          <div className="adm-card">
            <h2 className="adm-card-title" style={{ marginBottom: '1rem' }}>Pricing</h2>
            <div className="adm-form-grid">
              <div className="adm-form-group">
                <label className="adm-label">Selling / Base Price (₹) *</label>
                <input
                  type="number"
                  required
                  className="adm-input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="1899"
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Discount Price (₹)</label>
                <input
                  type="number"
                  className="adm-input"
                  value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  placeholder="1499"
                />
              </div>

              {discountPercent > 0 && (
                <div className="adm-form-group full" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--adm-success)', fontWeight: 700 }}>
                  <Tag size={14} />
                  <span>Customer saves {discountPercent}% off retail price</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Media Upload */}
          <div className="adm-card">
            <h2 className="adm-card-title" style={{ marginBottom: '1rem' }}>Product Media</h2>
            <MediaUploader
              imageUrl={form.image}
              onImageChange={(img) => setForm({ ...form, image: img })}
            />
          </div>

          {/* 4. Variants Spreadsheet */}
          <div className="adm-card">
            <h2 className="adm-card-title" style={{ marginBottom: '0.5rem' }}>Variants & Inventory</h2>
            <div className="adm-page-subtext" style={{ marginBottom: '1rem' }}>
              Define SKUs, sizes, colors, and stock levels for this product.
            </div>
            <VariantSpreadsheet
              category={form.category}
              variants={form.variants}
              onChange={(vars) => setForm({ ...form, variants: vars })}
            />
          </div>

          {/* 5. Technical Specifications */}
          <div className="adm-card">
            <h2 className="adm-card-title" style={{ marginBottom: '1rem' }}>Technical Specifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                <div className="adm-form-group">
                  <label className="adm-label" style={{ fontSize: '0.7rem' }}>Attribute</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={newSpec.key}
                    onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                    placeholder="e.g. Fabric Weight"
                  />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label" style={{ fontSize: '0.7rem' }}>Value</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={newSpec.value}
                    onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                    placeholder="e.g. 400 GSM Combed Cotton"
                  />
                </div>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  style={{ height: '36px' }}
                  onClick={handleAddSpec}
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {form.specifications.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.75rem', backgroundColor: 'var(--adm-bg)', borderRadius: 'var(--adm-radius-sm)', border: '1px solid var(--adm-border)' }}>
                  <span style={{ fontSize: '0.8rem' }}><strong>{s.key}:</strong> {s.value}</span>
                  <button type="button" className="adm-btn-icon danger" onClick={() => handleRemoveSpec(idx)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Visibility & Badges */}
          <div className="adm-card">
            <h2 className="adm-card-title" style={{ marginBottom: '1rem' }}>Visibility & Badging</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                <strong>Active in Store</strong>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                <span>Featured (Hot)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={form.trending}
                  onChange={(e) => setForm({ ...form, trending: e.target.checked })}
                />
                <span>Trending Now</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                />
                <span>Best Seller</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={form.newArrival}
                  onChange={(e) => setForm({ ...form, newArrival: e.target.checked })}
                />
                <span>New Arrival</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Product Preview Sticky Column */}
        <div>
          <div className="adm-editor-preview-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h2 className="adm-card-title" style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', textTransform: 'uppercase' }}>
                <Eye size={14} /> Live Storefront Preview
              </h2>
              <span className={`adm-badge ${form.active ? 'active' : 'inactive'}`}>
                {form.active ? 'Active' : 'Draft'}
              </span>
            </div>

            <div style={{ borderRadius: 'var(--adm-radius-sm)', overflow: 'hidden', backgroundColor: 'var(--adm-bg)', border: '1px solid var(--adm-border)' }}>
              <img
                src={form.image || '/images/clothing.jpg'}
                alt={form.name || 'Preview'}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--adm-text-muted)', textTransform: 'uppercase' }}>
                  {form.brand || 'Magnet Wear'}
                </span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--adm-text-main)' }}>
                  {form.name || 'Product Title Placeholder'}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--adm-text-main)' }}>
                    ₹{form.discountPrice || form.price || '0'}
                  </strong>
                  {form.discountPrice && (
                    <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--adm-text-muted)' }}>
                      ₹{form.price}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--adm-success)' }}>
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                  {form.variants.length} variant{form.variants.length > 1 ? 's' : ''} defined
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
