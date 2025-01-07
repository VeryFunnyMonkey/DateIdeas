import { useState } from 'react';
import TitleBar from '../components/TitleBar';
import DateIdeaList from '../components/DateIdeaList';
import DateIdeaModal from '../components/DateIdeaModal';
import { addIdea, editIdea, deleteIdea, addNewTag } from '../services/dateIdeaService';
import { Bars3BottomLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function HomeScreen({ ideas, tags, setIdeas, setTags }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [selectedFilterTags, setSelectedFilterTags] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredIdeas = selectedFilterTags.length
    ? ideas.filter((idea) =>
        selectedFilterTags.every((selectedTag) =>
          idea.tags.some((ideaTag) => ideaTag.name === selectedTag.name)
        )
      )
    : ideas;

  const handleOpenModal = (idea = null) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIdea(null);
  };

  const handleFilterTagSelect = (tag) => {
    if (selectedFilterTags.includes(tag)) {
      setSelectedFilterTags(
        selectedFilterTags.filter((selectedTag) => selectedTag !== tag)
      );
    } else {
      setSelectedFilterTags([...selectedFilterTags, tag]);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative pb-16">
      {/* Title Bar */}
      <TitleBar />

      {/* Side Menu */}
      <div
        className={`fixed inset-0 z-50 transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out bg-white w-64 sm:w-80 md:w-96 lg:w-1/3 shadow-lg p-4`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 rounded-xl bg-gray-300 hover:bg-gray-400 text-xl font-bold flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18"
        >
          <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-blue-500 mt-6 p-4">Filter by Tags</h2>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag.id}
              onClick={() => handleFilterTagSelect(tag)}
              className={`cursor-pointer px-3 py-2 rounded-lg ${
                selectedFilterTags.includes(tag)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-200'
              }`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Ideas List */}
      <DateIdeaList
        ideas={filteredIdeas}
        onEdit={(idea) => handleOpenModal(idea)}
        onDelete={deleteIdea}
      />

      {/* Toggle Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 bg-slate-100 text-black shadow-lg flex items-center justify-center rounded-3xl w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 hover:bg-slate-200 transition duration-300 ease-in-out focus:bg-slate-200"
      >
        <Bars3BottomLeftIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9" />
      </button>

      {/* Add Idea Button */}
      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-20 right-4 bg-pink-200 text-pink-500 rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center shadow-xl hover:bg-pink-300 transition duration-300 ease-in-out focus:bg-pink-300"
      >
        <PlusIcon className="h-10 w-10 sm:h-14 sm:w-14 md:h-18 md:w-18 lg:h-22 lg:w-22" />
      </button>

      {/* Modal */}
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
    </div>
  );
}
