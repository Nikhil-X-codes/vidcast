import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext';
import SignInPage from './pages/Signin';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import Subscription from './pages/Subscription';
import History from './pages/History';
import Sidebar from './components/Sidebar';
import VideoManager from './pages/VideoManager';
import PlaylistManager from './components/PlaylistManager';
import VideoList from './components/VideoList';
import Like from './components/Like';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
      
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignInPage />} />
          <Route path="/login" element={<LoginPage />} />
          
         <Route
  path="/home/*"
  element={
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Home />
      </div>
    </div>
  }
/>
          <Route
            path="/subscription"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <Subscription />
                </div>
              </div>
            }
          />
 <Route
          path="/playlist"
          element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <PlaylistManager />
              </div>
            </div>
          }
        />

        <Route
          path="/playlist/:playlistId"
          element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <PlaylistManager />
              </div>
            </div>
          }
        />
          
          <Route
            path="/my-video"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <VideoManager />
                </div>
              </div>
            }
          />
          <Route
            path="/history"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  <History />
                </div>
              </div>
            }
          />
          

          <Route
            path="/liked-videos"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                 <Like />
                </div>
              </div>
            }
          />


  
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
