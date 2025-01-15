import React, { useState, useEffect } from 'react';

export default function ScheduleDateIdeaModal({ idea, isOpen, onClose, onSubmit }) {
  const [scheduledDate, setScheduledDate] = useState('');
  const [keep, setKeep] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (idea && idea.scheduledDate) {
        console.log(idea.scheduledDate);
        const localDate = new Date(idea.scheduledDate);
        // Adjust for local timezone and format the date/time correctly
        // TODO - see if theres a better way to do this? Maybe stop using datetime-local?
        const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16); // Date & Time formatted for input
        setScheduledDate(offsetDate);
      } else {
        setScheduledDate('');
      }

      setKeep(idea?.keep || false);
    }
  }, [idea, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!scheduledDate) {
      setError('Please select a date.');
      return;
    }

    const selectedDate = new Date(scheduledDate);

    if (selectedDate < new Date()) {
      setError('Selected date cannot be in the past.');
      return;
    }

    const updatedIdea = { ...idea, 
      scheduledDate: selectedDate, 
      keep,
      isCompleted: false};

    onSubmit(updatedIdea);
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
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
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
                checked={keep}
                onChange={(e) => setKeep(e.target.checked)}
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
