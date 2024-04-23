import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://server-pasteleria.onrender.com/api', // Corregido, eliminadas las comillas dobles extras
  withCredentials: true,
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('tokenUsuario');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
