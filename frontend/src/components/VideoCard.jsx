import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  likeVideo,
  likeComment,
  getLikedVideos,
  addComment,
  updateComment,
  deleteComment,
  getLikeStatus
} from '../services/addService';
import Time from './Time';


const VideoCard = ({
  video,
  onDelete = () => {},
  onUpdate = () => {},
  onView = () => {},
  readOnly = false 
}) => {
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title);
  const [editDesc, setEditDesc] = useState(video.description);
  const [showVideo, setShowVideo] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Load comments when component mounts or showComments changes
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);


  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/comments/video/${video._id}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

useEffect(() => {
  const fetchStatus = async () => {
    const result = await getLikeStatus(video._id);
    if (result.success) {
      setLiked(result.data.liked);
    } else {
      console.error(result.message);
    }
  };

  fetchStatus();
}, [video._id]);


const handleLike = async () => {
  try {
    const response = await likeVideo(video._id); 

    if (response.success) {
      setLiked(response.data.liked); 
      setLikeCount(response.data.likecount);
    } else {
      console.error("Like operation was not successful:", response);
    }
  } catch (error) {
    console.error("Like operation failed:", error);
  }
};

  const handleCommentLike = async (commentId) => {
    try {
      const response = await likeComment(commentId);
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId 
            ? { ...comment, isLiked: response.isLiked, likesCount: response.likesCount } 
            : comment
        )
      );
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await addComment(video._id, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const updatedComment = await updateComment(commentId, editCommentText);
      setComments(prev => 
        prev.map(comment => 
          comment._id === commentId ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleSave = () => {
    onUpdate(video._id, editTitle, editDesc);
    setIsEditing(false);
  };

  // Add this to your comment rendering section
  const renderCommentActions = (comment) => (
    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={() => startEditingComment(comment)}
        className="text-blue-600 hover:text-blue-800 text-xs"
      >
        Edit
      </button>
      <button 
        onClick={() => handleDeleteComment(comment._id)}
        className="text-red-600 hover:text-red-800 text-xs"
      >
        Delete
      </button>
      <button 
        onClick={() => handleCommentLike(comment._id)}
        className={`flex items-center space-x-1 ${comment.isLiked ? 'text-red-600' : 'text-gray-600'} text-xs`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill={comment.isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{comment.likesCount}</span>
      </button>
    </div>
  );

  return (
    <div 
      className="w-full max-w-sm bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail/Video Section */}
      <div className="relative w-full h-48 bg-black cursor-pointer">
        {showVideo ? (
          <video
            src={video.video}
            controls
            className="w-full h-full object-cover"
            onPlay={() => {
              if (!viewed) {
                onView(video._id);
                setViewed(true);
                const history = JSON.parse(localStorage.getItem('watchHistory')) || [];
                if (!history.includes(video._id)) {
                  localStorage.setItem('watchHistory', JSON.stringify([...history, video._id]));
                }
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover"
              onClick={() => setShowVideo(true)}
            />
            {isHovered && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setShowVideo(true)}
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-white ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Info Section */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img 
              src={video.channel?.avatar || "https://yt3.googleusercontent.com/ytc/APkrFKaqca-xQcJr0zXj1X6J4KZijQm7n1Zz1Y6L5Q=s176-c-k-c0x00ffffff-no-rj"} 
              alt="channel" 
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <>
                <input
                  className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 truncate">{video.title}</h2>
                <h5 className="text-lg font-semibold text-gray-900 truncate">{video.description}</h5>
                <p className="text-sm text-gray-600 mt-1">{video.channel?.name}</p>
                <p className="text-xs text-gray-500 mt-1">
  {video.views?.toLocaleString() || "678K"} views • <Time date={video.createdAt} />
                </p>
              </>
            )}
          </div>
        </div>

        {/* Like and Comment Buttons */}
        <div className="flex items-center justify-between mt-3 border-t pt-3">
<button 
  onClick={handleLike}
  className={`flex items-center space-x-1 ${liked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600`}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
  <span>{Number(likeCount).toLocaleString()} Likes</span>
</button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{comments.length}</span>
          </button>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-3 border-t pt-3">
            <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-3">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
              >
                Post
              </button>
            </form>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.map(comment => (
                <div key={comment._id} className="flex space-x-2 group">
                  <img 
                    src={comment.user?.avatar || 'https://via.placeholder.com/40'} 
                    alt="user" 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    {editingCommentId === comment._id ? (
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mb-1"
                          required
                        />
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleUpdateComment(comment._id)}
                            className="bg-green-600 text-white px-2 py-1 text-sm rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button 
                            onClick={cancelEditingComment}
                            className="bg-gray-500 text-white px-2 py-1 text-sm rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-2 rounded-lg relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{comment.user?.username || 'Anonymous'}</p>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                          {comment.user?._id === localStorage.getItem('userId') && (
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => startEditingComment(comment)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-2">No comments yet</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons (for video owner) */}
        {!readOnly && (
          <div className="flex justify-end space-x-2 mt-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(video._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;