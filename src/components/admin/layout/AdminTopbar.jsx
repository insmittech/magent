import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, Moon, Sun, Menu, ChevronDown, 
  ExternalLink, Settings as SettingsIcon, LogOut, ShieldCheck, ShieldAlert, Sparkles 
} from 'lucide-react';

export const AdminTopbar = ({ 
  activeTab, 
  onOpenMobileMenu, 
  onOpenPalette, 
  onOpenNotifications, 
  notificationCount = 0,
  adminRole = 'admin',
  onExitAdmin,
  onNavigate 
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileRef = useRef(null);
  const isSuper = adminRole === 'super_admin';

  // Check initial dark mode from body class
  useEffect(() => {
    setIsDarkMode(document.body.classList.contains('dark-mode'));
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles = {
    'super-admin': 'Super Admin Master Controls',
    dashboard: 'Overview',
    orders: 'Customer Orders',
    products: 'Product Catalog',
    'product-form': 'Product Editor',
    categories: 'Categories',
    inventory: 'Inventory Stock',
    customers: 'Customers',
    analytics: 'Analytics',
    reviews: 'Reviews Moderation',
    marketing: 'Marketing & Banners',
    settings: 'Store Configurations'
  };

  return (
    <header className="adm-topbar">
      <div className="adm-topbar-left">
        <button type="button" className="adm-mobile-menu-btn" onClick={onOpenMobileMenu} aria-label="Open navigation menu">
          <Menu size={20} />
        </button>

        <div className="adm-breadcrumbs">
          <span>{isSuper ? 'Super Admin' : 'Admin'}</span>
          <span>/</span>
          <span className="adm-breadcrumb-active">{pageTitles[activeTab] || 'Overview'}</span>
        </div>
      </div>

      <button type="button" className="adm-search-trigger" onClick={onOpenPalette}>
        <Search size={15} />
        <span>Search anything...</span>
        <kbd className="adm-kbd">⌘K</kbd>
      </button>

      <div className="adm-topbar-right">
        <div className="adm-status-badge" title="Store is actively accepting customer orders">
          <span className="adm-status-dot"></span>
          <span>Store Online</span>
        </div>

        <button 
          type="button" 
          className="adm-topbar-icon-btn" 
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button 
          type="button" 
          className="adm-topbar-icon-btn" 
          onClick={onOpenNotifications}
          title="Open Notifications & Alerts"
        >
          <Bell size={16} />
          {notificationCount > 0 && <span className="adm-unread-indicator"></span>}
        </button>

        {/* Profile Dropdown */}
        <div className="adm-profile-container" ref={profileRef}>
          <button 
            type="button" 
            className="adm-profile-btn" 
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            style={{
              borderColor: isSuper ? 'rgba(245, 158, 11, 0.4)' : undefined,
              background: isSuper ? 'rgba(245, 158, 11, 0.08)' : undefined
            }}
          >
            <div className="adm-avatar" style={{ background: isSuper ? '#f59e0b' : undefined }}>
              {isSuper ? '👑' : 'M'}
            </div>
            <span className="adm-profile-name" style={{ color: isSuper ? '#d97706' : undefined, fontWeight: 800 }}>
              {isSuper ? 'Super Admin' : 'Admin Staff'}
            </span>
            <ChevronDown size={14} color="var(--adm-text-muted)" />
          </button>

          {profileOpen && (
            <div className="adm-profile-dropdown">
              <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--adm-border)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isSuper ? '#d97706' : 'inherit' }}>
                  {isSuper ? '👑 Master Super Admin' : 'Store Administrator'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>
                  {isSuper ? 'superadmin@magnet.com' : 'admin@magnet.com'}
                </div>
              </div>

              {isSuper && (
                <button 
                  type="button" 
                  className="adm-dropdown-item" 
                  style={{ color: '#d97706', fontWeight: 700 }}
                  onClick={() => {
                    onNavigate('super-admin');
                    setProfileOpen(false);
                  }}
                >
                  <ShieldAlert size={14} /> Super Admin Controls
                </button>
              )}

              <button 
                type="button" 
                className="adm-dropdown-item" 
                onClick={() => {
                  onNavigate('settings');
                  setProfileOpen(false);
                }}
              >
                <SettingsIcon size={14} /> Store Settings
              </button>

              <button 
                type="button" 
                className="adm-dropdown-item" 
                onClick={() => {
                  onExitAdmin();
                  setProfileOpen(false);
                }}
              >
                <ExternalLink size={14} /> View Storefront
              </button>

              <div className="adm-dropdown-divider"></div>

              <button 
                type="button" 
                className="adm-dropdown-item danger" 
                onClick={() => {
                  onExitAdmin();
                  setProfileOpen(false);
                }}
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
