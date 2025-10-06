import React, { useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { CustomersAPI, InvoicesAPI } from "../lib/api";

const InvoiceModal = ({ isOpen, onClose, invoice, onSave, customers = [] }) => {
  const [formData, setFormData] = useState({
    number: invoice?.number || "",
    customer: invoice?.customer || "",
    amount: invoice?.amount ?? "",
    status: invoice?.status || "issued",
    dueDate: invoice?.dueDate ? invoice.dueDate.substring(0,10) : "",
    description: invoice?.description || "",
  });

  // Keep form in sync when editing different invoice
  useEffect(() => {
    if (invoice) {
      setFormData({
        number: invoice.number || "",
        customer: typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer?._id || ""),
        amount: invoice.total ?? invoice.amount ?? "",
        status: invoice.status || "issued",
        dueDate: invoice.dueDate ? String(invoice.dueDate).substring(0,10) : "",
        description: invoice.description || "",
      });
    }
  }, [invoice]);

  // Ensure the currently selected customer (when editing) is present in options
  const customerOptions = useMemo(() => customers, [customers]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      number: formData.number,
      type: 'sales',
      customer: formData.customer,
      items: [],
      subTotal: Number(formData.amount),
      tax: 0,
      total: Number(formData.amount),
      balance: Number(formData.amount),
      dueDate: formData.dueDate,
      status: formData.status,
      description: formData.description,
    };

    if (!payload.customer) {
      alert("Please select a customer.");
      return;
    }

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {invoice ? "Edit Invoice" : "Add New Invoice"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Customer dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                <select
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select a customer…</option>
                  {customerOptions.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="issued">Issued</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {invoice ? "Update" : "Add"} Invoice
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoicesPayments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [{ customers }, { invoices }] = await Promise.all([
        CustomersAPI.list(),
        InvoicesAPI.list(),
      ]);
      setCustomers(customers);
      setInvoices(invoices);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredInvoices = invoices.filter((i) => {
    const number = (i.number || i.invoiceNumber || '').toLowerCase();
    const customer = (i.customer?.name || i.customerName || '').toLowerCase();
    const status = (i.status || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return number.includes(q) || customer.includes(q) || status.includes(q);
  });

  // Helper: printable PDF-like page with modern blue/white theme
  const generateInvoicePdf = (inv) => {
    const number = inv.number || inv.invoiceNumber || '';
    const customer = inv.customer?.name || inv.customerName || '';
    const amount = Number(inv.total ?? inv.amount ?? 0).toFixed(2);
    const due = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '';
    const descr = inv.description || '';
    const created = new Date(inv.createdAt || Date.now()).toLocaleDateString();
    const status = (inv.status || 'issued').toUpperCase();
    const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Invoice ${number}</title>
      <style>
        :root{--blue:#1d4ed8;--indigo:#4f46e5;--slate:#0f172a;--muted:#64748b}
        *{box-sizing:border-box}
        body{margin:0;background:#f8fafc;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--slate)}
        .container{max-width:900px;margin:40px auto;padding:0 24px}
        .card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(2,6,23,.08)}
        .header{background:linear-gradient(135deg,var(--blue) 0%,var(--indigo) 100%);color:#fff;padding:28px 32px;display:flex;align-items:center;justify-content:space-between}
        .brand{display:flex;align-items:center;gap:12px}
        .logo{width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.15);display:grid;place-items:center;font-weight:800}
        .title{margin:0;font-size:22px;letter-spacing:.3px}
        .meta{margin:4px 0 0;font-size:12px;opacity:.9}
        .section{padding:24px 32px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .panel{border:1px solid #e5e7eb;border-radius:12px;padding:16px}
        .label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
        table{width:100%;border-collapse:collapse;margin-top:8px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
        thead th{background:#f1f5f9;color:var(--slate);font-size:12px;text-transform:uppercase;letter-spacing:.06em}
        th,td{padding:12px 14px;border-bottom:1px solid #e5e7eb;text-align:left}
        tfoot td{border-bottom:none}
        .right{text-align:right}
        .badge{display:inline-block;background:#dbeafe;color:#1e40af;font-weight:700;border-radius:999px;padding:6px 12px;font-size:12px}
        .totalRow td{font-weight:800}
        .footer{padding:18px 32px;border-top:1px solid #e5e7eb;color:var(--muted);font-size:12px}
        @media print{body{background:#fff}.container{margin:0;padding:0}.card{box-shadow:none;border:1px solid #e5e7eb}}
      </style></head>
      <body><div class="container"><div class="card">
        <div class="header">
          <div class="brand">
            <div class="logo">IP</div>
            <div>
              <h1 class="title">Invoice ${number}</h1>
              <div class="meta">Issued: ${created} • Due: ${due}</div>
            </div>
          </div>
          <div class="badge">${status}</div>
        </div>
        <div class="section grid">
          <div class="panel">
            <div class="label">Billed To</div>
            <div>${customer}</div>
          </div>
          <div class="panel">
            <div class="label">Invoice Details</div>
            <div>Invoice #: <strong>${number}</strong><br/>Due Date: <strong>${due}</strong></div>
          </div>
        </div>
        <div class="section">
          <table>
            <thead><tr><th>Description</th><th class="right">Amount</th></tr></thead>
            <tbody>
              <tr><td>${descr || 'Invoice amount'}</td><td class="right">$${amount}</td></tr>
            </tbody>
            <tfoot>
              <tr class="totalRow"><td>Total</td><td class="right">$${amount}</td></tr>
            </tfoot>
          </table>
        </div>
        <div class="footer">Thank you for your business.</div>
      </div></div>
      <script>window.print();</script>
      </body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
  };

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handleEditInvoice = async (invoice) => {
    try {
      const { invoice: full } = await InvoicesAPI.get(invoice._id || invoice.id);
      setEditingInvoice(full);
    } catch {
    setEditingInvoice(invoice);
    } finally {
    setIsModalOpen(true);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try { await InvoicesAPI.remove(id); setInvoices((prev)=> prev.filter((i)=> (i._id||i.id) !== id)); } catch (e) { setError(e.message); }
  };

  const handleSaveInvoice = async (formData) => {
    try {
    if (editingInvoice) {
        const { invoice } = await InvoicesAPI.update(editingInvoice._id, formData);
        setInvoices((prev)=> prev.map((i)=> (i._id === editingInvoice._id ? invoice : i)));
    } else {
        const { invoice } = await InvoicesAPI.create(formData);
        setInvoices((prev)=> [invoice, ...prev]);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices & Payments</h1>
            <p className="text-gray-600">Manage your invoices and payment tracking</p>
          </div>
          <button
            onClick={handleAddInvoice}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Invoice
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          Filter
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id || invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.number || invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{invoice.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.customer?.name || invoice.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${Number(invoice.total ?? invoice.amount ?? 0).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => generateInvoicePdf(invoice)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                        title="Download PDF"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice._id || invoice.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🧾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first invoice."}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Invoice
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoice={editingInvoice}
        onSave={handleSaveInvoice}
        customers={customers}
      />
    </div>
  );
};

export default InvoicesPayments;
