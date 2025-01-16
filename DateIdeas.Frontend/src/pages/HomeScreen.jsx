import { useState } from 'react';
import TitleBar from '../components/TitleBar';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import DateIdeaList from '../components/DateIdeaList';
import DateIdeaModal from '../components/DateIdeaModal';
import ScheduleDateIdeaModal from '../components/ScheduleDateIdeaModal';
import { usePersistedState } from '../hooks/usePersistedState';
import { addIdea, editIdea, deleteIdea, addNewTag } from '../services/dateIdeaService';
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
    <div className="pb-16 pt-4 h-svh bg-slate-50">
      {/* Search Bar */}
      <SearchBar setSearchTerm={setSearchTerm} />

      {/* Dropdown Filter */}
      <FilterDropdown
        tags={tags}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedFilterTags={selectedFilterTags}
        setSelectedFilterTags={setSelectedFilterTags}
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
        className="fixed bottom-20 right-4 bg-pink-200 text-pink-500 rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center shadow-xl hover:bg-pink-300 transition duration-300 ease-in-out focus:bg-pink-300"
      >
        <PlusIcon className="h-10 w-10 sm:h-14 sm:w-14 md:h-18 md:w-18 lg:h-22 lg:w-22" />
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
