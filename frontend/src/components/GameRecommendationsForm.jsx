import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useRecommendation from '../hooks/useRecommendation';

const GameRecommendationsForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const {fetchRecommendations} = useRecommendation()

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    console.log('Selected Method:', selectedMethod);
    // Add logic here to fetch recommendations based on searchQuery and selectedMethod
    fetchRecommendations(searchQuery, selectedMethod)
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Search for games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-2 text-lg border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          <FaSearch />
        </button>
      </div>

      {/* Recommendation Method Cards */}
      <div className="flex space-x-4">
        <div
          onClick={() => handleMethodSelect('title')}
          className={`flex-1 p-4 text-center rounded-lg cursor-pointer ${
            selectedMethod === 'title' ? 'border-2 border-blue-500' : 'border border-gray-300'
          }`}
        >
          <h3 className="font-semibold">By Title</h3>
        </div>
        <div
          onClick={() => handleMethodSelect('description')}
          className={`flex-1 p-4 text-center rounded-lg cursor-pointer ${
            selectedMethod === 'description' ? 'border-2 border-blue-500' : 'border border-gray-300'
          }`}
        >
          <h3 className="font-semibold">By Description</h3>
        </div>
        <div
          onClick={() => handleMethodSelect('rating')}
          className={`flex-1 p-4 text-center rounded-lg cursor-pointer ${
            selectedMethod === 'rating' ? 'border-2 border-blue-500' : 'border border-gray-300'
          }`}
        >
          <h3 className="font-semibold">By Rating</h3>
        </div>
      </div>
    </div>
  );
};

export default GameRecommendationsForm;
