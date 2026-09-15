import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './admin.css';

import { AdminLayout } from './layout/AdminLayout';
import { OverviewDashboard } from './dashboard/OverviewDashboard';
import { ProductsPage } from './products/ProductsPage';
import { ProductEditor } from './products/ProductEditor';
import { OrdersPage } from './orders/OrdersPage';
import { InventoryPage } from './inventory/InventoryPage';
import { CustomersPage } from './customers/CustomersPage';
import { CategoriesPage } from './categories/CategoriesPage';
import { MarketingPage } from './marketing/MarketingPage';
import { AnalyticsPage } from './analytics/AnalyticsPage';
import { ReviewsPage } from './reviews/ReviewsPage';
import { SettingsPage } from './settings/SettingsPage';

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
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const kpis = getKPIs ? getKPIs() : {
    totalSales: 0,
    totalOrders: orders.length,
    lowStockCount: 0,
    outOfStockCount: 0,
    customersCount: 1
  };

  // Tab Navigation Coordinator
  const handleNavigate = (tabId, params = {}) => {
    if (tabId === 'product-form') {
      if (params.product) {
        setEditingProduct(params.product);
      } else {
        setEditingProduct(null);
      }
    }
    if (params.selectedOrder) {
      setSelectedOrderId(params.selectedOrder);
    }
    setActiveTab(tabId);
  };

  // Product Actions
  const handleSaveProduct = (payload) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast(`Product "${payload.name}" updated successfully!`, 'success');
    } else {
      addProduct(payload);
      showToast(`Product "${payload.name}" added to catalog!`, 'success');
    }
    setEditingProduct(null);
    setActiveTab('products');
  };

  const handleToggleProductActive = (id, active) => {
    updateProduct(id, { active });
    const prod = products.find(p => p.id === id);
    showToast(`"${prod?.name || 'Product'}" is now ${active ? 'Active' : 'Disabled'}.`, 'info');
  };

  const handleDeleteProduct = (id) => {
    const prod = products.find(p => p.id === id);
    deleteProduct(id);
    showToast(`"${prod?.name || 'Product'}" deleted permanently.`, 'error');
  };

  // Inventory Variant Stock Adjustments
  const handleUpdateVariantStock = (prodId, varId, newQty, reason) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    const updatedVariants = prod.variants.map(v => 
      v.id === varId ? { ...v, stock: parseInt(newQty) || 0 } : v
    );

    updateProduct(prodId, { variants: updatedVariants });
    showToast(`Stock updated to ${newQty} units (${reason})`, 'success');
  };

  // Orders Actions
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
  };

  // Category Actions
  const handleAddCategory = (catData) => {
    addCategory(catData);
    showToast(`Category "${catData.name}" created!`, 'success');
  };

  const handleUpdateCategory = (catId, catData) => {
    updateCategory(catId, catData);
    showToast(`Category updated successfully!`, 'success');
  };

  const handleDeleteCategory = (catId) => {
    deleteCategory(catId);
    showToast(`Category removed.`, 'error');
  };

  // Banner Actions
  const handleAddBanner = (bannerData) => {
    addBanner(bannerData);
    showToast(`Hero banner added!`, 'success');
  };

  const handleUpdateBanner = (bannerId, bannerData) => {
    updateBanner(bannerId, bannerData);
    showToast(`Hero banner updated!`, 'success');
  };

  const handleDeleteBanner = (bannerId) => {
    deleteBanner(bannerId);
    showToast(`Hero banner removed.`, 'error');
  };

  // Settings Action
  const handleSaveSettings = (updatedSettings) => {
    setSettings(prev => ({ ...prev, ...updatedSettings }));
    showToast(`Store configuration saved!`, 'success');
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={handleNavigate}
      products={products}
      orders={orders}
      categories={categories}
      toasts={toasts}
      onDismissToast={handleDismissToast}
      onExitAdmin={() => setIsAdmin(false)}
      lowStockCount={(kpis.lowStockCount || 0) + (kpis.outOfStockCount || 0)}
    >
      {/* 1. Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <OverviewDashboard
          kpis={kpis}
          products={products}
          orders={orders}
          onNavigate={handleNavigate}
          onSelectOrder={(id) => handleNavigate('orders', { selectedOrder: id })}
          onAdjustStock={(prodId, varId, currentStock, name) => {
            handleNavigate('inventory');
          }}
        />
      )}

      {/* 2. Products Catalog */}
      {activeTab === 'products' && (
        <ProductsPage
          products={products}
          categories={categories}
          onAddNew={() => handleNavigate('product-form')}
          onEditProduct={(p) => handleNavigate('product-form', { product: p })}
          onToggleActive={handleToggleProductActive}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* 3. Product Editor (Create / Update) */}
      {activeTab === 'product-form' && (
        <ProductEditor
          initialProduct={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onCancel={() => {
            setEditingProduct(null);
            setActiveTab('products');
          }}
        />
      )}

      {/* 4. Inventory Stock */}
      {activeTab === 'inventory' && (
        <InventoryPage
          products={products}
          onUpdateVariantStock={handleUpdateVariantStock}
        />
      )}

      {/* 5. Orders Pipeline */}
      {activeTab === 'orders' && (
        <OrdersPage
          orders={orders}
          onUpdateStatus={handleUpdateOrderStatus}
          initialSelectedId={selectedOrderId}
        />
      )}

      {/* 6. Customers Directory */}
      {activeTab === 'customers' && (
        <CustomersPage
          orders={orders}
        />
      )}

      {/* 7. Categories Management */}
      {activeTab === 'categories' && (
        <CategoriesPage
          categories={categories}
          products={products}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {/* 8. Marketing & Banners */}
      {(activeTab === 'marketing' || activeTab === 'banners') && (
        <MarketingPage
          banners={banners}
          onAddBanner={handleAddBanner}
          onUpdateBanner={handleUpdateBanner}
          onDeleteBanner={handleDeleteBanner}
        />
      )}

      {/* 9. Analytics */}
      {activeTab === 'analytics' && (
        <AnalyticsPage
          products={products}
          orders={orders}
        />
      )}

      {/* 10. Reviews Moderation */}
      {activeTab === 'reviews' && (
        <ReviewsPage
          products={products}
        />
      )}

      {/* 11. Settings & Configurations */}
      {activeTab === 'settings' && (
        <SettingsPage
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onNotify={(msg) => showToast(msg, 'success')}
        />
      )}
    </AdminLayout>
  );
};
