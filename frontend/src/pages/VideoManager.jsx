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
    ? 'bg-blue-700 hover:bg-blue-600'
    : 'bg-blue-600 hover:bg-blue-700';

  const headerBg = theme === 'dark'
    ? 'bg-gradient-to-r from-blue-800 to-blue-700'
    : 'bg-gradient-to-r from-blue-600 to-blue-500';

  const emptyStateBg = theme === 'dark'
    ? 'bg-gray-800/80 text-gray-300'
    : 'bg-white text-gray-700';

  const borderColor = theme === 'dark'
    ? 'border-gray-700'
    : 'border-gray-300';

  return (
    <div className={`min-h-screen p-6 ${bgColor} ${textColor}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Video Manager</h1>
          <p className="opacity-80">Upload and manage your video collection</p>
        </div>

        {/* Upload Form */}
        <div className={`rounded-xl shadow-lg overflow-hidden mb-10 transition-all hover:shadow-xl ${cardBg}`}>
          <div className={`p-4 ${headerBg}`}>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaUpload className="mr-2" /> Upload New Video
            </h2>
          </div>
          
          <form onSubmit={handleUpload} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-medium">Title</label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value})}
                  className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg}`}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Description</label>
                <textarea
                  placeholder="Enter video description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg}`}
                  rows="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-medium flex items-center">
                  <FaVideo className="mr-2" /> Video File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className={`p-4 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className="text-center">
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{videoFile ? videoFile.name : 'Select video file (MP4, etc.)'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium flex items-center">
                  <FaImage className="mr-2" /> Thumbnail Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className={`p-4 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className="text-center">
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{thumbnailFile ? thumbnailFile.name : 'Select thumbnail (JPG, PNG)'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className={`text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors shadow-md hover:shadow-lg ${buttonBg}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Video List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Videos ({videos.length})</h2>
          
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className={`rounded-xl shadow p-8 text-center ${emptyStateBg}`}>
              <div className="opacity-70 mb-4">
                <FaVideo size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Videos Found</h3>
              <p className="opacity-80">Upload your first video using the form above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoManager;