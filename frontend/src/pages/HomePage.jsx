import React from "react";
import Navbar from "../components/common/Navbar";
import GameRecommendations from "../components/GameRecommendations";
import GameRecommendationsForm from "../components/GameRecommendationsForm";
import Footer from "../components/common/Footer";

function HomePage() {
 
  return (
    <div className="dark:bg-background bg-white">
      <Navbar />
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="text-center sm:text-6xl text-3xl text-primary sm:my-10 my-5">Your Next Favorite Game Awaits!</h1>
        <GameRecommendationsForm/>
      </div>
      <GameRecommendations />
      <Footer/>
    </div>
  );
}

export default HomePage;
