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
  const cardBg = theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/95';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Watch History</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-lg">Loading...</div>
          </div>
        ) : error ? (
          <div className={`p-4 rounded-lg ${cardBg} ${borderColor} border`}>
            <p className="text-red-500">{error}</p>
          </div>
        ) : watchedVideos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {watchedVideos.map((video) => (
              <div key={video._id} className={`rounded-xl overflow-hidden ${cardBg} ${borderColor} border`}>
                <VideoCard 
                  video={video} 
                  hideInteractions={true}  // This will hide like/comment buttons
                  showComments={false}     // This will hide comments section
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-8 text-center rounded-xl ${cardBg} ${borderColor} border`}>
            <p>Your watch history is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;