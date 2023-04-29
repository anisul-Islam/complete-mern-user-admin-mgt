import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/UserServices';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import Google from '../components/Google';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    setValue((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(value);
      console.log(response);
      // const { user, accessToken: token } = response.payload;
      // dispatch(login({ user, token }));
      // here we can dispatch setIsLoggedIn
      // here we can dispatch setAdmin
      navigate('/profile');

      // const role = response.data.user.isAdmin === 1 ? 'admin' : 'user';
      // navigate(`/dashboard/${role}`);
    } catch (error) {
      toast(error.response.data.error.message);
    }
  };

  // console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);

  return (
    <div className="container center">
      <h1>User Login</h1>
      <div className="card">
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              value={value.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password must be 6 characters"
              value={value.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control">
            <button type="submit" className="btn">
              Login
            </button>
            <Google />
          </div>
        </form>
      </div>
    </div>
  );
};
