import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // backend API base
  withCredentials: true,
});

instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default instance;
