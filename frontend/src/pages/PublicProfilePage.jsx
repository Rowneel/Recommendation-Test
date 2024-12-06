import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";

function PublicProfilePage() {
  const { userId } = useParams();
  return (
    <div>
      <Navbar />
      <div className="dark:text-white">This is Profile Page of {userId}</div>
    </div>
  );
}

export default PublicProfilePage;
