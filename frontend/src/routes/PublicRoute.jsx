import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";

function PublicRoute() {
  const { loading  } = useAuth();

  if (loading) return <div>Loading...</div>;
  return <Outlet />;
}

export default PublicRoute;
