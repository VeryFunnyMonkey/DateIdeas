import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const email = query.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessages('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/Auth/resetpassword', {
        email,
        token,
        password,
      });
      setSuccessMessage(response.data);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      const extractedErrors = Object.values(error.response.data)
      .flat()
      .map((msg) => msg);
      setErrorMessages(extractedErrors || 'Registration failed.');
    }
  };

  return (
    <div className="flex items-center justify-center h-svh bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {errorMessages && (
          <div className="mb-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
            <ul>
              {errorMessages.map((errorMessage, index) => (
                <li key={index}>{errorMessage}</li>
              ))}
            </ul>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
              {successMessage}
          </div>
        )}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}