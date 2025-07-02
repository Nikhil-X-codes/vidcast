import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserProfile,
  updateUserImages,
  changePassword,
  updateUsername,
} from '../services/userService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Image upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Username change state
  const [username, setUsername] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        setUsername(userData.username);
        setAvatarPreview(userData.avatar);
        setCoverPreview(userData.coverimage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

 const handleImageUpload = async (e) => {
  e.preventDefault();
  if (!avatarFile && !coverFile) {
    setError('Please select at least one image to upload');
    return;
  }

  const formData = new FormData();

  // 🔧 Fix field names to match backend
  if (avatarFile) formData.append('avatar', avatarFile);
  if (coverFile) formData.append('coverimage', coverFile);

  try {
    const response = await updateUserImages(formData);
    setUser(prev => ({
      ...prev,
      avatar: response.avatar,
      coverimage: response.coverimage,
      ...response
    }));
    setAvatarPreview(response.avatar);
    setCoverPreview(response.coverimage);
    setAvatarFile(null);
    setCoverFile(null);
    showSuccess('Images updated successfully');
  } catch (err) {
    setError(err.message);
  }
};

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const message = await changePassword(currentPassword, newPassword);
      showSuccess(message);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUsername(username);
      setUser(updatedUser);
      showSuccess('Username updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(reader.result);
      } else {
        setCoverFile(file);
        setCoverPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Profile Display */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="relative h-48 mb-16">
          {coverPreview && (
            <img 
              src={coverPreview} 
              alt="Cover" 
              className="w-full h-full object-cover rounded-t-lg"
            />
          )}
          <div className="absolute -bottom-12 left-6">
            {avatarPreview && (
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            )}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Update Username */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Username</h2>
        <form onSubmit={handleUsernameUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Username
          </button>
        </form>
      </div>

      {/* Update Images */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Update Profile Images</h2>
        <form onSubmit={handleImageUpload}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'avatar')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'cover')}
                className="w-full"
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={!avatarFile && !coverFile}
            className={`px-4 py-2 rounded-lg transition ${(!avatarFile && !coverFile) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Upload Images
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChangeInput}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;