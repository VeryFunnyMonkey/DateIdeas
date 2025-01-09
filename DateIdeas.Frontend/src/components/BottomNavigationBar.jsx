import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, GiftIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/solid';

export default function BottomNavigationBar() {
  const getLinkClasses = (isActive) =>
    `inline-flex flex-col items-center justify-center px-5 hover:bg-neutral-50 gap-1 hover:text-blue-600 ${
      isActive ? 'text-blue-500' : 'text-gray-500'
    }`;

  return (
    <div className="fixed bottom-0 sm:bottom-5 sm:shadow-lg sm:shadow-neutral-500/30 hover:shadow-md left-0 duration-300 overflow-hidden border-t sm:border z-50 w-full h-16 bg-white sm:max-w-md sm:rounded-xl inset-x-0 mx-auto">
      <div className="grid h-full grid-cols-4 mx-auto">
        <NavLink to="/" className={({ isActive }) => getLinkClasses(isActive)} end>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </NavLink>
        <NavLink to="/random" className={({ isActive }) => getLinkClasses(isActive)}>
          <GiftIcon className="h-6 w-6" />
          <span className="text-xs">Random</span>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => getLinkClasses(isActive)}>
          <CalendarIcon className="h-6 w-6" />
          <span className="text-xs">Calendar</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => getLinkClasses(isActive)}>
          <UserIcon className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </NavLink>
      </div>
    </div>
  );
}
