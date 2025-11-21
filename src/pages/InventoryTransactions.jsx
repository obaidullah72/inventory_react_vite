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
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { VendorsAPI, CustomersAPI, ProductsAPI, TransactionsAPI } from "../lib/api";

const TransactionModal = ({ isOpen, onClose, transaction, onSave, vendors = [], customers = [], products = [], error: externalError, onClearError }) => {
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

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type === 'purchase' ? 'stock-in' : transaction.type === 'sale' ? 'stock-out' : transaction.type || "stock-in",
        product: transaction.product?._id || transaction.product || "",
        quantity: transaction.quantity ?? "",
        unitPrice: transaction.unitPrice ?? "",
        vendor: transaction.vendor?._id || transaction.vendor || "",
        customer: transaction.customer?._id || transaction.customer || "",
        reference: transaction.reference || "",
        notes: transaction.notes || transaction.note || "",
      });
    } else {
      setFormData({
        type: "stock-in",
        product: "",
        quantity: "",
        unitPrice: "",
        vendor: "",
        customer: "",
        reference: "",
        notes: "",
      });
    }
  }, [transaction]);

  // Auto-populate unit price when product is selected
  useEffect(() => {
    if (formData.product && !transaction) {
      const selectedProduct = products.find(p => p._id === formData.product);
      if (selectedProduct && selectedProduct.salePrice) {
        setFormData(prev => ({
          ...prev,
          unitPrice: selectedProduct.salePrice
        }));
      }
    }
  }, [formData.product, products, transaction]);

  const handleTypeChange = (e) => {
    const nextType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      type: nextType,
      vendor: nextType === "stock-in" ? prev.vendor : "",
      customer: nextType === "stock-out" ? prev.customer : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    if (onClearError) {
      onClearError();
    }

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

    if (payload.type === "stock-out" && !payload.customer) {
      alert("Please select a customer.");
      return;
    }

    // Call onSave and don't close modal - let parent handle success/error
    await onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100">
          <div className="p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              {transaction ? "Edit Transaction" : "Add New Transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {externalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{externalError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClearError}
                    className="flex-shrink-0 text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Transaction Type</label>
                <select
                  value={formData.type}
                  onChange={handleTypeChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                  required
                >
                  <option value="stock-in">Stock In (Purchase)</option>
                  <option value="stock-out">Stock Out (Sale)</option>
                  <option value="adjustment">Stock Adjustment</option>
                </select>
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Product</label>
                <select
                  value={formData.product}
                  onChange={(e) => {
                    setFormData({ ...formData, product: e.target.value });
                    // Clear error when product changes
                    if (onClearError) onClearError();
                  }}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                  required
                >
                  <option value="" disabled>Select a product…</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} {p.stockOnHand !== undefined ? `(Stock: ${p.stockOnHand})` : ''}
                    </option>
                  ))}
                </select>
                {formData.product && (() => {
                  const selectedProduct = products.find(p => p._id === formData.product);
                  return selectedProduct && selectedProduct.stockOnHand !== undefined ? (
                    <p className="mt-1 text-xs text-blue-600">
                      Available stock: <span className="font-semibold">{selectedProduct.stockOnHand}</span>
                    </p>
                  ) : null;
                })()}
              </div>

              {/* Quantity & Unit Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      (() => {
                        if (formData.type === 'stock-out' && formData.product && formData.quantity) {
                          const selectedProduct = products.find(p => p._id === formData.product);
                          if (selectedProduct && selectedProduct.stockOnHand !== undefined) {
                            const qty = Number(formData.quantity);
                            if (qty > selectedProduct.stockOnHand) {
                              return 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500';
                            }
                          }
                        }
                        return 'border-blue-200';
                      })()
                    }`}
                    required
                    min="0"
                  />
                  {/* Stock Warning/Info Message */}
                  {formData.type === 'stock-out' && formData.product && formData.quantity && (() => {
                    const selectedProduct = products.find(p => p._id === formData.product);
                    if (selectedProduct && selectedProduct.stockOnHand !== undefined) {
                      const qty = Number(formData.quantity);
                      const stockOnHand = selectedProduct.stockOnHand;
                      if (qty > stockOnHand) {
                        return (
                          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-sm">
                            <div className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ Insufficient Stock Warning</p>
                                <p className="text-xs text-amber-700 mb-1">
                                  You're trying to sell <span className="font-bold text-amber-900">{qty}</span> units, but only <span className="font-bold text-amber-900">{stockOnHand}</span> units are available in stock.
                                </p>
                                <p className="text-xs text-red-600 font-semibold">
                                  Shortage: {qty - stockOnHand} units
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (qty > 0 && qty <= stockOnHand) {
                        const remaining = stockOnHand - qty;
                        return (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 shadow-sm">
                            <p className="text-xs text-blue-700">
                              <span className="font-semibold">✓ Available:</span> {stockOnHand} units | <span className="font-semibold">Remaining after sale:</span> <span className="text-blue-900 font-bold">{remaining}</span> units
                            </p>
                          </div>
                        );
                      }
                    }
                    return null;
                  })()}
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Vendor dropdown for stock-in */}
              {formData.type === "stock-in" && (
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Vendor</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
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
                  <label className="block text-sm font-medium text-blue-700 mb-2">Customer</label>
                  <select
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                    required
                  >
                    <option value="" disabled>Select a customer…</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
                >
                  {transaction ? "Update" : "Add"} Transaction
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onClearError) onClearError();
                    onClose();
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors"
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
  const [modalError, setModalError] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState(""); // "stock-in", "stock-out", "adjustment", ""
  const [productFilter, setProductFilter] = useState(""); // product ID
  const [dateSort, setDateSort] = useState(""); // "newest", "oldest", ""
  const [totalSort, setTotalSort] = useState(""); // "high-to-low", "low-to-high", ""

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

  // Filter and sort transactions
  const filteredTransactions = React.useMemo(() => {
    let filtered = transactions.filter((t) => {
      // Search filter
    const name = (t.product?.name || t.productName || '').toLowerCase();
    const type = (t.type || '').toLowerCase();
    const vendor = (t.vendor?.name || t.vendor || '').toLowerCase();
    const customer = (t.customer?.name || t.customer || '').toLowerCase();
    const reference = (t.reference || '').toLowerCase();
    const q = searchTerm.toLowerCase();
      const matchesSearch = name.includes(q) || type.includes(q) || vendor.includes(q) || customer.includes(q) || reference.includes(q);
      
      // Type filter
      const displayType = t.type === 'purchase' ? 'stock-in' : t.type === 'sale' ? 'stock-out' : t.type;
      const matchesType = !typeFilter || displayType === typeFilter;
      
      // Product filter
      const matchesProduct = !productFilter || 
        (t.product?._id || t.product) === productFilter;
      
      return matchesSearch && matchesType && matchesProduct;
    });

    // Date sorting
    if (dateSort === "newest") {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0);
        const dateB = new Date(b.date || b.createdAt || 0);
        return dateB - dateA;
      });
    } else if (dateSort === "oldest") {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0);
        const dateB = new Date(b.date || b.createdAt || 0);
        return dateA - dateB;
      });
    }

    // Total amount sorting
    if (totalSort === "high-to-low") {
      filtered = [...filtered].sort((a, b) => {
        const totalA = (a.quantity || 0) * (a.unitPrice || 0);
        const totalB = (b.quantity || 0) * (b.unitPrice || 0);
        return totalB - totalA;
      });
    } else if (totalSort === "low-to-high") {
      filtered = [...filtered].sort((a, b) => {
        const totalA = (a.quantity || 0) * (a.unitPrice || 0);
        const totalB = (b.quantity || 0) * (b.unitPrice || 0);
        return totalA - totalB;
      });
    }

    return filtered;
  }, [transactions, searchTerm, typeFilter, productFilter, dateSort, totalSort]);

  const clearFilters = () => {
    setTypeFilter("");
    setProductFilter("");
    setDateSort("");
    setTotalSort("");
    setShowFilter(false);
  };

  const hasActiveFilters = typeFilter || productFilter || dateSort || totalSort;

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilter && !event.target.closest('.filter-dropdown-container')) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilter]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setModalError("");
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
    setModalError("");
    setIsModalOpen(true);
  };

  const [confirmId, setConfirmId] = useState(null);
  const handleDeleteTransaction = (id) => setConfirmId(id);
  const doDelete = async () => {
    const id = confirmId; setConfirmId(null);
    try { await TransactionsAPI.remove(id); setTransactions((prev)=> prev.filter((t)=> (t._id||t.id) !== id)); } catch (e) { setError(e.message); }
  };

  const handleSaveTransaction = async (formData) => {
    setModalError("");
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
        setIsModalOpen(false);
        setEditingTransaction(null);
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
        setIsModalOpen(false);
        setEditingTransaction(null);
      }
    } catch (e) {
      // Extract error message from various possible formats
      let errorMessage = 'An error occurred';
      if (e?.message) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      } else if (e?.error) {
        errorMessage = e.error;
      }
      setModalError(errorMessage);
      // Don't close modal on error - keep it open so user can see and fix the issue
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
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Inventory Transactions</h1>
            <p className="text-blue-700">Track all stock movements and adjustments</p>
          </div>
          <button
            onClick={handleAddTransaction}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
          >
            <PlusIcon className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <div className="relative filter-dropdown-container">
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
              hasActiveFilters 
                ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold" 
                : "border-blue-200 hover:bg-blue-50 text-blue-700"
            }`}
          >
            <FunnelIcon className="w-5 h-5 text-blue-600" />
          Filter
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {[typeFilter && "1", productFilter && "1", dateSort && "1", totalSort && "1"].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-blue-200 z-50">
              <div className="p-4 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-blue-900 text-lg">Filters</h3>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                  >
                    <option value="">All Types</option>
                    <option value="stock-in">Stock In (Purchase)</option>
                    <option value="stock-out">Stock Out (Sale)</option>
                    <option value="adjustment">Stock Adjustment</option>
                  </select>
                </div>

                {/* Product Filter */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Product
                  </label>
                  <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                  >
                    <option value="">All Products</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Sort */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Sort by Date
                  </label>
                  <select
                    value={dateSort}
                    onChange={(e) => setDateSort(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                  >
                    <option value="">Default</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Total Sort */}
                <div>
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Sort by Total
                  </label>
                  <select
                    value={totalSort}
                    onChange={(e) => setTotalSort(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                  >
                    <option value="">Default</option>
                    <option value="high-to-low">High to Low</option>
                    <option value="low-to-high">Low to High</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="p-4 border-t border-blue-100 flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
                >
                  Apply
        </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-blue-600 font-medium">Active filters:</span>
          {typeFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
              Type: {typeFilter.replace("-", " ")}
              <button
                onClick={() => setTypeFilter("")}
                className="ml-1 hover:text-blue-900"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          )}
          {productFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Product: {products.find(p => p._id === productFilter)?.name || 'Selected'}
              <button
                onClick={() => setProductFilter("")}
                className="ml-1 hover:text-blue-900"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          )}
          {dateSort && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Date: {dateSort === "newest" ? "Newest First" : "Oldest First"}
              <button
                onClick={() => setDateSort("")}
                className="ml-1 hover:text-blue-900"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          )}
          {totalSort && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Total: {totalSort === "high-to-low" ? "High to Low" : "Low to High"}
              <button
                onClick={() => setTotalSort("")}
                className="ml-1 hover:text-blue-900"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-100">
              {filteredTransactions.map((transaction) => {
                const displayType = transaction.type === 'purchase' ? 'stock-in' : transaction.type === 'sale' ? 'stock-out' : transaction.type;
                return (
                <tr key={transaction._id || transaction.id} className="hover:bg-blue-50/30 transition-colors">
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
                      <div className="text-sm font-medium text-blue-900">{transaction.product?.name || transaction.productName}</div>
                      <div className="text-sm text-blue-600">{new Date(transaction.date || transaction.createdAt).toLocaleDateString()}</div>
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
                    <div className="text-sm text-blue-900 font-semibold">${Number(transaction.unitPrice).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-900">
                      ${Number((transaction.quantity || 0) * (transaction.unitPrice || 0)).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id || transaction.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
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
          <div className="text-6xl mb-4" style={{ color: '#93c5fd' }}>📦</div>
          <h3 className="text-lg font-medium text-blue-900 mb-2">No transactions found</h3>
          <p className="text-blue-600 mb-4">
            {searchTerm || hasActiveFilters ? "Try adjusting your search terms or filters." : "Get started by adding your first transaction."}
          </p>
          {!searchTerm && !hasActiveFilters && (
            <button
              onClick={handleAddTransaction}
              className="text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
            >
              Add Transaction
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalError("");
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        products={products}
        vendors={vendors}
        customers={customers}
        error={modalError}
        onClearError={() => setModalError("")}
      />

      {confirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setConfirmId(null)}></div>
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-blue-100">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-blue-900">Delete Transaction?</h3>
                <p className="text-sm text-blue-600">This action cannot be undone.</p>
                <div className="flex gap-3 pt-2">
                  <button onClick={doDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">Delete</button>
                  <button onClick={()=>setConfirmId(null)} className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors">Cancel</button>
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
