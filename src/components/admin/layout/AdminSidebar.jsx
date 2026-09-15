import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, FolderKanban, 
  AlertTriangle, Users, BarChart3, Star, Tag, Settings, 
  ChevronLeft, ChevronRight, Store, Home
} from 'lucide-react';

export const AdminSidebar = ({ 
  activeTab, 
  onSelectTab, 
  isCollapsed, 
  onToggleCollapse, 
  isMobileOpen, 
  onCloseMobile,
  ordersCount = 0,
  lowStockCount = 0,
  onExitAdmin 
}) => {
  const navGroups = [
    {
      group: 'STORE',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: ordersCount > 0 ? ordersCount : null },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'categories', label: 'Categories', icon: FolderKanban },
        { id: 'inventory', label: 'Inventory', icon: AlertTriangle, badge: lowStockCount > 0 ? lowStockCount : null, badgeWarning: true },
      ]
    },
    {
      group: 'CUSTOMERS',
      items: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'reviews', label: 'Reviews', icon: Star },
      ]
    },
    {
      group: 'GROWTH',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'marketing', label: 'Marketing & Banners', icon: Tag },
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`adm-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="adm-sidebar-header">
        <a href="#admin" className="adm-brand-link" onClick={(e) => { e.preventDefault(); onSelectTab('dashboard'); }}>
          <img src="/logo.jpg" alt="Magnet Logo" className="adm-brand-logo" />
          {!isCollapsed && (
            <div className="adm-brand-text">
              <span className="adm-brand-title">
                Magnet<span style={{ color: 'var(--adm-primary)' }}>.</span>
                <span className="adm-tag">ADMIN</span>
              </span>
              <span className="adm-brand-sub">Vapi Official</span>
            </div>
          )}
        </a>

        <button 
          type="button" 
          className="adm-sidebar-collapse-btn" 
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="adm-sidebar-nav">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="adm-nav-group">
            <span className="adm-nav-group-title">{group.group}</span>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'products' && activeTab === 'product-form');
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`adm-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={18} className="adm-nav-icon" />
                  <span className="adm-nav-label">{item.label}</span>
                  {item.badge && !isCollapsed && (
                    <span className={`adm-nav-badge ${item.badgeWarning ? 'warning' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="adm-sidebar-footer">
        <button 
          type="button" 
          className="adm-storefront-btn" 
          onClick={onExitAdmin}
          title="Return to Customer Storefront"
        >
          <Home size={16} />
          {!isCollapsed && <span>View Storefront</span>}
        </button>
      </div>
    </aside>
  );
};
