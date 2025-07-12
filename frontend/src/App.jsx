
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext';
import SignInPage from './pages/Signin';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import History from './pages/History';
import Sidebar from './components/Sidebar';
import VideoManager from './pages/VideoManager';
import PlaylistManager from './components/PlaylistManager';
import Like from './components/Like';
import { ThemeProvider } from './context/Toggle';
import SubscriptionStats from './components/SubscriptionStats';
import SearchComponent from './pages/Search';
import SearchVideoPlayer from './pages/searchvideo';

const App = () => {
  return (
    <ThemeProvider>
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
                  <SubscriptionStats />
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
        
  <Route path="/search" element={
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <SearchComponent />
      </div>
    </div>
  } />
  
  <Route path="/search/:videoId" element={
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <SearchVideoPlayer />
      </div>
    </div>
  } />

        </Routes>
      </Router>
      
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
