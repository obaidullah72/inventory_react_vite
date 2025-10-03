import React from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Vendors from "./pages/Vendors";
import Customers from "./pages/Customers";
import InvoicesPayments from "./pages/InvoicesPayments";
import InventoryTransactions from "./pages/InventoryTransactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const routes = [
  {
    path: "/",
    element: <Dashboard />,
    label: "Dashboard",
    exact: true
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    label: "Dashboard"
  },
  {
    path: "/products",
    element: <Products />,
    label: "Products"
  },
  {
    path: "/vendors",
    element: <Vendors />,
    label: "Vendor"
  },
  {
    path: "/customers",
    element: <Customers />,
    label: "Customer"
  },
  {
    path: "/inventory-transactions",
    element: <InventoryTransactions />,
    label: "Inventory Transactions"
  },
  {
    path: "/invoices-payments",
    element: <InvoicesPayments />,
    label: "Invoices & Payments"
  },
  {
    path: "/reports",
    element: <Reports />,
    label: "Reports"
  },
  {
    path: "/analytics",
    element: <Reports />,
    label: "Analytics"
  },
  {
    path: "/settings",
    element: <Settings />,
    label: "Settings"
  }
];

export default routes;
