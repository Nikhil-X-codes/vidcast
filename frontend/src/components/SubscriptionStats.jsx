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
    ? 'bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-md' 
    : 'bg-gradient-to-br from-white to-gray-50 backdrop-blur-md';
  
  const borderColor = theme === 'dark' 
    ? 'border-gray-700' 
    : 'border-gray-200';
  
  const textColor = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-800';
  
  const secondaryTextColor = theme === 'dark' 
    ? 'text-gray-400' 
    : 'text-gray-500';
  
  const hoverBg = theme === 'dark' 
    ? 'hover:bg-gray-700/30 hover:shadow-lg' 
    : 'hover:bg-gray-100/70 hover:shadow-md';
  
  const cardBg = theme === 'dark'
    ? 'bg-gray-800/60 backdrop-blur-sm'
    : 'bg-white/80 backdrop-blur-sm';

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
    return (
      <div className={`flex items-center justify-center p-8 rounded-xl ${bgColor} ${borderColor} border`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <span className={`text-lg ${textColor}`}>Loading subscription data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl shadow-xl p-6 ${bgColor} ${borderColor} border transition-all duration-300 hover:shadow-2xl`}>
      {/* Decorative header */}
      <div className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl bg-gradient-to-r from-blue-500 to-purple-600`}></div>
      
      <h2 className={`text-2xl font-bold mb-6 ${textColor} relative flex items-center`}>
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Subscription Stats
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Subscribed To Section */}
        <div className={`rounded-xl p-6 ${cardBg} ${borderColor} border transition-all duration-300 hover:shadow-md`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-xl ${textColor}`}>Subscribed To</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
            }`}>
              {subscribedChannels.length} Channels
            </span>
          </div>
          
          {subscribedChannels.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {subscribedChannels.map(channel => (
                <div 
                  key={channel._id} 
                  className={`flex items-center space-x-3 p-3 rounded-xl ${hoverBg} transition-all duration-300 cursor-pointer`}
                >
                  <div className="relative">
                    <img 
                      src={channel.avatar || "https://ui-avatars.com/api/?name=Channel&background=random"} 
                      alt={channel.name || "Channel"} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className={`font-medium ${textColor}`}>{channel.username || "Unnamed Channel"}</p>
                    <p className={`text-xs ${secondaryTextColor}`}>Last active: Recently</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 text-center rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/50'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <p className={secondaryTextColor}>You haven't subscribed to any channels yet</p>
            </div>
          )}
        </div>

        {/* Subscribers Section */}
        {channelId && (
          <div className={`rounded-xl p-6 ${cardBg} ${borderColor} border transition-all duration-300 hover:shadow-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-xl ${textColor}`}>Your Subscribers</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'
              }`}>
                {subscribers.length} Subscribers
              </span>
            </div>
            
            {subscribers.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {subscribers.map(user => (
                  <div 
                    key={user._id} 
                    className={`flex items-center space-x-3 p-3 rounded-xl ${hoverBg} transition-all duration-300 cursor-pointer`}
                  >
                    <div className="relative">
                      <img 
                        src={user.avatar || "https://ui-avatars.com/api/?name=User&background=random"} 
                        alt={user.username || "Subscriber"} 
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className={`font-medium ${textColor}`}>{user.username || "Unnamed User"}</p>
                      <p className={`text-xs ${secondaryTextColor}`}>Subscribed: Recently</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-6 text-center rounded-lg ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/50'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className={secondaryTextColor}>You don't have any subscribers yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full ${
              theme === 'dark' ? 'bg-blue-400/10' : 'bg-blue-500/10'
            }`}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionStats;