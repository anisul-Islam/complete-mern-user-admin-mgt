import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../layout/Navbar';

import Footer from '../layout/Footer';
import { Activate, Home, Login, Profile, Register } from '../pages';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserDashboard from '../pages/users/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
const Index = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/api/users/activate/:token" element={<Activate />} />
          <Route path="/login" element={<Login />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Home />} />

          {/* <Route path="/dashboard">
            <Route path="user" element={<UserDashboard />} />
          </Route>
          <Route path="/dashboard">
            <Route path="admin" element={<AdminDashboard />} />
          </Route> */}
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default Index;
