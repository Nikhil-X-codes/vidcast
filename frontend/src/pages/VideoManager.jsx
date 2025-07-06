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

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadVideos = async () => {
    try {
      const res = await fetchVideos();
      setVideos(res.data.message.videos || []);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      alert('Failed to load videos');
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
      alert('Failed to update video');
    }
  };

  const handleView = async (id) => {
    try {
      await getview(id);
      await loadVideos();
    } catch (err) {
      console.error('View tracking failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Video Manager</h1>
          <p className="text-gray-600">Upload and manage your video collection</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10 transition-all hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaUpload className="mr-2" /> Upload New Video
            </h2>
          </div>
          
          <form onSubmit={handleUpload} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Title</label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Description</label>
                <textarea
                  placeholder="Enter video description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium flex items-center">
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
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <p className="text-gray-600">{videoFile ? videoFile.name : 'Select video file (MP4, etc.)'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 font-medium flex items-center">
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
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <p className="text-gray-600">{thumbnailFile ? thumbnailFile.name : 'Select thumbnail (JPG, PNG)'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors shadow-md hover:shadow-lg"
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Videos ({videos.length})</h2>
          
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onView={handleView}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaVideo size={48} className="mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Videos Found</h3>
              <p className="text-gray-500">Upload your first video using the form above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoManager;
