import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";

function PublicRoute() {

  return <Outlet />;
}

export default PublicRoute;
