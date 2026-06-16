import { motion } from 'framer-motion';
import { FiTrash2, FiEdit2, FiCheck, FiClock, FiFlag } from 'react-icons/fi';

const priorityConfig = {
  low: { color: 'text-green-500 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Low' },
  medium: { color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Medium' },
  high: { color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', label: 'High' },
};

const TodoCard = ({ todo, onToggle, onEdit, onDelete, index }) => {
  const p = priorityConfig[todo.priority] || priorityConfig.medium;
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      layout
      className={`group relative rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-700/40'
          : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <motion.button
            onClick={() => onToggle(todo._id, !todo.completed)}
            whileTap={{ scale: 0.9 }}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              todo.completed
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-transparent'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
            }`}
          >
            {todo.completed && <FiCheck className="w-3 h-3 text-white" />}
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`text-sm font-semibold leading-snug ${
                todo.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}>
                {todo.title}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(todo)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(todo._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {todo.description && (
              <p className={`mt-1 text-xs leading-relaxed ${
                todo.completed
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {todo.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${p.bg} ${p.color}`}>
                <FiFlag className="w-2.5 h-2.5" />
                {p.label}
              </span>

              {todo.dueDate && (
                <span className={`inline-flex items-center gap-1 text-[10px] ${
                  isOverdue ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  <FiClock className="w-2.5 h-2.5" />
                  {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}

              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoCard;
