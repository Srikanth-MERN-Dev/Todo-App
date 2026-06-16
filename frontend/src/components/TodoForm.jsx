import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const TodoForm = ({ isOpen, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'medium',
        dueDate: initial.dueDate ? initial.dueDate.split('T')[0] : '',
      });
    } else {
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
    setErrors({});
  }, [initial, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.length > 100) errs.title = 'Title is too long';
    if (form.description.length > 500) errs.description = 'Description is too long';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200/60 dark:border-slate-700/60">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {initial ? 'Edit Task' : 'New Task'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="What needs to be done?"
                    className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                      errors.title ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Add details..."
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none ${
                      errors.description ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm"
                  >
                    {initial ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TodoForm;
