import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../api/axiosInstance';

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
    api.post('/auth/refresh')   
      .then(({ data }) => {
        setAuthToken(data.accessToken);
        setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setAuthToken(data.accessToken);
    setUser(data.user);
  };

  const signup = async (credentials) => {
    const { data } = await api.post('/auth/signup', credentials);
    setAuthToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);