import React, { useState, useEffect } from "react";
import useRecommendation from "../hooks/useRecommendation";

const GameRecommendations = () => {
  const {games, error, loading} = useRecommendation()

  return (
    <div className="game-recommendations">
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>} {/* Show loading indicator */}
      {!loading && games.length === 0 && <p>No games found.</p>}{" "}
      {/* Show message if no games */}
      {games.map((game) => (
        <div key={game.steam_appid} className="game-card">
          {/* Use game.id for a unique key */}
          <img src={game.header_image} alt={game.name} />
          <h3>{game.name}</h3>
          <p>{game.short_description}</p>
        </div>
      ))}
    </div>
  );
};

export default GameRecommendations;
