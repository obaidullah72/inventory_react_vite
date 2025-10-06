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
} from "@heroicons/react/24/outline";

const VendorModal = ({ isOpen, onClose, vendor, onSave }) => {
  const [formData, setFormData] = useState({
    company: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    status: "active",
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        company: vendor.name || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        contactPerson: vendor.contactPerson || "",
        status: vendor.isActive === false ? "inactive" : "active",
      });
    } else {
      setFormData({ company: "", email: "", phone: "", address: "", contactPerson: "", status: "active" });
    }
  }, [vendor]);

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
              {vendor ? "Edit Vendor" : "Add New Vendor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
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
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
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
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {vendor ? "Update" : "Add"} Vendor
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

import { VendorsAPI } from "../lib/api";

const Vendors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { vendors } = await VendorsAPI.list();
      setVendors(vendors);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredVendors = vendors.filter(vendor =>
    (vendor.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleEditVendor = async (vendor) => {
    try {
      const { vendor: full } = await VendorsAPI.get(vendor._id);
      setEditingVendor(full);
    } catch {
      setEditingVendor(vendor);
    } finally {
      setIsModalOpen(true);
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try { await VendorsAPI.remove(id); setVendors((prev)=> prev.filter((v)=> v._id !== id)); } catch (e) { setError(e.message); }
  };

  const handleSaveVendor = async (formData) => {
    try {
      const payload = {
        name: formData.company,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        isActive: formData.status !== 'inactive' && formData.status !== 'suspended',
      };
      if (editingVendor) {
        const { vendor } = await VendorsAPI.update(editingVendor._id, payload);
        setVendors((prev)=> prev.map((v)=> v._id === editingVendor._id ? vendor : v));
      } else {
        const { vendor } = await VendorsAPI.create(payload);
        setVendors((prev)=> [vendor, ...prev]);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors</h1>
                <p className="text-gray-600">Manage your vendor relationships</p>
              </div>
              <button
                onClick={handleAddVendor}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add Vendor
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
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

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {/* Vendors Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vendor.contactPerson}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                            {vendor.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                            {vendor.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-xs">{vendor.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(vendor.isActive ? 'active' : 'inactive')}`}>
                          {vendor.isActive ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditVendor(vendor)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor._id)}
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
          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first vendor."}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddVendor}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Vendor
                </button>
              )}
            </div>
          )}
      <VendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />
    </div>
  );
};

export default Vendors;
