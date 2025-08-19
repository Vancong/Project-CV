import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import * as UserService from './User.Service';

const axiosJwt = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  withCredentials: true, 
})

axiosJwt.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (err) {
      console.log('Token không hợp lệ:', err);
    }

    const currentTime = Date.now() / 1000;
    if (decodedToken?.exp < currentTime) {
      try {
        const data = await UserService.refreshToken();
        if (data?.access_token) {
          localStorage.setItem('access_token', data.access_token);
          config.headers['token'] = `Bearer ${data.access_token}`;
        }
      } catch (err) {
        console.error('Refresh token thất bại', err);
      }
    } else if (token) {
      config.headers['token'] = `Bearer ${token}`;

    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosJwt;
