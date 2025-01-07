import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Or use fetch to make API requests

export default function DateIdeaModal({ isOpen, onClose, onSubmit, initialData = null, globalTags, addNewTag }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        title: '',
        location: '',
        date: '',
        tags: [] // Clear tags for new entries
      });
      setNewTag('');
      setAutocompleteResults([]); // Clear previous search results
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    
    // If the location field is changed, make a request to your backend
    if (name === 'location' && value) {
      // Call your backend API to fetch the autocomplete suggestions
      axios.get(`/api/maps/places/autocomplete`, {
        params: {
          query: value, // The user input for the location
        }
      })
      .then((response) => {
        setAutocompleteResults(response.data.predictions); // Store the autocomplete predictions
      })
      .catch((error) => {
        console.error("Error fetching places autocomplete:", error);
      });
    }
  };

  const handlePlaceSelection = (place) => {
    setFormData((prevData) => ({ ...prevData, location: place.description }));
    setAutocompleteResults([]); // Clear the autocomplete results once a place is selected
  };

  const handleTagToggle = (tag) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.some((t) => t.id === tag.id)
        ? prevData.tags.filter((t) => t.id !== tag.id)
        : [...prevData.tags, tag]
    }));
  };

  const handleNewTagSubmit = () => {
    if (newTag.trim() && !globalTags.some(tag => tag.name === newTag)) {
      const newTagTrimmed = newTag.trim();
      addNewTag(newTagTrimmed);
      setNewTag('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close modal after submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Date Idea' : 'Add Date Idea'}</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          
          {/* Location */}
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            {/* Display autocomplete results */}
            {autocompleteResults.length > 0 && (
              <ul className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-scroll">
                {autocompleteResults.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => handlePlaceSelection(place)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {place.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Date */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-gray-700 mb-2">Date</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date ?? ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          
          {/* Tag Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {globalTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-lg ${
                    formData.tags.some((t) => t.id === tag.id) ? 'bg-blue-100 text-blue-800' : 'bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* New Tag Input */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Add new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="button"
              onClick={handleNewTagSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add
            </button>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}