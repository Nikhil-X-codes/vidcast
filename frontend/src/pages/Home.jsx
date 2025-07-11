import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useTheme } from '../context/Toggle';
import Profile from './Profile';
import { Brightness4, Brightness7, Person, ExitToApp, Search } from '@mui/icons-material';
import { fetchsearchVideos } from '../services/videoService';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('profile');
    setDropdownOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetchsearchVideos(searchQuery);
      
      if (response.data.status === "Videos fetched successfully" && response.data.message?.videos) {
        const transformedVideos = response.data.message.videos.map(video => ({
          _id: video['.id'] || video._id,
          video: video.video,
          thumbnail: video.thumbnail,
          owner: video.owner ? {
            _id: video.owner['.id'] || video.owner._id,
            username: video.owner.username,
            avatar: video.owner.avatar
          } : {
            _id: 'unknown',
            username: 'Unknown',
            avatar: 'https://via.placeholder.com/40'
          },
          title: video.title,
          description: video.description,
          views: video.views || 0,
          likes: video.likes || 0,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt
        }));
        
        setSearchResults(transformedVideos);
      } else {
        setSearchResults([]);
        setError(response.data.message || 'No videos found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to fetch search results');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
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
        {/* Header with search and user controls */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="w-full md:w-auto md:flex-1 md:max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative flex items-center rounded-full transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800/90 backdrop-blur-md border-gray-700 hover:bg-gray-800/80' 
                  : 'bg-white/90 backdrop-blur-md border-gray-200 hover:bg-white/80'
              } border px-4 py-2 shadow-lg hover:shadow-xl`}>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <input
                  type="text"
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos, channels..."
                  className={`block w-full rounded-md bg-transparent py-2 pl-10 pr-3 ${
                    theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-pink-500' : 'focus:ring-pink-400'
                  } sm:text-sm`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`absolute right-3 ${
                      theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    } transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>

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
        <main className="mt-8">
          {/* Search Results Section */}
          {searchQuery && (
            <div className="mb-8 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Search className="mr-2 text-pink-500" />
                Search Results for "{searchQuery}"
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                  <span className="ml-3 text-lg">Searching...</span>
                </div>
              ) : error ? (
                <div className={`text-center py-8 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
                }`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-pink-100 text-pink-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className={`text-lg font-medium ${
                    theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
                  }`}>{error}</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((video) => (
                    <VideoCard 
                      key={video._id} 
                      video={video} 
                      readOnly={true}
                      theme={theme}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
                }`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-pink-100 text-pink-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-lg font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>No videos found</h3>
                  <p className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>Try different search terms</p>
                </div>
              )}
            </div>
          )}

          <Routes>
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;