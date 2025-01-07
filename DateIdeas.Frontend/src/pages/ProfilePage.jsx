import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-white">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-700">{user?.email}</h2>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Account Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <p className="w-full px-3 py-2 border rounded-md bg-gray-100">{user?.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password:</label>
            <p className="w-full px-3 py-2 border rounded-md bg-gray-100">********</p>
          </div>
        </div>
      </div>
    </div>
  );
}