import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = '/Auth';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/manage/info`, { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // 401 errors are expected when the user is not authenticated
          console.warn('User not authenticated.');
        } else {
          console.error('Error fetching user info:', error);
        }
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    await axios.post(`${API_BASE_URL}/login?useCookies=true`, { email, password }, { withCredentials: true });
    const response = await axios.get(`${API_BASE_URL}/Manage/Info`, { withCredentials: true });
    setUser(response.data);
  };

  const register = async (email, password) => {
    await axios.post(`${API_BASE_URL}/register`, { email, password }, { withCredentials: true });
  };

  const logout = async () => {
    await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
