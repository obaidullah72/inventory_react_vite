import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  const [openMobile, setOpenMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  console.log("Layout component is rendering");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Sidebar
        openMobile={openMobile}
        onCloseMobile={() => setOpenMobile(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />
      <div className={`${collapsed ? "sm:ml-16 lg:ml-20 xl:ml-22" : "sm:ml-64 lg:ml-80 xl:ml-84"} transition-all duration-500`}>
        <Topbar
          onOpenMobile={() => setOpenMobile(true)}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
          collapsed={collapsed}
        />
        <main className="mx-auto max-w-7xl px-6 pb-16 pt-28 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;