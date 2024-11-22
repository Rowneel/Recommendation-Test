import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";
import {
  apiFetchGamesDetails,
  apiFetchRecommendationsDesc,
} from "../services/recommendationService";

export const RecommendationContext = createContext();

export const RecommendationProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null); // State for a single game may remove this
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async (searchQuery, selectedMethod) => {
    setLoading(true);
    setError(null);
    //call api get array of geameIds
    try {
      console.log(searchQuery);
      console.log(selectedMethod);
      let gameIds = [];
      if (selectedMethod === "description") {
        const res = await apiFetchRecommendationsDesc(searchQuery);
        console.log(res);
        gameIds = res.data;
      }
      await fetchGameDetails(gameIds);
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

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
        const finalMessage = `Game(s) for id(s) ${idsMessage} might be removed from Steam`;
        setError(finalMessage);
      }
      setGames(results.filter((game) => game !== null));
    } catch (error) {
      setError("An error occurred while fetching game details.");
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
        fetchRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};
