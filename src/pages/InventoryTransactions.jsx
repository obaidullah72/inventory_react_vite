import React, { useState } from "react";
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

const TransactionModal = ({ isOpen, onClose, transaction, onSave }) => {
  const [formData, setFormData] = useState({
    type: transaction?.type || "stock-in",
    productName: transaction?.productName || "",
    quantity: transaction?.quantity || "",
    unitPrice: transaction?.unitPrice || "",
    vendor: transaction?.vendor || "",
    customer: transaction?.customer || "",
    reference: transaction?.reference || "",
    notes: transaction?.notes || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="stock-in">Stock In (Purchase)</option>
                  <option value="stock-out">Stock Out (Sale)</option>
                  <option value="adjustment">Stock Adjustment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
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
              {formData.type === "stock-in" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              {formData.type === "stock-out" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "stock-in",
      productName: "MacBook Pro 16-inch",
      quantity: 10,
      unitPrice: 2499.99,
      vendor: "Apple Inc",
      reference: "PO-001",
      notes: "Monthly stock replenishment",
      date: "2024-01-15",
    },
    {
      id: 2,
      type: "stock-out",
      productName: "Wireless Headphones",
      quantity: 5,
      unitPrice: 199.99,
      customer: "John Doe",
      reference: "SO-001",
      notes: "Customer order fulfillment",
      date: "2024-01-16",
    },
    {
      id: 3,
      type: "adjustment",
      productName: "Running Shoes",
      quantity: -2,
      unitPrice: 129.99,
      reference: "ADJ-001",
      notes: "Damaged goods adjustment",
      date: "2024-01-17",
    },
    {
      id: 4,
      type: "stock-in",
      productName: "Coffee Maker",
      quantity: 15,
      unitPrice: 89.99,
      vendor: "Kitchen Pro",
      reference: "PO-002",
      notes: "New product line addition",
      date: "2024-01-18",
    },
    {
      id: 5,
      type: "stock-out",
      productName: "Programming Book",
      quantity: 8,
      unitPrice: 49.99,
      customer: "Jane Smith",
      reference: "SO-002",
      notes: "Bulk order for corporate training",
      date: "2024-01-19",
    },
  ]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.vendor && transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (transaction.customer && transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    }
  };

  const handleSaveTransaction = (formData) => {
    if (editingTransaction) {
      setTransactions(transactions.map(transaction =>
        transaction.id === editingTransaction.id ? { ...transaction, ...formData } : transaction
      ));
    } else {
      const newTransaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...formData,
      };
      setTransactions([...transactions, newTransaction]);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'stock-in': return 'bg-green-100 text-green-800';
      case 'stock-out': return 'bg-blue-100 text-blue-800';
      case 'adjustment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stock-in': return <ArrowDownIcon className="w-4 h-4" />;
      case 'stock-out': return <ArrowUpIcon className="w-4 h-4" />;
      case 'adjustment': return <AdjustmentsHorizontalIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleNavigation = (page) => {
    console.log(`Navigating to: ${page}`);
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
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(transaction.type)}`}>
                          {getTypeIcon(transaction.type)}
                          {transaction.type.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.productName}</div>
                          <div className="text-sm text-gray-500">{transaction.date}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${transaction.unitPrice.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${(transaction.quantity * transaction.unitPrice).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.reference}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
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
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
      />
    </div>
  );
};

export default InventoryTransactions;
