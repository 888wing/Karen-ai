'use client';

import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function CharacterSelection({ onClose }) {
  const { selectedCharacter, setSelectedCharacter } = useAppContext();

  const characters = [
    {
      id: 'karen',
      name: 'Karen',
      description: 'Picky and detail-oriented. Will nitpick every detail.'
    },
    {
      id: 'steve',
      name: 'Steve',
      description: 'Likes concise answers. Skip unnecessary details.'
    },
    {
      id: 'linda',
      name: 'Linda',
      description: 'Asks tough questions but always with a smile.'
    },
    {
      id: 'bob',
      name: 'Bob',
      description: 'May ask unexpected questions like "How would you explain your job to an alien?"'
    }
  ];

  const handleSelect = (id) => {
    setSelectedCharacter(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Select HR Character</h2>
          <button onClick={onClose} className="text-xl">
            <FaTimes />
          </button>
        </div>

        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {characters.map((character) => (
            <button
              key={character.id}
              className={`w-full p-4 flex items-start rounded-lg mb-2 ${
                selectedCharacter === character.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelect(character.id)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex-shrink-0"></div>
              <div className="text-left">
                <h3 className="font-medium">{character.name}</h3>
                <p className="text-sm text-gray-600">{character.description}</p>
              </div>
              {selectedCharacter === character.id && (
                <FaCheck className="ml-auto text-blue-500 mt-1" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}