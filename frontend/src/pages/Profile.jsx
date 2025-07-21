import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserProfile,
  updateUserImages,
  changePassword,
  updateUsername,
} from '../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faImage, 
  faCamera, 
  faLock, 
  faSave,
  faUpload,
  faCheckCircle,
  faEye, faEyeSlash
} from '@fortawesome/free-solid-svg-icons';


const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
        <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-600" />
        Profile Settings
      </h1>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Profile Display */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
        <div className="relative h-48 md:h-56 bg-gradient-to-r from-blue-500 to-purple-600">
          {coverPreview ? (
            <img 
              src={coverPreview} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400" />
            </div>
          )}
          <div className="absolute -bottom-16 left-6">
            <div className="relative group">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FontAwesomeIcon icon={faCamera} className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-20 pb-6 px-6">
          <h2 className="text-2xl font-bold text-gray-800">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Update Username */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
          Update Username
        </h2>
        <form onSubmit={handleUsernameUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Update Username
          </button>
        </form>
      </div>

      {/* Update Images */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faImage} className="mr-2 text-blue-500" />
          Update Profile Images
        </h2>
        <form onSubmit={handleImageUpload}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
              <label className="block cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faUpload} className="text-3xl text-blue-500 mb-3" />
                  <span className="block text-gray-700 font-medium mb-2">Avatar</span>
                  <span className="block text-sm text-gray-500 mb-3">Recommended: 200x200px</span>
                  {avatarFile && (
                    <span className="block text-sm text-green-600 mb-2">
                      {avatarFile.name} selected
                    </span>
                  )}
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    Choose File
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'avatar')}
                  className="hidden"
                />
              </label>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
              <label className="block cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faUpload} className="text-3xl text-blue-500 mb-3" />
                  <span className="block text-gray-700 font-medium mb-2">Cover Image</span>
                  <span className="block text-sm text-gray-500 mb-3">Recommended: 1500x500px</span>
                  {coverFile && (
                    <span className="block text-sm text-green-600 mb-2">
                      {coverFile.name} selected
                    </span>
                  )}
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    Choose File
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'cover')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <button 
            type="submit"
            disabled={!avatarFile && !coverFile}
            className={`px-6 py-3 rounded-lg transition flex items-center justify-center w-full ${
              (!avatarFile && !coverFile) 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Upload Images
          </button>
        </form>
      </div>

      {/* Change Password */}
<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
    <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-500" />
    Change Password
  </h2>
  <form onSubmit={handlePasswordChange}>
    <div className="mb-4 relative">
      <label className="block text-gray-700 mb-2 font-medium">Current Password</label>
      <div className="relative">
        <input
          type={showCurrentPassword ? "text" : "password"}
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChangeInput}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <FontAwesomeIcon icon={showCurrentPassword ? faEye : faEyeSlash} />
        </button>
      </div>
    </div>
    <div className="mb-4 relative">
      <label className="block text-gray-700 mb-2 font-medium">New Password</label>
      <div className="relative">
        <input
          type={showNewPassword ? "text" : "password"}
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChangeInput}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
        </button>
      </div>
    </div>
    <div className="mb-6 relative">
      <label className="block text-gray-700 mb-2 font-medium">Confirm New Password</label>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChangeInput}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
        </button>
      </div>
    </div>
    <button 
      type="submit"
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full flex items-center justify-center"
    >
      <FontAwesomeIcon icon={faLock} className="mr-2" />
      Change Password
    </button>
  </form>
</div>
    </div>
  );
};

export default Profile;