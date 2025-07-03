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


export const getLikedVideos = async (page = 1, limit = 10) => {
  const response = await axios.get(`${apiUrl}/likes/videos`, {
    params: { page, limit }
  });
  return response.data;
};

export const addComment = async (videoId, commentText) => {
  try {
    const response = await axios.post(`${apiUrl}/comments/add/${videoId}`, {
     commentText:commentText
    },
   );
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to add comment",
      error: error.message
    };
  }
};

export const updateComment = async (commentId, commentText) => {
  try {
    const response = await axios.patch(`${apiUrl}/comments/update/${commentId}`, {
      text: commentText
    });
    return {
      success: true,
      status: response.status,
      data: response.data 
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to update comment",
      error: error.message
    };
  }
};

export const getComments = async (videoId) => {
  try {
    const response = await axios.get(`${apiUrl}/comments/${videoId}`);
    return {
      success: true,
      status: response.status,
      data: response.data.data || response.data // Handle different response structures
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Failed to fetch comments",
      error: error.message
    };
  }
};

export const deleteComment = async (commentId) => {
  const response = await axios.delete(`${apiUrl}/comments/${commentId}`);
  return response.data;
}

export const getLikeStatus = async (videoId) => {
    try {
    const response = await axios.post(`${apiUrl}/likes/status/${videoId}`);           
    return response.data; 
  } catch (error) {
    return {
      success: false,
      status: error.response?.data?.message || "Failed to like video"
    };
  }
}

