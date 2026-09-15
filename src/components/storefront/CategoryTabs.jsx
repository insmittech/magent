import React from 'react';

export const CategoryTabs = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'all', name: 'All' },
    { id: 'clothing', name: 'Fashion' },
    { id: 'accessories', name: 'Mobile Accessories' },
    { id: 'newArrival', name: 'New Arrivals' },
    { id: 'bestseller', name: 'Best Sellers' }
  ];

  return (
    <div className="trending-tabs-container" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`trending-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChangeTab(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          id={`tab-${tab.id}`}
          aria-controls={`panel-${tab.id}`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};
