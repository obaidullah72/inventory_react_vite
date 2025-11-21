import React from "react";

const StatCard = ({ label, value, trend, icon, gradient, iconBg, iconColor }) => (
  <div className={`group relative overflow-hidden bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1`}>
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500" style={{ background: 'linear-gradient(to bottom right, rgba(30, 58, 138, 0.1), transparent)' }}></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-blue-600 mb-2 tracking-wide uppercase">{label}</p>
          <p className="text-3xl font-bold text-blue-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`} style={{ background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af)' }}>
          <span className={`text-2xl text-white`}>{icon}</span>
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
            trend.type === "up" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            <span className="text-xs">{trend.type === "up" ? "↗" : "↘"}</span>
            <span>{trend.value}%</span>
          </div>
          <span className="text-xs text-blue-600 font-medium">from last month</span>
        </div>
      )}
    </div>
  </div>
);

export default StatCard;