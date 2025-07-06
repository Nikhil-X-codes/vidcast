import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import { FaEye, FaEyeSlash, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    avatar: null,
    coverimage: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === 'avatar') {
        setAvatarPreview(URL.createObjectURL(file));
      } else if (name === 'coverimage') {
        setCoverPreview(URL.createObjectURL(file));
      }
      setForm({ ...form, [name]: file });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, avatar, coverimage } = form;

    if (!username || !email || !password || !avatar || !coverimage) {
      alert('All fields are required');
      return;
    }

    const success = await signIn(form);
    if (success) navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transition-all duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-700">Create Your Account</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600 hover:text-black"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Avatar <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <label className="flex items-center cursor-pointer bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded text-purple-700 font-medium">
              <FaUpload className="mr-2" />
              Upload Avatar
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
            </label>
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar Preview" className="h-12 w-12 rounded-full object-cover" />
            )}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">
            Cover Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <label className="flex items-center cursor-pointer bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-green-700 font-medium">
              <FaUpload className="mr-2" />
              Upload Cover
              <input
                type="file"
                name="coverimage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
            </label>
            {coverPreview && (
              <img src={coverPreview} alt="Cover Preview" className="h-16 w-32 object-cover rounded" />
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition"
        >
          Sign Up
        </button>

        {/* Login Redirect */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account?</span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="ml-2 text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
