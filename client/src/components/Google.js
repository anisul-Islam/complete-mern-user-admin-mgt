import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { loginWithGoogle } from '../services/UserServices';
import { useNavigate } from 'react-router-dom';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const Google = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const handleLogin = async (response) => {
    try {
      // 1. get the credential from response
      // response.credential
      console.log(response.credential);
      const user = jwt_decode(response.credential);
      setUser(user);
      // 2. send the credential to the server
      const result = await loginWithGoogle(response.credential);
      console.log(result.success);
      if (result.success) {
        navigate('/profile');
      }
    } catch (error) {
      console.log('Google signin error: ', error.response.data.message);
    }
  };

  // no user -> display logout button
  // user -> display login button

  return (
    <div>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>

      {user && (
        <div>
          <img src={user.picture} alt={user.nbf} />
          <h3>{user.email}</h3>
          <h3>{user.name}</h3>
        </div>
      )}
    </div>
  );
};

export default Google;
