import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import Ring from "../components/Ring";
import { ReportsAPI } from "../lib/api";

const Dashboard = () => {
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGraphData = async () => {
      try {
        const { data } = await ReportsAPI.graphStats();
        setGraphData(data || []);
      } catch (error) {
        console.error("Failed to load graph stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGraphData();
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Calculate max value for scaling
  const maxValue = graphData.length > 0 
    ? Math.max(...graphData.map(d => Math.max(d.sales || 0, d.purchases || 0, Math.abs(d.profitLoss || 0))))
    : 10000;

  // Format month for display
  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1 h-12 rounded-full" style={{ background: 'linear-gradient(to bottom, #1e3a8a, #1e40af)' }}></div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2 tracking-tight">Dashboard Overview</h1>
                <p className="text-blue-700 font-medium">Welcome back, Obaidullah! Here's your business summary.</p>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <StatCard 
              label="Total Products" 
              value="1,247" 
              trend={{ value: 12.5, type: "up" }} 
              icon="📦" 
            />
            <StatCard 
              label="Active Vendors" 
              value="89" 
              trend={{ value: 8.2, type: "up" }} 
              icon="🏪" 
            />
            <StatCard 
              label="Total Customers" 
              value="2,156" 
              trend={{ value: 15.3, type: "up" }} 
              icon="👥" 
            />
            <StatCard 
              label="Monthly Revenue" 
              value="$45,678" 
              trend={{ value: 22.1, type: "up" }} 
              icon="💰" 
            />
          </div>
          {/* Sales & Profit Chart */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-1">Sales & Profit Overview</h2>
                  <p className="text-blue-600 text-sm">Monthly performance analysis</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }}></div>
                    <span className="text-sm text-blue-700 font-medium">Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#3b82f6' }}></div>
                    <span className="text-sm text-blue-700 font-medium">Purchases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#1e3a8a' }}></div>
                    <span className="text-sm text-blue-700 font-medium">Profit/Loss</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                    <p className="text-blue-600 font-medium">Loading chart data...</p>
                  </div>
                </div>
              ) : graphData.length === 0 ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4" style={{ color: '#93c5fd' }}>📊</div>
                    <p className="text-blue-600 font-medium">No data available</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Chart Container */}
                  <div className="relative h-96 w-full overflow-x-auto">
                    <div className="min-w-full" style={{ minWidth: `${Math.max(600, graphData.length * 120)}px` }}>
                      <svg className="w-full h-full" viewBox={`0 0 ${Math.max(800, graphData.length * 120)} 380`} preserveAspectRatio="xMinYMin meet">
                        <defs>
                          <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
                          </linearGradient>
                          <linearGradient id="purchasesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
                          </linearGradient>
                          <linearGradient id="profitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="1" />
                            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" />
                          </linearGradient>
                          <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <line
                            key={i}
                            x1="80"
                            y1={60 + i * 50}
                            x2={Math.max(800, graphData.length * 120) - 40}
                            y2={60 + i * 50}
                            stroke="#e0e7ff"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                        ))}

                        {/* Y-axis labels */}
                        {[0, 1, 2, 3, 4, 5].map((i) => {
                          const value = maxValue - (i * maxValue / 5);
                          return (
                            <text
                              key={i}
                              x="75"
                              y={65 + i * 50}
                              textAnchor="end"
                              className="text-xs fill-blue-600 font-semibold"
                            >
                              ${(value / 1000).toFixed(0)}k
                            </text>
                          );
                        })}

                        {/* Bars */}
                        {graphData.map((item, index) => {
                          const chartWidth = Math.max(800, graphData.length * 120);
                          const x = 100 + (index * ((chartWidth - 140) / graphData.length));
                          const barWidth = ((chartWidth - 140) / graphData.length) - 30;
                          const salesHeight = ((item.sales || 0) / maxValue) * 250;
                          const purchasesHeight = ((item.purchases || 0) / maxValue) * 250;
                          const profitLossHeight = (Math.abs(item.profitLoss || 0) / maxValue) * 250;
                          const profitLossY = item.profitLoss >= 0 
                            ? 310 - profitLossHeight 
                            : 310;

                          return (
                            <g key={index} className="group">
                              {/* Sales bar */}
                              <rect
                                x={x + barWidth * 0.05}
                                y={310 - salesHeight}
                                width={barWidth * 0.28}
                                height={salesHeight}
                                fill="url(#salesGradient)"
                                rx="6"
                                className="hover:opacity-90 transition-all duration-200 cursor-pointer"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))' }}
                              />
                              {/* Purchases bar */}
                              <rect
                                x={x + barWidth * 0.36}
                                y={310 - purchasesHeight}
                                width={barWidth * 0.28}
                                height={purchasesHeight}
                                fill="url(#purchasesGradient)"
                                rx="6"
                                className="hover:opacity-90 transition-all duration-200 cursor-pointer"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }}
                              />
                              {/* Profit/Loss bar */}
                              <rect
                                x={x + barWidth * 0.67}
                                y={profitLossY}
                                width={barWidth * 0.28}
                                height={profitLossHeight}
                                fill={item.profitLoss >= 0 ? "url(#profitGradient)" : "url(#lossGradient)"}
                                rx="6"
                                className="hover:opacity-90 transition-all duration-200 cursor-pointer"
                                style={{ filter: `drop-shadow(0 2px 4px rgba(${item.profitLoss >= 0 ? '30, 58, 138' : '239, 68, 68'}, 0.3))` }}
                              />
                              
                              {/* Value labels on bars */}
                              {salesHeight > 20 && (
                                <text
                                  x={x + barWidth * 0.19}
                                  y={310 - salesHeight - 5}
                                  textAnchor="middle"
                                  className="text-xs fill-blue-900 font-bold"
                                >
                                  ${(item.sales / 1000).toFixed(1)}k
                                </text>
                              )}
                              {purchasesHeight > 20 && (
                                <text
                                  x={x + barWidth * 0.5}
                                  y={310 - purchasesHeight - 5}
                                  textAnchor="middle"
                                  className="text-xs fill-blue-900 font-bold"
                                >
                                  ${(item.purchases / 1000).toFixed(1)}k
                                </text>
                              )}
                              {profitLossHeight > 20 && (
                                <text
                                  x={x + barWidth * 0.81}
                                  y={item.profitLoss >= 0 ? 310 - profitLossHeight - 5 : 310 + profitLossHeight + 15}
                                  textAnchor="middle"
                                  className={`text-xs font-bold ${item.profitLoss >= 0 ? 'fill-green-700' : 'fill-red-700'}`}
                                >
                                  ${(item.profitLoss / 1000).toFixed(1)}k
                                </text>
                              )}

                              {/* Month label */}
                              <text
                                x={x + barWidth / 2}
                                y="350"
                                textAnchor="middle"
                                className="text-xs fill-blue-700 font-semibold"
                              >
                                {formatMonth(item.month)}
                              </text>
                            </g>
                          );
                        })}

                        {/* Zero line */}
                        <line
                          x1="80"
                          y1="310"
                          x2={Math.max(800, graphData.length * 120) - 40}
                          y2="310"
                          stroke="#1e3a8a"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {graphData.map((item, index) => (
                      <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all">
                        <p className="text-sm text-blue-600 font-semibold mb-3 text-center">{formatMonth(item.month)}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                              <span className="text-xs text-blue-700 font-medium">Sales</span>
                            </div>
                            <span className="text-sm text-blue-900 font-bold">${(item.sales || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                              <span className="text-xs text-blue-700 font-medium">Purchases</span>
                            </div>
                            <span className="text-sm text-blue-900 font-bold">${(item.purchases || 0).toLocaleString()}</span>
                          </div>
                          <div className="pt-2 border-t border-blue-200">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-700 font-semibold">Net P/L</span>
                              <span className={`text-sm font-bold ${item.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.profitLoss >= 0 ? '+' : ''}${(item.profitLoss || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2 mb-12">
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900">Recent Activities</h2>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(30, 58, 138, 0.1)' }}>
                  <span className="text-sm" style={{ color: '#1e3a8a' }}>📊</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { action: "New product added", time: "2 hours ago", type: "success" },
                  { action: "Vendor payment processed", time: "4 hours ago", type: "info" },
                  { action: "Customer order completed", time: "6 hours ago", type: "success" },
                  { action: "Inventory updated", time: "8 hours ago", type: "warning" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'success' ? 'bg-green-500' : 
                      item.type === 'info' ? 'bg-blue-600' : 'bg-amber-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">{item.action}</p>
                      <p className="text-xs text-blue-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300" style={{ background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Quick Actions</h2>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">⚡</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-center">
                  <div className="text-2xl mb-1">📦</div>
                  <div className="text-xs font-medium">Add Product</div>
                </button>
                <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-center">
                  <div className="text-2xl mb-1">🏪</div>
                  <div className="text-xs font-medium">Add Vendor</div>
                </button>
                <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-center">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-xs font-medium">Add Customer</div>
                </button>
                <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-xs font-medium">View Reports</div>
                </button>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-blue-100 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-blue-700 font-medium">Last updated: {today}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <button className="text-blue-600 hover:text-blue-800 transition-colors font-semibold hover:underline">Help</button>
              <button className="text-blue-600 hover:text-blue-800 transition-colors font-semibold hover:underline">Support</button>
            </div>
      </div>
    </div>
  );
};

export default Dashboard;