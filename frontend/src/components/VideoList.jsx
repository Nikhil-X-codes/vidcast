

const VideoList = ({ videos, onRemove, showRemove }) => {
    return (
        <div className="video-list">
            {videos.map(video => (
                <div key={video._id} className="video-item">
                    <div className="video-thumbnail">
                        <img src={video.thumbnail} alt={video.title} />
                    </div>
                    <div className="video-info">
                        <h4>{video.title}</h4>
                        <p>{video.description}</p>
                    </div>
                    {showRemove && (
                        <button 
                            className="remove-btn"
                            onClick={() => onRemove(video._id)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VideoList;