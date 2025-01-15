import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import useAuth from "../hooks/useAuth";

function PublicProfilePage() {
  const { userId } = useParams();
  const {user} = useAuth();
  return (
    <div>
      <Navbar />
      <div className="md:max-w-5xl mx-auto">
        {console.log(user)}
        <div>
          <img src={`http://127.0.0.1:8000/${user.avatar}`} className="rounded-full w-56" alt="profile_avatar" />
        </div>
      </div>
    </div>
  );
}

export default PublicProfilePage;
