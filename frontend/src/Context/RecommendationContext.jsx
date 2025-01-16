import React, { createContext, useState, useEffect } from "react";
import {
  apiFetchGamesDetails,
  apiFetchRecommendationsDesc,
  apiFetchRecommendationsTitle,
  apiFetchPopularGames,
  apiFetchRecommendationsRating
} from "../services/recommendationService";

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [games, setGames] = useState([]); // Regular search results
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state


  // Fetch popular games on component mount
  useEffect(() => {
    // fetchPopularGames();
  }, []);

  // Fetch popular games
  const fetchPopularGames = async () => {
    setLoading(true);

    setError(null);
    try {
      const response = await apiFetchPopularGames();
      // Fetch game details for popular games
      await fetchGameDetailsPop(response?.data);
    } catch (error) {
      setError("An error occurred while fetching popular games.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch game details based on the gameIds
  const fetchGameDetails = async (gameIds) => {
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
        setError(`Game(s) for id(s) ${idsMessage} might be removed from Steam.`);
      }

      setGames(results.filter((game) => game !== null)); // Update regular search results
    } catch (error) {
      setError("An error occurred while fetching game details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGameDetailsPop = async (gameIds) => {
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
        setError(`Game(s) for id(s) ${idsMessage} might be removed from Steam.`);
      }

      setPopularGames(results.filter((game) => game !== null)); // Update regular search results
    } catch (error) {
      setError("An error occurred while fetching game details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations based on search query
  const fetchRecommendations = async (searchQuery, selectedMethod) => {
    setLoading(true);
    setError(null);
    try {
      let gameIds = [];
      if (selectedMethod === "description") {
        const res = await apiFetchRecommendationsDesc(searchQuery);
        gameIds = res.data;
      }
      if(selectedMethod === "title"){
        const res = await apiFetchRecommendationsTitle(searchQuery);
        gameIds = res.data;
      }
      if(selectedMethod === "rating"){
        const res = await apiFetchRecommendationsRating(searchQuery);
        gameIds = res.data;
      }
      // Fetch game details for search query
      await fetchGameDetails(gameIds);
    } catch (e) {
      setError(`Error: ${e?.response?.data?.error || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecommendationContext.Provider
      value={{
        games,
        loading,
        error,
        popularGames,
        fetchRecommendations, // For searching
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};
