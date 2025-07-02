import React, { useEffect, useState } from 'react';
import { getWatchHistory } from '../services/videoService'; 
import VideoCard from '../components/VideoCard';

const History = () => {
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="p-6">Loading watch history...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Watch History</h1>
        <p className="text-red-500">{error}</p>
        <p>Please check your authentication and try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Watch History</h1>
      {watchedVideos.length > 0 ? (
        <div className="space-y-6">
          {watchedVideos.map((video) => (
            <VideoCard key={video._id} video={video} readOnly={true}  />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No watch history found.</p>
      )}
    </div>
  );
};

export default History;