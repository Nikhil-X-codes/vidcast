import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL

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
    throw error; 
  }
};

export const updateUsername = async (username) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/users/update`,
      { username },
      {
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data.user;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const updateUserImages = async (formData) => {
  try {
    const res = await axios.patch(
      `${API_BASE_URL}/users/profile-pictures`,
      formData,
      {
        withCredentials: true, 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/users/change-password`,
      { currentPassword, newPassword },
      {
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data.message;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
