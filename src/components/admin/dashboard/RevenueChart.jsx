import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';

export const RevenueChart = ({ totalSales = 0, totalOrders = 0 }) => {
  const [period, setPeriod] = useState('30D');
  const [metric, setMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Generate realistic time series based on the chosen period
  const getChartData = () => {
    if (period === '7D') {
      return [
        { label: 'Mon', revenue: Math.round(totalSales * 0.12), orders: Math.max(1, Math.round(totalOrders * 0.11)) },
        { label: 'Tue', revenue: Math.round(totalSales * 0.15), orders: Math.max(1, Math.round(totalOrders * 0.14)) },
        { label: 'Wed', revenue: Math.round(totalSales * 0.11), orders: Math.max(1, Math.round(totalOrders * 0.10)) },
        { label: 'Thu', revenue: Math.round(totalSales * 0.18), orders: Math.max(1, Math.round(totalOrders * 0.17)) },
        { label: 'Fri', revenue: Math.round(totalSales * 0.22), orders: Math.max(1, Math.round(totalOrders * 0.21)) },
        { label: 'Sat', revenue: Math.round(totalSales * 0.28), orders: Math.max(1, Math.round(totalOrders * 0.26)) },
        { label: 'Sun', revenue: Math.round(totalSales * 0.24), orders: Math.max(1, Math.round(totalOrders * 0.22)) },
      ];
    } else if (period === '90D') {
      return [
        { label: 'Month 1', revenue: Math.round(totalSales * 0.8), orders: Math.round(totalOrders * 0.8) },
        { label: 'Month 2', revenue: Math.round(totalSales * 0.95), orders: Math.round(totalOrders * 0.95) },
        { label: 'Month 3', revenue: totalSales, orders: totalOrders },
      ];
    } else if (period === '1Y') {
      return [
        { label: 'Q1', revenue: Math.round(totalSales * 0.6), orders: Math.round(totalOrders * 0.6) },
        { label: 'Q2', revenue: Math.round(totalSales * 0.75), orders: Math.round(totalOrders * 0.75) },
        { label: 'Q3', revenue: Math.round(totalSales * 0.9), orders: Math.round(totalOrders * 0.9) },
        { label: 'Q4', revenue: totalSales, orders: totalOrders },
      ];
    }
    // Default 30D (4 weeks)
    return [
      { label: 'Week 1', revenue: Math.round(totalSales * 0.18), orders: Math.max(1, Math.round(totalOrders * 0.19)) },
      { label: 'Week 2', revenue: Math.round(totalSales * 0.24), orders: Math.max(1, Math.round(totalOrders * 0.23)) },
      { label: 'Week 3', revenue: Math.round(totalSales * 0.28), orders: Math.max(1, Math.round(totalOrders * 0.27)) },
      { label: 'Week 4', revenue: Math.round(totalSales * 0.35), orders: Math.max(1, Math.round(totalOrders * 0.33)) },
    ];
  };

  const data = getChartData();
  const maxVal = Math.max(...data.map(d => metric === 'revenue' ? d.revenue : d.orders), 10);

  // SVG coordinate dimensions
  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 20;

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / (data.length - 1 || 1)) * (width - paddingX * 2);
    const val = metric === 'revenue' ? d.revenue : d.orders;
    const y = height - paddingY - (val / (maxVal * 1.15)) * (height - paddingY * 2);
    return { x, y, data: d };
  });

  const pathD = points.length > 0 
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` 
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`
    : '';

  return (
    <div className="adm-card">
      <div className="adm-card-header">
        <h2 className="adm-card-title" style={{ fontSize: '0.95rem' }}>
          <BarChart2 size={16} color="var(--adm-primary)" />
          <span>Revenue Overview</span>
        </h2>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div className="adm-pill-group">
            <button
              type="button"
              className={`adm-pill-btn ${metric === 'revenue' ? 'active' : ''}`}
              onClick={() => setMetric('revenue')}
            >
              Revenue (₹)
            </button>
            <button
              type="button"
              className={`adm-pill-btn ${metric === 'orders' ? 'active' : ''}`}
              onClick={() => setMetric('orders')}
            >
              Orders
            </button>
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
      </div>

      <div className="adm-chart-container">
        <svg className="adm-chart-svg" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--adm-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--adm-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="var(--adm-border)" strokeDasharray="3 3" opacity="0.6" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="var(--adm-border)" strokeDasharray="3 3" opacity="0.6" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="var(--adm-border)" />

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="url(#revenueGrad)" />}

          {/* Main Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--adm-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive dots and x-axis labels */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint === idx ? 5 : 3.5}
                fill="var(--adm-card-bg)"
                stroke="var(--adm-primary)"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={p.x}
                y={height - 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--adm-text-muted)"
              >
                {p.data.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint !== null && points[hoveredPoint] && (
          <div
            style={{
              position: 'absolute',
              left: `${(points[hoveredPoint].x / width) * 100}%`,
              top: `${(points[hoveredPoint].y / height) * 100}%`,
              transform: 'translate(-50%, -120%)',
              background: 'var(--adm-text-main)',
              color: 'var(--adm-card-bg)',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              pointerEvents: 'none',
              boxShadow: 'var(--adm-shadow-md)',
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            <div>{points[hoveredPoint].data.label}</div>
            <div style={{ color: 'var(--adm-primary)', fontSize: '0.85rem' }}>
              {metric === 'revenue' ? `₹${points[hoveredPoint].data.revenue.toLocaleString()}` : `${points[hoveredPoint].data.orders} orders`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
