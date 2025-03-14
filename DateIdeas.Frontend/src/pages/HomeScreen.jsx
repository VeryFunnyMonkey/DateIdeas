import { useState } from 'react';
import TitleBar from '../components/TitleBar';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import DateIdeaList from '../components/DateIdeaList';
import DateIdeaModal from '../components/DateIdeaModal';
import ScheduleDateIdeaModal from '../components/ScheduleDateIdeaModal';
import { usePersistedState } from '../hooks/usePersistedState';
import { addIdea, editIdea, deleteIdea, addNewTag, deleteTag } from '../services/dateIdeaService';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function HomeScreen({ ideas, tags, setIdeas, setTags }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [selectedFilterTags, setSelectedFilterTags] = usePersistedState('selectedFilterTags', []);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = usePersistedState('selectedCategories', ['unscheduled', 'scheduled']);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter Helpers
  const filterBySearchTerm = (idea) => {
    if (!searchTerm) return true;
    return idea.title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filterByTags = (idea) => {
    if (!selectedFilterTags.length) return true;
    return selectedFilterTags.every((selectedTag) =>
      idea.tags.some((ideaTag) => ideaTag.name === selectedTag.name)
    );
  };

  const filterByCategory = (idea) => {
    if (selectedCategories.includes('unscheduled') && !idea.scheduledDate && !idea.isCompleted) {
      return true;
    }
    if (selectedCategories.includes('scheduled') && idea.scheduledDate && !idea.isCompleted) {
      return true;
    }
    if (selectedCategories.includes('completed') && idea.isCompleted) {
      return true;
    }
    return false;
  };

  // Combine Filters
  const filteredIdeas = ideas.filter((idea) =>
    filterByTags(idea) && filterBySearchTerm(idea) && filterByCategory(idea)
  );

  const handleOpenModal = (idea = null) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIdea(null);
  };

  const handleOpenSchedule = (idea) => {
    setSelectedIdea(idea);
    setIsScheduleModalOpen(true);
  };

  const handleCloseSchedule = () => {
    setIsScheduleModalOpen(false);
    setSelectedIdea(false);
  };

  return (
    <div className="pb-16 pt-4 bg-slate-50 h-svh overflow-y-auto">
      {/* Search Bar */}
      <SearchBar setSearchTerm={setSearchTerm} />

      {/* Dropdown Filter */}
      <FilterDropdown
        tags={tags}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedFilterTags={selectedFilterTags}
        setSelectedFilterTags={setSelectedFilterTags}
        deleteTag={deleteTag}
      />

      {/* Ideas List */}
      <DateIdeaList
        ideas={filteredIdeas}
        onSchedule={(idea) => handleOpenSchedule(idea)}
        onEdit={(idea) => handleOpenModal(idea)}
        onDelete={deleteIdea}
      />

      {/* Add Idea Button */}
      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-20 right-6 sm:bottom-8 sm:right-8 flex items-center justify-center 
        w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-pink-300 to-pink-600 
        text-white shadow-lg z-50 transform active:scale-75 transition-transform duration-300"
        >
          <PlusIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
      </button>
      
      {/* Modals */}
      <DateIdeaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(idea) =>
          selectedIdea ? editIdea(idea, setIdeas) : addIdea(idea, setIdeas)
        }
        initialData={selectedIdea}
        globalTags={tags}
        addNewTag={(tag) => addNewTag(tag, tags, setTags)}
      />
      <ScheduleDateIdeaModal
        idea={selectedIdea}
        isOpen={isScheduleModalOpen}
        onClose={handleCloseSchedule}
        onSubmit={(idea) => editIdea(idea, setIdeas)}
      />
    </div>
  );
}
