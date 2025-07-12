import React, { useState } from 'react';
import { fetchsearchVideos } from '../services/videoService';
import VideoCard from '../components/VideoCard';
import { getview } from '../services/videoService';
import { Search, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SearchComponent = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

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

  const handleVideoView = async (videoId) => {
    try {
      await getview(videoId);
      
      setSearchResults(prevResults => 
        prevResults.map(video => 
          video._id === videoId 
            ? { ...video, views: (video.views || 0) + 1 } 
            : video
        )
      );
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  return (
    <div className="animate-fadeIn px-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto mt-8 mb-12"
      >
        <form onSubmit={handleSearch} className="relative">
          <div className={`relative flex items-center rounded-full transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-800/90 backdrop-blur-md border-gray-700 hover:bg-gray-800/80' 
              : 'bg-white/90 backdrop-blur-md border-gray-200 hover:bg-white/80'
          } border px-6 py-3 shadow-lg ${isFocused ? 'ring-2 ring-pink-500/50' : ''} ${
            theme === 'dark' ? 'hover:shadow-gray-800/50' : 'hover:shadow-gray-300/50'
          }`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <Search className={`h-5 w-5 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } ${isFocused ? (theme === 'dark' ? 'text-pink-400' : 'text-pink-500') : ''}`} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search videos, channels..."
              className={`block w-full rounded-full bg-transparent py-1 pl-12 pr-10 ${
                theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              } focus:outline-none text-lg`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className={`absolute right-4 p-1 rounded-full transition-all ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <Close className="h-5 w-5" />
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-full text-sm font-medium ${
              theme === 'dark' 
                ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            } shadow-md hidden sm:block`}
          >
            Search
          </motion.button>
        </form>
      </motion.div>

      {searchQuery && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <Search className={`mr-3 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
            <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
              Results for <span className="italic">"{searchQuery}"</span>
            </span>
          </h2>
          
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64"
            >
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-pink-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className={`h-6 w-6 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'} animate-pulse`} />
                </div>
              </div>
              <span className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Searching for videos...
              </span>
            </motion.div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-12 rounded-xl ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-50'}`}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-full bg-pink-100/50 text-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>
                Oops! Something went wrong
              </h3>
              <p className={`max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {error}
              </p>
              <button
                onClick={handleSearch}
                className={`mt-6 px-6 py-2 rounded-full font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-pink-600 hover:bg-pink-700 text-white' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                } shadow-md`}
              >
                Try Again
              </button>
            </motion.div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VideoCard 
                    video={video} 
                    readOnly={true}
                    theme={theme}
                    onView={() => handleVideoView(video._id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-16 rounded-xl ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-50'}`}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-full bg-pink-100/50 text-pink-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                No videos found
              </h3>
              <p className={`max-w-md mx-auto mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                We couldn't find any videos matching your search. Try different keywords or check your spelling.
              </p>
              <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                {['Trending', 'Music', 'Gaming', 'News'].map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery(suggestion)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    } transition-colors`}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchComponent;