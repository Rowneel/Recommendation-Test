import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";
import { apiFetchGamesDetails } from "../services/recommendationService";

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null); // State for a single game
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async (searchQuery, selectedMethod) => {
    setLoading(true);
    setError(null);
    //call api get array of geameIds
    try {
      console.log(searchQuery);
      console.log(selectedMethod);
      const gameIds = [570, 1];
      fetchGameDetails(gameIds);
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchGameDetails = async (gameIds) => {
    setLoading(true);
    setError(null);
    try {
      setGames([
        {
          steam_appid: 23,
          header_image: "/vite.svg",
          name: "dota",
          short_description: "short_description",
        },
        {
          steam_appid: 33,
          header_image: "/vite.svg",
          name: "dota2",
          short_description: "short_description2",
        },
        {
          steam_appid: 33,
          header_image: "/vite.svg",
          name: "dota2",
          short_description: "short_description2",
        },
        {
          steam_appid: 33,
          header_image: "/vite.svg",
          name: "dota2",
          short_description: "short_description2",
        },
        {
          steam_appid: 33,
          header_image: "/vite.svg",
          name: "dota2",
          short_description: "short_description2",
        },
      ]);
      //   const promises = gameIds.map(async (id) => {
      //     try {
      //       const response = await apiFetchGamesDetails(id);
      //       return response.status === 200 ? response.data : null;
      //     } catch (error) {
      //       if (error.status) {
      //         setError((prevError) =>
      //           prevError ? `${prevError}\nGame for id ${id} might be removed from steam` : `Game for id ${id} might be removed from steam`
      //         );
      //       }

      //       return null;
      //     }
      //   });

      //   const results = await Promise.all(promises);
      //   setGames(results.filter((game) => game !== null));
    } catch (error) {
      console.error("Error fetching game details:", error);
      setError("Failed to fetch game details.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a single game’s details
  const fetchSingleGame = async (gameId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/appdetails/${gameId}`
      );
      if (response.status === 200) {
        setGame(response.data);
      } else {
        setError("Game not found.");
      }
    } catch (error) {
      setError("Error fetching game details.");
      console.error("Error fetching game details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecommendationContext.Provider
      value={{
        games,
        game,
        loading,
        error,
        fetchGameDetails,
        fetchSingleGame,
        fetchRecommendations
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};
