import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { RecommendationProvider } from "./Context/RecommendationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RecommendationProvider>
        <App />
      </RecommendationProvider>
    </AuthProvider>
  </StrictMode>
);
