import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  //handle login
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(""); // Reset error state before validation
    // Check if either email/username or password is empty
    if (!input || !password) {
      setFormError("Both fields are required!");
      return;
    }

    // Determine if the input is a valid email or username
    let loginData = {};

    if (isValidEmail(input)) {
      // If it's a valid email, send email in the request body
      loginData = { email: input, password: password };
    } else {
      // Otherwise, treat it as a username
      loginData = { username: input, password: password };
    }

    login(loginData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background dark:text-white">
      <div className="w-full max-w-sm p-8 bg-background rounded-lg border-2 border-primary">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}
        {formError && (
          <div className="text-red-500 text-sm text-center mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="input" className="block text-sm font-medium ">
              Username or Email
            </label>
            <input
              type="text"
              id="input"
              className="w-full p-3 mt-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your username or email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
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

          <button
            type="submit"
            className="w-full py-2 bg-primary text-text font-semibold rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-primary hover:text-accent">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
