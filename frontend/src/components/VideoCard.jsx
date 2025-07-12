import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  likeVideo,
  getLikedVideos,
  addComment,
  updateComment,
  deleteComment,
  getLikeStatus,
  getComments
} from '../services/addService';
import Time from './Time';
import {
  togglebtn,
  listSubscribedChannels,
  listSubscribersOfChannel
} from '../services/subservice';
import { useTheme } from '../context/Toggle';

const VideoCard = ({
  video,
  onDelete = () => {},
  onUpdate = () => {},
  onView = () => {},
  readOnly = false,
  hideInteractions = false,
  showComments = true,
  onThumbnailClick = null,
}) => {
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title);
  const [editDesc, setEditDesc] = useState(video.description);
  const [showVideo, setShowVideo] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes || 0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getLikeStatus(video._id);
        if (result.success) {
          setLiked(result.data.liked);
          setLikeCount(result.data.likecount || 0);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchStatus();
  }, [video._id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await getComments(video._id);
        if (result.success) {
          setComments(result.data); 
        } else {
          console.error("Error:", result.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (commentsVisible) {
      fetchComments();
    }
  }, [commentsVisible, video._id]); 

  useEffect(() => {
  const checkSubscriptionStatus = async () => {
    try {
      const response = await listSubscribersOfChannel(video.owner?._id);
      const subscribers = response?.data?.subscribers || [];

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;

      const isSubbed = subscribers.some(sub => sub._id === userId);
      setIsSubscribed(isSubbed);

      setSubscriberCount(subscribers.length);

    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  if (video.owner?._id) {
    checkSubscriptionStatus();
  }
}, [video.owner?._id, isSubscribed]);

const handleSubscribe = async () => {
  try {
    const response = await togglebtn(video.owner._id); // Actually call the toggle function
    if (response.success) {
      setIsSubscribed(prev => !prev); // Toggle the local state
      // Update subscriber count
      if (response.data.subscribed) {
        setSubscriberCount(prev => prev + 1);
      } else {
        setSubscriberCount(prev => Math.max(0, prev - 1));
      }
    }
  } catch (err) {
    console.error("Failed to toggle subscription:", err);
  }
};

  const handleLike = async () => {
    try {
      const response = await likeVideo(video._id); 
      if (response.success) {
        setLiked(response.data.liked); 
        setLikeCount(response.data.likecount || 0);
      } else {
        console.error("Like operation was not successful:", response);
      }
    } catch (error) {
      console.error("Like operation failed:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await addComment(video._id, commentText);
      if (response.success) {
        setComments(prev => [response.data, ...prev]);
        setCommentText('');
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const response = await updateComment(commentId, editCommentText);
      if (response.success) {
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId ? response.data : comment
          )
        );
        setEditingCommentId(null);
        setEditCommentText('');
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.content);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleSave = () => {
    onUpdate(video._id, editTitle, editDesc);
    setIsEditing(false);
  };

  return (
  <div 
  className={`w-full max-w-sm rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
    theme === 'dark' ? 'bg-gray-400 text-white' : 'bg-white text-gray-700'
  }`}
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
        onClick={(e) => {
          // Check if onThumbnailClick prop exists
          if (onThumbnailClick) {
            e.stopPropagation(); // Prevent the parent click handler
            onThumbnailClick();
          } else {
            setShowVideo(true);
          }
        }}
      />
     
    {isHovered && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (onThumbnailClick) {
              e.stopPropagation(); // Prevent the parent click handler
              onThumbnailClick();
            } else {
              setShowVideo(true);
            }
          }}
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

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img 
              src={video.owner.avatar} 
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
                <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                <div className="flex items-center mt-2">
                  <p className="text-sm text-gray-600">{video.owner?.username}</p>
                  {video.owner && (
              <button
  onClick={handleSubscribe}
  className={`ml-2 px-2 py-1 text-xs rounded-full transition-colors ${
    isSubscribed 
      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
      : 'bg-red-600 text-white hover:bg-red-700'
  }`}
  disabled={!video.owner} 
>
  {isSubscribed ? 'Subscribed' : 'Subscribe'}
</button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {subscriberCount.toLocaleString()} subscribers • {video.views?.toLocaleString() || "0"} views • <Time date={video.createdAt} />
                </p>
              </>
            )}
          </div>
        </div>

        {/* Like/Comment Section - Only show if hideInteractions is false */}
        {!hideInteractions && (
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
              onClick={() => setCommentsVisible(!commentsVisible)}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{comments.length}</span>
            </button>
          </div>
        )}

        {/* Comment Section - Only show if showComments is true and commentsVisible is true */}
        {showComments && commentsVisible && (
          <div className="mt-3 border-t pt-3">

          <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-3">
  <input
    type="text"
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder="Add a comment..."
    className={`flex-1 p-2 border rounded focus:outline-none focus:ring-1 ${
      theme === 'dark' 
        ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white placeholder-gray-400' 
        : 'bg-white border-gray-300 focus:ring-blue-500 text-gray-800 placeholder-gray-500'
    }`}
    required
  />
  <button 
    type="submit"
    className={`px-3 py-1 rounded-md transition ${
      theme === 'dark'
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`}
  >
    Post
  </button>
</form>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
{comments
  .filter(comment => comment._id) // Filter out comments without IDs
  .map(comment => (
    <div 
      key={comment._id} 
      className="flex space-x-2 group"
    >
      <img 
        src={comment.CommentBy?.avatar || 'https://via.placeholder.com/40'} 
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
  className={`w-full p-2 border rounded focus:outline-none focus:ring-1 mb-1 ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white'
      : 'bg-white border-gray-300 focus:ring-blue-500 text-gray-800'
  }`}
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
<div className={`p-2 rounded-lg relative ${
  theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
}`}>
  <div className="flex justify-between items-start">
    <div>
      <p className={`font-medium text-sm ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {comment.CommentBy?.username || 'Anonymous'}
      </p>
      <p className="text-sm">{comment.content}</p>
    </div>
              {comment.CommentBy?._id === localStorage.getItem('userId') || (
                <div className="flex items-center space-x-2">
                  <div className="relative group">
                    <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-10">
                      <button
                        onClick={() => startEditingComment(comment)}
                        className="block w-full text-left px-4 py-2 text-xs text-blue-600 hover:bg-gray-100 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-100 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className={`text-xs mt-1 ${
    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
  }`}>
    <Time date={comment.createdAt} />
  </p>
          </div>
        )}
      </div>
    </div>
  ))
}
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