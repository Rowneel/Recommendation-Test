import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  apiFetchLibrary,
  apiDeleteLibrary,
} from "../../services/libraryService"; // Adjust the import paths as needed
import { MdDeleteForever } from "react-icons/md";

const Library = () => {
  const [userLibrary, setUserLibrary] = useState([]); // State to hold the user's current library

  const fetchUserLibrary = async () => {
    try {
      const response = await apiFetchLibrary(); // Fetch the user's current library
      setUserLibrary(response.data.map((item) => item.app_id) || []); // Assuming the response data contains the library games
    } catch (error) {
      if (error?.response?.data?.error === "User's library is empty.") {
        setUserLibrary([]);
      } else {
        console.error("Error fetching library", error);
      }
    }
  };

  // Fetch the library when the component mounts
  useEffect(() => {
    fetchUserLibrary();
  }, []);

  return (
    <div>
      <div className="text-[20px] font-bold dark:text-white text-black">Your Library:</div>
      <div className="mt-2">
        {userLibrary.length === 0 ? (
          <p>No games in your library yet.</p>
        ) : (
          <ul className="flex gap-3">
            {userLibrary.map((game, index) => (
              <li
                key={index}
                className="flex items-center justify-between mt-2 dark:bg-gray-700 bg-gray-200 text-black dark:text-white rounded-md"
              >
                <Link to={`/game/${game}`} className="h-full hover:shadow-lg">
                  <img
                    src={`https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game}/header.jpg`}
                    className="w-44 h-24 rounded-md object-cover"
                    alt={`Game ${game}`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Library;
