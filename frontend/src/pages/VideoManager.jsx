import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import {
  fetchVideos,
  uploadVideo,
  deleteVideo,
  updateVideo,
  getview,
} from '../services/videoService';
import { FaUpload, FaVideo, FaImage, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../context/Toggle';

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const loadVideos = async (options = {}) => {
    try {
      const res = await fetchVideos();
      setVideos(res.data.message.videos || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setVideos([]); 
      } else {
        console.error("Failed to fetch videos:", err);
      }
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      return alert('Please select both video and thumbnail');
    }

    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('video', videoFile);
    data.append('thumbnail', thumbnailFile);

    setLoading(true);
    try {
      await uploadVideo(data);
      setForm({ title: '', description: '' });
      setVideoFile(null);
      setThumbnailFile(null);
      await loadVideos();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVideo(id);
      await loadVideos();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete video');
    }
  };

  const handleUpdate = async (id, title, description) => {
    try {
      await updateVideo(id, title, description);
      await loadVideos();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await getview(id);
      if (response.status === 200) {  
        await loadVideos();
      }
    } catch (err) {
      console.error('View tracking failed:', err);
    }
  };

  const bgColor = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-gray-50 to-gray-100';

  const textColor = theme === 'dark'
    ? 'text-white'
    : 'text-gray-800';

  const cardBg = theme === 'dark'
    ? 'bg-gray-800/90 backdrop-blur-md'
    : 'bg-white';

  const inputBg = theme === 'dark'
    ? 'bg-gray-700/70 border-gray-600 text-white'
    : 'bg-white border-gray-300 text-gray-800';

  const buttonBg = theme === 'dark'
    ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500'
    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400';

  const headerBg = theme === 'dark'
    ? 'bg-gradient-to-r from-blue-900 to-blue-800'
    : 'bg-gradient-to-r from-blue-700 to-blue-600';

  const emptyStateBg = theme === 'dark'
    ? 'bg-gray-800/80 text-gray-300'
    : 'bg-white text-gray-700';

  const borderColor = theme === 'dark'
    ? 'border-gray-700'
    : 'border-gray-300';

  return (
    <div className={`min-h-screen p-6 ${bgColor} ${textColor} transition-colors duration-300`}>
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Video Manager
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Upload and manage your video collection with ease
          </p>
        </div>

        {/* Upload Form */}
        <div className={`rounded-2xl shadow-xl overflow-hidden mb-12 transition-all duration-300 hover:shadow-2xl ${cardBg} border ${borderColor}`}>
          <div className={`p-5 ${headerBg}`}>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaUpload className="mr-3 text-blue-200" /> 
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Upload New Video
              </span>
            </h2>
          </div>
          
          <form onSubmit={handleUpload} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block font-medium text-lg">Title</label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value})}
                  className={`w-full p-4 rounded-xl focus:ring-4 focus:ring-blue-300/50 focus:border-transparent transition-all duration-300 ${inputBg} border ${borderColor}`}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block font-medium text-lg">Description</label>
                <textarea
                  placeholder="Enter video description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`w-full p-4 rounded-xl focus:ring-4 focus:ring-blue-300/50 focus:border-transparent transition-all duration-300 ${inputBg} border ${borderColor}`}
                  rows="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block font-medium text-lg flex items-center">
                  <FaVideo className="mr-3 text-blue-500" /> Video File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className={`p-6 border-2 border-dashed rounded-xl hover:border-blue-500 transition-all duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'} flex flex-col items-center justify-center min-h-[120px]`}>
                    {videoFile ? (
                      <p className={`font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                        {videoFile.name}
                      </p>
                    ) : (
                      <>
                        <FaVideo className={`text-3xl mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                          Select video file (MP4, etc.)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block font-medium text-lg flex items-center">
                  <FaImage className="mr-3 text-blue-500" /> Thumbnail Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className={`p-6 border-2 border-dashed rounded-xl hover:border-blue-500 transition-all duration-300 ${theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'} flex flex-col items-center justify-center min-h-[120px]`}>
                    {thumbnailFile ? (
                      <p className={`font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                        {thumbnailFile.name}
                      </p>
                    ) : (
                      <>
                        <FaImage className={`text-3xl mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                          Select thumbnail (JPG, PNG)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`text-white px-8 py-4 rounded-xl font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl ${buttonBg}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-3" />
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Video List */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Your Videos
            </span>
            <span className={`ml-3 px-3 py-1 rounded-full text-sm font-bold ${
              theme === 'dark' ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>
              {videos.length}
            </span>
          </h2>
          
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onView={handleView}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            <div className={`rounded-2xl shadow-lg p-12 text-center transition-all duration-300 ${emptyStateBg} border ${borderColor}`}>
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  <FaVideo size={32} />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-medium mb-3">No Videos Found</h3>
              <p className="opacity-90 max-w-md mx-auto">
                Upload your first video to get started with your collection
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VideoManager;