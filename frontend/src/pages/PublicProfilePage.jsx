import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";

function PublicProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();

  const games = [
    {
      id: "game1",
      name: "The Legend of Zelda: Breath of the Wild",
      cover: "https://via.placeholder.com/200",
    },
    {
      id: "game2",
      name: "Hollow Knight",
      cover: "https://via.placeholder.com/200",
    },
    {
      id: "game3",
      name: "Cyberpunk 2077",
      cover: "https://via.placeholder.com/200",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="dark:bg-gray-800 bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto mt-10">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <img
            src={`http://127.0.0.1:8000${user?.avatar}`}
            alt={`${user?.username}'s avatar`}
            className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600"
            onError={(e) => {
              e.target.onerror = null; // prevents infinite loop in case default fails
              e.target.src = "/default-avatar.jpg"; // fallback to default avatar
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">ID: {user?.pk}</p>
          </div>
        </div>
      </div>

      {/* Game Library Section */}
      <div className="mt-6 dark:bg-gray-700 bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Game Library
        </h2>
        {games.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <li
                key={game.id}
                className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500"
              >
                <img
                  src={game.cover}
                  alt={game.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {game.name}
                </h3>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            No games in your library yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default PublicProfilePage;
