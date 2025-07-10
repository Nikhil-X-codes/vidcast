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
    console.log(user?.avatar);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const bgColor = theme === 'dark'
    ? 'bg-gradient-to-tr from-gray-900 via-gray-800 to-black'
    : 'bg-gradient-to-br from-pink-100 via-blue-100 to-green-100';

  const textColor = theme === 'dark'
    ? 'text-white drop-shadow'
    : 'text-gray-800 drop-shadow-md';

  const dropdownBg = theme === 'dark'
    ? 'bg-gray-900/90 backdrop-blur-md'
    : 'bg-white/90 backdrop-blur-md';

  const dropdownHover = theme === 'dark'
    ? 'hover:bg-gray-700/70'
    : 'hover:bg-blue-100/70';

  const dropdownBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';

  const searchBg = theme === 'dark'
    ? 'bg-gray-1000/70 backdrop-blur'
    : 'bg-white/90 backdrop-blur';

  const searchBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

  const searchFocus = 'focus:ring-pink-600 focus:border-pink-600';

  return (
    <div
      className={`relative min-h-screen w-full p-6 ${bgColor} ${textColor} transition-colors duration-300`}
      style={{
        backgroundSize: '400% 400%',
        animation: 'gradientMove 15s ease infinite',
      }}
    >
      <div className="flex items-center justify-between mb-8">

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mr-4">
          <div className={`relative flex items-center rounded-full ${searchBg} ${searchBorder} border px-4 py-2 shadow-lg`}>
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

        <div className="flex items-center space-x-4">

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'} transition-colors`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </button>

          <div ref={dropdownRef} className="relative">
<img
  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username?.charAt(0) || 'U'}&background=random`}
  alt="User Avatar"
  className="w-10 h-10 rounded-full cursor-pointer object-cover ring-2 ring-pink-400 hover:ring-pink-500 transition-all shadow-lg"
  onClick={() => setDropdownOpen(!dropdownOpen)}
/>
            {dropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 ${dropdownBg} border ${dropdownBorder} rounded-md shadow-xl z-50 overflow-hidden`}>
                <button
                  onClick={goToProfile}
                  className={`w-full px-4 py-3 text-left flex items-center ${dropdownHover} transition-colors`}
                >
                  <Person className="mr-2" fontSize="small" />
                  <span className="text-sm">Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-3 text-left flex items-center ${dropdownHover} border-t ${dropdownBorder} transition-colors`}
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
