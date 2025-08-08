'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaMapMarkerAlt, FaGraduationCap, FaPhone, FaEdit, FaArrowLeft, FaSave, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';

const petEmojis = [
  "🐱", "🐶", "🐰", "🦊", "🐼", "🐨", "🦝", "🐸",
  "🐢", "🦋", "🐝", "🦄", "🐙", "🦀", "🐠", "🐧",
  "🦉", "🐺", "🦁", "🐯", "🐮", "🐷", "🐹", "🐻"
];

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    college: '',
    city: '',
    country: '',
    phone: '',
    petEmoji: '🐱',
  });

  async function fetchUserInfo() {
    try {
      const response = await axios.get("/api/getUserInfo");
      const data = response.data;
      setFormData({
        name: data?.name || '',
        age: data?.age || '',
        gender: data?.gender || '',
        college: data?.college || '',
        city: data?.city || '',
        country: data?.country || '',
        phone: data?.phone || '',
        petEmoji: data?.petEmoji || '🐱',
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (event) => {
    console.log("Handle change called");
    if (formData) {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/profileUpdate', formData);
      router.push('/profile');
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        setError(error.response.data.message || 'An error occurred.');
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError('No response received from the server.');
      } else {
        console.error("Request setup error:", error.message);
        setError('Error setting up the request.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.age && formData.gender && formData.college &&
      formData.city && formData.country && formData.phone;
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Pet Emoji Selection */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">{formData.petEmoji}</span>
          Choose Your Pet Companion
        </h3>
        <div className="grid grid-cols-8 gap-2">
          {petEmojis.map((emoji) => (
            <motion.button
              key={emoji}
              type="button"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFormData({ ...formData, petEmoji: emoji })}
              className={`text-2xl p-3 rounded-xl transition-all duration-200 ${formData.petEmoji === emoji
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-110'
                  : 'bg-white/50 dark:bg-gray-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FaUser className="text-purple-500" />
            Personal Information
          </h3>

          {/* Name Field */}
          <div className="relative group">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              value={formData?.name || ''}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>

          {/* Age and Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <FaBirthdayCake className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              <input
                type="number"
                name="age"
                id="age"
                placeholder="Age"
                value={formData?.age || ''}
                onChange={handleChange}
                min="13"
                max="100"
                className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>

            <div className="relative group">
              <FaVenusMars className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              <select
                name="gender"
                id="gender"
                value={formData?.gender || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 dark:text-white appearance-none cursor-pointer"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>
          </div>

          {/* Phone Field */}
          <div className="relative group">
            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Enter your phone number"
              value={formData?.phone || ''}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
        </motion.div>

        {/* Academic & Location Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FaGraduationCap className="text-purple-500" />
            Academic & Location
          </h3>

          {/* College Field */}
          <div className="relative group">
            <FaGraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
            <input
              type="text"
              name="college"
              id="college"
              placeholder="Enter your institute/college name"
              value={formData?.college || ''}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>

          {/* City and Country Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Enter your city"
                value={formData?.city || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>

            <div className="relative group">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              <input
                type="text"
                name="country"
                id="country"
                placeholder="Enter your country"
                value={formData?.country || ''}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-center cursor-pointer"
            onClick={() => setError(null)}
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isFormValid() || isLoading}
          whileHover={{ scale: isFormValid() ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${isFormValid()
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <FaSave />
              Update Profile
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-start justify-center pt-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 mb-6 group"
            >
              <motion.div
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FaArrowLeft className="text-lg" />
              </motion.div>
              Back to Profile
            </Link>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <FaEdit className="text-purple-400" />
                Edit Profile
              </h1>
              <p className="text-gray-300 text-lg">
                Update your information and personalize your profile
              </p>
            </motion.div>
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <Form />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}