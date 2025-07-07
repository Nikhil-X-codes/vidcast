import React, { useState, useEffect } from 'react';
import { 
  listSubscribedChannels,
  listSubscribersOfChannel
} from '../services/subservice';
import { useTheme } from '../context/Toggle';

const SubscriptionStats = ({ channelId }) => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // Theme styles
  const bgColor = theme === 'dark' 
    ? 'bg-gray-800/90 backdrop-blur-md' 
    : 'bg-white/90 backdrop-blur-md';
  
  const borderColor = theme === 'dark' 
    ? 'border-gray-700' 
    : 'border-gray-200';
  
  const textColor = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-800';
  
  const secondaryTextColor = theme === 'dark' 
    ? 'text-gray-300' 
    : 'text-gray-600';
  
  const hoverBg = theme === 'dark' 
    ? 'hover:bg-gray-700/50' 
    : 'hover:bg-gray-100/50';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subscribed channels
        const mySubscriptions = await listSubscribedChannels();
        setSubscribedChannels(mySubscriptions.data.channels);

        // Fetch subscribers if channelId is provided
        if (channelId) {
          const mySubscribers = await listSubscribersOfChannel(channelId);
          setSubscribers(mySubscribers.data.subscribers);
        }

      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId]);

  if (loading) {
    return <div className={`p-4 ${textColor}`}>Loading subscription data...</div>;
  }

  return (
    <div className={`rounded-lg shadow p-4 ${bgColor} ${borderColor} border`}>
      <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Subscription Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Subscribed To Section */}
        <div className={`rounded-lg p-4 ${borderColor} border`}>
          <h3 className={`font-medium text-lg mb-2 ${textColor}`}>Subscribed To</h3>
          <p className={`text-2xl font-bold mb-3 ${textColor}`}>{subscribedChannels.length}</p>
          {subscribedChannels.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subscribedChannels.map(channel => (
                <div 
                  key={channel._id} 
                  className={`flex items-center space-x-2 p-2 rounded ${hoverBg} transition-colors`}
                >
                  <img 
                    src={channel.avatar || "https://ui-avatars.com/api/?name=Channel&background=random"} 
                    alt={channel.name || "Channel"} 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className={textColor}>{channel.username || "Unnamed Channel"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={secondaryTextColor}>You haven't subscribed to any channels yet.</p>
          )}
        </div>

        {/* Subscribers Section */}
        {channelId && (
          <div className={`rounded-lg p-4 ${borderColor} border`}>
            <h3 className={`font-medium text-lg mb-2 ${textColor}`}>Your Subscribers</h3>
            <p className={`text-2xl font-bold mb-3 ${textColor}`}>{subscribers.length}</p>
            {subscribers.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {subscribers.map(user => (
                  <div 
                    key={user._id} 
                    className={`flex items-center space-x-2 p-2 rounded ${hoverBg} transition-colors`}
                  >
                    <img 
                      src={user.avatar || "https://ui-avatars.com/api/?name=User&background=random"} 
                      alt={user.username || "Subscriber"} 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className={textColor}>{user.username || "Unnamed User"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={secondaryTextColor}>You don't have any subscribers yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStats;