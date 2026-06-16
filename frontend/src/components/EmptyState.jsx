import { motion } from 'framer-motion';
import { FiClipboard } from 'react-icons/fi';

const EmptyState = ({ filter }) => {
  const messages = {
    all: { title: 'No tasks yet', desc: 'Create your first task to get started' },
    completed: { title: 'No completed tasks', desc: 'Complete a task to see it here' },
    pending: { title: 'No pending tasks', desc: 'You\'re all caught up!' },
  };

  const msg = messages[filter] || messages.all;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center mb-5">
        <FiClipboard className="w-9 h-9 text-indigo-400 dark:text-indigo-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {msg.title}
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500">
        {msg.desc}
      </p>
    </motion.div>
  );
};

export default EmptyState;
