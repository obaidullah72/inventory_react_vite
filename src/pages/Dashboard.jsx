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
              <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-600 font-medium">Welcome back, Obaidullah! Here's your business summary.</p>
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
              gradient="from-blue-600 via-blue-700 to-indigo-800"
              iconBg="bg-white/20"
              iconColor="text-white"
            />
            <StatCard 
              label="Active Vendors" 
              value="89" 
              trend={{ value: 8.2, type: "up" }} 
              icon="🏪" 
              iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
              iconColor="text-white"
            />
            <StatCard 
              label="Total Customers" 
              value="2,156" 
              trend={{ value: 15.3, type: "up" }} 
              icon="👥" 
              iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
              iconColor="text-white"
            />
            <StatCard 
              label="Monthly Revenue" 
              value="$45,678" 
              trend={{ value: 22.1, type: "up" }} 
              icon="💰" 
              iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
              iconColor="text-white"
            />
          </div>
          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2 mb-12">
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📊</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { action: "New product added", time: "2 hours ago", type: "success" },
                  { action: "Vendor payment processed", time: "4 hours ago", type: "info" },
                  { action: "Customer order completed", time: "6 hours ago", type: "success" },
                  { action: "Inventory updated", time: "8 hours ago", type: "warning" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'success' ? 'bg-green-500' : 
                      item.type === 'info' ? 'bg-blue-500' : 'bg-amber-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
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
          <div className="mt-8 flex items-center justify-between border-t border-gray-200/50 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600 font-medium">Last updated: {today}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <button className="text-gray-600 hover:text-blue-600 transition-colors font-semibold hover:underline">Help</button>
              <button className="text-gray-600 hover:text-blue-600 transition-colors font-semibold hover:underline">Support</button>
            </div>
      </div>
    </div>
  );
};

export default Dashboard;