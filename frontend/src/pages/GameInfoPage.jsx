import React, { useEffect, useState } from "react";
import useRecommendation from "../hooks/useRecommendation";
import { useParams } from "react-router-dom";
import { apiFetchGamesDetails } from "../services/recommendationService"; // Example API call to fetch a single game
import htmlReactParser from "html-react-parser";
function GameInfoPage() {
  const { games } = useRecommendation();
  const { gameId } = useParams();
  const [singleGame, setSingleGame] = useState(null); // To store the game fetched by API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Find the game from the existing recommendations
  const game = games.find((game) => game.steam_appid == gameId);

  useEffect(() => {
    // If the game is not found in the recommendations, fetch it individually
    if (!game && gameId) {
      setLoading(true);
      setError(null);
      const fetchSingleGame = async () => {
        try {
          const response = await apiFetchGamesDetails(gameId);
          if (response.status === 200) {
            setSingleGame(response.data); // Assuming the API returns the game data in `data`
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
      setSingleGame(game); // If the game is found, use it directly from the `games` array
      setLoading(false);
    }
  }, [gameId, games, game]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!singleGame) {
    return <div>Game not found.</div>;
  }

  console.log(singleGame);
  return (
    <div className="dark:text-white">
      <div>
        <header>
          <h1 id="game-title">{singleGame?.name}</h1>
          <img
            id="game-header"
            alt="FlatOut 4 Header Image"
            src={`${singleGame?.header_image}`}
          />
        </header>

        <section className="game-info">
          <div className="price">
            <h2 id="game-price"> </h2>
          </div>
          <div className="description">
            <h3>Short Description</h3>
            <p id="short-description">{singleGame?.short_description}</p>
          </div>

          <div className="detailed-description">
            <h3>About the Game</h3>
            <p id="detailed-description">
              {singleGame?.detailed_description ? (
                singleGame?.detailed_description.includes("<") ? (
                  htmlReactParser(singleGame?.detailed_description)
                ) : (
                  <p>{singleGame?.detailed_description}</p>
                )
              ) : (
                <p>No description available.</p>
              )}
            </p>
          </div>

          <div className="requirements">
            <h3>System Requirements</h3>
            <h4>PC Requirements</h4>
            {singleGame?.pc_requirements?.minimum &&
              htmlReactParser(singleGame?.pc_requirements?.minimum)}
            {singleGame?.pc_requirements?.recommended &&
              htmlReactParser(singleGame?.pc_requirements?.recommended)}
          </div>

          <div className="categories-genres">
            <h3>Categories</h3>
            {singleGame?.categories.map((category, index) => (
              <ul id="categories" key={index}>
                <li>{category.description}</li>
              </ul>
            ))}
            <h3>Genres</h3>
            {singleGame?.genres.map((genre, index) => (
              <ul id="genres" key={index}>
                <li>{genre.description}</li>
              </ul>
            ))}
          </div>

          <div className="screenshots">
            <h3>Screenshots</h3>
            <div id="screenshot-container">
              {singleGame?.screenshots.map((screenshot, index) => (
                <img key={index} src={screenshot.path_thumbnail} />
              ))}
            </div>
          </div>

          {singleGame?.movies && (
            <div className="trailer">
              <h3>Trailers</h3>
              <video id="trailer" controls>
                <source
                  id="trailer-source"
                  type="video/mp4"
                  src={singleGame?.movies[0].mp4[480]}
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="recommendations">
            <h3>User Recommendations</h3>
            <p id="recommendations">{singleGame?.recommendations?.total}</p>
          </div>
        </section>

        <footer>
          {singleGame?.developers &&
            singleGame?.developers.map((dev, index) => (
              <div key={index}>
                <h3>Developers</h3>
                <p id="developer">{dev}</p>
              </div>
            ))}
          {singleGame?.publishers &&
            singleGame?.publishers.map((publisher, index) => (
              <div key={index}>
                <h3>publishers</h3>
                <p id="developer" key={index}>
                  {publisher}
                </p>
              </div>
            ))}
          {singleGame?.metacritic?.score && (
            <p>
              Metacritic Score:{" "}
              <a id="metacritic-link" href="#" target="_blank">
                <span id="metacritic-score">
                  {singleGame?.metacritic?.score}
                </span>
              </a>
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}

export default GameInfoPage;
