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
import PublicProfilePage from "./pages/PublicProfilePage";
import EditProfile from "./components/profile/EditProfile";
import UpdateGamesForm from "./components/profile/UpdateGamesForm";
import SettingsPage from "./pages/SettingsPage";
import MiscellaneousSetting from "./components/profile/MiscellaneousSetting";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { RecommendationProvider } from "./Context/RecommendationContext.jsx";
import GameInfoPage from "./pages/GameInfoPage.jsx";
import PersonalRecommendations from "./pages/PersonalRecommendations.jsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <AuthProvider>
        <RecommendationProvider>
          <Routes>
            <Route path="/" element={<PublicRoute />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="/profile/:userId" element={<PublicProfilePage />} />
              <Route path="game/:gameId" element={<GameInfoPage />} />
              <Route index element={<HomePage />} />
            </Route>

            <Route path="/settings" element={<PrivateRoute />}>
              <Route element={<SettingsPage />}>
                <Route index element={<EditProfile />} />
                <Route path="profile" element={<EditProfile />} />
                <Route path="games" element={<UpdateGamesForm />} />
                <Route path="misc" element={<MiscellaneousSetting />} />
              </Route>
            </Route>
            <Route path="/personalrecommendation" element={<PrivateRoute />}>
              <Route index element={<PersonalRecommendations />} />
            </Route>
          </Routes>
        </RecommendationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
