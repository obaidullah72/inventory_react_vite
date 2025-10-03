import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Topbar = ({ onOpenMobile, onToggleCollapsed, collapsed }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: "New order received", message: "Order #1234 from John Doe", time: "2 min ago", unread: true },
    { id: 2, title: "Low stock alert", message: "Product 'MacBook Pro' is running low", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment received", message: "Payment of $2,500 received", time: "3 hours ago", unread: false },
    { id: 4, title: "New vendor added", message: "Vendor 'Tech Solutions' added", time: "1 day ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 z-40 transition-all duration-500 ${collapsed ? "sm:ml-16 lg:ml-20 xl:ml-22" : "sm:ml-64 lg:ml-80 xl:ml-84"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button 
          onClick={onOpenMobile} 
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Desktop sidebar toggle */}
        <button 
          onClick={onToggleCollapsed}
          className="hidden lg:flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16" />
          </svg>
        </button>

        {/* Right side - Notifications and User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">{unreadCount} unread</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${notification.unread ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                OM
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">Obaidullah Mansoor</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </button>

            {/* User menu dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200/50 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                      OM
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Obaidullah Mansoor</p>
                      <p className="text-sm text-gray-500">Administrator</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Account Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Preferences
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Topbar;