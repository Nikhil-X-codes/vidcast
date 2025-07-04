import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1'; 

export const fetchVideos = (limit = 10) =>
  axios.get(`${API_BASE}/videos/all?limit=${limit}`, {
    withCredentials: true,
  });


export const uploadVideo = (formData) =>
  axios.post(`${API_BASE}/videos/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });


export const deleteVideo = (videoId) =>
  axios.delete(`${API_BASE}/videos/delete/${videoId}`, {
    withCredentials: true,
  });


export const updateVideo = (videoId, title, description) =>
  axios.patch(
    `${API_BASE}/videos/update/${videoId}`,
    { title, description },
    {
      withCredentials: true,
    }
  );

  export const getview = (videoId) =>
  axios.get(`${API_BASE}/videos/view/${videoId}`, {
    withCredentials: true,
  });

export const getWatchHistory = () =>
  axios.get(`${API_BASE}/users/watch-history`, {  
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json', 
      'Accept': 'application/json'       
    },
    withCredentials: true,
  });