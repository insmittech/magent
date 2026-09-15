import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';

export const OrderTimeline = ({ status = 'Pending', createdAt }) => {
  const steps = [
    { key: 'Pending', label: 'Order Placed', icon: Clock },
    { key: 'Confirmed', label: 'Order Confirmed', icon: Check },
    { key: 'Packed', label: 'Packed & Ready', icon: Package },
    { key: 'Shipped', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered to Customer', icon: CheckCircle2 }
  ];

  if (status === 'Cancelled' || status === 'Returned' || status === 'Refunded') {
    return (
      <div style={{ padding: '0.75rem', backgroundColor: 'var(--adm-danger-soft)', borderRadius: 'var(--adm-radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--adm-danger)', fontSize: '0.85rem', fontWeight: 700 }}>
        <XCircle size={18} />
        <span>Order was {status}</span>
      </div>
    );
  }

  const currentIdx = steps.findIndex(s => s.key === status);

  return (
    <div className="adm-order-timeline">
      {steps.map((step, idx) => {
        const isCompleted = currentIdx >= idx;
        const isCurrent = currentIdx === idx;
        const StepIcon = step.icon;

        return (
          <div 
            key={step.key} 
            className={`adm-timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
          >
            <div className="adm-timeline-dot"></div>
            <div className="adm-timeline-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>{step.label}</span>
              {isCurrent && <span className="adm-tag" style={{ fontSize: '0.6rem' }}>Current</span>}
            </div>
            <div className="adm-timeline-time">
              {idx === 0 && createdAt ? new Date(createdAt).toLocaleString('en-IN') : isCompleted ? 'Completed' : 'Pending'}
            </div>
          </div>
        );
      })}
    </div>
  );
};
