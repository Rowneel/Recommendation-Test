import React, { useState } from "react";
import useRecommendation from "../hooks/useRecommendation";
import { FaFilter } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";

const GameRecommendations = () => {
  const { games, error, loading } = useRecommendation();
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const isWindowWide = window.innerWidth > 1024;
  const [isSidebarOpen, setIsSidebarOpen] = useState(isWindowWide);

  // Example genres
  const genres = ["action", "adventure", "strategy", "rpg", "sports"];

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

  // Filter games based on selected genres
  const filteredGames = games.filter(
    (game) => selectedGenres.size === 0 || selectedGenres.has(game.genre)
  );

  return (
    <div className="flex flex-col sm:mx-10 mx-0 dark:text-text">
      {/* Sidebar toggle button for small devices */}

      <span
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-4 w-32 mt-5 flex items-center font-bold text-xl cursor-pointer hover:text-accent " 
      >
        {isSidebarOpen ? (
          <>
            <RiCloseLargeLine className="mr-2 " />
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
          className={`absolute top-0 w-1/2 sm:w-52 p-4 ml-4 bg-gray-800 sm:static sm:top-0 transform transition-transform duration-300 ${
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
          {loading && <p>Loading...</p>}
          {!loading && filteredGames.length === 0 && <p>No games found.</p>}
          <div
            className={`grid gap-5 grid-cols-1 sm:grid-cols-2  ${
              isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
            {filteredGames.map((game) => (
              <div
                key={game.steam_appid}
                className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <a href="#">
                  <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={game.header_image}
                    alt={game.name}
                  />
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {game.name}
                    </h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
                    {game.short_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRecommendations;
