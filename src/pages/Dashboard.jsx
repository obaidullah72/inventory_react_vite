import React from "react";
import StatCard from "../components/StatCard";
import Ring from "../components/Ring";

const Dashboard = () => {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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