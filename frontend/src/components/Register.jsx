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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        {/* Password with toggle */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Avatar Upload with icon */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Avatar <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <label className="flex items-center cursor-pointer bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded text-blue-700 font-medium">
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

        {/* Cover Image Upload with icon */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
