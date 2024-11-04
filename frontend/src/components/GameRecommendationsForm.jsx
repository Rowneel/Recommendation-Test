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
    <div className="p-2 w-full max-w-[512px]">
      {/* Recommendation Method Cards */}
      {/* <span className="block text-xl text-center w-full mb-2">Select Recommendation Method:</span> */}
      <div className="flex gap-2 mb-4">
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
          hidden:visible
          selectedMethod={selectedMethod}
          handleMethodSelect={handleMethodSelect}
          icon={MdOutlineStar}
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center h-10">
        <input
          type="text"
          placeholder="Search for games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow h-full p-2 text-lg border bg-gray-800 border-primary rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          onClick={handleSearch}
          className="h-full px-5 bg-primary text-black rounded-r-md hover:bg-accent flex items-center justify-center "
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default GameRecommendationForm;
