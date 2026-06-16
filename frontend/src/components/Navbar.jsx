import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiCheckSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FiCheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          {user && (
            <>
              <div className="hidden md:flex items-center gap-4">
                <ThemeToggle />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {user.username}
                </span>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>

              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70"
          >
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {user.username}
                </span>
                <ThemeToggle />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
