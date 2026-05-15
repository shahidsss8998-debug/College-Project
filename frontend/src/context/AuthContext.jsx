import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      const userData = { 
        id: response.data._id,
        email: response.data.email, 
        role: response.data.role, 
        name: response.data.name,
        token: response.data.token
      };

      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('token', response.data.token);
      setUser(userData);
      return { success: true, role: response.data.role };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Something went wrong' 
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
