import React, { useState, useEffect } from 'react';
import { 
  listSubscribedChannels,
  listSubscribersOfChannel
} from '../services/subservice';

const SubscriptionStats = ({ channelId }) => {
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subscribed channels
        const mySubscriptions = await listSubscribedChannels();
        setSubscribedChannels(mySubscriptions.data.channels); // ✅ Extracted array

        // Fetch subscribers if channelId is provided
        if (channelId) {
          const mySubscribers = await listSubscribersOfChannel(channelId);
          setSubscribers(mySubscribers.data.subscribers); // ✅ Extracted array
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
    return <div className="p-4">Loading subscription data...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Subscription Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Subscribed To Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">Subscribed To</h3>
          <p className="text-2xl font-bold mb-3">{subscribedChannels.length}</p>
          {subscribedChannels.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subscribedChannels.map(channel => (
                <div key={channel._id} className="flex items-center space-x-2">
                  <img 
                    src={channel.avatar || "https://via.placeholder.com/40"} 
                    alt={channel.name || "Channel"} 
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{channel.username || "Unnamed Channel"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't subscribed to any channels yet.</p>
          )}
        </div>

        {/* Subscribers Section */}
        {channelId && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Your Subscribers</h3>
            <p className="text-2xl font-bold mb-3">{subscribers.length}</p>
            {subscribers.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {subscribers.map(user => (
                  <div key={user._id} className="flex items-center space-x-2">
                    <img 
                      src={user.avatar || "https://via.placeholder.com/40"} 
                      alt={user.username || "Subscriber"} 
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.username || "Unnamed User"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You don't have any subscribers yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStats;
