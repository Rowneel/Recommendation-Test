import { React, useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { apiFetchSuggestions } from "../../services/recommendationService";
import { FaTimes } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  apiUpdateLibrary,
  apiFetchLibrary,
  apiDeleteLibrary,
} from "../../services/libraryService"; // Add API to get library
import { Link } from "react-router-dom";

function UpdateGamesForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [userLibrary, setUserLibrary] = useState([]); // State to hold the user's current library

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

  const fetchUserLibrary = async () => {
    try {
      const response = await apiFetchLibrary(); // Fetch the user's current library
      setUserLibrary(response.data.map((item) => item.app_id) || []); // Assuming the response data contains the library games
    } catch (error) {
      if (error?.response?.data?.error === "User's library is empty.") {
        setUserLibrary([]);
      } else {
        console.error("Error fetching library", error);
      }
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

  // Handle selecting a suggestion
  const handleSuggestionSelect = (suggestion) => {
    if (
      !selectedSuggestions.find((item) => item.app_id === suggestion.app_id)
    ) {
      setSelectedSuggestions([...selectedSuggestions, suggestion]);
    }
    setSearchQuery(""); // Clear input after selection
  };

  // Handle removing a selected suggestion
  const handleRemoveSuggestion = (suggestionToRemove) => {
    setSelectedSuggestions(
      selectedSuggestions.filter(
        (suggestion) => suggestion.app_id !== suggestionToRemove.app_id
      )
    );
  };

  const handleAddToLibrary = async () => {
    const appIds = selectedSuggestions.map((item) => item.app_id);
    console.log(appIds);
    const formData = {
      app_id: appIds,
    };
    try {
      // Call API to update the library with selected games
      const response = await apiUpdateLibrary(formData);
      console.log(response);

      if (response.status === 201) {
        // alert("Games added to your library successfully!");
        // After adding, refresh the library list
        setSelectedSuggestions([]); // Clear selected suggestions
        fetchUserLibrary();
      } else {
        alert("Failed to add games to library");
      }
    } catch (error) {
      console.error("Error adding to library:", error);
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";

      if (errorMessage.startsWith("UNIQUE")) {
        alert("Game already in library");
      } else {
        alert("An error occurred while adding to the library.");
      }
    }
  };

  const handleDelete = async (game) => {
    const formData = {
      app_id: game,
    };
    try {
      // Call API to delete the game from the library
      const response = await apiDeleteLibrary(formData);
      console.log(response);

      if (response.status === 200) {
        // alert("Game removed from your library successfully!");
        // After removing, refresh the library list
        fetchUserLibrary();
      } else {
        alert("Failed to remove game from library");
      }
    } catch (error) {
      console.error("Error removing from library:", error);
      alert("An error occurred while removing from the library.");
    }
  };

  useEffect(() => {
    fetchUserLibrary(); // Fetch the user's library when the component mounts
  }, []);

  return (
    <div>
      <div className="text-[20px] font-bold">Add Games To your Library</div>
      <div className="relative flex items-center h-10 mt-4">
        <input
          type="text"
          placeholder="Search for games to add to your library"
          value={searchQuery}
          onChange={handleSearchChange} // Using the onChange handler with debounce
          className="flex-grow h-full p-2 text-lg border text-black bg-white border-gray-300 rounded-l-md focus:outline-accent dark:bg-gray-800 dark:border-primary dark:text-white"
        />
        <button
          onClick={handleAddToLibrary}
          className="h-full px-5 bg-primary text-text rounded-r-md hover:bg-accent flex items-center justify-center text-nowrap"
        >
          Add To Library
        </button>

        {/* Suggestion Dropdown */}
        {searchQuery && !loadingSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-10 z-20 dark:text-gray-300 text-black bg-white border border-gray-300 mt-1 rounded-md shadow-md max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        )}
        {loadingSuggestions && (
          <ul className="absolute left-0 right-0 top-10 z-20 dark:text-white text-black bg-white border border-gray-300 mt-1 rounded-md shadow-md max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              Loading...
            </li>
          </ul>
        )}
      </div>
      {selectedSuggestions.length > 0 && (
        <div className="mt-4">Add Following Games to Library:</div>
      )}
      <div className="flex  mt-2 gap-2">
        {selectedSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-md"
          >
            {suggestion.title}
            <FaTimes
              onClick={() => handleRemoveSuggestion(suggestion)}
              className="ml-2 cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-[20px] font-bold">Your Library:</div>
        <div className="mt-2">
          {userLibrary.length === 0 ? (
            <p>No games in your library yet.</p>
          ) : (
            <ul>
              {userLibrary.map((game, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between mt-2 dark:bg-gray-700 bg-gray-200 text-black dark:text-white rounded-md h-20"
                >
                  <Link to={`/game/${game}`} className="h-full">
                    {/* SteamID: {game} */}
                    <img
                      src={`https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game}/header.jpg`}
                      className="w-32 h-full rounded-l-md  object-cover"
                      alt="game_img"
                    />
                  </Link>
                    <div
                      onClick={() => handleDelete(game)}
                      className="bg-accent h-full flex items-center px-4 rounded-r-md hover:bg-red-500 hover:cursor-pointer text-black text-xl hover:text-white"
                    >
                      <MdDeleteForever />
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateGamesForm;
