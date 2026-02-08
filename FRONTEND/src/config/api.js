// API Configuration
// This file centralizes all API endpoint configuration
// In production, VITE_API_BASE_URL should be set in environment variables

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://campus-bridge-rufi.onrender.com';;

export const API_ENDPOINTS = {
  // User endpoints
  REGISTER: `${API_BASE_URL}/api/v1/users/register`,
  LOGIN: `${API_BASE_URL}/api/v1/users/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/users/forgot-password`,
  
  // Post endpoints
  ALL_POSTS: `${API_BASE_URL}/api/v1/posts/allposts`,
  CREATE_POST: `${API_BASE_URL}/api/v1/posts/createpost`,
  GET_POST: (postId) => `${API_BASE_URL}/api/v1/posts/post/${postId}`,
  DELETE_POST: (postId) => `${API_BASE_URL}/api/v1/posts/deletepost/${postId}`,
};

export default API_BASE_URL;

