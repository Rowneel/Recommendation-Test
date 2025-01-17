import React, { useEffect, useState } from "react";
import useRecommendation from "../hooks/useRecommendation";
import { useParams } from "react-router-dom";
import { apiFetchGamesDetails } from "../services/recommendationService";
import htmlReactParser from "html-react-parser";

function GameInfoPage() {
  const { games } = useRecommendation();
  const { gameId } = useParams();
  const [singleGame, setSingleGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const game = games.find((game) => game.steam_appid == gameId);

  useEffect(() => {
    if (!game && gameId) {
      setLoading(true);
      setError(null);
      const fetchSingleGame = async () => {
        try {
          const response = await apiFetchGamesDetails(gameId);
          if (response.status === 200) {
            setSingleGame(response.data);
          } else {
            setError("Failed to fetch game details.");
          }
        } catch (err) {
          setError("An error occurred while fetching game details.");
        } finally {
          setLoading(false);
        }
      };

      fetchSingleGame();
    } else {
      setLoading(true);
      setSingleGame(game);
      setLoading(false);
    }
  }, [gameId, games, game]);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  if (!singleGame) {
    return <div className="text-center text-xl">Game not found.</div>;
  }

  return (
    <div className="text-white bg-gray-900 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">{singleGame?.name}</h1>
          <img
            id="game-header"
            alt={`${singleGame?.name} Header Image`}
            className="rounded-lg shadow-lg w-full"
            src={`${singleGame?.header_image}`}
          />
        </header>

        <section className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold">Short Description</h3>
            <p className="mt-2 text-lg">{singleGame?.short_description}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold">About the Game</h3>
            <div className="mt-2 text-lg">
              {singleGame?.detailed_description ? (
                singleGame?.detailed_description.includes("<") ? (
                  htmlReactParser(singleGame?.detailed_description)
                ) : (
                  <p>{singleGame?.detailed_description}</p>
                )
              ) : (
                <p>No description available.</p>
              )}
            </div>
            <div className="mt-4">
              {singleGame?.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-500 text-white text-sm px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {genre.description}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold">System Requirements</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg">Minimum Requirements</h4>
                {singleGame?.pc_requirements?.minimum ? (
                  <p className="text-sm">
                    {htmlReactParser(singleGame?.pc_requirements?.minimum)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Not available</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-lg">
                  Recommended Requirements
                </h4>
                {singleGame?.pc_requirements?.recommended ? (
                  <p className="text-sm">
                    {htmlReactParser(singleGame?.pc_requirements?.recommended)}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Not available</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold">Categories</h3>
            <ul className="mt-2 list-disc pl-6">
              {singleGame?.categories.map((category, index) => (
                <li key={index} className="text-lg">
                  {category.description}
                </li>
              ))}
            </ul>
            <h3 className="text-2xl font-semibold mt-4">Genres</h3>
            <ul className="mt-2 list-disc pl-6">
              {singleGame?.genres.map((genre, index) => (
                <li key={index} className="text-lg">
                  {genre.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold">Screenshots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {singleGame?.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot.path_thumbnail}
                  alt={`Screenshot ${index + 1}`}
                  className="rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>

          {singleGame?.movies && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold">Trailers</h3>
              <video controls className="w-full mt-4 rounded-lg shadow-lg">
                <source type="video/mp4" src={singleGame?.movies[0].mp4[480]} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {singleGame?.recommendations && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold">User Recommendations</h3>
              <p className="mt-2 text-lg">
                {singleGame?.recommendations?.total}
              </p>
            </div>
          )}
        </section>

        <footer className="mt-8 text-center">
          {singleGame?.developers && (
            <div className="mb-4">
              <h3 className="text-2xl font-semibold">Developers</h3>
              <p className="text-lg">{singleGame?.developers.join(", ")}</p>
            </div>
          )}
          {singleGame?.publishers && (
            <div className="mb-4">
              <h3 className="text-2xl font-semibold">Publishers</h3>
              <p className="text-lg">{singleGame?.publishers.join(", ")}</p>
            </div>
          )}
          {singleGame?.metacritic?.score && (
            <p>
              Metacritic Score:{" "}
              <a
                href={`https://www.metacritic.com/game/pc/${singleGame?.name}`}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {singleGame?.metacritic?.score}
              </a>
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}

export default GameInfoPage;
