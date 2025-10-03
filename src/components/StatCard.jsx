import React from "react";

const StatCard = ({ label, value, trend, icon, gradient, iconBg, iconColor }) => (
  <div className={`group relative overflow-hidden bg-gradient-to-br ${gradient || "from-white to-gray-50"} p-8 rounded-2xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1`}>
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide uppercase">{label}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${iconBg || "bg-gradient-to-br from-blue-500 to-blue-600"} shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
          <span className={`text-2xl ${iconColor || ""}`}>{icon}</span>
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
          <span className="text-xs text-gray-500 font-medium">from last month</span>
        </div>
      )}
    </div>
  </div>
);

export default StatCard;