import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const CustomerModal = ({ isOpen, onClose, customer, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    customerType: "individual",
    status: "active",
  });

  useEffect(() => {
    if (customer) {
      const [firstName = "", lastName = ""] = (customer.name || "").split(" ");
      setFormData({
        firstName,
        lastName,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zipCode: customer.zipCode || "",
        customerType: customer.customerType || "individual",
        status: customer.isActive === false ? "inactive" : "active",
      });
    } else {
      setFormData({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zipCode: "", customerType: "individual", status: "active" });
    }
  }, [customer]);

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
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100">
          <div className="p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              {customer ? "Edit Customer" : "Add New Customer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Customer Type</label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
                >
                  {customer ? "Update" : "Add"} Customer
                </button>
                <button
                  type="button"
                  onClick={onClose}
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

import { CustomersAPI } from "../lib/api";

const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // "active", "inactive", "blocked", ""
  const [customerTypeFilter, setCustomerTypeFilter] = useState(""); // "individual", "business", "wholesale", ""
  const [nameSort, setNameSort] = useState(""); // "a-z", "z-a", ""
  const [balanceSort, setBalanceSort] = useState(""); // "high-to-low", "low-to-high", ""

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { customers } = await CustomersAPI.list();
      setCustomers(customers);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Filter and sort customers
  const filteredCustomers = React.useMemo(() => {
    let filtered = customers.filter(customer => {
      // Search filter
      const matchesSearch = 
        (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.city || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = customer.isActive === true;
      } else if (statusFilter === "inactive") {
        matchesStatus = customer.isActive === false;
      } else if (statusFilter === "blocked") {
        // Assuming blocked customers have isActive === false, you can adjust this logic
        matchesStatus = customer.isActive === false;
      }
      
      // Customer Type filter
      const matchesType = !customerTypeFilter || 
        (customer.customerType || 'individual') === customerTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Name sorting
    if (nameSort === "a-z") {
      filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (nameSort === "z-a") {
      filtered = [...filtered].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    // Balance sorting
    if (balanceSort === "high-to-low") {
      filtered = [...filtered].sort((a, b) => (b.balance || 0) - (a.balance || 0));
    } else if (balanceSort === "low-to-high") {
      filtered = [...filtered].sort((a, b) => (a.balance || 0) - (b.balance || 0));
    }

    return filtered;
  }, [customers, searchTerm, statusFilter, customerTypeFilter, nameSort, balanceSort]);

  const clearFilters = () => {
    setStatusFilter("");
    setCustomerTypeFilter("");
    setNameSort("");
    setBalanceSort("");
    setShowFilter(false);
  };

  const hasActiveFilters = statusFilter || customerTypeFilter || nameSort || balanceSort;

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

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = async (customer) => {
    try {
      const { customer: full } = await CustomersAPI.get(customer._id);
      setEditingCustomer(full);
    } catch {
      setEditingCustomer(customer);
    } finally {
      setIsModalOpen(true);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try { await CustomersAPI.remove(id); setCustomers((prev)=> prev.filter((c)=> c._id !== id)); } catch (e) { setError(e.message); }
  };

  const handleSaveCustomer = async (formData) => {
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        customerType: formData.customerType,
        isActive: formData.status !== 'inactive' && formData.status !== 'blocked',
      };
      if (editingCustomer) {
        const { customer } = await CustomersAPI.update(editingCustomer._id, payload);
        setCustomers((prev)=> prev.map((c)=> c._id === editingCustomer._id ? customer : c));
      } else {
        const { customer } = await CustomersAPI.create(payload);
        setCustomers((prev)=> [customer, ...prev]);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'wholesale': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">Customers</h1>
                <p className="text-blue-700">Manage your customer database</p>
              </div>
              <button
                onClick={handleAddCustomer}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
              >
                <PlusIcon className="w-5 h-5" />
                Add Customer
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Search customers..."
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
                    {[statusFilter && "1", customerTypeFilter && "1", nameSort && "1", balanceSort && "1"].filter(Boolean).length}
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
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-2">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>

                    {/* Customer Type Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-2">
                        Customer Type
                      </label>
                      <select
                        value={customerTypeFilter}
                        onChange={(e) => setCustomerTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                      >
                        <option value="">All Types</option>
                        <option value="individual">Individual</option>
                        <option value="business">Business</option>
                        <option value="wholesale">Wholesale</option>
                      </select>
                    </div>

                    {/* Name Sort */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-2">
                        Sort by Name
                      </label>
                      <select
                        value={nameSort}
                        onChange={(e) => setNameSort(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                      >
                        <option value="">Default</option>
                        <option value="a-z">A to Z</option>
                        <option value="z-a">Z to A</option>
                      </select>
                    </div>

                    {/* Balance Sort */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-2">
                        Sort by Balance
                      </label>
                      <select
                        value={balanceSort}
                        onChange={(e) => setBalanceSort(e.target.value)}
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
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {customerTypeFilter && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                  Type: {customerTypeFilter}
                  <button
                    onClick={() => setCustomerTypeFilter("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {nameSort && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Name: {nameSort === "a-z" ? "A to Z" : "Z to A"}
                  <button
                    onClick={() => setNameSort("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {balanceSort && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Balance: {balanceSort === "high-to-low" ? "High to Low" : "Low to High"}
                  <button
                    onClick={() => setBalanceSort("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Customers Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af)' }}>
                            {(customer.name || '?').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-blue-900">
                              {customer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-blue-900">
                            <EnvelopeIcon className="w-4 h-4 text-blue-500" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <PhoneIcon className="w-4 h-4 text-blue-500" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-blue-900">
                          <MapPinIcon className="w-4 h-4 text-blue-500" />
                          <span className="truncate max-w-xs">{customer.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(customer.customerType || 'individual')}`}>
                          {customer.customerType || 'individual'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${
                          (customer.balance || 0) > 0 ? 'text-red-600' : 
                          (customer.balance || 0) < 0 ? 'text-green-600' : 
                          'text-blue-900'
                        }`}>
                          ${(customer.balance || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor((customer.isActive !== false) ? 'active' : 'inactive')}`}>
                          {(customer.isActive !== false) ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer._id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
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
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4" style={{ color: '#93c5fd' }}>👥</div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">No customers found</h3>
              <p className="text-blue-600 mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first customer."}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddCustomer}
                  className="text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
                >
                  Add Customer
                </button>
              )}
            </div>
          )}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default Customers;
