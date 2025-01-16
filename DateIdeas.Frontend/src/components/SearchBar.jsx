import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchBar({ setSearchTerm }) {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex items-center bg-slate-200 rounded-full px-6 py-3 shadow-md focus-within:ring-2 focus-within:ring-blue-500 max-w-xs mx-auto">
      <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
      <input
        type="text"
        className="ml-3 bg-transparent text-base text-gray-700 placeholder-gray-500 focus:outline-none w-full"
        placeholder="Search ideas..."
        onChange={handleInputChange}
      />
    </div>
  );
}