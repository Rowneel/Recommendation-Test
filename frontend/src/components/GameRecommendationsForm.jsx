import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useRecommendation from "../hooks/useRecommendation";

const GameRecommendationForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("title");
  const { fetchRecommendations } = useRecommendation();

  const handleSearch = () => {
    // console.log("Searching for:", searchQuery);
    // console.log("Selected Method:", selectedMethod);
    // Add logic here to fetch recommendations based on searchQuery and selectedMethod
    fetchRecommendations(searchQuery, selectedMethod);
    setSearchQuery("");
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="sm:p-8 p-2 max-w-lg mx-auto">
      {/* Search Bar */}
      <div className="flex items-center mb-6 h-10">
        <input
          type="text"
          placeholder="Search for games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow h-full p-2 text-lg border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="h-full px-5 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 flex items-center justify-center"
        >
          <FaSearch />
        </button>
      </div>

      {/* Recommendation Method Cards */}
      <div className="flex gap-4 h-32">
        <div
          onClick={() => handleMethodSelect("title")}
          className={`flex-1 p-4  text-center rounded-lg cursor-pointer ${
            selectedMethod === "title"
              ? " shadow-selected shadow-green-800"
              : "border border-gray-100"
          }`}
        >
          <h3 className="font-semibold">By Title</h3>
        </div>
        <div
          onClick={() => handleMethodSelect("description")}
          className={`flex-1 p-4 text-center rounded-lg cursor-pointer ${
            selectedMethod === "description"
              ? " shadow-selected shadow-green-800"
              : "border border-gray-100"
          }`}
        >
          <h3 className="font-semibold">By Description</h3>
        </div>
        <div
          onClick={() => handleMethodSelect("rating")}
          className={`flex-1 p-4 text-center rounded-lg cursor-pointer ${
            selectedMethod === "rating"
              ? " shadow-selected shadow-green-800"
              : "border border-gray-100"
          }`}
        >
          <h3 className="font-semibold">By Rating</h3>
        </div>
      </div>
    </div>
  );
};

export default GameRecommendationForm;
