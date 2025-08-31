import axios from "axios";

// Use VITE_API_URL from .env, fallback to '/api' for local proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = {
  post: async (endpoint, data) => {
    const url = `${API_URL}${endpoint}`;
    const response = await axios.post(url, data);
    return response.data;
  },
  get: async (endpoint) => {
    const url = `${API_URL}${endpoint}`;
    const response = await axios.get(url);
    return response.data;
  }
};

export default api;
