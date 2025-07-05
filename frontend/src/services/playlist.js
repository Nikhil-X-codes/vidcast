
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const createPlaylist = async (name, description) => {
    try {
        const response = await axios.post(`${API_URL}/playlists/create-playlist`, {
            name,
            description
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const deletePlaylist = async (playlistId) => {
    try {
        const response = await axios.delete(`${API_URL}/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const updatePlaylist = async (playlistId, name, description) => {
    try {
        const response = await axios.patch(`${API_URL}/playlists/${playlistId}`, {
            name,
            description
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const addVideoToPlaylist = async (playlistId, videoId) => {
    try {
        const response = await axios.post(`${API_URL}/playlists/${playlistId}/videos/${videoId}`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const removeVideoFromPlaylist = async (playlistId, videoId) => {
    try {
        const response = await axios.delete(`${API_URL}/playlists/${playlistId}/videos/${videoId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const fetchAllPlaylists = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        const response = await axios.get(`${API_URL}/playlists/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const fetchPlaylist = async (playlistId) => {
    try {
        const response = await axios.get(`${API_URL}/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    fetchAllPlaylists,
    fetchPlaylist
};

