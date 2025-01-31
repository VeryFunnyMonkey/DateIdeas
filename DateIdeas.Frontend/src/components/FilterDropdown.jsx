import { useState } from 'react';
import { ChevronDownIcon, TrashIcon, CheckIcon, CheckCircleIcon, CalendarIcon, LightBulbIcon } from '@heroicons/react/24/solid';

export default function FilterDropdown({ tags, selectedCategories, setSelectedCategories, selectedFilterTags, setSelectedFilterTags, deleteTag }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [tagsToDelete, setTagsToDelete] = useState([]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleDeleteTagSelect = (tag) => {
    if (isDeleteMode) {
      console.log(isDeleteMode);
      const tagExists = tagsToDelete.some((selectedTag) => selectedTag.name === tag.name);
      if (tagExists) {
        setTagsToDelete(tagsToDelete.filter((selectedTag) => selectedTag.name !== tag.name));
      } else {
        setTagsToDelete([...tagsToDelete, tag]);
      }
    }
  };

  const handleFilterTagSelect = (tag) => {
      const tagExists = selectedFilterTags.some((selectedTag) => selectedTag.name === tag.name);
      if (tagExists) {
        setSelectedFilterTags(selectedFilterTags.filter((selectedTag) => selectedTag.name !== tag.name));
      } else {
        setSelectedFilterTags([...selectedFilterTags, tag]);
      }
  };

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleDeleteMode = () => {
    if (isDeleteMode && tagsToDelete.length > 0) {
      console.log("tags", tags);
      setSelectedFilterTags(selectedFilterTags.filter(tag => !tagsToDelete.includes(tag.name)));
      tagsToDelete.forEach((tag) => {
        console.log(tag);
        deleteTag(tag.id);
        setSelectedFilterTags(selectedFilterTags.filter((selectedTag) => selectedTag.name !== tag.name));
      });
      setTagsToDelete([]);
    }
    setIsDeleteMode(!isDeleteMode);
  };

  const categoryIcons = {
    unscheduled: <LightBulbIcon className="h-5 w-5 mx-auto" />, 
    scheduled: <CalendarIcon className="h-5 w-5 mx-auto" />, 
    completed: <CheckCircleIcon className="h-5 w-5 mx-auto" />
  };

  return (
    <div className="relative flex justify-center">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center gap-1 bg-slate-200 text-black px-4 py-2 mt-4 rounded-md shadow-sm"
      >
        <span className="text-sm">Filters</span>
        <ChevronDownIcon className={`h-5 w-5 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      {isDropdownOpen && (
        <div className="absolute top-full mt-2 bg-white shadow-lg rounded-lg p-4 w-full max-w-md z-50">
            <div className='bg-slate-100 rounded-lg p-4 mb-4'>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Filter by Category</h2>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {['unscheduled', 'scheduled', 'completed'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex flex-col items-center transition ${
                      selectedCategories.includes(category) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {categoryIcons[category]} 
                    <span className="mt-1">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </button>
                ))}
            </div>
          </div>
          <div className='bg-slate-100 rounded-lg p-4 mb-4'>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Filter by Tags</h2>
              <button onClick={toggleDeleteMode} className={"text-white px-2 py-2 rounded-full bg-red-500"}>
                {isDeleteMode ? <CheckIcon className="h-5 w-5" /> : <TrashIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  onClick={() => (isDeleteMode ? handleDeleteTagSelect(tag) : handleFilterTagSelect(tag))}
                  className={`cursor-pointer px-3 py-2 rounded-lg ${
                    tagsToDelete.includes(tag)
                      ? 'bg-red-200 text-red-800'
                      : selectedFilterTags.some((selectedTag) => selectedTag.name === tag.name)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200'
                  } text-center`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
