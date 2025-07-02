import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/v1'; 

export const likeVideo = async (videoId) => {
  try {
    const response = await axios.post(`${apiUrl}/likes/video/${videoId}`);
    return response.data; 
  } catch (error) {
    return {
      success: false,
      status: error.response?.data?.status || "Failed to like video"
    };
  }
};

export const likeComment = async (commentId) => {
  const response = await axios.post(`${apiUrl}/likes/comment/${commentId}`);
  return response.data;
};

export const getLikedVideos = async (page = 1, limit = 10) => {
  const response = await axios.get(`${apiUrl}/likes/videos`, {
    params: { page, limit }
  });
  return response.data;
};

export const addComment = async (videoId, commentText) => {
  const response = await axios.post(`${apiUrl}/comments/add/${videoId}`, {
    text: commentText
  });
  return response.data;
};

export const updateComment = async (commentId, commentText) => {
  const response = await axios.patch(`${apiUrl}/comments/update/${commentId}`, {
    text: commentText
  });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axios.delete(`${apiUrl}/comments/${commentId}`);
  return response.data;
}


