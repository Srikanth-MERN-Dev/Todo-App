import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      authAPI.getMe()
        .then((res) => {
          const updated = { ...parsed, ...res.data };
          setUser(updated);
          localStorage.setItem('user', JSON.stringify(updated));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    toast.success('Welcome back!');
    return data;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { data } = await authAPI.register({ username, email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    toast.success('Account created successfully!');
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
