import React from 'react';
import { ClockIcon, PencilIcon, TrashIcon, CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';

export default function DateIdeaCard({ idea, onSchedule, onEdit, onDelete }) {
  return (
    <div
      className={`relative bg-gradient-to-r from-slate-50 to-slate-100 shadow-lg rounded-lg p-6 border ${
        idea.isCompleted
          ? 'border-green-400'
          : idea.scheduledDate
          ? 'border-blue-400'
          : 'border-gray-300'
      } hover:shadow-2xl transition-all duration-300 ease-in-out ${
        onEdit || onDelete ? 'pb-14' : 'pb-6'
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
      <div className={idea.isCompleted ? 'opacity-60' : ''}>
        <h2 className="text-3xl font-semibold text-blue-700 mb-2">{idea.title}</h2>
        <h3 className="text-xl font-medium text-gray-700 mb-3">{idea.location}</h3>
        {idea.scheduledDate && (
          <p className="text-sm text-gray-600 mb-3">
            Scheduled: {new Date(idea.scheduledDate).toLocaleString()}
          </p>
        )}
        <div className="flex flex-wrap gap-3 mb-4">
          {idea.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-block bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-md"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-4 flex space-x-3">
        {onDelete && (
          <button
            onClick={() => onDelete(idea.id)}
            className="p-3 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-300 ease-in-out flex items-center justify-center shadow-md hover:scale-105"
          >
            <TrashIcon className="h-5 w-5 text-red-600" />
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(idea)}
            className="p-3 rounded-lg bg-amber-100 hover:bg-amber-200 transition-all duration-300 ease-in-out flex items-center justify-center shadow-md hover:scale-105"
          >
            <PencilIcon className="h-5 w-5 text-orange-600" />
          </button>
        )}
        {onSchedule && (
          <button
            onClick={() => onSchedule(idea)}
            className="p-3 rounded-lg bg-blue-100 hover:bg-blue-200 transition-all duration-300 ease-in-out flex items-center justify-center shadow-md hover:scale-105"
          >
            <ClockIcon className="h-5 w-5 text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
}
