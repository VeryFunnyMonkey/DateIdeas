import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ConfirmEmailPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const userId = query.get('userId');
  const code = query.get('code');

useEffect(() => {
    if (!userId || !code ) {
      navigate('/login');
    }

    const confirmEmail = async () => {
      try {
        const response = await axios.get('/Auth/confirmemail', {
          params: {
            userId,
            code
          }
        });
        setSuccessMessage(response.data);
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setErrorMessage(error.response.data);
        setTimeout(() => navigate('/login'), 3000);
      }
    }
    confirmEmail();

  }, [code, userId, navigate]);

  return (
    <div className="flex items-center justify-center h-svh bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Confirm Email</h1>
        {errorMessage && (
          <div className="mb-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
              {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
              {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}