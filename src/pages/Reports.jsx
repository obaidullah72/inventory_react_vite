import React, { useState } from "react";
import StatCard from "../components/StatCard";
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("sales");

  const handleNavigation = (page) => {
    console.log(`Navigating to: ${page}`);
  };

  const reports = [
    {
      id: "sales",
      title: "Sales Report",
      description: "Monthly sales performance and trends",
      icon: "📊",
      data: {
        totalSales: "$125,430",
        growth: "+12.5%",
        period: "Last 30 days"
      }
    },
    {
      id: "inventory",
      title: "Inventory Report",
      description: "Stock levels and movement analysis",
      icon: "📦",
      data: {
        totalProducts: "1,247",
        lowStock: "23",
        period: "Current status"
      }
    },
    {
      id: "customers",
      title: "Customer Report",
      description: "Customer acquisition and retention",
      icon: "👥",
      data: {
        totalCustomers: "2,156",
        newCustomers: "89",
        period: "This month"
      }
    },
    {
      id: "vendors",
      title: "Vendor Report",
      description: "Vendor performance and payments",
      icon: "🏪",
      data: {
        activeVendors: "45",
        totalSpent: "$89,230",
        period: "This quarter"
      }
    }
  ];

  const reportData = {
    sales: {
      title: "Sales Performance",
      stats: [
        { label: "Total Revenue", value: "$125,430", trend: { value: 12.5, type: "up" } },
        { label: "Orders", value: "1,247", trend: { value: 8.2, type: "up" } },
        { label: "Average Order", value: "$100.50", trend: { value: 4.1, type: "up" } },
        { label: "Conversion Rate", value: "3.2%", trend: { value: 0.8, type: "up" } }
      ]
    },
    inventory: {
      title: "Inventory Overview",
      stats: [
        { label: "Total Products", value: "1,247", trend: { value: 15.3, type: "up" } },
        { label: "Low Stock Items", value: "23", trend: { value: -5.2, type: "down" } },
        { label: "Out of Stock", value: "7", trend: { value: -12.5, type: "down" } },
        { label: "Stock Value", value: "$89,230", trend: { value: 18.7, type: "up" } }
      ]
    },
    customers: {
      title: "Customer Analytics",
      stats: [
        { label: "Total Customers", value: "2,156", trend: { value: 22.1, type: "up" } },
        { label: "New Customers", value: "89", trend: { value: 15.6, type: "up" } },
        { label: "Repeat Customers", value: "1,847", trend: { value: 8.9, type: "up" } },
        { label: "Customer Value", value: "$58.20", trend: { value: 6.3, type: "up" } }
      ]
    },
    vendors: {
      title: "Vendor Performance",
      stats: [
        { label: "Active Vendors", value: "45", trend: { value: 12.5, type: "up" } },
        { label: "Total Spent", value: "$89,230", trend: { value: 18.2, type: "up" } },
        { label: "Average Order", value: "$1,982", trend: { value: 5.7, type: "up" } },
        { label: "Payment Pending", value: "$12,450", trend: { value: -8.1, type: "down" } }
      ]
    }
  };

  return (
    <div className="space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
                <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  Date Range
                </button>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Report Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedReport === report.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{report.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-500">{report.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Report Stats */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{reportData[selectedReport].title}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {reportData[selectedReport].stats.map((stat, index) => (
                <StatCard
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  trend={stat.trend}
                  icon="📊"
                  gradient="from-white to-gray-50"
                  iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
                  iconColor="text-white"
                />
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Sales Trend</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 80, 45, 90, 75, 50, 85, 60, 95, 70, 55, 88].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {height}%
                      </div>
                    </div>
                    <span className="mt-2 text-xs text-gray-600 font-medium">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "MacBook Pro 16-inch", sales: 45, revenue: "$112,495" },
                  { name: "Wireless Headphones", sales: 89, revenue: "$17,791" },
                  { name: "Running Shoes", sales: 67, revenue: "$8,709" },
                  { name: "Coffee Maker", sales: 34, revenue: "$3,060" },
                  { name: "Programming Book", sales: 123, revenue: "$6,149" }
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Generate Report</p>
                  <p className="text-xs text-gray-500">Custom reports</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DocumentArrowDownIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Export Data</p>
                  <p className="text-xs text-gray-500">CSV, PDF, Excel</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">View Details</p>
                  <p className="text-xs text-gray-500">Detailed analysis</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FunnelIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Filter Data</p>
                  <p className="text-xs text-gray-500">Advanced filters</p>
                </div>
              </button>
            </div>
          </div>
    </div>
  );
};

export default Reports;
