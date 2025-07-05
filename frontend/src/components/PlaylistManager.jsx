import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoList from './VideoList';
import {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    fetchAllPlaylists,
    fetchPlaylist
} from '../services/playlist'

const PlaylistManager = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(false);
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [editing, setEditing] = useState(false);
    const [newVideoId, setNewVideoId] = useState('');
     const [userId, setUserId] = useState(null);

     useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData._id) {
        setUserId(userData._id);
    }
}, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                if (playlistId) {
                    const playlistResponse = await fetchPlaylist(playlistId);
                    setPlaylist(playlistResponse.data);
                    setFormData({
                        name: playlistResponse.data.name,
                        description: playlistResponse.data.description
                    });
                }
                if (userId) { 
                    const playlistsResponse = await fetchAllPlaylists(userId);
                    setAllPlaylists(playlistsResponse.data);
                    localStorage.setItem('userPlaylists', JSON.stringify(playlistsResponse.data));
                }
            } catch (err) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [playlistId, userId]);

    const loadPlaylist = async () => {
        try {
            setLoading(true);
            const response = await fetchPlaylist(playlistId);
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
            const updatedPlaylists = [...allPlaylists, response.data];
            setAllPlaylists(updatedPlaylists);
            localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
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
            const updatedPlaylists = allPlaylists.filter(p => p._id !== playlistId);
            setAllPlaylists(updatedPlaylists);
            localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
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

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            {error && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
                    {error}
                </div>
            )}

            {!playlistId ? (
                <div className="space-y-8">
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

                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Your Playlists
                        </h2>
                        
                        {allPlaylists.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allPlaylists.map(playlist => (
                                    <div 
                                        key={playlist._id}
                                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="relative pb-[56.25%] bg-gray-200">
                                            {playlist.videos?.length > 0 ? (
                                                <img 
                                                    src={playlist.videos[0].thumbnail} 
                                                    alt={playlist.name}
                                                    className="absolute h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-1">{playlist.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{playlist.description}</p>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>{playlist.videos?.length || 0} videos</span>
                                                <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <p className="mt-2 text-gray-500">No playlists yet. Create one to get started!</p>
                            </div>
                        )}
                    </div>
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
                
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Videos in this Playlist
                        </h3>
                        {playlist.videos && playlist.videos.length > 0 ? (
                            <VideoList
                                videos={playlist.videos}
                                onRemove={handleRemoveVideo}
                                showRemove={true}
                            />
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2 text-gray-500">No videos in this playlist yet.</p>
                            </div>
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