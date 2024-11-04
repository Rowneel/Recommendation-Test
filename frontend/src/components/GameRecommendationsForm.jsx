import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineDescription, MdOutlineStar } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import useRecommendation from "../hooks/useRecommendation";
import MethodCard from "./forms/MethodCard";

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
    <div className="sm:p-4 p-2 max-w-lg mx-auto">
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
      <div className="flex gap-2">
      <MethodCard
        method="title"
        selectedMethod={selectedMethod}
        handleMethodSelect={handleMethodSelect}
        icon={IoGameController}
      />
      <MethodCard
        method="description"
        selectedMethod={selectedMethod}
        handleMethodSelect={handleMethodSelect}
        icon={MdOutlineDescription}
      />
      <MethodCard
        method="rating"
        selectedMethod={selectedMethod}
        handleMethodSelect={handleMethodSelect}
        icon={MdOutlineStar}
      />
      </div>
    </div>
  );
};

export default GameRecommendationForm;
