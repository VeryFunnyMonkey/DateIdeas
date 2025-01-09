import { useState } from "react";
import DateIdeaDetailsModal from "../components/DateIdeaDetailsModal";

export default function CalendarPage({ ideas }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedIdea, setSelectedIdea] = useState(null);

  const current = new Date();

  const upComingDateIdeas = ideas
    .filter((idea) => new Date(idea.date) >= current)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="p-4 max-w-screen-md mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Upcoming Date Ideas</h1>

      {upComingDateIdeas.length > 0 ? (
        <ul className="space-y-6">
          {upComingDateIdeas.map((idea, index) => (
            <li
              key={index}
              className="p-6 border rounded-lg shadow-lg bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between transition-transform transform hover:scale-105"
            >
              <div className="flex-1">
                <div className="text-xl font-semibold text-blue-600">{idea.title}</div>
                <div className="text-gray-600">{new Date(idea.date).toLocaleString()}</div>
              </div>
              <button
                onClick={() => setSelectedIdea(idea)}
                className="mt-4 sm:mt-0 sm:ml-6 bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No upcoming date ideas.</p>
      )}

      <DateIdeaDetailsModal
        isOpen={!!selectedIdea}
        onClose={() => setSelectedIdea(null)}
        idea={selectedIdea}
      />
    </div>
  );
}