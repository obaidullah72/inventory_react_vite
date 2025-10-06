import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Vendors from "./pages/Vendors";
import Customers from "./pages/Customers";
import InventoryTransactions from "./pages/InventoryTransactions";
import InvoicesPayments from "./pages/InvoicesPayments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Categories from "./pages/Categories";

function RequireAuth({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory-transactions" element={<InventoryTransactions />} />
          <Route path="invoices-payments" element={<InvoicesPayments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-8">Not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
