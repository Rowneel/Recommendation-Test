import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";

function PrivateRoute() {
  const { token, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default PrivateRoute;
