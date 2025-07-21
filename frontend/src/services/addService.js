import axios from 'axios';

const apiUrl = import.meta.env.VITE_BASE_URL;

// Like a video
export const likeVideo = async (videoId) => {
  try {
    const response = await axios.post(`${apiUrl}/likes/video/${videoId}`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      status: error.response?.data?.status || "Failed to like video",
    };
  }
};

// Get liked videos
export const getLikedVideos = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${apiUrl}/likes/videos`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch liked videos",
      error: error.message,
    };
  }
};

// Add comment
export const addComment = async (videoId, commentText) => {
  try {
    const response = await axios.post(
      `${apiUrl}/comments/add/${videoId}`,
      { commentText },
      { withCredentials: true }
    );
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to add comment",
      error: error.message,
    };
  }
};

// Update comment
export const updateComment = async (commentId, commentText) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/comments/update/${commentId}`,
      { commentText },
      { withCredentials: true }
    );
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update comment",
      error: error.message,
    };
  }
};

// Get comments
export const getComments = async (videoId) => {
  try {
    const response = await axios.get(`${apiUrl}/comments/${videoId}`, {
      withCredentials: true,
    });
    return {
      success: true,
      status: response.status,
      data: response.data.data || response.data,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch comments",
      error: error.message,
    };
  }
};

// Delete comment
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${apiUrl}/comments/delete/${commentId}`, {
      withCredentials: true,
    });
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to delete comment",
      error: error.message,
    };
  }
};

// Get like status
export const getLikeStatus = async (videoId) => {
  try {
    const response = await axios.post(`${apiUrl}/likes/status/${videoId}`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      status: error.response?.data?.message || "Failed to get like status",
    };
  }
};
