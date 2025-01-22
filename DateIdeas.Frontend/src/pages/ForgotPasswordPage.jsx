import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/Auth/forgotpassword', { email });
      setErrorMessage('');
      setSuccessMessage(response.data);
    } catch (err) {
      setSuccessMessage('');
      setErrorMessage(err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center h-svh bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}