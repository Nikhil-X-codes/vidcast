import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

const togglebtn = async (channelId) => {
    try {
        const response = await axios.post(`${API_URL}/subscriptions/${channelId}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }   
        });
        return response.data;   
    } catch(error) {
        throw error.response?.data || error.message;
    }
}

const listSubscribedChannels = async () => {
    try {
        const response = await axios.get(`${API_URL}/subscriptions/channels`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }   
        });
        return response.data;   
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const listSubscribersOfChannel = async (channelId) => {
    try {
        const response = await axios.get(`${API_URL}/subscriptions/subscribers/${channelId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }   
        });
        return response.data;   
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


export {
    togglebtn,
    listSubscribedChannels,
    listSubscribersOfChannel
}