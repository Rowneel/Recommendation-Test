import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineDescription, MdOutlineStar } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import useRecommendation from "../hooks/useRecommendation";
import MethodCard from "./forms/MethodCard";
import { apiFetchSuggestions } from "../services/recommendationService";

const GameRecommendationForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("description");
  const { fetchRecommendations, loading } = useRecommendation();
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const fetchSuggestions = async (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    try {
      const response = await apiFetchSuggestions(query);
      setSuggestions(response.data || []); // Assuming the response data contains the suggestions
    } catch (error) {
      console.error("Error fetching suggestions", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear the previous timeout if it exists
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new timeout to fetch suggestions after 300ms delay
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    // Store the timeout ID to clear it later if necessary
    setDebounceTimeout(timeoutId);
  };

  const handleSearch = () => {
    // console.log("Selected Method:", selectedMethod);
    fetchRecommendations(searchQuery, selectedMethod);
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion); // Set the input field with the selected suggestion
    setSuggestions([]); // Clear the suggestions dropdown
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
      {loading && (
        <div className="h-10 w-full text-center">
          Getting Recommendations...
        </div>
      )}
      {!loading && (
        <div className="relative flex items-center h-10">
          <input
            type="text"
            placeholder="Search for games..."
            value={searchQuery}
            onChange={handleSearchChange} // Using the onChange handler with debounce
            className="flex-grow h-full p-2 text-lg border bg-gray-800 border-primary rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            onClick={handleSearch}
            className="h-full px-5 bg-primary text-black rounded-r-md hover:bg-accent flex items-center justify-center "
          >
            <FaSearch />
          </button>
          {/* Suggestion Dropdown */}
          {searchQuery && !loadingSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-10 z-20 bg-gray-800 border border-gray-700 mt-1 rounded-md shadow-md max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-600"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {loadingSuggestions && (
            <ul className="absolute left-0 right-0 top-10 z-20 bg-gray-800 border border-gray-700 mt-1 rounded-md shadow-md max-h-60 overflow-y-auto">
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-600"
              >
                Loading...
              </li>
          </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GameRecommendationForm;
