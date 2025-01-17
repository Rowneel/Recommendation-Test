import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";
import { Link } from "react-router-dom";
//API SERVICES
import {
  apiFetchGamesDetails,
  apiFetchPersonalRecommendations,
} from "../services/recommendationService";

const PersonalRecommendations = () => {
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [appliedGenres, setAppliedGenres] = useState(new Set());
  const [personalGames, setPersonalGames] = useState([]); // State for personal recommendations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isWindowWide = window.innerWidth > 1024;
  const [isSidebarOpen, setIsSidebarOpen] = useState(isWindowWide);
  const [filterLoading, setFilterLoading] = useState(false);
  const [genres, setGenres] = useState([]); // State to hold genres

  const handleGenreChange = (genre) => {
    const newSelectedGenres = new Set(selectedGenres);
    if (newSelectedGenres.has(genre)) {
      newSelectedGenres.delete(genre);
    } else {
      newSelectedGenres.add(genre);
    }
    setSelectedGenres(newSelectedGenres);
  };

  const applyFilters = () => {
    setFilterLoading(true);
    setAppliedGenres(new Set(selectedGenres));
    setFilterLoading(false);
  };

  const resetGenres = () => {
    setSelectedGenres(new Set());
    setAppliedGenres(new Set());
  };

  const filterGames = (gameList) => {
    return gameList.filter((game) => {
      // If no genres are applied, include all games
      if (appliedGenres.size === 0) return true;

      // Convert appliedGenres to an array for easier use with every
      const appliedGenresArray = Array.from(appliedGenres);

      // Check if all applied genres are present in either genres or categories
      return appliedGenresArray.every(
        (filter) =>
          (game.genres || []).some(
            (genre) => genre.description.toLowerCase() === filter
          ) ||
          (game.categories || []).some(
            (category) => category.description.toLowerCase() === filter
          )
      );
    });
  };

  const fetchPersonalRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetchPersonalRecommendations();
      await fetchGameDetailsPersonal(response?.data);
    } catch (error) {
      console.log(error);

      setError(
        "Add Games to your Library to get Personalized Recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchGameDetailsPersonal = async (gameIds) => {
    setLoading(true);
    setError(null);
    let failedIds = [];
    try {
      const promises = gameIds.map(async (id) => {
        try {
          const response = await apiFetchGamesDetails(id);
          return response.status === 200 ? response.data : null;
        } catch (error) {
          failedIds.push(id);
          return null;
        }
      });

      const results = await Promise.all(promises);

      if (failedIds.length > 0) {
        const idsMessage = failedIds.join(",");
        setError(
          `Game(s) for id(s) ${idsMessage} might be removed from Steam.`
        );
      }

      setPersonalGames(results.filter((game) => game !== null));
    } catch (error) {
      setError("An error occurred while fetching game details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalRecommendations(); // Fetch personal recommendations on component mount
  }, []);

  const filteredGames = filterGames(personalGames);

  useEffect(() => {
    const genreSet = new Set(
      personalGames.flatMap((game) => [
        ...game.genres?.map((genre) => genre.description.toLowerCase()),
        ...game.categories?.map((category) =>
          category.description.toLowerCase()
        ),
      ])
    );

    setGenres(Array.from(genreSet).sort());
  }, [personalGames]);

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
      <h2 className="text-5xl text-center text-primary">
        Recommendations Based On Your Library
      </h2>
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

      <div className="flex relative">
        <div
          className={`absolute top-0 w-1/2 sm:w-60 rounded-lg p-4 ml-4 bg-gray-800 sm:static sm:top-0 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full hidden"
          }`}
        >
          <h2 className="mb-4 text-lg font-bold">Filter by Genre</h2>
          <div className="h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-accent scrollbar-track-gray-800">
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

        <div className={`flex-1 px-4`}>
          {error && (
            <div
              className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              <span className="font-medium">{error}</span>
            </div>
          )}
          {loading || filterLoading ? renderLoadingSkeletons() : null}
          {!loading && !filterLoading && filteredGames.length === 0 && (
            <p>No games found based on your filter criteria.</p>
          )}

          <div
            className={`grid gap-5 grid-cols-1 sm:grid-cols-2 ${
              isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
            {filteredGames.map((game) => (
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

export default PersonalRecommendations;
