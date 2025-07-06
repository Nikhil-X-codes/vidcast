import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert('All fields are required');
      return;
    }

    const success = await login(form.email, form.password);
    if (success) navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-700">Welcome Back</h2>

        {/* Email Input */}
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

        {/* Password Input */}
        <div className="mb-6">
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition"
        >
          Login
        </button>

        {/* Redirect to SignUp */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account?</span>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="ml-2 text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
