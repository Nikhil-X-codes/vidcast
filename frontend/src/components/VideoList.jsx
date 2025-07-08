import React, { useState } from 'react';

const VideoList = ({ videos, onRemove, showRemove }) => {
    const [playingVideoId, setPlayingVideoId] = useState(null);

    if (!videos || videos.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                No videos found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {

                const videoKey = video.__id || `video-${videos.indexOf(video)}`;
                
                return (
                    <div
                        key={videoKey}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative pb-[56.25%] bg-gray-200">
                            {playingVideoId === video.__id ? (
                                <video
                                    src={video.video}
                                    controls
                                    autoPlay
                                    className="absolute h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="absolute h-full w-full cursor-pointer"
                                    onClick={() => setPlayingVideoId(video.__id)}
                                >
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title || 'Video thumbnail'}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x169?text=Thumbnail+Missing';
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-14 w-14 text-white opacity-90"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                {video.title || 'Untitled Video'}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3">
                                {video.description || 'No description available'}
                            </p>

                            {showRemove && (
                                <button
                                    onClick={() => onRemove(video.__id)}
                                    className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VideoList;