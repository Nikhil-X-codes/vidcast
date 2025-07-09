import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/login`, { email, password });

setUser(res.data.data.user);
localStorage.setItem('user', JSON.stringify(res.data.data.user));


    return true;
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    alert(err.response?.data?.message || 'Login failed');
    return false;
  }
};

  const logout = () => {
    setUser(null);
  };

const signIn = async (form) => {
  try {
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('avatar', form.avatar);
    formData.append('coverimage', form.coverimage); 

    const res = await axios.post(`${API_BASE_URL}/users/register`, formData, {
      headers: {
        'Content-Type': 'form-data',
      },
    });

    console.log('User registered:', res.data);
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
