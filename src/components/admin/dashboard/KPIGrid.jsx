import React from 'react';
import { IndianRupee, ShoppingBag, Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

export const KPIGrid = ({ kpis = {}, orders = [] }) => {
  const totalSales = kpis.totalSales || 0;
  const totalOrders = kpis.totalOrders || 0;
  const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const customersCount = kpis.customersCount || 1;
  const lowStockTotal = (kpis.lowStockCount || 0) + (kpis.outOfStockCount || 0);

  const kpiCards = [
    {
      label: "Today's Revenue",
      value: `₹${totalSales.toLocaleString()}`,
      badge: "+18.4%",
      badgeType: "up",
      comparison: "vs yesterday",
      icon: IndianRupee,
      sparklineColor: "#10b981",
      sparklinePoints: "5,15 15,12 25,14 35,9 45,11 55,4"
    },
    {
      label: "Customer Orders",
      value: totalOrders,
      badge: "+12.0%",
      badgeType: "up",
      comparison: "vs last week",
      icon: ShoppingBag,
      sparklineColor: "#3b82f6",
      sparklinePoints: "5,16 15,13 25,10 35,12 45,8 55,5"
    },
    {
      label: "Active Customers",
      value: customersCount,
      badge: "+8.5%",
      badgeType: "up",
      comparison: "unique buyers",
      icon: Users,
      sparklineColor: "#8b5cf6",
      sparklinePoints: "5,14 15,14 25,11 35,10 45,7 55,6"
    },
    {
      label: "Avg. Order Value",
      value: `₹${aov.toLocaleString()}`,
      badge: "+4.2%",
      badgeType: "up",
      comparison: "per transaction",
      icon: TrendingUp,
      sparklineColor: "#f59e0b",
      sparklinePoints: "5,12 15,10 25,13 35,8 45,9 55,5"
    },
    {
      label: "Stock Attention",
      value: lowStockTotal,
      badge: lowStockTotal > 0 ? `${lowStockTotal} items` : "Healthy",
      badgeType: lowStockTotal > 0 ? "down" : "neutral",
      comparison: "critical stock",
      icon: AlertTriangle,
      sparklineColor: lowStockTotal > 0 ? "#ef4444" : "#10b981",
      sparklinePoints: "5,15 15,10 25,8 35,12 45,6 55,14"
    },
    {
      label: "Store Conversion",
      value: "3.4%",
      badge: "+0.6%",
      badgeType: "up",
      comparison: "visitor to cart",
      icon: Activity,
      sparklineColor: "#06b6d4",
      sparklinePoints: "5,15 15,13 25,12 35,9 45,6 55,4"
    }
  ];

  return (
    <div className="adm-kpi-grid">
      {kpiCards.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="adm-kpi-card">
            <div className="adm-kpi-top">
              <span className="adm-kpi-label">{kpi.label}</span>
              <Icon size={16} className="adm-kpi-icon" />
            </div>

            <div className="adm-kpi-value-row">
              <span className="adm-kpi-value">{kpi.value}</span>
              <span className={`adm-kpi-badge ${kpi.badgeType}`}>
                {kpi.badge}
              </span>
            </div>

            <div className="adm-kpi-footer">
              <span>{kpi.comparison}</span>
              <svg className="adm-sparkline" viewBox="0 0 60 20">
                <polyline
                  fill="none"
                  stroke={kpi.sparklineColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={kpi.sparklinePoints}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
