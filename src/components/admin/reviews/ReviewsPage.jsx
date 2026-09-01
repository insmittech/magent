import React, { useState } from 'react';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';

export const ReviewsPage = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState('All');

  // Generate realistic reviews derived from products
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      customer: 'Aarav Patel',
      productName: 'Magnet Signature Hoodie',
      productId: 'prod-1',
      rating: 5,
      comment: 'Super heavy fabric and oversized fit is spot on. Legit streetwear feel!',
      date: '2026-08-28',
      status: 'Approved'
    },
    {
      id: 'rev-2',
      customer: 'Kavita Shah',
      productName: 'GaN 65W Triple Port Wall Charger',
      productId: 'prod-5',
      rating: 5,
      comment: 'Charges my MacBook and phone simultaneously without heating up. Great build.',
      date: '2026-08-29',
      status: 'Approved'
    },
    {
      id: 'rev-3',
      customer: 'Rohan Mehta',
      productName: 'Urban Framework Graphic Tee',
      productId: 'prod-2',
      rating: 4,
      comment: 'High density back print looks great. Fabric is thick 240 GSM.',
      date: '2026-08-30',
      status: 'Pending'
    },
    {
      id: 'rev-4',
      customer: 'Pooja Varma',
      productName: 'Magnet Matte Armor iPhone Case',
      productId: 'prod-6',
      rating: 5,
      comment: 'Buttons feel very tactile and soft touch finish is scratch resistant.',
      date: '2026-08-31',
      status: 'Pending'
    }
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer review?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

  const filtered = reviews.filter(r => {
    if (activeTab === 'All') return true;
    return r.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Customer Reviews Moderation</h1>
          <div className="adm-page-subtext">
            Approve, reject, or manage customer product feedback.
          </div>
        </div>
      </div>

      <div className="adm-table-container">
        {/* Filter Tabs */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--adm-border)', display: 'flex', gap: '0.5rem' }}>
          {tabs.map(tab => {
            const count = tab === 'All' 
              ? reviews.length 
              : reviews.filter(r => r.status.toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                type="button"
                className={`adm-pill-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span>{tab}</span>
                <span className="adm-nav-badge" style={{ marginLeft: '4px' }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Reviews Table */}
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>
                    No reviews in "{activeTab}" queue.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.customer}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.productName}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px', color: '#ffb000' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < r.rating ? '#ffb000' : 'none'}
                            color={i < r.rating ? '#ffb000' : 'var(--adm-border)'}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--adm-text-main)', maxWidth: '300px' }}>
                        "{r.comment}"
                      </p>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>{r.date}</span>
                    </td>
                    <td>
                      <span className={`adm-badge ${r.status === 'Approved' ? 'active' : r.status === 'Pending' ? 'pending' : 'cancelled'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="adm-actions-cell" style={{ justifyContent: 'flex-end' }}>
                        {r.status !== 'Approved' && (
                          <button
                            type="button"
                            className="adm-btn-icon"
                            style={{ color: 'var(--adm-success)' }}
                            onClick={() => handleUpdateStatus(r.id, 'Approved')}
                            title="Approve Review"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        {r.status !== 'Rejected' && (
                          <button
                            type="button"
                            className="adm-btn-icon"
                            style={{ color: 'var(--adm-warning)' }}
                            onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                            title="Reject Review"
                          >
                            <X size={15} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="adm-btn-icon danger"
                          onClick={() => handleDelete(r.id)}
                          title="Delete Review"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
