import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, Moon, Sun, Menu, ChevronDown, 
  ExternalLink, Settings as SettingsIcon, LogOut, ShieldCheck 
} from 'lucide-react';

export const AdminTopbar = ({ 
  activeTab, 
  onOpenMobileMenu, 
  onOpenPalette, 
  onOpenNotifications, 
  notificationCount = 0,
  onExitAdmin,
  onNavigate 
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileRef = useRef(null);

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
          <span>Admin</span>
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
          >
            <div className="adm-avatar">M</div>
            <span className="adm-profile-name">Admin</span>
            <ChevronDown size={14} color="var(--adm-text-muted)" />
          </button>

          {profileOpen && (
            <div className="adm-profile-dropdown">
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--adm-border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Store Administrator</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>admin@magnetvapi.com</div>
              </div>

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
