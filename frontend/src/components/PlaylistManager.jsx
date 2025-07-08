import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoList from './VideoList';
import Time from './Time';
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
    
const handleRemoveVideo = async () => {
    try {

        const videoToRemove = playlist.videos[0]._id; 
                
        if (!videoToRemove) {
            setError('No video found in playlist');
            return;
        }
        
        await removeVideoFromPlaylist(playlistId, videoToRemove);
        loadPlaylist();
    } catch (err) {
        setError(err.message || 'Failed to remove video from playlist');
    }
};

       if (loading) return (
        <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${theme === 'dark' ? 'border-purple-400' : 'border-purple-600'}`}></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {error && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded-lg shadow-lg max-w-md">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline ml-1">{error}</span>
                        </div>
                    </div>
                </div>
            )}

            {!playlistId ? (
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                            <h1 className="text-3xl font-bold">Create New Playlist</h1>
                            <p className="opacity-90">Organize your favorite videos into collections</p>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Playlist Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                        placeholder="My Awesome Playlist"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                                        placeholder="Describe what this playlist is about..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                                >
                                    Create Playlist
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                </svg>
                                Your Playlists
                            </h2>
                        </div>
                        
                        {allPlaylists.length > 0 ? (
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allPlaylists.map(playlist => (
                                    <div 
                                        key={playlist._id}
                                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                                        className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300"
                                    >
                                        <div className="relative pb-[56.25%] bg-gray-100 overflow-hidden">
                                            {playlist.videos?.length > 0 ? (
                                                <img 
                                                    src={playlist.videos[0].thumbnail} 
                                                    alt={playlist.name}
                                                    className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <div className="text-center p-4">
                                                        <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                <span className="text-white text-sm font-medium">
                                                    {playlist.videos?.length || 0} {playlist.videos?.length === 1 ? 'video' : 'videos'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg mb-1 text-gray-800 group-hover:text-purple-600 transition-colors">{playlist.name}</h3>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{playlist.description}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <Time date={playlist.createdAt} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <div className="max-w-md mx-auto">
                                    <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-700">No playlists yet</h3>
                                    <p className="mt-2 text-gray-500">Create your first playlist to organize your favorite videos</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    {editing ? (
                                        <h1 className="text-2xl font-bold">Edit Playlist</h1>
                                    ) : (
                                        <>
                                            <h1 className="text-2xl font-bold">{playlist.name || 'Untitled Playlist'}</h1>
                                            <p className="opacity-90 mt-1">{playlist.description || 'No description available'}</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex space-x-3">
                                    {!editing && (
                                        <>
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors border border-white/30"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {editing ? (
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Playlist Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                            rows="3"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : null}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="border-b border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                Videos in this Playlist
                            </h2>
                        </div>
                        <div className="p-6">
{playlist?.videos?.length > 0 ? (
    <VideoList
        videos={playlist.videos}
        onRemove={handleRemoveVideo}
        showRemove={true}
    />
) : (
    <div className="text-center py-10">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-700">No videos yet</h3>
        <p className="mt-2 text-gray-500">Add videos to get started with this playlist</p>
    </div>
)}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="border-b border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Video to Playlist
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-grow">
                                    <input
                                        type="text"
                                        value={newVideoId}
                                        onChange={(e) => setNewVideoId(e.target.value)}
                                        placeholder="Enter Video ID"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                                    />
                                </div> 
                                <button
                                    onClick={handleAddVideo}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                                >
                                    Add Video
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-gray-500">
                                Enter the ID of the video you want to add to this playlist
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistManager;