import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { registerUser } from '../services/UserServices';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  const handleImageChange = (event) => {
    console.log(event.target.files);
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newUser = new FormData();

      newUser.append('name', name);
      newUser.append('email', email);
      newUser.append('password', password);
      newUser.append('phone', phone);
      newUser.append('image', image);

      // console.log(newUser);
      // for (const [key, value] of newUser) {
      //   console.log(key, value);
      // }

      const response = await registerUser(newUser);
      toast.success(response.message);
      // toast.success(response.message);
      // fetchCategories();
      //  navigate('/dashboard/admin/products');
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.error.message);
    }
  };

  return (
    <div className="container center">
      <h1>User Registration</h1>

      {/* photo preview and get photo  */}
      {image && (
        <div>
          <img
            className="user-img"
            src={URL.createObjectURL(image)}
            alt=" user"
          />
        </div>
      )}

      <div className="card">
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="phone">Phone: </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              required
              onChange={handlePhoneChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="image">Image: </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="form-control">
            <button type="submit" className="btn">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
