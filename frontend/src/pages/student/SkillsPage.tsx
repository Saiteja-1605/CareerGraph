import React, { useState, useEffect } from 'react';
import { skillService } from '../../services/api';
import { StudentSkill, CatalogSkill, SkillProficiency } from '../../types';
import { Badge, getStatusBadgeVariant } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { EmptyState } from '../../components/EmptyState';
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  Code,
  Layout,
  Server,
  Database,
  Terminal,
  Cpu,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [catalog, setCatalog] = useState<CatalogSkill[]>([]);
  const [categorized, setCategorized] = useState<Record<string, StudentSkill[]>>({});
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<StudentSkill | null>(null);

  // Form State
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState<SkillProficiency>('Intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = [
    { name: 'Programming', icon: Code, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { name: 'Frontend', icon: Layout, color: 'text-sky-600 bg-sky-50 border-sky-100' },
    { name: 'Backend', icon: Server, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { name: 'Database', icon: Database, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { name: 'CS Fundamentals', icon: Cpu, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { name: 'Tools & DevOps', icon: Terminal, color: 'text-slate-600 bg-slate-100 border-slate-200' },
  ];

  const fetchSkills = async () => {
    try {
      const [skillsRes, catalogRes] = await Promise.all([
        skillService.getStudentSkills(),
        skillService.getCatalog(),
      ]);

      if (skillsRes.success) {
        setSkills(skillsRes.skills);
        setCategorized(skillsRes.categorized || {});
      }
      if (catalogRes.success) {
        setCatalog(catalogRes.skills);
      }
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setSkillName('');
    setCategory('Programming');
    setProficiency('Intermediate');
    setErrorMessage(null);
    setIsAddModalOpen(true);
  };

  const handleSelectFromCatalog = (catSkill: CatalogSkill) => {
    setSkillName(catSkill.name);
    setCategory(catSkill.category);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await skillService.addSkill({
        name: skillName,
        category,
        proficiency,
      });
      if (res.success) {
        setIsAddModalOpen(false);
        fetchSkills();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to add skill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (skill: StudentSkill) => {
    setEditingSkill(skill);
    setProficiency(skill.proficiency);
    setCategory(skill.category);
    setIsEditModalOpen(true);
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setIsSubmitting(true);

    try {
      const res = await skillService.updateSkill(editingSkill._id, {
        proficiency,
        category,
      });
      if (res.success) {
        setIsEditModalOpen(false);
        fetchSkills();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update skill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from your profile?`)) {
      return;
    }

    try {
      await skillService.deleteSkill(id);
      fetchSkills();
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Technical Skills Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain your verified technical capabilities across programming languages, frameworks, and databases.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-slate-500">Loading skills...</div>
      ) : skills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No skills added yet"
          description="Start building your technical inventory to showcase your strengths to campus recruiters."
          actionLabel="Add Your First Skill"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const categorySkills = categorized[cat.name] || [];

            return (
              <div
                key={cat.name}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{cat.name}</h3>
                      <span className="text-[11px] text-slate-400">
                        {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCategory(cat.name);
                      setSkillName('');
                      setProficiency('Intermediate');
                      setIsAddModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title={`Add skill to ${cat.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1">
                  {categorySkills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-6 text-center">
                      No {cat.name} skills listed yet.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {categorySkills.map((s) => (
                        <div
                          key={s._id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors group"
                        >
                          <div>
                            <span className="text-sm font-semibold text-slate-800 block">
                              {s.name}
                            </span>
                            <div className="mt-1">
                              <Badge variant={getStatusBadgeVariant(s.proficiency)} size="sm">
                                {s.proficiency}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(s)}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              title="Edit proficiency"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(s._id, s.name)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Delete skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Skill Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Technical Skill" maxWidth="lg">
        <form onSubmit={handleAddSkill} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. React.js, Docker, Java, PostgreSQL"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Quick suggestions from predefined catalog */}
          {catalog.length > 0 && (
            <div>
              <span className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Popular Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                {catalog.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => handleSelectFromCatalog(c)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      skillName.toLowerCase() === c.name.toLowerCase()
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Proficiency
              </label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as SkillProficiency)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Beginner">Beginner (Basic Syntax & Concepts)</option>
                <option value="Intermediate">Intermediate (Built Projects / Solved Problems)</option>
                <option value="Advanced">Advanced (Production Experience / High Fluency)</option>
                <option value="Expert">Expert (Architecture & Deep Mastery)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Update Proficiency: ${editingSkill?.name}`}>
        <form onSubmit={handleUpdateSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as SkillProficiency)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
