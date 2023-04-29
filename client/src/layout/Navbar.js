import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/UserServices';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast(error.response.data.message);
    }
  };

  return (
    <nav>
      <NavLink to="/" className="nav__link">
        Home
      </NavLink>
      <NavLink to="/register" className="nav__link">
        Register
      </NavLink>
      <NavLink to="/login" className="nav__link">
        Login
      </NavLink>
      <NavLink to="/logout" className="nav__link" onClick={handleLogout}>
        Logout
      </NavLink>
    </nav>
  );
};

export default Navbar;
