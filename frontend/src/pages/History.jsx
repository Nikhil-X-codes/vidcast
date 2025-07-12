import React, { useEffect, useState } from 'react';
import { getWatchHistory } from '../services/videoService';
import VideoCard from '../components/VideoCard';
import { useTheme } from '../context/Toggle';

const History = () => {
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // Theme styles
  const bgColor = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const emptyStateBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80';
  const errorBg = theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100';

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await getWatchHistory();
        
        if (typeof res.data === 'string' && res.data.startsWith('<!doctype html>')) {
          throw new Error('Received HTML response - likely authentication issue');
        }

        setWatchedVideos(res.data?.videos || res.data?.data || []);
      } catch (err) {
        console.error('Failed to load watch history', err);
        setError(err.message || 'Failed to load watch history');
        setWatchedVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className={`min-h-screen p-6 ${bgColor} ${textColor} transition-all duration-300`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Watch History
        </h1>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg">Loading your history...</p>
          </div>
        ) : error ? (
          <div className={`p-6 rounded-xl ${errorBg} border-l-4 border-red-500 shadow-md mb-8 animate-fadeIn`}>
            <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading History</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : watchedVideos.length > 0 ? (
          <>
            <div className="flex items-center mb-6">
              <span className={`text-lg font-medium ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
                {watchedVideos.length} {watchedVideos.length === 1 ? 'video' : 'videos'} watched
              </span>
              <span className={`ml-3 px-3 py-1 rounded-full text-sm font-bold ${
                theme === 'dark' ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                Recent Activity
              </span>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {watchedVideos.map((video) => (
                <div 
                  key={video._id} 
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${cardBg} ${borderColor} border`}
                >
                  <VideoCard 
                    video={video} 
                    hideInteractions={true}  
                    showComments={false} 
                    hideActions={true} 
                    readOnly={true}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={`p-12 text-center rounded-xl shadow-md ${emptyStateBg} ${borderColor} border flex flex-col items-center justify-center`}>
            <div className={`w-24 h-24 rounded-full ${
              theme === 'dark' ? 'bg-gray-700/50 text-blue-400' : 'bg-blue-100 text-blue-600'
            } flex items-center justify-center mb-6`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Watch History is Empty</h3>
            <p className="max-w-md mx-auto opacity-90">
              Videos you watch will appear here to help you keep track of what you've seen
            </p>
          </div>
        )}
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
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default History;