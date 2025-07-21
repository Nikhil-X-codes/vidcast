import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVideoById } from '../services/videoService';
import { getview } from '../services/videoService'; 
import ReactPlayer from 'react-player';
import { ArrowLeft } from '@mui/icons-material';

const SearchVideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCounted, setViewCounted] = useState(false); 

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const response = await fetchVideoById(videoId);

        if (response.data?.status === 'Video fetched successfully') {
          setVideo(response.data.message);
        } else {
          console.error('Failed to fetch video:', response.data?.message);
        }
      } catch (err) {
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId]);

  // Function to call view count API when video starts playing
  const handleVideoStart = async () => {
    if (!viewCounted) {
      try {
        await getview(videoId); // Call API to increase view
        setViewCounted(true);
      } catch (err) {
        console.error('Failed to update view count:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="ml-2">Back to results</span>
        </button>

        <div className="relative pt-[56.25%]">
          <ReactPlayer
            className="absolute top-0 left-0"
            src={video.video}
            width="100%"
            height="100%"
            controls
            onStart={handleVideoStart} 
          />
        </div>
      </div>
    </div>
  );
};

export default SearchVideoPlayer;
