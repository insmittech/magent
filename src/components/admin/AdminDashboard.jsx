import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { 
  LayoutDashboard, ShoppingCart, FolderKanban, Package, Settings, 
  Plus, Edit, ToggleLeft, ToggleRight, Trash2, Home, Save, Sparkles,
  Percent, Image, AlertTriangle, CheckCircle, RefreshCw, BarChart2, Calendar
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    products, 
    categories, 
    orders, 
    settings, 
    banners,
    isAdmin, 
    setIsAdmin,
    setSettings, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addBanner,
    updateBanner,
    deleteBanner,
    updateOrderStatus,
    getKPIs
  } = useContext(StoreContext);

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Product Form states
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', brand: '', sku: '', category: 'clothing', description: '', price: '', discountPrice: '', image: '', active: true, variants: [], specifications: []
  });
  
  // Custom states for category add
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Banner Form states
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    heading: '', subtitle: '', image: '', ctaText: 'Shop Now', ctaUrl: '#', active: true, startDate: '', endDate: ''
  });
  
  // Variant builders
  const [tempVariant, setTempVariant] = useState({
    size: '', color: '', compatibleModel: '', specification: '', stock: 5
  });

  // Specifications builder
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });

  const kpis = getKPIs();

  // Reset Product Form
  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', brand: '', sku: '', category: 'clothing', description: '', price: '', discountPrice: '', image: '', active: true, variants: [], specifications: []
    });
    setTempVariant({ size: '', color: '', compatibleModel: '', specification: '', stock: 5 });
    setTempSpec({ key: '', value: '' });
  };

  // Reset Banner Form
  const resetBannerForm = () => {
    setEditingBanner(null);
    setBannerForm({
      heading: '', subtitle: '', image: '', ctaText: 'Shop Now', ctaUrl: '#', active: true, startDate: '', endDate: ''
    });
    setBannerFormOpen(false);
  };

  // Add variant
  const handleAddVariant = () => {
    const newVar = {
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...tempVariant,
      stock: parseInt(tempVariant.stock) || 0
    };
    
    Object.keys(newVar).forEach(key => {
      if (newVar[key] === '') delete newVar[key];
    });

    setProductForm(prev => ({
      ...prev,
      variants: [...prev.variants, newVar]
    }));
  };

  const handleRemoveVariant = (id) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }));
  };

  // Add Spec
  const handleAddSpec = () => {
    if (!tempSpec.key || !tempSpec.value) return;
    setProductForm(prev => ({
      ...prev,
      specifications: [...(prev.specifications || []), { ...tempSpec }]
    }));
    setTempSpec({ key: '', value: '' });
  };

  const handleRemoveSpec = (index) => {
    setProductForm(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index)
    }));
  };

  // Submit Product Form
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku || !productForm.price) {
      alert('Please fill in Name, SKU, and Price.');
      return;
    }

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      discountPrice: productForm.discountPrice ? parseFloat(productForm.discountPrice) : null,
      image: productForm.image || (productForm.category === 'accessories' ? '/images/accessories.jpg' : '/images/clothing.jpg'),
      variants: productForm.variants.length > 0 ? productForm.variants : [{ id: `v-${Date.now()}`, stock: 10 }]
    };

    if (editingProduct) {
      updateProduct(editingProduct, payload);
    } else {
      addProduct(payload);
    }
    resetProductForm();
    setActiveTab('products');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      brand: product.brand || '',
      sku: product.sku,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
      image: product.image,
      active: product.active,
      variants: [...product.variants],
      specifications: [...(product.specifications || [])]
    });
    setActiveTab('product-form');
  };

  // Banners Handlers
  const handleBannerSubmit = (e) => {
    e.preventDefault();
    if (!bannerForm.heading || !bannerForm.subtitle) {
      alert('Please complete banner heading and details.');
      return;
    }
    const payload = {
      ...bannerForm,
      image: bannerForm.image || '/images/clothing.jpg'
    };

    if (editingBanner) {
      updateBanner(editingBanner, payload);
    } else {
      addBanner(payload);
    }
    resetBannerForm();
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner.id);
    setBannerForm({
      heading: banner.heading,
      subtitle: banner.subtitle,
      image: banner.image,
      ctaText: banner.ctaText,
      ctaUrl: banner.ctaUrl,
      active: banner.active,
      startDate: banner.startDate || '',
      endDate: banner.endDate || ''
    });
    setBannerFormOpen(true);
  };

  // Add Category
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({ name: newCatName.trim(), description: newCatDesc.trim(), active: true });
    setNewCatName('');
    setNewCatDesc('');
  };

  // Settings
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const updated = {
      storeName: data.get('storeName'),
      whatsappNumber: data.get('whatsappNumber'),
      address: data.get('address'),
      email: data.get('email'),
      announcement: data.get('announcement')
    };
    setSettings(prev => ({ ...prev, ...updated }));
    alert('Store configuration updated successfully!');
  };

  // Inventory list with filter status
  const [invFilter, setInvFilter] = useState('all'); // 'all' | 'low' | 'out'
  const filteredInventory = products.flatMap(p => 
    p.variants.map(v => ({
      prodId: p.id,
      prodName: p.name,
      category: p.category,
      varId: v.id,
      sku: p.sku + '-' + (v.size || v.compatibleModel || 'VAR'),
      details: p.category === 'clothing' 
        ? `Size: ${v.size || 'N/A'}, Color: ${v.color || 'N/A'}` 
        : `${v.compatibleModel ? 'Model: ' + v.compatibleModel : ''} ${v.specification ? 'Spec: ' + v.specification : ''} ${v.color ? 'Color: ' + v.color : ''}`,
      stock: v.stock,
      status: v.stock === 0 ? 'Out of Stock' : v.stock <= 3 ? 'Low Stock' : 'In Stock'
    }))
  ).filter(item => {
    if (invFilter === 'low') return item.stock > 0 && item.stock <= 3;
    if (invFilter === 'out') return item.stock === 0;
    return true;
  });

  const handleStockAdjust = (prodId, varId, newQty) => {
    const qty = parseInt(newQty);
    if (isNaN(qty) || qty < 0) return;
    
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      const updatedVariants = prod.variants.map(v => v.id === varId ? { ...v, stock: qty } : v);
      updateProduct(prodId, { variants: updatedVariants });
    }
  };

  return (
    <div className="admin-root" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      {/* Header */}
      <header className="header-main">
        <div className="container header-main-container">
          <a href="#" className="logo-link" onClick={() => setIsAdmin(false)}>
            Magnet<span className="logo-dot" style={{ backgroundColor: '#2563eb' }}></span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Admin Panel</span>
          </a>
          
          {/* Spacer center column */}
          <div></div>

          <div className="header-action-links">
            <button className="role-switcher-btn" onClick={() => setIsAdmin(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Home size={14} /> Shop Storefront
            </button>
          </div>
        </div>
      </header>

      {/* Main layout container */}
      <div className="container admin-container">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar" style={{ minHeight: '80vh' }}>
          <button className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`sidebar-link ${activeTab === 'products' || activeTab === 'product-form' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={18} /> Products CRUD
          </button>
          <button className={`sidebar-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            <AlertTriangle size={18} /> Inventory Stock
          </button>
          <button className={`sidebar-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <FolderKanban size={18} /> Categories CRUD
          </button>
          <button className={`sidebar-link ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}>
            <Image size={18} /> Hero Banners
          </button>
          <button className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <ShoppingCart size={18} /> Customer Orders
          </button>
          <button className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Store Config
          </button>
        </aside>

        {/* Contents */}
        <main className="admin-main">
          {activeTab === 'dashboard' && (
            <div>
              <div className="admin-header">
                <h2>Business Dashboard</h2>
              </div>

              {/* KPIs strip */}
              <div className="kpis-grid">
                <div className="glass-card kpi-card" style={{ borderLeft: '4px solid #10b981' }}>
                  <span className="kpi-title">Total Revenue (COD)</span>
                  <span className="kpi-value" style={{ color: '#10b981' }}>₹{kpis.totalSales}</span>
                </div>
                <div className="glass-card kpi-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                  <span className="kpi-title">Customer Orders</span>
                  <span className="kpi-value">{kpis.totalOrders}</span>
                </div>
                <div className="glass-card kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <span className="kpi-title">Low Stock Items</span>
                  <span className="kpi-value" style={{ color: kpis.lowStockCount > 0 ? '#f59e0b' : 'inherit' }}>{kpis.lowStockCount}</span>
                </div>
                <div className="glass-card kpi-card" style={{ borderLeft: '4px solid #ef4444' }}>
                  <span className="kpi-title">Out of Stock</span>
                  <span className="kpi-value" style={{ color: kpis.outOfStockCount > 0 ? '#ef4444' : 'inherit' }}>{kpis.outOfStockCount}</span>
                </div>
              </div>

              {/* MOCK SVG CHART WIDGET */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BarChart2 size={16} /> Sales Performance by Category</h3>
                    <span className="reviews-count">Last 30 Days</span>
                  </div>
                  
                  <div className="mock-chart-svg">
                    <div className="mock-chart-bar" style={{ height: '70%' }} data-label="Apparel"></div>
                    <div className="mock-chart-bar" style={{ height: '45%' }} data-label="Cases"></div>
                    <div className="mock-chart-bar" style={{ height: '90%' }} data-label="Chargers"></div>
                    <div className="mock-chart-bar" style={{ height: '25%' }} data-label="Audio"></div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <h3 style={{ marginBottom: '1rem' }}>Recent Orders pipeline</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items Count</th>
                      <th>Total Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.customer.name} ({o.customer.phone})</td>
                        <td>{o.items.length} items</td>
                        <td>₹{o.total}</td>
                        <td>
                          <span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="admin-header">
                <h2>Products Catalog</h2>
                <button className="btn btn-primary" onClick={() => { resetProductForm(); setActiveTab('product-form'); }}>
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Info</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Active Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="table-product-cell">
                            <img src={p.image} alt={p.name} className="table-img" />
                            <div>
                              <strong>{p.name}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brand: {p.brand || 'Magnet'}</div>
                            </div>
                          </div>
                        </td>
                        <td>{p.sku}</td>
                        <td>{categories.find(c => c.id === p.category)?.name || p.category}</td>
                        <td>
                          <strong>₹{p.discountPrice || p.price}</strong>
                          {p.discountPrice && <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{p.price}</div>}
                        </td>
                        <td>
                          <span className={`status-badge ${p.active ? 'active' : 'inactive'}`}>
                            {p.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn-icon" onClick={() => handleEditProduct(p)} title="Edit">
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn-icon" 
                              onClick={() => updateProduct(p.id, { active: !p.active })}
                              title={p.active ? 'Disable' : 'Enable'}
                            >
                              {p.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            </button>
                            <button 
                              className="btn-icon danger" 
                              onClick={() => { if (window.confirm('Delete product permanently?')) deleteProduct(p.id); }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'product-form' && (
            <div className="glass-card admin-form-container">
              <h2>{editingProduct ? 'Update Product' : 'Create Product'}</h2>
              
              <form onSubmit={handleProductSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input 
                      type="text" required className="form-input" value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brand Name</label>
                    <input 
                      type="text" className="form-input" value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="e.g. Magnet Wear"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SKU *</label>
                    <input 
                      type="text" required className="form-input" value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-input" value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value, variants: [] })}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Base Price (₹) *</label>
                    <input 
                      type="number" required className="form-input" value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discount Price (₹)</label>
                    <input 
                      type="number" className="form-input" value={productForm.discountPrice}
                      onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label className="form-label">Product Image</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="text" 
                        placeholder="Image Path or URL" 
                        className="form-input" 
                        style={{ flex: 1 }}
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      />
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="product-image-file" 
                          style={{ display: 'none' }} 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProductForm(prev => ({ ...prev, image: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="product-image-file" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                          <Image size={15} /> Upload File
                        </label>
                      </div>
                    </div>
                    {productForm.image && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preview:</span>
                        <img 
                          src={productForm.image} 
                          alt="Preview" 
                          style={{ display: 'block', maxWidth: '120px', maxHeight: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '0.25rem' }} 
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group full">
                    <label className="form-label">Product Description</label>
                    <textarea 
                      className="form-input" style={{ minHeight: '80px' }} value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Variant Builder */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <label className="form-label">Variants & Stock Options</label>
                  <div className="variant-builder">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', alignItems: 'end' }}>
                      {productForm.category === 'clothing' ? (
                        <>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Size</label>
                            <input type="text" className="form-input" value={tempVariant.size} onChange={(e) => setTempVariant({ ...tempVariant, size: e.target.value })} placeholder="e.g. L" />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Color</label>
                            <input type="text" className="form-input" value={tempVariant.color} onChange={(e) => setTempVariant({ ...tempVariant, color: e.target.value })} placeholder="e.g. Navy" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Compatible Model</label>
                            <input type="text" className="form-input" value={tempVariant.compatibleModel} onChange={(e) => setTempVariant({ ...tempVariant, compatibleModel: e.target.value })} placeholder="iPhone 15" />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Specification</label>
                            <input type="text" className="form-input" value={tempVariant.specification} onChange={(e) => setTempVariant({ ...tempVariant, specification: e.target.value })} placeholder="2m" />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Color</label>
                            <input type="text" className="form-input" value={tempVariant.color} onChange={(e) => setTempVariant({ ...tempVariant, color: e.target.value })} placeholder="Space Grey" />
                          </div>
                        </>
                      )}
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Stock *</label>
                        <input type="number" className="form-input" value={tempVariant.stock} onChange={(e) => setTempVariant({ ...tempVariant, stock: e.target.value })} />
                      </div>
                      <button type="button" className="btn btn-secondary" style={{ height: '2.5rem' }} onClick={handleAddVariant}>Add</button>
                    </div>

                    {productForm.variants.map((v) => (
                      <div key={v.id} className="variant-row" style={{ justifyContent: 'space-between', padding: '0.4rem 0.8rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.85rem' }}>
                          {productForm.category === 'clothing' ? `Size: ${v.size || 'N/A'} | Color: ${v.color || 'N/A'}` : `${v.compatibleModel || ''} ${v.specification || ''} ${v.color || ''}`} — Stock: <strong>{v.stock}</strong>
                        </span>
                        <button type="button" className="btn-icon danger" style={{ width: '1.75rem', height: '1.75rem' }} onClick={() => handleRemoveVariant(v.id)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs Builder */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <label className="form-label">Technical Specifications</label>
                  <div className="variant-builder">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Spec Name</label>
                        <input type="text" className="form-input" value={tempSpec.key} onChange={(e) => setTempSpec({ ...tempSpec, key: e.target.value })} placeholder="e.g. Material" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Spec Value</label>
                        <input type="text" className="form-input" value={tempSpec.value} onChange={(e) => setTempSpec({ ...tempSpec, value: e.target.value })} placeholder="e.g. Combed Cotton" />
                      </div>
                      <button type="button" className="btn btn-secondary" style={{ height: '2.5rem' }} onClick={handleAddSpec}>Add Spec</button>
                    </div>

                    {(productForm.specifications || []).map((s, idx) => (
                      <div key={idx} className="variant-row" style={{ justifyContent: 'space-between', padding: '0.4rem 0.8rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '0.85rem' }}>
                          <strong>{s.key}</strong>: {s.value}
                        </span>
                        <button type="button" className="btn-icon danger" style={{ width: '1.75rem', height: '1.75rem' }} onClick={() => handleRemoveSpec(idx)}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={resetProductForm}>Cancel</button>
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Save Product</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              <div className="admin-header">
                <h2>Inventory stock Management</h2>
                
                <div className="filter-selects">
                  <button className={`category-pill ${invFilter === 'all' ? 'active' : ''}`} onClick={() => setInvFilter('all')}>All ({products.flatMap(p => p.variants).length})</button>
                  <button className={`category-pill ${invFilter === 'low' ? 'active' : ''}`} onClick={() => setInvFilter('low')}>Low Stock ({products.flatMap(p => p.variants).filter(v => v.stock > 0 && v.stock <= 3).length})</button>
                  <button className={`category-pill ${invFilter === 'out' ? 'active' : ''}`} onClick={() => setInvFilter('out')}>Out of Stock ({products.flatMap(p => p.variants).filter(v => v.stock === 0).length})</button>
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Item</th>
                      <th>Variant Code (SKU)</th>
                      <th>Details</th>
                      <th>Stock Qty</th>
                      <th>Quick Adjust</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.prodName}</strong></td>
                        <td><code>{item.sku}</code></td>
                        <td>{item.details}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: item.stock === 0 ? '#ef4444' : item.stock <= 3 ? '#f59e0b' : 'inherit' }}>
                            {item.stock} available
                          </span>
                        </td>
                        <td>
                          <input 
                            type="number" 
                            className="form-input" 
                            style={{ width: '80px', padding: '0.3rem', textAlign: 'center' }} 
                            defaultValue={item.stock}
                            onBlur={(e) => handleStockAdjust(item.prodId, item.varId, e.target.value)}
                          />
                        </td>
                        <td>
                          <span className={`status-badge ${item.stock === 0 ? 'cancelled' : item.stock <= 3 ? 'pending' : 'confirmed'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div style={{ maxWidth: '600px' }}>
              <div className="admin-header">
                <h2>Manage Categories</h2>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Create Category</h4>
                <form onSubmit={handleAddCategorySubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text" required className="form-input"
                      value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Category Name (e.g. Charging Adapters)"
                    />
                    <input
                      type="text" className="form-input"
                      value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Category Description details..."
                    />
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                      Create Category
                    </button>
                  </div>
                </form>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Slug</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.description}</div>
                        </td>
                        <td>{c.slug}</td>
                        <td>
                          <span className={`status-badge ${c.active ? 'active' : 'inactive'}`}>
                            {c.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button 
                              className="btn-icon" 
                              onClick={() => updateCategory(c.id, { active: !c.active })}
                            >
                              {c.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            </button>
                            {c.id !== 'clothing' && c.id !== 'accessories' && (
                              <button className="btn-icon danger" onClick={() => deleteCategory(c.id)}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div>
              <div className="admin-header">
                <h2>Manage Promotion Banners</h2>
                <button className="btn btn-primary" onClick={() => { resetBannerForm(); setBannerFormOpen(true); }}>
                  <Plus size={16} /> Add Banner
                </button>
              </div>

              {bannerFormOpen && (
                <div className="glass-card admin-form-container" style={{ marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '1rem' }}>{editingBanner ? 'Update Banner' : 'Create Banner'}</h4>
                  <form onSubmit={handleBannerSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Banner Title *</label>
                        <input type="text" required className="form-input" value={bannerForm.heading} onChange={(e) => setBannerForm({ ...bannerForm, heading: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Subtitle Description *</label>
                        <input type="text" required className="form-input" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CTA Link URL</label>
                        <input type="text" className="form-input" value={bannerForm.ctaUrl} onChange={(e) => setBannerForm({ ...bannerForm, ctaUrl: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CTA Text</label>
                        <input type="text" className="form-input" value={bannerForm.ctaText} onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })} />
                      </div>
                      <div className="form-group full">
                        <label className="form-label">Banner Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input 
                            type="text" 
                            placeholder="Image Path or URL" 
                            className="form-input" 
                            style={{ flex: 1 }}
                            value={bannerForm.image}
                            onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                          />
                          <div style={{ position: 'relative' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="banner-image-file" 
                              style={{ display: 'none' }} 
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setBannerForm(prev => ({ ...prev, image: reader.result }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label htmlFor="banner-image-file" className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                              <Image size={15} /> Upload File
                            </label>
                          </div>
                        </div>
                        {bannerForm.image && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preview:</span>
                            <img 
                              src={bannerForm.image} 
                              alt="Preview" 
                              style={{ display: 'block', maxWidth: '240px', maxHeight: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '0.25rem' }} 
                            />
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-input" value={bannerForm.startDate} onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input type="date" className="form-input" value={bannerForm.endDate} onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-secondary" onClick={resetBannerForm}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Banner</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Banner Title</th>
                      <th>Subtitle Details</th>
                      <th>Schedule dates</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map(b => (
                      <tr key={b.id}>
                        <td>
                          <div className="table-product-cell">
                            <img src={b.image} alt={b.heading} className="table-img" />
                            <strong>{b.heading}</strong>
                          </div>
                        </td>
                        <td>{b.subtitle}</td>
                        <td>
                          <div style={{ fontSize: '0.8rem' }}>
                            <Calendar size={12} style={{ display: 'inline', marginRight: '2px' }} />
                            {b.startDate || 'Immediate'} to {b.endDate || 'No limit'}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${b.active ? 'active' : 'inactive'}`}>
                            {b.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn-icon" onClick={() => handleEditBanner(b)}><Edit size={14} /></button>
                            <button className="btn-icon" onClick={() => updateBanner(b.id, { active: !b.active })}>{b.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}</button>
                            <button className="btn-icon danger" onClick={() => deleteBanner(b.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="admin-header">
                <h2>Customer Orders Management</h2>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer info</th>
                      <th>Items Ordered</th>
                      <th>Amount</th>
                      <th>Progress Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td>
                          <strong>{o.id}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {new Date(o.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <strong>{o.customer.name}</strong><br />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            📞 {o.customer.phone}<br />
                            📍 {o.customer.address}, {o.customer.city} ({o.customer.pincode})
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {o.items.map((item, idx) => (
                              <span key={idx} style={{ fontSize: '0.85rem' }}>
                                • {item.name} x {item.quantity} ({Object.entries(item.variant)
                                  .filter(([k]) => k !== 'id' && k !== 'stock')
                                  .map(([k, v]) => `${k.charAt(0).toUpperCase()}: ${v}`).join(', ')})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <strong>₹{o.total}</strong><br />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COD</span>
                        </td>
                        <td>
                          <select
                            className="filter-select"
                            style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Returned">Returned</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card admin-form-container">
              <h2>Store Configurations</h2>
              
              <form onSubmit={handleSettingsSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Store Brand Name</label>
                    <input type="text" name="storeName" className="form-input" defaultValue={settings.storeName} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Support WhatsApp Number</label>
                    <input type="text" name="whatsappNumber" className="form-input" defaultValue={settings.whatsappNumber} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notification Email</label>
                    <input type="email" name="email" className="form-input" defaultValue={settings.email} />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Announcement Text</label>
                    <input type="text" name="announcement" className="form-input" defaultValue={settings.announcement} />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Physical Address</label>
                    <textarea name="address" className="form-input" style={{ minHeight: '60px' }} defaultValue={settings.address} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary">Save Config</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
