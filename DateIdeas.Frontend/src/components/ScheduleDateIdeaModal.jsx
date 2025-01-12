import React, { useState } from 'react';

export default function ScheduleDateIdeaModal({ idea, isOpen, onClose, onSubmit }) {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const scheduledDate = new Date(formData.get('scheduledDate'));
    const keep = formData.get('keep') === 'on';

    if (scheduledDate < new Date()) {
      setError('Selected date cannot be in the past.');
      return;
    }

    idea.scheduledDate = scheduledDate;
    idea.keep = keep;

    console.log(idea)
    onSubmit(idea);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4">Schedule Date Idea</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Select Date */}
          <div className="mb-4">
            <label htmlFor="scheduledDate" className="block text-gray-700 mb-2">Select Date</label>
            <input
              type="datetime-local"
              id="scheduledDate"
              name="scheduledDate"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          
          {/* Error Message */}
          {error && <div className="mb-4 text-red-500">{error}</div>}
          
          {/* Keep After Complete */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                id="keep"
                name="keep"
                className="mr-2"
              />
              Keep after date is complete
            </label>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}