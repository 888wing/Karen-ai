'use client';

import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function IndustrySelection({ onClose }) {
  const { selectedIndustry, setSelectedIndustry } = useAppContext();

  const industries = [
    { id: 'technology', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'retail', name: 'Retail' }
  ];

  const handleSelect = (id) => {
    setSelectedIndustry(id);
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
          <h2 className="text-xl font-bold">Select Industry</h2>
          <button onClick={onClose} className="text-xl">
            <FaTimes />
          </button>
        </div>

        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {industries.map((industry) => (
            <button
              key={industry.id}
              className={`w-full p-4 flex items-center rounded-lg mb-2 ${
                selectedIndustry === industry.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelect(industry.id)}
            >
              <div className="text-left">
                <h3 className="font-medium">{industry.name}</h3>
              </div>
              {selectedIndustry === industry.id && (
                <FaCheck className="ml-auto text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}