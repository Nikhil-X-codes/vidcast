import React, { useState } from 'react';

const VideoList = ({ videos, onRemove, showRemove }) => {
    const [playingVideoId, setPlayingVideoId] = useState(null);

    if (!videos || videos.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-gray-500">No videos in this playlist yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
                <div key={video["-id"]} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Thumbnail or Video */}
                    <div className="relative pb-[56.25%] bg-gray-200">
                        {playingVideoId === video["-id"] ? (
                            <video
                                src={video.video}
                                controls
                                autoPlay
                                className="absolute h-full w-full object-cover"
                            />
                        ) : (
                            <div
                                className="absolute h-full w-full cursor-pointer"
                                onClick={() => setPlayingVideoId(video["-id"])}
                            >
                                <img
                                    src={video.thumbnail}
                                    alt={video.title || 'Video thumbnail'}
                                    className="h-full w-full object-cover"
                                />
                                {/* Play icon overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                            {video.title || 'Untitled Video'}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                            {video.description || 'No description available'}
                        </p>

                        <div className="mt-3 flex justify-between items-center">
                            {showRemove && (
                                <button 
                                    onClick={() => onRemove(video["-id"])}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoList;