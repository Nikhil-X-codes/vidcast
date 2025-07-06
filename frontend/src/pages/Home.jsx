import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useTheme } from '../context/Toggle';
import Profile from './Profile';
import { Brightness4, Brightness7, Person, ExitToApp, Search } from '@mui/icons-material';

const Home = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('profile');
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement your search functionality here
    console.log('Searching for:', searchQuery);
    // navigate(`/search?q=${searchQuery}`);
  };

  // Theme classes
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const dropdownBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const dropdownHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const dropdownBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const searchBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const searchBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const searchFocus = theme === 'dark' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className={`relative min-h-screen w-full p-6 ${bgColor} ${textColor} transition-colors duration-300`}>
      {/* Header with search and user controls */}
      <div className="flex items-center justify-between mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mr-4">
          <div className={`relative flex items-center rounded-full ${searchBg} ${searchBorder} border px-4 py-2 shadow-sm`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              ref={searchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos, channels..."
              className={`block w-full rounded-md ${searchBg} py-2 pl-10 pr-3 ${textColor} placeholder-gray-400 ${searchFocus} sm:text-sm`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* User Controls */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} transition-colors`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </button>

          {/* User Dropdown */}
          <div ref={dropdownRef} className="relative">
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer object-cover ring-2 ring-blue-500 hover:ring-blue-600 transition-all"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 ${dropdownBg} border ${dropdownBorder} rounded-md shadow-lg z-50 overflow-hidden transition-all duration-200`}>
                <button
                  onClick={goToProfile}
                  className={`w-full px-4 py-3 text-left flex items-center ${dropdownHover} transition-colors`}
                >
                  <Person className="mr-2" fontSize="small" />
                  <span className="text-sm">Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-3 text-left flex items-center ${dropdownHover} transition-colors border-t ${dropdownBorder}`}
                >
                  <ExitToApp className="mr-2" fontSize="small" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8">
        <Routes>
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;