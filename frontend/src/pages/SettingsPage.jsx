import React from "react";
import { Outlet } from "react-router-dom";
import SettingsNav from "../components/common/SettingsNav";

function SettingsPage() {
  return (
    <div className="dark:text-white">
      <div className="lg:mx-36 md:mx-24 mx-4 text-3xl font-bold flex items-center py-2">Settings</div>
      <SettingsNav/>
      <div className="lg:mx-36 md:mx-24 mx-4 p-5 border-2 border-primary rounded-b-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsPage;
