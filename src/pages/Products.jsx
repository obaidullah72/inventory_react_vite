import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ProductModal = ({ isOpen, onClose, product, onSave, categories }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category?._id || product?.category || "",
    salePrice: product?.salePrice || "",
    stockOnHand: product?.stockOnHand || "",
    description: product?.description || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    unit: product?.unit || "pcs",
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
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100">
          <div className="p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-6">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stockOnHand}
                    onChange={(e) => setFormData({ ...formData, stockOnHand: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
                >
                  {product ? "Update" : "Add"} Product
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

import { ProductsAPI, CategoriesAPI } from "../lib/api";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceSort, setPriceSort] = useState(""); // "high-to-low", "low-to-high", ""

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [{ products: prods }, { categories: cats }] = await Promise.all([
        ProductsAPI.list(searchTerm),
        CategoriesAPI.list(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [searchTerm]);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = !selectedCategory || 
        product.category?._id === selectedCategory ||
        product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Price sorting
    if (priceSort === "high-to-low") {
      filtered = [...filtered].sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0));
    } else if (priceSort === "low-to-high") {
      filtered = [...filtered].sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceSort]);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceSort("");
    setShowFilter(false);
  };

  const hasActiveFilters = selectedCategory || priceSort;

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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try { await ProductsAPI.remove(id); setProducts((prev) => prev.filter((p) => p._id !== id)); } catch (e) { setError(e.message); }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        const { product } = await ProductsAPI.update(editingProduct._id, formData);
        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? product : p)));
      } else {
        const { product } = await ProductsAPI.create(formData);
        setProducts((prev) => [product, ...prev]);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">Products</h1>
                <p className="text-blue-700">Manage your product inventory</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
              >
                <PlusIcon className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="Search products..."
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
                    {[selectedCategory && "1", priceSort && "1"].filter(Boolean).length}
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
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-blue-900"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Sort */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-900 mb-2">
                        Sort by Price
                      </label>
                      <select
                        value={priceSort}
                        onChange={(e) => setPriceSort(e.target.value)}
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
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Category: {categories.find(c => c._id === selectedCategory)?.name || 'Selected'}
                  <button
                    onClick={() => setSelectedCategory("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {priceSort && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Price: {priceSort === "high-to-low" ? "High to Low" : "Low to High"}
                  <button
                    onClick={() => setPriceSort("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-blue-900">{product.name}</div>
                          <div className="text-sm text-blue-600 truncate max-w-xs">{product.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white" style={{ background: 'rgba(30, 58, 138, 0.1)', color: '#1e3a8a' }}>
                          {product.category?.name || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 font-semibold">${product.salePrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stockOnHand > 20 ? 'bg-green-100 text-green-800' : 
                          product.stockOnHand > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stockOnHand}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
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
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4" style={{ color: '#93c5fd' }}>📦</div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">No products found</h3>
              <p className="text-blue-600 mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first product."}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddProduct}
                  className="text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}
                >
                  Add Product
                </button>
              )}
            </div>
          )}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
      />
    </div>
  );
};

export default Products;
