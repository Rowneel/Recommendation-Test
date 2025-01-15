import React, { useState, useEffect } from "react";
import useRecommendation from "../hooks/useRecommendation";
import { FaFilter } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const GameRecommendations = () => {
  const { games, error, loading, popularGames } = useRecommendation();
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [appliedGenres, setAppliedGenres] = useState(new Set()); // State to hold applied genres
  const isWindowWide = window.innerWidth > 1024;
  const [isSidebarOpen, setIsSidebarOpen] = useState(isWindowWide);
  const [filterLoading, setFilterLoading] = useState(false);

  // Example genres
  const genres = ["action", "adventure", "casual", "strategy", "rpg", "sports","racing",
  "shooter",
  "simulation",
  "massively multiplayer",
  "arcade",
  "action rpg",
  "platformer",
  "puzzle",
  "sandbox",
  "battle royale"];

  // Handle genre selection
  const handleGenreChange = (genre) => {
    const newSelectedGenres = new Set(selectedGenres);
    if (newSelectedGenres.has(genre)) {
      newSelectedGenres.delete(genre); // Deselect if already selected
    } else {
      newSelectedGenres.add(genre); // Select the genre
    }
    setSelectedGenres(newSelectedGenres);
  };

  // Apply filters to update the filtered games
  const applyFilters = () => {
    setFilterLoading(true);
    setAppliedGenres(new Set(selectedGenres)); // Update applied genres
    setFilterLoading(false);
  };

  const resetGenres = () => {
    setSelectedGenres(new Set()); // Clear selected genres
    setAppliedGenres(new Set()); // Clear applied genres
  };

  const filterGames = (gameList) => {
    return gameList.filter(
      (game) =>
        appliedGenres.size === 0 ||
        game.genres.some((genre) =>
          appliedGenres.has(genre.description.toLowerCase())
        )
    );
  };

  // Filter games based on applied genres
  const filteredGames = filterGames(games);

  const filteredPopularGames = filterGames(popularGames);
  

  // Function to display loading skeletons
  const renderLoadingSkeletons = () => {
    return (
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 animate-pulse"
          >
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg" />
            <div className="p-5">
              <div className="h-6 bg-gray-400 dark:bg-gray-600 mb-2 rounded w-3/4"></div>
              <div className="h-4 bg-gray-400 dark:bg-gray-600 mb-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:mx-10 mx-0 dark:text-white">
      {/* Sidebar toggle button for small devices */}
      <span
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-4 w-32 mt-5 flex items-center font-bold text-xl cursor-pointer hover:text-accent"
      >
        {isSidebarOpen ? (
          <>
            <RiCloseLargeLine className="mr-2" />
            Close
          </>
        ) : (
          <>
            <FaFilter className="mr-2" />
            Filter
          </>
        )}
      </span>

      {/* Sidebar for genre selection */}
      <div className="flex relative">
        <div
          className={`absolute top-0 w-1/2 sm:w-60 rounded-lg p-4 ml-4 bg-gray-800 sm:static sm:top-0 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full hidden"
          }`}
        >
          <h2 className="mb-4 text-lg font-bold">Filter by Genre</h2>
          {genres.map((genre) => (
            <div key={genre} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={genre}
                value={genre}
                checked={selectedGenres.has(genre)}
                onChange={() => handleGenreChange(genre)}
                className="mr-2"
              />
              <label htmlFor={genre} className="dark:text-white">
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </label>
            </div>
          ))}
          <div className="flex gap-4">
            <button
              onClick={resetGenres}
              className="mt-4 px-4 py-2 w-1/2 bg-primary text-text rounded hover:bg-accent text-xl font-extrabold"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="mt-4 px-4 py-2 w-1/2 bg-primary text-text rounded hover:bg-accent text-xl font-extrabold"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 px-4`}>
          {error && (
            <div
              className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <span className="font-medium">{error}</span>
            </div>
          )}
          {/* Show skeletons during loading */}
          {loading || filterLoading ? renderLoadingSkeletons() : null}
          {!loading &&
            !filterLoading &&
            games.length === 0 &&
            filteredGames.length === 0 && filteredPopularGames.length === 0 && (
              <p>No games found based on your filter criteria.</p>
            )}
          {games.length === 0 && <div className="text-white">Popular Games:</div>}

          <div
            className={`grid gap-5 grid-cols-1 sm:grid-cols-2 ${
              isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
            {(filteredGames.length > 0? filteredGames : filteredPopularGames).map((game) => (
              <Link to={`/game/${game.steam_appid}`} key={game.steam_appid}>
                <div className="rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                  <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={game.header_image}
                    alt={game.name}
                  />
                  <div className="p-5">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {game.name}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                      {game.short_description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRecommendations;
