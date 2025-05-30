import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/api.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);  // if not needed then remove
  const navigate = useNavigate();

  const validateSession = async () => {
    try {
      const res = await axios.get('/validate-session', { withCredentials: true });
      setIsAuthenticated(true);
      setUserRole(res.data.role);
      setUserInfo(res.data.user);
    } catch (err) {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('/login', { username, password }, { withCredentials: true });
      setIsAuthenticated(true);
      setUserRole(res.data.role);
      setUserInfo(res.data.user);
      navigate(res.data.role === 'Admin' ? '/admin-dashboard' : '/faculty-dashboard');
    } catch (err) {
      alert('Login failed. Check your credentials.');
    }
  };

  const logout = async () => {
    await axios.post('/logout', {}, { withCredentials: true });   //change route if needed
    setIsAuthenticated(false);
    setUserRole(null);
    setUserInfo(null);
    navigate('/');
  };

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userInfo, login, logout, validateSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
