import React, { createContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  fetchUser as apiFetchUser,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: to handle error messages
  const [sessionError, setSessionError] = useState(null);

  // Login user
  const login = async (formData) => {
    setLoading(true);
    try {
      const res = await apiLogin(formData);
      setUser(res.data.user); // Set the user after successful login
      localStorage.setItem("userStatus", true);
      setIsAuthChecked(true);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout(); // Call logout API
      setUser(null); // Reset user state after logout
      localStorage.removeItem("userStatus"); // Remove user status from local storage
      setIsAuthChecked(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.error("Logout failed", error);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  // Fetch user data (to keep session active)
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await apiFetchUser(); // Call user API
      if (res.data) {
        console.log(res.data);
        setUser(res.data);
        localStorage.setItem("userStatus", true);
        setIsAuthChecked(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // If 401 (Unauthorized), try refreshing the token

        await refreshAccessToken();
      } else {
        setSessionError("Unable to authenticate");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      await apiRefreshToken(); // Call the backend to refresh the access token
      await getUser(); // Set the user data after a successful refresh
    } catch (error) {
      setError("Session expired, please log in again");
    }
  };

  useEffect(() => {
    setLoading(true);
    const storedUserStatus = localStorage.getItem("userStatus");

    const fetchUser = async () => {
      await getUser();
    };

    if (storedUserStatus) {
      setIsAuthChecked(storedUserStatus); // Set token if found in localStorage
    }
    if (!user) {
      fetchUser(); // Fetch user data on initial render or when user changes
    }
    const theme = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", theme);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthChecked,
        getUser,
        login,
        logout,
        loading,
        error,
        sessionError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
