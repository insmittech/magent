import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { CommandPalette } from './CommandPalette';
import { NotificationDrawer } from './NotificationDrawer';
import { ToastContainer } from './ToastContainer';

export const AdminLayout = ({ 
  children, 
  activeTab, 
  onSelectTab, 
  products = [], 
  orders = [], 
  categories = [], 
  toasts = [], 
  onDismissToast,
  onExitAdmin,
  lowStockCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('magnet_adm_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('magnet_adm_collapsed', String(next));
      } catch (err) {
        console.warn('Storage error:', err);
      }
      return next;
    });
  };

  // Keyboard Shortcuts: ⌘K, N, O, I, Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = e.target.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      } else if (!isInput) {
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          onSelectTab('product-form');
        } else if (e.key.toLowerCase() === 'o') {
          e.preventDefault();
          onSelectTab('orders');
        } else if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          onSelectTab('inventory');
        } else if (e.key === 'Escape') {
          setIsPaletteOpen(false);
          setIsNotificationsOpen(false);
          setIsMobileOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTab]);

  return (
    <div className={`adm-shell ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        ordersCount={orders.length}
        lowStockCount={lowStockCount}
        onExitAdmin={onExitAdmin}
      />

      <div className="adm-main-wrapper">
        <AdminTopbar
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenPalette={() => setIsPaletteOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          notificationCount={lowStockCount + orders.filter(o => o.status === 'Pending').length}
          onExitAdmin={onExitAdmin}
          onNavigate={onSelectTab}
        />

        <main className="adm-content-area">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onNavigate={onSelectTab}
        products={products}
        orders={orders}
        categories={categories}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        products={products}
        orders={orders}
        onNavigate={onSelectTab}
      />

      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
};
