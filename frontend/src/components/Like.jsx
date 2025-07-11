import React, { useState, useEffect } from 'react';
import { getLikedVideos } from '../services/addService';
import VideoCard from './VideoCard';
import { useTheme } from '../context/Toggle';

const Like = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const { theme } = useTheme();

  const bgColor = theme === 'dark'
    ? 'bg-gradient-to-tr from-gray-900 via-gray-800 to-black'
    : 'bg-gradient-to-br from-pink-100 via-blue-100 to-green-100';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const cardShadow = theme === 'dark' ? 'shadow-lg shadow-gray-800/50' : 'shadow-xl shadow-gray-300/50';
  const messageBg = theme === 'dark'
    ? 'bg-red-900/30 text-red-300 border-l-4 border-red-500'
    : 'bg-red-100/80 text-red-700 border-l-4 border-red-400';
  const loadBtn = theme === 'dark'
    ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500'
    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500';
  const noMoreText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  useEffect(() => {
    const fetchLikedVideos = async () => {
      if (loading) return;

      setLoading(true);
      try {
        const response = await getLikedVideos(page);
        if (response.status === 200) {
          const newVideos = response.data.docs || [];

          setVideos(prev => {
            if (page === 1) return newVideos;
            const combined = [...prev, ...newVideos];
            return combined.filter((video, index, self) =>
              index === self.findIndex(v => v._id === video._id)
            );
          });

          setHasMore(newVideos.length > 0);
          setError(null);
        } else {
          throw new Error(response.message || 'Failed to fetch liked videos');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch liked videos');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchLikedVideos();
  }, [page]);

  useEffect(() => {
    if (!initialLoad && videos.length === 0) {
      localStorage.removeItem('likedVideos');
    }
  }, [videos, initialLoad]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className={`${bgColor} min-h-screen py-8 px-4 transition-colors duration-300 relative overflow-hidden`}>
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full ${
              theme === 'dark' ? 'bg-blue-400/10' : 'bg-blue-500/10'
            }`}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${textColor} bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent`}>
            Your Liked Videos
          </h1>
          {videos.length > 0 && (
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              theme === 'dark' ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>
              {videos.length} Videos
            </span>
          )}
        </div>

        {error && (
          <div className={`${messageBg} px-6 py-4 rounded-lg mb-8 flex items-center animate-fadeIn`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {videos.map(video => (
            <div 
              key={video._id} 
              className={`${cardShadow} rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${theme === 'dark' ? 'hover:shadow-gray-800/70' : 'hover:shadow-gray-400/50'}`}
            >
              <VideoCard video={video} readOnly={true} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Loading your favorite videos...</p>
          </div>
        )}

        {hasMore && videos.length > 0 && !loading && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              className={`${loadBtn} text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Load More
            </button>
          </div>
        )}

        {!hasMore && videos.length > 0 && (
          <div className={`text-center mt-8 py-4 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100/50'} rounded-xl`}>
            <p className={`${noMoreText} flex items-center justify-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              You've reached the end
            </p>
          </div>
        )}

        {!initialLoad && videos.length === 0 && !loading && (
          <div className={`text-center py-16 rounded-xl ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className={`text-xl font-medium mb-2 ${textColor}`}>No Liked Videos Yet</h3>
            <p className={`${noMoreText} max-w-md mx-auto`}>
              Videos you like will appear here. Start exploring and like some videos!
            </p>
          </div>
        )}
      </div>

<style>{`
  @keyframes float {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`}</style>

<style>{`
  /* Global styles here if needed */
`}</style>
    </div>
  );
};

export default Like;