import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Profile from './Profile';

const Home = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('profile'); 
    setDropdownOpen(false);
  };

  return (
    <div className="relative h-full w-full p-6">
      <div className="absolute top-4 right-6" ref={dropdownRef}>
        <img
          src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
          alt="User Avatar"
          className="w-10 h-10 rounded-full cursor-pointer object-cover"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
            <button
              onClick={goToProfile}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 border-t"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="mt-20">
        <Routes>
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
