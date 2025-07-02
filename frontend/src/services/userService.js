import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const getUserProfile = async () => {
  const res = await axios.get(`${API_BASE_URL}/users/current`, {
    withCredentials: true,
  });
  return res.data; 
};

export const updateUsername = async (data) => {
  const res = await axios.patch(`${API_BASE_URL}/users/update`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  return res.data.user;
};

export const updateUserImages = async (formData) => {
  const res = await axios.patch(`${API_BASE_URL}/users/profile-pictures`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return res.data.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await axios.post(`${API_BASE_URL}/users/change-password`, {
    currentPassword,
    newPassword,
  }, {
    withCredentials: true,
  });
  return res.data.message;
};