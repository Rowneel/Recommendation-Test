import React from "react";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

function ProfilePage() {
  return (
    <div>
      ProfilePage
      <Outlet/>
    </div>
  );
}

export default ProfilePage;
