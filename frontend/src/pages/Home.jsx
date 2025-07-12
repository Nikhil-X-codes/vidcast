import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useTheme } from '../context/Toggle';
import Profile from './Profile';
import { Brightness4, Brightness7, Person, ExitToApp } from '@mui/icons-material';

const Home = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const phrases = [
    "Welcome to Vidcast",
    "Discover amazing videos",
    "Share your story",
    "Connect with creators",
    "Join our community"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    let timeout;

    if (!isDeleting && typingText.length < currentPhrase.length) {
      // Typing phase
      timeout = setTimeout(() => {
        setTypingText(currentPhrase.substring(0, typingText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && typingText.length === currentPhrase.length) {
      // Pause at full phrase
      timeout = setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(50);
      }, 2000);
    } else if (isDeleting && typingText.length > 0) {
      // Deleting phase
      timeout = setTimeout(() => {
        setTypingText(currentPhrase.substring(0, typingText.length - 1));
      }, typingSpeed);
    } else if (isDeleting && typingText.length === 0) {
      // Move to next phrase
      setIsDeleting(false);
      setCurrentIndex((currentIndex + 1) % phrases.length);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timeout);
  }, [typingText, currentIndex, isDeleting]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('profile');
    setDropdownOpen(false);
  };

  return (
    <div className={`min-h-screen w-full p-6 transition-all duration-500 ease-in-out ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'
    }`}>
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full ${
              theme === 'dark' ? 'bg-pink-400/20' : 'bg-pink-500/20'
            }`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header with user controls */}
        <header className="flex items-center justify-end mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === 'dark' 
                  ? 'text-yellow-300 hover:bg-gray-700/50 hover:rotate-12' 
                  : 'text-gray-700 hover:bg-gray-200/50 hover:-rotate-12'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Brightness7 className="w-6 h-6" /> : <Brightness4 className="w-6 h-6" />}
            </button>

            <div ref={dropdownRef} className="relative">
              <div className="group relative">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username?.charAt(0) || 'U'}&background=random`}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer object-cover ring-2 transition-all duration-300 shadow-lg group-hover:ring-4 group-hover:scale-110 ${
                    theme === 'dark' 
                      ? 'ring-pink-500 group-hover:ring-pink-400' 
                      : 'ring-pink-600 group-hover:ring-pink-500'
                  }"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              
              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 origin-top-right animate-fadeIn ${
                  theme === 'dark' 
                    ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
                    : 'bg-white/90 backdrop-blur-md border-gray-200'
                } border`}>
                  <button
                    onClick={goToProfile}
                    className={`w-full px-4 py-3 text-left flex items-center transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700/70 text-gray-200' 
                        : 'hover:bg-pink-50 text-gray-800'
                    }`}
                  >
                    <Person className="mr-2 text-pink-500" fontSize="small" />
                    <span className="text-sm font-medium">Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full px-4 py-3 text-left flex items-center transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700/70 text-gray-200 border-t-gray-700' 
                        : 'hover:bg-pink-50 text-gray-800 border-t-gray-200'
                    } border-t`}
                  >
                    <ExitToApp className="mr-2 text-pink-500" fontSize="small" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mt-8 flex flex-col items-center justify-center min-h-[70vh] px-4">
          {/* Enhanced Typewriter Animation */}
          <div className="text-center mb-12 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className={`relative ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>
                {typingText}
                <span className={`absolute -right-3 h-full w-0.5 ${theme === 'dark' ? 'bg-pink-400' : 'bg-pink-600'} animate-blink`}></span>
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              The best place to share your videos with the world
            </p>
            <div className="flex justify-center space-x-4 mt-8">
              <button 
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                } shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                onClick={() => navigate('/my-video')}
              >
                Upload Video
              </button>
              <button 
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-transparent hover:bg-gray-700/50 text-pink-400 border border-pink-400' 
                    : 'bg-transparent hover:bg-pink-100 text-pink-600 border border-pink-500'
                } shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                onClick={() => navigate('/search')}
              >
                Explore Content
              </button>
            </div>
          </div>
        </main>

        <Routes>
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>

      {/* Global styles for animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;