import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

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
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-80">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 1"
              className="w-32 h-32 rounded-full mx-auto"
            />
            <h2 className="text-xl font-semibold text-center mt-4 text-primary dark:text-primary">
              Raj Budha
            </h2>
            <p className="text-gray-800 dark:text-gray-400 text-center mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-80">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 2"
              className="w-32 h-32 rounded-full mx-auto"
            />
            <h2 className="text-xl font-semibold text-center mt-4 text-primary dark:text-primary">
              Ritic Raj Byanjankar
            </h2>
            <p className="text-gray-800 dark:text-gray-400 text-center mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-80">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 3"
              className="w-32 h-32 rounded-full mx-auto"
            />
            <h2 className="text-xl font-semibold text-center mt-4 text-primary dark:text-primary">
              Ronil Maharjan
            </h2>
            <p className="text-gray-800 dark:text-gray-400 text-center mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutUsPage;
