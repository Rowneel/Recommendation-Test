import { React, useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { logout, isAuthChecked,user,sessionError } = useAuth();
  const [isOpen, SetIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    SetIsOpen(!isOpen);
  };
  console.log(user);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        SetIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuClick = (event) => {
    // Close menu on any child click (event delegation)
    SetIsOpen(false);
  };

  const handleLogout = (event) => {
    logout();
    navigate("/");
  };

  return (
    <nav className=" sticky top-0 flex justify-between items-center h-20 sm:px-16 px-8 bg-background z-20 dark:text-white">
      <div className="relative w-full lg:w-auto flex justify-between">
        <div className="pr-5 text-4xl">
          <Link to={"/"}>App Name</Link>
        </div>
        <button className="lg:hidden" onClick={toggleMenu}>
          {/* Menu icon toggles between hamburger and close */}
          {isOpen ? <IoMdClose /> : <GiHamburgerMenu />}
        </button>
      </div>
      <div className="hidden lg:block">
        <ul className="flex gap-8 whitespace-nowrap items-center ">
          <li className="hover:text-accent font-bold text-xl">
            <Link to={"/"}>HOME</Link>
          </li>
          <li className="hover:text-accent font-bold text-xl">
            <Link to={"/about-us"}>ABOUT US</Link>
          </li>
          {isAuthChecked && !sessionError ? (
            <div className="relative group">
              <button className="bg-gray-800 border-2 border-primary text-black p-3 rounded-full hover:opacity-50">
                <img src="/vite.svg" width={20} height={20} alt="" />
              </button>

              <ul className="absolute right-0 bg-gray-800 border-2 border-primary rounded-lg shadow-lg z-50 invisible group-hover:visible">
                <li className="hover:bg-accent rounded-t-lg hover:text-text">
                  <Link to={`/profile/${user?.pk}`} className="block px-4 py-2">
                    My Profile
                  </Link>
                </li>
                <li className="hover:bg-accent">
                  <Link
                    to="/settings/profile"
                    className="block px-4 py-2 hover:text-text"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-accent hover:text-text rounded-b-lg"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div
        ref={menuRef}
        className={`absolute top-16 left-0 w-full  dark:bg-background dark:text-white text-black transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <ul
          className="flex whitespace-nowrap flex-col items-center font-extrabold"
          onClick={handleMenuClick}
        >
          <li className="w-full text-center">
            <Link
              to={"/"}
              className="block w-full  py-4  hover:bg-accent hover:text-text hover:transform border-t-[2px] hover:border-accent border-accent"
            >
              Home
            </Link>
          </li>
          <li className="w-full text-center">
            <Link
              to={"/about-us"}
              className="block w-full  py-4  hover:bg-accent hover:text-text"
            >
              About Us
            </Link>
          </li>
          {isAuthChecked && !sessionError ? (
            <>
              <li className="w-full text-center">
                <Link
                  to={`/profile/${user?.pk}`}
                  className="block w-full  py-4  hover:bg-accent hover:text-text"
                >
                  My Profile
                </Link>
              </li>

              <li className="w-full text-center">
                <Link
                  to="/settings/profile"
                  className="block w-full  py-4  hover:bg-accent hover:text-text"
                >
                  Settings
                </Link>
              </li>
              <li className="w-full text-center">
                <button
                  onClick={handleLogout}
                  className="block w-full  py-4  hover:bg-accent hover:text-text"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="w-full text-center">
                <Link
                  to="/login"
                  className="block w-full  py-4  hover:bg-accent hover:text-text"
                >
                  Login
                </Link>
              </li>
              <li className="w-full text-center">
                <Link
                  to="/signup"
                  className="block w-full  py-4  hover:bg-accent hover:text-text"
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
