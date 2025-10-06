import React, { useEffect, useMemo, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

import { VendorsAPI, CustomersAPI, ProductsAPI, TransactionsAPI } from "../lib/api";

const TransactionModal = ({ isOpen, onClose, transaction, onSave, vendors = [], customers = [], products = [] }) => {
  const [formData, setFormData] = useState({
    type: transaction?.type || "stock-in",
    product: transaction?.product || "",
    quantity: transaction?.quantity ?? "",
    unitPrice: transaction?.unitPrice ?? "",
    vendor: transaction?.vendor || "",
    customer: transaction?.customer || "",
    reference: transaction?.reference || "",
    notes: transaction?.notes || "",
  });

  const handleTypeChange = (e) => {
    const nextType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      type: nextType,
      vendor: nextType === "stock-in" ? prev.vendor : "",
      customer: nextType === "stock-out" ? prev.customer : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      type: formData.type,
      product: formData.product,
      vendor: formData.type === 'stock-in' ? formData.vendor : undefined,
      customer: formData.type === 'stock-out' ? formData.customer : undefined,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      note: formData.notes,
      reference: formData.reference,
    };

    if (payload.type === "stock-in" && !payload.vendor) {
      alert("Please select a vendor.");
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
              {transaction ? "Edit Transaction" : "Add New Transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <select
                  value={formData.type}
                  onChange={handleTypeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="stock-in">Stock In (Purchase)</option>
                  <option value="stock-out">Stock Out (Sale)</option>
                  <option value="adjustment">Stock Adjustment</option>
                </select>
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select a product…</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Quantity & Unit Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Vendor dropdown for stock-in */}
              {formData.type === "stock-in" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>Select a vendor…</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v._id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer dropdown for stock-out */}
              {formData.type === "stock-out" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                  <select
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>Select a customer…</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reference */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div> */}

              {/* Notes */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div> */}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {transaction ? "Update" : "Add"} Transaction
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

const InventoryTransactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [{ vendors }, { customers }, { products }, { transactions }] = await Promise.all([
        VendorsAPI.list(),
        CustomersAPI.list(),
        ProductsAPI.list(),
        TransactionsAPI.list(),
      ]);
      setVendors(vendors);
      setCustomers(customers);
      setProducts(products);
      setTransactions(transactions);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredTransactions = transactions.filter((t) => {
    const name = (t.product?.name || t.productName || '').toLowerCase();
    const type = (t.type || '').toLowerCase();
    const vendor = (t.vendor?.name || t.vendor || '').toLowerCase();
    const customer = (t.customer?.name || t.customer || '').toLowerCase();
    const reference = (t.reference || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || type.includes(q) || vendor.includes(q) || customer.includes(q) || reference.includes(q);
  });

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction({
      ...transaction,
      type: transaction.type === 'purchase' ? 'stock-in' : transaction.type === 'sale' ? 'stock-out' : transaction.type,
      product: transaction.product?._id || transaction.product,
      vendor: transaction.vendor?._id || transaction.vendor,
      customer: transaction.customer?._id || transaction.customer,
    });
    setIsModalOpen(true);
  };

  const [confirmId, setConfirmId] = useState(null);
  const handleDeleteTransaction = (id) => setConfirmId(id);
  const doDelete = async () => {
    const id = confirmId; setConfirmId(null);
    try { await TransactionsAPI.remove(id); setTransactions((prev)=> prev.filter((t)=> (t._id||t.id) !== id)); } catch (e) { setError(e.message); }
  };

  const handleSaveTransaction = async (formData) => {
    try {
      if (editingTransaction && editingTransaction._id) {
        const { transaction } = await TransactionsAPI.update(editingTransaction._id, {
          product: formData.product,
          vendor: formData.type === 'stock-in' ? formData.vendor : undefined,
          customer: formData.type === 'stock-out' ? formData.customer : undefined,
          quantity: formData.quantity,
          unitPrice: formData.unitPrice,
          note: formData.notes,
        });
        setTransactions((prev)=> prev.map((t)=> (t._id === editingTransaction._id ? transaction : t)));
      } else {
        let created;
        if (formData.type === 'stock-in') {
          ({ transaction: created } = await TransactionsAPI.purchase({ product: formData.product, vendor: formData.vendor, quantity: formData.quantity, unitPrice: formData.unitPrice, note: formData.notes }));
        } else if (formData.type === 'stock-out') {
          ({ transaction: created } = await TransactionsAPI.sale({ product: formData.product, customer: formData.customer, quantity: formData.quantity, unitPrice: formData.unitPrice, note: formData.notes }));
    } else {
          ({ transaction: created } = await TransactionsAPI.adjustment({ product: formData.product, quantity: formData.quantity, note: formData.notes }));
        }
        setTransactions((prev) => [created, ...prev]);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "stock-in":
        return "bg-green-100 text-green-800";
      case "stock-out":
        return "bg-blue-100 text-blue-800";
      case "adjustment":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "stock-in":
        return <ArrowDownIcon className="w-4 h-4" />;
      case "stock-out":
        return <ArrowUpIcon className="w-4 h-4" />;
      case "adjustment":
        return <AdjustmentsHorizontalIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Transactions</h1>
            <p className="text-gray-600">Track all stock movements and adjustments</p>
          </div>
          <button
            onClick={handleAddTransaction}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
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

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const displayType = transaction.type === 'purchase' ? 'stock-in' : transaction.type === 'sale' ? 'stock-out' : transaction.type;
                return (
                <tr key={transaction._id || transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(
                        displayType
                      )}`}
                    >
                      {getTypeIcon(displayType)}
                      {displayType.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transaction.product?.name || transaction.productName}</div>
                      <div className="text-sm text-gray-500">{new Date(transaction.date || transaction.createdAt).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        transaction.quantity > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.quantity > 0 ? "+" : ""}
                      {transaction.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${Number(transaction.unitPrice).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${Number((transaction.quantity || 0) * (transaction.unitPrice || 0)).toFixed(2)}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.reference}</div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id || transaction.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first transaction."}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddTransaction}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Transaction
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        products={products}
        vendors={vendors}
        customers={customers}
      />

      {confirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setConfirmId(null)}></div>
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Delete Transaction?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
                <div className="flex gap-3 pt-2">
                  <button onClick={doDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">Delete</button>
                  <button onClick={()=>setConfirmId(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTransactions;
