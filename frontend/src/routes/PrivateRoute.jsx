import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";

function PrivateRoute() {
  const { isAuthChecked, getUser, loading } = useAuth();
  console.log(loading);
  if (loading) {
    return <div className="dark:text-white flex h-screen w-full justify-center items-center bg-background">Loading...</div>;
  }


  return isAuthChecked && !loading ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default PrivateRoute;
