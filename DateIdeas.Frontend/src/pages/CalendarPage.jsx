import { useState } from "react";
import DateIdeaDetailsModal from "../components/DateIdeaDetailsModal";

export default function CalendarPage({ ideas }) {
  const [selectedIdea, setSelectedIdea] = useState(null);

  const current = new Date();

  const upComingDateIdeas = ideas
    .filter((idea) => new Date(idea.scheduledDate) >= current)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  return (
    <div className="pb-16 pt-4 bg-slate-50 h-svh overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Upcoming Dates</h1>

      {upComingDateIdeas.length > 0 ? (
        <ul className="space-y-6">
          {upComingDateIdeas.map((idea, index) => (
            <li
              key={index}
              className="p-6 border rounded-lg shadow-lg bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between transition-transform transform hover:scale-105"
            >
              <div className="flex-1">
                <div className="text-xl font-semibold text-blue-600">{idea.title}</div>
                <div className="text-gray-600">{new Date(idea.scheduledDate).toLocaleString()}</div>
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
        <p className="text-center text-gray-500">No upcoming dates.</p>
      )}

      <DateIdeaDetailsModal
        isOpen={!!selectedIdea}
        onClose={() => setSelectedIdea(null)}
        idea={selectedIdea}
      />
    </div>
  );
}