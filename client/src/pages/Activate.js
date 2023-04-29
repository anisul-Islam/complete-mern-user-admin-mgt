import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyAccount } from '../services/UserServices';
import { toast } from 'react-toastify';
export const Activate = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const handleActivation = async (e) => {
    e.preventDefault();
    try {
      await verifyAccount({ token });
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error.message);
    }
  };

  return (
    <div>
      <button onClick={handleActivation}> Activate Your Account </button>
    </div>
  );
};
