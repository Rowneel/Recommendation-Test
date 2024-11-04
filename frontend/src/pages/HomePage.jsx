import React from "react";
import Navbar from "../components/common/Navbar";
import GameRecommendations from "../components/GameRecommendations";
import GameRecommendationsForm from "../components/GameRecommendationsForm";

function HomePage() {
 
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center dark:text-white">
        <h1 className="text-center sm:text-6xl text-3xl text-primary sm:my-10 my-5">Your Next Favorite Game Awaits!</h1>
        <GameRecommendationsForm/>
      </div>
      <GameRecommendations />
    </div>
  );
}

export default HomePage;
