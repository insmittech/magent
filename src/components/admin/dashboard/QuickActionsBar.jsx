import React from 'react';
import { Plus, FolderPlus, Sliders, ShoppingBag, Image, Zap } from 'lucide-react';

export const QuickActionsBar = ({ onNavigate }) => {
  const actions = [
    { label: 'Add Product', icon: Plus, action: () => onNavigate('product-form') },
    { label: 'Create Category', icon: FolderPlus, action: () => onNavigate('categories') },
    { label: 'Adjust Inventory', icon: Sliders, action: () => onNavigate('inventory') },
    { label: 'Process Orders', icon: ShoppingBag, action: () => onNavigate('orders') },
    { label: 'Hero Banners', icon: Image, action: () => onNavigate('marketing') },
  ];

  return (
    <div className="adm-card" style={{ marginBottom: '1.5rem' }}>
      <div className="adm-card-header" style={{ marginBottom: '0.75rem' }}>
        <h2 className="adm-card-title" style={{ fontSize: '0.85rem', color: 'var(--adm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Zap size={14} color="var(--adm-primary)" />
          <span>Quick Commerce Actions</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              type="button"
              className="adm-btn adm-btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
              onClick={act.action}
            >
              <Icon size={16} color="var(--adm-primary)" />
              <span style={{ fontSize: '0.8rem' }}>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
