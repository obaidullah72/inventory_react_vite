import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CubeIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

// nav items with paths matching your routes
const NAV = [
  { label: "Dashboard", path: "/dashboard", icon: ChartBarIcon },
  { label: "Products", path: "/products", icon: CubeIcon },
  { label: "Categories", path: "/categories", icon: CubeIcon },
  { label: "Vendor", path: "/vendors", icon: BuildingStorefrontIcon },
  { label: "Customer", path: "/customers", icon: UsersIcon },
  { label: "Inventory Transactions", path: "/inventory-transactions", icon: ArrowsRightLeftIcon },
  { label: "Invoices & Payments", path: "/invoices-payments", icon: DocumentTextIcon },
  // { label: "Reports", path: "/reports", icon: ChartBarIcon },
  { label: "Settings", path: "/settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ openMobile, onCloseMobile, collapsed, onToggleCollapsed }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // close mobile drawer on resize to lg+
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024 && openMobile) onCloseMobile(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [openMobile, onCloseMobile]);

  const go = (path) => {
    navigate(path);
    if (openMobile) onCloseMobile();
  };

  const railW = "w-[84px]";        // compact rail width
  const panelW = "w-64 xl:w-72";   // expanded width
  const sidebarWidth = collapsed ? railW : panelW;
  const showExpanded = !collapsed || isHovered;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          openMobile ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobile}
      />

      <aside
        className={`fixed z-50 h-dvh bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white
                    shadow-2xl border-r border-white/10 transition-all duration-500 ease-out ${sidebarWidth}
                    ${openMobile ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="navigation"
        aria-label="Sidebar"
      >
        {/* Header */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-3
                        p-4 border-b border-white/10 bg-white/5`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-11 w-11 place-items-center rounded-2xl
                            bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
                            font-extrabold shadow-xl ring-2 ring-blue-500/20">IP</div>
            {(showExpanded || openMobile) && (
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold truncate">Inventory Pro</h1>
                <p className="text-[11px] text-white/60">Business Suite</p>
              </div>
            )}
          </div>

          {/* <button
            onClick={onToggleCollapsed}
            className="hidden lg:grid place-items-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRightIcon className="w-4 h-4 text-white/80" /> : <ChevronLeftIcon className="w-4 h-4 text-white/80" />}
          </button>

          <button
            onClick={onCloseMobile}
            className="lg:hidden grid place-items-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5 text-white/80" />
          </button> */}
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 sm:px-4 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/60">
          <ul className={`grid gap-2 ${collapsed ? "justify-items-center" : ""}`}>
            {NAV.map(({ label, path, icon: Icon }) => {
              const isActive = pathname === path || (path === "/dashboard" && pathname === "/");
              // Collapsed rail
              if (collapsed && !showExpanded) {
                return (
                  <li key={path} className="w-full">
                    <div className="group relative">
                      <button
                        onClick={() => go(path)}
                        className={`grid place-items-center w-14 h-14 rounded-2xl border
                                    ${isActive ? "border-blue-400/50" : "border-white/10"}
                                    bg-white/5 hover:bg-white/10 transition-all shadow-xl`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className={`grid place-items-center w-10 h-10 rounded-xl
                                        ${isActive ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-white/10 group-hover:bg-white/20"}`}>
                          <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/80"}`} />
                        </div>
                      </button>

                      {/* tooltip */}
                      <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        <div className="rounded-xl border border-white/10 bg-slate-900/95 text-white text-xs px-3 py-1.5 shadow-2xl">
                          {label}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              }

              // Expanded rows
              return (
                <li key={path}>
                  <button
                    onClick={() => go(path)}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold
                                transition-all relative overflow-hidden
                                ${isActive
                                  ? "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-xl ring-2 ring-blue-500/20"
                                  : "text-white/85 hover:bg-white/10"}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full bg-white/90" />}
                    <div className={`grid place-items-center w-10 h-10 rounded-xl ${isActive ? "bg-white/20" : "bg-white/10"}`}>
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/80"}`} />
                    </div>
                    <span className="flex-1 text-left truncate">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer/Profile simplified
        <div className={`border-t border-white/10 ${collapsed && !showExpanded ? "p-3" : "p-4 sm:p-5"}`}>
          {showExpanded ? (
            <button
              onClick={() => console.log("logout")}
              className="w-full flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-4 py-3 text-sm font-semibold text-white ring-2 ring-red-500/20 hover:from-red-700 hover:via-red-800 hover:to-red-900"
            >
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-red-900/50">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </span>
              Logout
            </button>
          ) : (
            <div className="grid place-items-center">
              <div className="relative w-14 h-14 rounded-2xl bg-white/5 border border-white/10 grid place-items-center shadow-xl">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center font-bold">OM</span>
                <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900" />
              </div>
            </div>
          )}
        </div> */}

        {/* Mobile close */}
        <div className="p-4 lg:hidden border-t border-white/10">
          <button
            onClick={onCloseMobile}
            className="w-full rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-3 text-sm font-semibold"
          >
            Close Menu
          </button>
        </div>
      </aside>
    </>
  );
}
