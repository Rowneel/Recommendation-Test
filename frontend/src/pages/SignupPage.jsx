import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register as apiRegister } from "../services/authService";

function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    if(password !== confirmPassword){
      setError("Passwords do not match.");
      return;
    }
    const formData = {
      username: username,
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
    };

    try {
      const res = await apiRegister(formData);
      if (res.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      // Handle error from login (e.g., incorrect credentials)
      setError(err.response.data.error);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-background dark:text-white">
      <div className="w-full sm:max-w-lg sm:mx-auto p-8 mx-4 bg-background rounded-lg border-2 border-primary">
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary">Sign Up</h2>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}
        

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium ">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 mt-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between gap-2">
            <div className="mb-4 w-1/2">
              <label htmlFor="firstname" className="block text-sm font-medium ">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                className="w-full p-3 mt-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 w-1/2">
              <label htmlFor="lastname" className="block text-sm font-medium ">
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                className="w-full p-3 mt-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter Lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium ">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 mt-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-6">
            <label htmlFor="password" className="block text-sm font-mediu">
              Password
            </label>
            <input
              type={`${showPassword ? "text" : "password"}`}
              id="password"
              className="w-full p-3 mt-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-11 top-11 cursor-pointer text-primary hover:text-accent"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <FaEye className="text-accent" size={20} />
              ) : (
                <FaEyeSlash size={20} />
              )}
            </span>
          </div>

          <div className="relative mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-mediu">
              Confirm Password
            </label>
            <input
              type={`${showConfirmPassword ? "text" : "password"}`}
              id="confirmPassword"
              className="w-full p-3 mt-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-11 top-11 cursor-pointer text-primary hover:text-accent"
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? (
                <FaEye className="text-accent" size={20} />
              ) : (
                <FaEyeSlash size={20} />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-text font-semibold rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Already have an account?{" "}
            <Link to={"/login"} className="text-primary hover:text-accent">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
