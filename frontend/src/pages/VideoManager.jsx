import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';
import {
  fetchVideos,
  uploadVideo,
  deleteVideo,
  updateVideo,
  getview,
} from '../services/videoService';

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

  const handleUpdate = async (id, title, desc) => {
    try {
      await updateVideo(id, title, desc);
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Video Manager</h1>

      <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow mb-8 space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Title</span>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Description</span>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Upload Video File (MP4, etc.)</span>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full mt-1"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Upload Thumbnail Image (JPG, PNG)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="w-full mt-1"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>

      <div className="space-y-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onView={handleView}
            />
          ))
        ) : (
          <p className="text-gray-500">No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default VideoManager;
