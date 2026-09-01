import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const LowStockWidget = ({ products = [], onOpenInventory, onAdjustStock }) => {
  const lowItems = [];

  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock <= 3) {
        lowItems.push({
          prodId: p.id,
          varId: v.id,
          name: p.name,
          image: p.image,
          sku: `${p.sku}-${v.size || v.compatibleModel || 'VAR'}`,
          variantName: v.size ? `Size: ${v.size}, ${v.color || ''}` : `${v.compatibleModel || ''} ${v.color || ''}`,
          stock: v.stock,
          status: v.stock === 0 ? 'Critical (Out)' : 'Low Stock'
        });
      }
    });
  });

  const displayItems = lowItems.slice(0, 4);

  return (
    <div className="adm-card" style={{ marginBottom: '1.5rem' }}>
      <div className="adm-card-header">
        <h2 className="adm-card-title" style={{ fontSize: '0.95rem' }}>
          <AlertTriangle size={16} color="var(--adm-warning)" />
          <span>Inventory Attention</span>
        </h2>
        <button 
          type="button" 
          className="adm-btn adm-btn-secondary adm-btn-sm" 
          onClick={onOpenInventory}
        >
          View Full Stock ({lowItems.length}) <ArrowRight size={14} />
        </button>
      </div>

      {displayItems.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--adm-text-muted)', fontSize: '0.85rem' }}>
          ✓ All catalog variants are currently healthy with ample inventory.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayItems.map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem', 
                backgroundColor: 'var(--adm-bg)', 
                borderRadius: 'var(--adm-radius-sm)',
                border: '1px solid var(--adm-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={item.image} alt={item.name} className="adm-prod-thumb" style={{ width: '32px', height: '32px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>
                    <code>{item.sku}</code> • {item.variantName}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span className={`adm-badge ${item.stock === 0 ? 'out' : 'low'}`}>
                  {item.stock} left
                </span>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary adm-btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => onAdjustStock(item.prodId, item.varId, item.stock, item.name)}
                >
                  Restock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
