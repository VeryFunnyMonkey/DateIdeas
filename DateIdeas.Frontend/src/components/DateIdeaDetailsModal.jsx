import React from 'react';

export default function DateIdeaDetailsModal({ isOpen, onClose, idea }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4">{idea.title}</h2>
        <p className="text-gray-600 mb-2">Location: {idea.location || 'N/A'}</p>
        <p className="text-gray-600 mb-2">Date: {new Date(idea.scheduledDate).toLocaleString()}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-lg"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-500 text-white py-1 px-3 rounded-full hover:bg-gray-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}