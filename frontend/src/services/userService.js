import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const handleError = (error) => {
  console.error('API Error:', error);
  throw error.response?.data?.message || 'Something went wrong';
};

export const getUserProfile = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/current`, {
      withCredentials: true,
    });
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUsername = async (username) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/users/update`,
      { username },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    return res.data.user;
  } catch (error) {
    handleError(error);
  }
};

export const updateUserImages = async (formData) => {
  try {
    const res = await axios.patch(`${API_BASE_URL}/users/profile-pictures`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
   Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/users/change-password`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );
    return res.data.message;
  } catch (error) {
    handleError(error);
  }
};