import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { dark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5 cursor-pointer focus:outline-none"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md"
        animate={{ x: dark ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {dark ? (
          <FiMoon className="w-3.5 h-3.5 text-indigo-600" />
        ) : (
          <FiSun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
