import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function DateIdeaCard({ idea, onEdit, onDelete }) {
  return (
    <div className={`bg-slate-100 shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition duration-200 ease-in-out relative ${onEdit || onDelete ? 'pb-12' : 'pb-4'}`}>
      <h2 className="text-2xl font-bold text-blue-600 mb-1">{idea.title}</h2>
      <h3 className="text-lg font-medium text-gray-700 mb-2">{idea.location}</h3>
      {idea.date && (
        <p className="text-gray-600 mb-2">
          Date: {new Date(idea.date).toLocaleString()}
        </p>
      )}
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
      {(onEdit || onDelete) && (
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(idea)}
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition duration-200 ease-in-out flex items-center justify-center"
            >
              <PencilIcon className="h-5 w-5 text-blue-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(idea.id)}
              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition duration-200 ease-in-out flex items-center justify-center"
            >
              <TrashIcon className="h-5 w-5 text-red-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}