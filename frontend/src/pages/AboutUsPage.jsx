import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import MemberCard from "../components/common/MemberCard";

function AboutUsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-10 bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary dark:text-primary">
          About Us
        </h1>

        {/* Introduction Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <p className="text-gray-800 dark:text-gray-400 text-lg">
            Welcome to our simple game recommendation system! We aim to help
            gamers discover amazing titles. Whether you love action-packed
            adventures, strategy games, or indie gems, our system is designed to
            guide you to your next favorite game.
          </p>
          <p className="text-gray-800 dark:text-gray-400 text-lg mt-4">
            Built with love for gamers by gamers, our platform provides
            personalized recommendations based on your previously played games.
          </p>
        </div>

        {/* Team Cards Section */}
        <h1 className="text-4xl font-bold text-center mb-8 text-primary dark:text-primary">
          Our Team
        </h1>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
          <MemberCard
            image={"/Raj Budha.jpg"}
            name={"Raj Budha"}
            description={"Student at Academia International College"}
          />
          <MemberCard
            image={"/Ritic Raj Byanjankar.jpg"}
            name={"Ritic Raj Byanjankar"}
            description={"Student at Academia International College"}
          />
          <MemberCard
            image={"/Ronil Maharjan.jpg"}
            name={"Ronil Maharjan"}
            description={"Student at Academia International College"}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutUsPage;
