import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { AuthAPI } from "../lib/api";

const Topbar = ({ onOpenMobile, onToggleCollapsed, collapsed }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { user } = await AuthAPI.me();
        if (mounted) setUser(user);
      } catch (err) {
        // If unauthorized, redirect to login
        if (err.status === 401 || err.message?.includes('unauthorized')) {
          localStorage.removeItem('token');
          if (mounted) navigate('/login', { replace: true });
        }
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const notifications = [
    { id: 1, title: "New order received", message: "Order #1234 from John Doe", time: "2 min ago", unread: true },
    { id: 2, title: "Low stock alert", message: "Product 'MacBook Pro' is running low", time: "1 hour ago", unread: true },
    { id: 3, title: "Payment received", message: "Payment of $2,500 received", time: "3 hours ago", unread: false },
    { id: 4, title: "New vendor added", message: "Vendor 'Tech Solutions' added", time: "1 day ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header 
      className={`fixed top-0 right-0 z-40 transition-all duration-500 ${collapsed ? "sm:left-16 lg:left-20 xl:left-22" : "sm:left-64 lg:left-80 xl:left-84"}`}
      style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af, #1e3a8a)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Left side - Menu buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button 
            onClick={onOpenMobile} 
            className="lg:hidden p-2.5 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Desktop sidebar toggle */}
          <button 
            onClick={onToggleCollapsed}
            className="hidden lg:flex p-2.5 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16" />
            </svg>
          </button>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-white/20">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                  <p className="text-sm text-gray-600 mt-1">{unreadCount} unread</p>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-gray-50/50 hover:bg-gray-50/50 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/30' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${notification.unread ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                          <p className="text-gray-700 text-sm mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1.5">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 bg-gray-50/30">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
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
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/20" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                {(user?.name || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-white/70 font-medium">{user?.role || 'Member'}</p>
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-white/80 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User menu dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-50 overflow-hidden">
                {/* User info section */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-gray-100" style={{ background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af)' }}>
                      {(user?.name || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-600 truncate">{user?.email || 'user@example.com'}</p>
                      {user?.role && (
                        <p className="text-xs text-gray-500 mt-0.5">{user.role}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Menu items */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                </div>
                
                {/* Sign out button */}
                <div className="border-t border-gray-100 py-2 bg-red-50/30">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
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