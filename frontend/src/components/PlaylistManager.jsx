
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoList from './VideoList';
import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getPlaylist
} from '../services/playlist'

const PlaylistManager = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [editing, setEditing] = useState(false);
    const [newVideoId, setNewVideoId] = useState('');

    useEffect(() => {
        if (playlistId) {
            loadPlaylist();
        }
    }, [playlistId]);

    const loadPlaylist = async () => {
        try {
            setLoading(true);
            const response = await getPlaylist(playlistId);
            setPlaylist(response.data);
            setFormData({
                name: response.data.name,
                description: response.data.description
            });
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load playlist');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await createPlaylist(formData.name, formData.description);
            navigate(`/playlist/${response.data._id}`);
        } catch (err) {
            setError(err.message || 'Failed to create playlist');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updatePlaylist(playlistId, formData.name, formData.description);
            setEditing(false);
            loadPlaylist();
        } catch (err) {
            setError(err.message || 'Failed to update playlist');
        }
    };

    const handleDelete = async () => {
        try {
            await deletePlaylist(playlistId);
            navigate('/playlists');
        } catch (err) {
            setError(err.message || 'Failed to delete playlist');
        }
    };

    const handleAddVideo = async () => {
        try {
            await addVideoToPlaylist(playlistId, newVideoId);
            setNewVideoId('');
            loadPlaylist();
        } catch (err) {
            setError(err.message || 'Failed to add video to playlist');
        }
    };

    const handleRemoveVideo = async (videoId) => {
        try {
            await removeVideoFromPlaylist(playlistId, videoId);
            loadPlaylist();
        } catch (err) {
            setError(err.message || 'Failed to remove video from playlist');
        }
    };

    if (loading) return <div>Loading...</div>;

   return (
    <div className="max-w-5xl mx-auto p-6">
        {error && (
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
                {error}
            </div>
        )}

        {!playlistId ? (
            <div className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Create New Playlist</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description:</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Create Playlist
                    </button>
                </form>
            </div>
        ) : (
            <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
                {editing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description:</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-x-3">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div>
                            <h2 className="text-2xl font-bold">{playlist.name}</h2>
                            <p className="text-gray-600">{playlist.description}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Delete Playlist
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Videos in this Playlist</h3>
                    {playlist.videos && playlist.videos.length > 0 ? (
                        <VideoList
                            videos={playlist.videos}
                            onRemove={handleRemoveVideo}
                            showRemove={true}
                        />
                    ) : (
                        <p className="text-gray-500">No videos in this playlist yet.</p>
                    )}
                </div>

                <div className="mt-6">
                    <h4 className="text-lg font-medium mb-2">Add Video</h4>
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            value={newVideoId}
                            onChange={(e) => setNewVideoId(e.target.value)}
                            placeholder="Enter Video ID"
                            className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddVideo}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add Video
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);

};

export default PlaylistManager;