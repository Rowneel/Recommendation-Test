import React, { useState, useEffect } from "react";
import useRecommendation from "../hooks/useRecommendation";

const GameRecommendations = () => {
  const { games, error, loading } = useRecommendation();

  return (
    // <div className="flex justify-center">
    //   <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-full">
    //     {error && (
    //       <div
    //         class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
    //         role="alert"
    //       >
    //         <span class="font-medium">{error}</span>
    //       </div>
    //     )}
    //     {loading && <p>Loading...</p>} {/* Show loading indicator */}
    //     {!loading && games.length === 0 && <p>No games found.</p>}{" "}
    //     {/* Show message if no games */}
    //     {games.map((game) => (
    //       <div
    //         key={game.steam_appid}
    //         className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    //       >
    //         <a href="#">
    //           <img
    //             className="rounded-t-lg"
    //             src={game.header_image}
    //             alt={game.name}
    //           />
    //         </a>
    //         <div className="p-5">
    //           <a href="#">
    //             <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    //               {game.name}
    //             </h5>
    //           </a>
    //           <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
    //             {game.short_description}
    //           </p>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>

<div className="flex justify-center">
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full max-w-screen-xl p-10">
        {error && (
          <div
            className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
          >
            <span className="font-medium">{error}</span>
          </div>
        )}
        {loading && <p>Loading...</p>} {/* Show loading indicator */}
        {!loading && games.length === 0 && <p>No games found.</p>} {/* Show message if no games */}
        
        {games.map((game) => (
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
  );
};

export default GameRecommendations;
