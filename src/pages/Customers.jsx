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
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {customer ? "Edit Customer" : "Add New Customer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {customer ? "Update" : "Add"} Customer
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

import { CustomersAPI } from "../lib/api";

const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const filteredCustomers = customers.filter(customer =>
    (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
                <p className="text-gray-600">Manage your customer database</p>
              </div>
              <button
                onClick={handleAddCustomer}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add Customer
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
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

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {/* Customers Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(customer.name || '?').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-xs">{customer.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getTypeColor(customer.customerType || 'individual')}`}>
                          {customer.customerType || 'individual'}
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
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer._id)}
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
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first customer."}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddCustomer}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
