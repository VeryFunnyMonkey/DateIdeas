import React from 'react';
import DateIdeaCard from './DateIdeaCard';

export default function DateIdeaList({ ideas = [], onSchedule, onEdit, onDelete }) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.filter(idea=> !idea.isCompleted).map((idea) => (
          <DateIdeaCard
            key={idea.id}
            idea={idea}
            onSchedule={onSchedule}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}