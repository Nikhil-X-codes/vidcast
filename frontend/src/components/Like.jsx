import React, { useState, useEffect } from 'react';
import { getLikedVideos } from '../services/addService';
import VideoCard from './VideoCard';

const Like = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      if (loading) return;
      
      setLoading(true);
      try {
        const response = await getLikedVideos(page);
        if (response.status === 200) {
          const newVideos = response.data.docs || [];
          
          setVideos(prev => {
            // On first load, replace with new videos
            if (page === 1) return newVideos;
            
            // Otherwise combine with existing
            const combined = [...prev, ...newVideos];
            // Remove duplicates
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

  // Clear both state and localStorage when there are no liked videos
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Liked Videos</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard 
            key={video._id} 
            video={video}
            readOnly={true}
          />
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {hasMore && videos.length > 0 && !loading && (
        <div className="text-center mt-6">
          <button 
            onClick={handleLoadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Load More
          </button>
        </div>
      )}

      {!hasMore && videos.length > 0 && (
        <p className="text-center text-gray-500 mt-4">No more videos to load</p>
      )}

      {!initialLoad && videos.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't liked any videos yet</p>
        </div>
      )}
    </div>
  );
};

export default Like;