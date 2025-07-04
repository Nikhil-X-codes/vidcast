import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBell, FaList, FaVideo, FaHistory, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const links = [
    { name: 'Home', path: '/home', icon: <FaHome /> },
    { name: 'Subscription', path: '/subscription', icon: <FaBell /> },
    { name: 'My Video', path: '/my-video', icon: <FaVideo /> },
    { name: 'Watch History', path: '/history', icon: <FaHistory /> },
    {name:'Liked Videos', path:'/liked-videos', icon:<FaVideo />},
    {name:'My Playlist', path:'/playlist', icon:<FaList />},
  ];

  return (
    <div
      className={`${
        isExpanded ? 'w-52' : 'w-20'
      } min-h-screen bg-gray-100 border-r shadow-sm p-4 flex flex-col transition-all duration-300`}
    >

      <div
        onClick={toggleSidebar}
        className="mb-4 flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-700 text-gray-800"
      >
        <FaBars className="text-lg" />
        {isExpanded && <span className="text-sm">Menu</span>}
      </div>


      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `mb-3 flex items-center gap-3 px-4 py-2 rounded-md text-left transition-all ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'hover:bg-blue-100 hover:text-blue-700 text-gray-800'
            }`
          }
        >
          <span className="text-lg">{link.icon}</span>
          {isExpanded && <span className="text-sm">{link.name}</span>}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
