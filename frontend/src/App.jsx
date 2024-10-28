import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PublicRoute from "./routes/PublicRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./routes/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";
import EditProfile from "./components/profile/EditProfile";
import UpdateGamesForm from "./components/profile/UpdateGamesForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path=":userId" element={<PublicProfilePage />} />
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/settings" element={<PrivateRoute />}>
          <Route element={<ProfilePage />}>
            <Route index element={<EditProfile />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="games" element={<UpdateGamesForm />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
