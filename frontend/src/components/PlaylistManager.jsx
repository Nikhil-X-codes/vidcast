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
} from '../services/playlist';
import { useTheme } from '../context/Toggle';

const PlaylistManager = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(false);
    const [allPlaylists, setAllPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [editing, setEditing] = useState(false);
    const [newVideoId, setNewVideoId] = useState('');
    const [userId, setUserId] = useState(null);
    const { theme } = useTheme();

    // Enhanced theme styles with more vibrant colors
    const bgColor = theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200';

    const cardBg = theme === 'dark'
        ? 'bg-gray-800/90 backdrop-blur-sm'
        : 'bg-white/95 backdrop-blur-sm';

    const textColor = theme === 'dark'
        ? 'text-gray-100'
        : 'text-gray-800';

    const inputBg = theme === 'dark'
        ? 'bg-gray-700/70 border-gray-600 text-white focus:ring-2 focus:ring-purple-500'
        : 'bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-300';

    const buttonBg = theme === 'dark'
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
        : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600';

    const headerBg = theme === 'dark'
        ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900'
        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600';

    const emptyStateBg = theme === 'dark'
        ? 'bg-gray-800/50 text-gray-300 border border-gray-700'
        : 'bg-white text-gray-700 border border-gray-200';

    const borderColor = theme === 'dark'
        ? 'border-gray-700'
        : 'border-gray-200';

    const cardShadow = theme === 'dark'
        ? 'shadow-lg shadow-purple-900/20'
        : 'shadow-lg shadow-purple-200/50';

    const hoverEffect = theme === 'dark'
        ? 'hover:shadow-purple-500/30 hover:-translate-y-1'
        : 'hover:shadow-purple-300/50 hover:-translate-y-1';

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
                
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData && userData._id) {
                    setUserId(userData._id);
                    
                    if (playlistId) {
                        const playlistResponse = await fetchPlaylist(playlistId);
                        setPlaylist(playlistResponse.data);
                        setFormData({
                            name: playlistResponse.data.name,
                            description: playlistResponse.data.description
                        });
                    } else {
                        const playlistsResponse = await fetchAllPlaylists(userData._id);
                        setAllPlaylists(playlistsResponse.data);
                        localStorage.setItem('userPlaylists', JSON.stringify(playlistsResponse.data));
                    }
                }
            } catch (err) {
                console.error('Error loading initial data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [playlistId]);

    const loadPlaylist = async () => {
        try {
            setLoading(true);
            const response = await fetchPlaylist(playlistId);
            setPlaylist(response.data);
            setFormData({
                name: response.data.name,
                description: response.data.description
            });
        } catch (err) {
            console.log('Error loading playlist:', err);
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
            navigate(`/playlist/${response.data._id}`);
        } catch (err) {
            console.error('Error creating playlist:', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updatePlaylist(playlistId, formData.name, formData.description);
            setEditing(false);
            loadPlaylist();
        } catch (err) {
            console.error('Error updating playlist:', err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this playlist?')) {
            try {
                await deletePlaylist(playlistId);
                const updatedPlaylists = allPlaylists.filter(p => p._id !== playlistId);
                setAllPlaylists(updatedPlaylists);
                navigate('/playlist');
            } catch (err) {
                console.error('Error deleting playlist:', err);
            }
        }
    };

    const handleAddVideo = async () => {
        if (!newVideoId.trim()) return;
        
        try {
            await addVideoToPlaylist(playlistId, newVideoId);
            setNewVideoId('');
            loadPlaylist();
            
            // Show visual feedback
            const addButton = document.getElementById('add-video-btn');
            if (addButton) {
                addButton.classList.add('animate-pulse');
                setTimeout(() => addButton.classList.remove('animate-pulse'), 1000);
            }
        } catch (err) {
            console.error('Error adding video to playlist:', err);
        }
    };
    
    const handleRemoveVideo = async (videoId) => {
        try {
            await removeVideoFromPlaylist(playlistId, videoId);
            loadPlaylist();
        } catch (err) {
            console.error('Error removing video from playlist:', err);
        }
    };

    if (loading) return (
        <div className={`flex justify-center items-center h-screen ${bgColor}`}>
            <div className="flex flex-col items-center">
                <div className={`animate-spin rounded-full h-16 w-16 border-t-4 ${theme === 'dark' ? 'border-purple-500' : 'border-purple-600'}`}></div>
                <p className={`mt-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Loading your playlists...</p>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen p-4 md:p-8 ${bgColor} ${textColor} transition-colors duration-300`}>
            {!playlistId ? (
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Create Playlist Card */}
                    <div className={`rounded-2xl overflow-hidden ${cardBg} ${cardShadow} transition-all duration-300 hover:shadow-xl`}>
                        <div className={`p-6 ${headerBg} text-white`}>
                            <div className="flex items-center">
                                <div className="p-2 mr-4 bg-white/20 rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">Create New Playlist</h1>
                                    <p className="opacity-90">Organize your favorite videos into beautiful collections</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Playlist Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg transition-all ${inputBg} focus:shadow-md`}
                                        placeholder="My Awesome Playlist"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        required
                                        rows="3"
                                        className={`w-full px-4 py-3 rounded-lg transition-all ${inputBg} focus:shadow-md`}
                                        placeholder="What's this playlist about?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full text-white font-medium py-3 px-4 rounded-lg transition-all ${buttonBg} shadow-md hover:shadow-lg transform hover:scale-[1.01]`}
                                >
                                    Create Playlist
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Your Playlists Section */}
                    <div className={`rounded-2xl overflow-hidden ${cardBg} ${cardShadow}`}>
                        <div className={`p-6 ${headerBg} text-white`}>
                            <div className="flex items-center">
                                <div className="p-2 mr-4 bg-white/20 rounded-full">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Your Playlists</h2>
                                    <p className="opacity-90">{allPlaylists.length} {allPlaylists.length === 1 ? 'collection' : 'collections'}</p>
                                </div>
                            </div>
                        </div>
                        
                        {allPlaylists.length > 0 ? (
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allPlaylists.map(playlist => (
                                    <div 
                                        key={playlist._id}
                                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                                        className={`group rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${hoverEffect} ${cardShadow} ${borderColor} border`}
                                    >
                                        <div className="relative pb-[56.25%] overflow-hidden">
                                            {playlist.videos?.length > 0 ? (
                                                <img 
                                                    src={playlist.videos[0].thumbnail} 
                                                    alt={playlist.name}
                                                    className="absolute h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className={`absolute inset-0 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                    <div className="text-center p-4">
                                                        <svg className="w-12 h-12 mx-auto text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                                                <span className="text-white text-sm font-medium">
                                                    {playlist.videos?.length || 0} {playlist.videos?.length === 1 ? 'video' : 'videos'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className={`font-bold text-lg mb-1 group-hover:text-purple-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                                {playlist.name}
                                            </h3>
                                            <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {playlist.description || 'No description'}
                                            </p>
                                            <div className="flex justify-between items-center text-xs">
                                                <Time date={playlist.createdAt} theme={theme} />
                                                <span className={`px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-purple-400' : 'bg-gray-100 text-purple-600'}`}>
                                                    {playlist.videos?.length || 0} items
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`p-10 text-center ${emptyStateBg} rounded-b-2xl`}>
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium">No playlists yet</h3>
                                    <p className="mt-2 opacity-80">Create your first playlist to organize your favorite videos</p>
                                    <button
                                        onClick={() => window.scrollTo(0, 0)}
                                        className={`mt-6 px-6 py-2 rounded-full ${buttonBg} text-white shadow-md hover:shadow-lg transition-all`}
                                    >
                                        Create Playlist
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Playlist Header Card */}
                    <div className={`rounded-2xl overflow-hidden ${cardBg} ${cardShadow}`}>
                        <div className={`p-6 ${headerBg} text-white`}>
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div className="flex-1">
                                    {editing ? (
                                        <h1 className="text-2xl font-bold">Edit Playlist</h1>
                                    ) : (
                                        <>
                                            <h1 className="text-2xl md:text-3xl font-bold">{playlist.name || 'Untitled Playlist'}</h1>
                                            <p className="opacity-90 mt-1">{playlist.description || 'No description available'}</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex space-x-3">
                                    {!editing ? (
                                        <>
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all border border-white/30"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {editing && (
                            <div className="p-6">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Playlist Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                            className={`w-full px-4 py-3 rounded-lg transition-all ${inputBg}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            required
                                            rows="3"
                                            className={`w-full px-4 py-3 rounded-lg transition-all ${inputBg}`}
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className={`px-4 py-2 rounded-lg border transition-all ${theme === 'dark' ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={`text-white px-4 py-2 rounded-lg transition-all ${buttonBg} shadow-md hover:shadow-lg`}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Videos in Playlist */}
                    <div className={`rounded-2xl overflow-hidden ${cardBg} ${cardShadow}`}>
                        <div className={`p-6 border-b ${borderColor}`}>
                            <h2 className="text-xl font-bold flex items-center">
                                <div className="p-1 mr-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                Videos in this Playlist
                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-gray-700 text-purple-400' : 'bg-gray-100 text-purple-600'}`}>
                                    {playlist?.videos?.length || 0}
                                </span>
                            </h2>
                        </div>
                        <div className="p-6">
                            {playlist?.videos?.length > 0 ? (
                                <VideoList
                                    videos={playlist.videos}
                                    onRemove={handleRemoveVideo}
                                    showRemove={true}
                                    theme={theme}
                                />
                            ) : (
                                <div className={`text-center py-10 ${emptyStateBg} rounded-lg`}>
                                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium">No videos yet</h3>
                                    <p className="mt-2 opacity-80">Add videos to start building your playlist</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Video Section */}
                    <div className={`rounded-2xl overflow-hidden ${cardBg} ${cardShadow}`}>
                        <div className={`p-6 border-b ${borderColor}`}>
                            <h2 className="text-xl font-bold flex items-center">
                                <div className="p-1 mr-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </div>
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
                                        placeholder="Enter Video ID or URL"
                                        className={`w-full px-4 py-3 rounded-lg transition-all ${inputBg} focus:shadow-md`}
                                    />
                                </div> 
                                <button
                                    id="add-video-btn"
                                    onClick={handleAddVideo}
                                    disabled={!newVideoId.trim()}
                                    className={`text-white font-medium py-3 px-6 rounded-lg transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500' : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'} shadow-md hover:shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Add Video
                                </button>
                            </div>
                            <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Enter the ID or URL of the video you want to add to this playlist
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistManager;