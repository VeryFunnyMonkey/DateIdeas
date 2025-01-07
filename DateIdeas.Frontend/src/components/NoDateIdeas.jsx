import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoDateIdeas() {
  const navigate = useNavigate();

  const handleCreateIdea = () => {
    navigate('/'); // Adjust the path to where the user can create a new date idea
  };

  return (
    <div className="flex items-center justify-center bg-slate-50">
      <div className="bg-white text-blue-800 text-xl px-8 py-6 rounded-lg shadow-md flex flex-col items-center gap-4">
        <span>No date ideas have been created yet.</span>
        <button
          onClick={handleCreateIdea}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Create One Now
        </button>
      </div>
    </div>
  );
}