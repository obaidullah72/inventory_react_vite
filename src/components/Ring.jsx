import React from "react";

const Ring = ({ value, size, color = "blue", label = "Completed" }) => {
  const sizeClass = size === "lg" ? "w-40 h-40" : "w-32 h-32";
  const colorClass = color === "blue" ? "text-blue-600" : "text-amber-500";
  const gradientClass = color === "blue" ? "from-blue-500 to-blue-600" : "from-amber-500 to-amber-600";
  
  return (
    <div className={`relative ${sizeClass} group`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color === "blue" ? "#3b82f6" : "#f59e0b"} />
            <stop offset="100%" stopColor={color === "blue" ? "#1d4ed8" : "#d97706"} />
          </linearGradient>
        </defs>
        <circle
          className="text-gray-100" 
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          strokeWidth="3"
        />
        <circle
          className={`${colorClass} drop-shadow-lg`}
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          strokeWidth="4"
          strokeDasharray={`${(value / 100) * 2 * Math.PI * 15.91549430918954}, 100`}
          strokeLinecap="round"
          stroke={`url(#gradient-${color})`}
        />
        <text 
          x="50%" 
          y="45%" 
          textAnchor="middle" 
          className="text-gray-800 font-bold text-2xl fill-current"
        >
          {value}%
        </text>
        <text 
          x="50%" 
          y="65%" 
          textAnchor="middle" 
          className="text-gray-500 font-medium text-sm fill-current"
        >
          {label}
        </text>
      </svg>
      
      {/* Animated glow effect */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradientClass} opacity-20 blur-xl scale-110 group-hover:opacity-30 transition-opacity duration-300`}></div>
    </div>
  );
};

export default Ring;