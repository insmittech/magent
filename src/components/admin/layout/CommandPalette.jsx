import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, LayoutDashboard, ShoppingCart, Package, Plus, 
  AlertTriangle, FolderKanban, Users, BarChart3, Star, 
  Tag, Settings, ArrowRight, CornerDownLeft
} from 'lucide-react';

export const CommandPalette = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  products = [], 
  orders = [], 
  categories = [] 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Base navigation pages
  const baseActions = [
    { id: 'nav-dashboard', title: 'Dashboard Overview', group: 'Navigation', icon: LayoutDashboard, action: () => onNavigate('dashboard') },
    { id: 'nav-orders', title: 'Customer Orders', group: 'Navigation', icon: ShoppingCart, action: () => onNavigate('orders') },
    { id: 'nav-products', title: 'Product Catalog', group: 'Navigation', icon: Package, action: () => onNavigate('products') },
    { id: 'nav-new-prod', title: 'Create New Product', group: 'Actions', icon: Plus, action: () => onNavigate('product-form') },
    { id: 'nav-inventory', title: 'Inventory Stock', group: 'Navigation', icon: AlertTriangle, action: () => onNavigate('inventory') },
    { id: 'nav-categories', title: 'Categories Management', group: 'Navigation', icon: FolderKanban, action: () => onNavigate('categories') },
    { id: 'nav-customers', title: 'Customers Directory', group: 'Navigation', icon: Users, action: () => onNavigate('customers') },
    { id: 'nav-analytics', title: 'Analytics & Revenue', group: 'Navigation', icon: BarChart3, action: () => onNavigate('analytics') },
    { id: 'nav-reviews', title: 'Reviews Moderation', group: 'Navigation', icon: Star, action: () => onNavigate('reviews') },
    { id: 'nav-marketing', title: 'Marketing & Banners', group: 'Navigation', icon: Tag, action: () => onNavigate('marketing') },
    { id: 'nav-settings', title: 'Store Settings', group: 'Navigation', icon: Settings, action: () => onNavigate('settings') },
  ];

  // Dynamic product matches
  const productMatches = products
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4)
    .map(p => ({
      id: `prod-${p.id}`,
      title: p.name,
      meta: `SKU: ${p.sku} • ₹${p.discountPrice || p.price}`,
      group: 'Products',
      icon: Package,
      action: () => {
        onNavigate('products', { search: p.name });
      }
    }));

  // Dynamic order matches
  const orderMatches = orders
    .filter(o => o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.name.toLowerCase().includes(query.toLowerCase()) || o.customer.phone.includes(query))
    .slice(0, 3)
    .map(o => ({
      id: `order-${o.id}`,
      title: `Order ${o.id} — ${o.customer.name}`,
      meta: `₹${o.total} • ${o.status}`,
      group: 'Orders',
      icon: ShoppingCart,
      action: () => {
        onNavigate('orders', { selectedOrder: o.id });
      }
    }));

  const filteredItems = query.trim() === ''
    ? baseActions
    : [
        ...baseActions.filter(a => a.title.toLowerCase().includes(query.toLowerCase())),
        ...productMatches,
        ...orderMatches
      ];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    }
  };

  return (
    <div className="adm-palette-overlay" onClick={onClose}>
      <div className="adm-palette-modal" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="adm-palette-search-row">
          <Search size={18} color="var(--adm-text-muted)" />
          <input
            ref={inputRef}
            type="text"
            className="adm-palette-search-input"
            placeholder="Search commands, products, orders, customers..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button type="button" className="adm-kbd" onClick={onClose}>ESC</button>
        </div>

        <div className="adm-palette-results">
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--adm-text-muted)', fontSize: '0.85rem' }}>
              No results matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon || ArrowRight;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`adm-palette-item ${isSelected ? 'focused' : ''}`}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <Icon size={16} color="var(--adm-text-sub)" />
                  <span>{item.title}</span>
                  {item.meta && <span className="adm-palette-item-meta">{item.meta}</span>}
                  {isSelected && <CornerDownLeft size={14} color="var(--adm-text-muted)" style={{ marginLeft: 'auto' }} />}
                </button>
              );
            })
          )}
        </div>

        <div className="adm-palette-footer">
          <span><kbd className="adm-kbd">↑↓</kbd> Navigate</span>
          <span><kbd className="adm-kbd">↵</kbd> Select</span>
          <span><kbd className="adm-kbd">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};
