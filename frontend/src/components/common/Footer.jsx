import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Footer() {
  const { user } = useAuth();
  return (
    <footer className="dark:bg-gray-800 bg-gray-300 dark:text-white text-black py-6 mt-10 min-h-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-lg font-semibold">GRS</h2>
            <p className="text-gray-400">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Center Section */}
          <div className="mb-6 md:mb-0">
            <ul className="flex flex-wrap justify-center md:justify-start space-x-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Settings
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link
                    to="/settings/profile"
                    className="text-gray-400 hover:text-white"
                  >
                    Profile
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex justify-center md:justify-end space-x-4"></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
