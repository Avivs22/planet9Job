import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://planet9job.onrender.com',
  withCredentials: false,
});

export default axiosInstance;
