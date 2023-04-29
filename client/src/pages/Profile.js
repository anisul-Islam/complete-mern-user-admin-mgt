import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRefreshToken, userProfile } from '../services/UserServices';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      try {
        const response = await userProfile();
        setUser(response.payload);
        setIsLoading(false);
      } catch (error) {
        setError(error.response.data.message);
        setUser(null);
        setIsLoading(false);
      }
    };
    makeRequest();
  }, []);

  console.log(user);

  //use useCallback so that only rerenders on dispatch
  // const handleRefresh = React.useCallback(async () => {
  //   try {
  //     const refreshToken = await getRefreshToken();
  //     console.log(refreshToken);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleRefresh();
  //   }, 1000 * 20);
  //   return () => clearInterval(interval);
  // }, [handleRefresh]);

  return (
    <div>
      <h2>{user && user.isAdmin ? 'Admin' : 'User'} Profile</h2>
      <div className="card center">
        {isLoading && <p>Profile is loading</p>}
        {error && <p style={{ color: 'orange' }}>{error}</p>}
        {user && (
          <div className="profile">
            <h3 className="profile__name">Name: {user.name}</h3>
            <p className="profile__email">Email: {user.email}</p>
            <p className="profile__phone">Phone: {user.phone}</p>
            <div className="profile__buttons">
              <button className="btn">Update</button>
              <button className="btn">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
