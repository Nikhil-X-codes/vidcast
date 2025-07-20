import axios from 'axios';

const API_BASE = import.meta.env.VITE_BASE_URL ; 

export const fetchVideos = () =>
  axios.get(`${API_BASE}/videos/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

export const uploadVideo = (formData) =>
  axios.post(`${API_BASE}/videos/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

export const fetchsearchVideos = (search) =>
  axios.get(`${API_BASE}/videos/result?search=${search}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

export const deleteVideo = (videoId) =>
  axios.delete(`${API_BASE}/videos/delete/${videoId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

export const updateVideo = (videoId, title, description) =>
  axios.patch(
    `${API_BASE}/videos/update/${videoId}`,
    { title, description },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

export const getview = (videoId) =>
  axios.get(`${API_BASE}/videos/view/${videoId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

export const getWatchHistory = () =>
  axios.get(`${API_BASE}/users/watch-history`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

export const fetchVideoById = (videoId) =>
  axios.get(`${API_BASE}/videos/single/${videoId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });


  