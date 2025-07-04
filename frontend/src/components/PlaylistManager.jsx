
import React, { useState, useEffect } from 'react';
import playlist from '../services/playlist';
import { useParams, useNavigate } from 'react-router-dom';
import VideoList from './VideoList';

const PlaylistManager = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
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
            const response = await playlistService.getPlaylist(playlistId);
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
            const response = await playlistService.createPlaylist(formData.name, formData.description);
            navigate(`/playlist/${response.data._id}`);
        } catch (err) {
            setError(err.message || 'Failed to create playlist');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await playlistService.updatePlaylist(playlistId, formData.name, formData.description);
            setEditing(false);
            loadPlaylist();
        } catch (err) {
            setError(err.message || 'Failed to update playlist');
        }
    };

    const handleDelete = async () => {
        try {
            await playlistService.deletePlaylist(playlistId);
            navigate('/playlists');
        } catch (err) {
            setError(err.message || 'Failed to delete playlist');
        }
    };

    const handleAddVideo = async () => {
        try {
            await playlistService.addVideoToPlaylist(playlistId, newVideoId);
            setNewVideoId('');
            loadPlaylist();
        } catch (err) {
            setError(err.message || 'Failed to add video to playlist');
        }
    };

    const handleRemoveVideo = async (videoId) => {
        try {
            await playlistService.removeVideoFromPlaylist(playlistId, videoId);
            loadPlaylist();
        } catch (err) {
            setError(err.message || 'Failed to remove video from playlist');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="playlist-manager">
            {error && <div className="error">{error}</div>}

            {!playlistId ? (
                <div className="create-playlist">
                    <h2>Create New Playlist</h2>
                    <form onSubmit={handleCreate}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit">Create Playlist</button>
                    </form>
                </div>
            ) : (
                <div className="playlist-details">
                    {editing ? (
                        <form onSubmit={handleUpdate}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <h2>{playlist.name}</h2>
                            <p>{playlist.description}</p>
                            <div className="actions">
                                <button onClick={() => setEditing(true)}>Edit</button>
                                <button onClick={handleDelete}>Delete Playlist</button>
                            </div>
                        </>
                    )}

                    <div className="videos-section">
                        <h3>Videos in this Playlist</h3>
                        {playlist.videos && playlist.videos.length > 0 ? (
                            <VideoList 
                                videos={playlist.videos} 
                                onRemove={handleRemoveVideo}
                                showRemove={true}
                            />
                        ) : (
                            <p>No videos in this playlist yet.</p>
                        )}

                        <div className="add-video">
                            <h4>Add Video</h4>
                            <input
                                type="text"
                                value={newVideoId}
                                onChange={(e) => setNewVideoId(e.target.value)}
                                placeholder="Enter Video ID"
                            />
                            <button onClick={handleAddVideo}>Add Video</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistManager;