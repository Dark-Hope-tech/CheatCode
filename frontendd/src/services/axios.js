import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Replace this with your API base URL
  withCredentials: true,
  timeout: 5000, // Timeout duration in milliseconds (optional)
  headers: {
    'Content-Type': 'application/json', // Example of setting headers (optional)
  },
});

export default axiosInstance;
