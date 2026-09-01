import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Calendar, Edit, ToggleLeft, ToggleRight, Trash2, Tag, Percent, X, Save, Eye } from 'lucide-react';

export const MarketingPage = ({
  banners = [],
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    heading: '',
    subtitle: '',
    image: '/images/clothing.jpg',
    ctaText: 'Shop Now',
    ctaUrl: '#',
    active: true,
    startDate: '',
    endDate: ''
  });

  const resetForm = () => {
    setIsCreating(false);
    setEditingBanner(null);
    setBannerForm({
      heading: '',
      subtitle: '',
      image: '/images/clothing.jpg',
      ctaText: 'Shop Now',
      ctaUrl: '#',
      active: true,
      startDate: '',
      endDate: ''
    });
  };

  const handleEdit = (b) => {
    setEditingBanner(b.id);
    setBannerForm({
      heading: b.heading,
      subtitle: b.subtitle,
      image: b.image || '/images/clothing.jpg',
      ctaText: b.ctaText || 'Shop Now',
      ctaUrl: b.ctaUrl || '#',
      active: b.active !== undefined ? b.active : true,
      startDate: b.startDate || '',
      endDate: b.endDate || ''
    });
    setIsCreating(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bannerForm.heading.trim()) return;

    if (editingBanner) {
      onUpdateBanner(editingBanner, bannerForm);
    } else {
      onAddBanner(bannerForm);
    }
    resetForm();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Marketing & Promotional Banners</h1>
          <div className="adm-page-subtext">
            Configure homepage hero carousel slides and store discount announcements.
          </div>
        </div>

        <div className="adm-header-actions">
          <button
            type="button"
            className="adm-btn adm-btn-primary"
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
          >
            <Plus size={16} /> Add Hero Banner
          </button>
        </div>
      </div>

      {/* Banner Editor & Live Preview */}
      {isCreating && (
        <div className="adm-card" style={{ marginBottom: '2rem', borderColor: 'var(--adm-primary)' }}>
          <div className="adm-card-header">
            <h2 className="adm-card-title">
              <ImageIcon size={16} color="var(--adm-primary)" />
              <span>{editingBanner ? 'Update Hero Banner' : 'Create Hero Banner'}</span>
            </h2>
            <button type="button" className="adm-btn-icon" onClick={resetForm}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <form onSubmit={handleSubmit} className="adm-form-grid">
              <div className="adm-form-group full">
                <label className="adm-label">Banner Heading *</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  placeholder="e.g. MONSOON STREETWEAR DROP"
                  value={bannerForm.heading}
                  onChange={(e) => setBannerForm({ ...bannerForm, heading: e.target.value })}
                />
              </div>

              <div className="adm-form-group full">
                <label className="adm-label">Subtitle Description *</label>
                <input
                  type="text"
                  required
                  className="adm-input"
                  placeholder="e.g. Heavyweight boxy tees & premium fast chargers."
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">CTA Button Label</label>
                <input
                  type="text"
                  className="adm-input"
                  value={bannerForm.ctaText}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">CTA Link URL</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="#clothing"
                  value={bannerForm.ctaUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaUrl: e.target.value })}
                />
              </div>

              <div className="adm-form-group full">
                <label className="adm-label">Banner Image Path / URL</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="e.g. /images/featured-hoodie.jpg"
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">Start Schedule Date</label>
                <input
                  type="date"
                  className="adm-input"
                  value={bannerForm.startDate}
                  onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label">End Schedule Date</label>
                <input
                  type="date"
                  className="adm-input"
                  value={bannerForm.endDate}
                  onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                />
              </div>

              <div className="adm-form-group full" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="adm-btn adm-btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary">
                  <Save size={14} /> Save Banner
                </button>
              </div>
            </form>

            {/* Live Banner Preview Card */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--adm-text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Eye size={14} /> Live Slide Preview
              </div>
              <div style={{ position: 'relative', height: '220px', borderRadius: 'var(--adm-radius-md)', overflow: 'hidden', backgroundColor: '#000', display: 'flex', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--adm-border)' }}>
                <img
                  src={bannerForm.image || '/images/clothing.jpg'}
                  alt="Slide preview"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                />
                <div style={{ position: 'relative', zIndex: 5, color: '#fff', maxWidth: '320px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {bannerForm.heading || 'BANNER HEADLINE'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '0.85rem' }}>
                    {bannerForm.subtitle || 'Supporting promotional text'}
                  </p>
                  <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" style={{ pointerEvents: 'none' }}>
                    {bannerForm.ctaText || 'Shop Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners List Table */}
      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <h2 className="adm-card-title" style={{ fontSize: '0.95rem' }}>Active Hero Carousel Slides</h2>
        </div>

        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Slide</th>
                <th>Details</th>
                <th>Schedule</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>
                    No hero banners configured.
                  </td>
                </tr>
              ) : (
                banners.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="adm-prod-cell">
                        <img src={b.image} alt={b.heading} className="adm-prod-thumb" style={{ width: '60px', height: '36px' }} />
                        <strong>{b.heading}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>{b.subtitle}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>Button: "{b.ctaText}" → {b.ctaUrl}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                        <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {b.startDate || 'Immediate'} to {b.endDate || 'Ongoing'}
                      </div>
                    </td>
                    <td>
                      <span className={`adm-badge ${b.active ? 'active' : 'inactive'}`}>
                        {b.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="adm-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button type="button" className="adm-btn-icon" onClick={() => handleEdit(b)} title="Edit">
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon"
                          onClick={() => onUpdateBanner(b.id, { active: !b.active })}
                          title={b.active ? "Disable slide" : "Activate slide"}
                        >
                          {b.active ? <ToggleRight size={16} color="var(--adm-success)" /> : <ToggleLeft size={16} />}
                        </button>
                        <button
                          type="button"
                          className="adm-btn-icon danger"
                          onClick={() => {
                            if (window.confirm('Delete this banner slide?')) onDeleteBanner(b.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
