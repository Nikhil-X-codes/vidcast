import React, { useState } from 'react';

const VideoCard = ({
  video,
  onDelete = () => {},
  onUpdate = () => {},
  onView = () => {},
  readOnly = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title);
  const [editDesc, setEditDesc] = useState(video.description);
  const [showVideo, setShowVideo] = useState(false);
  const [viewed, setViewed] = useState(false);

  const handleSave = () => {
    onUpdate(video._id, editTitle, editDesc);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow flex flex-col md:flex-row gap-4">
      <div
        className="w-full md:w-48 h-32 rounded overflow-hidden cursor-pointer bg-black"
        onClick={() => setShowVideo(true)}
      >
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
          <img
            src={video.thumbnail}
            alt="thumbnail"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1">
        {isEditing ? (
          <>
            <input
              className="w-full p-1 border mb-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="w-full p-1 border"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold">{video.title}</h3>
            <p className="text-gray-700">{video.description}</p>
          </>
        )}

        {/* Hide edit/delete buttons if readOnly */}
        {!readOnly && (
          <div className="flex gap-2 mt-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(video._id)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;