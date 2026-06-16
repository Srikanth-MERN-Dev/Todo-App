import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiList, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { todoAPI } from '../services/api';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import EmptyState from '../components/EmptyState';

const filters = [
  { key: 'all', label: 'All', icon: FiList },
  { key: 'completed', label: 'Completed', icon: FiCheckCircle },
  { key: 'pending', label: 'Pending', icon: FiClock },
];

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (search.trim()) params.search = search.trim();
      const { data } = await todoAPI.getAll(params);
      setTodos(data.todos);
      setStats(data.stats);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(fetchTodos, 300);
    return () => clearTimeout(timer);
  }, [fetchTodos]);

  const handleCreate = async (formData) => {
    try {
      const { data } = await todoAPI.create(formData);
      setTodos((prev) => [data, ...prev]);
      setStats((prev) => ({ ...prev, total: prev.total + 1, pending: prev.pending + 1 }));
      setFormOpen(false);
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const { data } = await todoAPI.update(editing._id, formData);
      setTodos((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      setEditing(null);
      setFormOpen(false);
      toast.success('Task updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      const { data } = await todoAPI.update(id, { completed });
      setTodos((prev) => prev.map((t) => (t._id === id ? data : t)));
      setStats((prev) => ({
        ...prev,
        completed: completed ? prev.completed + 1 : prev.completed - 1,
        pending: completed ? prev.pending - 1 : prev.pending + 1,
      }));
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await todoAPI.delete(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
      setStats((prev) => ({
        ...prev,
        total: prev.total - 1,
        completed: prev.completed - (todos.find((t) => t._id === id)?.completed ? 1 : 0),
        pending: prev.pending - (todos.find((t) => t._id === id)?.completed ? 0 : 1),
      }));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (todo) => {
    setEditing(todo);
    setFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editing) handleUpdate(data);
    else handleCreate(data);
  };

  const statCards = [
    { label: 'Total', value: stats.total, color: 'from-indigo-500 to-purple-600', icon: FiList },
    { label: 'Completed', value: stats.completed, color: 'from-emerald-500 to-green-600', icon: FiCheckCircle },
    { label: 'Pending', value: stats.pending, color: 'from-amber-500 to-orange-600', icon: FiClock },
    { label: 'High Priority', value: stats.highPriority, color: 'from-rose-500 to-pink-600', icon: FiAlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
            {filters.map((f) => {
              const Icon = f.icon;
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-xl border text-sm bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
              />
            </div>
            <motion.button
              onClick={() => { setEditing(null); setFormOpen(true); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              <FiPlus className="w-4 h-4" />
              Add Task
            </motion.button>
          </div>
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-sm text-slate-400">Loading tasks...</span>
            </div>
          </div>
        ) : todos.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-2.5">
              {todos.map((todo, i) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  index={i}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <TodoForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleFormSubmit}
        initial={editing}
      />
    </div>
  );
};

export default Dashboard;
