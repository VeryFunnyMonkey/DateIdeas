import React from 'react';
import { ClockIcon, PencilIcon, TrashIcon, CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';

export default function DateIdeaCard({ idea, onSchedule, onEdit, onDelete }) {
  return (
    <div
      className={`relative bg-slate-100 shadow-md rounded-lg p-4 border ${
        idea.isCompleted
          ? 'border-green-400'
          : idea.scheduledDate
          ? 'border-blue-400'
          : 'border-gray-200'
      } hover:shadow-lg transition duration-200 ease-in-out ${
        onEdit || onDelete ? 'pb-12' : 'pb-4'
      }`}
    >
      {/* Scheduled Indicator in Top-Right Corner */}
      {idea.scheduledDate && !idea.isCompleted && (
        <div className="absolute top-2 right-2">
          <CalendarIcon className="h-8 w-8 text-blue-500" />
        </div>
      )}

      {/* Completed Tick in Top-Right Corner */}
      {idea.isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircleIcon className="h-8 w-8 text-green-500" />
        </div>
      )}

      {/* Title and Location */}
      <div className={idea.isCompleted ? 'opacity-50' : ''}>
        <h2 className="text-2xl font-bold text-blue-600 mb-1">{idea.title}</h2>
        <h3 className="text-lg font-medium text-gray-700 mb-2">{idea.location}</h3>
        {idea.scheduledDate && (
          <p className="text-gray-600 mb-2">
            Scheduled: {new Date(idea.scheduledDate).toLocaleString()}
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
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        {onDelete && (
          <button
            onClick={() => onDelete(idea.id)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition duration-200 ease-in-out flex items-center justify-center"
          >
            <TrashIcon className="h-5 w-5 text-red-600" />
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(idea)}
            className="p-2 rounded-lg bg-amber-100 hover:bg-amber-200 transition duration-200 ease-in-out flex items-center justify-center"
          >
            <PencilIcon className="h-5 w-5 text-orange-600" />
          </button>
        )}
        {onSchedule && (
          <button
            onClick={() => onSchedule(idea)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition duration-200 ease-in-out flex items-center justify-center"
          >
            <ClockIcon className="h-5 w-5 text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
}
