import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CategoriesAPI } from "../lib/api";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { categories } = await CategoriesAPI.list();
      setItems(categories);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await CategoriesAPI.create({ name, description });
      setName("");
      setDescription("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (id) => {
    try {
      await CategoriesAPI.remove(id);
      setItems((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  const onEdit = (cat) => { setEditing(cat); setIsEditOpen(true); };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const { category } = await CategoriesAPI.update(editing._id, { name: editing.name, description: editing.description });
      setItems((prev) => prev.map((c) => (c._id === category._id ? category : c)));
      setIsEditOpen(false);
      setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - mirror Products page */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Categories</h1>
            <p className="text-blue-700">Organize your products by category</p>
          </div>
        </div>
      </div>

      {/* Add form styled similar to action area */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-3">
          <input className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg" style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}>Add Category</button>
        </form>
        {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
      </div>

      {/* Categories Table - mirror Products table styles */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-blue-700">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-100">
                {items.map((c) => (
                  <tr key={c._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{c.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(c)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(c._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
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
        )}
      </div>

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4" style={{ color: '#93c5fd' }}>🏷️</div>
          <h3 className="text-lg font-medium text-blue-900 mb-2">No categories yet</h3>
          <p className="text-blue-600">Add your first category using the form above.</p>
        </div>
      )}

      {/* Edit Modal - mirrors Products modal styling */}
      {isEditOpen && editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsEditOpen(false); setEditing(null); }}></div>
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100">
              <div className="p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-6">Edit Category</h2>
                <form onSubmit={saveEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={editing.description || ""}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg" style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}>Update</button>
                    <button type="button" onClick={() => { setIsEditOpen(false); setEditing(null); }} className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg font-medium transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


