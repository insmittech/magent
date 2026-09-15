import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Award, ArrowUpRight } from 'lucide-react';
import { RevenueChart } from '../dashboard/RevenueChart';
import { SalesBreakdown } from '../dashboard/SalesBreakdown';

export const AnalyticsPage = ({ products = [], orders = [] }) => {
  const [period, setPeriod] = useState('30D');

  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalGross = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalVolume = activeOrders.length;
  const aov = totalVolume > 0 ? Math.round(totalGross / totalVolume) : 0;
  const uniqueBuyers = new Set(orders.map(o => o.customer.phone)).size || 1;
  const ltv = Math.round(totalGross / uniqueBuyers);

  // Compute Top Performing Products from real orders
  const productPerformance = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId || p.name === item.name);
      const id = prod?.id || item.name;
      if (!productPerformance[id]) {
        productPerformance[id] = {
          id,
          name: prod?.name || item.name,
          sku: prod?.sku || 'SKU-VAR',
          image: prod?.image || '/images/clothing.jpg',
          category: prod?.category || 'clothing',
          unitsSold: 0,
          revenue: 0
        };
      }
      const qty = item.quantity || 1;
      const price = item.price || 0;
      productPerformance[id].unitsSold += qty;
      productPerformance[id].revenue += price * qty;
    });
  });

  const topProducts = Object.values(productPerformance)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <div>
      {/* Page Header */}
      <div className="adm-page-header">
        <div>
          <h1>Analytics & Store Intelligence</h1>
          <div className="adm-page-subtext">
            Performance metrics, customer unit economics, and sales rankings.
          </div>
        </div>

        <div className="adm-pill-group">
          {['7D', '30D', '90D', '1Y'].map(p => (
            <button
              key={p}
              type="button"
              className={`adm-pill-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top Analytics Metrics */}
      <div className="adm-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Gross Revenue</span>
            <DollarSign size={16} color="var(--adm-success)" />
          </div>
          <div className="adm-kpi-value" style={{ color: 'var(--adm-success)' }}>
            ₹{totalGross.toLocaleString()}
          </div>
          <div className="adm-kpi-footer"><span>active fulfilled orders</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Completed Orders</span>
            <ShoppingBag size={16} className="adm-kpi-icon" />
          </div>
          <div className="adm-kpi-value">{totalVolume}</div>
          <div className="adm-kpi-footer"><span>total order volume</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Average Order Value</span>
            <TrendingUp size={16} color="var(--adm-primary)" />
          </div>
          <div className="adm-kpi-value">₹{aov.toLocaleString()}</div>
          <div className="adm-kpi-footer"><span>revenue per order</span></div>
        </div>

        <div className="adm-kpi-card">
          <div className="adm-kpi-top">
            <span className="adm-kpi-label">Customer Lifetime Value</span>
            <Award size={16} color="var(--adm-warning)" />
          </div>
          <div className="adm-kpi-value">₹{ltv.toLocaleString()}</div>
          <div className="adm-kpi-footer"><span>revenue per buyer</span></div>
        </div>
      </div>

      {/* 2-Column Analytics Charts */}
      <div className="adm-grid-2col">
        <RevenueChart totalSales={totalGross} totalOrders={totalVolume} />
        <SalesBreakdown products={products} orders={orders} />
      </div>

      {/* Top Products Leaderboard Table */}
      <div className="adm-table-container">
        <div className="adm-table-toolbar">
          <h2 className="adm-card-title" style={{ fontSize: '0.95rem' }}>
            <Award size={16} color="var(--adm-primary)" />
            <span>Top Performing Products Leaderboard</span>
          </h2>
        </div>

        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Rank</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Gross Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-text-muted)' }}>
                    No product sales recorded yet.
                  </td>
                </tr>
              ) : (
                topProducts.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="adm-tag" style={{ fontWeight: 900 }}>#{idx + 1}</span>
                    </td>
                    <td>
                      <div className="adm-prod-cell">
                        <img src={p.image} alt={p.name} className="adm-prod-thumb" />
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td><code>{p.sku}</code></td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>{p.category}</span>
                    </td>
                    <td>
                      <strong>{p.unitsSold} units</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--adm-primary)' }}>₹{p.revenue.toLocaleString()}</strong>
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
