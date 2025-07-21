import axios from 'axios';

const API_BASE = import.meta.env.VITE_BASE_URL;

export const fetchVideos = () =>
  axios.get(`${API_BASE}/videos/all`, {
    withCredentials: true,
  });

export const uploadVideo = (formData) =>
  axios.post(`${API_BASE}/videos/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

export const fetchsearchVideos = (search) =>
  axios.get(`${API_BASE}/videos/result?search=${search}`, {
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
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true,
  });

export const fetchVideoById = (videoId) =>
  axios.get(`${API_BASE}/videos/single/${videoId}`, {
    withCredentials: true,
  });
