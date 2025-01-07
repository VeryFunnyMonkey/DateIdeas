import React, { useState, useEffect } from 'react';
import { GiftIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Confetti from 'react-confetti';
import DateIdeaCard from '../components/DateIdeaCard';
import './random.css';
import NoDateIdeas from '../components/NoDateIdeas';

export default function RandomPage({ ideas }) {
  const [isSwaying, setIsSwaying] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);

  const handleGiftClick = () => {
    if (!isSwaying && !isBroken) {
      setIsSwaying(true);
      setTimeout(() => {
        setIsSwaying(false);
        setIsBroken(true);
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
        setSelectedIdea(randomIdea);
      }, 1000);
    }
  };

  const handleRedoClick = () => {
    setIsBroken(false);
    setSelectedIdea(null);
  };

  return (
    <div className="flex flex-col justify-center h-svh bg-slate-50">
      {(ideas.length === 0) ? <NoDateIdeas /> :
      isBroken ? (
        <div className="flex items-center justify-center">
          <GiftIcon
            className={`h-32 w-32 text-pink-500 cursor-pointer ${isSwaying ? 'sway' : ''}`}
            onClick={handleGiftClick}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="w-full max-w-md p-4">
            <DateIdeaCard idea={selectedIdea} />
          </div>
          <button
            onClick={handleRedoClick}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded flex items-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Redo
          </button>
        </div>
      )}
    </div>
  );
}