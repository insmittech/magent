import React, { useState } from 'react';
import { Plus, FolderKanban, ToggleLeft, ToggleRight, Trash2, Edit, Save, X } from 'lucide-react';

export const CategoriesPage = ({
  categories = [],
  products = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '' });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onAddCategory({
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      image: form.image || '/images/clothing.jpg',
      active: true
    });

    setForm({ name: '', slug: '', description: '', image: '' });
    setIsCreating(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    onUpdateCategory(editingId, {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image || '/images/clothing.jpg'
    });

    setEditingId(null);
    setForm({ name: '', slug: '', description: '', image: '' });
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || ''
    });
    setIsCreating(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Category Management</h1>
          <div className="adm-page-subtext">
            Organize catalog products into customer navigation departments.
          </div>
        </div>

        <div className="adm-header-actions">
          <button
            type="button"
            className="adm-btn adm-btn-primary"
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              setForm({ name: '', slug: '', description: '', image: '' });
            }}
          >
            <Plus size={16} /> Create Category
          </button>
        </div>
      </div>

      {/* Creation / Edit Card */}
      {(isCreating || editingId) && (
        <div className="adm-card" style={{ marginBottom: '1.5rem', borderColor: 'var(--adm-primary)' }}>
          <div className="adm-card-header">
            <h2 className="adm-card-title">
              <FolderKanban size={16} color="var(--adm-primary)" />
              <span>{editingId ? 'Edit Category' : 'Create New Category'}</span>
            </h2>
            <button
              type="button"
              className="adm-btn-icon"
              onClick={() => { setIsCreating(false); setEditingId(null); }}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={editingId ? handleEditSubmit : handleCreateSubmit}>
            <div className="adm-form-grid">
              <div className="adm-form-group">
                <label className="adm-label">Category Name *</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  placeholder="e.g. Graphic T-Shirts"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">URL Slug</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="e.g. graphic-tees"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  disabled={!!editingId}
                />
              </div>

              <div className="adm-form-group full">
                <label className="adm-label">Description</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="Short description for storefront filters..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="adm-form-group full">
                <label className="adm-label">Category Image Path / URL</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="e.g. /images/clothing.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => { setIsCreating(false); setEditingId(null); }}
              >
                Cancel
              </button>
              <button type="submit" className="adm-btn adm-btn-primary">
                <Save size={14} /> {editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {categories.map(c => {
          const count = products.filter(p => p.category === c.id).length;
          const isCore = c.id === 'clothing' || c.id === 'accessories';

          return (
            <div key={c.id} className="adm-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img
                    src={c.image || '/images/clothing.jpg'}
                    alt={c.name}
                    style={{ width: '40px', height: '40px', borderRadius: 'var(--adm-radius-sm)', objectFit: 'cover', border: '1px solid var(--adm-border)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--adm-text-main)' }}>{c.name}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>
                      slug: <code>{c.slug}</code>
                    </div>
                  </div>
                </div>

                <span className={`adm-badge ${c.active ? 'active' : 'inactive'}`}>
                  {c.active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>
                {c.description || 'Department catalog category.'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--adm-border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--adm-text-muted)' }}>
                  {count} product{count !== 1 ? 's' : ''}
                </span>

                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    type="button"
                    className="adm-btn-icon"
                    onClick={() => startEdit(c)}
                    title="Edit category"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    type="button"
                    className="adm-btn-icon"
                    onClick={() => onUpdateCategory(c.id, { active: !c.active })}
                    title={c.active ? 'Disable' : 'Enable'}
                  >
                    {c.active ? <ToggleRight size={16} color="var(--adm-success)" /> : <ToggleLeft size={16} />}
                  </button>
                  {!isCore && (
                    <button
                      type="button"
                      className="adm-btn-icon danger"
                      onClick={() => {
                        if (window.confirm(`Delete category "${c.name}"? Products will become unassigned.`)) {
                          onDeleteCategory(c.id);
                        }
                      }}
                      title="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
