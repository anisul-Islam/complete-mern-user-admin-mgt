import axios from 'axios';
axios.defaults.withCredentials = true;

const baseURL = process.env.REACT_APP_API || 'http://localhost:8080';

export const registerUser = async (user) => {
  const response = await axios.post(`${baseURL}/api/users/register`, user);
  return response.data;
};

export const verifyAccount = async (data) => {
  const response = await axios.post(`${baseURL}/api/users/activate`, data);
  return response.data;
};

export const loginUser = async (user) => {
  const response = await axios.post(`${baseURL}/api/auth/login`, user);
  return response.data;
};
export const loginWithGoogle = async (credential) => {
  const response = await axios.post(
    `${baseURL}/api/auth/google-login`,
    credential
  );
  return response.data;
};

export const logoutUser = async (user) => {
  const response = await axios.post(`${baseURL}/api/auth/logout`);
  return response.data;
};

export const userProfile = async () => {
  const response = await axios.get(`${baseURL}/api/users/profile`);
  return response.data;
};

export const getRefreshToken = async () => {
  const response = await axios.get(`${baseURL}/api/auth/refresh`);
  return response.data;
};
// export const authorizeUser = async (token) => {
//   const response = await axios.get(`${baseURL}/auth-check`, {
//     headers: {
//       Authorization: token,
//     },
//   });
//   return response;
// };
export const isAdminCheck = async (token) => {
  const response = await axios.get(`${baseURL}/admin-check`, {
    headers: {
      Authorization: token,
    },
  });
  return response;
};
