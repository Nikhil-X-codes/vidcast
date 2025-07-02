import React, { useState, useEffect } from 'react';
import { getLikedVideos } from '../api/video';
import VideoCard from './VideoCard';
import Spinner from './Spinner';

const LikedVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const data = await getLikedVideos(page);
        setVideos(prev => [...prev, ...data.videos]);
        setHasMore(data.hasNextPage);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch liked videos');
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, [page]);

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

      {loading && <div className="text-center py-4"><Spinner /></div>}
      
      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button 
            onClick={() => setPage(prev => prev + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            Load More
          </button>
        </div>
      )}

      {!hasMore && !loading && videos.length > 0 && (
        <p className="text-center text-gray-500 mt-4">No more videos to load</p>
      )}

      {!loading && videos.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't liked any videos yet</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideosPage;