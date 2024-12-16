import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function TitleBar() {
  return (
    <div className="flex justify-center items-center mt-12">
      <div className="bg-blue-100 text-blue-800 text-xl px-8 py-4 rounded-lg flex items-center gap-2 shadow-md">
        <HeartIcon className="h-6 w-6 text-red-500" />
        <span>Date Ideas</span>
      </div>
    </div>
  );
}