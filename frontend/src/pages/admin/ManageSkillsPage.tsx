import React, { useState, useEffect } from 'react';
import { skillService } from '../../services/api';
import { CatalogSkill } from '../../types';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import { Wrench, Plus, Trash2, Tag, Layers, Search } from 'lucide-react';

export const ManageSkillsPage: React.FC = () => {
  const [catalog, setCatalog] = useState<CatalogSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Programming',
    'Frontend',
    'Backend',
    'Database',
    'CS Fundamentals',
    'Tools & DevOps',
    'Other',
  ];

  const fetchCatalog = async () => {
    try {
      const res = await skillService.getCatalog();
      if (res.success) {
        setCatalog(res.skills);
      }
    } catch (err) {
      console.error('Failed to load catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await skillService.createPredefinedSkill({
        name: name.trim(),
        category,
        description,
      });
      if (res.success) {
        setIsModalOpen(false);
        setName('');
        setDescription('');
        fetchCatalog();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add skill to catalog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, skillName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${skillName}" from the global skill catalog?`)) {
      return;
    }
    try {
      await skillService.deletePredefinedSkill(id);
      fetchCatalog();
    } catch (err) {
      console.error('Failed to delete catalog skill:', err);
    }
  };

  const filteredCatalog = catalog.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Master Skills Catalog</h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {catalog.length} Curated Skills
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Maintain standard technical domains, frameworks, and tools available for students and recruiters.
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setDescription('');
            setError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Catalog Skill</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter skills by name or domain..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="p-6 text-slate-500">Loading catalog...</div>
      ) : filteredCatalog.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No skills found"
          description="Try a different search term or add a new skill to the master catalog."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCatalog.map((sk) => (
            <div
              key={sk._id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-800">{sk.name}</h3>
                  <button
                    onClick={() => handleDelete(sk._id, sk.name)}
                    className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors"
                    title="Delete skill from catalog"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Badge variant="primary" size="sm" className="mb-2">
                  {sk.category}
                </Badge>
                {sk.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{sk.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Skill to Master Catalog"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kubernetes, Rust, GraphQL"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Domain / Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description / Application
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Container orchestration platform for distributed clusters"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
