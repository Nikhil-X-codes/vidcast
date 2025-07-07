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
  const cardShadow = theme === 'dark' ? 'shadow-lg shadow-gray-800' : 'shadow-md shadow-gray-300';
  const messageBg = theme === 'dark'
    ? 'bg-gray-800 text-red-300 border border-red-500'
    : 'bg-red-100 text-red-700 border border-red-400';
  const loadBtn = theme === 'dark'
    ? 'bg-blue-700 hover:bg-blue-800'
    : 'bg-blue-500 hover:bg-blue-600';
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
    <div className={`${bgColor} min-h-screen py-8 px-4 transition-colors duration-300`}>
      <div className="container mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${textColor}`}>Your Liked Videos</h1>

        {error && (
          <div className={`${messageBg} px-4 py-3 rounded mb-4`}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map(video => (
            <div key={video._id} className={`${cardShadow} rounded-xl overflow-hidden`}>
              <VideoCard video={video} readOnly={true} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-400">Loading...</p>
          </div>
        )}

        {hasMore && videos.length > 0 && !loading && (
          <div className="text-center mt-6">
            <button
              onClick={handleLoadMore}
              className={`${loadBtn} text-white font-medium py-2 px-4 rounded transition duration-200`}
            >
              Load More
            </button>
          </div>
        )}

        {!hasMore && videos.length > 0 && (
          <p className={`text-center mt-4 ${noMoreText}`}>No more videos to load</p>
        )}

        {!initialLoad && videos.length === 0 && !loading && (
          <div className="text-center py-10">
            <p className={`${noMoreText}`}>You haven't liked any videos yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Like;
