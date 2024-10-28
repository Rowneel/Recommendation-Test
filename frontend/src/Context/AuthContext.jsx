import React, { createContext, useState, useEffect } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken); // Set token if found in localStorage
      setUser(storedUser);
    } else {
      // login(); and get token and user
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    {
      /**
       * Logs in a user using their email and password.
       *
       * This function calls the email login API and, if successful, stores a temporary token,
       * user profile, and marks the login provider as "email".
       *
       * @param {string} email - The user's email address.
       * @param {string} password - The user's password.
       *
       * @returns {Promise<void>} - A promise that resolves when the login process is complete.
       *
       * @throws {Error} - Throws an error if the login attempt fails. The error message can
       * be accessed via `error.response?.data?.message` or `error.message`.
       */
    }
    try {
      // const data = await apiLogin(email, password); // Call email login API
      let token = "tempToken";
      let user = "tempUser"
      setToken(token); // for now this as no token is returned by api
      setUser(user)
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
    } catch (error) {
      console.error(
        "login failed",
        error.response?.data?.message || error.message
      );
    }
  };

  const logout = async () => {
    {
      /**
       * Logs out the user by clearing the user data, token, and provider information.
       *
       * This function resets the user state and token, removes the token from localStorage,
       * and clears the login provider (if any).
       *
       * @returns {void} - No return value. The function only performs side effects to log out the user.
       */
    }
    // await apiLogout();
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
