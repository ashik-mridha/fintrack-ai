import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [checking, setChecking] = useState(!!localStorage.getItem('token'));

  const saveSession = ({ token, user: nextUser }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('fintrack:logout', onLogout);
    return () => window.removeEventListener('fintrack:logout', onLogout);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      return;
    }
    authApi
      .me()
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      })
      .catch(() => clearSession())
      .finally(() => setChecking(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    saveSession(data);
  };

  const register = async (name, email, password) => {
    const { data } = await authApi.register({ name, email, password });
    saveSession(data);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, register, logout: clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
