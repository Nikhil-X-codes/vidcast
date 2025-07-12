import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaBell,
  FaList,
  FaVideo,
  FaHistory,
  FaBars,
  FaHeart,
  FaSearch
} from 'react-icons/fa';

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
    { name: 'Liked Videos', path: '/liked-videos', icon: <FaHeart /> },
    { name: 'My Playlist', path: '/playlist', icon: <FaList /> },
    { name:'Search',path:'/search',icon:<FaSearch />}
  ];

  return (
    <div
      className={`${
        isExpanded ? 'w-52' : 'w-20'
      } min-h-screen p-4 flex flex-col transition-all duration-300
      bg-gradient-to-b from-indigo-300 via-purple-200 to-pink-100
      backdrop-blur-md shadow-xl border-r border-purple-200`}
    >
      {/* Toggle Button */}
      <div
        onClick={toggleSidebar}
        className="mb-6 flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer bg-white/40 text-gray-800 hover:bg-white/60 transition-colors shadow-md"
      >
        <FaBars className="text-lg" />
        {isExpanded && <span className="text-sm font-medium">Menu</span>}
      </div>

      {/* Navigation Links */}
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `mb-3 flex items-center gap-3 px-4 py-2 rounded-xl transition-all font-medium shadow-sm ${
              isActive
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-800 bg-white/40 hover:bg-white/60 hover:text-purple-700'
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
