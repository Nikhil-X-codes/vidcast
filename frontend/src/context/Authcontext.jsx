import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/login`, { email, password }, {
      withCredentials: true, 
    });

    const userData = res.data.data.user;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); 

    return true;
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Login failed');
    return false;
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const signIn = async (form) => {
    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      if (form.avatar) formData.append('avatar', form.avatar);
      if (form.coverimage) formData.append('coverimage', form.coverimage);

     const res = await axios.post(`${API_BASE_URL}/users/register`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

      // Auto-login after registration
      if (res.data.success) {
        return await login(form.email, form.password);
      }
      
      return true;
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);