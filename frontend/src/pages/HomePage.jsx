import React from "react";
import Navbar from "../components/common/Navbar";
import GameRecommendations from "../components/GameRecommendations";
import GameRecommendationsForm from "../components/GameRecommendationsForm";

function HomePage() {
 
  return (
    <div>
      <Navbar />
      <h1 className="text-3xl text-center">Welcome to our Home Page</h1>
      <GameRecommendationsForm/>
      <GameRecommendations/>
    </div>
  );
}

export default HomePage;
